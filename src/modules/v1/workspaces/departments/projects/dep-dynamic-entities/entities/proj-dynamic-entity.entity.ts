import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ProjectBaseEntity } from '../../entities/base-project.entity';
import { DynamicEntity } from '@/modules/v1/workspaces/dynamic-entities/entities/dynamic-entity.entity';

@Entity('ws_proj_entities')
export class ProjDynamicEntity extends ProjectBaseEntity {

    @ManyToOne(() => DynamicEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'resourceId' })
    @ApiProperty({ type: () => DynamicEntity, description: 'Linked entity' })
    dynamicEntity: DynamicEntity;
}
