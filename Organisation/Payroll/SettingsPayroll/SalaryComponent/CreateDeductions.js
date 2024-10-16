import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../../../common/DrawerPop";
import { useFormik } from "formik";
import FormInput from "../../../../common/FormInput";
import * as yup from "yup";
import ToggleBtn from "../../../../common/ToggleBtn";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { fetchCompanyDetails } from "../../../../common/Functions/commonFunction";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function CreateDeductions({
  open,
  close = () => {},
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [createDeductions, setCreateDeductions] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [functionRender, setFunctionRender] = useState(false);
  const [loading, setLoading] = useState(false);

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );
  const [deductions, setDeductions] = useState([]);
  const [selectedEarning, setSelectedEarning] = useState(null);
  const [isEditable, setIsEditable] = useState(true);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
    setEmployeeId(localStorageData.employeeId);
  }, []);

  useMemo(
    () =>
      setTimeout(() => {
        createDeductions === false && close(false);
      }, 800),
    [createDeductions]
  );
  const handleClose = () => {
    setCreateDeductions(false);
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
      deductionName: "",
      deductionPaySlipName: "",
      isActive: 1,
      isEPFenabled: 1,
      isESIenabled: 1,
      createdBy: employeeId,
    },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnMount: false,
    validationSchema: yup.object().shape({
      deductionName: yup
        .string()
        .required("Name is required")
        .matches(
          /^[a-zA-Z1-9][a-zA-Z0-9\s]*$/,
          "Name must be alphanumeric,Should not start with zero also there should not be any space."
        )
        .min(3, "Name must be at least 3 characters long")
        .max(30, "Name cannot exceed 30 characters"),
      deductionPaySlipName: yup
        .string()
        .required("Payslip Name is required")
        .matches(
          /^[a-zA-Z1-9][a-zA-Z0-9\s]*$/,
          "Payslip Name must be alphanumeric,Should not start with zero also there should not be any space."
        )
        .min(3, "Payslip Name must be at least 3 characters long")
        .max(15, "Payslip Name cannot exceed 15 characters"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      console.log(e, "e");
      try {
        if (updateId) {
          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_DEDUCTIONS_BY_ID,
            {
              id: updateId,
              deductionName: formik.values.deductionName,
              deductionPaySlipName: formik.values.deductionPaySlipName,
              isActive: formik.values.isActive,
              isEPFenabled: formik.values.isEPFenabled || 0,
              isESIenabled: formik.values.isESIenabled || 0,
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
              (result.errors[0].deductionName ||
                result.errors[0].deductionPaySlipName);
            openNotification("error", "Info", errorMessage || result.message);
            setLoading(false);
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await Payrollaction(
            PAYROLLAPI.CREATE_SALARYCOMPONENTS_DEDUCTIONS,
            {
              deductionName: e.deductionName,
              deductionPaySlipName: e.deductionPaySlipName,
              isActive: e.isActive,
              isEPFenabled: e.isEPFenabled || 0,
              isESIenabled: e.isESIenabled || 0,
              companyId: companyId,
              createdBy: employeeId,
            }
          );
          if (result.status === 200) {
            // alert("success");
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
              (result.errors[0].deductionName ||
                result.errors[0].deductionPaySlipName);
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

  const getDeductionsPaysRecordsByIds = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await Payrollaction(
        PAYROLLAPI.GET_DEDUCTIONS_RECORDS_BY_ID,
        {
          id: e,
        }
      );
      if (result.result && result.result.length > 0) {
        setStatus(result.result[0].isEditable);
        formik.setFieldValue("deductionName", result.result[0].deductionName);
        formik.setFieldValue(
          "deductionPaySlipName",
          result.result[0].deductionPaySlipName
        );
        formik.setFieldValue("isActive", result.result[0].isActive ?? 1);
        formik.setFieldValue(
          "isEPFenabled",
          result.result[0].isEPFenabled ?? 1
        );
        formik.setFieldValue(
          "isESIenabled",
          result.result[0].isESIenabled ?? 1
        );
        setupdateBtn(true);
      } else {
        // Handle the case where no data is returned for the given ID
        console.log("No data found for the given ID");
      }
    }
  };

  useEffect(() => {
    getDeductionsPaysRecordsByIds(updateId);
  }, [updateId]);

  const getDeductionsList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_DEDUCTIONS_RECORDS,
        {
          companyId: companyId,
        }
      );
      setDeductions(result?.result);
      return result?.result;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const actionId = localStorage.getItem("actionidforupdate");
    if (actionId) {
      getDeductionsList().then((deductions) => {
        const deduction = deductions.find(
          (e) => e.deductionId === parseInt(actionId)
        );
        if (deduction) {
          setSelectedEarning(deduction);
          setIsEditable(deduction.isEditable === "1");
          formik.setFieldValue("deductionName", deduction.deductionName);
          formik.setFieldValue(
            "deductionPaySlipName",
            deduction.deductionPaySlipName
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchCompanyDetails(companyId).then((details) =>
        setCompanyDetails(details)
      );
    }

    const handleStorageChange = () => {
      if (companyId) {
        fetchCompanyDetails(companyId).then((details) =>
          setCompanyDetails(details)
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <DrawerPop
      open={createDeductions}
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
      header={[!updateId ? t("Create_Deductions") : t("Update_Deductions")]}
      footerBtn={[t("Cancel"), !updateId ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <div className="relative w-full h-full">
        <div className="py-1">
          <FormInput
            title={t("Name")}
            placeholder={t("Name")}
            change={(e) => {
              formik.setFieldValue("deductionName", e);
            }}
            required={true}
            value={formik.values.deductionName}
            error={formik.errors.deductionName}
            disabled={!isEditable}
            maxLength={15}
          />
        </div>

        <div className="py-4">
          <FormInput
            title={t("Payslip_Name")}
            placeholder={t("Payslip_Name")}
            change={(e) => {
              formik.setFieldValue("deductionPaySlipName", e);
            }}
            required={true}
            value={formik.values.deductionPaySlipName}
            error={formik.errors.deductionPaySlipName}
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
        {parseInt(companyDetails?.isPFESIenabled) === 1 && (
          <div className="col-span-1 ">
            <ToggleBtn
              value={formik.values.isEPFenabled}
              change={(e) => {
                formik.setFieldValue("isEPFenabled", e ? 1 : 0);
              }}
              title={t("EPF Active / Inactive")}
              className={" pt-[6px]"}
            />
          </div>
        )}

        {parseInt(companyDetails?.isPFESIenabled) === 1 && (
          <div className="col-span-1 ">
            <ToggleBtn
              value={formik.values.isESIenabled}
              change={(e) => {
                formik.setFieldValue("isESIenabled", e ? 1 : 0);
              }}
              title={t("ESI Active / Inactive")}
              className={" pt-[6px]"}
            />
          </div>
        )}
      </div>
    </DrawerPop>
  );
}
