// src/models/ApartmentModel.ts
import { container, inject, injectable } from "tsyringe";
import { DataSource, EntityNotFoundError, Repository } from "typeorm";
import { SERVICES } from "../../common/constants";
import { dataSource } from "../../DAL/connectionManager";
import { ApartmentEntity } from "../../DAL/entity/investments/apartments/apartmentEntity";
import { ResourceNotFoundError } from "../../common/errors/error-types";

export interface ApartmentSearchFilters {
  rooms?: number;
  building?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  minRent?: number;
  maxRent?: number;
  minYield?: number;
  maxYield?: number;
  minScore?: number;
  floor?: number;
  parkingSpots?: number;
  status?: string;
  isActive?: boolean;
}

export interface ApartmentSortOptions {
  sortBy?:
    | "price"
    | "area"
    | "apartmentScore"
    | "estimatedYieldAnnual"
    | "pricePerSqm"
    | "estimatedRentMonthly"
    | "createdAt";
  sortOrder?: "ASC" | "DESC";
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

@injectable()
export class ApartmentModel {
  private apartmentRepository: Repository<ApartmentEntity>;

  constructor() {
    const dataSource = container.resolve<DataSource>(SERVICES.DATA_SOURCE);
    this.apartmentRepository = dataSource.getRepository(ApartmentEntity);
  }

