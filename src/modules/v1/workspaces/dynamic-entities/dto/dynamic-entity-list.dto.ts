import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { WorkspaceBaseListDto } from "../../dto/workspace-list.dto";
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";

export class DynamicEntityListDto extends WorkspaceBaseListDto {
}


export class DynamicEntityBaseListDto extends DynamicEntityListDto {
    @ApiPropertyOptional({ example: 1, description: 'ID of the entity' })
    @ValidateIf((o) => !o.dynamicEntityName)
    @IsNotEmpty()
    @IsNumber()
    dynamicEntityId?: number;

    @ApiPropertyOptional({ example: 'users', description: 'Name of the entity' })
    @ValidateIf((o) => !o.dynamicEntityId)
    @IsNotEmpty()
    @IsString()
    dynamicEntityName?: string;
}