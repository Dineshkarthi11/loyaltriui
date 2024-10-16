import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import DrawerPop from "../../../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import FlexCol from "../../../../common/FlexCol";
import FormInput from "../../../../common/FormInput";
import Dropdown from "../../../../common/Dropdown";
import API, { action } from "../../../../Api";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import MultiSelect1 from "../../../../common/MultiSelect";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

const LabourWelfareFund = ({
  open,
  close = () => {},
  updateId,
  refresh = () => {},
  statutoryConfigurationId,
}) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [organisationList, setOrganisationList] = useState([]);
  const [deductionMonths, setDeductionMonths] = useState([]);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const [disabledMonths, setDisabledMonths] = useState([]);

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
    setLoggedEmployeeId(localStorageData.employeeId);
  }, []);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 1500),
    [show]
  );

  const getRecord = async () => {
    const result = await action(API.GET_COMPANY_ID_BASED_RECORDS, {
      id: companyId,
    });
    setOrganisationList(result.result);
  };

  useEffect(() => {
    getRecord();
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const halfYearlyPairs = {
    January: "July",
    February: "August",
    March: "September",
    April: "October",
    May: "November",
    June: "December",
    July: "January",
    August: "February",
    September: "March",
    October: "April",
    November: "May",
    December: "June",
  };

  const formik = useFormik({
    initialValues: {
      employerContribution: "",
      employeeContribution: "",
      deductionCycle: null,
      deductionMonths: [],
    },
    validationSchema: yup.object().shape({
      employerContribution: yup
        .number()
        .max(999999, t("Cannot be more than 999999"))

        .required(t("Employer’s Contribution is required"))
        .test(
          "no-leading-zero",
          "Employer’s Contribution Amount cannot start with zero",
          (value) => {
            // Convert value to string and check if it starts with '0'
            return value !== undefined && value.toString().charAt(0) !== "0";
          }
        ),
      employeeContribution: yup
        .number()
        .max(999999, t("Cannot be more than 999999"))
        .required(t("Employee’s Contribution is required"))
        .test(
          "no-leading-zero",
          "Employee’s Contribution Amount Cannot start with zero",
          (value) => {
            // Convert value to string and check if it starts with '0'
            return value !== undefined && value.toString().charAt(0) !== "0";
          }
        ),
      deductionCycle: yup.string().required(t("Deduction Cycle is required")),
      deductionMonths: yup.array().when("deductionCycle", {
        is: (value) => value === "Yearly" || value === "Half-Yearly",
        then: (schema) =>
          schema
            .min(1, t("Deduction Month is required"))
            .required(t("Deduction Month is required")),
        otherwise: (schema) => schema.notRequired(), // Make it not required when 'Monthly' is selected
      }),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      let deductionMonth;

      if (values.deductionCycle === "Monthly") {
        deductionMonth = { startMonth: "January", endMonth: "December" };
      } else if (values.deductionCycle === "Yearly") {
        deductionMonth = {
          startMonth: values.deductionMonths[0],
          endMonth: values.deductionMonths[0],
        };
      } else {
        deductionMonth = {
          startMonth: values.deductionMonths[0],
          endMonth: values.deductionMonths[1],
        };
      }

      const payload = {
        id: statutoryConfigurationId || null,
        companyId: companyId,
        config: {
          employeeContribution: parseFloat(values.employeeContribution),
          employerContribution: parseFloat(values.employerContribution),
          deductionCycle: values.deductionCycle,
          deductionMonth: deductionMonth,
          state: organisationList.stateId,
        },
        isActive: 1,
        createdBy: loggedEmployeeId,
      };

      try {
        const result = await Payrollaction(
          PAYROLLAPI.SAVE_LWF_IN_STATUTORY_COMFIGURATION,
          payload
        );

        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 1000);
        } else if (result.status === 500) {
          openNotification("error", "Info", result.message);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during form submission:", error);
        openNotification(
          "error",
          "Info",
          "There was an error while saving the category. Please try again."
        );
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.deductionCycle === "Monthly") {
      setDeductionMonths([
        // { name: "January - December", value: "January-December" },
      ]);
    } else if (formik.values.deductionCycle === "Yearly") {
      setDeductionMonths(
        months.map((month) => ({ name: month, value: month }))
      );
    } else if (formik.values.deductionCycle === "Half-Yearly") {
      setDeductionMonths(
        months.map((month, index) => {
          // const isDisabled = formik.values.deductionMonths.length === 2;
          return {
            name: month,
            value: month,
            // disabled: isDisabled,
          };
        })
      );
    } else {
      setDeductionMonths([]);
    }
  }, [formik.values.deductionCycle, formik.values.deductionMonths]);

  const handleDeductionMonthChange = (e) => {
    const value = e;
    let newDeductionMonths = [...formik.values.deductionMonths];

    if (newDeductionMonths.includes(value)) {
      newDeductionMonths = newDeductionMonths.filter(
        (month) => month !== value
      );
    } else {
      if (
        formik.values.deductionCycle === "Half-Yearly" &&
        newDeductionMonths.length === 2
      ) {
        newDeductionMonths.push(value);
      } else {
        newDeductionMonths = [value];
      }
    }

    formik.setFieldValue("deductionMonths", newDeductionMonths);
  };

  const handleHalyYearlyMonthChange = (selectedMonths) => {
    if (selectedMonths.length === 1) {
      // If only one month is selected, automatically select its paired month
      const firstMonth = selectedMonths[0];
      const pairedMonth = halfYearlyPairs[firstMonth];

      formik.setFieldValue("deductionMonths", [firstMonth, pairedMonth]);

      // Disable all months except the selected pair
      setDisabledMonths(
        months.filter((month) => month !== firstMonth && month !== pairedMonth)
      );
    } else if (selectedMonths.length === 0) {
      // If no months are selected (user removed both), reset everything
      formik.setFieldValue("deductionMonths", []);
      setDisabledMonths([]);
    } else if (selectedMonths.length === 2) {
      // If the user tries to manually remove one of the two months, clear both
      const firstSelectedMonth = formik.values.deductionMonths[0];
      const secondSelectedMonth = halfYearlyPairs[firstSelectedMonth];

      if (
        selectedMonths.includes(firstSelectedMonth) &&
        selectedMonths.includes(secondSelectedMonth)
      ) {
        // Both months still selected, do nothing
        return;
      } else {
        // If one month is removed, clear both months
        formik.setFieldValue("deductionMonths", []);
        setDisabledMonths([]);
      }
    }
  };
  useEffect(() => {
    if (formik.values.deductionMonths.length > 0) {
      const firstMonth = formik.values.deductionMonths[0];
      const pairedMonth = halfYearlyPairs[firstMonth];
      setDisabledMonths(
        months.filter((month) => month !== firstMonth && month !== pairedMonth)
      );
    }
  }, [formik.values.deductionMonths]);

  const getLwfByIds = async () => {
    if (statutoryConfigurationId) {
      try {
        const result = await Payrollaction(PAYROLLAPI.GET_EPF_RECORDS_BY_ID, {
          id: statutoryConfigurationId,
        });

        if (result.result) {
          const config = result.result.config;

          // Set form values from the API response to formik
          formik.setFieldValue(
            "employerContribution",
            config.employerContribution
          );
          formik.setFieldValue(
            "employeeContribution",
            config.employeeContribution
          );
          formik.setFieldValue("deductionCycle", config.deductionCycle);

          // Check the deduction cycle and set the deduction months accordingly
          if (config.deductionCycle === "Yearly") {
            // For Yearly, set the startMonth and endMonth as the same month in formik deductionMonths
            const { startMonth, endMonth } = config.deductionMonth;
            formik.setFieldValue("deductionMonths", [startMonth]); // Yearly has one month, so set only the startMonth
          } else if (config.deductionCycle === "Half-Yearly") {
            // For Half-Yearly, set the startMonth and endMonth as separate values in formik deductionMonths
            const { startMonth, endMonth } = config.deductionMonth;
            formik.setFieldValue("deductionMonths", [startMonth, endMonth]); // Set both months
          }

          // Set the available months based on the deduction cycle
          if (config.deductionCycle === "Half-Yearly") {
            setDeductionMonths(
              months.map((month) => ({
                name: month,
                value: month,
                disabled: ![
                  config.deductionMonth.startMonth,
                  config.deductionMonth.endMonth,
                ].includes(month), // Disable months not in the selected deductionMonths
              }))
            );
          } else if (config.deductionCycle === "Yearly") {
            setDeductionMonths(
              months.map((month) => ({
                name: month,
                value: month,
                disabled: false, // Enable all months for Yearly
              }))
            );
          }
        } else {
          console.log("No data found for the given ID");
        }
      } catch (error) {
        console.error("Error fetching EPF records:", error);
      }
    }
  };

  useEffect(() => {
    getLwfByIds();
  }, [statutoryConfigurationId]);

  useEffect(() => {
    if (formik.values.deductionCycle === "Half-Yearly") {
      setDeductionMonths(
        months.map((month) => ({
          name: month,
          value: month,
          disabled: disabledMonths.includes(month),
        }))
      );
    }
  }, [
    formik.values.deductionCycle,
    formik.values.deductionMonths,
    disabledMonths,
  ]);

  const clearSelection = () => {
    formik.setFieldValue("deductionMonths", []);
    setDisabledMonths([]); // Re-enable all months after clearing
  };

  return (
    <DrawerPop
      open={show}
      close={handleClose}
      contentWrapperStyle={{
        width: "540px",
      }}
      header={[
        !updateId ? t("Labour Welfare Fund") : t("Update Labour Welfare Fund"),
        !updateId
          ? t("Manage Labor Welfare Fund")
          : t("Update Selected Labor Welfare Fund"),
      ]}
      footerBtn={[t("Cancel"), !updateId ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
      handleSubmit={formik.handleSubmit}
    >
      <FlexCol className="relative w-full h-full">
        <div className="font-semibold text-sm 2xl:text-base">
          {organisationList.stateName}
        </div>
        <div className="grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-2">
          <FormInput
            title={t("Employer’s Contribution Amount")}
            placeholder={t("Employer’s Contribution")}
            required={true}
            value={formik.values.employerContribution}
            change={(e) => {
              const valuedata = e.replace(/[^0-9]/g, "");
              formik.setFieldValue("employerContribution", valuedata);
            }}
            name="employerContribution"
            error={
              formik.touched.employerContribution &&
              formik.errors.employerContribution
            }
          />
          <FormInput
            title={t("Employee’s Contribution Amount")}
            placeholder={t("Employee’s Contribution")}
            required={true}
            value={formik.values.employeeContribution}
            change={(e) => {
              const valuedata = e.replace(/[^0-9]/g, "");
              formik.setFieldValue("employeeContribution", valuedata);
            }}
            name="employeeContribution"
            // type="number"
            error={
              formik.touched.employeeContribution &&
              formik.errors.employeeContribution
            }
          />
        </div>

        <div className="grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-2">
          <Dropdown
            title={t("Deduction Cycle")}
            placeholder={t("Select Deduction Cycle")}
            required={true}
            options={[
              { name: "Monthly", value: "Monthly" },
              { name: "Yearly", value: "Yearly" },
              { name: "Half-Yearly", value: "Half-Yearly" },
            ]}
            value={formik.values.deductionCycle}
            change={(e) => {
              formik.setFieldValue("deductionCycle", e);
              formik.setFieldValue("deductionMonths", []);
            }}
            error={
              formik.touched.deductionCycle && formik.errors.deductionCycle
            }
          />
          {formik.values.deductionCycle !== "Monthly" &&
            (formik.values.deductionCycle === "Half-Yearly" ? (
              <MultiSelect1
                title={t("Deduction Month")}
                placeholder={t("Select Deduction Month")}
                value={formik.values.deductionMonths}
                change={handleHalyYearlyMonthChange}
                options={deductionMonths}
                className=" text-sm "
                required={true}
                clearSelection={clearSelection}
                error={
                  formik.touched.deductionMonths &&
                  formik.errors.deductionMonths
                }
              />
            ) : (
              <Dropdown
                title={t("Deduction Month")}
                placeholder={t("Select Deduction Month")}
                required={true}
                options={deductionMonths.map((month) => ({
                  ...month,
                  disabled: month.disabled,
                  label: month.name,
                }))}
                value={formik.values.deductionMonths}
                change={handleDeductionMonthChange}
                error={
                  formik.touched.deductionMonths &&
                  formik.errors.deductionMonths
                }
                multiple={formik.values.deductionCycle === "Half-Yearly"}
                disableFilterSort={true}
              />
            ))}
        </div>
      </FlexCol>
    </DrawerPop>
  );
};

export default LabourWelfareFund;
