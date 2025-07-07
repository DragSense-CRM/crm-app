import { Injectable } from '@nestjs/common';
import { ArrayMaxSize, ArrayMinSize, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {
  IsArray, IsBoolean, IsDate, IsIn, IsInt,
  IsNotEmpty, IsNumber, IsString, Matches,
  Max, MaxLength, Min, MinLength
} from 'class-validator';
import { WSFieldSchemaDefinition } from './schemas/field.schema';

@Injectable()
export class FieldsService {
  async validateFieldValue(fieldDef: WSFieldSchemaDefinition, value: any): Promise<string[]> {
    const DynamicClass = this.createDynamicValidator(fieldDef);
    const objToValidate = { [fieldDef.key]: value };
    const errors = await validate(plainToClass(DynamicClass, objToValidate));
        console.log(errors);

    return errors.flatMap(e => Object.values(e.constraints || {}));
  }

  private createDynamicValidator(field: WSFieldSchemaDefinition): any {
    class DynamicValidator { }
    this.applyDecorators(DynamicValidator.prototype, field.key, field);
    return DynamicValidator;
  }

  private applyDecorators(target: any, property: string, field: WSFieldSchemaDefinition) {
    const decorators = this.getDecorators(field);
    decorators.forEach(decorator => {
      decorator(target, property);
    });
  }

  private getDecorators(field: WSFieldSchemaDefinition): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    if (field.required) {
      decorators.push(IsNotEmpty());
    }


    switch (field.type) {
      case 'string':
        decorators.push(IsString());
        if (field.constraints?.minLength) {
          decorators.push(MinLength(field.constraints.minLength));
        }
        if (field.constraints?.maxLength) {
          decorators.push(MaxLength(field.constraints.maxLength));
        }
        if (field.constraints?.pattern) {
          decorators.push(Matches(new RegExp(field.constraints.pattern)));
        }
        if (field.constraints?.enum) {
          decorators.push(IsIn(field.constraints.enum));
        }
        break;

      case 'number':
        decorators.push(IsNumber());
        if (field.constraints?.minimum) {
          decorators.push(Min(field.constraints.minimum));
        }
        if (field.constraints?.maximum) {
          decorators.push(Max(field.constraints.maximum));
        }
        if (field.constraints?.integer) {
          decorators.push(IsInt());
        }
        break;

      case 'boolean':
        decorators.push(IsBoolean());
        break;

      case 'date':
        decorators.push(IsDate());
        break;

      case 'array':
        decorators.push(IsArray());
        if (field.constraints?.minItems) {
          decorators.push(ArrayMinSize(field.constraints.minItems));
        }
        if (field.constraints?.maxItems) {
          decorators.push(ArrayMaxSize(field.constraints.maxItems));
        }
        break;
    }


    return decorators;
  }
}