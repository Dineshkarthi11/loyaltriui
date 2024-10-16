import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ToggleBtn from "../../../common/ToggleBtn";
import Dropdown from "../../../common/Dropdown";
import RadioButton from "../../../common/RadioButton";
import { useFormik } from "formik";
import * as yup from "yup";
import { DaysDividerPayrollConfiguration } from "../../../data";
import PAYROLLAPI, { Payrollaction } from "../../../PayRollApi";
import FormInput from "../../../common/FormInput";
import ButtonClick from "../../../common/Button";
import Heading from "../../../common/Heading";
import { useNotification } from "../../../../Context/Notifications/Notification";
import localStorageData from "../../../common/Functions/localStorageKeyValues";

export default function PayrollConfiguration({ refresh = () => {} }) {
  const { t } = useTranslation();

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [defaultComponents, setDefaultComponents] = useState([]);

  const [payrollConfigurationId, setPayrollConfigurationId] = useState(null);
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [
    payrollConfigurationIdGetByIdData,
    setPayrollConfigurationIdGetByIdData,
  ] = useState(null);
  const [notificationToggles, setNotificationToggles] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  const formik = useFormik({
    initialValues: {
      salaryMonthStart: "",
      salaryMonthEnd: "",
      monthlyPayementDayForEmployee: "",
      monthCalculation: "",
      payDay: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      salaryMonthStart: yup
        .number()
        .required(" Salary Start Date is required")
        .integer(" Salary Start Date must be an integer")
        .min(1, " Salary Start Date must be between 1 and 28")
        .max(28, " Salary Start Date must be between 1 and 28"),
      // salaryMonthEnd: yup
      //   .number()
      //   .required("To Salary Date is required")
      //   .integer("To Salary Date must be an integer")
      //   .min(1, "To Salary Date must be between 1 and 30")
      //   .max(30, "To Salary Date must be between 1 and 30"),
      monthlyPayementDayForEmployee: yup
        .number()
        .required("Employee Payement Day is required")
        .integer("Employee Payement Day must be an integer")
        .min(1, "Employee Payement Day must be between 1 and 31")
        .max(31, "Employee Payement Day Date must be between 1 and 31"),
      monthCalculation: yup.string().required("Salary Logic is required"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      if (values.monthCalculation === "CustomDays") {
        if (!values.customNumberOfDays) {
          setFieldError("customNumberOfDays", "Custom Days is required");
          return;
        }
        if (values.customNumberOfDays < 1 || values.customNumberOfDays > 31) {
          setFieldError(
            "customNumberOfDays",
            "Custom Days must be between 1 and 31"
          );
          return;
        }
      } else {
        values.customNumberOfDays = null;
      }

      const userData = {
        salaryMonthStart: formik.values.salaryMonthStart,
        // salaryMonthEnd: formik.values.salaryMonthEnd,
        monthlyPayementDayForEmployee:
          formik.values.monthlyPayementDayForEmployee,
        monthCalculation: formik.values.monthCalculation,
        payDay: formik.values.payDay,
        notificationToggles: notificationToggles,
        customNumberOfDays: formik.values.customNumberOfDays,
      };

      const companyConfiguration = {
        user_configuration_data: [userData],
      };

      const financialYearConfiguration = {
        financial_year_data: [
          {
            financialYearId: formik.values.financialYearId,
          },
        ],
      };

      try {
        const result = await Payrollaction(
          PAYROLLAPI.UPDATE_PAYROLL_CONFIGURATION_DATA_BY_COMPANY,
          {
            id:
              payrollConfigurationId ||
              payrollConfigurationIdGetByIdData ||
              null,
            companyId: companyId,
            configuration: {
              default_components: defaultComponents,
            },
            companyConfiguration: companyConfiguration,
            financialYearConfiguration: financialYearConfiguration,
            isActive: 1,
            modifiedBy: loggedInEmployeeId,
          }
        );

        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          getEmployeePayrollConfigurationDetailsById();
          setTimeout(() => {
            refresh();
          }, 2000);
        } else if (result.status === 500) {
          openNotification("error", "Info", result.message);
        }
      } catch (error) {
        openNotification("error", "Info", error);
      }
    },
  });

  const notificationData = [
    {
      id: 1,
      subTitle: t("Salary_Slip"),
      subTitleDescription: t("Salary_Slip_description"),
    },
    {
      id: 2,
      subTitle: t("Salary_Cirtificate"),
      subTitleDescription: t("Salary_Cirtificate_description"),
    },
    {
      id: 3,
      subTitle: t("Gratuity Approval"),
      subTitleDescription: t("Grativity_Approval_description"),
    },
    {
      id: 4,
      subTitle: t("Loan_Approval"),
      subTitleDescription: t("Loan_Approval_description"),
    },
  ];

  useEffect(() => {
    fetchDefaultComponents();
  }, []);

  const fetchDefaultComponents = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_PAYROLL_CONFIGURATIONS_DATA_BY_COMPANY,
        {
          companyId: companyId,
        }
      );
      setDefaultComponents(result?.result[0].configuration.default_components);
      setPayrollConfigurationId(result?.result[0].payrollConfigurationId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleNotification = (itemId) => {
    setNotificationToggles((prevToggles) => ({
      ...prevToggles,
      [itemId]: !prevToggles[itemId] ? 1 : 0,
    }));
  };

  const getEmployeePayrollConfigurationDetailsById = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_PAYROLL_CONFIGURATIONS_DATA_BY_ID,
        {
          id: payrollConfigurationId,
        }
      );
      const userConfigData =
        result.result[0].companyConfiguration.user_configuration_data[0];
      setPayrollConfigurationIdGetByIdData(
        result.result.payrollConfigurationId
      );
      formik.setFieldValue("salaryMonthStart", userConfigData.salaryMonthStart);
      // formik.setFieldValue("salaryMonthEnd", userConfigData.salaryMonthEnd);
      formik.setFieldValue(
        "customNumberOfDays",
        userConfigData.customNumberOfDays
      );
      formik.setFieldValue(
        "monthlyPayementDayForEmployee",
        userConfigData.monthlyPayementDayForEmployee
      );
      formik.setFieldValue("monthCalculation", userConfigData.monthCalculation);
      formik.setFieldValue("payDay", userConfigData.payDay);

      setNotificationToggles(userConfigData.notificationToggles);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployeePayrollConfigurationDetailsById();
  }, [payrollConfigurationId]);

  const getFinancialYearData = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_FINANCIALYEAR_DATA,
        {
          companyId: companyId,
        }
      );

      if (result.result && result.result.length > 0) {
        const firstYearData = result.result[0];
        formik.setFieldValue("financialYearTitle", firstYearData.yearTitle);
        formik.setFieldValue("financialYearId", firstYearData.financialYearId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFinancialYearData();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <Heading
            title="Payroll Configuration"
            description={t(
              "Involves setting up and customizing the payroll system to accurately calculate and manage employee compensation and related taxes."
            )}
          />
          {/* <button onClick={formik.handleSubmit}>Update</button> */}
          <ButtonClick
            buttonName="Update"
            handleSubmit={formik.handleSubmit}
            BtnType="primary"
          />
        </div>

        <div className="relative flex flex-col gap-4 borderb p-4 rounded-[10px]">
          <div
            className={`flex flex-col  justify-center gap-0.5 dark:text-white`}
          >
            <h3 className={`h3 !font-semibold`}> {t("Payroll_Schedule")}</h3>
            <p className="para !font-medium">
              {t("Configure_your_payrol_here")}
            </p>
          </div>

          <div className="divider-h" />

          <div className="grid lg:grid-cols-10 gap-4">
            <div className="grid sm:grid-cols-2 gap-6 col-span-7 2xl:col-span-6 4xl:col-span-5">
              <Dropdown
                title={t("Salary Cycle Starts From")}
                placeholder={t(`From`)}
                className={"w-full"}
                change={(e) => {
                  formik.setFieldValue("salaryMonthStart", e);
                }}
                options={[...Array(28)].map((_, i) => ({
                  label: `${i + 1}`,
                  value: `${i + 1}`,
                }))}
                required={true}
                value={formik.values.salaryMonthStart}
                error={formik.errors.salaryMonthStart}
                type="number"
                disableFilterSort={true}
              />
              <Dropdown
                title={t("Salary_Logic")}
                className={"w-full"}
                placeholder={t("choose_here")}
                change={(e) => {
                  formik.setFieldValue("monthCalculation", e);
                }}
                required={true}
                options={DaysDividerPayrollConfiguration}
                value={formik.values.monthCalculation}
                error={formik.errors.monthCalculation}
              />
              <Dropdown
                title={t("Pay your employees on")}
                placeholder={t(`Payment Day`)}
                className={"w-full"}
                change={(e) => {
                  formik.setFieldValue("monthlyPayementDayForEmployee", e);
                }}
                value={formik.values.monthlyPayementDayForEmployee}
                error={formik.errors.monthlyPayementDayForEmployee}
                options={[...Array(31)].map((_, i) => ({
                  label: `${i + 1}`,
                  value: `${i + 1}`,
                }))}
                type="number"
                required={true}
                disableFilterSort={true}
              />
              <div className="md:pt-6">
                <RadioButton
                  title={t(
                    "If_pay_day_fails_on_non_working_day_process_payment_by"
                  )}
                  options={[
                    {
                      label: t("Previous_working_day"),
                      value: 1,
                    },
                    {
                      label: t("Next_working_day"),
                      value: 2,
                    },
                  ]}
                  value={formik.values.payDay}
                  change={(e) => {
                    formik.setFieldValue("payDay", e);
                  }}
                />
              </div>

              <FormInput
                title={t("Financial Year")}
                placeholder={t("Financial Year")}
                type="text"
                disabled={true}
                value={formik.values.financialYearTitle || ""}
              />
            </div>
            <div className="flex w-full lg:justify-end col-span-3">
              {formik.values.monthCalculation === "CustomDays" && (
                // <div className="p-2">
                <Dropdown
                  title={t("Custom Number Of Days")}
                  placeholder={t("Enter custom number of days")}
                  className={"w-full"}
                  change={(e) => {
                    formik.setFieldValue("customNumberOfDays", e);
                  }}
                  value={formik.values.customNumberOfDays}
                  error={formik.errors.customNumberOfDays}
                  type="number"
                  required={true}
                  options={[...Array(31)].map((_, i) => ({
                    label: `${i + 1}`,
                    value: `${i + 1}`,
                  }))}
                  disableFilterSort={true}
                />
                // </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative flex flex-col gap-4 borderb p-4 rounded-[10px]">
          <div
            className={`flex flex-col  justify-center gap-0.5 dark:text-white`}
          >
            <h3 className={`h3 !font-semibold`}> {t("Notifications_Email")}</h3>
            <p className="para !font-medium">
              {t("Notifications_you_get_from_email")}
            </p>
          </div>
          <div className="divider-h" />

          <div className="flex flex-col gap-5 overflow-hidden">
            {notificationData.map((item) => (
              <div
                key={item.id}
                className="flex flex-row-reverse gap-2 justify-between md:flex-row"
              >
                <div>
                  <p className="text-xs leading-normal font-semibold text-black 2xl:text-sm dark:text-white">
                    {item.subTitle}
                  </p>
                  <p className="para !font-normal">
                    {item.subTitleDescription}
                  </p>
                </div>
                <ToggleBtn
                  className="md:float-right rtl:md:float-left"
                  change={() => toggleNotification(item.id)}
                  value={notificationToggles[item.id]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
