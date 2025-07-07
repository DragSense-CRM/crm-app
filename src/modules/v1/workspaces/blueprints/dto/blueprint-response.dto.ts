import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from '@/shared-dto/pagination.dto';
import { WSBlueprint } from '../schemas/blueprint.schema';



export class BlueprintPaginatedDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [WSBlueprint] })
  @Type(() => WSBlueprint)
  data: WSBlueprint[];
}