import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { DynamicEntity } from '../../../dynamic-entities/entities/dynamic-entity.entity';
import { DepartmentBaseEntity } from '../../entities/base-department.entity';

@Entity('ws_dep_entities')
export class DepDynamicEntity extends DepartmentBaseEntity {

    @ManyToOne(() => DynamicEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'resourceId' })
    @ApiProperty({ type: () => DynamicEntity, description: 'Linked entity' })
    dynamicEntity: DynamicEntity;
}
