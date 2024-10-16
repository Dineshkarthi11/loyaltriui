import React from 'react'
import InProgress from '../common/InProgres';
import Breadcrumbs from '../common/BreadCrumbs';
import { useTranslation } from 'react-i18next';



export default function Companydocument() {

  const { t } = useTranslation();

  const breadcrumbItems = [
    { label: t("Company"), url: "/" },
    { label: t("Company Documents"), url: "/" },
  ];


  return (
    <div>
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <p className="para">
          {t("Main_Description")}
        </p>
      </div>
      <div><InProgress /></div>
    </div>
  )
}
