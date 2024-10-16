import React from 'react'
import InProgress from '../../common/InProgres'
import Breadcrumbs from '../../common/BreadCrumbs';
import { useTranslation } from 'react-i18next';



export default function Recruitment() {

    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t("Settings"), url: "" },
        { label: t("Organisation"), url: "" },
        { label: t("Recruitment"), url: "" },
    ];


    return (
        <div>
            <div>
                <Breadcrumbs items={breadcrumbItems} />
                <p className="para">
                    {t("Recruit_Main_Desc")}
                </p>
            </div>
            <div><InProgress /></div>
        </div>
    )
}
