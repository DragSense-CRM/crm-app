import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";
import { WorkspaceBaseQueryDto } from "../../../dto/workspace-query.dto";



export class DepDynamicEntityQueryDto extends WorkspaceBaseQueryDto {
    @ApiPropertyOptional({ example: 1, description: 'ID of the entity' })
    @ValidateIf((o) => !o.dynamicEntityName)
    @IsNotEmpty()
    @IsNumber()
    depDynamicEntityId?: number;

   
}


