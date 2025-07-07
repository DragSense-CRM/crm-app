
import { JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { GeneralBaseEntity } from '@/base-entity/base.entity';
import { Department } from './department.entity';
import { BlueprintBaseEntity } from '../../blueprints/entities/base-blueprint.entity';


export abstract class DepartmentBaseEntity extends GeneralBaseEntity {

    @ApiProperty({ type: () => Department, description: 'Parent department' })
    @ManyToOne(() => Department, (department) => department.projects, { onDelete: 'CASCADE' })
    @JoinColumn()
    department: Department;

}


export abstract class DepartmentWithBlueprintEntity extends BlueprintBaseEntity {

    @ApiProperty({ type: () => Department, description: 'Parent department' })
    @ManyToOne(() => Department, (department) => department.projects, { onDelete: 'CASCADE' })
    @JoinColumn()
    department: Department;

}