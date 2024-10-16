import React, { useMemo, useState, useEffect } from "react";
import DrawerPop from "../../../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";
import FormInput from "../../../../common/FormInput";
import FlexCol from "../../../../common/FlexCol";
import Dropdown from "../../../../common/Dropdown";
import CheckBoxInput from "../../../../common/CheckBoxInput";
import { FiSettings } from "react-icons/fi";
import ButtonClick from "../../../../common/Button";
import { PiEye, PiEyeSlash } from "react-icons/pi";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function EmpProvidentFund({
  open,
  close = () => {},
  updateId,
  refresh = () => {},
  statutoryConfigurationId,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [View, setView] = useState(false);
  const [employerRateOptions, setEmployerRateOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeRateOptions, setEmployeeRateOptions] = useState([]);
  const [includeEmployerContribution, setIncludeEmployerContribution] =
    useState(false);
  const [
    includeEmployersEDLIContributionInCTC,
    setIncludeEmployersEDLIContributionInCTC,
  ] = useState(false);
  const [includeAdminChargesInCTC, setIncludeAdminChargesInCTC] =
    useState(false);
  const [overRidePFContributionCheck, setOverRidePFContributionCheck] =
    useState(false);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  const handleClose = () => {
    setShow(false);
  };

  const [functionRender, setFunctionRender] = useState(false);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
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
      establishmentCode: "",
      employerContributionRate: null,
      employeeContributionRate: null,
      employerWageLimit: 15000,
      employeeWageLimit: 15000,
      includeEmployersEDLIContributionInCTC: false,
      includeAdminChargesInCTC: false,
    },
    validationSchema: yup.object().shape({
      establishmentCode: yup
        .string()
        // .matches(
        //   /^[a-zA-Z0-9]{20}$/,
        //   t("EPF Establishment Code must be 20 characters alphanumeric")
        // )
        .required(t("EPF Establishment Code is required")),
      employerContributionRate: yup
        .string()
        .required(t("Employer Contribution Rate is required")),
      employeeContributionRate: yup
        .string()
        .required(t("Employee Contribution Rate is required")),
      employerWageLimit: yup
        .number()
        .min(15000, t("Cannot be less than 15000"))
        .when("employerContributionRate", {
          is: (val) => val && val.includes("Restrict Contribution to"),
          then: yup
            .number()
            .required(t("Employer PF Wage Restriction Limit is required")),
        })
        .test(
          "compare-wage-limits",
          t("Cannot be greater than Employee PF wage restriction limit"),
          function (value) {
            const { employeeWageLimit } = this.parent;
            return value <= employeeWageLimit;
          }
        ),
      employeeWageLimit: yup
        .number()
        .min(15000, t("Cannot be less than 15000"))
        .when("employeeContributionRate", {
          is: (val) => val && val.includes("Restrict Contribution to"),
          then: yup
            .number()
            .required(t("Employee PF Wage Restriction Limit is required"))
            .test(
              "compare-wage-limits",
              t("Cannot be less than Employer PF wage restriction limit"),
              function (value) {
                const { employerWageLimit } = this.parent;
                return value >= employerWageLimit;
              }
            ),
        }),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const employerContribution = {
        percent: 12,
        type: values.employerContributionRate.includes("unrestricted")
          ? "unrestricted"
          : "restricted",
        value: values.employerContributionRate.includes("unrestricted")
          ? null
          : values.employerWageLimit,
      };

      const employeeContribution = {
        percent: 12,
        type: values.employeeContributionRate.includes("unrestricted")
          ? "unrestricted"
          : "restricted",
        value: values.employeeContributionRate.includes("unrestricted")
          ? null
          : values.employeeWageLimit,
      };

      const payload = {
        id: statutoryConfigurationId || null,
        companyId: companyId,
        config: {
          establishmentName: values.establishmentCode,
          employerContribution: employerContribution,
          employeeContribution: employeeContribution,
          employerpfwageLimit: values.employerWageLimit,
          employeepfwageLimit: values.employeeWageLimit,
          configurationData: {
            edliContribution: formik.values
              .includeEmployersEDLIContributionInCTC
              ? 1
              : 0,
            adminCharges: formik.values.includeAdminChargesInCTC ? 1 : 0,
            overRidePfContibution: overRidePFContributionCheck ? 1 : 0,
          },
        },
        isActive: 1,
        createdBy: loggedEmployeeId,
      };

      try {
        const result = await Payrollaction(
          PAYROLLAPI.SAVE_EPF_IN_STATUTORY_COMFIGURATION,
          payload
        );

        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setFunctionRender(!functionRender);
          handleClose();
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
        openNotification(
          "error",
          "Info",
          "There was an error while saving the category. Please try again."
        );
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const restrictText = "12 % of PF Wage (Restrict Contribution to ";
    const unrestrictedText = "12 % of PF wage (Unrestricted)";
    setEmployerRateOptions([
      { value: "unrestricted", label: unrestrictedText },
      {
        value: "restricted",
        label: `${restrictText}${formik.values.employerWageLimit || 15000})`,
      },
    ]);
    setEmployeeRateOptions([
      { value: "unrestricted", label: unrestrictedText },
      {
        value: "restricted",
        label: `${restrictText}${formik.values.employeeWageLimit || 15000})`,
      },
    ]);
  }, [formik.values.employerWageLimit, formik.values.employeeWageLimit]);

  useEffect(() => {
    if (formik.values.employerContributionRate === "restricted") {
      formik.setFieldValue(
        "employerWageLimit",
        formik.values.employerWageLimit
      );
    }
    if (formik.values.employeeContributionRate === "restricted") {
      formik.setFieldValue(
        "employeeWageLimit",
        formik.values.employeeWageLimit
      );
    }
  }, [
    formik.values.employerContributionRate,
    formik.values.employeeContributionRate,
  ]);

  useEffect(() => {
    if (formik.values.employerContributionRate === "unrestricted") {
      formik.setFieldValue("employeeContributionRate", "unrestricted");
    }
  }, [formik.values.employerContributionRate]);

  const handleEmployerContributionChange = (checked) => {
    setIncludeEmployerContribution(checked);
    if (!checked) {
      setIncludeEmployersEDLIContributionInCTC(false);
      setIncludeAdminChargesInCTC(false);
      formik.setFieldValue("includeEmployersEDLIContributionInCTC", false);
      formik.setFieldValue("includeAdminChargesInCTC", false);
    }
  };

  const calculateEPFContributions = () => {
    const employeeWageLimit = formik.values.employeeWageLimit || 15000;
    const employerWageLimit = formik.values.employerWageLimit || 15000;

    const employeeContribution = Math.round((employeeWageLimit * 12) / 100);
    const epsContribution = Math.round(
      (Math.min(employerWageLimit, 15000) * 8.33) / 100
    );
    const epfContribution = Math.round(
      (employerWageLimit * 12) / 100 - epsContribution
    );

    let edliContribution = 0;
    let adminCharges = 0;

    if (includeEmployersEDLIContributionInCTC) {
      edliContribution = Math.round((employerWageLimit * 0.5) / 100);
      edliContribution = Math.min(edliContribution, 75);
    }

    if (includeAdminChargesInCTC) {
      adminCharges = Math.round((employerWageLimit * 0.5) / 100);
    }

    const totalEmployerContribution =
      epsContribution + epfContribution + edliContribution + adminCharges;

    return {
      employeeContribution,
      epsContribution,
      epfContribution,
      edliContribution,
      adminCharges,
      totalEmployerContribution,
    };
  };

  const {
    employeeContribution,
    epsContribution,
    epfContribution,
    edliContribution,
    adminCharges,
    totalEmployerContribution,
  } = calculateEPFContributions();

  const getEpfByIds = async () => {
    if (statutoryConfigurationId) {
      try {
        const result = await Payrollaction(PAYROLLAPI.GET_EPF_RECORDS_BY_ID, {
          id: statutoryConfigurationId,
        });

        if (result.result) {
          const config = result.result.config;

          // Update Formik fields with the fetched values
          formik.setFieldValue("establishmentCode", config.establishmentName);
          formik.setFieldValue(
            "employerContributionRate",
            config.employerContribution.type
          );
          formik.setFieldValue(
            "employeeContributionRate",
            config.employeeContribution.type
          );
          formik.setFieldValue(
            "employerWageLimit",
            config.employerpfwageLimit || 15000
          );
          formik.setFieldValue(
            "employeeWageLimit",
            config.employeepfwageLimit || 15000
          );

          // Set values for the checkboxes based on fetched configuration
          const edliContribution =
            config.configurationData.edliContribution === 1;
          const adminCharges = config.configurationData.adminCharges === 1;
          const overRidePfContribution =
            config.configurationData.overRidePfContibution === 1;

          // Set Formik values for checkboxes
          formik.setFieldValue(
            "includeEmployersEDLIContributionInCTC",
            edliContribution
          );
          formik.setFieldValue("includeAdminChargesInCTC", adminCharges);

          // Update local state for checkboxes
          setIncludeEmployersEDLIContributionInCTC(edliContribution);
          setIncludeAdminChargesInCTC(adminCharges);
          setOverRidePFContributionCheck(overRidePfContribution);

          // Set employer contribution toggle state
          setIncludeEmployerContribution(edliContribution || adminCharges);
        } else {
          console.log("No data found for the given ID");
        }
      } catch (error) {
        console.error("Error fetching EPF records:", error);
      }
    }
  };

  useEffect(() => {
    getEpfByIds();
  }, [statutoryConfigurationId]);

  const epfformat = (value) => {
    if (value == null) {
      return "";
    }

    // Remove any non-alphanumeric characters from the input
    const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, "");

    // Trim the value to a maximum of 12 characters to fit the required format
    const trimmedValue = cleanedValue.substring(0, 15);

    if (trimmedValue.length === 0) {
      // Return an empty string if the input is cleared
      return "";
    }

    // Define the segment lengths for the format AA/AAA/0000000/000
    const segmentLengths = [2, 3, 7, 3];

    // Create segments based on defined lengths
    let index = 0;
    const parts = segmentLengths.map((length) => {
      const segment = trimmedValue.substring(index, index + length);
      index += length;
      return segment;
    });

    // Add the remaining part if there are any characters left
    if (index < trimmedValue.length) {
      parts.push(trimmedValue.substring(index));
    }

    // Join parts with '/' and ensure it does not end with '/'
    const formatted = parts.filter((part) => part.length > 0).join("/");

    return formatted;
  };

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
      contentWrapperStyle={{ width: "540px" }}
      handleSubmit={(e) => {
        formik.handleSubmit();
      }}
      header={[
        !updateId
          ? t("Employee Provident Fund")
          : t("Update Employee Provident Fund"),
        !updateId
          ? t("Manage Employee Provident Fund")
          : t("Update Selected Employee Provident Fund"),
      ]}
      footerBtn={[t("Cancel"), !updateId ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className="relative w-full h-full">
        <FormInput
          name="establishmentCode"
          title={t("EPF Establishment Code")}
          placeholder={t("Establishment Code")}
          required={true}
          value={epfformat(formik.values.establishmentCode)}
          change={(e) => formik.setFieldValue("establishmentCode", e)}
          onBlur={formik.handleBlur}
          // error={
          //   formik.errors.establishmentCode && formik.touched.establishmentCode
          //     ? formik.errors.establishmentCode
          //     : ""
          // }
          error={formik.errors.establishmentCode}
        />
        <Dropdown
          name="employerContributionRate"
          title={t("Employer Contribution Rate")}
          placeholder={"Employer Contribution Rate"}
          options={employerRateOptions}
          required={true}
          value={formik.values.employerContributionRate}
          change={(e) => formik.setFieldValue("employerContributionRate", e)}
          onBlur={formik.handleBlur}
          error={
            formik.errors.employerContributionRate &&
            formik.touched.employerContributionRate
              ? formik.errors.employerContributionRate
              : ""
          }
        />
        {formik.values.employerContributionRate === "restricted" && (
          <FormInput
            name="employerWageLimit"
            title={t("Employer PF Wage Restriction Limit Amount")}
            placeholder={t("Employer PF Wage Restriction Limit")}
            required={true}
            value={formik.values.employerWageLimit}
            change={(e) => {
              const valuedata = e.replace(/[^0-9]/g, "");
              formik.setFieldValue("employerWageLimit", valuedata);
            }}
            onBlur={formik.handleBlur}
            error={
              formik.errors.employerWageLimit &&
              formik.touched.employerWageLimit
                ? formik.errors.employerWageLimit
                : ""
            }
          />
        )}

        <Dropdown
          name="employeeContributionRate"
          title={t("Employee Contribution Rate")}
          options={employeeRateOptions}
          required={true}
          value={formik.values.employeeContributionRate}
          change={(e) => formik.setFieldValue("employeeContributionRate", e)}
          onBlur={formik.handleBlur}
          error={
            formik.errors.employeeContributionRate &&
            formik.touched.employeeContributionRate
              ? formik.errors.employeeContributionRate
              : ""
          }
          disabled={formik.values.employerContributionRate === "unrestricted"}
        />
        {formik.values.employeeContributionRate === "restricted" && (
          <FormInput
            name="employeeWageLimit"
            title={t("Employee PF Wage Restriction Limit Amount")}
            placeholder={t("Employee PF Wage Restriction Limit")}
            required={true}
            value={formik.values.employeeWageLimit}
            change={(e) => {
              const valuedata = e.replace(/[^0-9]/g, "");
              formik.setFieldValue("employeeWageLimit", valuedata);
            }}
            onBlur={formik.handleBlur}
            error={
              formik.errors.employeeWageLimit &&
              formik.touched.employeeWageLimit
                ? formik.errors.employeeWageLimit
                : ""
            }
          />
        )}
        <div className="flex flex-col items-start gap-2 p-5 mt-2 bg-primaryalpha/5 dark:bg-primaryalpha/10 rounded-xl">
          <div className="flex items-center gap-2">
            <span>
              <FiSettings className="text-base 2xl:text-lg text-grey" />
            </span>
            <span className="font-semibold text-sm 2xl:text-base">
              Configuration
            </span>
          </div>
          <CheckBoxInput
            titleRight="Include Employers Contribution in CTC"
            value={includeEmployerContribution}
            change={handleEmployerContributionChange}
          />
          <div className="pl-1 flex flex-col items-start gap-2 ml-5">
            <CheckBoxInput
              titleRight="Include Employers EDLI Contribution in CTC"
              disabled={!includeEmployerContribution}
              value={includeEmployersEDLIContributionInCTC}
              change={(checked) => {
                setIncludeEmployersEDLIContributionInCTC(checked);
                formik.setFieldValue(
                  "includeEmployersEDLIContributionInCTC",
                  checked
                );
              }}
            />
            <CheckBoxInput
              titleRight="Include Admin Charges in CTC"
              disabled={!includeEmployerContribution}
              value={includeAdminChargesInCTC}
              change={(checked) => {
                setIncludeAdminChargesInCTC(checked);
                formik.setFieldValue("includeAdminChargesInCTC", checked);
              }}
            />
          </div>
          <CheckBoxInput
            titleRight="Override PF Contribution Restriction at Employee Level"
            value={overRidePFContributionCheck}
            change={(checked) => setOverRidePFContributionCheck(checked)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-2 p-5 bg-primaryalpha/5 dark:bg-primaryalpha/10 rounded-xl">
          <div className="flex flex-col gap-2 items-center md:flex-row md:justify-between">
            <p className="flex flex-col gap-1">
              <span className="font-semibold text-sm 2xl:text-base">
                Sample EPF Calculation
              </span>
              <span className="text-sm 2xl:text-base">
                Let’s assume PF wage is ₹{" "}
                {formik.values.employeeWageLimit || 15000}, the breakup will be:
              </span>
            </p>
            <ButtonClick
              buttonName={View == true ? "Hide" : "View"}
              icon={View == true ? <PiEyeSlash /> : <PiEye />}
              handleSubmit={() => setView(!View)}
            />
          </div>
          {View && (
            <div className="borderb p-3 rounded-lg mt-3 mb-3 bg-white dark:bg-dark">
              <div className="flex flex-col gap-2 text-xs 2xl:text-sm">
                <div className="font-semibold">Employee Contribution</div>
                <div className="flex items-center justify-between">
                  <span className="text-grey">
                    EPF(12% of ₹ {formik.values.employeeWageLimit || 15000}){" "}
                  </span>
                  <span className="font-medium">₹{employeeContribution}</span>
                </div>
              </div>
              <div className="divider-h m-auto mt-3 mb-3" />
              <div className="flex flex-col gap-2 text-xs 2xl:text-sm">
                <div className="font-semibold">Employer Contribution</div>
                <div className="flex items-center justify-between">
                  <span className="text-grey">
                    EPS(8.33% of ₹{" "}
                    {Math.min(formik.values.employerWageLimit || 15000, 15000)},
                    Max of 15000){" "}
                  </span>
                  <span className="font-medium">₹{epsContribution}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-grey">
                    EPF(12% of ₹ {formik.values.employerWageLimit || 15000} -
                    EPS)
                  </span>
                  <span className="font-medium">₹{epfContribution}</span>
                </div>
                {includeEmployersEDLIContributionInCTC && (
                  <div className="flex items-center justify-between">
                    <span className="text-grey">
                      EDLI(0.50% of ₹ {formik.values.employerWageLimit || 15000}{" "}
                      capped at 75)
                    </span>
                    <span className="font-medium">₹{edliContribution}</span>
                  </div>
                )}
                {includeAdminChargesInCTC && (
                  <div className="flex items-center justify-between">
                    <span className="text-grey">
                      Admin Charges(0.50% of ₹{" "}
                      {formik.values.employerWageLimit || 15000})
                    </span>
                    <span className="font-medium">₹{adminCharges}</span>
                  </div>
                )}
              </div>
              <div className="divider-h m-auto mt-3 mb-3" />
              <div className="flex items-center justify-between text-xs 2xl:text-sm">
                <span className="text-grey">Total</span>
                <span className="font-medium">
                  ₹{totalEmployerContribution}
                </span>
              </div>
            </div>
          )}
        </div>
      </FlexCol>
    </DrawerPop>
  );
}
