import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './DTOs/auth-credentials.dto';
import { User } from './user.entity';
import { genSalt, hash } from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser({ username, password }: AuthCredentialsDto) {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (e) {
      if (e.code === '23505')
        throw new ConflictException('Username already exists');

      throw new InternalServerErrorException('Unknown error');
    }
  }
}
