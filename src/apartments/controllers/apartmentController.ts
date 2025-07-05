import { RequestHandler } from "express";

import { logger } from "../../common/logger/logger-wrapper";

import * as util from "../../common/utils/util";

import httpStatus from "http-status-codes";
import {
  Apartment,
  NewApartment,
  newApartmentSchema,
  UpdateApartment,
  updateApartmentSchema,
  ApartmentSearchQuery,
  apartmentSearchQuerySchema,
  ApartmentSchema,
} from "../schemas/apartmentSchema";
import { UUID, UUIDSchema } from "../../common/utils/sharedTypes";
import { inject, injectable } from "tsyringe";
import { ApartmentModel } from "../models/apartmentModel";

// Type definitions for request handlers
type CreateApartmentHandler = RequestHandler<void, Apartment, NewApartment>;
type GetApartmentsHandler = RequestHandler<void, Apartment[]>;
type GetApartmentHandler = RequestHandler<UUID, Apartment>;
type UpdateApartmentHandler = RequestHandler<UUID, Apartment, UpdateApartment>;
type DeleteApartmentHandler = RequestHandler<UUID, void>;
type SearchApartmentsHandler = RequestHandler<
  void,
  Apartment[],
  void,
  ApartmentSearchQuery
>;

@injectable()
export class ApartmentController {
  constructor(@inject(ApartmentModel) private apartmentModel: ApartmentModel) {}
  //   createApartment: CreateApartmentHandler = async (req, res, next) => {
  //     logger.info({
  //       msg: `creating new apartment`,
  //       metadata: { reqBody: req.body },
  //     });
  //     try {
  //       const apartmentToValidate = { ...req.body, ownerId: req.user.id };
  //       const newApartment: NewApartment = util.typeValidator(
  //         apartmentToValidate,
  //         newApartmentSchema
  //       );
  //       const apartment = await this.apartmentModel.(newApartment);
  //       return res.status(httpStatus.CREATED).json(apartment);
  //     } catch (error) {
  //       return next(error);
  //     }
  //   };

  getApartments: GetApartmentsHandler = async (req, res, next) => {
    logger.info({
      msg: `getting all apartments`,
    });
    try {
      const result = await this.apartmentModel.getAllApartments();
      const validApartments: Apartment[] = util.typeValidator(
        result.apartments,
        ApartmentSchema.array()
      );
      return res.status(httpStatus.OK).json(validApartments);
    } catch (error) {
      return next(error);
    }
  };

  getApartment: GetApartmentHandler = async (req, res, next) => {
    logger.info({
      msg: `getting apartment by id`,
      metadata: { id: req.params.id },
    });
    try {
      const validParams: UUID = util.typeValidator(req.params, UUIDSchema);
      const apartment = await this.apartmentModel.getApartmentById(
        validParams.id
      );
      const validApartment: Apartment = util.typeValidator(
        apartment,
        ApartmentSchema
      );
      return res.status(httpStatus.OK).json(validApartment);
    } catch (error) {
      return next(error);
    }
  };

  updateApartment: UpdateApartmentHandler = async (req, res, next) => {
    logger.info({
      msg: `updating apartment by id`,
      metadata: { id: req.params.id, reqBody: req.body },
    });
    try {
      const validParams: UUID = util.typeValidator(req.params, UUIDSchema);
      const validUpdateApartment: UpdateApartment = util.typeValidator(
        req.body,
        updateApartmentSchema
      );
      const updatedApartment = await this.apartmentModel.updateApartment(
        validParams.id,
        validUpdateApartment
      );

      const validUpdatedApartment: Apartment = util.typeValidator(
        updatedApartment,
        ApartmentSchema
      );

      return res.status(httpStatus.OK).json(validUpdatedApartment);
    } catch (error) {
      return next(error);
    }
  };

  // deleteApartment: DeleteApartmentHandler = async (req, res, next) => {
  //   logger.info({
  //     msg: `deleting apartment by id`,
  //     metadata: { id: req.params.id },
  //   });
  //   try {
  //     const validParams: UUID = util.typeValidator(req.params, UUIDSchema);
  //     await apartmentModel.deleteApartment(validParams.id);
  //     return res.status(httpStatus.NO_CONTENT).json();
  //   } catch (error) {
  //     return next(error);
  //   }
  // };

  // searchApartments: SearchApartmentsHandler = async (req, res, next) => {
  //   logger.info({
  //     msg: `searching apartments`,
  //     metadata: { query: req.query },
  //   });
  //   try {
  //     const validQuery: ApartmentSearchQuery = util.typeValidator(
  //       req.query,
  //       apartmentSearchQuerySchema
  //     );

  //     logger.debug({
  //       msg: "valid search query",
  //       metadata: { validQuery },
  //     });

  //     const apartments = await apartmentModel.searchApartments(
  //       req.user.id,
  //       validQuery
  //     );
  //     return res.status(httpStatus.OK).json(apartments);
  //   } catch (error) {
  //     return next(error);
  //   }
  // };
}
