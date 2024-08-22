import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { isValidObjectId } from 'mongoose';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(
          value: any,
          args: ValidationArguments,
        ): boolean | Promise<boolean> {
          if (!Array.isArray(args.value)) {
            args.value = [args.value];
          }
          const invalidIds = [];

          // check if it the field just one value or more
          args.value.forEach((id) => {
            if (!isValidObjectId(id)) invalidIds.push(id);
          });

          args.constraints[0] = invalidIds;
          return invalidIds.length ? false : true;
        },
        defaultMessage(args: ValidationArguments): string {
          return `the value ${args.constraints.join('--')} must be a objectId format`;
        },
      },
    });
  };
}
