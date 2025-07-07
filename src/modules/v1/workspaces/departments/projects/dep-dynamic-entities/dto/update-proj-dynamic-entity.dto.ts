import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProjDynamicEntityDto } from './create-proj-dynamic-entity.dto';

export class UpdateProjDynamicEntityDto extends PartialType(CreateProjDynamicEntityDto) { 

}