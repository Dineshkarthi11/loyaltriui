import React, { useMemo, useState, useEffect } from "react";
import DrawerPop from "../../../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";
import FormInput from "../../../../common/FormInput";
import FlexCol from "../../../../common/FlexCol";
import Dropdown from "../../../../common/Dropdown";
import CheckBoxInput from "../../../../common/CheckBoxInput";
import { FiSettings } from "react-icons/fi";
import ButtonClick from "../../../../common/Button";
import { PiEye, PiEyeSlash } from "react-icons/pi";
import EmployeeCheck from "../../../../common/EmployeeCheck";
import { Flex } from "antd";
import Stepper from "../../../../common/Stepper";
import localStorageData from "../../../../../common/Functions/localStorageKeyValues";

export default function EmpProvidentFund({
  open,
  close = () => {},
  updateId,
  refresh,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setUpdateBtn] = useState(false);
  const [View, setView] = useState(false);

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

  const [activeBtn, setActiveBtn] = useState(0);
  const [presentage, setPresentage] = useState(0);
  const [nextStep, setNextStep] = useState(0);
  const [activeBtnValue, setActiveBtnValue] = useState("employeeDetails"); //assign

  const [employerRateOptions, setEmployerRateOptions] = useState([]);
  const [employeeRateOptions, setEmployeeRateOptions] = useState([]);
  const [includeEmployerContribution, setIncludeEmployerContribution] =
    useState(false);
  const [
    includeEmployersEDLIContributionInCTC,
    setIncludeEmployersEDLIContributionInCTC,
  ] = useState(false);
  const [includeAdminChargesInCTC, setIncludeAdminChargesInCTC] =
    useState(false);
  const [overRidePFContributionCheck, setOverRidePFContributionCheck] =
    useState(false);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
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

  useEffect(() => {
    if (activeBtn < 2 && activeBtn !== nextStep) {
      setActiveBtn(1 + activeBtn);
      setActiveBtnValue(stepperMenu?.[activeBtn + 1].data);
    }
  }, [nextStep]);

  const navigateBtn = [
    { id: 1, value: "Employees", title: "Employees" },
    { id: 2, value: "Departments", title: "Departments" },
    { id: 3, value: "Locations", title: "Locations" },
  ];

  const formik = useFormik({
    initialValues: {
      establishmentCode: "",
      employerContributionRate: "",
      employeeContributionRate: "",
      employerWageLimit: "",
      employeeWageLimit: "",
      includeEmployersEDLIContributionInCTC: false,
      includeAdminChargesInCTC: false,
    },
    validationSchema: yup.object().shape({
      establishmentCode: yup
        .string()
        .matches(
          /^[a-zA-Z0-9]{10}$/,
          t("EPF Establishment Code must be 10 characters alphanumeric")
        )
        .required(t("EPF Establishment Code is required")),
      employerContributionRate: yup
        .string()
        .required(t("Employer Contribution Rate is required")),
      employeeContributionRate: yup
        .string()
        .required(t("Employee Contribution Rate is required")),
      employerWageLimit: yup
        .number()
        .min(15000, t("Cannot be less than 15000"))
        .when("employerContributionRate", {
          is: (val) => val && val.includes("Restrict Contribution to"),
          then: yup
            .number()
            .required(t("Employer PF Wage Restriction Limit is required")),
        })
        .test(
          "compare-wage-limits",
          t("Cannot be greater than Employee PF wage restriction limit"),
          function (value) {
            const { employeeWageLimit } = this.parent;
            return value <= employeeWageLimit;
          }
        ),
      employeeWageLimit: yup
        .number()
        .min(15000, t("Cannot be less than 15000"))
        .when("employeeContributionRate", {
          is: (val) => val && val.includes("Restrict Contribution to"),
          then: yup
            .number()
            .required(t("Employee PF Wage Restriction Limit is required"))
            .test(
              "compare-wage-limits",
              t("Cannot be less than Employer PF wage restriction limit"),
              function (value) {
                const { employerWageLimit } = this.parent;
                return value >= employerWageLimit;
              }
            ),
        }),
    }),
    onSubmit: (values) => {
      const employerContribution = {
        percent: 12,
        type: values.employerContributionRate.includes("unrestricted")
          ? "unrestricted"
          : "restricted",
        value: values.employerContributionRate.includes("unrestricted")
          ? null
          : values.employerWageLimit,
      };

      const employeeContribution = {
        percent: 12,
        type: values.employeeContributionRate.includes("unrestricted")
          ? "unrestricted"
          : "restricted",
        value: values.employeeContributionRate.includes("unrestricted")
          ? null
          : values.employeeWageLimit,
      };

      const payload = {
        id: updateId || null,
        companyId: companyId,
        config: {
          establishmentName: values.establishmentCode,
          employerContribution: employerContribution,
          employeeContribution: employeeContribution,
          employerpfwageLimit: values.employerWageLimit,
          employeepfwageLimit: values.employeeWageLimit,
          configurationData: {
            edliContribution: formik.values
              .includeEmployersEDLIContributionInCTC
              ? 1
              : 0,
            adminCharges: formik.values.includeAdminChargesInCTC ? 1 : 0,
            overRidePfContibution: overRidePFContributionCheck ? 1 : 0,
          },
        },
        isActive: 1,
        createdBy: loggedEmployeeId,
      };

      setPresentage(1);
      setNextStep(nextStep + 1);
      setActiveBtnValue("assign");
    },
  });

  useEffect(() => {
    const restrictText = "12 % of PF Wage (Restrict Contribution to ";
    const unrestrictedText = "12 % of PF wage (Unrestricted)";
    setEmployerRateOptions([
      { value: "unrestricted", label: unrestrictedText },
      {
        value: "restricted",
        label: `${restrictText}${formik.values.employerWageLimit || 15000})`,
      },
    ]);
    setEmployeeRateOptions([
      { value: "unrestricted", label: unrestrictedText },
      {
        value: "restricted",
        label: `${restrictText}${formik.values.employeeWageLimit || 15000})`,
      },
    ]);
  }, [formik.values.employerWageLimit, formik.values.employeeWageLimit]);

  useEffect(() => {
    if (formik.values.employerContributionRate === "restricted") {
      formik.setFieldValue("employerWageLimit", 15000);
    }
    if (formik.values.employeeContributionRate === "restricted") {
      formik.setFieldValue("employeeWageLimit", 15000);
    }
  }, [
    formik.values.employerContributionRate,
    formik.values.employeeContributionRate,
  ]);

  useEffect(() => {
    if (formik.values.employerContributionRate === "unrestricted") {
      formik.setFieldValue("employeeContributionRate", "unrestricted");
    }
  }, [formik.values.employerContributionRate]);

  const handleEmployerContributionChange = (checked) => {
    setIncludeEmployerContribution(checked);
    if (!checked) {
      setIncludeEmployersEDLIContributionInCTC(false);
      setIncludeAdminChargesInCTC(false);
      formik.setFieldValue("includeEmployersEDLIContributionInCTC", false);
      formik.setFieldValue("includeAdminChargesInCTC", false);
    }
  };

  const calculateEPFContributions = () => {
    const employeeWageLimit = formik.values.employeeWageLimit || 15000;
    const employerWageLimit = formik.values.employerWageLimit || 15000;

    const employeeContribution = Math.round((employeeWageLimit * 12) / 100);
    const epsContribution = Math.round(
      (Math.min(employerWageLimit, 15000) * 8.33) / 100
    );
    const epfContribution = Math.round(
      (employerWageLimit * 12) / 100 - epsContribution
    );

    let edliContribution = 0;
    let adminCharges = 0;

    if (includeEmployersEDLIContributionInCTC) {
      edliContribution = Math.round((employerWageLimit * 0.5) / 100);
      edliContribution = Math.min(edliContribution, 75);
    }

    if (includeAdminChargesInCTC) {
      adminCharges = Math.round((employerWageLimit * 0.5) / 100);
    }

    const totalEmployerContribution =
      epsContribution + epfContribution + edliContribution + adminCharges;

    return {
      employeeContribution,
      epsContribution,
      epfContribution,
      edliContribution,
      adminCharges,
      totalEmployerContribution,
    };
  };

  const {
    employeeContribution,
    epsContribution,
    epfContribution,
    edliContribution,
    adminCharges,
    totalEmployerContribution,
  } = calculateEPFContributions();

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
      placement="bottom"
      stepsData={stepperMenu}
      size="large"
      background="#F8FAFC"
      updateBtn={UpdateBtn}
      handleSubmit={(e) => {
        formik.handleSubmit();
      }}
      header={[
        !UpdateBtn
          ? t("Employee Provident Fund")
          : t("Update Employee Provident Fund"),
        !UpdateBtn
          ? t("Manage Employee Provident Fund")
          : t("Update Selected Employee Provident Fund"),
      ]}
      footerBtn={[t("Cancel"), t("Save")]}
      buttonClick={(e) => {
        if (activeBtnValue === "employeeDetails") {
          formik.handleSubmit();

          // if (!updateId) {
          // formik.handleSubmit();
          // } else {
          //   updateSscById();
          // }
          // console.log("click 1");
          // getEmployee();
        } else if (activeBtnValue === "assign") {
          // console.log("click 2");
          // if (!updateId) {
          //   Formik2.handleSubmit();
          // } else {
          //   updateUserForSscById();
          // }
        }
      }}
      buttonClickCancel={(e) => {
        if (activeBtn > 0) {
          setActiveBtn(activeBtn - 1);
          setNextStep(nextStep - 1);
          setActiveBtnValue(stepperMenu?.[activeBtn - 1].data);
        }
      }}
      nextStep={nextStep}
      activeBtn={activeBtn}
      saveAndContinue={true}
    >
      <FlexCol className="relative max-w-[926px] h-full mx-auto">
        <Flex justify="center">
          <div className="w-full max-w-[502px] z-50 pb-6 ">
            <Stepper
              steps={stepperMenu}
              currentStepNumber={activeBtn}
              presentage={presentage}
            />
          </div>
        </Flex>

        {activeBtnValue === "employeeDetails" ? (
          <>
            <div className="flex flex-col gap-6 borderb rounded-lg p-5 bg-white dark:bg-dark">
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-lg	2xl:text-xl	">
                  Employee Provident Fund
                </p>
                <p className="text-grey font-medium text-xs 2xl:text-sm">
                  Employee Provident Fund
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <FormInput
                    name="establishmentCode"
                    title={t("EPF Establishment Code")}
                    placeholder={t("Establishment Code")}
                    required={true}
                    value={formik.values.establishmentCode}
                    change={(e) => formik.setFieldValue("establishmentCode", e)}
                    onBlur={formik.handleBlur}
                    error={
                      formik.errors.establishmentCode &&
                      formik.touched.establishmentCode
                        ? formik.errors.establishmentCode
                        : ""
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Dropdown
                      name="employerContributionRate"
                      title={t("Employer Contribution Rate")}
                      options={employerRateOptions}
                      required={true}
                      value={formik.values.employerContributionRate}
                      change={(e) =>
                        formik.setFieldValue("employerContributionRate", e)
                      }
                      onBlur={formik.handleBlur}
                      error={
                        formik.errors.employerContributionRate &&
                        formik.touched.employerContributionRate
                          ? formik.errors.employerContributionRate
                          : ""
                      }
                    />
                    {formik.values.employerContributionRate ===
                      "restricted" && (
                      <FormInput
                        name="employerWageLimit"
                        title={t("Employer PF Wage Restriction Limit")}
                        placeholder={t("Employer PF Wage Restriction Limit")}
                        required={true}
                        value={formik.values.employerWageLimit}
                        change={(e) =>
                          formik.setFieldValue("employerWageLimit", e)
                        }
                        onBlur={formik.handleBlur}
                        error={
                          formik.errors.employerWageLimit &&
                          formik.touched.employerWageLimit
                            ? formik.errors.employerWageLimit
                            : ""
                        }
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Dropdown
                      name="employeeContributionRate"
                      title={t("Employee Contribution Rate")}
                      options={employeeRateOptions}
                      required={true}
                      value={formik.values.employeeContributionRate}
                      change={(e) =>
                        formik.setFieldValue("employeeContributionRate", e)
                      }
                      onBlur={formik.handleBlur}
                      error={
                        formik.errors.employeeContributionRate &&
                        formik.touched.employeeContributionRate
                          ? formik.errors.employeeContributionRate
                          : ""
                      }
                      disabled={
                        formik.values.employerContributionRate ===
                        "unrestricted"
                      }
                    />

                    {formik.values.employeeContributionRate ===
                      "restricted" && (
                      <FormInput
                        name="employeeWageLimit"
                        title={t("Employee PF Wage Restriction Limit")}
                        placeholder={t("Employee PF Wage Restriction Limit")}
                        required={true}
                        value={formik.values.employeeWageLimit}
                        change={(e) =>
                          formik.setFieldValue("employeeWageLimit", e)
                        }
                        onBlur={formik.handleBlur}
                        error={
                          formik.errors.employeeWageLimit &&
                          formik.touched.employeeWageLimit
                            ? formik.errors.employeeWageLimit
                            : ""
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 p-5 mt-2 bg-primaryalpha/5 rounded-xl">
              <div className="flex items-center gap-2">
                <span>
                  <FiSettings className="text-base 2xl:text-lg text-grey" />
                </span>
                <span className="font-semibold text-sm 2xl:text-base">
                  Configuration
                </span>
              </div>
              <CheckBoxInput
                titleRight="Include Employers Contribution in CTC"
                value={includeEmployerContribution}
                change={handleEmployerContributionChange}
              />
              <div className="pl-1 flex flex-col items-start gap-2 ml-5">
                <CheckBoxInput
                  titleRight="Include Employers EDLI Contribution in CTC"
                  disabled={!includeEmployerContribution}
                  value={includeEmployersEDLIContributionInCTC}
                  change={(checked) => {
                    setIncludeEmployersEDLIContributionInCTC(checked);
                    formik.setFieldValue(
                      "includeEmployersEDLIContributionInCTC",
                      checked
                    );
                  }}
                />
                <CheckBoxInput
                  titleRight="Include Admin Charges in CTC"
                  disabled={!includeEmployerContribution}
                  value={includeAdminChargesInCTC}
                  change={(checked) => {
                    setIncludeAdminChargesInCTC(checked);
                    formik.setFieldValue("includeAdminChargesInCTC", checked);
                  }}
                />
              </div>
              <CheckBoxInput
                titleRight="Override PF Contribution Restriction at Employee Level"
                value={overRidePFContributionCheck}
                change={(checked) => setOverRidePFContributionCheck(checked)}
              />
            </div>

            <div className="flex flex-col gap-2 mt-2 p-5 bg-primaryalpha/5 rounded-xl">
              <div className="flex flex-col gap-2 items-center md:flex-row md:justify-between">
                <p className="flex flex-col gap-1">
                  <span className="font-semibold text-sm 2xl:text-base">
                    Sample EPF Calculation
                  </span>
                  <span className="text-sm 2xl:text-base">
                    Let’s assume PF wage is ₹{" "}
                    {formik.values.employeeWageLimit || 15000}, the breakup will
                    be:
                  </span>
                </p>
                <ButtonClick
                  buttonName={View == true ? "Hide" : "View"}
                  icon={View == true ? <PiEyeSlash /> : <PiEye />}
                  handleSubmit={() => setView(!View)}
                />
              </div>
              {View && (
                <div className="borderb p-3 rounded-lg mt-3 mb-3 bg-white dark:bg-dark">
                  <div className="flex flex-col gap-2 text-xs 2xl:text-sm">
                    <div className="font-semibold">Employee Contribution</div>
                    <div className="flex items-center justify-between">
                      <span className="text-grey">
                        EPF(12% of ₹ {formik.values.employeeWageLimit || 15000}){" "}
                      </span>
                      <span className="font-medium">
                        ₹{employeeContribution}
                      </span>
                    </div>
                  </div>
                  <div className="divider-h m-auto mt-3 mb-3" />
                  <div className="flex flex-col gap-2 text-xs 2xl:text-sm">
                    <div className="font-semibold">Employer Contribution</div>
                    <div className="flex items-center justify-between">
                      <span className="text-grey">
                        EPS(8.33% of ₹{" "}
                        {Math.min(
                          formik.values.employerWageLimit || 15000,
                          15000
                        )}
                        , Max of 15000){" "}
                      </span>
                      <span className="font-medium">₹{epsContribution}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-grey">
                        EPF(12% of ₹ {formik.values.employerWageLimit || 15000}{" "}
                        - EPS)
                      </span>
                      <span className="font-medium">₹{epfContribution}</span>
                    </div>
                    {includeEmployersEDLIContributionInCTC && (
                      <div className="flex items-center justify-between">
                        <span className="text-grey">
                          EDLI(0.50% of ₹{" "}
                          {formik.values.employerWageLimit || 15000} capped at
                          75)
                        </span>
                        <span className="font-medium">₹{edliContribution}</span>
                      </div>
                    )}
                    {includeAdminChargesInCTC && (
                      <div className="flex items-center justify-between">
                        <span className="text-grey">
                          Admin Charges(0.50% of ₹{" "}
                          {formik.values.employerWageLimit || 15000})
                        </span>
                        <span className="font-medium">₹{adminCharges}</span>
                      </div>
                    )}
                  </div>
                  <div className="divider-h m-auto mt-3 mb-3" />
                  <div className="flex items-center justify-between text-xs 2xl:text-sm">
                    <span className="text-grey">Total</span>
                    <span className="font-medium">
                      ₹{totalEmployerContribution}
                    </span>
                  </div>
                </div>
              )}
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
