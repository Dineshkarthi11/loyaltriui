import React, { useEffect, useMemo, useState } from "react";
import DrawerPop from "../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import Heading2 from "../../common/Heading2";
import FlexCol from "../../common/FlexCol";
import Dropdown from "../../common/Dropdown";
import FormInput from "../../common/FormInput";
import DateSelect from "../../common/DateSelect";
import RadioButton from "../../common/RadioButton";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import { useFormik } from "formik";
import ToggleBtn from "../../common/ToggleBtn";
import { useNotification } from "../../../Context/Notifications/Notification";
import { fetchCompanyDetails } from "../../common/Functions/commonFunction";
import * as Yup from "yup";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function EditSalaryStructure({
  open = "",
  updateId,
  close = () => {},
  refresh = () => {},
  employee,
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(open);
  const [openEPF, setOpenEPF] = useState(false);
  const [openESI, setOpenESI] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [fromYear, setFromYear] = useState();
  const [employeeInfo, setEmployeeInfo] = useState({});
  const [salaryGeneralDetails, setSalaryGeneralDetails] = useState({});
  const [earningsList, setEarningsList] = useState([]);
  const [deductionsList, setDeductionsList] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [statutoryComponents, setStatutoryComponents] = useState({
    EPF: false,
    ESI: false,
    PT: false,
    LWF: false,
  });
  const [initialStatutoryComponents, setInitialStatutoryComponents] = useState(
    {}
  );
  const [salaryData, setSalaryData] = useState(null);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyDetails, setCompanyDetails] = useState("");
  const { showNotification } = useNotification();
  const [functionRender, setFunctionRender] = useState(false);

  const [epfFormData, setEPFFormData] = useState({
    UAN: "",
    PANnumber: "",
    PFnumber: "",
    PFjoiningDate: "",
    EPSeligible: "0",
    HPSeligible: "0",
  });

  const [esiFormData, setESIFormData] = useState({
    ESInumber: "",
    ESIeligible: "0",
  });

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const formatNumber = (num) => {
    return num.toFixed(2);
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
  // console.log(companyDetails, "ccc");

  const validationSchema = Yup.object({
    effectivecycle: Yup.date().required("Effective cycle is required"),
  });

  const formik = useFormik({
    initialValues: {
      stafftype: "",
      template: "",
      currentctc: 0,
      yearlyamount: 0,
      revisedctc: 0,
      reviseperctange: 0,
      effectivecycle: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const earnings = earningsList.map((earning) => ({
          employeeSalaryDetailsId: earning.employeeSalaryDetailsId,
          value: earning.amount.toString(),
          amount: earning.amount.toString(),
        }));

        const deductions = deductionsList.map((deduction) => ({
          employeeSalaryDetailsId: deduction.employeeSalaryDetailsId,
          value: deduction.amount.toString(),
          amount: deduction.amount.toString(),
        }));

        const payload = {
          employeeId: employee,
          salaryTemplateEmployeeMappingId:
            salaryGeneralDetails.salaryTemplateId,
          modifiedBy: employeeId,
          earnings,
          deductions,
        };
        // console.log(payload, "Salary structure edited successfully");
        // Send the payload to the API
        const result = await Payrollaction(
          PAYROLLAPI.EDIT_SALARY_FOR_PARTICULAR_EMPLOYEE_BY_ID,
          payload
        );

        if (result.status === 200) {
          openNotification("success", "Success", result.message);
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
            setFunctionRender(!functionRender);
          }, 1000);
        } else if (result.status === 500) {
          openNotification("error", "Info", result.message);
          setLoading(false);
        }
        // console.log(result);
      } catch (error) {
        console.error("Error updating salary structure", error);
        setLoading(false);
      }
    },
  });

  const getSalaryEditData = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_PARTICULAR_EMPLOYEE_ID_BASED_SALARY_REVISION_DATA,
        {
          companyId: companyId,
          employeeId: employee,
          salaryTemplateId: null,
        }
      );
      setSalaryData(result?.result);
      if (result.status === 200) {
        const {
          employeeInfo,
          salaryGeneralDetails,
          earningsList,
          deductionsList,
          empStatutoryStructure,
        } = result.result;
        setEmployeeInfo(employeeInfo);
        setSalaryGeneralDetails(salaryGeneralDetails);
        setEarningsList(earningsList);
        setDeductionsList(deductionsList);

        formik.setValues({
          stafftype: salaryGeneralDetails.staffType || "",
          template: salaryGeneralDetails.templateName || "",
          currentctc: parseFloat(salaryGeneralDetails.grossSalary) || 0,
          yearlyamount: parseFloat(salaryGeneralDetails.grossSalary) * 12 || 0,
          revisedctc: 0,
          reviseperctange: 0,
        });

        calculateTotals(earningsList, deductionsList);

        const statutoryStatus = {
          EPF: empStatutoryStructure.some(
            (item) => item.status === 1 && item.type === "EPF"
          ),
          ESI: empStatutoryStructure.some(
            (item) => item.status === 1 && item.type === "ESI"
          ),
          PT: empStatutoryStructure.some(
            (item) => item.status === 1 && item.type === "PT"
          ),
          LWF: empStatutoryStructure.some(
            (item) => item.status === 1 && item.type === "LWF"
          ),
        };

        setStatutoryComponents(statutoryStatus);
        setInitialStatutoryComponents(statutoryStatus); // Track initial state

        setEPFFormData({
          UAN: result.result.employeeStatutoryInfo.UAN,
          PANnumber: result.result.employeeStatutoryInfo.PANnumber,
          PFnumber: result.result.employeeStatutoryInfo.PFnumber,
          PFjoiningDate: result.result.employeeStatutoryInfo.PFjoiningDate,
          EPSeligible: result.result.employeeStatutoryInfo.EPSeligible,
          HPSeligible: result.result.employeeStatutoryInfo.HPSeligible,
        });

        setESIFormData({
          ESInumber: result.result.employeeStatutoryInfo.ESInumber,
          ESIeligible: result.result.employeeStatutoryInfo.ESIeligible,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const epfContribution = (0.12 * salaryGeneralDetails.grossSalary).toFixed(2);

  const calculateTotals = (earnings, deductions) => {
    const totalEarnings = earnings.reduce(
      (sum, earning) => sum + parseFloat(earning.amount),
      0
    );
    const totalDeductions = deductions.reduce(
      (sum, deduction) => sum + parseFloat(deduction.amount),
      0
    );

    setTotalEarnings(totalEarnings);
    setTotalDeductions(totalDeductions);

    const currentCtc = parseFloat(salaryGeneralDetails.grossSalary) || 0;

    const difference = totalEarnings - totalDeductions;

    if (difference > currentCtc) {
      setErrorMessage(
        "Total amount is greater than current CTC, must be equal to CTC."
      );
    } else if (difference < currentCtc) {
      setErrorMessage(
        "Total amount is less than current CTC, must be equal to CTC."
      );
    } else {
      setErrorMessage("");
    }
  };
  useEffect(() => {
    const currentCtc = parseFloat(salaryGeneralDetails.grossSalary) || 0;

    const difference = totalEarnings - totalDeductions;

    if (difference > currentCtc) {
      setErrorMessage(
        "Total amount is greater than current CTC, must be equal to CTC."
      );
    } else if (difference < currentCtc) {
      setErrorMessage(
        "Total amount is less than current CTC, must be equal to CTC."
      );
    } else {
      setErrorMessage("");
    }
  }, [formik.values.currentctc]);

  const handleEarningsChange = (index, value) => {
    const formattedValue = value.replace(/[^0-9.]/g, "");
    const decimalMatch = formattedValue.match(/^\d+(\.\d{0,2})?$/);
    if (!decimalMatch && formattedValue !== "") return; // Ignore invalid input

    const updatedEarnings = [...earningsList];
    updatedEarnings[index].amount =
      formattedValue !== "" ? parseFloat(formattedValue) : 0;
    setEarningsList(updatedEarnings);
    calculateTotals(updatedEarnings, deductionsList);
  };

  const handleDeductionsChange = (index, value) => {
    const formattedValue = value.replace(/[^0-9.]/g, "");
    const decimalMatch = formattedValue.match(/^\d+(\.\d{0,2})?$/);
    if (!decimalMatch && formattedValue !== "") return; // Ignore invalid input

    const updatedDeductions = [...deductionsList];
    updatedDeductions[index].amount =
      formattedValue !== "" ? parseFloat(formattedValue) : 0;
    setDeductionsList(updatedDeductions);
    calculateTotals(earningsList, updatedDeductions);
  };

  const handleBlur = (index, type) => {
    setTimeout(() => {
      if (type === "earnings") {
        const updatedEarnings = [...earningsList];
        if (!updatedEarnings[index].amount.toString().includes(".")) {
          updatedEarnings[index].amount = parseFloat(
            updatedEarnings[index].amount.toFixed(2)
          );
        }
        setEarningsList(updatedEarnings);
      } else if (type === "deductions") {
        const updatedDeductions = [...deductionsList];
        if (!updatedDeductions[index].amount.toString().includes(".")) {
          updatedDeductions[index].amount = parseFloat(
            updatedDeductions[index].amount.toFixed(2)
          );
        }
        setDeductionsList(updatedDeductions);
      }
    }, 2000); // 2 second delay before appending .00
  };

  useEffect(() => {
    getSalaryEditData();
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

  const handleCloseEPF = () => {
    setOpenEPF(false);
  };

  const handleCloseESI = () => {
    setOpenESI(false);
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
          handleCloseEPF();
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
          handleCloseESI();
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

  const saveStatutoryData = async () => {
    const payload = {
      employeeId: employee,
      companyId: companyId,
      createdBy: employeeId,
      EPFstatus:
        initialStatutoryComponents.EPF !== statutoryComponents.EPF
          ? statutoryComponents.EPF
            ? 1
            : 0
          : null,
      EPFstatutoryConfigurationId:
        initialStatutoryComponents.EPF !== statutoryComponents.EPF
          ? salaryData.empStatutoryStructure.find(
              (component) => component.type === "EPF"
            ).statutoryConfigurationId
          : null,
      ESIstatus:
        initialStatutoryComponents.ESI !== statutoryComponents.ESI
          ? statutoryComponents.ESI
            ? 1
            : 0
          : null,
      ESIstatutoryConfigurationId:
        initialStatutoryComponents.ESI !== statutoryComponents.ESI
          ? salaryData.empStatutoryStructure.find(
              (component) => component.type === "ESI"
            ).statutoryConfigurationId
          : null,
      PTstatus:
        initialStatutoryComponents.PT !== statutoryComponents.PT
          ? statutoryComponents.PT
            ? 1
            : 0
          : null,
      PTstatutoryConfigurationId:
        initialStatutoryComponents.PT !== statutoryComponents.PT
          ? salaryData.empStatutoryStructure.find(
              (component) => component.type === "PT"
            ).statutoryConfigurationId
          : null,
      LWFstatus:
        initialStatutoryComponents.LWF !== statutoryComponents.LWF
          ? statutoryComponents.LWF
            ? 1
            : 0
          : null,
      LWFstatutoryConfigurationId:
        initialStatutoryComponents.LWF !== statutoryComponents.LWF
          ? salaryData.empStatutoryStructure.find(
              (component) => component.type === "LWF"
            ).statutoryConfigurationId
          : null,
    };
    // console.log("Statutory data to be submitted:", payload);

    try {
      const response = await Payrollaction(
        PAYROLLAPI.SAVE_STATUTORY_TOGGLE_STATUS,
        payload
      );
      if (response.status === 200) {
        openNotification("success", "Success", response.message);
        setTimeout(() => {
          refresh();
          setFunctionRender(!functionRender);
        }, 1000);
      } else if (response.status === 500) {
        openNotification("error", "Info", response.message);
      }
      // console.log(response);
    } catch (error) {
      console.error("Error saving statutory data", error);
    }
  };

  const renderStatutoryComponents = () => {
    const empStatutoryStructure = salaryData?.empStatutoryStructure || [];
    const statutoryComponents = empStatutoryStructure.map((component) => {
      const isEnabled = component.status === 1;
      return (
        <div className="p-3" key={component.type}>
          <div className="flex items-center gap-1 justify-between">
            <div className="flex item-center gap-2">
              <ToggleBtn
                value={isEnabled}
                disable={false}
                change={(value) => {
                  setStatutoryComponents((prev) => ({
                    ...prev,
                    [component.type]: value,
                  }));
                }}
              />
              <p
                className="font-medium text-xs 2xl:text-sm cursor-pointer"
                onClick={() => {
                  if (component.type === "EPF") setOpenEPF(true);
                  if (component.type === "ESI") setOpenESI(true);
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
                    {epfContribution}
                  </p>
                </div>
                <div className="v-divider text-[#d9d2d2] !h-8" />
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-[10px] 2xl:text-sm">
                    Employee Contribution
                  </p>
                  <p className="font-medium text-[10px] text-grey 2xl:text-sm">
                    {epfContribution}
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
      src={employeeInfo.profilePicture || ""}
      name={`${employeeInfo.name || ""} `}
      close={(e) => {
        handleClose();
      }}
      header={[
        t("Edit salary Structure"),
        `${employeeInfo.name || "Employee"} | #${employeeInfo.code || ""} | ${
          employeeInfo.designation || ""
        } | ${employeeInfo.joiningDate || ""}`,
      ]}
      footerBtn={[t("Cancel"), t("Request for approval")]}
      footerBtnDisabled={loading}
      handleSubmit={(e) => {
        const ctc = totalEarnings - totalDeductions;
        if (
          formik.values.currentctc === ctc &&
          !errorMessage &&
          formik.values.effectivecycle
        ) {
          formik.handleSubmit();
          saveStatutoryData();
        } else {
          formik.setTouched({ effectivecycle: true });
        }
      }}
    >
      <FlexCol className={"max-w-[1076px] mx-auto"}>
        <div className="borderb rounded-[10px] bg-white dark:bg-dark">
          <div className="p-2">
            <Heading2
              title="Edit Salary Structure"
              description="Here you can edit salary structure by percentage or amount."
              className="bg-primaryalpha/10 rounded-md p-3"
            />
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-evenly">
            <FormInput
              title="Staff Type"
              placeholder="Staff Type"
              value={formik.values.stafftype}
              disabled={true}
            />
            <Dropdown
              title="Template"
              value={formik.values.template}
              disabled={true}
            />
            <DateSelect
              pickerType="month"
              dateFormat="YYYY-MM"
              title="Effective cycle"
              value={formik.values.effectivecycle}
              change={(e) => {
                formik.setFieldValue("effectivecycle", e);
                formik.setFieldTouched("effectivecycle", true);
                setFromYear(e);
                // console.log(e, "selected year");
              }}
              required={true}
              error={
                formik.errors.effectivecycle &&
                formik.touched.effectivecycle &&
                formik.errors.effectivecycle
              }
            />
          </div>
          <div className="divider-h" />
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 justify-evenly">
            <FormInput
              title="CTC"
              placeholder="CTC"
              value={formatNumber(formik.values.currentctc)}
              disabled={true}
            />
            <FormInput
              title="Yearly amount"
              placeholder="Yearly amount"
              value={formatNumber(formik.values.yearlyamount)}
              disabled={true}
            />
          </div>
        </div>

        <div className="borderb rounded-[10px] bg-white dark:bg-dark">
          <table className="min-w-full border-collapse table-fixed">
            <thead>
              <tr className="text-[10px] 2xl:text-xs text-grey font-normal h-11 2xl:h-12 border-b">
                <th className="px-4 text-left">Components</th>
                <th className="px-4">Calculations</th>
                <th className="px-4">CURRENT Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-[10px] 2xl:text-xs font-normal h-11 2xl:h-12">
                <td className="font-bold px-4">Earnings</td>
                <td></td>
                <td></td>
              </tr>
              {earningsList.length > 0 ? (
                earningsList.map((earning, index) => (
                  <tr
                    key={earning.employeeSalaryDetailsId}
                    className="text-xs 2xl:text-sm h-11 2xl:h-12"
                  >
                    <td className="px-4">{earning.earningsName}</td>
                    <td className="px-4">Fixed Amount</td>
                    <td className="px-4">
                      <FormInput
                        title=""
                        value={earning.amount}
                        className="w-28"
                        change={(e) => handleEarningsChange(index, e)}
                        onBlur={() => handleBlur(index, "earnings")}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-xs 2xl:text-sm h-11 2xl:h-12">
                  <td className="px-4" colSpan="3">
                    No data
                  </td>
                </tr>
              )}
              <tr className="text-[10px] 2xl:text-xs font-normal h-11 2xl:h-12">
                <td className="font-bold px-4">Deductions</td>
                <td></td>
                <td></td>
              </tr>
              {deductionsList.length > 0 ? (
                deductionsList.map((deduction, index) => (
                  <tr
                    key={deduction.employeeSalaryDetailsId}
                    className="text-xs 2xl:text-sm h-11 2xl:h-12"
                  >
                    <td className="px-4">{deduction.deductionName}</td>
                    <td className="px-4">Fixed Amount</td>
                    <td className="px-4">
                      <FormInput
                        title=""
                        value={deduction.amount}
                        className="w-28"
                        change={(e) => handleDeductionsChange(index, e)}
                        onBlur={() => handleBlur(index, "deductions")}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-xs 2xl:text-sm h-11 2xl:h-12">
                  <td className="px-4" colSpan="3">
                    No data
                  </td>
                </tr>
              )}

              <tr className="text-sm 2xl:text-md font-semibold h-11 2xl:h-12 border-t">
                <td></td>
                <td className="px-4 text-center">CTC</td>
                <td className="px-4 text-center">
                  {formatNumber(totalEarnings - totalDeductions)}
                </td>
              </tr>
              {errorMessage && (
                <tr className="text-xs 2xl:text-sm h-11 2xl:h-12">
                  <td className="px-4" colSpan="3" style={{ color: "red" }}>
                    {errorMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {companyDetails.isPFESIenabled === "1"
          ? renderStatutoryComponents()
          : null}
      </FlexCol>
      {openEPF && (
        <DrawerPop
          open={openEPF}
          contentWrapperStyle={{
            width: "540px",
          }}
          close={(e) => {
            handleCloseEPF();
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

      {openESI && (
        <DrawerPop
          open={openESI}
          contentWrapperStyle={{
            width: "540px",
          }}
          close={(e) => {
            handleCloseESI();
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
