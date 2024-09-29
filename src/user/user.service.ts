import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(
    nome: string,
    email: string,
    senha: string,
    role: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = this.userRepository.create({
      nome,
      email,
      senha: hashedPassword,
      role,
    });
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}
