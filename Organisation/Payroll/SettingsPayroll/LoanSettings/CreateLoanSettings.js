import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { Flex } from "antd";
import DrawerPop from "../../../../common/DrawerPop";
import FormInput from "../../../../common/FormInput";
import TextArea from "../../../../common/TextArea";
import FlexCol from "../../../../common/FlexCol";
import { RxQuestionMarkCircled } from "react-icons/rx";
import Accordion from "../../../../common/Accordion";
import { PiLockOpenBold } from "react-icons/pi";
import { TbSettingsCheck } from "react-icons/tb";
import PAYROLLAPI, {
  Payrollaction,
  payrollFileAction,
} from "../../../../PayRollApi";
import FileUpload from "../../../../common/FileUpload";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import Dropdown from "../../../../common/Dropdown";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function CreateLoanSettings({
  open,
  close = () => {},
  refresh,
}) {
  const { t } = useTranslation();

  const [addCreateLoanSettings, setCreateLoanSettings] = useState(open);
  const [activeBtnValue, setActiveBtnValue] = useState("loanSettings");
  const [customRate, setCustomRate] = useState(1);
  const [customRateRepayemnts, setCustomRateRepayments] = useState(1);
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );

  const [amountTypeValue, setAmountTypeValue] = useState("fixedRate");
  const [repaymentTypeValue, setRepaymentTypeValue] = useState("fixedRate");
  const [loading, setLoading] = useState(false);

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [functionRender, setFunctionRender] = useState(false);

  useMemo(
    () =>
      setTimeout(() => {
        addCreateLoanSettings === false && close(false);
      }, 800),
    [addCreateLoanSettings]
  );
  const handleClose = () => {
    close();
    setCreateLoanSettings(false);
  };

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  const MonthList = [
    {
      label: "6 months",
      value: "6",
    },
    {
      label: "12 months",
      value: "12",
    },
    {
      label: "18 months",
      value: "18",
    },
    {
      label: "24 months",
      value: "24",
    },
  ];
  const formik = useFormik({
    initialValues: {
      loanPolicyName: "",
      description: "",
      minimumJobTenure: null,
      AmountType: "",
      minimumValue: "",
      maximumValue: "",
      percentageOfGrossSalary: "",
      repaymentTenure: "",
      file: "",
    },
    enableReinitialize: true,
    validateOnChange: false,

    validationSchema: yup.object().shape({
      loanPolicyName: yup
        .string()
        .required("Name is required")
        .matches(
          /^[a-zA-Z\s]+$/,
          "Tamplate name can contain letters and spaces only; it must not contain numbers or special characters"
        ),
      minimumJobTenure: yup
        .string()
        .required("Minimum job tenure is required")
        .matches(/^(?!0)\d+$/, "Value must not start with 0"),
      // AmountType : yup.number().required("amount type is required"),
      minimumValue: yup
        .string()
        .required("Minimum value is required")

        .matches(/^(?!0)\d+$/, "Value must not start with 0"),
      // minimumValue: yup.string()
      //  .when('amountTypeValue', {
      //    is: 'fixedRate', // Condition to check if amountTypeValue is 'fixedRate'
      //   then: yup.string().required("Minimum Loan Amount is required"),
      //   otherwise: yup.string().required("Minimum percentage of gross pay")
      //  }),
      maximumValue: yup
        .string()
        .required("Maximum value is required")
        .matches(/^(?!0)\d+$/, "Value must not start with 0"),

      repaymentTenure: yup
        .string()
        .required("Maximum installment is required")
        .matches(/^(?!0)\d+$/, "Value must not start with 0"),
      description: yup.string().required("Description is required"),
    }),
    onSubmit: async (e) => {
      setLoading(true);

      try {
        if (updateId) {
          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_Loan_Settings_RECORD_BY_ID,
            {
              id: updateId,
              companyId: companyId,
              loanPolicyName:
                formik.values.loanPolicyName.charAt(0).toUpperCase() +
                formik.values.loanPolicyName.slice(1),
              description: formik.values.description,
              minimumJobTenure: formik.values.minimumJobTenure,
              AmountType: amountTypeValue,
              minimumValue: formik.values.minimumValue,
              maximumValue: formik.values.maximumValue,
              percentageOfGrossSalary: formik.values.percentageOfGrossSalary,
              repaymentType: repaymentTypeValue,
              repaymentTenure: formik.values.repaymentTenure,
              isActive: 1,
              createdBy: loggedEmployeeId,
            }
          );
          if (result.status === 200) {
            openNotification("success", "Update Successful", result.message);

            setTimeout(() => {
              handleClose();
              // close()
              setFunctionRender(!functionRender);
              setLoading(false);
            }, 1000);

            if (result.status === 200) {
              openNotification("success", "Successful", result.message);
              setTimeout(() => {
                handleClose();
                setFunctionRender(!functionRender);
                refresh();
                formik.resetForm();
                setLoading(false);
              }, 1000);
              formik.resetForm();
              const loanPolicyIdForImage = updateId;

              if (e.file) {
                // Prepare form data for file upload
                const formData = new FormData();
                formData.append("action", "LoanAgreementFileUpload");
                formData.append("loanPolicyId", loanPolicyIdForImage);
                formData.append("file", e.file);
                // Upload the file
                const fileResult = await payrollFileAction(formData);

                // Handle the file upload response
                if (fileResult.status === 200) {
                  openNotification(
                    "success",
                    "File uploaded successfully",
                    fileResult.message,
                    () => {
                      handleClose();
                      refresh();
                      setLoading(false);
                    }
                  );
                } else {
                  openNotification(
                    "error",
                    "File upload failed",
                    fileResult.message
                  );
                  setLoading(false);
                }
              }
            } else if (result.status !== 200) {
              openNotification("error", "Info", result.message);
              setLoading(false);
            } else if (result.status === 500) {
              openNotification("error", "Info", result.message);
              setLoading(false);
            }
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
          }
        } else {
          const result = await Payrollaction(
            PAYROLLAPI.CREATE_Loan_Settings_RECORD,
            {
              companyId: companyId,
              loanPolicyName: e.loanPolicyName,
              description: e.description,
              minimumJobTenure: e.minimumJobTenure,
              AmountType: amountTypeValue,
              minimumValue: e.minimumValue,
              maximumValue: e.maximumValue,
              percentageOfGrossSalary: e.percentageOfGrossSalary,
              repaymentType: repaymentTypeValue,
              repaymentTenure: e.repaymentTenure,
              isActive: 1,
              createdBy: loggedEmployeeId,
            }
          );
          if (result.status === 200) {
            openNotification("success", "Successful", result.message, () => {
              handleClose();
              refresh();
              setLoading(false);
            });

            const loanPolicyIdForImage = result.result.insertedId;

            if (e.file) {
              // Prepare form data for file upload
              const formData = new FormData();
              formData.append("action", "LoanAgreementFileUpload");
              formData.append("loanPolicyId", loanPolicyIdForImage);
              formData.append("file", e.file);

              // Upload the file
              const fileResult = await payrollFileAction(formData);

              // Handle the file upload response
              if (fileResult.status === 200) {
                openNotification(
                  "success",
                  "File uploaded successfully",
                  fileResult.message,
                  () => {
                    handleClose();
                    refresh();
                    setLoading(false);
                  }
                );
              } else {
                openNotification(
                  "error",
                  "File upload failed",
                  fileResult.message
                );
                setLoading(false);
              }
            }
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
          setTimeout(() => {
            handleClose();
            // close()
            setFunctionRender(!functionRender);
            refresh();
          }, 1000);
        }
      } catch (error) {
        openNotification("error", "Info", error);
        setLoading(false);
      }
    },
  });

  const Formik2 = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object({}),
    onSubmit: async (e) => {},
  });

  const Formik3 = useFormik({
    initialValues: {
      overtimePolicyName: "",
      // isTrackOverTime: false,
      // isRequestOverTime: false,
      maximumOverTimePerMonth: "",
      hourlyRate: "",
      // offType: "",
      halfDay: "",
      fullDay: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object({
      overtimePolicyName: yup
        .string()
        .required("Overtime Policy Name is Required"),
    }),
    onSubmit: async (e) => {},
  });

  const CreateLoanSteps = [
    // {
    //   id: 0,
    //   value: 0,
    //   title: "Loan Settings",
    //   data: "loanSettings",
    // },
    // {
    //   id: 1,
    //   value: 1,
    //   title: "Assign",
    //   data: "assign",
    // },
  ];

  // useEffect(() => {
  //   if (activeBtn < 1 && activeBtn !== nextStep) {
  //     setActiveBtn(1 + activeBtn);
  //     setActiveBtnValue(CreateLoanSteps?.[activeBtn + 1].data);
  //   }
  // }, [nextStep]);

  const navigateBtn = [
    { id: 1, title: t("Employees"), value: "employees" },
    { id: 2, title: t("Groups"), value: "Groups" },
    { id: 3, title: t("Departments"), value: "departments" },
    { id: 4, title: t("Locations"), value: "locations" },
  ];
  const [activeTab, setActiveTab] = useState(navigateBtn[0].id);

  const LoanAmounts = [
    {
      id: 1,
      title: "Fixed Amount",
      description: "Defined max amount",
      image: (
        <PiLockOpenBold className="active:text-primary focus:text-primary" />
      ),
      value: "fixedRate",
    },
    {
      id: 2,
      title: "Percentage of Salary",
      description: "Max percent of gross salary",
      image: (
        <TbSettingsCheck className="active:text-primary focus:text-primary" />
      ),
      value: "customRate",
    },
  ];

  const Repayments = [
    {
      id: 1,
      title: "Static",
      description: "Defined max no of installments",
      image: (
        <PiLockOpenBold className="active:text-primary focus:text-primary" />
      ),
      value: "fixedRate",
    },
    {
      id: 2,
      title: "Flexible",
      description: "Employees work from an office",
      image: (
        <TbSettingsCheck className="active:text-primary focus:text-primary" />
      ),
      value: "customRate",
    },
  ];

  const getLoanSettingsRecordsById = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await Payrollaction(
        PAYROLLAPI.GET_Loan_Settings_RECORDS_BY_ID,
        {
          id: e,
        }
      );
      if (result.result && result.result.length > 0) {
        const record = result.result[0];
        formik.setFieldValue("loanPolicyName", record.loanPolicyName);
        formik.setFieldValue("minimumJobTenure", record.minimumJobTenure);
        formik.setFieldValue("AmountType", record.AmountType);
        formik.setFieldValue("minimumValue", record.minimumValue);
        formik.setFieldValue("maximumValue", record.maximumValue);
        formik.setFieldValue("repaymentType", record.repaymentType);
        formik.setFieldValue("repaymentTenure", record.repaymentTenure);
        formik.setFieldValue("description", record.description);
        formik.setFieldValue("loanAgreementFile", record.loanAgreementFile);
      } else {
        console.log("No data found for the given ID");
      }
    }
  };

  useEffect(() => {
    getLoanSettingsRecordsById(updateId);
  }, [updateId]);
  return (
    <DrawerPop
      placement="bottom"
      open={addCreateLoanSettings}
      close={(e) => {
        // console.log(e);
        handleClose();
      }}
      contentWrapperStyle={{
        position: "absolute",
        height: "100%",
        top: 0,
        // left: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        borderRadius: 0,
        borderTopLeftRadius: "0px !important",
        borderBottomLeftRadius: 0,
      }}
      header={[
        !updateId ? t("Create_Loan_Settings") : t("Update_Loan_Settings"),
        !updateId
          ? t("Create_Loan_Settings_By_Simple_Steps")
          : t("Update Loan Settings By Simple Steps"),
      ]}
      headerRight={
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5">
            <p className="text-sm font-medium text-gray-400">{t("Help")}</p>
            <RxQuestionMarkCircled className="text-2xl font-medium text-gray-400 " />
          </div>
        </div>
      }
      footerBtn={[t("Cancel"), !updateId ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
      className="widthFull"
      stepsData={CreateLoanSteps}
      // buttonClick={(e) => {
      //   console.log(activeBtnValue);
      //   if (activeBtnValue === "loanSettings") {
      //     formik.handleSubmit();
      //     // Update activeBtnValue and nextStep to navigate to the next step
      //     // setActiveBtnValue("assign");
      //     // setNextStep(nextStep + 1);
      //     console.log("click 1");
      //   } else if (activeBtnValue === "assign") {
      //     console.log("click 2");
      //     Formik2.handleSubmit();
      //     // You may also want to update activeBtnValue and nextStep here
      //     // depending on your navigation flow
      //   }
      // }}
      handleSubmit={(e) => {
        formik.handleSubmit();
      }}
      // buttonClickCancel={(e) => {
      //   if (activeBtn > 0) {
      //     setActiveBtn(activeBtn - 1);
      //     setNextStep(nextStep - 1);
      //     setActiveBtnValue(CreateLoanSteps?.[activeBtn - 1].data);
      //     console.log(activeBtn - 1);
      //   }
      //   //   setBtnName("");
      // }}
      // nextStep={nextStep}
      // activeBtn={activeBtn}
      // saveAndContinue={true}
    >
      <FlexCol>
        {CreateLoanSteps && (
          <Flex justify="center">
            {/* <div className=" sticky -top-6  z-50 px-5  w-2/5 pb-3 ">
              <Stepper
                steps={CreateLoanSteps}
                currentStepNumber={activeBtn}
                presentage={presentage}
              />
            </div> */}
          </Flex>
        )}
        {activeBtnValue === "loanSettings" ? (
          <>
            <Flex justify="center" align="center" className="w-full">
              <FlexCol className={"md:grid grid-cols-2 md:w-3/5 items-end p-1"}>
                <Accordion
                  title={t("General")}
                  description={t("Setup_basic_settings_details")}
                  padding={false}
                  initialExpanded={true}
                  className="Text_area col-span-2 "
                >
                  <div className="grid grid-cols-2 gap-4 p-3 dark:bg-dark dark:text-white">
                    <FormInput
                      title={t("Name")}
                      className=" col-span-2 w-3/5"
                      placeholder={t("Name")}
                      change={(e) => {
                        formik.setFieldValue("loanPolicyName", e);
                      }}
                      value={formik.values.loanPolicyName}
                      error={formik.errors.loanPolicyName}
                      required="true"
                    />

                    {/* <FormInput
                      title={t("Job Tenure")}
                      className="col-span-2 w-3/5"
                      placeholder={t("Job Tenure in months")}

                      change={(e) => {
                        const value = e.replace(/[^0-9]/g, "");
                        formik.setFieldValue("minimumJobTenure", value);
                      }}
                      value={formik.values.minimumJobTenure}
                      error={formik.errors.minimumJobTenure}
                      required="true"  223
                    /> */}

                    <div className="max-w-[223px]">
                      <Dropdown
                        title={t("Job Tenure")}
                        placeholder={t("Job Tenure in months")}
                        change={(e) => {
                          formik.setFieldValue("minimumJobTenure", e);
                        }}
                        options={MonthList}
                        value={formik.values.minimumJobTenure}
                        error={formik.errors.minimumJobTenure}
                        required="true"
                      />
                    </div>

                    <TextArea
                      className=" col-span-2 w-6/12"
                      title={t("Description")}
                      placeholder={t("Description")}
                      change={(e) => {
                        formik.setFieldValue("description", e);
                      }}
                      value={formik.values.description}
                      error={formik.errors.description}
                      required="true"
                    />
                  </div>
                </Accordion>
              </FlexCol>
            </Flex>

            <Flex justify="center" align="center" className="w-full">
              <FlexCol className={"md:grid grid-cols-2 md:w-3/5 items-end p-1"}>
                <Accordion
                  title={t("Loan_amounts")}
                  description={t(
                    "Setup_loan_limits_that_employees_can_apply_for"
                  )}
                  padding={false}
                  initialExpanded={true}
                  className="Text_area col-span-2"
                >
                  <div className="md:grid grid-cols-12 flex flex-col gap-6 dark:text-white translate-y-3 pl-3">
                    {LoanAmounts?.map((each, i) => (
                      <div
                        key={i}
                        className={`col-span-12 md:col-span-6 lg:col-span-4 p-4 borderb rounded-2xl cursor-pointer showDelay dark:bg-dark ${
                          customRate === each.id && "border-primary"
                        }`}
                        onClick={() => {
                          setCustomRate(each.id);
                          // Update AmountType state with selected value
                          setAmountTypeValue(each.value);
                          formik.setFieldValue("AmountType", each.value);
                        }}
                        value={formik.values.AmountType}
                        error={formik.errors.AmountType}
                        required="true"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex gap-2 h-16">
                            <div
                              className={`${
                                customRate === each.id && "text-primary"
                              } p-6 border rounded-mdx w-fit bg-[#F8FAFC] dark:text-dark`}
                            >
                              {each.image}
                            </div>

                            <span>
                              <h3 className="text-sm font-semibold">
                                {each.title}
                              </h3>

                              <p className="text-xs font-medium text-[#667085]">
                                {each.description}
                              </p>
                            </span>
                          </div>
                          <div
                            className={`${
                              customRate === each.id && "border-primary"
                            } border rounded-full`}
                          >
                            <div
                              className={`font-semibold text-base w-4 h-4 border-2 border-white rounded-full ${
                                customRate === each.id &&
                                "text-primary bg-primary"
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {amountTypeValue === "fixedRate" ? (
                    // If "fixedRate" is selected, render input fields for minimum and maximum loan amounts
                    <div className="flex flex-col gap-6 dark:text-white w-3/5">
                      <div className="flex gap-6 justify-between items-start p-3">
                        <FormInput
                          title={t("Minimum_Loan_Amount")}
                          placeholder={t("Minimum Loan Amount")}
                          change={(e) => {
                            const value = e.replace(/[^0-9.]/g, "");
                            formik.setFieldValue("minimumValue", value);
                          }}
                          value={formik.values.minimumValue}
                          error={formik.errors.minimumValue}
                          required="true"
                          maxLength={10}
                        />

                        <FormInput
                          title={t("Maximum_Loan_Amount")}
                          placeholder={t("Maximum Loan Amount")}
                          change={(e) => {
                            const value = e.replace(/[^0-9.]/g, "");
                            formik.setFieldValue("maximumValue", value);
                          }}
                          value={formik.values.maximumValue}
                          error={formik.errors.maximumValue}
                          required="true"
                          maxLength={10}
                        />
                      </div>
                    </div>
                  ) : (
                    // If "customRate" is selected, render input fields for minimum and maximum percentage of gross pay
                    <div className="flex flex-col gap-6 dark:text-white w-3/5">
                      <div className="flex gap-6 justify-between items-start p-3">
                        <FormInput
                          title={t("Minimum percentage of gross pay")}
                          placeholder={t("Minimum percentage of gross pay")}
                          change={(e) => {
                            const value = e.replace(/[^0-9.]/g, "");
                            if (!isNaN(value)) {
                              // Limit the value to a maximum of 100%
                              const finalValue = value > 100 ? 100 : value;
                              formik.setFieldValue("minimumValue", finalValue);
                            }
                          }}
                          value={formik.values.minimumValue}
                          error={formik.errors.minimumValue}
                          required="true"
                        />

                        <FormInput
                          title={t("Maximum percentage of gross pay")}
                          placeholder={t("Maximum percentage of gross pay")}
                          change={(e) => {
                            const value = e.replace(/[^0-9.]/g, "");
                            if (!isNaN(value)) {
                              // Limit the value to a maximum of 100%
                              const finalValue = value > 100 ? 100 : value;

                              formik.setFieldValue("maximumValue", finalValue);
                            }
                          }}
                          value={formik.values.maximumValue}
                          error={formik.errors.maximumValue}
                          required="true"
                        />
                      </div>
                    </div>
                  )}
                </Accordion>
              </FlexCol>
            </Flex>

            <Flex justify="center" align="center" className="w-full">
              <FlexCol
                className={"md:grid md:grid-cols-2 md:w-3/5 items-end  p-1"}
              >
                <Accordion
                  title={t("Repayments")}
                  description={t(
                    "Configure_the_repayment_structure_available_to_the_employees"
                  )}
                  padding={false}
                  initialExpanded={true}
                  className="Text_area col-span-2 "
                >
                  <div className="md:grid grid-cols-12 flex flex-col gap-6 dark:text-white translate-y-3 pl-3">
                    {Repayments?.map((each, i) => (
                      <div
                        key={i}
                        className={`col-span-12 md:col-span-6 lg:col-span-4 p-4 borderb rounded-2xl cursor-pointer showDelay dark:bg-dark  ${
                          customRateRepayemnts === each.id && "border-primary "
                        } `}
                        onClick={() => {
                          setCustomRateRepayments(each.id);
                          setRepaymentTypeValue(each.value);
                          formik.setFieldValue("repaymentType", each.value);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className=" flex gap-2 h-16">
                            <div
                              className={`${
                                customRateRepayemnts === each.id &&
                                " text-primary  "
                              } p-6 border rounded-mdx w-fit bg-[#F8FAFC] dark:text-dark`}
                            >
                              {each.image}
                            </div>

                            <span>
                              <h3 className=" text-sm font-semibold ">
                                {each.title}
                              </h3>

                              <p className=" text-xs font-medium text-[#667085] ">
                                {each.description}
                              </p>
                            </span>
                          </div>

                          <div
                            className={`${
                              customRateRepayemnts === each.id &&
                              "border-primary"
                            } border  rounded-full`}
                          >
                            <div
                              className={`font-semibold text-base w-4 h-4 border-2 border-white   rounded-full ${
                                customRateRepayemnts === each.id &&
                                "text-primary bg-primary"
                              } `}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-6 dark:text-white p-3">
                    <div className="flex gap-3 items-start">
                      <FormInput
                        title={t("Maximum_installment_in_months")}
                        placeholder={t("Maximum Installment in Months")}
                        change={(e) => {
                          const value = e.replace(/[^0-9.]/g, "");
                          formik.setFieldValue("repaymentTenure", value);
                        }}
                        value={formik.values.repaymentTenure}
                        error={formik.errors.repaymentTenure}
                        required="true"
                        maxLength={10}
                      />

                      {/* <div className="flex items-center gap-3 p-6">
                        <ToggleBtn value={t("Activated")} />
                        <span className="flex text-xs text-gray-500 dark:text-white relative gap-1">
                          {t("Differ_1st_loan_repayment_installment_from_the_initial_pay_cycle")}
                          <span className="text-xs">
                            <Tooltip placement="top" title=" If the employee leaves the organisation before the loan is settled, the remaining balance is deducted from the end-of-service settlement.">
                              <IoMdInformationCircleOutline className="text-blue-500 absolute  md:text-base " />
                            </Tooltip>
                          </span>
                        </span>
                      </div> */}
                    </div>
                  </div>
                </Accordion>
              </FlexCol>
            </Flex>

            <Flex justify="center" align="center" className="w-full">
              <FlexCol className={"md:grid grid-cols-2 md:w-3/5 items-end p-1"}>
                <Accordion
                  title={t("Loan_Agreement_Optional")}
                  description={t(
                    "You may upload a loan agreement document here"
                  )}
                  padding={false}
                  initialExpanded={true}
                  className="Text_area col-span-2"
                >
                  <div className="col-span-1 p-3 dark:text-white">
                    {/* <p>{t("Upload a file")}</p> */}
                    <div className="mt-2">
                      <FileUpload
                        change={(e) => {
                          formik.setFieldValue("file", e);
                          formik.setFieldValue("loanAgreementFile", e);
                        }}
                      />
                      {/* Display the file name or URL */}

                      {formik.values.loanAgreementFile &&
                        typeof formik.values.loanAgreementFile === "string" && (
                          <div className="mt-2">
                            {/* <p>{t("Current file:")}</p> */}
                            <a
                              href={formik.values.loanAgreementFile}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {formik.values.loanAgreementFile
                                .split("?")[0]
                                .split("/")
                                .pop()}
                            </a>
                          </div>
                        )}
                    </div>
                  </div>
                </Accordion>
              </FlexCol>
            </Flex>
          </>
        ) : (
          <Flex justify="center" align="center" className="w-full">
            {/* <FlexCol
              className={
                "md:grid grid-cols-2 w-3/5 items-end  p-4  "
              }
            >
 
 
              <Accordion
 
                title={t("Assign")}
                padding={false}
                className="Text_area col-span-2"
              >
 
 
                <div className="flex flex-col gap-6 ">
                  <div className="flex flex-col gap-6 w-11/12 mx-auto">
 
                    <div className="flex gap-6 justify-between translate-y-2">
                      {navigateBtn && (
                        <div className="flex gap-2 p-[6px] bg-[#FAFAFA] dark:bg-secondaryDark border border-black border-opacity-10 rounded-xl ">
                          {navigateBtn?.map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => {
                                setAllSelect(false);
                                console.log(tab.value);
                                //  tabClick(tab.value);
                                setAssignBtnName(tab.value);
                                setActiveTab(tab.id);
                                //  setTabName(tab.value);
                              }}
                              className={`${activeTab === tab.id ? "" : ""
                                } text-sm font-medium whitespace-nowrap py-3 px-[18px] relative rounded-lg group`}
                            >
                              {activeTab === tab.id && (
                                <motion.div
                                  layoutId="bubble"
                                  className="absolute inset-0 z-10 rounded-lg bg-accent"
                                  transition={{ type: "spring", duration: 0.6 }}
                                ></motion.div>
                              )}
                              <span
                                className={`${activeTab === tab.id
                                  ? "relative z-20 text-white"
                                  : " text-black dark:text-white group-hover:text-primary"
                                  }`}
                              >
                                {tab.title}
                              </span>
                            </button>
                          ))}
 
                        </div>
 
                      )}
                      <div className="flex justify-between">
                        <FilterBtn />
                      </div>
 
 
                    </div>
 
                    <SearchBox
                      className="w-full"
                      placeholder={t("Search_Employees")}
                    />
 
                  </div>
 
                  <div className=" flex flex-col gap-8 translate-x-12 dark:text-white">
                    <div className="md:grid md:items-center flex flex-col grid-cols-12 gap-3 ">
                      <div className="flex items-center col-span-5">
                        <div className="flex items-center justify-between">
                          <CheckBoxInput
 
                          >
                            Select All
                          </CheckBoxInput>
                        </div>
                        <p>Select All</p>
                        <p className="mb-0 text-sm font-semibold text-accent ps-8">
                          1 employee selected
                        </p>
                      </div>
 
                    </div>
 
                    <List>
 
 
 
                    </List>
                  </div>
 
                </div>
              </Accordion>
            </FlexCol> */}
          </Flex>
        )}
      </FlexCol>
    </DrawerPop>
  );
}
