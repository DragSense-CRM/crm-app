import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column } from 'typeorm';
import { AppBaseEntity } from './base-app.entity';

@Entity('ws-app-keys')
export class AppApiKey extends AppBaseEntity {

    @ApiProperty({
        example: 'a9e1d1a6bc5c4f91b76f...',
        description: 'Hashed version of the API key (only stored, not returned)',
        writeOnly: true,
    })
    @Column({ unique: true })
    keyHash: string;

    @ApiProperty({
        example: 'frontend-client',
        description: 'Label or name to identify the API key',
    })
    @Column()
    name: string;


}
