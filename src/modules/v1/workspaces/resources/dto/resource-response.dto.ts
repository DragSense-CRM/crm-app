import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from '@/shared-dto/pagination.dto';
import { Resource } from '../entities/resource.entity';



export class ResourcePaginatedDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [Resource] })
  @Type(() => Resource)
  data: Resource[];
}