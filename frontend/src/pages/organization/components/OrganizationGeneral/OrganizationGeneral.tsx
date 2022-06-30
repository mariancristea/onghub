import React, { useEffect, useState } from 'react';
import { ExclamationCircleIcon, PencilIcon } from '@heroicons/react/solid';
import { classNames } from '../../../../common/helpers/tailwind.helper';
import { Controller, useForm } from 'react-hook-form';
import InputField from '../../../../components/InputField/InputField';
import InputFieldHttpAddon from '../../../../components/InputField/components/InputFieldHttpAddon';
import { OrganizationGeneralConfig } from './OrganizationGeneralConfig';
import RadioGroup from '../../../../components/RadioGroup/RadioGroup';
import Select from '../../../../components/Select/Select';

const OrganizationGeneral = () => {
  const [readonly, setReadonly] = useState(true);

  // React Hook Form
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onChange', reValidateMode: 'onChange' });

  const handleSave = (data: any) => {
    console.log(data);
    setReadonly((mode) => !mode);
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="p-5 sm:p-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">Date generale</span>

        <button
          type="button"
          className={classNames(readonly ? 'edit-button' : 'save-button')}
          onClick={handleSubmit(handleSave)}
        >
          <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {readonly ? 'Editeaza' : 'Salveaza modificari'}
        </button>
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="p-5 sm:p-10 flex">
        <div className="flex flex-col gap-y-4 w-full">
          <span className="font-bold text-default-gray-800">General</span>

          <Controller
            key={'index'}
            name={'1'}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                onChange={onChange}
                selected={value}
                label={'label'}
                collection={[
                  { id: 1, name: 'Wade Cooper' },
                  { id: 2, name: 'Arlene Mccoy' },
                  { id: 3, name: 'Devon Webb' },
                  { id: 4, name: 'Tom Cook' },
                  { id: 5, name: 'Tanya Fox' },
                  { id: 6, name: 'Hellen Schmidt' },
                  { id: 7, name: 'Caroline Schultz' },
                  { id: 8, name: 'Mason Heaney' },
                  { id: 9, name: 'Claudie Smitham' },
                  { id: 10, name: 'Emil Schaefer' },
                ]}
                displayedAttribute={'name'}
              />
            )}
          />
          {/* <ContactForm
            control={control}
            errors={errors}
            readonly={readonly}
            configs={[OrganizationGeneralConfig.contact_name, OrganizationGeneralConfig.email]}
          /> */}
        </div>
        <div className="w-full flex flex-col items-center justify-center">
          <div className="rounded-full border-2 border-gray-100 h-80 w-80 relative flex items-center justify-center">
            <img
              src={
                'https://media-exp1.licdn.com/dms/image/C5603AQFivIhBWBWR9w/profile-displayphoto-shrink_200_200/0/1517276678882?e=1661990400&v=beta&t=3uinSQf4OI76lQOF7FkRVoYiZGKv0l_h33MYViddwiI'
              }
              className="w-11/12 h-11/12 overflow-hidden rounded-full"
            />
          </div>
          <span className="mt-8 text-blue-500 text-normal underline cursor-pointer select-none">
            Schimba fotografia
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrganizationGeneral;
