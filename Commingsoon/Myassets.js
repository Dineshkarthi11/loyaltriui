import React from 'react'
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../common/BreadCrumbs';
import InProgress from '../common/InProgres';

export default function Myassets() {

    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t("Company"), url: "/" },
        { label: t("My Assets"), url: "/" },
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
