import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../../../common/DrawerPop";
import FormInput from "../../../../common/FormInput";
import axios from "axios";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import API, { action } from "../../../../Api";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function AddBankAccount({
  open,
  close = () => {},
  refresh = () => {},
}) {
  const { t } = useTranslation();

  const [addBank, setAddBank] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);

  const [functionRender, setFunctionRender] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [ifscSuggestions, setIfscSuggestions] = useState([]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const result = await action(API.GET_COMPANY_ID_BASED_RECORDS, {
          id: companyId,
        });
        setCompanyDetails(result.result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompanyDetails();
  }, []);

  useMemo(
    () =>
      setTimeout(() => {
        addBank === false && close(false);
      }, 800),
    [addBank]
  );

  const handleClose = () => {
    setAddBank(false);
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
      bankName: "",
      routingCode: "",
      ifscCode: "",
      bankBranch: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      bankName: yup
        .string()
        .required("Bank Name is required")
        .matches(
          /^[a-zA-Z\s]+$/,
          "Bank name can contain letters and spaces only; it must not contain numbers or special characters"
        )
        .min(3, "Bank name must be at least 3 characters")
        .max(30, "Bank name must not exceed 30 characters"),
      // routingCode: yup.string().when("code", {
      //   is: "0",
      //   then: yup
      //     .string()
      //     .required("Routing Code is required and must contain numbers only")
      //     .matches(/^[0-9A-Za-z]+$/, "Routing Code must contain numbers only")
      //     .min(9, "Routing Code must be at least 9 digits")
      //     .max(11, "Routing Code must not exceed 11 digits")
      //     .matches(
      //       /^(?!0{1}\d{8}$)\d{9,11}$/,
      //       "Routing Code must be 9-11 digits long and cannot start with zero"
      //     ),
      // }),
      routingCode: yup
        .string()
        .when(["isPFESIenabled"], (isPFESIenabled, schema) => {
          // Assuming 'isPFESIenabled' is either 0 or 1
          if (parseInt(companyDetails?.isPFESIenabled) === 0) {
            return schema
              .required("Routing Code is required")
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
              );
          }
          return schema;
        }),

      // ifscCode: yup.string().when("isPFESIenabled", {
      //   is: "1",
      //   then: yup
      //     .string()
      //     .required("IFSC Code is required and must contain numbers only")
      //     .matches(/^[0-9A-Za-z]+$/, "IFSC Code must contain numbers only")
      //     .min(11, "IFSC Code must be 11 digits"),
      // }),
      ifscCode: yup
        .string()
        .when(["isPFESIenabled"], (isPFESIenabled, schema) => {
          // Assuming 'isPFESIenabled' is either 0 or 1
          if (companyDetails?.isPFESIenabled === "1") {
            return schema
              .required("IFSC Code is required")
              .matches(/^[0-9A-Za-z]{1,11}$/, {
                message:
                  "IFSC Code must contain numbers only and be 9-11 digits long",
                excludeEmptyString: true,
              })
              .test(
                "no-zero-start",
                "IFSC Code cannot start with zero",
                (value) => {
                  return !/^(0\d{8,10})$/.test(value);
                }
              );
          }
          return schema;
        }),

      bankBranch: yup
        .string()
        .required("Branch Name is required")
        .matches(
          /^[a-zA-Z\s,]+$/,
          "Branch name can contain only alphabets, spaces and commas"
        )
        .min(3, "Bank branch must be at least 3 characters")
        .max(30, "Bank branch must not exceed 30 characters"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId) {
          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_BANKRECORD_BYID,
            {
              id: updateId,
              bankName: formik.values.bankName,
              routingCode: formik.values.routingCode || formik.values.ifscCode,
              bankBranch: formik.values.bankBranch,
              companyId: companyId,
            }
          );
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);

            setTimeout(() => {
              handleClose();
              refresh();
              setLoading(false);
              setFunctionRender(!functionRender);
            }, 1000);
          } else if (result.status === 400) {
            const errorMessage =
              result.errors &&
              result.errors[0] &&
              (result.errors[0].bankName ||
                result.errors[0].routingCode ||
                result.errors[0].ifscCode ||
                result.errors[0].bankBranch);
            openNotification("error", "Info", errorMessage || result.message);
            setLoading(false);
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await Payrollaction(
            PAYROLLAPI.CREATE_BANK_BANKACCOUNTSETTING,
            {
              // companyId: companyDataId,
              bankName: e.bankName,
              routingCode: e.routingCode || e.ifscCode,
              bankBranch: e.bankBranch,
              companyId: companyId,
              isActive: "1",
              createdBy: employeeId,
            }
          );
          if (result.status === 200) {
            // alert("success");
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              // close()
              refresh();
              setFunctionRender(!functionRender);
              setLoading(false);
            }, 1000);
          } else if (result.status === 400) {
            const errorMessage =
              result.errors &&
              result.errors[0] &&
              (result.errors[0].bankName ||
                result.errors[0].routingCode ||
                result.errors[0].ifscCode ||
                result.errors[0].bankBranch);
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

  const getBankRecordsByIds = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await Payrollaction(PAYROLLAPI.GET_BANK_RECORDS_BY_ID, {
        id: e,
      });
      if (result.result && result.result.length > 0) {
        formik.setFieldValue("bankName", result.result[0].bankName);
        formik.setFieldValue("routingCode", result.result[0].routingCode);
        formik.setFieldValue("ifscCode", result.result[0].routingCode);
        formik.setFieldValue("bankBranch", result.result[0].bankBranch);
        setupdateBtn(true);
      } else {
        // Handle the case where no data is returned for the given ID
        console.log("No data found for the given ID");
      }
    }
  };

  useEffect(() => {
    getBankRecordsByIds(updateId);
  }, [updateId]);

  const handleIfscChange = async (e) => {
    const ifscCode = e;
    formik.setFieldValue("ifscCode", ifscCode);
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
    formik.setFieldValue("bankName", suggestion.BANK);
    formik.setFieldValue("bankBranch", suggestion.BRANCH);
    formik.setFieldValue("ifscCode", suggestion.IFSC);
    setIfscSuggestions([]);
  };

  return (
    <DrawerPop
      open={addBank}
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
      header={[!updateId ? t("Create Bank") : t("Update Bank")]}
      footerBtn={[t("Cancel"), !updateId ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <div className="relative w-full h-full">
        <div className="py-1">
          {companyDetails && companyDetails?.isPFESIenabled === "1" && (
            <div className="relative">
              <FormInput
                title={t("IFSC")}
                placeholder={t("IFSC")}
                change={handleIfscChange}
                required={true}
                maxLength={11}
                value={formik.values.ifscCode}
                error={formik.errors.ifscCode}
              />
              {ifscSuggestions.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 w-full mt-1 max-h-48 overflow-y-auto z-10">
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
            </div>
          )}
          {companyDetails && companyDetails?.isPFESIenabled !== "1" && (
            <FormInput
              title={t("Routing_Code")}
              placeholder={t("Routing_Code")}
              change={(e) => {
                formik.setFieldValue("routingCode", e);
              }}
              required={true}
              maxLength={11}
              value={formik.values.routingCode}
              error={formik.errors.routingCode}
            />
          )}
        </div>

        <div className="pt-[13px]">
          <FormInput
            title={t("Bank_Name")}
            placeholder={t(`Bank_Name`)}
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
            title={t("Branch_Name")}
            placeholder={t(`Branch_Name`)}
            change={(e) => {
              formik.setFieldValue("bankBranch", e);
            }}
            required={true}
            value={formik.values.bankBranch}
            error={formik.errors.bankBranch}
          />
        </div>
      </div>
    </DrawerPop>
  );
}
