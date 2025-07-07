import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Workspace } from '../entities/workspace.entity';
import { WSBlueprint } from './schemas/blueprint.schema';

import { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { MessageResponse } from '@/interfaces/general.interface';

import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';

import { BlueprintListDto } from './dto/blueprint-list.dto';

import { FieldsService } from './fields.service';
import { RelationshipsService } from './relationships.service';

import { ValidateBlueprintDto } from './dto/validate-blueprint.dto';



@Injectable()
export class BlueprintsService {
  constructor(
    @InjectModel(WSBlueprint.name)
    private blueprintModel: Model<WSBlueprint>,
    private readonly fieldsService: FieldsService,
    private readonly relationshipsService: RelationshipsService

  ) { }

  async create(workspace: Pick<Workspace, "id">, createBlueprintDto: CreateBlueprintDto):
    Promise<MessageResponse & { blueprint: WSBlueprint }> {
    const existing = await this.blueprintModel.findOne({
      name: createBlueprintDto.name,
      workspaceId: workspace.id
    }).exec();

    if (existing) {
      throw new BadRequestException('A blueprint with this name already exists.');
    }

    const blueprint = new this.blueprintModel({
      ...createBlueprintDto,
      workspaceId: workspace.id
    });
    const savedBlueprint = await blueprint.save();

    return { message: 'WSBlueprint created successfully.', blueprint: savedBlueprint };
  }

  async findAll(workspace: Pick<Workspace, "id">, queryDto: BlueprintListDto): Promise<PaginationResponse<WSBlueprint>> {
    const {
      page = 1,
      limit = 10,
      search,
      createdAfter,
      createdBefore,
      updatedAfter,
      updatedBefore,
      ...filters
    } = queryDto;

    const conditions: any = { workspaceId: workspace.id };

    if (search) {
      conditions.name = { $regex: search, $options: 'i' };
    }

    if (createdAfter || createdBefore) {
      conditions.createdAt = {};
      if (createdAfter) conditions.createdAt.$gte = new Date(createdAfter);
      if (createdBefore) conditions.createdAt.$lte = new Date(createdBefore);
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) conditions[key] = value;
    });


    const [data, total] = await Promise.all([
      this.blueprintModel.find(conditions)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.blueprintModel.countDocuments(conditions).exec()
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      lastPage,
      hasNextPage: page < lastPage,
      hasPrevPage: page > 1,
    };
  }

  async findOne(workspace: Pick<Workspace, "id">, id: string): Promise<WSBlueprint> {
    const blueprint = await this.blueprintModel.findOne({
      _id: id,
      workspaceId: workspace.id
    }).exec();

    if (!blueprint) {
      throw new NotFoundException('WSBlueprint not found.');
    }

    return blueprint;
  }


  async update(workspace: Pick<Workspace, "id">, id: string, updateBlueprintDto: UpdateBlueprintDto): Promise<MessageResponse> {


    if (updateBlueprintDto.name) {
      const existing = await this.blueprintModel.findOne({
        name: updateBlueprintDto.name,
        workspaceId: workspace.id,
        _id: { $ne: id },
      });

      if (existing) {
        throw new BadRequestException('A blueprint with this name already exists.');
      }
    }

    const result = await this.blueprintModel.updateOne(
      { _id: id, workspaceId: workspace.id },
      { $set: updateBlueprintDto }
    ).exec();

    if (result.matchedCount === 0) {
      throw new NotFoundException('WSBlueprint not found.');
    }
    return { message: 'WSBlueprint updated successfully.' };
  }

  async remove(workspace: Pick<Workspace, "id">, id: string): Promise<void> {
    const result = await this.blueprintModel.deleteOne({
      _id: id,
      workspaceId: workspace.id
    }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('WSBlueprint not found.');
    }
  }


  async validateBlueprint(
    validateBlueprintDto: ValidateBlueprintDto
  ): Promise<Record<string, string[]>> {
    const { blueprintId, values = [], relationships = [] } = validateBlueprintDto;
    const blueprint = await this.blueprintModel.findOne({
      _id: blueprintId,
    }).exec();

    if (!blueprint) {
      throw new NotFoundException('WSBlueprint not found.');
    }
    const errors: Record<string, string[]> = {};

    for (const fieldDef of blueprint.fields) {
      const fieldValue = values[fieldDef.key];
      const fieldErrors = await this.fieldsService.validateFieldValue(fieldDef, fieldValue);

      if (fieldErrors.length > 0) {
        errors[fieldDef.key] = fieldErrors;
      }
    }

    for (const rel of blueprint.relationships || []) {
      const inputRel = relationships.find(r => r.sourceField === rel.sourceField);
      if (!inputRel) {
        errors[rel.sourceField] = ['Missing relationship input'];
        continue;
      }

      const relErrors = await this.relationshipsService.validateRelationship(inputRel);
      if (relErrors.length > 0) {
        errors[rel.sourceField] = relErrors;
      }
    }

    return errors;
  }

}