import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDynamicEntityDto } from './create-dynamic-entity.dto';

export class UpdateDynamicEntityDto extends PartialType(
  OmitType(CreateDynamicEntityDto, ['name'] as const)
) {}