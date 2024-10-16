import DrawerPop from "../../common/DrawerPop";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";

import * as yup from "yup";
import FormInput from "../../common/FormInput";
import DateSelect from "../../common/DateSelect";
import TextArea from "../../common/TextArea";
import FlexCol from "../../common/FlexCol";
import Dropdown from "../../common/Dropdown";
import CheckBoxInput from "../../common/CheckBoxInput";
import ToggleBtn from "../../common/ToggleBtn";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import dayjs from "dayjs";
import {
  fetchCompanyDetails,
  getCompanyList,
  getEmployeeList,
} from "../../common/Functions/commonFunction";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function AddRecurringAdjustment({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh = () => {},
}) {
  const { t } = useTranslation();

  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addAssets, setAddAssets] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [functionRender, setFunctionRender] = useState(false);
  const [organisationId, setOrganisationId] = useState(
    localStorageData.organisationId
  );
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeList, setEmployeeList] = useState([]);
  const [additionsList, setAdditionsList] = useState([]);
  const [deductionsList, setDeductionsList] = useState([]);
  const [selectedAdjustmentType, setSelectedAdjustmentType] = useState(null);
  const [monthAndyearFrom, setMonthAndYearFrom] = useState(null);
  const [monthAndyearTo, setMonthAndYearTo] = useState(null);
  const [distributionDetails, setDistributionDetails] = useState([]);
  const [manualDistribution, setManualDistribution] = useState({});
  const [remainingAmount, setRemainingAmount] = useState(0);

  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [distributeTotalAmount, setDistributeTotalAmount] = useState(false);
  const { showNotification } = useNotification();
  const [joiningDate, setJoiningDate] = useState();
  const [todate, setTodate] = useState();
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
    setLoggedEmployeeId(localStorageData.employeeId);
  }, []);

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  function getSplitTypeText(splitType) {
    if (splitType === 0) {
      return "normal";
    } else if (splitType === 1) {
      return "custom";
    } else if (splitType === 2) {
      return "recurring";
    }
  }

  // Function to format dates in the expected API format
  function formatDateToMonthYear(date) {
    // Convert the date to the "Month YYYY" format
    return dayjs(date, "YYYY-MM").format("MMMM YYYY");
  }

  const formik = useFormik({
    initialValues: {
      amount: "",
      splitType: 0,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      employeeId: yup.string().required("Employee Name is required"),
      fieldNameForAdjustmentTypeId: yup
        .string()
        .required("Adjustment Type is required"),
      additionName: yup.string().required("Salary Components is required"),
      employeename: yup.string().required("Employee name is required"),
      amount: yup
        .number()
        .required("Amount is required")
        .min(100, "Amount must be at least three digits"),
      fromMonthYear: yup.string().required("Salary Period From is required"),
      toMonthYear: yup.string().required("Salary Period To is required"),
      reference: yup.string().required("Reference  is required"),
      remarks: yup.string().required("Remarks is required"),
    }),
    onSubmit: async (e) => {
      if (remainingAmount !== 0) {
        openNotification(
          "error",
          "Info ",
          "The distributed amount must remain zero to submit."
        );
        return; // Exit early if remaining amount is not zero
      }
      setLoading(true);
      const formattedFromMonthYear = formatDateToMonthYear(monthAndyearFrom);
      const formattedToMonthYear = formatDateToMonthYear(monthAndyearTo);

      try {
        if (updateId) {
          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_EMPLOYEE_RECURRING_ADJUSTMENT_RECORD_BY_ID,
            {
              id: updateId,
              companyId: companyId,
              financialYearId: 1,
              employeeId: formik.values.employeeId,
              componentType: formik.values.fieldNameForAdjustmentTypeId,
              componentId:
                formik.values.additionId || formik.values.deductionId,
              fromMonthYear: formattedFromMonthYear,
              toMonthYear: formattedToMonthYear,
              totalAmount: formik.values.amount,
              splitType: getSplitTypeText(e.splitType),
              monthlySplit: formatDataForApi(),
              remarks: formik.values.remarks,
              isActive: 1,
              modeifiedBy: loggedEmployeeId,
              reference: formik.values.reference,
            }
          );
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              setFunctionRender(!functionRender);
              setLoading(false);
              refresh();
            }, 1000);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await Payrollaction(
            PAYROLLAPI.CREATE_EMPLOYEE_RECURRING_ADJUSTMENT_RECORD,
            {
              companyId: companyId,
              financialYearId: 1,
              employeeId: e.employeeId,
              componentType: e.fieldNameForAdjustmentTypeId,
              componentId: e.additionId || e.deductionId,
              fromMonthYear: formattedFromMonthYear,
              toMonthYear: formattedToMonthYear,
              totalAmount: e.amount,
              splitType: getSplitTypeText(e.splitType),
              monthlySplit: formatDataForApi(),
              remarks: e.remarks,
              isActive: 1,
              createdBy: loggedEmployeeId,
              reference: e.reference,
            }
          );
          console.log(result);
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            formik.resetForm();
            setTimeout(() => {
              handleClose();
              refresh();
              setLoading(false);
            }, 1000);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
          console.log(result);
        }
      } catch (error) {
        console.log(error);
        openNotification("error", "Failed ", error);
        setLoading(false);
      }
    },
  });

  const getCompany = async () => {
    const result = await getCompanyList(organisationId);
    // setCompanyList(result.data.tbl_company)
    setCompanyList(
      result?.map((each) => ({
        value: each.companyId,
        label: each.company,
      }))
    );

    // console.log(result);
  };

  useEffect(() => {
    // getRecords();
    getCompany();
  }, []);

  const handleClose = () => {
    close(false);

    setAddAssets(false);
    formik.setFieldValue("name", "");
    formik.setFieldValue("description", "");
    formik.setFieldValue("companyId", "");
    // formik.setFieldValue("date", "");
  };

  const getEmployess = async () => {
    const result = await getEmployeeList();
    if (result?.length > 0) {
      const options = result
        .filter(
          (employee) =>
            employee.employeeId !== undefined &&
            employee.firstName !== undefined &&
            employee.lastName !== undefined
        ) // Filtering only valid employee objects

        .map(({ employeeId, firstName, lastName, joiningDate }) => ({
          id: employeeId,

          label: `${firstName} ${lastName}`,

          value: employeeId,

          employeeId: employeeId,
          joiningDate: joiningDate,
        }));

      console.log(options, "daataaaa");

      setEmployeeList(options);
    } else {
      // Handle the case where result.result is not an array or is empty

      console.log("No employees found.");
    }
  };

  useEffect(() => {
    getEmployess();
  }, []);

  // Fetch the additions data
  const getAdditionsList = async () => {
    const result = await Payrollaction(PAYROLLAPI.GET_ALL_ADDITIONS_RECORDS, {
      companyId: companyId,
      isEditable: 1,
    });

    if (result?.result) {
      const options = result.result.map(({ additionId, additionName }) => ({
        id: additionId,
        label: additionName,
        value: additionName,
        employeeId: additionId,
      }));
      setAdditionsList(options);
    }
  };

  // Fetch the deductions data
  const getDeductionsList = async () => {
    const result = await Payrollaction(PAYROLLAPI.GET_ALL_DEDUCTIONS_RECORDS, {
      companyId: companyId,
      isEditable: 1,
    });

    if (result?.result) {
      const options = result.result.map(({ deductionId, deductionName }) => ({
        id: deductionId,
        label: deductionName,
        value: deductionName,
        employeeId: deductionId,
      }));
      setDeductionsList(options);
    }
  };

  // Handle the change in the "Adjustment Type" dropdown
  const handleAdjustmentTypeChange = (selectedOption) => {
    // Set the selected adjustment type value in the state
    setSelectedAdjustmentType(selectedOption);

    // Clear relevant Formik fields based on the adjustment type
    if (selectedOption === "Addition") {
      formik.setFieldValue("deductionName", "");
      formik.setFieldValue("deductionId", null);
    } else if (selectedOption === "Deduction") {
      formik.setFieldValue("additionName", "");
      formik.setFieldValue("additionId", null);
    }

    // Fetch the appropriate data based on the selected option
    if (selectedOption === "Addition") {
      getAdditionsList();
    } else if (selectedOption === "Deduction") {
      getDeductionsList();
    }

    // Find the selected option in the options array
    const selectedOptionData = [
      { id: 1, value: "Addition", label: "Addition" },
      { id: 2, value: "Deduction", label: "Deduction" },
    ].find((option) => option.value === selectedOption);

    // If the selected option is found, set the option ID in Formik
    if (selectedOptionData) {
      formik.setFieldValue(
        "fieldNameForAdjustmentTypeId",
        selectedOptionData.id
      );
      console.log("Selected option ID:", selectedOptionData.id);
    }
  };

  console.log("monthAndyearFrom:", monthAndyearFrom);
  console.log("monthAndyearTo:", monthAndyearTo);

  useEffect(() => {
    // Calculate distribution whenever amount or month/year changes
    if (monthAndyearFrom && monthAndyearTo && formik.values.amount) {
      calculateDistribution();
    }
  }, [monthAndyearFrom, monthAndyearTo, formik.values.amount]);

  const calculateDistribution = () => {
    // Calculate the number of months between the from and to month/year
    const from = dayjs(monthAndyearFrom, "YYYY-MM");
    const to = dayjs(monthAndyearTo, "YYYY-MM");
    const numMonths = to.diff(from, "month") + 1;

    // Calculate the equal distribution of the amount
    const totalAmount = parseFloat(formik.values.amount);
    const amountPerMonth = totalAmount / numMonths;

    // Generate the list of months and corresponding amounts
    const distribution = [];
    let totalDistributedAmount = 0;

    for (let i = 0; i < numMonths; i++) {
      const monthYear = from.add(i, "month").format("MMMM YYYY");

      let monthAmount;
      if (formik.values.splitType === 0) {
        monthAmount = amountPerMonth.toFixed(2);
      } else if (formik.values.splitType === 1) {
        monthAmount =
          manualDistribution[monthYear] !== undefined
            ? manualDistribution[monthYear]
            : 0;
        totalDistributedAmount += parseFloat(monthAmount);
      } else if (formik.values.splitType === 2) {
        monthAmount = totalAmount.toFixed(2);
      }

      distribution.push({
        monthYear,
        amount: monthAmount,
      });
    }

    // Calculate remaining amount for custom split type
    if (formik.values.splitType === 1) {
      setRemainingAmount(totalAmount - totalDistributedAmount);
    }

    // Conditionally update distribution details state
    // Only set distribution details if updateId is not present (indicating new entry)
    if (!updateId) {
      setDistributionDetails(distribution);
    }
  };

  const [previousSplitType, setPreviousSplitType] = useState(
    formik.values.splitType
  );

  useEffect(() => {
    // Check if splitType changes from custom to normal
    if (previousSplitType === 1 && formik.values.splitType === 0) {
      // Calculate equal distribution
      calculateEqualDistribution();
    }
    // Update previousSplitType state
    setPreviousSplitType(formik.values.splitType);
  }, [formik.values.splitType]);

  const calculateEqualDistribution = () => {
    // Calculate the number of months between the from and to month/year
    const from = dayjs(monthAndyearFrom, "YYYY-MM");
    const to = dayjs(monthAndyearTo, "YYYY-MM");
    const numMonths = to.diff(from, "month") + 1;

    // Calculate the total amount and equal distribution
    const totalAmount = parseFloat(formik.values.amount);
    const amountPerMonth = totalAmount / numMonths;

    // Create a new array with equal amounts for each month
    const newDistribution = [];
    for (let i = 0; i < numMonths; i++) {
      const monthYear = from.add(i, "month").format("MMMM YYYY");
      newDistribution.push({
        monthYear,
        amount: amountPerMonth.toFixed(2),
      });
    }

    // Update distributionDetails with equal amounts
    setDistributionDetails(newDistribution);
  };

  const handleManualDistributionChange = (monthYear, value) => {
    const regex = /^\d*\.?\d{0,2}$/;

    if (regex.test(value) || value === "") {
      const parsedValue = value === "" ? 0 : parseFloat(value);
      const updatedDistribution = {
        ...manualDistribution,
        [monthYear]: parsedValue,
      };

      setManualDistribution(updatedDistribution);

      const updatedDistributionDetails = distributionDetails.map((detail) => {
        if (detail.monthYear === monthYear) {
          return { ...detail, amount: value }; // Default to 0 if empty
        }
        return detail;
      });

      setDistributionDetails(updatedDistributionDetails);

      calculateRemainingAmount(updatedDistributionDetails);
    }
  };

  const handleBlur = (monthYear) => {
    const updatedDistributionDetails = distributionDetails.map((detail) => {
      if (detail.monthYear === monthYear && detail.amount !== "") {
        // Format the amount to two decimal places upon losing focus
        return { ...detail, amount: parseFloat(detail.amount).toFixed(2) };
      }
      return detail;
    });

    setDistributionDetails(updatedDistributionDetails);
    calculateRemainingAmount(updatedDistributionDetails);
  };

  const handleFocus = (monthYear) => {
    const updatedDistributionDetails = distributionDetails.map((detail) => {
      if (detail.monthYear === monthYear && detail.amount === 0) {
        return { ...detail, amount: "" }; // Clear '0' when focused
      }
      return detail;
    });

    setDistributionDetails(updatedDistributionDetails);
  };

  // Call calculateRemainingAmount when distributionDetails changes
  useEffect(() => {
    calculateRemainingAmount();
  }, [distributionDetails]);

  // Function to format the data in the expected format
  const formatDataForApi = () => {
    return distributionDetails.map((detail) => {
      return {
        salaryMonthYear: detail.monthYear,
        amount: detail.amount,
      };
    });
  };

  const getRecurringAdjustementEmployeeAdditionsRecordById = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYEE_RECURRING_ADJUSTMENT_RECORD_BY_ID,
        {
          id: e,
        }
      );

      if (result.result && result.result.length > 0) {
        const adjustmentData = result.result[0];

        // Set formik values from the result data
        formik.setFieldValue("reference", adjustmentData.reference);
        formik.setFieldValue("remarks", adjustmentData.remarks);
        formik.setFieldValue("amount", adjustmentData.totalAmount);
        formik.setFieldValue("employeeId", adjustmentData.employeeId);

        // Determine if the adjustment type is Addition or Deduction
        const componentTypeName = adjustmentData.componentTypeName;

        if (componentTypeName === "Addition") {
          // Set formik values for Addition
          formik.setFieldValue("additionName", adjustmentData.componentName);
          formik.setFieldValue("additionId", adjustmentData.componentId);
          formik.setFieldValue("deductionName", null);
          formik.setFieldValue("deductionId", null);

          // Update the selected adjustment type
          setSelectedAdjustmentType("Addition");
        } else if (componentTypeName === "Deduction") {
          // Set formik values for Deduction
          formik.setFieldValue("deductionName", adjustmentData.componentName);
          formik.setFieldValue("deductionId", adjustmentData.componentId);
          formik.setFieldValue("additionName", null);
          formik.setFieldValue("additionId", null);

          // Update the selected adjustment type
          setSelectedAdjustmentType("Deduction");
        }

        if (adjustmentData.splitType === "normal") {
          formik.setFieldValue("splitType", 0);
        } else if (adjustmentData.splitType === "custom") {
          formik.setFieldValue("splitType", 1);
        } else if (adjustmentData.splitType === "recurring") {
          formik.setFieldValue("splitType", 2); // Set splitType to 2 for "Recurring Same Amount"
          setDistributeTotalAmount(true);
        }

        // Convert the fromMonthYear and toMonthYear to the format "YYYY-MM"
        const formattedFromMonthYear = dayjs(
          adjustmentData.fromMonthYear,
          "MMMM YYYY"
        ).format("YYYY-MM");
        const formattedToMonthYear = dayjs(
          adjustmentData.toMonthYear,
          "MMMM YYYY"
        ).format("YYYY-MM");

        // Set Formik values for the MonthPicker fields
        setMonthAndYearFrom(formattedFromMonthYear);
        setMonthAndYearTo(formattedToMonthYear);

        formik.setFieldValue("fromMonthYear", formattedFromMonthYear);
        formik.setFieldValue("toMonthYear", formattedToMonthYear);

        console.log(monthAndyearFrom, "get by iddd data for frommonthyearyear");
        console.log(monthAndyearTo, "get by iddd data for tommonthyearyear");

        // Set monthly split data to distribution details
        const distribution = adjustmentData.monthlySplit.map((detail) => ({
          monthYear: detail.salaryMonthYear,
          amount: detail.amount,
        }));
        setDistributionDetails(distribution);
        console.log(distribution, "distribution daata");

        // After setting distribution details, calculate the remaining amount
        calculateRemainingAmount();

        // Trigger data fetching based on the selected adjustment type
        handleAdjustmentTypeChange(componentTypeName);
        // Set the update button flag
        setupdateBtn(true);
      } else {
        // Handle the case where no data is returned for the given ID
        console.log("No data found for the given ID");
      }
    }
  };

  useEffect(() => {
    if (updateId) {
      getRecurringAdjustementEmployeeAdditionsRecordById(updateId);
    }
  }, []);

  const calculateRemainingAmount = () => {
    // Calculate the total distributed amount from distributionDetails
    let totalDistributedAmount = 0;
    for (const detail of distributionDetails) {
      totalDistributedAmount += parseFloat(detail.amount) || 0;
    }

    // Calculate remaining amount
    const remaining = parseFloat(formik.values.amount) - totalDistributedAmount;
    setRemainingAmount(remaining);
  };

  const uniqueEmployees = Array.from(
    new Set(employeeList.map((option) => option.employeeId))
  ).map((employeeId) => {
    return employeeList.find((option) => option.employeeId === employeeId);
  });

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

  useEffect(() => {
    calculateRemainingAmount(distributionDetails);
  }, [distributionDetails]);

  console.log(companyDetails, "currency");
  return (
    <DrawerPop
      open={addAssets}
      close={(e) => {
        // console.log(e);
        handleClose();
        close(e);
      }}
      contentWrapperStyle={{
        width: "590px",
      }}
      handleSubmit={(e) => {
        // console.log(e);
        formik.handleSubmit();
        // handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        // UpdateIdBasedAssetsTypes();
        formik.handleSubmit();
      }}
      header={[
        !UpdateBtn
          ? t("Add Recurring Adjustment")
          : t("Update Recurring Adjustment"),
        !UpdateBtn
          ? t("Create Recurring Adjustment")
          : t("Update Recurring Adjustment"),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className="relative w-full">
        {/* <Dropdown
          title={t("Employee Name")}
          placeholder="Choose any one of the Employee"
          change={(selectedLeaveType) => {
            const selectedOption = employeeList.find(
              (option) => option.value === selectedLeaveType
            );
            if (selectedOption) {
              formik.setFieldValue("employeename", `${selectedOption.label}`);
              formik.setFieldValue("employeeId", selectedOption.employeeId);
            }
            console.log(selectedOption);
            console.log(selectedOption.employeeId, "employeeId");
          }}
          value={formik.values.employeeId}
          error={formik.errors.employeeId}
          options={employeeList}
          required={true}
        /> */}
        <Dropdown
          title={t("Employee Name")}
          placeholder="Choose any one of the option"
          change={(selectedLeaveType) => {
            const selectedOption = uniqueEmployees.find(
              (option) => option.value === selectedLeaveType
            );
            if (selectedOption) {
              formik.setFieldValue("employeename", selectedOption.label);
              formik.setFieldValue("employeeId", selectedOption.employeeId);
              console.log(selectedOption.joiningDate, "joiningDate");
              setJoiningDate(selectedOption.joiningDate);
            }
          }}
          value={formik.values.employeeId}
          // error={formik.errors.employeename}
          options={uniqueEmployees.map((option) => ({
            value: option.value,
            label: option.label,
            employeeId: option.employeeId,
          }))}
          required={true}
          error={formik.errors.employeeId}
        />
        <Dropdown
          placeholder="Choose Adjustment Type"
          title="Adjustment Type"
          options={[
            { id: 1, value: "Addition", label: "Addition" },
            { id: 2, value: "Deduction", label: "Deduction" },
          ]}
          value={selectedAdjustmentType}
          change={handleAdjustmentTypeChange}
          required={true}
          error={formik.errors.fieldNameForAdjustmentTypeId}
        />
        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            placeholder="Choose Salary Components "
            title="Salary Components"
            options={
              selectedAdjustmentType === "Addition"
                ? additionsList
                : deductionsList
            }
            value={
              selectedAdjustmentType === "Addition"
                ? formik.values.additionName
                : formik.values.deductionName
            }
            // value={formik.values.additionName}
            required={true}
            // error={
            //   selectedAdjustmentType === "Addition"
            //     ? formik.touched.additionName && formik.errors.additionName
            //     : formik.touched.deductionName && formik.errors.deductionName
            // }
            error={formik.errors.additionName}
            change={(selectedComponent) => {
              // Determine the appropriate list based on the selected adjustment type
              const optionsList =
                selectedAdjustmentType === "Addition"
                  ? additionsList
                  : deductionsList;

              // Find the selected option in the list
              const selectedOption = optionsList.find(
                (option) => option.label === selectedComponent
              );

              if (selectedOption) {
                if (selectedAdjustmentType === "Addition") {
                  // Set the formik values for addition
                  formik.setFieldValue("additionName", selectedOption.value);
                  formik.setFieldValue("additionId", selectedOption.employeeId);
                } else {
                  // Set the formik values for deduction
                  formik.setFieldValue("additionName", selectedOption.value);
                  formik.setFieldValue("additionId", selectedOption.employeeId);
                }
              }
            }}
          />
          <FormInput
            title={t("Amount")}
            placeholder={t(" Amount")}
            change={(e) => {
              const valuedata = e.replace(/[^0-9]/g, "");
              formik.setFieldValue("amount", valuedata);
            }}
            value={formik.values.amount}
            error={formik.errors.amount}
            // type="number"
            required={true}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* <MonthPicker
                picker="month"
                className={" w-36"}
                placeholder="From"
                title="Salary Period From"
                onChange={(e, i) => {
                  setMonthAndYearFrom(i);
                  console.log(i);
                }}
              />
 
          <MonthPicker
                picker="month"
                className={" w-36"}
                placeholder="To"
                title="Salary Period From"
                onChange={(e, i) => {
                  setMonthAndYearTo(i);
                  console.log(i);
                }}
              /> */}

          <DateSelect
            pickerType="month"
            dateFormat="YYYY-MM"
            title="Salary Period From"
            placeholder="Select Salary Period From"
            value={formik.values.fromMonthYear}
            change={(e) => {
              formik.setFieldValue("fromMonthYear", e);
              setMonthAndYearFrom(e);
              console.log(e, "seleted to year");
              setTodate(e);
            }}
            error={formik.errors.fromMonthYear}
            required={true}
            disableBeforeDate={joiningDate}
          />
          <DateSelect
            pickerType="month"
            dateFormat="YYYY-MM"
            title="Salary Period To"
            placeholder="Select Salary Period To"
            value={formik.values.toMonthYear}
            change={(e) => {
              formik.setFieldValue("toMonthYear", e);
              setMonthAndYearTo(e);
              console.log(e, "seleted to year");
            }}
            required={true}
            error={formik.errors.toMonthYear}
            disableBeforeDate={todate}
          />
        </div>

        <div className="flex items-center gap-2">
          <CheckBoxInput
            titleRight="Recurring Same Amount"
            value={distributeTotalAmount}
            change={(checked) => {
              setDistributeTotalAmount(checked);
              if (checked) {
                formik.setFieldValue("splitType", 2);
                const totalAmount = parseFloat(formik.values.amount);
                const distribution = distributionDetails.map((detail) => ({
                  ...detail,
                  amount: totalAmount.toFixed(2),
                }));
                setDistributionDetails(distribution);
              } else {
                formik.setFieldValue("splitType", 0);
                calculateEqualDistribution();
              }
            }}
          />

          {/* Render the ToggleBtn only if Distribute total amount is unchecked */}
          {!distributeTotalAmount && (
            <ToggleBtn
              value={formik.values.splitType}
              change={(e) => {
                formik.setFieldValue("splitType", e ? 1 : 0);
                if (e === 0) {
                  calculateEqualDistribution();
                } else {
                  calculateDistribution();
                }
              }}
              titleRight="Distribute Manually"
              titleRightClassName={
                "pt-[6px] text-xs font-medium 2xl:text-sm dark:text-white !important"
              }
              className={"ml-2"}
            />
          )}
        </div>
        <>
          {formik.values.amount &&
            formik.values.fromMonthYear &&
            formik.values.toMonthYear && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium 2xl:text-sm dark:text-white opacity:25">
                  Distribution Details
                </p>
                <div className="p-3 flex flex-col gap-4 bg-[#F5F5F5] dark:bg-[#141414] rounded-lg">
                  {console.log("distributionDetails:", distributionDetails)}
                  {(distributionDetails || []).map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <p className="pblack">{detail.monthYear}:</p>
                      <FormInput
                        placeholder="Amount"
                        value={detail.amount}
                        className="w-[125px]"
                        change={(e) => {
                          if (formik.values.splitType === 1) {
                            handleManualDistributionChange(detail.monthYear, e);
                          }
                        }}
                        onBlur={() => handleBlur(detail.monthYear)}
                        onFocus={() => handleFocus(detail.monthYear)}
                        disabled={formik.values.splitType !== 1} // Disable input for normal split type
                        type="number"
                      />
                    </div>
                  ))}

                  {formik.values.splitType === 1 && (
                    <p
                      className={`text-right ${
                        remainingAmount === 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {companyDetails?.currency?.length > 1
                        ? `${
                            isNaN(remainingAmount)
                              ? "0.00"
                              : remainingAmount.toFixed(2)
                          } ${companyDetails.currency}`
                        : `${companyDetails?.currency || ""} ${
                            isNaN(remainingAmount)
                              ? "0.00"
                              : remainingAmount.toFixed(2)
                          }`}
                      <span className="ml-2">left for distribution</span>
                    </p>
                  )}
                </div>
              </div>
            )}
        </>

        <FormInput
          title={t("Reference")}
          placeholder={t("Reference")}
          change={(e) => {
            formik.setFieldValue("reference", e);
          }}
          value={formik.values.reference}
          error={formik.errors.reference}
          required={true}
        />

        <TextArea
          title={t("Remarks")}
          placeholder={t(" Remarks ")}
          change={(e) => formik.setFieldValue("remarks", e)}
          value={formik.values.remarks}
          error={formik.errors.remarks}
          required={true}
        />
      </FlexCol>
    </DrawerPop>
  );
}
