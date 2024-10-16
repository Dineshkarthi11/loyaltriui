import React, { useEffect, useMemo, useState, useCallback } from "react";
import DrawerPop from "../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import Heading2 from "../../common/Heading2";
import FlexCol from "../../common/FlexCol";
import FormInput from "../../common/FormInput";
import ToggleBtn from "../../common/ToggleBtn";
import DateSelect from "../../common/DateSelect";
import RadioButton from "../../common/RadioButton";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { debounce } from "lodash";
import Dropdown from "../../common/Dropdown"; // Import the custom Dropdown component
import { useNotification } from "../../../Context/Notifications/Notification";
import { fetchCompanyDetails } from "../../common/Functions/commonFunction";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function ReviseSalaryStructure({
  open = "",
  updateId,
  close = () => {},
  refresh = () => {},
  employee,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [showEPFPopup, setShowEPFPopup] = useState(false);
  const [showESIPopup, setShowESIPopup] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [fromYear, setFromYear] = useState();
  const [salaryData, setSalaryData] = useState(null);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [templates, setTemplates] = useState([]);
  const [initialStatutoryData, setInitialStatutoryData] = useState({});
  const [statutoryData, setStatutoryData] = useState({});
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [functionRender, setFunctionRender] = useState(false);
  const [companyDetails, setCompanyDetails] = useState("");

  // State for EPF form data
  const [epfFormData, setEPFFormData] = useState({
    UAN: "",
    PANnumber: "",
    PFnumber: "",
    PFjoiningDate: "",
    EPSeligible: 0,
    HPSeligible: 0,
  });

  // State for ESI form data
  const [esiFormData, setESIFormData] = useState({
    ESInumber: "",
    ESIeligible: 0,
  });

  // State for new amounts
  const [newAmounts, setNewAmounts] = useState({
    earningsList: [],
    deductionsList: [],
  });

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const getCompanyIdFromLocalStorage = () => {
    return localStorageData.companyId;
  };

  useEffect(() => {
    const companyId = getCompanyIdFromLocalStorage();
    if (companyId) {
      fetchCompanyDetails(companyId).then((details) =>
        setCompanyDetails(details)
      );
    }

    const handleStorageChange = () => {
      const companyId = getCompanyIdFromLocalStorage();
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

  useEffect(() => {
    if (salaryData) {
      const statutoryInfo = salaryData.empStatutoryStructure.reduce(
        (acc, item) => {
          acc[item.type] = {
            status: item.status,
            statutoryConfigurationId: item.statutoryConfigurationId,
          };
          return acc;
        },
        {}
      );
      setStatutoryData(statutoryInfo);
      setInitialStatutoryData(statutoryInfo);

      // Initialize new amounts
      setNewAmounts({
        earningsList: salaryData.earningsList.map((earning) => ({
          ...earning,
          newAmount: calculateNewAmount(earning.amount, earning.revisedAmount),
        })),
        deductionsList: salaryData.deductionsList.map((deduction) => ({
          ...deduction,
          newAmount: calculateNewAmount(
            deduction.amount,
            deduction.revisedAmount
          ),
        })),
      });
    }
  }, [salaryData]);

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

  const formik = useFormik({
    initialValues: {
      stafftype: "",
      template: "",
      currentctc: 0,
      effectivecycle: null,
      revisedctc: "",
      reviseperctange: "",
      yearlyamount: "",
    },
    validationSchema: Yup.object().shape({
      revisedctc: Yup.number()
        .min(
          Yup.ref("currentctc"),
          "Revise CTC should be greater than Current CTC"
        )
        .required("Revise CTC is required"),
      effectivecycle: Yup.date().required("Effective cycle is required"),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    validate: (values) => {
      const errors = {};
      const totalNewEarnings = calculateNewTotal(newAmounts.earningsList);
      const totalNewDeductions = calculateNewTotal(newAmounts.deductionsList);
      const totalNewAmount = totalNewEarnings - totalNewDeductions;

      if (
        totalNewAmount.toFixed(2) !== parseFloat(values.revisedctc).toFixed(2)
      ) {
        errors.revisedAmount =
          "The values in New Amount must be equal to the entered Revised CTC.";
      }

      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true);
      const earnings = salaryData.earningsList.map((earning, index) => ({
        salaryComponetType: earning.salaryComponetType,
        componetId: earning.componentId,
        calculationTypeId: earning.calculationTypeId,
        value: newAmounts.earningsList[index].newAmount,
        amount: newAmounts.earningsList[index].newAmount,
        rules: earning.rules,
        isActive: earning.isActive,
        createdBy: employeeId,
      }));

      const deductions = salaryData.deductionsList.map((deduction, index) => ({
        salaryComponetType: deduction.salaryComponetType,
        componetId: deduction.componentId,
        calculationTypeId: deduction.calculationTypeId,
        value: newAmounts.deductionsList[index].newAmount,
        amount: newAmounts.deductionsList[index].newAmount,
        rules: deduction.rules,
        isActive: deduction.isActive,
        createdBy: employeeId,
      }));

      const submissionData = {
        salaryTemplateId: salaryData.salaryGeneralDetails.salaryTemplateId,
        employeeId: employee,
        createdBy: employeeId,
        earnings: earnings,
        deductions: deductions,
        grossSalary: parseFloat(values.revisedctc),
        incrimentPercentage: parseFloat(values.reviseperctange),
        withEffectfrom: values.effectivecycle,
        // withEffectfrom: fromYear,
      };

      try {
        // Trigger both API calls in parallel
        const [salaryResponse, statutoryResponse] = await Promise.all([
          Payrollaction(
            PAYROLLAPI.REVISE_SALARY_FOR_PARTICULAR_EMPLOYEE_BY_ID,
            submissionData
          ),
          handleSubmitStatutory(),
        ]);

        // Check if both responses are successful
        if (salaryResponse.status === 200 && statutoryResponse.status === 200) {
          openNotification(
            "success",
            "Successful",
            "Employee salary and statutory data is revised sucessfully"
          );
          handleClose(); // Close the drawer
          refresh(); // Refresh the page or data
          setLoading(false);
          setFunctionRender(!functionRender); // Update the render state
        } else {
          openNotification("error", "Error", "One or both submissions failed.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during form or statutory submission:", error);
        openNotification(
          "error",
          "Error",
          "An error occurred during submission."
        );
        setLoading(false);
      }
    },
  });

  const getSalaryReviseData = async (salaryTemplateId = null) => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_PARTICULAR_EMPLOYEE_ID_BASED_SALARY_REVISION_DATA,
        {
          companyId: companyId,
          employeeId: employee,
          salaryTemplateId: salaryTemplateId,
        }
      );
      setSalaryData(result?.result);
      formik.setValues({
        stafftype: result?.result.salaryGeneralDetails.staffType || "",
        template: result?.result.salaryGeneralDetails.templateName || "",
        currentctc:
          parseFloat(result?.result.salaryGeneralDetails.grossSalary) || 0,
        revisedctc: "0",
        reviseperctange: "0",
        yearlyamount: "0",
        effectivecycle:
          result?.result.salaryGeneralDetails.witheffectfrom || "",
      });
      // setFromYear(result?.result.salaryGeneralDetails.witheffectfrom || "");
      // Populate EPF and ESI form data
      setEPFFormData({
        UAN: result?.result.employeeStatutoryInfo.UAN || "",
        PANnumber: result?.result.employeeStatutoryInfo.PANnumber || "",
        PFnumber: result?.result.employeeStatutoryInfo.PFnumber || "",
        PFjoiningDate: result?.result.employeeStatutoryInfo.PFjoiningDate || "",
        EPSeligible: result?.result.employeeStatutoryInfo.EPSeligible || 0,
        HPSeligible: result?.result.employeeStatutoryInfo.HPSeligible || 0,
      });
      setESIFormData({
        ESInumber: result?.result.employeeStatutoryInfo.ESInumber || "",
        ESIeligible: result?.result.employeeStatutoryInfo.ESIeligible || 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getSalaryTemplateList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_Salary_Template_Builder,
        {
          companyId: companyId,
        }
      );
      setTemplates(result?.result || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getSalaryReviseData();
    getSalaryTemplateList();
  }, []);

  const calculatePercentage = (revisedCtc, currentCtc) => {
    return ((revisedCtc - currentCtc) / currentCtc) * 100;
  };

  const calculateComponentRevisedAmount = (currentAmount, percentage) => {
    return (percentage / 100) * currentAmount;
  };

  const calculateBasicPayRevisedAmount = (
    revisedCtc,
    currentCtc,
    earningsList,
    deductionsList
  ) => {
    const revisedEarnings = earningsList
      .filter((item) => item.earningsName !== "Basic Pay")
      .reduce((sum, item) => sum + parseFloat(item.revisedAmount || 0), 0);
    const revisedDeductions = deductionsList.reduce(
      (sum, item) => sum + parseFloat(item.revisedAmount || 0),
      0
    );
    const basicPayRevised =
      revisedCtc - currentCtc - (revisedEarnings - revisedDeductions);
    return basicPayRevised;
  };

  const currentCtc = parseFloat(formik.values.currentctc) || 0;

  const debounceUpdate = useCallback(
    debounce((values) => {
      const revisedCtc = parseFloat(values.revisedctc) || 0;

      if (revisedCtc || values.revisedctc === "") {
        const calculatedPercentage = calculatePercentage(
          revisedCtc,
          currentCtc
        );
        formik.setFieldValue(
          "reviseperctange",
          calculatedPercentage.toFixed(2),
          false
        );

        // Ensure salaryData is not null
        if (salaryData) {
          // Update components revised amounts
          const updatedSalaryData = {
            ...salaryData,
            earningsList: salaryData.earningsList.map((item) => {
              if (item.earningsName !== "Basic Pay") {
                return {
                  ...item,
                  revisedAmount: calculateComponentRevisedAmount(
                    item.amount,
                    calculatedPercentage
                  ).toFixed(2),
                };
              }
              return item;
            }),
            deductionsList: salaryData.deductionsList.map((item) => ({
              ...item,
              revisedAmount: calculateComponentRevisedAmount(
                item.amount,
                calculatedPercentage
              ).toFixed(2),
            })),
          };

          // Update Basic Pay revised amount
          updatedSalaryData.earningsList = updatedSalaryData.earningsList.map(
            (item) => {
              if (item.earningsName === "Basic Pay") {
                return {
                  ...item,
                  revisedAmount: calculateBasicPayRevisedAmount(
                    revisedCtc,
                    currentCtc,
                    updatedSalaryData.earningsList,
                    updatedSalaryData.deductionsList
                  ).toFixed(2),
                };
              }
              return item;
            }
          );

          setSalaryData(updatedSalaryData);
        }

        const yearlyAmount = revisedCtc * 12;
        formik.setFieldValue("yearlyamount", yearlyAmount.toFixed(2), false);
      } else {
        formik.setFieldValue("revisedctc", "0", false);
        formik.setFieldValue("reviseperctange", "0", false);
        formik.setFieldValue("yearlyamount", "0", false);
      }
    }, 300),
    [currentCtc, salaryData]
  );

  useEffect(() => {
    debounceUpdate(formik.values);
  }, [formik.values.revisedctc]);

  const calculateNewAmount = (currentAmount, revisedAmount) => {
    return (parseFloat(currentAmount) + parseFloat(revisedAmount)).toFixed(2);
  };

  const calculateTotal = (list, field) => {
    return list
      .reduce((sum, item) => sum + parseFloat(item[field] || 0), 0)
      .toFixed(2);
  };

  const calculateNewTotal = (list) => {
    return list
      .reduce((sum, item) => sum + parseFloat(item.newAmount || 0), 0)
      .toFixed(2);
  };

  const handleSubmitEPF = async () => {
    setLoading(true);
    const submissionData = {
      // id: salaryData.employeeStatutoryInfo.statutoryEmployeeInfoId,
      companyId: companyId,
      employeeId: employee,
      UAN: epfFormData.UAN,
      PANnumber: epfFormData.PANnumber,
      adharNumber: salaryData.employeeStatutoryInfo.adharNumber,
      adharEnrollNumber: salaryData.employeeStatutoryInfo.adharEnrollNumber,
      PFnumber: epfFormData.PFnumber,
      PFjoiningDate: epfFormData.PFjoiningDate,
      PFeligible: salaryData.employeeStatutoryInfo.PFeligible,
      ESIeligible: salaryData.employeeStatutoryInfo.ESIeligible,
      ESInumber: salaryData.employeeStatutoryInfo.ESInumber,
      PTeligible: salaryData.employeeStatutoryInfo.PTeligible,
      LWFeligible: salaryData.employeeStatutoryInfo.LWFeligible,
      EPSeligible: epfFormData.EPSeligible,
      EPSjoiningDate: salaryData.employeeStatutoryInfo.EPSjoiningDate,
      EPSexitDate: salaryData.employeeStatutoryInfo.EPSexitDate,
      HPSeligible: epfFormData.HPSeligible,
      isActive: 1,
      createdBy: employeeId,
      restrictionValue: null,
    };
    // console.log("EPF Submission successful:", submissionData);
    try {
      const response = await Payrollaction(
        PAYROLLAPI.SAVE_EMPLOYEE_STATUTORY_INFO,
        submissionData
      );
      // console.log("EPF Submission successfulll:", response);
      if (response.status === 200) {
        openNotification("success", "Success", response.message);
        setTimeout(() => {
          setShowEPFPopup(false);
          refresh();
          setLoading(false);
          setFunctionRender(!functionRender);
        }, 1000);
      } else if (response.status === 500) {
        openNotification("error", "Info", response.message);
        setLoading(false);
      }
      // console.log(response);
    } catch (error) {
      console.error("Error during EPF submission:", error);
      setLoading(false);
    }
  };

  const handleSubmitESI = async () => {
    setLoading(true);
    const submissionData = {
      // id: salaryData.employeeStatutoryInfo.statutoryEmployeeInfoId,
      companyId: companyId,
      employeeId: employee,
      UAN: salaryData.employeeStatutoryInfo.UAN,
      PANnumber: salaryData.employeeStatutoryInfo.PANnumber,
      adharNumber: salaryData.employeeStatutoryInfo.adharNumber,
      adharEnrollNumber: salaryData.employeeStatutoryInfo.adharEnrollNumber,
      PFnumber: salaryData.employeeStatutoryInfo.PFnumber,
      PFjoiningDate: salaryData.employeeStatutoryInfo.PFjoiningDate,
      PFeligible: salaryData.employeeStatutoryInfo.PFeligible,
      ESIeligible: esiFormData.ESIeligible,
      ESInumber: esiFormData.ESInumber,
      PTeligible: salaryData.employeeStatutoryInfo.PTeligible,
      LWFeligible: salaryData.employeeStatutoryInfo.LWFeligible,
      EPSeligible: salaryData.employeeStatutoryInfo.EPSeligible,
      EPSjoiningDate: salaryData.employeeStatutoryInfo.EPSjoiningDate,
      EPSexitDate: salaryData.employeeStatutoryInfo.EPSexitDate,
      HPSeligible: salaryData.employeeStatutoryInfo.HPSeligible,
      isActive: 1,
      createdBy: employeeId,
      restrictionValue: null,
    };
    // console.log("ESI Submission successful:", submissionData);
    try {
      const response = await Payrollaction(
        PAYROLLAPI.SAVE_EMPLOYEE_STATUTORY_INFO,
        submissionData
      );
      // console.log("ESI Submission successful:", response);
      if (response.status === 200) {
        openNotification("success", "Success", response.message);
        setTimeout(() => {
          setShowESIPopup(false);
          refresh();
          setLoading(false);
          setFunctionRender(!functionRender);
        }, 1000);
      } else if (response.status === 500) {
        openNotification("error", "Info", response.message);
        setLoading(false);
      }
      // console.log(response);
    } catch (error) {
      console.error("Error during ESI submission:", error);
      setLoading(false);
    }
  };

  const earningsList = salaryData?.earningsList || [];
  const deductionsList = salaryData?.deductionsList || [];
  const totalCurrentEarnings = calculateTotal(earningsList, "amount");
  const totalRevisedEarnings = calculateTotal(earningsList, "revisedAmount");
  const totalNewEarnings = calculateNewTotal(newAmounts.earningsList);
  const totalCurrentDeductions = calculateTotal(deductionsList, "amount");
  const totalRevisedDeductions = calculateTotal(
    deductionsList,
    "revisedAmount"
  );
  const totalNewDeductions = calculateNewTotal(newAmounts.deductionsList);
  const totalNewAmount = (totalNewEarnings - totalNewDeductions).toFixed(2);

  const revisedCtc = parseFloat(formik.values.revisedctc) || 0;
  const epfContribution = (0.12 * revisedCtc).toFixed(2);

  const employeeStatutoryInfo = salaryData?.employeeStatutoryInfo || {};

  const employeeInfo = salaryData?.employeeInfo || {};

  const handleNewAmountChange = (type, index, value) => {
    const valueMatch = value.match(/^\d{0,10}(\.\d{0,2})?$/);
    if (valueMatch || value === "") {
      setNewAmounts((prev) => {
        const updatedList = [...prev[type]];
        updatedList[index].newAmount = value;
        return {
          ...prev,
          [type]: updatedList,
        };
      });

      // Validate form after changing new amounts
      formik.validateForm();
    }
  };

  const renderStatutoryComponents = () => {
    const empStatutoryStructure = salaryData?.empStatutoryStructure || [];
    const statutoryComponents = empStatutoryStructure.map((component) => {
      const isEnabled = statutoryData[component.type]?.status === 1;
      return (
        <div className="p-3" key={component.type}>
          <div className="flex items-center gap-1 justify-between">
            <div className="flex item-center gap-2">
              <ToggleBtn
                value={isEnabled}
                disable={false}
                change={(value) => {
                  setStatutoryData((prev) => ({
                    ...prev,
                    [component.type]: {
                      ...prev[component.type],
                      status: value,
                    },
                  }));
                }}
              />
              <p
                className="font-medium text-xs 2xl:text-sm cursor-pointer"
                onClick={() => {
                  if (component.type === "EPF") setShowEPFPopup(true);
                  if (component.type === "ESI") setShowESIPopup(true);
                }}
              >
                Enable {component.name}
              </p>
            </div>
            {component.type === "EPF" && (
              <div className="flex item-center bg-[#F9F9F9] dark:bg-[#303030] w-fit py-1.5 px-4 rounded-md gap-5">
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-[10px] 2xl:text-sm">
                    Employer Contribution
                  </p>
                  <p className="font-medium text-[10px] text-grey 2xl:text-sm">
                    {epfContribution} of Actual PF wage
                  </p>
                </div>
                <div className="v-divider text-[#d9d2d2] !h-8" />
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-[10px] 2xl:text-sm">
                    Employee Contribution
                  </p>
                  <p className="font-medium text-[10px] text-grey 2xl:text-sm">
                    {epfContribution} of Actual PF wage
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    });
    return (
      <div className="borderb rounded-[10px] bg-white dark:bg-dark">
        <div className="p-2">
          <Heading2
            title="Statutory Components"
            description="Here you can edit employee statutory components."
            className="bg-primaryalpha/10 dark:-primaryalpha/20 rounded-md p-3"
          />
        </div>
        <FlexCol gap={12}>{statutoryComponents}</FlexCol>
      </div>
    );
  };

  const handleSubmitStatutory = async () => {
    const dataToSubmit = {
      employeeId: employee,
      companyId: companyId,
      createdBy: employeeId,
    };

    const keys = Object.keys(statutoryData);
    keys.forEach((key) => {
      const initialStatus = initialStatutoryData[key]?.status;
      const currentStatus = statutoryData[key]?.status;
      const configurationId = statutoryData[key]?.statutoryConfigurationId;

      if (initialStatus !== currentStatus) {
        dataToSubmit[`${key}status`] = currentStatus;
        dataToSubmit[`${key}statutoryConfigurationId`] = configurationId;
      } else {
        dataToSubmit[`${key}status`] = null;
        dataToSubmit[`${key}statutoryConfigurationId`] = null;
      }
    });

    //  console.log("Statutory Submission Data:", dataToSubmit);

    try {
      const response = await Payrollaction(
        PAYROLLAPI.SAVE_STATUTORY_TOGGLE_STATUS,
        dataToSubmit
      );
      //  console.log("Statutory Submission successful:", response);

      return response; // Return the response to handle it later
    } catch (error) {
      console.error("Error during statutory submission:", error);
      throw error; // Rethrow the error to handle it in the parent function
    }
  };

  const handleBlur = () => {
    const revisedCtc = formik.values.revisedctc;
    if (revisedCtc && !revisedCtc.includes(".")) {
      formik.setFieldValue("revisedctc", `${revisedCtc}.00`);
    }
  };

  return (
    <DrawerPop
      open={show}
      background="#F8FAFC"
      contentWrapperStyle={{
        position: "absolute",
        height: "100%",
        top: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        borderRadius: 0,
        borderTopLeftRadius: "0px !important",
        borderBottomLeftRadius: 0,
      }}
      avatar={true}
      src={salaryData?.employeeInfo.profilePicture || ""}
      name={`${salaryData?.employeeInfo.name || ""}`}
      close={(e) => {
        handleClose();
      }}
      header={[
        t("Revise salary Structure"),
        `${salaryData?.employeeInfo.name || ""} | #${
          salaryData?.employeeInfo.code || ""
        }| ${salaryData?.employeeInfo.designation || ""} | ${
          salaryData?.employeeInfo.joiningDate || ""
        }`,
      ]}
      footerBtn={[t("Cancel"), t("Request for approval")]}
      footerBtnDisabled={loading}
      handleSubmit={(e) => {
        formik.handleSubmit();
        handleSubmitStatutory();
      }}
    >
      <FlexCol className={"max-w-[1076px] mx-auto"}>
        <div className="borderb rounded-[10px] bg-white dark:bg-dark">
          <div className="p-2">
            <Heading2
              title="Revise Salary Structure"
              description="Here you can edit salary structure by percentage or amount."
              className="bg-primaryalpha/10 dark:-primaryalpha/20 rounded-md p-3"
            />
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-evenly">
            <FormInput
              title="Staff Type"
              placeholder="Staff Type"
              change={(e) => {
                formik.setFieldValue("stafftype", e);
              }}
              value={formik.values.stafftype}
              error={formik.errors.stafftype}
              disabled
            />
            <Dropdown
              title="Template Name"
              placeholder="Select template"
              value={formik.values.template}
              change={(e) => {
                const selectedTemplate = templates.find(
                  (template) => template.templateName === e
                );
                formik.setFieldValue(
                  "template",
                  selectedTemplate?.templateName || ""
                );
                getSalaryReviseData(selectedTemplate?.salaryTemplateId || null);
              }}
              options={templates.map((template) => ({
                label: template.templateName,
                value: template.templateName,
              }))}
              error={formik.errors.template}
            />
            <DateSelect
              pickerType="month"
              dateFormat="YYYY-MM"
              title="Effective cycle"
              value={formik.values.effectivecycle}
              change={(e) => {
                // setFromYear(e);
                formik.setFieldValue("effectivecycle", e);
                // console.log(e, "selected year");
              }}
              error={formik.errors.effectivecycle}
              required={true}
            />
          </div>
          <div className="divider-h" />
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 justify-evenly">
            <FormInput
              title="CTC"
              placeholder="CTC"
              change={(e) => {
                formik.setFieldValue("currentctc", e);
              }}
              value={formik.values.currentctc.toFixed(2)}
              error={formik.errors.currentctc}
              disabled
            />
            <FormInput
              title="Revise CTC"
              placeholder="Revise CTC"
              change={(e) => {
                if (/^\d{0,10}(\.\d{0,2})?$/.test(e) || e === "") {
                  formik.setFieldValue("revisedctc", e);
                }
              }}
              value={
                formik.values.revisedctc === "0" ? "" : formik.values.revisedctc
              }
              error={formik.errors.revisedctc}
              type="text"
              handleBlur={handleBlur} // Apply handleBlur
              required={true}
            />
            <FormInput
              title="Revise by percentage"
              placeholder="Percentage"
              value={
                formik.values.reviseperctange === "0"
                  ? ""
                  : formik.values.reviseperctange
              }
              error={formik.errors.reviseperctange}
              type="text"
              disabled
            />
            <FormInput
              title="Yearly Amount"
              placeholder="Yearly Amount"
              value={formik.values.yearlyamount}
              error={formik.errors.yearlyamount}
              disabled
            />
          </div>
        </div>

        <div className="borderb rounded-[10px] bg-white dark:bg-dark">
          <div className="p-2">
            <Heading2
              title="Components"
              description=""
              className="bg-primaryalpha/10 dark:-primaryalpha/20 rounded-md p-3"
            />
          </div>
          <table className="min-w-full border-collapse table-fixed">
            <thead>
              <tr className="text-[10px] 2xl:text-xs text-grey h-11 2xl:h-12 border-b">
                <th className="font-normal px-4 text-left">Components</th>
                <th className="font-normal px-4">Calculations</th>
                <th className="font-normal px-4">CURRENT Amount</th>
                {/* <th className="font-normal px-4">REVISED Amount</th> */}
                <th className="font-normal px-4">New Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-semibold px-4">Earnings</tr>
              {newAmounts.earningsList.map((earning, index) => (
                <tr
                  key={earning.employeeSalaryDetailsId}
                  className="text-[10px] 2xl:text-xs font-normal h-11 2xl:h-12"
                >
                  <td className="font-semibold px-4">{earning.earningsName}</td>
                  <td className="px-4 pb-2 text-center">Fixed Amount</td>
                  <td className="px-4 pb-2">
                    <FormInput
                      title=""
                      value={earning.amount}
                      className="w-28"
                      disabled
                    />
                  </td>
                  {/* <td className="px-4 pb-2">
                    <FormInput
                      title=""
                      value={earning.revisedAmount || ""}
                      className="w-28"
                      change={(e) => {
                        const updatedEarningsList = [
                          ...salaryData.earningsList,
                        ];
                        updatedEarningsList[index].revisedAmount = e;
                        setSalaryData((prevData) => ({
                          ...prevData,
                          earningsList: updatedEarningsList,
                        }));
                        formik.validateForm();
                      }}
                    />
                  </td> */}
                  <td className="px-4 pb-2">
                    <FormInput
                      title=""
                      value={
                        isNaN(earning.newAmount) ? "0.00" : earning.newAmount
                      }
                      className="w-28"
                      change={(e) =>
                        handleNewAmountChange("earningsList", index, e)
                      }
                    />
                  </td>
                </tr>
              ))}
              <tr className="font-semibold px-4">Deductions</tr>
              {newAmounts.deductionsList.map((deduction, index) => (
                <tr
                  key={deduction.employeeSalaryDetailsId}
                  className="text-[10px] 2xl:text-xs font-normal h-11 2xl:h-12"
                >
                  <td className="font-semibold px-4">
                    {deduction.deductionName}
                  </td>
                  <td className="px-4 pb-2 text-center">Fixed Amount</td>
                  <td className="px-4 pb-2">
                    <FormInput
                      title=""
                      value={deduction.amount}
                      className="w-28"
                      disabled
                    />
                  </td>
                  {/* <td className="px-4 pb-2">
                    <FormInput
                      title=""
                      value={deduction.revisedAmount || ""}
                      className="w-28"
                      change={(e) => {
                        const updatedDeductionsList = [
                          ...salaryData.deductionsList,
                        ];
                        updatedDeductionsList[index].revisedAmount = e;
                        setSalaryData((prevData) => ({
                          ...prevData,
                          deductionsList: updatedDeductionsList,
                        }));
                        formik.validateForm();
                      }}
                    />
                  </td> */}
                  <td className="px-4 pb-2">
                    <FormInput
                      title=""
                      value={
                        isNaN(deduction.newAmount)
                          ? "0.00"
                          : deduction.newAmount
                      }
                      className="w-28"
                      change={(e) =>
                        handleNewAmountChange("deductionsList", index, e)
                      }
                    />
                  </td>
                </tr>
              ))}
              <tr className="text-sm 2xl:text-md font-semibold h-11 2xl:h-12 border-t">
                <td></td>
                <td className="px-4 text-center">CTC</td>
                <td className="px-4 text-center">
                  {(totalCurrentEarnings - totalCurrentDeductions).toFixed(2)}
                </td>
                {/* <td className="px-4 text-center">
                  {(totalRevisedEarnings - totalRevisedDeductions).toFixed(2)}
                </td> */}
                <td className="px-4 text-center">
                  {isNaN(totalNewAmount) ? "0.00" : totalNewAmount}
                </td>
              </tr>
            </tbody>
          </table>
          {formik.errors.revisedAmount && (
            <div className="text-red-500 text-sm p-4">
              {formik.errors.revisedAmount}
            </div>
          )}
        </div>
        {companyDetails.isPFESIenabled === "1"
          ? renderStatutoryComponents()
          : null}
      </FlexCol>

      {showEPFPopup && (
        <DrawerPop
          open={showEPFPopup}
          contentWrapperStyle={{
            width: "540px",
          }}
          close={(e) => {
            setShowEPFPopup(false);
          }}
          header={[
            t("Enable EPF"),
            t("Manage your companies here, and some lorem ipsum"),
          ]}
          footerBtn={[t("Cancel"), t("Enable EPF")]}
          footerBtnDisabled={loading}
          handleSubmit={(e) => {
            handleSubmitEPF();
          }}
        >
          <FlexCol>
            <DateSelect
              title="Date of joining"
              placeholder="Choose date"
              value={employeeInfo.joiningDate}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <FormInput
                title="UAN"
                placeholder="UAN"
                required={true}
                value={epfFormData.UAN}
                change={(e) => setEPFFormData({ ...epfFormData, UAN: e })}
              />
              <FormInput
                title="PAN"
                placeholder="PAN"
                required={true}
                value={epfFormData.PANnumber}
                change={(e) => setEPFFormData({ ...epfFormData, PANnumber: e })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <FormInput
                title="PF Number"
                placeholder="PF Number"
                required={true}
                value={epfFormData.PFnumber}
                change={(e) => setEPFFormData({ ...epfFormData, PFnumber: e })}
              />
              <DateSelect
                title="PF Joining Date"
                placeholder="Choose date"
                required={true}
                value={epfFormData.PFjoiningDate}
                change={(date) =>
                  setEPFFormData({ ...epfFormData, PFjoiningDate: date })
                }
              />
            </div>
            <RadioButton
              title="EPS Eligible"
              required={true}
              options={[
                {
                  label: "Yes",
                  value: 1,
                },
                {
                  label: "No",
                  value: 0,
                },
              ]}
              value={parseInt(epfFormData.EPSeligible)}
              change={(value) =>
                setEPFFormData({ ...epfFormData, EPSeligible: value })
              }
            />
            <RadioButton
              title="Eligible For Higher Pension Scheme"
              required={true}
              options={[
                {
                  label: "Yes",
                  value: 1,
                },
                {
                  label: "No",
                  value: 0,
                },
              ]}
              value={parseInt(epfFormData.HPSeligible)}
              change={(value) =>
                setEPFFormData({ ...epfFormData, HPSeligible: value })
              }
            />
          </FlexCol>
        </DrawerPop>
      )}

      {showESIPopup && (
        <DrawerPop
          open={showESIPopup}
          contentWrapperStyle={{
            width: "540px",
          }}
          close={(e) => {
            setShowESIPopup(false);
          }}
          header={[
            t("Enable ESI"),
            t("Manage your companies here, and some lorem ipsum"),
          ]}
          footerBtn={[t("Cancel"), t("Enable ESI")]}
          footerBtnDisabled={loading}
          handleSubmit={(e) => {
            handleSubmitESI();
          }}
        >
          <FlexCol>
            <FormInput
              title="ESI Number"
              placeholder="ESI"
              required={true}
              value={esiFormData.ESInumber}
              change={(e) => setESIFormData({ ...esiFormData, ESInumber: e })}
            />
            <RadioButton
              title="ESI Eligible"
              required={true}
              options={[
                {
                  label: "Yes",
                  value: 1,
                },
                {
                  label: "No",
                  value: 0,
                },
              ]}
              value={parseInt(esiFormData.ESIeligible)}
              change={(value) =>
                setESIFormData({ ...esiFormData, ESIeligible: value })
              }
            />
          </FlexCol>
        </DrawerPop>
      )}
    </DrawerPop>
  );
}
