import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDepDynamicEntityDto } from './create-app-dynamic-entity.dto';

export class UpdateDepDynamicEntityDto extends PartialType(CreateDepDynamicEntityDto) { 

  


}