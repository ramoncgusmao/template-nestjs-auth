import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // Por padrão, o Passport usa "username" e "password".
    // Aqui, estamos alterando para "email" e "senha".
    super({
      usernameField: 'email',
      passwordField: 'senha',
      session: false,
    });
  }

  async validate(email: string, senha: string): Promise<any> {
    const user = await this.authService.validateUser(email, senha);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }
}
