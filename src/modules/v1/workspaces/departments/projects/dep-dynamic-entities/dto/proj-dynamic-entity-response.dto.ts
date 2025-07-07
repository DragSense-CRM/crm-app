import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from '@/shared-dto/pagination.dto';
import { ProjDynamicEntity } from '../entities/proj-dynamic-entity.entity';


export class ProjDynamicEntityPaginatedDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [ProjDynamicEntity] })
  @Type(() => ProjDynamicEntity)
  data: ProjDynamicEntity[];
}