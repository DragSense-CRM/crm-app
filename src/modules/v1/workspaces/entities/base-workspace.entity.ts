
import { GeneralBaseEntity } from '@/base-entity/base.entity';

import { Workspace } from './workspace.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlueprintBaseEntity } from '../blueprints/entities/base-blueprint.entity';



export abstract class WorkspaceBaseEntity extends GeneralBaseEntity {
    @ApiProperty({ type: () => Workspace, description: 'Parent Workspace' })
    @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
    @JoinColumn()
    workspace: Workspace;
}



export abstract class WorkspaceWithBlueprintEntity extends BlueprintBaseEntity {
    @ApiProperty({ type: () => Workspace, description: 'Parent Workspace' })
    @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
    @JoinColumn()
    workspace: Workspace;

}
