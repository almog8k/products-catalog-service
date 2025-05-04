import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { container } from "tsyringe";
import { SERVICES } from "../constants";
import { SupabaseConfig } from "../configuration/types";
import { logger } from "../logger/logger-wrapper";

declare global {
  namespace Express {
    interface Request {
      user: User;
      supabaseClient: SupabaseClient;
    }
  }
}

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const supabaseClient = container.resolve<SupabaseClient>(SERVICES.SUPABASE);
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { data, error } = await supabaseClient.auth.getUser(token);
    if (error || !data.user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid or expired token" });
    }

    const { url, key } = container.resolve<SupabaseConfig>(
      SERVICES.SUPABASECONFIG
    );

    req.user = data.user;
    req.supabaseClient = createClient(url, key, {
      auth: {
        persistSession: false,
      },
    });

    await req.supabaseClient.auth.setSession({
      access_token: token,
      refresh_token: "",
    });

    next();
  } catch (error) {
    logger.error({
      msg: `Error authenticating user: ${error.message}`,
      err: error,
    });
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};
