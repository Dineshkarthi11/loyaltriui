import React from 'react'
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../common/BreadCrumbs';
import InProgress from '../common/InProgres';

export default function CompanyAssets() {

  const { t } = useTranslation();

  const breadcrumbItems = [
    { label: t("Company"), url: "/" },
    { label: t("Company Assets"), url: "/" },
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
