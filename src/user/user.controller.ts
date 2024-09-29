import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(
    @Body()
    userData: {
      nome: string;
      email: string;
      senha: string;
      role: string;
    },
  ): Promise<User> {
    return this.userService.createUser(
      userData.nome,
      userData.email,
      userData.senha,
      userData.role,
    );
  }
}
