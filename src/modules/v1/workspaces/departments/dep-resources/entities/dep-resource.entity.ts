import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Resource } from '../../../resources/entities/resource.entity';
import { DepartmentWithBlueprintEntity } from '../../entities/base-department.entity';
import { DepResourceType } from '../enums/dep-resource.enum';

@Entity('ws-dep-resources')
export class DepResource extends DepartmentWithBlueprintEntity {

    @ApiProperty({ example: 'Engineer', description: 'Department Resource name' })
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ManyToOne(() => Resource, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'resourceId' })
    @ApiProperty({ type: () => Resource, description: 'Linked resource' })
    resource: Resource;


    @Column({ default: true })
    @ApiProperty({ example: true, description: 'Status of the department resource' })
    isActive: boolean;

    @Column({ nullable: true, default: 'Member' })
    @ApiProperty({ example: 'Manager', description: 'Designation or role in department' })
    designation?: string;

    @Column({ type: 'varchar', nullable: true, default: 'USER' })
    @ApiProperty({
        example: DepResourceType.USER,
        enum: DepResourceType,
        description: 'Type of the resource linked to the department',
    })
    type: string;
}
