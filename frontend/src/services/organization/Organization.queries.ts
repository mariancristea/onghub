import { useMutation, useQuery } from 'react-query';
import { CompletionStatus } from '../../pages/organization/enums/CompletionStatus.enum';
import { IOrganizationFinancial } from '../../pages/organization/interfaces/OrganizationFinancial.interface';
import { IOrganizationGeneral } from '../../pages/organization/interfaces/OrganizationGeneral.interface';
import { IOrganizationReport } from '../../pages/organization/interfaces/OrganizationReport.interface';
import { useSelectedOrganization } from '../../store/selectors';
import useStore from '../../store/store';
import { getOrganization, patchOrganization } from './Organization.service';

interface OrganizationPayload {
  id: number;
  organization: {
    general?: IOrganizationGeneral;
    financial?: Partial<IOrganizationFinancial>;
  };
}

export const useOrganizationQuery = (id: number) => {
  const { setOrganizationGeneral, setOrganizationFinancial, setOrganizationReport } = useStore();
  return useQuery(['organization', id], () => getOrganization(id), {
    onSuccess: (data: {
      organizationGeneral: IOrganizationGeneral;
      organizationFinancial: IOrganizationFinancial[];
      organizationReport: IOrganizationReport;
    }) => {
      setOrganizationGeneral(data.organizationGeneral);
      setOrganizationFinancial(data.organizationFinancial);
      setOrganizationReport({
        id: 1,
        reports: [
          {
            id: 1,
            numberOfContractors: null,
            numberOfVolunteers: null,
            report: null,
            year: 2022,
            status: CompletionStatus.NOT_COMPLETED,
            updatedOn: new Date().toISOString(),
          },
          {
            id: 2,
            numberOfContractors: null,
            numberOfVolunteers: null,
            report: null,
            year: 2021,
            status: CompletionStatus.NOT_COMPLETED,
            updatedOn: new Date().toISOString(),
          },
        ],
        partners: [
          {
            id: 1,
            numberOfPartners: 12,
            updatedOn: new Date().toISOString(),
            year: 2022,
            status: CompletionStatus.NOT_COMPLETED,
          },
          {
            id: 2,
            numberOfPartners: 21,
            updatedOn: new Date().toISOString(),
            year: 2021,
            status: CompletionStatus.COMPLETED,
          },
        ],
        inverstors: [
          {
            id: 1,
            numberOfInvestors: 12,
            updatedOn: new Date().toISOString(),
            year: 2022,
            status: CompletionStatus.NOT_COMPLETED,
          },
          {
            id: 2,
            numberOfInvestors: 21,
            updatedOn: new Date().toISOString(),
            year: 2021,
            status: CompletionStatus.COMPLETED,
          },
        ],
      });
    },
  });
};

export const useOrganizationMutation = () => {
  const { setOrganizationGeneral, setOrganizationFinancial } = useStore();
  const { organizationFinancial } = useSelectedOrganization();
  return useMutation(
    ({ id, organization }: OrganizationPayload) => patchOrganization(id, organization),
    {
      onSuccess: (
        data: IOrganizationGeneral | IOrganizationFinancial,
        { organization }: OrganizationPayload,
      ) => {
        if (organization.general) {
          setOrganizationGeneral(data as IOrganizationGeneral);
        }
        if (organization.financial) {
          setOrganizationFinancial([
            ...organizationFinancial.filter((org) => org.id !== data.id),
            data as IOrganizationFinancial,
          ]);
        }
      },
    },
  );
};
