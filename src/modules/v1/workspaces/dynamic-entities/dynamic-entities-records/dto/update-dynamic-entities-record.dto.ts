import { PartialType } from '@nestjs/swagger';
import { CreateDynamicEntitiesRecordDto } from './create-dynamic-entities-record.dto';

export class UpdateDynamicEntitiesRecordDto extends PartialType(CreateDynamicEntitiesRecordDto) {}
