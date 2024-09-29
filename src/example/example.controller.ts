import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('example')
@Controller('example')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protegendo as rotas com JWT e RolesGuard
export class ExampleController {
  @Get('admin')
  @Roles('admin') // Apenas usuários com a role 'admin' podem acessar
  findAdminData() {
    return 'This route is restricted to admins';
  }

  @Get('premium')
  @Roles('premium') // Apenas usuários com a role 'premium' podem acessar
  findPremiumData() {
    return 'This route is restricted to premium users';
  }

  @Get('user')
  @Roles('user', 'premium', 'admin') // Qualquer role (user, premium ou admin) pode acessar
  findUserData() {
    return 'This route is accessible to all users';
  }
}
