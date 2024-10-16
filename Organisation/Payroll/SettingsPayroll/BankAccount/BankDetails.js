import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../../../common/DrawerPop";
import FlexCol from "../../../../common/FlexCol";
import FormInput from "../../../../common/FormInput";
import Dropdown from "../../../../common/Dropdown";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useFormik } from "formik";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import { fetchCompanyDetails } from "../../../../common/Functions/commonFunction";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function BankDetails({
  open,
  close = () => {},
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [companyBankList, setCompanyBankList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const { showNotification } = useNotification();
  const [updateId, setUpdateId] = useState();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [loading, setLoading] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({});
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

  useEffect(() => {
    setSelectedBank(null);
  }, [bankList]);

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);

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
      accountHolderName: "",
      iban: "",
      tradingLicense: "",
      bankName: "",
      routingCode: "",
      bankId: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      accountHolderName: yup
        .string()
        .required("Account Holder Name is required")
        .min(3, "Account Holder Name must be at least 3 characters")
        .max(30, "Account Holder Name must not exceed 30 characters"),
      iban: yup
        .string()
        .required("IBAN is required")
        .matches(/^[a-zA-Z0-9]+$/, "IBAN must contain only numbers")
        .min(10, "IBAN must be at least 10 characters")
        .max(30, "IBAN must not exceed 30 characters"),
      tradingLicense: yup
        .string()
        .required("Trading License is required")
        .matches(/^[a-zA-Z0-9]+$/, "Trading License must contain only numbers")
        .min(10, "Trading License must be at least 10 characters")
        .max(30, "Trading License must not exceed 30 characters"),
      bankName: yup.string().required("Bank Name is required"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await Payrollaction(
          PAYROLLAPI.UPDATE_COMPANYBANKDETAILS_RECORD,
          {
            companyDetailsId: updateId || null,
            accountHolderName: formik.values.accountHolderName,
            iban: formik.values.iban,
            bankId: formik.values.bankId,
            companyId: companyId,
            tradingLicense: formik.values.tradingLicense,
            modifiedBy: employeeId,
          }
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
        openNotification("error", "Info", error);
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
        "accountHolderName",
        result.result[0].accountHolderName
      );
      formik.setFieldValue("iban", result.result[0].iban);
      formik.setFieldValue("tradingLicense", result.result[0].tradingLicense);
      formik.setFieldValue("bankName", result.result[0].bankName);
      formik.setFieldValue("routingCode", result.result[0].routingCode);
      formik.setFieldValue("bankId", result.result[0].bankId);
      setCompanyBankList(result.result);
      setUpdateId(result.result[0].companyDetailsId);
    } catch (error) {}
  };

  const getBankList = async () => {
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_ALL_BANK_RECORDS, {
        companyId: companyId,
      });

      if (result?.result) {
        const options = result.result.map(
          ({ bankId, bankName, routingCode }) => ({
            id: bankId,
            label: bankName,
            value: bankName,
            bankId: bankId,
            routingCode: routingCode,
          })
        );

        setBankList(options);
      }
      setupdateBtn(true);
    } catch (error) {}
  };

  useEffect(() => {
    getCompanyBankDetails();
    getBankList();
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

  const handleFieldBlur = (field) => {
    formik.setFieldTouched(field, true, true); // Mark the field as touched
    formik.validateField(field); // Trigger validation for the field
  };

  const handleFieldChange = (field, value) => {
    formik.setFieldValue(field, value);

    // Revalidate the field when it changes
    formik.validateField(field).then(() => {
      if (!value && formik.errors[field]) {
        formik.setFieldError(field, t("Name is required"));
      } else if (value && formik.errors[field]) {
        formik.validateField(field); // Trigger validation after change if there's an error
      }
    });
  };

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
      contentWrapperStyle={{
        width: "590px",
      }}
      handleSubmit={(e) => {
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        formik.handleSubmit();
      }}
      header={[
        !UpdateBtn ? t("Company Bank Details") : t("Company Bank Details"),
        !UpdateBtn
          ? t("Update Your Companies Bank Details Here")
          : t("Update Your Companies Bank Details Here"),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={"col-span-2"}>
        <FormInput
          title="Account Holder Name"
          placeholder="Account Holder Name"
          value={formik.values.accountHolderName}
          change={(e) => {
            formik.setFieldValue("accountHolderName", e);
          }}
          type="text"
          error={formik.errors.accountHolderName}
          required={true}
          // onBlur={() => handleFieldBlur("deductionName")}
        />

        <Dropdown
          title={t("Bank Name")}
          placeholder={t("choose_here")}
          change={(selectedLeaveType) => {
            const selectedOption = bankList.find(
              (option) => option.label === selectedLeaveType
            );
            if (selectedOption) {
              formik.setFieldValue("bankName", selectedOption.value);
              formik.setFieldValue("bankId", selectedOption.bankId);
              formik.setFieldValue("routingCode", selectedOption.routingCode);
            }
          }}
          options={bankList}
          value={formik.values.bankName}
          error={formik.errors.bankName}
          required={true}
          // onBlur={() => handleFieldBlur("bankName")}
        />

        <FormInput
          title="IBAN/ACC NO"
          placeholder="IBAN/ACC NO"
          value={formik.values.iban}
          change={(e) => {
            formik.setFieldValue("iban", e);
          }}
          type="text"
          error={formik.errors.iban}
          required={true}
          // onBlur={() => handleFieldBlur("iban")}
        />
        <FormInput
          title={
            companyDetails?.isPFESIenabled === "1"
              ? t("IFSC")
              : t("Routing Code")
          }
          value={formik.values.routingCode}
          change={(e) => {
            formik.setFieldValue("routingCode", e);
          }}
          type="text"
          disabled={true}
          required={true}
          // onBlur={() => handleFieldBlur("routingCode")}
        />
        <FormInput
          title="Trading License"
          placeholder="Trading License"
          value={formik.values.tradingLicense}
          change={(e) => {
            formik.setFieldValue("tradingLicense", e);
          }}
          type="text"
          error={formik.errors.tradingLicense}
          required={true}
          // onBlur={() => handleFieldChange("tradingLicense")}
        />
      </FlexCol>
    </DrawerPop>
  );
}
