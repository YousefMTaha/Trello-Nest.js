import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
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
          // check if the field contain only objectId or [objectIds]
          if (!Array.isArray(args.value)) {
            args.value = [args.value];
          }

          // array to hold the ids that will not match the objectId format
          const invalidIds = [];

          // check if it the field just one value or more
          args.value.forEach((id: string) => {
            if (!isValidObjectId(id)) invalidIds.push(id);
          });

          args.constraints[0] = invalidIds; // to access it in the defaultMessage method
          return invalidIds.length ? false : true;
        },
        defaultMessage(args: ValidationArguments): string {
          return `the value ${args.constraints[0].join('--')} must be a objectId format`;
        },
      },
    });
  };
}
