import React, { useEffect, useMemo, useState } from "react";
import DrawerPop from "../../../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import FlexCol from "../../../../common/FlexCol";
import FormInput from "../../../../common/FormInput";
import Heading2 from "../../../../common/Heading2";
import Stepper from "../../../../common/Stepper";
import { Flex } from "antd";
import EmployeeCheck from "../../../../common/EmployeeCheck";

export default function LabourWelfareFund({
  open,
  close = () => {},
  updateId,
  refresh,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);

  const [activeBtn, setActiveBtn] = useState(0);
  const [presentage, setPresentage] = useState(0);
  const [activeBtnValue, setActiveBtnValue] = useState("createlwf");
  const [nextStep, setNextStep] = useState(0);

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

  const CreateLWFteps = [
    {
      id: 0,
      value: 0,
      title: "Labor Welfare Fund",
      data: "createlwf",
    },
    {
      id: 1,
      value: 1,
      title: "Assign",
      data: "assign",
    },
  ];

  useEffect(() => {
    if (activeBtn < 1 && activeBtn !== nextStep) {
      setActiveBtn(1 + activeBtn);
      setActiveBtnValue(CreateLWFteps?.[activeBtn + 1].data);
    }
  }, [nextStep]);

  const navigateBtn = [{ id: 1, value: "employees", title: "Employees" }];
  const [activeTab, setActiveTab] = useState(navigateBtn[0].id);

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        handleClose();
      }}
      size="large"
      placement="bottom"
      background="#F8FAFC"
      // handleSubmit={(e) => {
      //     // console.log(e);
      //     formik.handleSubmit();
      // }}
      updateBtn={UpdateBtn}
      // updateFun={() => {
      //     // UpdateIdBasedState();
      //     formik.handleSubmit();
      // }}
      header={[
        !UpdateBtn ? t("Labor Welfare Fund") : t("Update Labor Welfare Fund"),
        !UpdateBtn
          ? t("Manage Labor Welfare Fund")
          : t("Update Selected Labor Welfare Fund"),
      ]}
      footerBtn={[t("Cancel"), t("Save")]}
      stepsData={CreateLWFteps}
      buttonClick={(e) => {
        if (activeBtnValue === "createlwf") {
          //   if (!updateId) {
          //     formik.handleSubmit();
          //   } else {
          //     updateSscById();
          //   }
          //   console.log("click 1");
          //   getEmployee();
          setPresentage(1);
          setNextStep(nextStep + 1);
        } else if (activeBtnValue === "assign") {
          console.log("click 2");
          //   if (!updateId) {
          //     Formik2.handleSubmit();
          //   } else {
          //     updateUserForSscById();
          //   }
        }
      }}
      buttonClickCancel={(e) => {
        if (activeBtn > 0) {
          setActiveBtn(activeBtn - 1);
          setNextStep(nextStep - 1);
          setActiveBtnValue(CreateLWFteps?.[activeBtn - 1].data);
        }
      }}
      nextStep={nextStep}
      activeBtn={activeBtn}
      saveAndContinue={true}
    >
      <FlexCol className={"max-w-[926px] mx-auto"}>
        {CreateLWFteps && (
          <Flex justify="center">
            <div className=" sticky -top-6  z-50 px-5 dark:bg-[#1f1f1f] w-full sm:w-2/5 pb-6 ">
              <Stepper
                steps={CreateLWFteps}
                currentStepNumber={activeBtn}
                presentage={presentage}
              />
            </div>
          </Flex>
        )}
        {activeBtnValue === "createlwf" ? (
          <FlexCol className="box-wrapper gap-8 bg-white dark:bg-dark">
            <Heading2
              title="Labor Welfare Fund"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ."
            />
            <div className="font-semibold text-sm 2xl:text-base">Kerala</div>
            <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2">
              <FormInput
                title={t("Employer's Contribution")}
                placeholder={t("Employer's Contribution")}
                disabled
              />
              <FormInput
                title={t("Employee's Contribution")}
                placeholder={t("Employee's Contribution")}
              />
           
              <FormInput
                title={t("Deduction Cycle")}
                placeholder={t("Deduction Cycle")}
              />
              <FormInput
                title={t("Deduction Month")}
                placeholder={t("Deduction Month")}
              />
            </div>
          </FlexCol>
        ) : (
          <EmployeeCheck
            title={t("Assign Labour Welfare Fund")}
            description={t("Assign Employees For Labour Welfare Fund")}
            // employee={employeeList}
            // department={departmentList}
            // location={locationList}
            countryBasedEmployee={true}
            // countryId={countrydata}
            navigateBtn={navigateBtn}
            // datas={allEmploylist}
            assignData={(employee, department, location) => {
              //   setSelectedEmployeeId(employee);
              // setDepartmentList(department);
              // setLocationList(location);
            }}
          />
        )}
      </FlexCol>
    </DrawerPop>
  );
}
