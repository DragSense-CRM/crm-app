import { WorkspaceBaseEntity } from "@/modules/v1/workspaces/entities/base-workspace.entity";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";



export class ProjDynamicEntityQueryDto extends WorkspaceBaseEntity {
    @ApiPropertyOptional({ example: 1, description: 'ID of the entity' })
    @ValidateIf((o) => !o.dynamicEntityName)
    @IsNotEmpty()
    @IsNumber()
    projDynamicEntityId?: number;
}


