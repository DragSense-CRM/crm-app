
import { JoinColumn, ManyToOne } from 'typeorm';

import { GeneralBaseEntity } from '@/base-entity/base.entity';
import { Project } from './project.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BlueprintBaseEntity } from '../../../blueprints/entities/base-blueprint.entity';


export abstract class ProjectBaseEntity extends GeneralBaseEntity {
    @ApiProperty({ type: () => Project, description: 'Parent project' })
    @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
    @JoinColumn()
    project: Project;
}


export abstract class ProjectWithBlueprintEntity extends BlueprintBaseEntity {

    @ApiProperty({ type: () => Project, description: 'Parent project' })
    @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
    @JoinColumn()
    project: Project;
}