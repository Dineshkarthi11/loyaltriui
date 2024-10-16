import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../../../common/DrawerPop";
import { useFormik } from "formik";
import FormInput from "../../../../common/FormInput";
import * as yup from "yup";
import { DatePicker } from "antd";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function CreateGrativityChanges({
  open,
  close = () => {},
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [createGrativityChanges, setGrativityChanges] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [functionRender, setFunctionRender] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );
  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  useMemo(
    () =>
      setTimeout(() => {
        createGrativityChanges === false && close(false);
      }, 800),
    [createGrativityChanges]
  );

  const handleClose = () => {
    setGrativityChanges(false);
    setUpdateId(undefined);
    localStorage.removeItem("actionidforupdate");
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

  const formik = useFormik({
    initialValues: {
      companyId: [],
      gratiutyCalculationDays: "",
      gratuityPayoutDays: "",
      gratiutyCalculationDaysContract: "",
      gratuityPayoutDaysContract: "",
      from: null,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      gratiutyCalculationDays: yup
        .number()
        .required("Calculation Days Count is required")
        .test(
          "is-greater-than-zero",
          "Calculation Days Count cannot be zero",
          (value) => value > 0
        ),
      gratuityPayoutDays: yup
        .number()
        .required("Payout Days Count is required")
        .test(
          "is-greater-than-zero",
          "Payout Days Count cannot be zero",
          (value) => value > 0
        ),
      gratiutyCalculationDaysContract: yup
        .number()
        .required("Contract Days Count is required")
        .test(
          "is-greater-than-zero",
          "Contract Days Count cannot be zero",
          (value) => value > 0
        ),
      gratuityPayoutDaysContract: yup
        .number()
        .required("Contract Payout Days Count is required")
        .test(
          "is-greater-than-zero",
          "Contract Payout Days Count cannot be zero",
          (value) => value > 0
        ),
      fromMonthYear: yup
        .number()
        // .min(0, "From Year must be at least 0")
        // .max(99, "From Year must be at most 99")
        .required("Grativity Year From is required")
        .test(
          "len",
          "From Year must be exactly 4 digits",
          (val) => val && val.toString().length === 4
        ),
      toMonthYear: yup
        .number()
        .min(yup.ref("fromMonthYear"), "To Year must be greater than From Year")
        // .max(99, "To Year must be at most 99")
        .required("Grativity Year To is required")
        .test(
          "len",
          "From Year must be exactly 4 digits",
          (val) => val && val.toString().length === 4
        ),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId) {
          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_Gratuity_Settings_RECORDS_BY_ID,
            {
              id: updateId,
              companyId: companyId,
              fromYear: formik.values.fromMonthYear,
              toYear: formik.values.toMonthYear,
              gratiutyCalculationDays: formik.values.gratiutyCalculationDays,
              gratuityPayoutDays: formik.values.gratuityPayoutDays,
              gratiutyCalculationDaysContract:
                formik.values.gratiutyCalculationDaysContract,
              gratuityPayoutDaysContract:
                formik.values.gratuityPayoutDaysContract,
              createdBy: employeeId,
              isActive: 1,
            }
          );
          if (result.status === 200) {
            openNotification("success", "Update Successful", result.message);
            setTimeout(() => {
              handleClose();
              setFunctionRender(!functionRender);
              refresh();
              setLoading(false);
            }, 1000);
          } else if (result.status === 400) {
            const errorMessage =
              result.errors && result.errors[0] && result.errors[0].fromYear;
            openNotification("error", "Info", errorMessage || result.message);
            setLoading(false);
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await Payrollaction(
            PAYROLLAPI.CREATE_GratuitySettings_RECORD,
            {
              companyId: companyId,
              fromYear: formik.values.fromMonthYear,
              toYear: formik.values.toMonthYear,
              gratiutyCalculationDays: e.gratiutyCalculationDays,
              gratuityPayoutDays: e.gratuityPayoutDays,
              gratiutyCalculationDaysContract:
                e.gratiutyCalculationDaysContract,
              gratuityPayoutDaysContract: e.gratuityPayoutDaysContract,
              createdBy: employeeId,
              isActive: 1,
            }
          );
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              setFunctionRender(!functionRender);
              refresh();
              setLoading(false);
            }, 1000);
          } else if (result.status === 400) {
            const errorMessage =
              result.errors && result.errors && result.errors.fromYear;
            openNotification("error", "Info", errorMessage || result.message);
            setLoading(false);
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        }
      } catch (error) {
        openNotification("error", "Info", error);
        setLoading(false);
      }
    },
  });

  const getGrativitySettingsRecordsByIds = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await Payrollaction(
        PAYROLLAPI.GET_Gratuity_Settings_RECORDS_BY_ID,
        {
          id: e,
        }
      );
      if (result.result && result.result.length > 0) {
        const gratuitySettings = result.result[0];
        formik.setFieldValue(
          "gratiutyCalculationDays",
          gratuitySettings.gratiutyCalculationDays
        );
        formik.setFieldValue(
          "gratuityPayoutDays",
          gratuitySettings.gratuityPayoutDays
        );
        formik.setFieldValue(
          "gratiutyCalculationDaysContract",
          gratuitySettings.gratiutyCalculationDaysContract
        );
        formik.setFieldValue(
          "gratuityPayoutDaysContract",
          gratuitySettings.gratuityPayoutDaysContract
        );

        formik.setFieldValue("fromMonthYear", gratuitySettings.fromYear);
        formik.setFieldValue("toMonthYear", gratuitySettings.toYear);

        setupdateBtn(true);
      } else {
        console.log("No data found for the given ID");
      }
    }
  };

  useEffect(() => {
    if (updateId) getGrativitySettingsRecordsByIds(updateId);
  }, [updateId]);

  return (
    <DrawerPop
      open={createGrativityChanges}
      close={(e) => {
        // console.log(e);
        handleClose();
      }}
      contentWrapperStyle={{
        width: "590px",
      }}
      handleSubmit={(e) => {
        // console.log(e);
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        // updateBankById();
        formik.handleSubmit();
      }}
      header={[
        !updateId
          ? t("Create Gratuity Settings")
          : t("Update Gratuity Settings"),
        !updateId
          ? t("Create New Gratuity Settings")
          : t("Update Selected Gratuity Settings"),
      ]}
      footerBtn={[t("Cancel"), !updateId ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <div className="relative w-full h-full">
        <div className="py-1">
          <FormInput
            title={t("Calculation Days Count")}
            placeholder={t("Calculation Days Count")}
            change={(e) => {
              let value = e.replace(/[^0-9.]/g, "");
              if (!isNaN(value)) {
                value = value.replace(/^0+(?!\.|$)/, "");
              }
              formik.setFieldValue("gratiutyCalculationDays", value);
            }}
            value={formik.values.gratiutyCalculationDays}
            error={formik.errors.gratiutyCalculationDays}
            required={true}
            maxLength={2}
          />
        </div>

        <div className="py-4">
          <FormInput
            title={t("Payout Days Count")}
            placeholder={t(" Payout Days Count")}
            change={(e) => {
              let value = e.replace(/[^0-9.]/g, "");
              if (!isNaN(value)) {
                value = value.replace(/^0+(?!\.|$)/, "");
              }
              formik.setFieldValue("gratuityPayoutDays", value);
            }}
            value={formik.values.gratuityPayoutDays}
            error={formik.errors.gratuityPayoutDays}
            required={true}
            maxLength={2}
          />
        </div>

        <div className="py-4">
          <FormInput
            title={t("Contract Days Count")}
            placeholder={t(" Contract Days Count")}
            change={(e) => {
              let value = e.replace(/[^0-9.]/g, "");
              if (!isNaN(value)) {
                value = value.replace(/^0+(?!\.|$)/, "");
              }
              formik.setFieldValue("gratiutyCalculationDaysContract", value);
            }}
            value={formik.values.gratiutyCalculationDaysContract}
            error={formik.errors.gratiutyCalculationDaysContract}
            required={true}
            maxLength={2}
          />
        </div>

        <div className="py-4">
          <FormInput
            title={t("Contract Payout Days Count")}
            placeholder={t(" Contract Payout Days Count")}
            change={(e) => {
              let value = e.replace(/[^0-9.]/g, "");
              if (!isNaN(value)) {
                value = value.replace(/^0+(?!\.|$)/, "");
              }
              formik.setFieldValue("gratuityPayoutDaysContract", value);
            }}
            value={formik.values.gratuityPayoutDaysContract}
            error={formik.errors.gratuityPayoutDaysContract}
            maxLength={2}
            required={true}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 py-4">
          {/* <MonthPicker
            picker="year"
            className={"w-36"}
            placeholder="From"
            title="From"
            value={fromYear ? dayjs(fromYear, "YYYY") : null}
            onChange={(e, i) => {
              setFromYear(i);
              console.log(i);
            }}
          />

          <MonthPicker
            picker="year"
            className={"w-36"}
            placeholder="To"
            title="To"
            value={toYear ? dayjs(toYear, "YYYY") : null}
            onChange={(e, i) => {
              setToYear(i);
              console.log(i);
            }}
          /> */}
          {/* 
          <DateSelect
            pickerType="year"
            dateFormat="YYYY"
            title="Grativity Year From"
            value={formik.values.fromMonthYear}
            change={(e) => {
              formik.setFieldValue("fromMonthYear", e);
              setFromYear(e);
              console.log(e, "seleted to year");
            }}
          />
          <DateSelect
            pickerType="year"
            dateFormat="YYYY"
            title="Grativity Year To"
            value={formik.values.toMonthYear}
            change={(e) => {
              formik.setFieldValue("toMonthYear", e);
              setToYear(e);
              console.log(e, "seleted to year");
            }}
          /> */}

          <FormInput
            title={t("Gratuity Year From")}
            placeholder={t(" From Year")}
            change={(e) => {
              const value = e.replace(/[^0-9.]/g, "");
              if (isNaN(value)) {
                value = "";
              }
              formik.setFieldValue("fromMonthYear", value);
            }}
            value={formik.values.fromMonthYear}
            error={formik.errors.fromMonthYear}
            required={true}
            maxLength={4}
          />

          <FormInput
            title={t("Gratuity Year To")}
            placeholder={t(" To Year")}
            change={(e) => {
              const value = e.replace(/[^0-9.]/g, "");
              if (isNaN(value)) {
                value = "";
              }
              formik.setFieldValue("toMonthYear", value);
            }}
            value={formik.values.toMonthYear}
            error={formik.errors.toMonthYear}
            required={true}
            maxLength={4}
          />
        </div>
      </div>
    </DrawerPop>
  );
}
