import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from '@/shared-dto/pagination.dto';
import { App } from '../entities/app.entity';



export class AppPaginatedDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [App] })
  @Type(() => App)
  data: App[];
}