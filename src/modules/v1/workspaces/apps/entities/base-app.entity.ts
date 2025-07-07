
import { GeneralBaseEntity } from '@/base-entity/base.entity';

import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkspaceBaseEntity, WorkspaceWithBlueprintEntity } from '../../entities/base-workspace.entity';
import { App } from './app.entity';



export abstract class AppBaseEntity extends WorkspaceBaseEntity {
    @ApiProperty({ type: () => App, description: 'Parent App' })
    @ManyToOne(() => App, { onDelete: 'CASCADE' })
    @JoinColumn()
    app: App;
}



export abstract class AppBaseWithBlueprintEntity extends WorkspaceWithBlueprintEntity {
    @ApiProperty({ type: () => App, description: 'Parent App' })
    @ManyToOne(() => App, { onDelete: 'CASCADE' })
    @JoinColumn()
    app: App;
}
