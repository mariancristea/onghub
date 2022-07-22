import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';
import { USER_FILTERS_CONFIG } from '../constants/user-filters.config';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserFilterDto } from '../dto/user-filter.dto';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { UserRepository } from '../repositories/user.repository';
import { CognitoUserService } from './cognito.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cognitoService: CognitoUserService,
  ) {}

  /*
      Rules:
        1. Employee must be linked with an organization
  */
  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // TODO 1. Validate DTO
      // TODO 1.1. Check the organizationId exists
      // ====================================
      // 2. Create user in Cognito
      const cognitoId = await this.cognitoService.createUser(createUserDto);
      // 3. Create user in database
      const user = await this.userRepository.save({
        ...createUserDto,
        cognitoId,
        role: Role.EMPLOYEE,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult | any> {
    return 'Update the UserDTO with the possible updates or create multiple DTOs.';
    // return this.userRepository.update({ id }, updateUserDto);
  }

  public async findAll(options: UserFilterDto): Promise<Pagination<User>> {
    return this.userRepository.getManyPaginated(USER_FILTERS_CONFIG, options);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
