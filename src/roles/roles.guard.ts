import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Obter as roles permitidas do contexto
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // Se não houver roles definidas, acesso é permitido
    }

    // Obter o usuário da requisição
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificar se o usuário possui uma das roles permitidas
    return roles.includes(user.role);
  }
}
