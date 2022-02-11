import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './DTOs/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto) {
    return await this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  async signIn(@Body() authCredentialsDto: AuthCredentialsDto) {
    return await this.authService.signIn(authCredentialsDto);
  }
}
