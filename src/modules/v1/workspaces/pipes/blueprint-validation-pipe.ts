import {
  PipeTransform, Injectable, ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { BlueprintsService } from '../blueprints/blueprints.service';

@Injectable()
export class BlueprintValidationPipe implements PipeTransform {
  constructor(private blueprintsService: BlueprintsService) { }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    const { blueprintId, values, relationships } = value;

    if (!blueprintId) {
      return value;
    }

    const errors = await this.blueprintsService.validateBlueprint(
      { blueprintId, values, relationships }
    );


    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({
        message: 'Blueprint Validation failed',
        errors,
        error: 'Bad Request',
        statusCode: 400
      });
    }

    return value;
  }
}