import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';
import { FindManyOptions, In } from 'typeorm';
import { FEEDBACK_ERRORS } from '../constants/errors.constants';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Feedback } from '../entities/feedback.entity';
import { FeedbackRepository } from '../repositories/feedback.repository';
import { FEEDBACK_FILTERS_CONFIG } from '../constants/feedback-filters.config';
import { Pagination } from 'src/common/interfaces/pagination';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  public async create(data: CreateFeedbackDto): Promise<Feedback> {
    try {
      const {
        fullName,
        interactionDate,
        message,
        rating,
        civicCenterServiceId,
      } = data;
      return this.feedbackRepository.save({
        fullName,
        interactionDate,
        message,
        rating,
        civicCenterServiceId,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new BadRequestException({
          error,
          ...FEEDBACK_ERRORS.CREATE,
        });
      }
    }
  }

  public async findMany(
    options: FindManyOptions<Feedback>,
  ): Promise<Feedback[]> {
    return this.feedbackRepository.getMany(options);
  }

  public async findManyPaginated(
    user: User,
    options: BaseFilterDto,
  ): Promise<Pagination<Feedback>> {
    const organizationServicesFeedbacks = await this.feedbackRepository.getMany(
      {
        where: {
          civicCenterService: {
            organizationId: user.organizationId,
          },
        },
      },
    );

    const civicCenterServiceIds = organizationServicesFeedbacks.map(
      (feedback) => {
        return feedback.civicCenterServiceId;
      },
    );

    const paginationOptions: any = {
      civicCenterService:
        civicCenterServiceIds?.length > 0
          ? { id: In(civicCenterServiceIds) }
          : null,
      ...options,
    };

    return this.feedbackRepository.getManyPaginated(
      FEEDBACK_FILTERS_CONFIG,
      paginationOptions,
    );
  }

  public async findOne(id: number): Promise<Feedback> {
    const feedback = await this.feedbackRepository.get({ where: { id } });

    if (!feedback) {
      throw new NotFoundException(FEEDBACK_ERRORS.NOT_FOUND);
    }

    return feedback;
  }

  public async remove(id: number): Promise<void> {
    try {
      await this.findOne(id);
      await this.feedbackRepository.remove({ where: { id } });
    } catch (error) {
      throw new BadRequestException({
        error,
        ...FEEDBACK_ERRORS.DELETE,
      });
    }
  }
}
