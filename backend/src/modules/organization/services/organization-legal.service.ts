import { BadRequestException, Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { ORGANIZATION_ERRORS } from '../constants/errors.constants';
import { UpdateOrganizationLegalDto } from '../dto/update-organization-legal.dto';
import { OrganizationLegalRepository } from '../repositories';
import { ContactService } from './contact.service';

@Injectable()
export class OrganizationLegalService {
  constructor(
    private readonly organizationLegalRepostory: OrganizationLegalRepository,
    private readonly contactService: ContactService,
  ) {}

  public async update(
    id: number,
    updateOrganizationLegalDto: UpdateOrganizationLegalDto,
  ) {
    const { directorsDeleted, ...organizationLegalData } =
      updateOrganizationLegalDto;

    if (updateOrganizationLegalDto?.directors?.length < 3) {
      throw new BadRequestException({
        ...ORGANIZATION_ERRORS.CREATE_LEGAL.DIRECTORS_MIN,
      });
    }

    if (directorsDeleted?.length > 0) {
      await this.contactService.delete({ id: In(directorsDeleted) });
    }

    await this.organizationLegalRepostory.save({
      id,
      ...organizationLegalData,
    });

    return this.organizationLegalRepostory.get({
      where: { id },
      relations: ['directors', 'legalReprezentative'],
    });
  }
}
