import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from '@/shared-dto/pagination.dto';
import { DepResource } from '../entities/dep-resource.entity';



export class DepResourcePaginatedDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [DepResource] })
  @Type(() => DepResource)
  data: DepResource[];
}