import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { AddUserDTO, signinDTO, responseUser } from './user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { sendEmail } from 'src/utils/email';
import { Request } from 'express';

@Injectable()
export class userService {
  constructor(
    @InjectModel(User.name) private _userModel: Model<User>,
    private _jwtService: JwtService,
  ) {}

  async getUsers(): Promise<object[]> {
    return await this._userModel.find();
  }

  async signup(req: Request, body: AddUserDTO): Promise<any> {
    const { email } = body;

    // check for existance
    const isEmail = await this._userModel.findOne({ email });
    if (isEmail) {
      throw new ConflictException('email already exist');
    }

    const { firstName, lastName, ...data } = body;

    const userData: responseUser = {
      ...data,
      name: {
        firstName: body.firstName,
        lastName: body.lastName,
      },
    };

    // generate token for confrimation process
    const confirmationToken = this._jwtService.sign(
      { email },
      { secret: 'verify token' },
    );

    await sendEmail({
      to: email,
      subject: 'confirmEmail',
      html: `<a href="http://localhost:3000/user/confirmEmail/${confirmationToken}"> confrim your email </a>`,
    });

    return { message: 'done', user: await this._userModel.create(userData) };
  }

  async signin(body: signinDTO): Promise<object> {
    const { email, password } = body;

    const user = await this._userModel.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password))
      throw new BadRequestException('invalid info');

    if (!user.confirmEmail)
      throw new BadRequestException('Please confirm your email first');

    const token = this._jwtService.sign(
      { id: user._id, email: user.email },
      { secret: 'test' },
    );

    return {
      message: 'Done',
      token,
    };
  }

  getProfile(req: any): object {
    return {
      message: 'done',
      user: req.user,
    };
  }

  async confirmEmail(params: { token: string }): Promise<Object> {
    const { token } = params;

    const { email } = this._jwtService.verify(token, {
      secret: 'verify token',
    });

    const confirmUser = await this._userModel.findOneAndUpdate(
      { email },
      { confirmEmail: true },
    );

    if (!confirmUser) throw new BadRequestException('email not found');
    if (confirmUser.email)
      throw new BadRequestException('email already confirmed');

    return {
      message: 'email confrimed',
      success: true,
    };
  }
}
