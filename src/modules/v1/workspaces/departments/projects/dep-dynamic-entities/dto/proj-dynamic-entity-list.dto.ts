import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";
import { WorkspaceBaseListDto } from "../../../dto/workspace-list.dto";


export class ProjDynamicEntityListDto extends WorkspaceBaseListDto {
    @ApiPropertyOptional({ example: 1, description: 'ID of the entity' })
    @ValidateIf((o) => !o.dynamicEntityName)
    @IsNotEmpty()
    @IsNumber()
    projDynamicEntityId?: number;
}