import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../../../common/DrawerPop";
import FlexCol from "../../../../common/FlexCol";
import FormInput from "../../../../common/FormInput";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function WpsConfig({
  open,
  close = () => {},
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [companyBankList, setCompanyBankList] = useState([]);
  const [updateId, setUpdateId] = useState();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 1500),
    [show]
  );

  const handleClose = () => {
    setShow(false);
  };

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
      wpsEstablishementId: "",
      wpsEmployerReference: "",
      wpsEmployerBankCode: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      wpsEstablishementId: yup
        .string()
        .required("Establishment Id is required")
        .matches(
          /^[a-zA-Z0-9]+$/,
          "Establishment Id must contain alphanumeric characters"
        )
        .min(3, "Establishment Id must be at least 3 characters")
        .max(30, "Establishment Id must not exceed 30 characters"),
      wpsEmployerReference: yup
        .string()
        .required("Employer Reference is required")
        .matches(
          /^[a-zA-Z0-9]+$/,
          "Employer Reference must contain alphanumeric characters"
        )
        .min(10, "Employer Reference must be at least 10 characters")
        .max(30, "Employer Reference must not exceed 30 characters"),
      wpsEmployerBankCode: yup
        .string()
        .required("Employer Bank Code is required")
        .matches(
          /^[a-zA-Z0-9]+$/,
          "Employer Bank Code must contain alphanumeric characters"
        )
        .min(10, "Employer Bank Code must be at least 10 characters")
        .max(30, "Employer Bank Code must not exceed 30 characters"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await Payrollaction(PAYROLLAPI.UPDATE_WPSCONFIG_RECORD, {
          companyDetailsId: updateId,
          wpsEstablishementId: formik.values.wpsEstablishementId,
          wpsEmployerReference: formik.values.wpsEmployerReference,
          wpsEmployerBankCode: formik.values.wpsEmployerBankCode,
          modifiedBy: employeeId,
        });

        if (result.status === 200) {
          openNotification("success", "Success", result.message);
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 1000);
        } else {
          openNotification("error", "Info", result.message);
          setLoading(false);
        }
      } catch (error) {
        openNotification("error", "Info", error.message);
        setLoading(false);
      }
    },
  });

  const getCompanyBankDetails = async () => {
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_COMPANYBANK_DETAILS, {
        companyId: companyId,
      });
      formik.setFieldValue(
        "wpsEstablishementId",
        result.result[0].wpsEstablishementId
      );
      formik.setFieldValue(
        "wpsEmployerBankCode",
        result.result[0].wpsEmployerBankCode
      );
      formik.setFieldValue(
        "wpsEmployerReference",
        result.result[0].wpsEmployerReference
      );
      setCompanyBankList(result.result);
      setUpdateId(result.result[0].companyDetailsId);
    } catch (error) {}
  };

  useEffect(() => {
    getCompanyBankDetails();
    setupdateBtn(true);
  }, []);

  return (
    <DrawerPop
      open={show}
      close={handleClose}
      handleSubmit={formik.handleSubmit}
      updateBtn={UpdateBtn}
      updateFun={formik.handleSubmit}
      header={[
        !UpdateBtn ? t("Wps config") : t("Wps config"),
        !UpdateBtn
          ? t("Update Your Companies Wps Config Here")
          : t("Update Your Companies Wps Config Here"),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={"col-span-2"}>
        <FormInput
          title="Establishment Id"
          placeholder="Establishment Id"
          value={formik.values.wpsEstablishementId}
          change={(e) => formik.setFieldValue("wpsEstablishementId", e)}
          type="text"
          error={formik.errors.wpsEstablishementId}
          required={true}
        />
        <FormInput
          title="Employee Bank Code"
          placeholder="Employee Bank Code"
          value={formik.values.wpsEmployerBankCode}
          change={(e) => formik.setFieldValue("wpsEmployerBankCode", e)}
          type="text"
          error={formik.errors.wpsEmployerBankCode}
          required={true}
        />
        <FormInput
          title="Employer Reference"
          placeholder="Employer Reference"
          value={formik.values.wpsEmployerReference}
          change={(e) => formik.setFieldValue("wpsEmployerReference", e)}
          type="text"
          error={formik.errors.wpsEmployerReference}
          required={true}
        />
      </FlexCol>
    </DrawerPop>
  );
}
