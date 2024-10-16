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

export default function ExchangeHouse({
  open,
  close = () => {},
  updateData,
  companyDataId,
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyBankList, setCompanyBankList] = useState([]);
  const [updateId, setUpdateId] = useState();
  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const handleClose = () => {
    setShow(false);
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
      exchangeEstablishementId: "",
      exchangeEmployerBankCode: "",
      exchangeEmployerReference: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      exchangeEstablishementId: yup
        .string()
        .required("Establishment Id is required")
        .matches(
          /^[a-zA-Z0-9]+$/,
          "Establishment Id must contain alphanumeric characters"
        )
        .min(3, "Establishment Id must be at least 3 characters")
        .max(30, "Establishment Id must not exceed 30 characters"),
      exchangeEmployerReference: yup
        .string()
        .required("Employer Reference is required")
        .matches(
          /^[a-zA-Z0-9]+$/,
          "Employer Reference must contain alphanumeric characters"
        )
        .min(10, "Employer Reference must be at least 23 characters")
        .max(30, "Employer Reference must not exceed 36 characters"),
      exchangeEmployerBankCode: yup
        .string()
        .required("Employer Bank Code is required")
        .matches(
          /^[a-zA-Z0-9]+$/,
          "Employer Bank Code must contain alphanumeric characters"
        )
        .min(3, "Employer Bank Code must be at least 3 characters")
        .max(30, "Employer Bank Code must not exceed 30 characters"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await Payrollaction(
          PAYROLLAPI.UPDATE_EXCHANGEHOUSE_RECORD,
          {
            companyDetailsId: updateId,
            exchangeEstablishementId: formik.values.exchangeEstablishementId,
            exchangeEmployerBankCode: formik.values.exchangeEmployerBankCode,
            exchangeEmployerReference: formik.values.exchangeEmployerReference,
            companyId: companyId,
            modifiedBy: employeeId,
          }
        );

        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 2000);
        } else if (result.status === 500) {
          openNotification("error", "Info", result.message);
          setLoading(false);
        }
      } catch (error) {
        openNotification("error", "Info ", error);
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
        "exchangeEstablishementId",
        result.result[0].exchangeEstablishementId
      );
      formik.setFieldValue(
        "exchangeEmployerBankCode",
        result.result[0].exchangeEmployerBankCode
      );
      formik.setFieldValue(
        "exchangeEmployerReference",
        result.result[0].exchangeEmployerReference
      );
      setCompanyBankList(result.result);
      setUpdateId(result.result[0].companyDetailsId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompanyBankDetails();
    setupdateBtn(true);
  }, []);

  useEffect(() => {
    formik.setFieldValue("accountHolderName", updateData.accountHolderName);
  }, [updateData]);

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        handleClose();
      }}
      contentWrapperStyle={{
        // maxWidth: "600px",
        width: "590px",
      }}
      handleSubmit={(e) => {
        // console.log(e);
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        //   UpdateIdBasedCountry();
        formik.handleSubmit();
      }}
      header={[
        !UpdateBtn ? t("Exchange House") : t("Exchange House"),
        !UpdateBtn
          ? t("Update Your Companies Exchange House Here")
          : t("Update Your Companies Exchange House Here"),
      ]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={"col-span-2"}>
        <FormInput
          title="Establishment Id"
          placeholder="Establishment Id"
          value={formik.values.exchangeEstablishementId}
          change={(e) => {
            formik.setFieldValue("exchangeEstablishementId", e);
          }}
          type="text"
          error={formik.errors.exchangeEstablishementId}
          required={true}
        />
        <FormInput
          title="Employee Bank Code"
          placeholder="Employee Bank Code"
          value={formik.values.exchangeEmployerBankCode}
          change={(e) => {
            formik.setFieldValue("exchangeEmployerBankCode", e);
          }}
          type="text"
          error={formik.errors.exchangeEmployerBankCode}
          required={true}
        />
        <FormInput
          title="Employer Reference"
          placeholder="Employer Reference"
          value={formik.values.exchangeEmployerReference}
          maxLength={23}
          change={(e) => {
            formik.setFieldValue("exchangeEmployerReference", e);
          }}
          type="text"
          error={formik.errors.exchangeEmployerReference}
          required={true}
        />
      </FlexCol>
    </DrawerPop>
  );
}
