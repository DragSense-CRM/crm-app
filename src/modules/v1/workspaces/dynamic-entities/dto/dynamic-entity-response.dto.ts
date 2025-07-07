import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from '@/shared-dto/pagination.dto';

import { DynamicEntity } from '../entities/dynamic-entity.entity';


export class DynamicEntityPaginatedDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [DynamicEntity] })
  @Type(() => DynamicEntity)
  data: DynamicEntity[];
}