  /**
   * Get all apartments with optional filtering, sorting, and pagination
   */
  async getAllApartments(
    filters: ApartmentSearchFilters = {},
    sort: ApartmentSortOptions = {},
    pagination: PaginationOptions = {}
  ): Promise<{
    apartments: ApartmentEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryBuilder =
      this.apartmentRepository.createQueryBuilder("apartments");

    // Apply filters
    this.applyFilters(queryBuilder, filters);

    // Count total before pagination
    const total = await queryBuilder.getCount();

    // Apply sorting
    this.applySorting(queryBuilder, sort);

    // Apply pagination
    const { page = 1, limit = 80 } = pagination;
    const offset = (page - 1) * limit;
    queryBuilder.offset(offset).limit(limit);

    // Execute query
    const apartments = await queryBuilder.getMany();

    return {
      apartments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get apartment by ID
   */
  async getApartmentById(id: string): Promise<ApartmentEntity | null> {
    return await this.apartmentRepository.findOne({
      where: { id, isActive: true },
    });
  }

  /**
   * Get apartments by building
   */
  async getApartmentsByBuilding(building: string): Promise<ApartmentEntity[]> {
    return await this.apartmentRepository.find({
      where: { building, isActive: true },
      order: { floor: "ASC", apartmentNum: "ASC" },
    });
  }

  /**
   * Get top ranked apartments
   */
  async getTopRankedApartments(limit: number = 10): Promise<ApartmentEntity[]> {
    return await this.apartmentRepository.find({
      where: { isActive: true },
      order: { apartmentScore: "DESC" },
      take: limit,
    });
  }

  /**
   * Get best yield apartments
   */
  async getBestYieldApartments(limit: number = 10): Promise<ApartmentEntity[]> {
    return await this.apartmentRepository
      .createQueryBuilder("apartment")
      .where("apartment.isActive = :isActive", { isActive: true })
      .andWhere("apartment.estimatedYieldAnnual IS NOT NULL")
      .orderBy("apartment.estimatedYieldAnnual", "DESC")
      .limit(limit)
      .getMany();
  }

  /**
   * Get apartment statistics
   */
  async getApartmentStatistics(): Promise<{
    totalApartments: number;
    averagePrice: number;
    averageRent: number;
    averageYield: number;
    averageScore: number;
    priceRange: { min: number; max: number };
    rentRange: { min: number; max: number };
    buildingDistribution: { building: string; count: number }[];
    roomDistribution: { rooms: number; count: number }[];
  }> {
    // Basic statistics
    const stats = await this.apartmentRepository
      .createQueryBuilder("apartment")
      .select([
        'COUNT(*) as "totalApartments"',
        'AVG(apartment.price) as "averagePrice"',
        'AVG(apartment.estimatedRentMonthly) as "averageRent"',
        'AVG(apartment.estimatedYieldAnnual) as "averageYield"',
        'AVG(apartment.apartmentScore) as "averageScore"',
        'MIN(apartment.price) as "minPrice"',
        'MAX(apartment.price) as "maxPrice"',
        'MIN(apartment.estimatedRentMonthly) as "minRent"',
        'MAX(apartment.estimatedRentMonthly) as "maxRent"',
      ])
      .where("apartment.isActive = :isActive", { isActive: true })
      .getRawOne();

    // Building distribution
    const buildingDistribution = await this.apartmentRepository
      .createQueryBuilder("apartment")
      .select(["apartment.building as building", "COUNT(*) as count"])
      .where("apartment.isActive = :isActive", { isActive: true })
      .groupBy("apartment.building")
      .orderBy("count", "DESC")
      .getRawMany();

    // Room distribution
    const roomDistribution = await this.apartmentRepository
      .createQueryBuilder("apartment")
      .select(["apartment.rooms as rooms", "COUNT(*) as count"])
      .where("apartment.isActive = :isActive", { isActive: true })
      .groupBy("apartment.rooms")
      .orderBy("apartment.rooms", "ASC")
      .getRawMany();

    return {
      totalApartments: parseInt(stats.totalApartments),
      averagePrice: parseFloat(stats.averagePrice) || 0,
      averageRent: parseFloat(stats.averageRent) || 0,
      averageYield: parseFloat(stats.averageYield) || 0,
      averageScore: parseFloat(stats.averageScore) || 0,
      priceRange: {
        min: parseFloat(stats.minPrice) || 0,
        max: parseFloat(stats.maxPrice) || 0,
      },
      rentRange: {
        min: parseFloat(stats.minRent) || 0,
        max: parseFloat(stats.maxRent) || 0,
      },
      buildingDistribution: buildingDistribution.map((item) => ({
        building: item.building,
        count: parseInt(item.count),
      })),
      roomDistribution: roomDistribution.map((item) => ({
        rooms: parseInt(item.rooms),
        count: parseInt(item.count),
      })),
    };
  }

  /**
   * Apply filters to query builder
   */
  private applyFilters(
    queryBuilder: any,
    filters: ApartmentSearchFilters
  ): void {
    // Default filter - only active apartments
    queryBuilder.where("apartments.isActive = :isActive", {
      isActive: filters.isActive ?? true,
    });

    if (filters.rooms) {
      queryBuilder.andWhere("apartments.rooms = :rooms", {
        rooms: filters.rooms,
      });
    }

    if (filters.building) {
      queryBuilder.andWhere("apartments.building = :building", {
        building: filters.building,
      });
    }

    if (filters.minPrice) {
      queryBuilder.andWhere("apartments.price >= :minPrice", {
        minPrice: filters.minPrice,
      });
    }

    if (filters.maxPrice) {
      queryBuilder.andWhere("apartments.price <= :maxPrice", {
        maxPrice: filters.maxPrice,
      });
    }

    if (filters.minArea) {
      queryBuilder.andWhere("apartments.area >= :minArea", {
        minArea: filters.minArea,
      });
    }

    if (filters.maxArea) {
      queryBuilder.andWhere("apartments.area <= :maxArea", {
        maxArea: filters.maxArea,
      });
    }

    if (filters.minRent) {
      queryBuilder.andWhere("apartments.estimatedRentMonthly >= :minRent", {
        minRent: filters.minRent,
      });
    }

    if (filters.maxRent) {
      queryBuilder.andWhere("apartments.estimatedRentMonthly <= :maxRent", {
        maxRent: filters.maxRent,
      });
    }

    if (filters.minYield) {
      queryBuilder.andWhere("apartments.estimatedYieldAnnual >= :minYield", {
        minYield: filters.minYield,
      });
    }

    if (filters.maxYield) {
      queryBuilder.andWhere("apartments.estimatedYieldAnnual <= :maxYield", {
        maxYield: filters.maxYield,
      });
    }

    if (filters.minScore) {
      queryBuilder.andWhere("apartments.apartmentScore >= :minScore", {
        minScore: filters.minScore,
      });
    }

    if (filters.floor) {
      queryBuilder.andWhere("apartments.floor = :floor", {
        floor: filters.floor,
      });
    }

    if (filters.parkingSpots !== undefined) {
      queryBuilder.andWhere("apartments.parkingSpots = :parkingSpots", {
        parkingSpots: filters.parkingSpots,
      });
    }

    if (filters.status) {
      queryBuilder.andWhere("apartments.status = :status", {
        status: filters.status,
      });
    }
  }

  /**
   * Apply sorting to query builder
   */
  private applySorting(queryBuilder: any, sort: ApartmentSortOptions): void {
    const { sortBy = "createdAt", sortOrder = "DESC" } = sort;

    const validSortFields = [
      "price",
      "area",
      "apartmentScore",
      "estimatedYieldAnnual",
      "pricePerSqm",
      "estimatedRentMonthly",
      "createdAt",
      "rooms",
      "floor",
    ];

    if (validSortFields.includes(sortBy)) {
      queryBuilder.orderBy(`apartments.${sortBy}`, sortOrder);
    } else {
      // Default sorting
      queryBuilder.orderBy("apartments.createdAt", "DESC");
    }
  }

  /**
   * Update apartment with partial data and automatic calculations
   */
  async updateApartment(
    id: string,
    updateData: Partial<ApartmentEntity>
  ): Promise<ApartmentEntity> {
    const apartment = await this.getApartmentById(id);
    if (!apartment) {
      throw new ResourceNotFoundError(`Apartment with id ${id} not found`);
    }

    // Create update object with provided data
    const updatedFields: Partial<ApartmentEntity> = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Automatic calculations when rent or price is updated
    const newRent =
      updateData.estimatedRentMonthly ?? apartment.estimatedRentMonthly;
    const newPrice = updateData.price ?? apartment.price;
    const newArea = updateData.area ?? apartment.area;

    // Recalculate yield if rent or price changed
    if (updateData.estimatedRentMonthly || updateData.price) {
      if (newPrice && newPrice > 0) {
        updatedFields.estimatedYieldAnnual = ((newRent * 12) / newPrice) * 100;
      }
    }

    // Recalculate price per sqm if price or area changed
    if (updateData.price || updateData.area) {
      if (newArea && newArea > 0) {
        updatedFields.pricePerSqm = newPrice / newArea;
      }
    }

    await this.apartmentRepository.update(id, updatedFields);

    const updatedApartment = await this.getApartmentById(id);

    if (!updatedApartment) {
      throw new ResourceNotFoundError(
        `Apartment with id ${id} not found after update`
      );
    }
    return updatedApartment;
  }
}
