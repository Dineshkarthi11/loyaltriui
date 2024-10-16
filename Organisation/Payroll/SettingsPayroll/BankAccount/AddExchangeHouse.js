import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { notification } from "antd";
import DrawerPop from "../../../../common/DrawerPop";
import FormInput from "../../../../common/FormInput";
import axios from "axios";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { fetchCompanyDetails } from "../../../../common/Functions/commonFunction";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function AddExchangeHouse({
  open,
  close = () => {},
  refresh = () => {},
}) {
  const { t } = useTranslation();

  const [addExchangeHouse, setAddExchangeHouse] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [functionRender, setFunctionRender] = useState(false);
  const [loading, setLoading] = useState(false);

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyDetails, setCompanyDetails] = useState({});

  useMemo(
    () =>
      setTimeout(() => {
        addExchangeHouse === false && close(false);
      }, 800),
    [addExchangeHouse]
  );
  const handleClose = () => {
    setAddExchangeHouse(false);
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

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);

  const formik = useFormik({
    initialValues: {
      companyId: [],
      bankName: "",
      routingCode: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      bankName: yup
        .string()
        .required("Exchange House Name is required")
        .matches(
          /^[a-zA-Z\s]+$/,
          "An exchange house name can contain only letters and spaces"
        )
        .min(3, "Exchange House Name must be at least 3 characters")
        .max(30, "Exchange House Name cannot exceed 30 characters"),
      routingCode: yup
        .string()
        .required("Routing Code is required  ")
        .matches(/^.{9,11}$/, {
          message: "Routing Code must be 9-11 characters long",
          excludeEmptyString: true,
        })
        .test(
          "no-zero-start",
          "Routing Code cannot start with zero",
          (value) => {
            return !/^(0\d{8,10})$/.test(value);
          }
        ),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId) {
          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_EXCHANGEHOUSERECORD_BYID,
            {
              id: updateId,
              bankName: formik.values.bankName,
              routingCode: formik.values.routingCode,
              companyId: companyId,
              isActive: "1",
              modifiedBy: employeeId,
            }
          );
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            //    () => {
            //   handleClose();
            //   console.log(handleClose, "close Successful");
            //   setFunctionRender(!functionRender);
            //   console.log(setFunctionRender, "renderrr consoleee");
            //   refresh();
            //   console.log(refresh, "refresh Successful");
            // });
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
              (result.errors[0].bankName || result.errors[0].routingCode);
            openNotification("error", "Info", errorMessage || result.message);
            setLoading(false);
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await Payrollaction(
            PAYROLLAPI.CREATE_BANK_EXCHANGEHOUSE,
            {
              // companyId: companyDataId,
              bankName: e.bankName,
              routingCode: e.routingCode,
              companyId: companyId,
              isActive: "1",
              createdBy: employeeId,
            }
          );
          if (result.status === 200) {
            // alert("success");
            openNotification("success", "Successful", result.message);
            //   () => {
            //   handleClose();
            //   console.log(handleClose, "close Successful");
            //   setFunctionRender(!functionRender);
            //   console.log(setFunctionRender, "renderrr consoleee");

            //   refresh();
            //   console.log(refresh, "refresh Successful");
            // });
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
              (result.errors[0].bankName || result.errors[0].routingCode);
            openNotification("error", "Info", errorMessage || result.message);
            setLoading(false);
          } else if (result.status === 500) {
            openNotification("error", "Info ", result.message);
            setLoading(false);
          }
        }
      } catch (error) {
        setLoading(false);
        openNotification("error", "Info ", error);
      }
    },
  });

  const getExchangeHouseRecordsByIds = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await Payrollaction(
        PAYROLLAPI.GET_EXCHANGEHOUSE_RECORDS_BY_ID,
        {
          id: e,
        }
      );
      if (result.result && result.result.length > 0) {
        formik.setFieldValue("bankName", result.result[0].bankName);
        formik.setFieldValue("routingCode", result.result[0].routingCode);
        setupdateBtn(true);
      } else {
        // Handle the case where no data is returned for the given ID
        console.log("No data found for the given ID");
      }
    }
  };

  useEffect(() => {
    getExchangeHouseRecordsByIds(updateId);
  }, [updateId]);

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
      open={addExchangeHouse}
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
        // updateDesignationById();
        formik.handleSubmit();
      }}
      header={[
        !updateId ? t("Create_Exchange_House") : t("Update_Exchange_House"),
        !updateId
          ? t("Create_New_Exchange_House")
          : t("Update_Selected_Exchange_House"),
      ]}
      footerBtn={[t("Cancel"), !updateId ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <div className="relative w-full h-full">
        <div className="py-1">
          <FormInput
            title={t("Exchange_House_Name")}
            placeholder={t(`Exchange_House_Name`)}
            change={(e) => {
              formik.setFieldValue("bankName", e);
            }}
            required={true}
            value={formik.values.bankName}
            error={formik.errors.bankName}
          />
        </div>

        <div className="pt-[13px]">
          <FormInput
            title={
              companyDetails?.isPFESIenabled === "1"
                ? t("IFSC")
                : t("Routing Code")
            }
            placeholder={
              companyDetails?.isPFESIenabled === "1"
                ? t("IFSC")
                : t("Routing Code")
            }
            change={(e) => {
              // const numericValue = e.replace(/\D/g, "");
              formik.setFieldValue("routingCode", e);
            }}
            required={true}
            value={formik.values.routingCode}
            error={formik.errors.routingCode}
            maxLength={11}
          />
        </div>
      </div>
    </DrawerPop>
  );
}
