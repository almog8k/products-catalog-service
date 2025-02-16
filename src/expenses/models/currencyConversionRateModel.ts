import { logger } from "../../common/logger/logger-wrapper";
import * as conversionRateRepository from "../../DAL/repositories/conversionRatesUSDRepository";
import * as config from "../../common/configuration/configuration-provider";
import * as util from "../../common/utils/util";
import cron from "node-cron";

import {
  ExchangeRateResponse,
  exchangeRateResponseSchema,
} from "../schemas/exchangeRateSchema";
import { ConversionRatesUSDEntity } from "../../DAL/entity/ConversionRatesByUSDEntity";
import axios from "axios";

export async function updateExchangeRatesIfNeeded(): Promise<number> {
  const EXCHANGE_RATE_API_URL = config.getValue<string>(
    "externalServices.conversionRates.url"
  );
  const repo = await conversionRateRepository.getRepository();
  const lastTimeUpdated = await repo.getLastTimeUpdated();

  if (await !isUpdatedNeeded(lastTimeUpdated)) {
    logger.debug({
      msg: "Exchange rates are up to date",
      metadata: { lastTimeUpdated },
    });
    return 0;
  }

  const exchangeRatesResponse = await fetchExchangeRates(EXCHANGE_RATE_API_URL);

  const newRates = transformRatesToEntities(
    exchangeRatesResponse.conversion_rates
  );

  await repo.updateConversionRatesUSD(newRates);
  logger.info({ msg: "Exchange rates updated" });

  return newRates.length;
}

// Schedule the task to run at a specific time every day, e.g., at midnight
const updateAtMidnight = "0 0 * * *";
const updateEveryMinute = "40 21 * * *";
cron.schedule(updateEveryMinute, () => {
  updateExchangeRatesIfNeeded().catch((err) =>
    logger.error({
      msg: "Error updating exchange rates",
      err,
      logContext: {
        fileName: __filename,
        className: "CurrencyConversionRateModel",
        functionName: "cron.schedule=>updateExchangeRatesIfNeeded",
      },
    })
  );
});

async function isUpdatedNeeded(
  lastTimeUpdated: Date | undefined
): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !lastTimeUpdated || lastTimeUpdated < today;
}

async function fetchExchangeRates(url: string): Promise<ExchangeRateResponse> {
  try {
    const response = await axios.get(url);
    logger.debug({
      msg: "Exchange rates fetched",
      metadata: { fetchedUrl: url, status: response.status },
    });

    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    const validExchangeRates = util.typeValidator(
      response.data,
      exchangeRateResponseSchema
    );
    logger.debug({
      msg: "Exchange rates valid",
      metadata: {
        lastUpdatedAt: validExchangeRates.time_last_update_utc,
        nextUpdateAt: validExchangeRates.time_next_update_utc,
      },
    });

    if (validExchangeRates.result !== "success") {
      throw new Error(
        `Unexpected response result: ${validExchangeRates.result}`
      );
    }

    return validExchangeRates;
  } catch (error) {
    logger.error({ msg: "Error fetching exchange rates", metadata: { error } });
    throw error;
  }
}

function transformRatesToEntities(
  rates: Record<string, number>
): ConversionRatesUSDEntity[] {
  return Object.entries(rates).map(([currency, rate]) => {
    const conversionRate = new ConversionRatesUSDEntity();
    conversionRate.currency = currency.toUpperCase();
    conversionRate.rate = rate;

    return conversionRate;
  });
}
