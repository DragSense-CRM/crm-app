import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { WSBlueprintFieldSchemaDefinition } from './field.schema';
import { WSBlueprintRelationshipSchemaDefinition } from './relationship.schema';

@Schema({ timestamps: true })
export class WSBlueprint {

    @ApiProperty({ type: String, example: '507f1f77bcf86cd799439011' })
    id: string;

    @ApiProperty({ example: 'User Profile' })
    @Prop({ required: true })
    name: string;

    @ApiPropertyOptional({ example: 'A blueprint for user profiles' })
    @Prop()
    description: string;

    @ApiProperty({ type: () => [WSBlueprintFieldSchemaDefinition] })
    @Prop({ type: [WSBlueprintFieldSchemaDefinition] })
    fields: WSBlueprintFieldSchemaDefinition[];

    @ApiPropertyOptional({ type: () => [WSBlueprintRelationshipSchemaDefinition] })
    @Prop({ type: [WSBlueprintRelationshipSchemaDefinition], default: [] })
    relationships?: WSBlueprintRelationshipSchemaDefinition[];


    @ApiProperty({ example: 1 })
    @Prop({ required: true })
    workspaceId: number;

}

export const BlueprintSchema = SchemaFactory.createForClass(WSBlueprint);

BlueprintSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
    }
});