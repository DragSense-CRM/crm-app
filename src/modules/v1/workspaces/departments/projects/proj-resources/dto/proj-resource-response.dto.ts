import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from '@/shared-dto/pagination.dto';
import { ProjResource } from '../entities/proj-resource.entity';



export class ProjResourcePaginatedDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [ProjResource] })
  @Type(() => ProjResource)
  data: ProjResource[];
}