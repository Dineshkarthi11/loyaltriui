import React, { useEffect, useMemo, useState } from "react";
import DrawerPop from "../../../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";
import FlexCol from "../../../../common/FlexCol";
import FormInput from "../../../../common/FormInput";
import Dropdown from "../../../../common/Dropdown";
import { IoMdAdd } from "react-icons/io";
import { Flex } from "antd";
import Stepper from "../../../../common/Stepper";
import EmployeeCheck from "../../../../common/EmployeeCheck";
import Heading2 from "../../../../common/Heading2";

export default function EmpPofessionalTax({
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
  const [activeBtnValue, setActiveBtnValue] = useState("createPofessionalTax");
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

  const createProfessionalTax = [
    {
      id: 0,
      value: 0,
      title: "Professional Tax",
      data: "createPofessionalTax",
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
      setActiveBtnValue(createProfessionalTax?.[activeBtn + 1].data);
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
        !UpdateBtn ? t("Pofessional Tax") : t("Update Pofessional Tax"),
        !UpdateBtn
          ? t("Manage Pofessional Tax")
          : t("Update Selected Pofessional Tax"),
      ]}
      footerBtn={[t("Cancel"), t("Save")]}
      stepsData={createProfessionalTax}
      buttonClick={(e) => {
        if (activeBtnValue === "createPofessionalTax") {
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
          setActiveBtnValue(createProfessionalTax?.[activeBtn - 1].data);
        }
      }}
      nextStep={nextStep}
      activeBtn={activeBtn}
      saveAndContinue={true}
    >
      <FlexCol className={"max-w-[926px] mx-auto"}>
        {createProfessionalTax && (
          <Flex justify="center">
            <div className=" sticky -top-6  z-50 px-5 dark:bg-[#1f1f1f] w-full sm:w-2/5 pb-6 ">
              <Stepper
                steps={createProfessionalTax}
                currentStepNumber={activeBtn}
                presentage={presentage}
              />
            </div>
          </Flex>
        )}
        {activeBtnValue === "createPofessionalTax" ? (
          <FlexCol className="relative w-full h-full">
            <FlexCol className="box-wrapper gap-6">
              <Heading2
                title={t("Pofessional Tax")}
                description="Manage Pofessional Tax"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <FormInput
                  title={t("PTRC Number")}
                  placeholder={t("PTRC Number")}
                  required={true}
                />
                <Dropdown title={t("State")} placeholder={t("Choose state")} />

                <Dropdown
                  title={t("Deduction Frequency")}
                  placeholder={t("Choose")}
                />
                <Dropdown
                  title={t("Exception Month")}
                  placeholder={t("Choose")}
                />
              </div>
            </FlexCol>

            <FlexCol className="box-wrapper gap-6">
              <Heading2 title="Tax Slabs Based On Gross Salary" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-around">
                <FormInput
                  title={t("Start Range")}
                  placeholder={t("Start Range")}
                />
                <FormInput
                  title={t("End Range")}
                  placeholder={t("End Range")}
                />
                <FormInput
                  title={t("Tax Amount")}
                  placeholder={t("Tax Amount")}
                />
              </div>
              <div className="relative flex gap-3  items-center px-[5px] py-[10px]">
                <IoMdAdd className="group hover:bg-primary  hover:text-white  bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium cursor-pointer" />
                <p className="text-xs font-medium cursor-pointer dark:text-white">
                  {t("Additional Slab")}
                </p>
              </div>
            </FlexCol>
          </FlexCol>
        ) : (
          <EmployeeCheck
            title={t("Assign Pofessional Tax")}
            description={t("Assign Employees For Pofessional Tax")}
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
