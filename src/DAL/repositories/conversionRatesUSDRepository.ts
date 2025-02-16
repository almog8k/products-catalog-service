import * as dataManager from "../connectionManager";

import { logger } from "../../common/logger/logger-wrapper";
import { DataSource, Repository } from "typeorm";

import { SubCategoryEntity } from "../entity/subCategory";
import { ConversionRatesUSDEntity } from "../entity/ConversionRatesByUSDEntity";
import { ResourceNotFoundError } from "../../common/errors/error-types";

export class ConversionRatesUSDRepository extends Repository<ConversionRatesUSDEntity> {
  constructor(private dataSource: DataSource) {
    super(ConversionRatesUSDEntity, dataSource.createEntityManager());
  }

  public async getConversionRatesUSD(): Promise<ConversionRatesUSDEntity[]> {
    logger.debug({ msg: "Getting all conversion rates USD" });
    const conversionRatesUSD = await this.find();
    logger.debug({
      msg: "Conversion rates USD found",
      metadata: { conversionRatesUSD },
    });
    return conversionRatesUSD;
  }

  public async getLastTimeUpdated(): Promise<Date | undefined> {
    logger.debug({ msg: "Getting last time updated" });
    const lastTimeUpdated = await this.createQueryBuilder()
      .orderBy("updated_at", "DESC")
      .getOne();
    logger.debug({
      msg: "Last time updated found",
      metadata: { updatedAt: lastTimeUpdated?.updatedAt },
    });

    return lastTimeUpdated?.updatedAt;
  }

  public async updateConversionRatesUSD1(
    newConversionRate: ConversionRatesUSDEntity[]
  ): Promise<void> {
    const result = await this.upsert(newConversionRate, {
      conflictPaths: ["currency"],
      upsertType: "on-conflict-do-update",
    });

    logger.debug({
      msg: "conversion_rates_usd Table updated",
    });
  }

  public async updateConversionRatesUSD(
    newConversionRate: ConversionRatesUSDEntity[]
  ): Promise<void> {
    const result = await this.createQueryBuilder()
      .insert()
      .into(ConversionRatesUSDEntity)
      .values(newConversionRate)
      .orIgnore("created_at")
      .orUpdate({
        conflict_target: ["currency"],
        overwrite: ["rate", "updated_at"],
      })
      .execute();

    logger.debug({
      msg: "conversion_rates_usd Table updated",
    });
  }

  public async getExchangeRateByCurrency(
    targetCurrency: string
  ): Promise<number> {
    logger.debug({ msg: "Getting exchange rate by currency" });
    const exchangeRateEntity = await this.findOne({
      where: { currency: targetCurrency },
    });

    if (!exchangeRateEntity) {
      throw new ResourceNotFoundError(
        `Conversion rate for currency ${targetCurrency} not found`
      );
    }

    logger.debug({
      msg: "Exchange rate found",
      metadata: { exchangeRate: exchangeRateEntity?.rate },
    });

    return exchangeRateEntity.rate;
  }
}

export const getRepository =
  async (): Promise<ConversionRatesUSDRepository> => {
    const dataSource = await dataManager.getDataSource();
    return new ConversionRatesUSDRepository(dataSource);
  };
