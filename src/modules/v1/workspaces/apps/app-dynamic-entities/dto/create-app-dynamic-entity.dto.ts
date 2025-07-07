import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateNested, IsNumber, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDynamicEntityDto } from '../../../dynamic-entities/dto/create-dynamic-entity.dto';

export class CreateDepDynamicEntityDto {

    @ApiPropertyOptional({
        type: 'number',
        description: 'Existing dynamic entity ID to link (optional)',
        example: 4
    })
    @ValidateIf((o) => !o.newEntity)
    @IsNumber()
    @IsOptional()
    dynamicEntityId?: number;

    @ApiPropertyOptional({
        type: CreateDynamicEntityDto,
        description: 'New entity creation details (optional)',
    })
    @ValidateIf((o) => !o.dynamicEntityId)
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateDynamicEntityDto)
    newEntity?: CreateDynamicEntityDto;
}