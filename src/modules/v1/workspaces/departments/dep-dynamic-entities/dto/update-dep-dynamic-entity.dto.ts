import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDepDynamicEntityDto } from './create-dep-dynamic-entity.dto';

export class UpdateDepDynamicEntityDto extends PartialType(CreateDepDynamicEntityDto) { 

  


}