import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../../../common/DrawerPop";
import FlexCol from "../../../../common/FlexCol";
import FormInput from "../../../../common/FormInput";
import Dropdown from "../../../../common/Dropdown";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useFormik } from "formik";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import axios from "axios";
import { fetchCompanyDetails } from "../../../../common/Functions/commonFunction";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function EmployeeBankAccount({
  open,
  close = () => {},
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [bankList, setBankList] = useState([]);
  const [ifscSuggestions, setIfscSuggestions] = useState([]); // Add state for IFSC suggestions

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
  const [selectedBank, setSelectedBank] = useState(null);
  const { showNotification } = useNotification();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );
  const [exchangeHouse, setexchangeHouse] = useState([]);
  const [salaryPaymentOptions, setsalaryPaymentOptions] = useState([]);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companyBankListId, setCompanyBankListId] = useState(null);
  const [addNewBank, setAddNewBank] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    setSelectedBank(null);
  }, [bankList, exchangeHouse]);
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

  const validate = (values) => {
    const errors = {};

    // Validate Salary Payment Method
    if (!values.salaryPaymentMethod) {
      errors.salaryPaymentMethod = "Salary Payment Method is required";
    }

    // Validate IBAN and bank details if Salary Payment Method is Bank or Exchange House
    if (
      values.salaryPaymentMethod === "Bank" ||
      values.salaryPaymentMethod === "Exchange House"
    ) {
      if (!values.iban) {
        errors.iban = "IBAN/ACC NO is required";
      } else {
        if (values.iban.length < 5 || values.iban.length > 25) {
          errors.iban = "IBAN/ACCNO. must be between 5 and 25 characters";
        }
        if (!/^[a-zA-Z0-9]+$/.test(values.iban)) {
          errors.iban = "IBAN/ACCNO. should contain only characters and digits";
        }
      }
    }

    // Validate bank name if Salary Payment Method is Bank
    if (values.salaryPaymentMethod === "Bank") {
      if (!values.bankName && !addNewBank) {
        errors.bankName = "Bank Name is required";
      }
    }

    // Validate exchange house name if Salary Payment Method is Exchange House
    if (values.salaryPaymentMethod === "Exchange House") {
      if (!values.exchangeName) {
        errors.exchangeName = "Exchange House Name is required";
      }
    }

    // Validate Employee Unique ID only if the method is Bank, Exchange House, or Bank without WPS
    if (
      values.salaryPaymentMethod === "Bank" ||
      values.salaryPaymentMethod === "Exchange House" ||
      values.salaryPaymentMethod === "Bank without WPS"
    ) {
      if (!values.employeeUniqueID) {
        errors.employeeUniqueID =
          "Employee Unique Id is required and must contain numbers only";
      } else if (!/^\d+$/.test(values.employeeUniqueID)) {
        errors.employeeUniqueID =
          "Employee Unique Id must contain numbers only";
      }
    }

    // Validate new bank details if adding a new bank
    if (addNewBank) {
      if (!values.newBankName) {
        errors.newBankName = "Bank Name is required";
      }
      if (!values.newBankIFSC) {
        errors.newBankIFSC = "Bank IFSC is required";
      }
      if (!values.newBankBranch) {
        errors.newBankBranch = "Bank Branch is required";
      }
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      employeeName: "",
      iban: "",
      tradingLicense: "",
      bankName: "",
      routingCode: "",
      bankId: "",
      exchangeId: "",
      salaryPaymentMethod: "",
      PaymentMethodId: "",
      bankNameexchange: "",
      exchangeName: "",
      employeeUniqueID: "",
      newBankName: "",
      newBankIFSC: "",
      newBankBranch: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validate,
    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await Payrollaction(
          PAYROLLAPI.UPDATE_EMPLOYEEBANKDETAILS_RECORD,
          {
            id: id || null,
            companyDetailsId: companyBankListId,
            iban:
              formik.values.salaryPaymentMethod !== "Cash" &&
              formik.values.salaryPaymentMethod !== "Cheque"
                ? formik.values.iban || null
                : null,
            bankId:
              (formik.values.salaryPaymentMethod === "Bank" ||
                "Bank without WPS") &&
              !addNewBank
                ? formik.values.bankId || null
                : null,
            exchangeId:
              formik.values.salaryPaymentMethod === "Exchange House"
                ? formik.values.exchangeId || null
                : null,
            companyId: companyId,
            salaryPaymentMethod: formik.values.PaymentMethodId || null,
            routingCode:
              formik.values.salaryPaymentMethod !== "Cash" &&
              formik.values.salaryPaymentMethod !== "Cheque"
                ? formik.values.routingCode || null
                : null,
            modifiedBy: employeeId,
            createdBy: employeeId,
            employeeId: updateId,
            employeeUniqueID: formik.values.employeeUniqueID || null,
            isActive: 1,
            newBankDetails: addNewBank
              ? {
                  bankName: formik.values.newBankName || null,
                  ifscCode: formik.values.newBankIFSC || null,
                  branchName: formik.values.newBankBranch || null,
                }
              : null,
          }
        );

        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 1000);
        } else if (result.status === 400) {
          let errorMessage = result.message;

          if (result.errors) {
            if (result.errors.iban) {
              errorMessage = result.errors.iban;
            } else if (
              Array.isArray(result.errors) &&
              result.errors.length > 0 &&
              result.errors[0].companyDetailsId
            ) {
              errorMessage = result.errors[0].companyDetailsId;
            }
          }
          openNotification("error", "Info", errorMessage);
          setLoading(false);
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

  const getEmployeeBankDetailsById = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYEEYBANK_DETAILS_BY_ID,
        {
          id: updateId,
        }
      );
      formik.setFieldValue("employeeName", result.result[0].employeeName);
      formik.setFieldValue("iban", result.result[0].iban);
      formik.setFieldValue("exchangeName", result.result[0].exchangeName);
      formik.setFieldValue("bankName", result.result[0].bankName);
      formik.setFieldValue("routingCode", result.result[0].routingCode);
      formik.setFieldValue("bankId", result.result[0].bankId);
      formik.setFieldValue("exchangeId", result.result[0].exchangeId);
      formik.setFieldValue(
        "salaryPaymentMethod",
        result.result[0].salaryPaymentMethodName
      );
      formik.setFieldValue(
        "PaymentMethodId",
        result.result[0].salaryPaymentMethod
      );
      setId(result.result[0].employeeSalaryPaymentMethodId);

      formik.setFieldValue(
        "employeeUniqueID",
        result.result[0].employeeUniqueID
      );
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
            type: "bank",
          })
        );

        setBankList([
          ...options,
          {
            id: "add_new",
            label: "Add new bank",
            value: "Add new bank",
            type: "add_new",
          },
        ]);
      }
    } catch (error) {}
  };

  const getExchangeHouseList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_EXCHANGE_HOUSE_RECORDS,
        {
          companyId: companyId,
        }
      );
      if (result?.result) {
        const options = result.result.map(
          ({ exchangeId, bankName, routingCode }) => ({
            id: exchangeId,
            label: bankName,
            value: bankName,
            exchangeId: exchangeId,
            routingCode: routingCode,
            type: "exchangeHouse",
          })
        );

        setexchangeHouse(options);
      }
    } catch (error) {}
  };

  const getSalaryPaymentMethods = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_EMPLOYEE_SALARY_PAYMENT_METHODS,
        {
          companyId: companyId,
        }
      );
      if (result?.result) {
        const options = result.result.map(
          ({ PaymentMethodId, salaryPaymentMethod }) => ({
            id: PaymentMethodId,
            label: salaryPaymentMethod,
            value: salaryPaymentMethod,
            PaymentMethodId: PaymentMethodId,
            type: "salarypaymentmethods",
          })
        );
        setsalaryPaymentOptions(options);
      }
    } catch (error) {}
  };

  const getCompanyBankDetails = async () => {
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_COMPANYBANK_DETAILS, {
        companyId: companyId,
      });
      setCompanyBankListId(result.result[0].companyDetailsId);
      formik.setFieldValue("tradingLicense", result.result[0].tradingLicense);
    } catch (error) {}
  };

  useEffect(() => {
    getEmployeeBankDetailsById();
    getBankList();
    getExchangeHouseList();
    getSalaryPaymentMethods();
    getCompanyBankDetails();
  }, [updateId]);

  const handleIfscChange = async (e) => {
    const ifscCode = e;
    formik.setFieldValue("newBankIFSC", ifscCode);
    if (ifscCode.length === 11) {
      try {
        const response = await axios.get(
          `https://ifsc.razorpay.com/${ifscCode}`
        );
        setIfscSuggestions([response.data]);
      } catch (err) {
        console.log("Invalid IFSC code or unable to fetch details.");
        setIfscSuggestions([]);
      }
    } else {
      setIfscSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    formik.setFieldValue("newBankName", suggestion.BANK);
    formik.setFieldValue("newBankBranch", suggestion.BRANCH);
    formik.setFieldValue("newBankIFSC", suggestion.IFSC);
    setIfscSuggestions([]);
  };

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
        !UpdateBtn ? t("Employee Bank Account") : t(""),
        !UpdateBtn
          ? t("Manage your company's employees bank details here")
          : t(""),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Save") : t("")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={"col-span-2"}>
        <FormInput
          title="Account Holder Name"
          placeholder="Account Holder Name"
          value={formik.values.employeeName}
          change={(e) => {
            formik.setFieldValue("employeeName", e);
          }}
          type="text"
          required={true}
          error={formik.errors.employeeName}
        />

        <Dropdown
          title={t("Salary Payment Method")}
          placeholder={t("choose Salary Payment Method")}
          change={(selectedLeaveType) => {
            const selectedOption = salaryPaymentOptions.find(
              (option) => option.label === selectedLeaveType
            );
            if (selectedOption) {
              formik.setFieldValue("salaryPaymentMethod", selectedOption.value);
              formik.setFieldValue(
                "PaymentMethodId",
                selectedOption.PaymentMethodId
              );
            }
          }}
          required={true}
          options={salaryPaymentOptions}
          value={formik.values.salaryPaymentMethod}
          error={formik.errors.salaryPaymentMethod}
        />

        {(formik.values.salaryPaymentMethod === "Bank" ||
          formik.values.salaryPaymentMethod === "Exchange House" ||
          formik.values.salaryPaymentMethod === "Bank without WPS") && (
          <FormInput
            title="Employee Unique Id"
            placeholder="Employee Unique Id"
            value={formik.values.employeeUniqueID}
            change={(e) => {
              const numericValue = e.replace(/\D/g, "");
              formik.setFieldValue("employeeUniqueID", numericValue);
            }}
            type={"string"}
            pattern="[0-9]*"
            inputmode="numeric"
            required={true}
            error={formik.errors.employeeUniqueID}
          />
        )}

        {formik.values.salaryPaymentMethod === "Bank" ||
        formik.values.salaryPaymentMethod === "Exchange House" ||
        formik.values.salaryPaymentMethod === "Bank without WPS" ? (
          <>
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
              maxLength={25}
            />

            {formik.values.salaryPaymentMethod === "Bank" ? (
              <>
                <Dropdown
                  title={t("Choose Bank Name")}
                  placeholder={t("Choose Bank Name")}
                  change={(selectedLeaveType) => {
                    if (selectedLeaveType === "Add new bank") {
                      setAddNewBank(true);
                      formik.setFieldValue("bankName", "Add new bank");
                      formik.setFieldValue("bankId", "");
                      formik.setFieldValue("routingCode", "");
                    } else {
                      const selectedOption = bankList.find(
                        (option) => option.label === selectedLeaveType
                      );
                      if (selectedOption) {
                        formik.setFieldValue("bankName", selectedOption.value);
                        formik.setFieldValue("bankId", selectedOption.bankId);
                        formik.setFieldValue(
                          "routingCode",
                          selectedOption.routingCode
                        );
                        setAddNewBank(false);
                      }
                    }
                  }}
                  options={bankList}
                  value={formik.values.bankName}
                  error={formik.errors.bankName}
                  required={true}
                />

                {addNewBank && (
                  <>
                    <FormInput
                      title={
                        companyDetails?.isPFESIenabled === "1"
                          ? "IFSC"
                          : "Routing Code"
                      }
                      placeholder={
                        companyDetails?.isPFESIenabled === "1"
                          ? "IFSC"
                          : "Routing Code"
                      }
                      value={formik.values.newBankIFSC}
                      change={(e) => {
                        handleIfscChange(e);
                      }}
                      type="text"
                      required={true}
                      error={formik.errors.newBankIFSC}
                    />
                    {ifscSuggestions.length > 0 && (
                      <ul className="relative bg-white border border-gray-300 w-full mt-1 max-h-48 overflow-y-auto z-10">
                        {ifscSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="cursor-pointer p-2 hover:bg-gray-200"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion.BANK} - {suggestion.BRANCH}
                          </li>
                        ))}
                      </ul>
                    )}
                    <FormInput
                      title="New Bank Name"
                      placeholder="New Bank Name"
                      value={formik.values.newBankName}
                      change={(e) => {
                        formik.setFieldValue("newBankName", e);
                      }}
                      type="text"
                      required={true}
                      error={formik.errors.newBankName}
                    />
                    <FormInput
                      title=" Bank Branch"
                      placeholder="New Bank Branch"
                      value={formik.values.newBankBranch}
                      change={(e) => {
                        formik.setFieldValue("newBankBranch", e);
                      }}
                      type="text"
                      required={true}
                      error={formik.errors.newBankBranch}
                    />
                    <FormInput
                      title="Trading License"
                      value={formik.values.tradingLicense}
                      change={(e) => {
                        formik.setFieldValue("tradingLicense", e);
                      }}
                      type="text"
                      disabled={true}
                    />
                  </>
                )}
              </>
            ) : null}

            {formik.values.salaryPaymentMethod === "Exchange House" ? (
              <Dropdown
                title={t("Exchange House")}
                placeholder={t("Choose Exchange House ")}
                change={(selectedLeaveType) => {
                  const selectedOption = exchangeHouse.find(
                    (option) => option.label === selectedLeaveType
                  );
                  if (selectedOption) {
                    formik.setFieldValue("exchangeName", selectedOption.value);
                    formik.setFieldValue(
                      "routingCode",
                      selectedOption.routingCode
                    );
                    formik.setFieldValue(
                      "exchangeId",
                      selectedOption.exchangeId
                    );
                  }
                }}
                options={exchangeHouse}
                value={formik.values.exchangeName}
                error={formik.errors.exchangeName}
                required={true}
              />
            ) : null}

            {formik.values.salaryPaymentMethod === "Bank without WPS" ? (
              <Dropdown
                title={t("Choose Bank Name")}
                placeholder={t("Choose Bank Name")}
                change={(selectedLeaveType) => {
                  const selectedOption = bankList.find(
                    (option) => option.label === selectedLeaveType
                  );
                  if (selectedOption) {
                    formik.setFieldValue("bankName", selectedOption.value);
                    formik.setFieldValue("bankId", selectedOption.bankId);
                    formik.setFieldValue(
                      "routingCode",
                      selectedOption.routingCode
                    );
                  }
                }}
                options={bankList}
                value={formik.values.bankName}
                error={formik.errors.bankName}
                required={true}
              />
            ) : null}

            {!addNewBank && (
              <FormInput
                title={
                  companyDetails?.isPFESIenabled === "1"
                    ? "IFSC"
                    : "Routing Code"
                }
                placeholder={
                  companyDetails?.isPFESIenabled === "1"
                    ? "IFSC"
                    : "Routing Code"
                }
                value={formik.values.routingCode}
                change={(e) => {
                  formik.setFieldValue("routingCode", e);
                }}
                type="text"
                disabled={true}
              />
            )}

            {formik.values.salaryPaymentMethod === "Bank" && !addNewBank ? (
              <FormInput
                title="Trading License"
                value={formik.values.tradingLicense}
                change={(e) => {
                  formik.setFieldValue("tradingLicense", e);
                }}
                type="text"
                disabled={true}
              />
            ) : null}
          </>
        ) : null}
      </FlexCol>
    </DrawerPop>
  );
}
