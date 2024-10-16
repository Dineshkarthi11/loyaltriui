import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import DrawerPop from "../../../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import { FiSettings } from "react-icons/fi";
import FormInput from "../../../../common/FormInput";
import FlexCol from "../../../../common/FlexCol";
import CheckBoxInput from "../../../../common/CheckBoxInput";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function EmpStateInsurance({
  open,
  close = () => {},
  updateId,
  refresh = () => {},
  statutoryConfigurationId,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [loading, setLoading] = useState(false);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const handleClose = () => {
    setShow(false);
  };

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 1500),
    [show]
  );

  const formik = useFormik({
    initialValues: {
      esiEmployerCode: "",
      employerContribution: "",
      employeeContribution: "",
      includeEmployersContributionInCTC: false,
      autoStopMethod: "",
    },
    validationSchema: yup.object().shape({
      esiEmployerCode: yup
        .string()
        // .matches(
        //   /^[a-zA-Z0-9]{17}$/,
        //   t("ESI Employer Code must be 17 characters alphanumeric")
        // )
        .required(t("ESI Employer Code is required")),
      employerContribution: yup
        .number()
        .max(100, t("Cannot be more than 100%"))
        .required(t("Employer Contribution  is required")),
      employeeContribution: yup
        .number()
        .max(100, t("Cannot be more than 100%"))
        .required(t("Employee Contribution  is required")),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const payload = {
        id: statutoryConfigurationId || null,
        companyId: companyId,
        config: {
          esiemployercode: values.esiEmployerCode,
          employerContributiongrossway: parseFloat(values.employerContribution),
          employeeContributiongrossway: parseFloat(values.employeeContribution),
          configurationData: {
            includeEmployeeContributionInCtc:
              values.includeEmployersContributionInCTC ? 1 : 0,
            deductEsiEndContribution:
              values.autoStopMethod === "deductESI" ? 1 : 0,
            stopAfterAbove21000: values.autoStopMethod === "autoStop" ? 1 : 0,
          },
        },
        isActive: 1,
        createdBy: loggedEmployeeId,
      };

      try {
        const result = await Payrollaction(
          PAYROLLAPI.SAVE_ESI_IN_STATUTORY_COMFIGURATION,
          payload
        );

        if (result.status === 200) {
          // Close the drawer immediately
          handleClose();
          // Trigger refresh immediately
          refresh();
          setLoading(false);

          // Show the success notification after closing the drawer
          openNotification("success", "Successful", result.message);
        } else if (result.status === 500) {
          openNotification("error", "Info", result.message);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during form submission:", error);
        openNotification(
          "error",
          "Info",
          "There was an error while saving the category. Please try again."
        );
        setLoading(false);
      }
    },
  });

  const getEsiByIds = async () => {
    if (statutoryConfigurationId) {
      try {
        const result = await Payrollaction(PAYROLLAPI.GET_EPF_RECORDS_BY_ID, {
          id: statutoryConfigurationId,
        });
        if (result.result) {
          const config = result.result.config;
          formik.setFieldValue("esiEmployerCode", config.esiemployercode);
          formik.setFieldValue(
            "employerContribution",
            config.employerContributiongrossway
          );
          formik.setFieldValue(
            "employeeContribution",
            config.employeeContributiongrossway
          );
          formik.setFieldValue(
            "includeEmployersContributionInCTC",
            config.configurationData.includeEmployeeContributionInCtc === 1
          );
          formik.setFieldValue(
            "autoStopMethod",
            config.configurationData.deductEsiEndContribution === 1
              ? "deductESI"
              : config.configurationData.stopAfterAbove21000 === 1
              ? "autoStop"
              : ""
          );
        } else {
          console.log("No data found for the given ID");
        }
      } catch (error) {
        console.error("Error fetching EPF records:", error);
      }
    }
  };

  useEffect(() => {
    getEsiByIds();
  }, [statutoryConfigurationId]);

  const esiformat = (value) => {
    if (value == null) {
      return "";
    }

    // Remove any non-alphanumeric characters from the input
    const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, "");

    // Trim the value to a maximum of 17 characters (2 + 2 + 6 + 3 + 4)
    const trimmedValue = cleanedValue.substring(0, 17);

    // Define the segment lengths for the format 00-00-000000-000-0000
    const segmentLengths = [2, 2, 6, 3, 4];

    // Create segments based on defined lengths
    let index = 0;
    const parts = segmentLengths.map((length) => {
      const segment = trimmedValue.substring(index, index + length);
      index += length;
      return segment;
    });

    // Join parts with '-' and ensure it does not end with '-'
    const formatted = parts.filter((part) => part.length > 0).join("-");

    return formatted;
  };
  return (
    <DrawerPop
      open={open}
      close={handleClose}
      contentWrapperStyle={{
        width: "540px",
      }}
      header={[
        !updateId
          ? t("Employee State Insurance")
          : t("Update Employee State Insurance"),
        !updateId
          ? t("Manage Employee State Insurance")
          : t("Update Selected Employee State Insurance"),
      ]}
      footerBtn={[t("Cancel"), !updateId ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
      handleSubmit={formik.handleSubmit}
    >
      <FlexCol className="relative w-full h-full">
        <FormInput
          title={t("ESI Employer Code")}
          placeholder={t("ESI Employer Code TN/MAS/1234567/000")}
          required={true}
          value={esiformat(formik.values.esiEmployerCode)}
          change={(e) => formik.setFieldValue("esiEmployerCode", e)}
          name="esiEmployerCode"
          error={
            formik.touched.esiEmployerCode && formik.errors.esiEmployerCode
          }
        />
        <FormInput
          title={t("Employer Contribution (% of gross pay)")}
          placeholder={t("Employer Contribution")}
          required={true}
          value={formik.values.employerContribution}
          change={(e) => {
            let value = e;

            // Validate input: allow numbers with up to two decimals
            if (value === "" || /^\d{0,3}(\.\d{0,2})?$/.test(value)) {
              // If value is greater than 100, set it to 100
              if (parseFloat(value) > 100) {
                value = "100";
              }

              // Set the value in Formik's state
              formik.setFieldValue("employerContribution", value);
            }
          }}
          name="employerContribution"
          error={
            formik.touched.employerContribution &&
            formik.errors.employerContribution
          }
          inputProps={{
            type: "text", // Use 'text' to allow full control over the input
            min: 0,
            max: 100,
          }}
        />

        <FormInput
          title={t("Employee Contribution (% of gross pay)")}
          placeholder={t("Employee Contribution")}
          required={true}
          value={formik.values.employeeContribution}
          change={(e) => {
            let value = e;

            // Validate input: allow numbers with up to two decimals
            if (value === "" || /^\d{0,3}(\.\d{0,2})?$/.test(value)) {
              // If value is greater than 100, set it to 100
              if (parseFloat(value) > 100) {
                value = "100";
              }

              // Set the value in Formik's state
              formik.setFieldValue("employeeContribution", value);
            }
          }}
          name="employeeContribution"
          error={
            formik.touched.employeeContribution &&
            formik.errors.employeeContribution
          }
          inputProps={{
            type: "text", // Use 'text' to allow full control over the input
            min: 0,
            max: 100,
          }}
        />

        <div className="flex flex-col items-start gap-4 p-5 mt-2 bg-primaryalpha/5 dark:bg-primaryalpha/10 rounded-xl">
          <div className="flex items-center gap-2">
            <span>
              {" "}
              <FiSettings className="text-base 2xl:text-lg text-grey" />
            </span>
            <span className="font-semibold text-sm 2xl:text-base">
              Configuration
            </span>
          </div>
          <CheckBoxInput
            titleRight="Include Employers Contribution in CTC"
            value={formik.values.includeEmployersContributionInCTC}
            change={() =>
              formik.setFieldValue(
                "includeEmployersContributionInCTC",
                !formik.values.includeEmployersContributionInCTC
              )
            }
          />
          <div className="font-semibold text-xs 2xl:text-sm">
            Auto Stop Method
          </div>
          {[
            {
              id: "deductESI",
              name: "Deduct ESI till end of Contribution Period",
            },
            { id: "autoStop", name: "Auto Stop for Salary Above 21000" },
          ].map((item, index) => (
            <div
              className="flex items-center gap-2 cursor-pointer"
              key={index}
              onClick={() => {
                formik.setFieldValue("autoStopMethod", item.id);
              }}
            >
              <div
                className={`${
                  formik.values.autoStopMethod === item.id && "border-primary"
                } border  rounded-full`}
              >
                <div
                  className={`font-semibold text-base w-4 h-4 border-2 border-white dark:border-white/10 rounded-full ${
                    formik.values.autoStopMethod === item.id &&
                    "text-primary bg-primary"
                  } `}
                ></div>
              </div>
              <span className="font-medium text-xs 2xl:text-sm">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </FlexCol>
    </DrawerPop>
  );
}
