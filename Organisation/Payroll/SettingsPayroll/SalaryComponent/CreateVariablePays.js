import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../../../common/DrawerPop";
import { useFormik } from "formik";
import FormInput from "../../../../common/FormInput";
import * as yup from "yup";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function CreateVariablePays({
  open,
  close = () => {},
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [createVariablePays, setCreateVariablePays] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [functionRender, setFunctionRender] = useState(false);
  const [loading, setLoading] = useState(false);

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );
  useEffect(() => {
    setCompanyId(localStorageData.companyId);
    setEmployeeId(localStorageData.employeeId);
  }, []);

  const handleClose = () => {
    close();
    setCreateVariablePays(false);
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
      variablePayName: "",
      variablePayPaySlipName: "",
      isActive: 1,
      createdBy: employeeId,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      variablePayName: yup
        .string()
        .required("Name is required")
        .matches(
          /^[a-zA-Z0-9\s]*$/,
          "Name must be alphanumeric and can contain spaces, but should not contain special characters"
        )
        .min(3, "Name must be at least 3 characters long")
        .max(15, "Name cannot exceed 15 characters"),
      variablePayPaySlipName: yup
        .string()
        .required("Payslip Name is required")
        .matches(
          /^[a-zA-Z0-9\s]*$/,
          "Payslip Name must be alphanumeric and can contain spaces, but should not contain special characters"
        )
        .min(3, "Payslip Name must be at least 3 characters long")
        .max(15, "Payslip Name cannot exceed 15 characters"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId) {
          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_VARIABLEPAYS_BY_ID,
            {
              id: updateId,
              variablePayName: formik.values.variablePayName,
              variablePayPaySlipName: formik.values.variablePayPaySlipName,
              isActive: formik.values.isActive,
              companyId: companyId,
              modifiedBy: employeeId,
            }
          );
          if (result.status === 200) {
            openNotification(
              "success",
              "Update Successful",
              result.message,
              () => {
                handleClose();
                setFunctionRender(!functionRender);
                refresh();
                setLoading(false);
              }
            );
          } else if (result.status === 400) {
            const errorMessage =
              result.errors &&
              result.errors[0] &&
              (result.errors[0].variablePayName ||
                result.errors[0].variablePayPaySlipName);
            openNotification("error", "Info", errorMessage || result.message);
            setLoading(false);
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await Payrollaction(
            PAYROLLAPI.CREATE_SALARYCOMPONENTS_VARIABLEPAYS,
            {
              // companyId: companyDataId,
              variablePayName: e.variablePayName,
              variablePayPaySlipName: e.variablePayPaySlipName,
              isActive: e.isActive,
              companyId: companyId,
              createdBy: employeeId,
            }
          );
          if (result.status === 200) {
            openNotification("success", "Successful", result.message, () => {
              handleClose();
              refresh();
              setLoading(false);
            });
          } else if (result.status === 400) {
            const errorMessage =
              result.errors &&
              result.errors[0] &&
              (result.errors[0].variablePayName ||
                result.errors[0].variablePayPaySlipName);
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

  const getVariablePaysRecordsByIds = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await Payrollaction(
        PAYROLLAPI.GET_VARIABLEPAYS_RECORDS_BY_ID,
        {
          id: e,
        }
      );
      if (result.result && result.result.length > 0) {
        formik.setFieldValue(
          "variablePayName",
          result.result[0].variablePayName
        );
        formik.setFieldValue(
          "variablePayPaySlipName",
          result.result[0].variablePayPaySlipName
        );
        formik.setFieldValue("isActive", result.result[0].isActive ?? 1);
        setupdateBtn(true);
      } else {
        // Handle the case where no data is returned for the given ID
        console.log("No data found for the given ID");
      }
    }
  };

  useEffect(() => {
    getVariablePaysRecordsByIds(updateId);
  }, [updateId]);

  return (
    <DrawerPop
      open={createVariablePays}
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
        !updateId ? t("Create_Variable_Pays") : t("Update_Variable_Pays"),
      ]}
      footerBtn={[
        t("Cancel"),
        !updateId
          ? t("Create New Variable Pays")
          : t("Update Selected Variable Pays"),
      ]}
      footerBtnDisabled={loading}
    >
      <div className="relative w-full h-full">
        <div className="py-1">
          <FormInput
            title={t("Name")}
            placeholder={t("Name")}
            change={(e) => {
              formik.setFieldValue("variablePayName", e);
            }}
            required={true}
            value={formik.values.variablePayName}
            error={formik.errors.variablePayName}
          />
        </div>

        <div className="py-4">
          <FormInput
            title={t("Payslip_Name")}
            placeholder={t("Payslip_Name")}
            change={(e) => {
              formik.setFieldValue("variablePayPaySlipName", e);
            }}
            required={true}
            value={formik.values.variablePayPaySlipName}
            error={formik.errors.variablePayPaySlipName}
          />
        </div>

        <div className="col-span-1 ">
          {/* <ToggleBtn
            value={formik.values.isActive}
            change={(e) => {
              formik.setFieldValue("isActive", e ? 1 : 0);
            }}
            title={t("Active / Inactive")}
            className={" pt-[6px]"}
          /> */}
        </div>
      </div>
    </DrawerPop>
  );
}
