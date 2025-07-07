
import { Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GeneralBaseEntity } from '@/base-entity/base.entity';


export abstract class BlueprintBaseEntity extends GeneralBaseEntity {

    @ApiPropertyOptional({
        description: 'Reference to MongoDB blueprint ID',
        example: '507f1f77bcf86cd799439011'
    })
    @Column({ nullable: true })
    blueprintId?: string;

    @ApiProperty({
        description: 'Field values matching the blueprint',
        example: {
            status: 'active',
            location: 'New York',
        }
    })
    @Column('jsonb')
    values: Record<string, any>;
}
