import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";

import { WorkspaceBaseQueryDto } from "../../dto/workspace-query.dto";



export class DynamicEntityQueryDto extends WorkspaceBaseQueryDto {

}


export class DynamicEntityBaseQueryDto extends WorkspaceBaseQueryDto {
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


