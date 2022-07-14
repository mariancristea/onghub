import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { AnafService } from 'src/shared/services';
import { NomenclaturesService } from 'src/shared/services/nomenclatures.service';
import { In } from 'typeorm';
import { OrganizationFinancialService } from '.';
import {
  ERROR_CODES,
  HTTP_ERRORS_MESSAGES,
} from '../constants/errors.constants';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { Organization } from '../entities';
import { Area } from '../enums/organization-area.enum';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';
import { FinancialType } from '../enums/organization-financial-type.enum';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationActivityService } from './organization-activity.service';
import { OrganizationGeneralService } from './organization-general.service';
import { OrganizationLegalService } from './organization-legal.service';
import { OrganizationReportService } from './organization-report.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationGeneralService: OrganizationGeneralService,
    private readonly organizationActivityService: OrganizationActivityService,
    private readonly organizationLegalService: OrganizationLegalService,
    private readonly organizationFinancialService: OrganizationFinancialService,
    private readonly organizationReportService: OrganizationReportService,
    private readonly nomenclaturesService: NomenclaturesService,
    private readonly anafService: AnafService,
  ) {}

  public async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const federations = await this.nomenclaturesService.getFederations({
      where: { id: In(createOrganizationDto.activity.federations) },
    });

    const coalitions = await this.nomenclaturesService.getCoalitions({
      where: { id: In(createOrganizationDto.activity.coalitions) },
    });

    const domains = await this.nomenclaturesService.getDomains({
      where: { id: In(createOrganizationDto.activity.domains) },
    });

    const regions = await this.nomenclaturesService.getRegions({
      where: { id: In(createOrganizationDto.activity.regions) },
    });

    if (
      createOrganizationDto.activity.area === Area.REGIONAL &&
      regions.length === 0
    ) {
      throw new NotAcceptableException({
        message: HTTP_ERRORS_MESSAGES.REGION,
        errorCode: ERROR_CODES.ORG003,
      });
    }

    const cities = await this.nomenclaturesService.getCities({
      where: { id: In(createOrganizationDto.activity.cities) },
    });

    if (
      createOrganizationDto.activity.area === Area.LOCAL &&
      cities.length === 0
    ) {
      throw new NotAcceptableException({
        message: HTTP_ERRORS_MESSAGES.LOCAL,
        errorCode: ERROR_CODES.ORG004,
      });
    }

    const previousYear = new Date().getFullYear() - 1;
    const currentYear = new Date().getFullYear();
    const reportStatus = CompletionStatus.NOT_COMPLETED;
    // get anaf data
    const financialInformation = await this.anafService.getFinancialInformation(
      createOrganizationDto.general.cui,
      new Date().getFullYear() - 1,
    );

    // create the parent entry with default values
    return this.organizationRepository.save({
      organizationGeneral: {
        ...createOrganizationDto.general,
      },
      organizationActivity: {
        ...createOrganizationDto.activity,
        domains,
        regions,
        cities,
        federations,
        coalitions,
      },
      organizationLegal: {
        ...createOrganizationDto.legal,
      },
      organizationFinancial: [
        {
          type: FinancialType.EXPENSE,
          year: new Date().getFullYear() - 1,
          total: financialInformation.totalExpense,
          numberOfEmployees: financialInformation.numberOfEmployees,
        },
        {
          type: FinancialType.INCOME,
          year: new Date().getFullYear() - 1,
          total: financialInformation.totalIncome,
          numberOfEmployees: financialInformation.numberOfEmployees,
        },
      ],
      organizationReport: {
        reports: [
          {
            report: '',
            numberOfVolunteers: 0,
            numberOfContractors: 0,
            year: currentYear,
            status: reportStatus,
          },
        ],
        partners: [
          {
            year: currentYear,
            numberOfPartners: 0,
            status: reportStatus,
          },
        ],
        investors: [
          {
            year: currentYear,
            numberOfInvestors: 0,
            status: reportStatus,
          },
        ],
      },
    });
  }

  public async findOne(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.get({
      where: { id },
      relations: [
        'organizationGeneral',
        'organizationGeneral.city',
        'organizationGeneral.county',
        'organizationGeneral.contact',
        'organizationActivity',
        'organizationActivity.federations',
        'organizationActivity.coalitions',
        'organizationActivity.domains',
        'organizationActivity.cities',
        'organizationLegal',
        'organizationLegal.legalReprezentative',
        'organizationLegal.directors',
        'organizationFinancial',
        'organizationReport',
        'organizationReport.reports',
        'organizationReport.partners',
        'organizationReport.investors',
      ],
    });

    if (!organization) {
      throw new NotFoundException({
        message: HTTP_ERRORS_MESSAGES.ORGANIZATION,
        errorCode: ERROR_CODES.ORG001,
      });
    }

    return organization;
  }

  /**
   * Update organization will only update one child at the time
   * TODO: Review if we put this in organization
   */
  public async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<any> {
    const organization = await this.organizationRepository.get({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException({
        message: HTTP_ERRORS_MESSAGES.ORGANIZATION,
        errorCode: ERROR_CODES.ORG002,
      });
    }

    if (updateOrganizationDto.general) {
      return this.organizationGeneralService.update(
        organization.organizationGeneralId,
        updateOrganizationDto.general,
      );
    }

    if (updateOrganizationDto.activity) {
      return this.organizationActivityService.update(
        organization.organizationActivityId,
        updateOrganizationDto.activity,
      );
    }

    if (updateOrganizationDto.legal) {
      return this.organizationLegalService.update(
        organization.organizationLegalId,
        updateOrganizationDto.legal,
      );
    }

    if (updateOrganizationDto.financial) {
      return this.organizationFinancialService.update(
        updateOrganizationDto.financial,
      );
    }

    if (updateOrganizationDto.report) {
      return this.organizationReportService.update(
        organization.organizationReportId,
        updateOrganizationDto.report,
      );
    }

    return null;
  }
}
