import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './DTOs/auth-credentials.dto';
import { UserRepository } from './users.repository';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(authCredentialsDto: AuthCredentialsDto) {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn({ password, username }: AuthCredentialsDto) {
    const user = await this.usersRepository.findOne({ username });

    if (!user || !(await compare(password, user.password)))
      throw new UnauthorizedException('Unauthorized');

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
