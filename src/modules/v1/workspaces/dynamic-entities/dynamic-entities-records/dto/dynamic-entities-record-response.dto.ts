import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from '@/shared-dto/pagination.dto';


export class DynamicEntitiesRecordPaginatedDto extends PaginationMetaDto {
  @ApiProperty({
    description: 'Array of dynamic entity records',
    type: 'array',
    items: {
      type: 'object',
      additionalProperties: true,
    },
  })
  @Type(() => Object)
  data: any[];
}