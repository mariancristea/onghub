import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '../application/application.module';
import { OrganizationProfileController } from './controllers/organization-profile.controller';
import { OrganizationController } from './controllers/organization.controller';
import {
  Contact,
  Investor,
  Organization,
  OrganizationActivity,
  OrganizationFinancial,
  OrganizationGeneral,
  OrganizationLegal,
  OrganizationReport,
  OrganizationView,
  Partner,
  Report,
} from './entities';
import { OrganizationRequest } from './entities/organization-request.entity';
import {
  ContactRepository,
  InvestorRepository,
  OrganizationActivityRepository,
  OrganizationFinancialRepository,
  OrganizationGeneralRepository,
  OrganizationLegalRepository,
  OrganizationReportRepository,
  OrganizationRepository,
  OrganizationViewRepository,
  PartnerRepository,
} from './repositories';
import { OrganizationRequestRepository } from './repositories/organization-request.repository';
import {
  ContactService,
  OrganizationActivityService,
  OrganizationFinancialService,
  OrganizationGeneralService,
  OrganizationLegalService,
  OrganizationService,
  ReportService,
} from './services';
import { OrganizationReportService } from './services/organization-report.service';
import { OrganizationRequestService } from './services/organization-request.service';
import { OrganizationStatisticsService } from './services/organization-statistics.service';
import { UserModule } from '../user/user.module';
import { OrganizationApplicationController } from './controllers/organization-application.controller';
import { OrganizationHistory } from './entities/organization-history.entity';
import { OrganizationRequestHistory } from './entities/organization-request-history.entity';
import { OrganizationStatusStatisticsView } from './entities/organization-status-statistics-view.entity';
import { OrganizatioStatusnStatisticsViewRepository } from './repositories/organization-status-statistics-view.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contact,
      Organization,
      OrganizationGeneral,
      OrganizationActivity,
      OrganizationLegal,
      OrganizationFinancial,
      OrganizationReport,
      Report,
      Partner,
      Investor,
      OrganizationRequest,
      OrganizationView,
      OrganizationStatusStatisticsView,
      OrganizationHistory,
      OrganizationRequestHistory,
    ]),
    ApplicationModule,
    UserModule,
  ],
  controllers: [
    OrganizationApplicationController,
    OrganizationController,
    OrganizationProfileController,
  ],
  providers: [
    ContactService,
    OrganizationService,
    OrganizationGeneralService,
    OrganizationRepository,
    OrganizationGeneralRepository,
    OrganizationActivityService,
    OrganizationActivityRepository,
    OrganizationLegalRepository,
    PartnerRepository,
    InvestorRepository,
    ContactRepository,
    OrganizationLegalService,
    OrganizationFinancialRepository,
    OrganizationFinancialService,
    OrganizationReportRepository,
    OrganizationReportService,
    ReportService,
    OrganizationViewRepository,
    OrganizationRequestRepository,
    OrganizationRequestService,
    OrganizationStatisticsService,
    OrganizatioStatusnStatisticsViewRepository,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
