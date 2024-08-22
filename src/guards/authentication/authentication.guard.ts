import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private _jwtService: JwtService,
    @InjectModel(User.name) private _userModel: Model<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.token;
    if (!token)
      throw new BadRequestException('token not exist, please login again');

    try {
      const { id } = this._jwtService.verify(token, { secret: 'test' });
      const user = await this._userModel.findById(id);

      if (!user) throw new NotFoundException('user not found');

      request.user = user;

      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
