import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; // Serviço para obter usuários do banco
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface'; // Interface para representar o payload do JWT

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, senha: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(senha, user.senha))) {
      const { nome, email, role } = user;
      return { nome, email, role }; // Retorna o usuário sem a senha
    }
    return null; // Se a senha for inválida ou usuário não existir
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }), // Token válido por 15 minutos
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }), // Refresh token válido por 7 dias
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      // Garantir que o usuário ainda é válido
      const user = await this.userService.findByEmail(payload.username);
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }
      // Gerar um novo token de acesso
      const newPayload: JwtPayload = {
        username: user.email,
        sub: user.id,
        role: user.role,
      };
      return {
        access_token: this.jwtService.sign(newPayload, { expiresIn: '15m' }), // Novo access token válido por 15 minutos
      };
    } catch (e) {
      throw new UnauthorizedException('Refresh token inválido', e);
    }
  }
}
