import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from '@/shared-dto/pagination.dto';
import { DepDynamicEntity } from '../entities/app-dynamic-entity.entity';


export class DepDynamicEntityPaginatedDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [DepDynamicEntity] })
  @Type(() => DepDynamicEntity)
  data: DepDynamicEntity[];
}