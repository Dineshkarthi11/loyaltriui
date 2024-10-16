import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../../../common/DrawerPop";
import { useFormik } from "formik";
import FormInput from "../../../../common/FormInput";
import * as yup from "yup";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function CreateEarnings({
  open,
  close = () => {},
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [createEarnings, setCreateEarnings] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [functionRender, setFunctionRender] = useState(false);
  const [loading, setLoading] = useState(false);

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );

  const [isEditable, setIsEditable] = useState(true);
  const [earnings, setEarnings] = useState([]);
  const [selectedEarning, setSelectedEarning] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
    setEmployeeId(localStorageData.employeeId);
  }, []);

  useMemo(
    () =>
      setTimeout(() => {
        createEarnings === false && close(false);
      }, 800),
    [createEarnings]
  );
  const handleClose = () => {
    setCreateEarnings(false);
    // close()

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
      earningsName: "",
      earningsPaySlipName: "",
      isActive: 1,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnMount: false,
    validationSchema: yup.object().shape({
      earningsName: yup
        .string()
        .required("Name is required")
        .matches(
          /^[a-zA-Z1-9][a-zA-Z0-9\s]*$/,
          "Name must be alphanumeric and can contain spaces, but should not contain special characters. Should not start with zero."
        )
        .min(3, "Name must be at least 3 characters long")
        .max(30, "Name cannot exceed 30 characters"),
      earningsPaySlipName: yup
        .string()
        .required("Payslip Name is required")
        .matches(
          /^[a-zA-Z1-9][a-zA-Z0-9\s]*$/,
          "Payslip Name must be alphanumeric and can contain spaces, but should not contain special characters. Should not start with zero"
        )
        .min(3, "Payslip Name must be at least 3 characters long")
        .max(15, "Payslip Name cannot exceed 15 characters"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId) {
          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_EARNINGSRECORD_BY_ID,
            {
              id: updateId,
              earningsName: formik.values.earningsName,
              earningsPaySlipName: formik.values.earningsPaySlipName,
              isActive: formik.values.isActive,
              companyId: companyId,
              modifiedBy: employeeId,
            }
          );
          if (result.status === 200) {
            openNotification("success", "Update Successful", result.message);
            setTimeout(() => {
              handleClose();
              // close()
              setFunctionRender(!functionRender);
              refresh();
              setLoading(false);
            }, 1000);
          } else if (result.status === 400) {
            const errorMessage =
              result.errors &&
              result.errors[0] &&
              (result.errors[0].earningsName ||
                result.errors[0].earningsPaySlipName);
            openNotification("error", "Info", errorMessage || result.message);
            setLoading(false);
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await Payrollaction(
            PAYROLLAPI.CREATE_SALARYCOMPONENTS_EARNINGS,
            {
              earningsName: e.earningsName,
              earningsPaySlipName: e.earningsPaySlipName,
              isActive: e.isActive,
              companyId: companyId,
              createdBy: employeeId,
            }
          );
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              // close()
              setFunctionRender(!functionRender);
              refresh();
              setLoading(false);
            }, 1000);
          } else if (result.status === 400) {
            const errorMessage =
              result.errors &&
              result.errors[0] &&
              (result.errors[0].earningsName ||
                result.errors[0].earningsPaySlipName);
            openNotification("error", "Info", errorMessage || result.message);
            setLoading(false);
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        }
      } catch (error) {
        openNotification("error", "Info ", error);
        setLoading(false);
      }
    },
  });

  const getEarningsRecordsByIds = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await Payrollaction(
        PAYROLLAPI.GET_EARNINGS_RECORDS_BY_ID,
        {
          id: e,
        }
      );
      if (result.result && result.result.length > 0) {
        setStatus(result.result[0].isEditable);
        formik.setFieldValue("earningsName", result.result[0].earningsName);
        formik.setFieldValue(
          "earningsPaySlipName",
          result.result[0].earningsPaySlipName
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
    getEarningsRecordsByIds(updateId);
  }, [updateId]);

  const getEarningList = async () => {
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_ALL_EARNINGS_RECORDS, {
        companyId: companyId,
      });
      setEarnings(result?.result);
      return result?.result;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    const actionId = localStorage.getItem("actionidforupdate");
    if (actionId) {
      getEarningList().then((earnings) => {
        const earning = earnings.find(
          (e) => e.earningsId === parseInt(actionId)
        );
        if (earning) {
          setSelectedEarning(earning);
          setIsEditable(earning.isEditable === "1");
          formik.setFieldValue("earningsName", earning.earningsName);
          formik.setFieldValue(
            "earningsPaySlipName",
            earning.earningsPaySlipName
          );
        }
      });
    }
  }, []);

  return (
    <DrawerPop
      open={open}
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
      // updateBtn={UpdateBtn}
      updateFun={() => {
        // updateBankById();
        formik.handleSubmit();
      }}
      header={[!updateId ? t("Create Earnings") : t("Update Earnings")]}
      footerBtn={[t("Cancel"), !updateId ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <div className="relative w-full h-full">
        <div className="py-1">
          <FormInput
            title={t("Name")}
            placeholder={t("Name")}
            change={(e) => {
              formik.setFieldValue("earningsName", e);
            }}
            required={true}
            value={formik.values.earningsName}
            error={formik.errors.earningsName}
            disabled={!isEditable}
            maxLength={15}
          />
        </div>

        <div className="py-4">
          <FormInput
            title={t("Payslip_Name")}
            placeholder={t("Payslip_Name")}
            change={(e) => {
              formik.setFieldValue("earningsPaySlipName", e);
            }}
            required={true}
            value={formik.values.earningsPaySlipName}
            error={formik.errors.earningsPaySlipName}
            maxLength={15}
          />
        </div>
        {status !== "0" && (
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
        )}
      </div>
    </DrawerPop>
  );
}
