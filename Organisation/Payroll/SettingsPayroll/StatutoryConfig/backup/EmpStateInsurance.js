import React, { useMemo, useState } from "react";
import DrawerPop from "../../../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import { FiSettings } from "react-icons/fi";
import Dropdown from "../../../../common/Dropdown";
import FormInput from "../../../../common/FormInput";
import FlexCol from "../../../../common/FlexCol";
import CheckBoxInput from "../../../../common/CheckBoxInput";
import { Flex } from "antd";
import Stepper from "../../../../common/Stepper";
import EmployeeCheck from "../../../../common/EmployeeCheck";
import Heading2 from "../../../../common/Heading2";
import localStorageData from "../../../../../common/Functions/localStorageKeyValues";

export default function EmpStateInsurance({
  open,
  close = () => {},
  updateId,
  refresh,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [activeBtn, setActiveBtn] = useState(0);
  const [nextStep, setNextStep] = useState(0);
  const [presentage, setPresentage] = useState(0);
  const [employerCode, setEmployerCode] = useState("");
  const [activeBtnValue, setActiveBtnValue] = useState("employeeDetails");
  const [employerContribution, setEmployerContribution] = useState("");
  const [employeeContribution, setEmployeeContribution] = useState("");
  const [includeEmployerContribution, setIncludeEmployerContribution] =
    useState(false);
  const [autoStopMethod, setAutoStopMethod] = useState("");
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );

  const handleClose = () => {
    setShow(false);
  };

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const handleEmployerCodeChange = (e) => {
    const value = e;
    if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
      setEmployerCode(value);
    }
  };

  const handleContributionChange = (e, setContribution) => {
    const value = e;
    if (
      /^\d{0,3}(\.\d{0,2})?$/.test(value) &&
      (value === "" || parseFloat(value) <= 100)
    ) {
      setContribution(value);
    }
  };
  const navigateBtn = [
    { id: 1, value: "Employees", title: "Employees" },
    { id: 2, value: "Departments", title: "Departments" },
    { id: 3, value: "Locations", title: "Locations" },
  ];
  const handleSubmit = () => {
    const payloadData = {
      id: updateId || null,
      companyId: companyId,
      config: {
        employeeContributionGrossPAy: parseFloat(employeeContribution) || 0,
        employerContributionGrosspay: parseFloat(employerContribution) || 0,
        ConfigurationData: {
          includeEmployerContibutionInCTC: includeEmployerContribution ? 1 : 0,
          DeductEsiEndOfContribution: autoStopMethod === "deductESI" ? 1 : 0,
          AutoStopSalaryAbove21000: autoStopMethod === "autoStop" ? 1 : 0,
        },
      },

      isActive: 1,
      createdBy: loggedEmployeeId,
    };
    setPresentage(1);
    setNextStep(nextStep + 1);
    setActiveBtnValue("assign");
  };
  const stepperMenu = [
    {
      id: 0,
      value: 0,
      title: "Employee Details",
      data: "employeeDetails",
    },
    {
      id: 1,
      value: 1,
      title: "Assign Employees",
      data: "assign",
    },
  ];

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
      size="large"
      background="#F8FAFC"
      placement="bottom"
      updateBtn={UpdateBtn}
      header={[
        !UpdateBtn
          ? t("Employee State Insurance")
          : t("Update Employee State Insurance"),
        !UpdateBtn
          ? t("Manage Employee State Insurance")
          : t("Update Selected Employee State Insurance"),
      ]}
      buttonClick={(e) => {
        if (activeBtnValue === "employeeDetails") {
          handleSubmit();
        } else if (activeBtnValue === "assign") {
        }
      }}
      buttonClickCancel={(e) => {
        if (activeBtn > 0) {
          setActiveBtn(activeBtn - 1);
          setNextStep(nextStep - 1);
          setActiveBtnValue(stepperMenu?.[activeBtn - 1].data);
        }
      }}
      footerBtn={[t("Cancel"), t("Save")]}
      nextStep={nextStep}
      activeBtn={activeBtn}
      saveAndContinue={true}
      handleSubmit={handleSubmit}
    >
      <FlexCol className="relative max-w-[926px] h-full mx-auto">
        <Flex justify="center">
          <div className=" sticky -top-6  z-50 px-5 dark:bg-[#1f1f1f] w-full sm:w-2/5 pb-6  ">
            <Stepper
              steps={stepperMenu}
              currentStepNumber={activeBtn}
              presentage={presentage}
            />
          </div>
        </Flex>
        {activeBtnValue === "employeeDetails" ? (
          <>
            <FlexCol className="box-wrapper gap-6">
              <Heading2
                title={t("Employee State Insurance")}
                description="Manage State Insurance"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <FormInput
                  title={t("ESI Employerf Code ")}
                  placeholder={t("ESI Employer Code")}
                  required={true}
                  value={employerCode}
                  change={handleEmployerCodeChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Dropdown
                  title={t("Employer Contribution Rate(of gross pay) ")}
                  placeholder={t("Choose Contribution Rate")}
                  value={employerContribution}
                  change={(e) =>
                    handleContributionChange(e, setEmployerContribution)
                  }
                />
                <Dropdown
                  title={t("Employee Contribution Rate(of gross pay) ")}
                  placeholder={t("Choose Contribution Rate")}
                  value={employeeContribution}
                  change={(e) =>
                    handleContributionChange(e, setEmployeeContribution)
                  }
                />
              </div>
            </FlexCol>
            <div className="flex flex-col items-start gap-4 p-5 mt-2 bg-primaryalpha/5 rounded-xl">
              <div className="flex items-center gap-2">
                <span>
                  {" "}
                  <FiSettings className="text-base 2xl:text-lg text-grey" />
                </span>
                <span className="font-semibold text-sm 2xl:text-base">
                  Configuration
                </span>
              </div>
              <CheckBoxInput
                titleRight="Include Employers Contribution in CTC"
                value={includeEmployerContribution}
                change={() =>
                  setIncludeEmployerContribution(!includeEmployerContribution)
                }
              />
              <div className="font-semibold text-xs 2xl:text-sm">
                Auto Stop Method
              </div>
              {[
                {
                  id: "deductESI",
                  name: "Deduct ESI till end of Contribution Period",
                },
                { id: "autoStop", name: "Auto Stop for Salary Above 21.000" },
              ].map((item, index) => (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  key={index}
                  onClick={() => {
                    setAutoStopMethod(item.id);
                  }}
                >
                  <div
                    className={`${
                      autoStopMethod === item.id && "border-primary"
                    } border  rounded-full`}
                  >
                    <div
                      className={`font-semibold text-base w-4 h-4 border-2 border-white dark:border-white/10 rounded-full ${
                        autoStopMethod === item.id && "text-primary bg-primary"
                      } `}
                    ></div>
                  </div>
                  <span className="font-medium text-xs 2xl:text-sm">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmployeeCheck
            title="Assign Employee Provident Fund"
            description="Manage your Assignies here"
            navigateBtn={navigateBtn}
          />
        )}
      </FlexCol>
    </DrawerPop>
  );
}
