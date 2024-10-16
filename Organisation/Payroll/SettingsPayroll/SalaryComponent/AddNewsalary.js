import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../../../common/DrawerPop";
import { useFormik } from "formik";
import FormInput from "../../../../common/FormInput";
import * as yup from "yup";
import { Tooltip } from "antd";
import { AiFillInfoCircle, AiOutlineSetting } from "react-icons/ai";
import Dropdown from "../../../../common/Dropdown";
import CheckBoxInput from "../../../../common/CheckBoxInput";
import RadioButton from "../../../../common/RadioButton";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function Addnewsalary({
  open,
  close = () => {},
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [createEarnings, setCreateEarnings] = useState(open);
  const [UpdateBtn, setUpdateBtn] = useState(false);
  const [functionRender, setFunctionRender] = useState(false);

  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );
  const [isUpdate, setIsUpdate] = useState(!!updateId);
  const [earningsData, setEarningsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEarning, setSelectedEarning] = useState(null);
  const [alwaysConsiderChecked, setAlwaysConsiderChecked] = useState(false);
  const [considerBelowChecked, setConsiderBelowChecked] = useState(false);
  const [taxableComponentChecked, setTaxableComponentChecked] = useState(false);
  const [proRataBasisCalculationChecked, setProRataBasisCalculationChecked] =
    useState(false);
  const [proRataBasisCalculationDisabled, setProRataBasisCalculationDisabled] =
    useState(false);
  const [esiConsiderChecked, setEsiConsiderChecked] = useState(false);
  const [fbpAllowOverrideLimitChecked, setFbpAllowOverrideLimitChecked] =
    useState(false);
  const [
    fbpTaxBenefitProofRequiredChecked,
    setFbpTaxBenefitProofRequiredChecked,
  ] = useState(false);
  const [fbpProcessWithPayrollChecked, setFbpProcessWithPayrollChecked] =
    useState(false);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [pfContributionChecked, setPfContributionChecked] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [earnings, setEarnings] = useState([]);
  const [initialValues, setInitialValues] = useState({
    earningTypeId: null,
    earningsName: "",
    earningsPaySlipName: "",
    pfAlwaysConsider: "0",
    pfVageBlowfifteenConsider: "0",
    esiConsider: "0",
    taxableConsider: "0",
    proRataBasisCalculation: "0",
    fbpAllowOverrideLimit: "0",
    fbpTaxBenefitProofRequired: "0",
    fbpProcessWithPayroll: "0",
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnMount: false,

    validationSchema: yup.object().shape({
      earningsName: yup.string().required(t("Name is required")),
      earningsPaySlipName: yup.string().required(t("Payslip Name is required")),
      earningTypeId: yup.string().required(t("Earning type is required")),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      const earningsHierarchyTypeIdValue = selectedEarning
        ? selectedEarning.value
        : null;

      const payload = {
        earningsName: e.earningsName,
        earningsPaySlipName: e.earningsPaySlipName,
        companyId: companyId,
        isActive: 1,
        createdBy: loggedEmployeeId,
        earningsHierarchyTypeId: earningsHierarchyTypeIdValue,
        pfAlwaysConsider: alwaysConsiderChecked ? "1" : "0",
        pfVageBlowfifteenConsider: considerBelowChecked ? "1" : "0",
        esiConsider: esiConsiderChecked ? 1 : 0,
        taxableConsider: taxableComponentChecked ? 1 : 0,
        proRataBasisCalculation: proRataBasisCalculationChecked ? 1 : 0,
        fbpAllowOverrideLimit: fbpAllowOverrideLimitChecked ? 1 : 0,
        fbpTaxBenefitProofRequired: fbpTaxBenefitProofRequiredChecked ? 1 : 0,
        fbpProcessWithPayroll: fbpProcessWithPayrollChecked ? 1 : 0,
      };

      const Updatepayload = {
        id: updateId,
        earningsName: formik.values.earningsName,
        earningsPaySlipName: formik.values.earningsPaySlipName,
        companyId: companyId,
        isActive: 1,
        createdBy: loggedEmployeeId,
        earningsHierarchyTypeId: earningsHierarchyTypeIdValue,
        pfAlwaysConsider: alwaysConsiderChecked ? 1 : 0,
        pfVageBlowfifteenConsider: considerBelowChecked ? 1 : 0,
        esiConsider: esiConsiderChecked ? 1 : 0,
        taxableConsider: taxableComponentChecked ? 1 : 0,
        proRataBasisCalculation: proRataBasisCalculationChecked ? 1 : 0,
        fbpAllowOverrideLimit: fbpAllowOverrideLimitChecked ? 1 : 0,
        fbpTaxBenefitProofRequired: fbpTaxBenefitProofRequiredChecked ? 1 : 0,
        fbpProcessWithPayroll: fbpProcessWithPayrollChecked ? 1 : 0,
      };

      try {
        if (updateId) {
          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_SALARYCOMPONENTS_EARNINGS_INDIAN_COMPONENT_BY_ID,
            Updatepayload
          );
          if (result.status === 200) {
            openNotification("success", "Update Successful", result.message);
            setTimeout(() => {
              handleClose();
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
            payload
          );
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);

            setTimeout(() => {
              handleClose();
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
        console.error("Error during form submission:", error);
        openNotification("error", "Info", error.message);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const response = await Payrollaction(
          PAYROLLAPI.GET_ALL_EARNINGS_RECORDS_FOR_INDIAN_COMPONENT
        );

        if (response.status === 200) {
          const options = response.result.map((item) => ({
            value: item.earningsHierarchyTypeId,
            label: item.typeName,
            ...item, // Spread the item to pass all properties to the options
          }));

          setEarningsData(options);
        } else {
          console.log("No earnings data found.");
        }
      } catch (error) {
        console.error("Error fetching earnings data:", error);
      }
    };

    fetchEarningsData();
  }, []);

  useEffect(() => {
    if (updateId) {
      const matchingEarning = earningsData.find(
        (earning) => earning.earningsHierarchyTypeId === updateId
      );

      if (matchingEarning) {
        formik.setValues({
          ...formik.values,
          pfAlwaysConsider: matchingEarning.pfAlwaysConsider,
          pfVageBlowfifteenConsider: matchingEarning.pfVageBlowfifteenConsider,
          esiConsider: matchingEarning.esiConsider,
          taxableConsider: matchingEarning.taxableConsider,
          proRataBasisCalculation: matchingEarning.proRataBasisCalculation,
          fbpAllowOverrideLimit: matchingEarning.fbpAllowOverrideLimit,
          fbpTaxBenefitProofRequired:
            matchingEarning.fbpTaxBenefitProofRequired,
          fbpProcessWithPayroll: matchingEarning.fbpProcessWithPayroll,
        });

        // Set checkboxes and enable/disable states
        setAlwaysConsiderChecked(matchingEarning.pfAlwaysConsider === "1");
        setConsiderBelowChecked(
          matchingEarning.pfVageBlowfifteenConsider === "1"
        );
        setEsiConsiderChecked(matchingEarning.esiConsider === "1");
        setTaxableComponentChecked(matchingEarning.taxableConsider === "1");
        setProRataBasisCalculationChecked(
          matchingEarning.proRataBasisCalculation === "1"
        );
        setProRataBasisCalculationDisabled(
          matchingEarning.proRataBasisCalculation !== "2"
        );

        setFbpAllowOverrideLimitChecked(
          matchingEarning.fbpAllowOverrideLimit === "1"
        );
        setFbpTaxBenefitProofRequiredChecked(
          matchingEarning.fbpTaxBenefitProofRequired === "1"
        );
        setFbpProcessWithPayrollChecked(
          matchingEarning.fbpProcessWithPayroll === "1"
        );
      }
    }
  }, [updateId, earningsData]);

  const handleEarningTypeChange = (selectedEarningTypeId) => {
    const selectedOption = earningsData.find(
      (option) => option.value === selectedEarningTypeId
    );
    if (selectedOption) {
      formik.setFieldValue("earningTypeName", `${selectedOption.label}`);
      formik.setFieldValue("earningTypeId", selectedOption.value);

      // Clear error when an option is selected
      formik.setFieldError("earningTypeId", "");

      setSelectedEarning(selectedOption);
    }
  };

  const handleClose = () => {
    close();
    setCreateEarnings(false);
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

  const renderEarningConfig = (earning) => {
    const isFbpComponentChecked =
      fbpAllowOverrideLimitChecked ||
      fbpTaxBenefitProofRequiredChecked ||
      fbpProcessWithPayrollChecked;

    return (
      <div
        className="bg-[#FBFBFF] dark:bg-dark rounded-md p-6 flex flex-col gap-6"
        key={earning.earningsHierarchyTypeId}
      >
        <div className="flex gap-2 items-center">
          <AiOutlineSetting size={16} className="text-grey" />
          <p className="font-semibold text-sm 2xl:text-base">Configurations</p>
        </div>
        <div className="flex flex-col gap-2">
          <CheckBoxInput
            classname="m-0"
            titleClassName="text-grey"
            titleRight="PF Contribution"
            value={pfContributionChecked}
            disabled={true} // Always disabled based on the logic
          />

          <div className="px-5">
            <RadioButton
              className="text-grey"
              options={[
                {
                  label: "Always Consider",
                  value: "1",
                  disabled: earning.pfAlwaysConsider !== "2",
                  checked: alwaysConsiderChecked,
                },
              ]}
              value={formik.values.pfAlwaysConsider}
              onSelect={() => {
                if (earning.pfAlwaysConsider === "2") {
                  setAlwaysConsiderChecked(true);
                  setConsiderBelowChecked(false);
                  setPfContributionChecked(true);
                  formik.setFieldValue("pfAlwaysConsider", "1");
                  formik.setFieldValue("pfVageBlowfifteenConsider", "0");
                }
              }}
            />
            <RadioButton
              className="text-grey"
              options={[
                {
                  label: "Consider Only when Wage Below ₹15,000",
                  value: "1",
                  disabled: earning.pfVageBlowfifteenConsider !== "2",
                  checked: considerBelowChecked,
                },
              ]}
              value={formik.values.pfVageBlowfifteenConsider}
              onSelect={() => {
                if (earning.pfVageBlowfifteenConsider === "2") {
                  setConsiderBelowChecked(true);
                  setAlwaysConsiderChecked(false);
                  setPfContributionChecked(true);
                  formik.setFieldValue("pfVageBlowfifteenConsider", "1");
                  formik.setFieldValue("pfAlwaysConsider", "0");
                }
              }}
            />
          </div>

          <CheckBoxInput
            classname="m-0"
            titleClassName="text-grey"
            titleRight="Make this a taxable component"
            value={earning.taxableConsider === "1" || taxableComponentChecked}
            change={() => {
              if (earning.taxableConsider === "2") {
                setTaxableComponentChecked(!taxableComponentChecked);
                formik.setFieldValue(
                  "taxableConsider",
                  !taxableComponentChecked ? "1" : "0"
                );
              }
            }}
            disabled={earning.taxableConsider !== "2"} // Disable in edit mode
          />

          <div className="flex items-center">
            <CheckBoxInput
              classname="m-0"
              titleClassName="text-grey"
              titleRight="Calculation For this component will be pro rata"
              value={proRataBasisCalculationChecked}
              change={() => {
                if (earning.proRataBasisCalculation === "2") {
                  setProRataBasisCalculationChecked(
                    !proRataBasisCalculationChecked
                  );
                  formik.setFieldValue(
                    "proRataBasisCalculation",
                    !proRataBasisCalculationChecked ? "1" : "0"
                  );
                }
              }}
              disabled={earning.proRataBasisCalculation !== "2"} // Handle edit and checked logic
            />
            <Tooltip title="Pro rata enabled: This will adjust calculations based on the proportion of present days.">
              <AiFillInfoCircle
                size={16}
                className="ml-2 text-grey cursor-pointer"
              />
            </Tooltip>
          </div>

          <CheckBoxInput
            classname="m-0"
            titleRight="Consider for ESI Contribution"
            value={earning.esiConsider === "1" || esiConsiderChecked}
            change={() => {
              if (earning.esiConsider === "2") {
                setEsiConsiderChecked(!esiConsiderChecked);
                formik.setFieldValue(
                  "esiConsider",
                  !esiConsiderChecked ? "1" : "0"
                );
              }
            }}
            disabled={earning.esiConsider !== "2"} // Disable in edit mode
          />

          <CheckBoxInput
            classname="m-0"
            titleClassName="text-grey"
            titleRight="Mark this component as a FBP component"
            value={isFbpComponentChecked}
            change={() => {}}
            disabled={true} // Always disabled
          />

          <div className="px-5 flex flex-col gap-2">
            <CheckBoxInput
              classname="m-0"
              titleClassName="text-grey"
              titleRight="Allow limit override"
              value={
                earning.fbpAllowOverrideLimit === "1" ||
                fbpAllowOverrideLimitChecked
              }
              change={() => {
                if (earning.fbpAllowOverrideLimit === "2") {
                  setFbpAllowOverrideLimitChecked(
                    !fbpAllowOverrideLimitChecked
                  );
                  formik.setFieldValue(
                    "fbpAllowOverrideLimit",
                    !fbpAllowOverrideLimitChecked ? "1" : "0"
                  );
                }
              }}
              disabled={earning.fbpAllowOverrideLimit !== "2"} // Disable in edit mode
            />

            <CheckBoxInput
              classname="m-0"
              titleClassName="text-grey"
              titleRight="Proof required for tax benefit"
              value={
                earning.fbpTaxBenefitProofRequired === "1" ||
                fbpTaxBenefitProofRequiredChecked
              }
              change={() => {
                if (earning.fbpTaxBenefitProofRequired === "2") {
                  setFbpTaxBenefitProofRequiredChecked(
                    !fbpTaxBenefitProofRequiredChecked
                  );
                  formik.setFieldValue(
                    "fbpTaxBenefitProofRequired",
                    !fbpTaxBenefitProofRequiredChecked ? "1" : "0"
                  );
                }
              }}
              disabled={earning.fbpTaxBenefitProofRequired !== "2"} // Disable in edit mode
            />

            <CheckBoxInput
              classname="m-0"
              titleClassName="text-grey"
              titleRight="Process with payroll"
              value={
                earning.fbpProcessWithPayroll === "1" ||
                fbpProcessWithPayrollChecked
              }
              change={() => {
                if (earning.fbpProcessWithPayroll === "2") {
                  setFbpProcessWithPayrollChecked(
                    !fbpProcessWithPayrollChecked
                  );
                  formik.setFieldValue(
                    "fbpProcessWithPayroll",
                    !fbpProcessWithPayrollChecked ? "1" : "0"
                  );
                }
              }}
              disabled={earning.fbpProcessWithPayroll !== "2"} // Disable in edit mode
            />
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (updateId) {
      getEarningsRecordsByIds(updateId);
    }
  }, [updateId, earningsData]); // Add earningsData dependency

  const getEarningsRecordsByIds = async (e) => {
    if (e !== "" && updateId) {
      try {
        const result = await Payrollaction(
          PAYROLLAPI.GET_EARNINGS_RECORDS_BY_ID,
          {
            id: e,
          }
        );
        if (result.result && result.result.length > 0) {
          const data = result.result[0];
          formik.setFieldValue("earningsName", data.earningsName);
          formik.setFieldValue("earningsPaySlipName", data.earningsPaySlipName);
          formik.setFieldValue("earningTypeId", data.earningsHierarchyTypeId);
          formik.setFieldValue("earningTypeName", data.earningTypeName);
          setAlwaysConsiderChecked(data.pfAlwaysConsider === "1");
          if (data.pfAlwaysConsider === "1") {
            formik.setFieldValue("pfAlwaysConsider", "1");
            setPfContributionChecked(true);
          }
          setConsiderBelowChecked(data.pfVageBlowfifteenConsider === "1");
          if (data.pfVageBlowfifteenConsider === "1") {
            formik.setFieldValue("pfVageBlowfifteenConsider", "1");
            setPfContributionChecked(true);
          }
          setEsiConsiderChecked(data.esiConsider === "1");
          setTaxableComponentChecked(data.taxableConsider === "1");
          setProRataBasisCalculationChecked(
            data.proRataBasisCalculation === "1"
          );
          setFbpAllowOverrideLimitChecked(data.fbpAllowOverrideLimit === "1");
          setFbpTaxBenefitProofRequiredChecked(
            data.fbpTaxBenefitProofRequired === "1"
          );
          setFbpProcessWithPayrollChecked(data.fbpProcessWithPayroll === "1");

          const selectedOption = earningsData.find(
            (option) => option.value === data.earningsHierarchyTypeId
          );
          setSelectedEarning(selectedOption);

          setUpdateBtn(true);
        } else {
          console.log("No data found for the given ID");
        }
      } catch (error) {
        console.error("Error fetching earnings data by ID:", error);
      }
    }
  };

  useEffect(() => {
    getEarningsRecordsByIds(updateId);
  }, [updateId, earningsData]); // Add earningsData dependency

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

    const fetchEarningData = async () => {
      if (actionId) {
        const earnings = await getEarningList(); // Fetch the list of earnings
        const earning = earnings.find(
          (e) => e.earningsId === parseInt(actionId)
        );

        if (earning) {
          setInitialValues({
            earningTypeId: earning.earningTypeId,
            earningsName: earning.earningsName,
            earningsPaySlipName: earning.earningsPaySlipName,
          });
        }
      }
    };

    fetchEarningData();
  }, []);

  return (
    <DrawerPop
      open={createEarnings}
      close={(e) => {
        handleClose();
      }}
      contentWrapperStyle={{
        width: "590px",
      }}
      handleSubmit={() => {
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        formik.handleSubmit();
      }}
      header={[!updateId ? t("Create Earnings") : t("Update Earnings")]}
      footerBtn={[t("Cancel"), !updateId ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <div className="relative w-full h-full flex flex-col gap-6">
        <Dropdown
          title="Earning Type"
          placeholder="Choose Earning Type"
          options={earningsData}
          change={handleEarningTypeChange}
          value={formik.values.earningTypeId}
          error={isEditable ? formik.errors.earningTypeId : null}
          required={true}
          disabled={isUpdate}
          disableCondition={(option) => option.isBasic === 1}
        />
        <div className="flex gap-3">
          <FormInput
            title={t("Name")}
            placeholder={t("Name")}
            change={(e) => formik.setFieldValue("earningsName", e)}
            required={true}
            value={formik.values.earningsName}
            error={formik.errors.earningsName} // Show error if touched or form is submitted
            disabled={isUpdate} // Disable if it's in update mode
          />
          <FormInput
            title={t("Payslip Name")}
            placeholder={t("Payslip Name")}
            change={(e) => formik.setFieldValue("earningsPaySlipName", e)}
            required={true}
            value={formik.values.earningsPaySlipName}
            error={formik.errors.earningsPaySlipName} // Show error if touched or form is submitted
          />
        </div>

        {selectedEarning && renderEarningConfig(selectedEarning)}
      </div>
    </DrawerPop>
  );
}
