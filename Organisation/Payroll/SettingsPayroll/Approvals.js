import React from "react";
import { useTranslation } from "react-i18next";
import VerticalStepper from "./StepperVertical";

const Approvals = () => {
  const { t } = useTranslation();

  const stepSchemeSteps = [
    {
      id: 0,
      value: 0,
      title: "Add Shift Scheme",
      data: "addShiftScheme",
    },
    {
      id: 1,
      value: 1,
      title: "Assign Shift Scheme",
      data: "assignShiftScheme",
    },
    {
      id: 2,
      value: 2,
      title: "Assign Shift Scheme 2",
      data: "assignShiftScheme 2",
    },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-bold text-lg">Approvals</p>
        <p className="para">{t("Main_Dsc_Approval")}</p>
      </div>

      <VerticalStepper
        steps={stepSchemeSteps}
        currentStepNumber={2}
        presentage={1}
      />
    </div>
  );
};

export default Approvals;
