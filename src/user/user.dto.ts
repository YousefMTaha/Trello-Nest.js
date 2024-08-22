import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Match } from 'src/decorators/matchPassword.decorator';
import { sysRoles } from 'src/utils/sysConstants';

export class AddUserDTO {
  @MinLength(3)
  firstName: string;

  @MinLength(3)
  lastName: string;

  @IsStrongPassword()
  password: string;

  @Match('password')
  cPassword: string;

  email: string;

  @Min(18)
  @Max(80)
  @IsOptional()
  age: number;

  @IsEnum(Object.values(sysRoles))
  @IsOptional()
  role: string;
}

export class signinDTO {
  @IsStrongPassword()
  password: string;

  email: string;
}

export type responseUser = {
  name: {
    firstName: string;
    lastName: string;
  };
  password: string;
  email: string;
  age?: number;
};
