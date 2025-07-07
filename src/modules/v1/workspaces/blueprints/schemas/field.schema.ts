import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { FieldType } from '../enums/field.enum';

export class WSBlueprintFieldSchemaDefinition {
    @ApiProperty({ example: 'username' })
    @Prop({ required: true })
    key: string;


    @ApiProperty({ enum: FieldType })
    @Prop({ required: true, enum: Object.values(FieldType) })
    type: string;

    @ApiPropertyOptional({ default: false })
    @Prop({ default: false })
    required: boolean;

    @ApiPropertyOptional({ type: Object, example: { minLength: 1, maxLength: 10 }, })
    @Prop({ type: Object })
    constraints?: Record<string, any>;

    
    @ApiPropertyOptional({ example: 'John Doe' })
    @Prop({ default: null })
    defaultValue?: string;
}
