import { PartialType } from '@nestjs/swagger';
import { CreateProjResourceDto } from './create-proj-resource.dto';

export class UpdateProjResourceDto extends PartialType(CreateProjResourceDto) {}
