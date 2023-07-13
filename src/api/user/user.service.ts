import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByThirdPartyId(thirdPartyId: string, provider: string) {
    return await this.userRepository.findOne({
      where: { thirdPartyId, provider },
    });
  }

  async registerOAuthUser(thirdPartyId: string, provider: string) {
    const user = new User();
    user.thirdPartyId = thirdPartyId;
    user.provider = provider;
    return await this.userRepository.save(user);
  }
}
