import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import FlexCol from "../common/FlexCol";

import WrapperOrgChart from "./OrgChart/OrgChart";
import Heading from "../common/Heading";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function Organization_Structure() {
  const { t } = useTranslation();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);

  return (
    <FlexCol>
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        <Heading
          title={t("Organization_Structure")}
          description="Defines the hierarchical arrangement of roles, responsibilities, and relationships within a company."
        />
      </div>

      <div>
        {/* <Frame /> */}
        <WrapperOrgChart employee={employeeId} />
      </div>
    </FlexCol>
  );
}
