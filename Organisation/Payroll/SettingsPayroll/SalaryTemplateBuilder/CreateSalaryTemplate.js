import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";
import DrawerPop from "../../../../common/DrawerPop";
import FormInput from "../../../../common/FormInput";
import FlexCol from "../../../../common/FlexCol";
import Stepper from "../../../../common/Stepper";
import { RxQuestionMarkCircled } from "react-icons/rx";
import Accordion from "../../../../common/Accordion";
import { PiTrash } from "react-icons/pi";
import RadioButton from "../../../../common/RadioButton";
import AddMore from "../../../../common/AddMore";
import Dropdown from "../../../../common/Dropdown";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { calculationType, calculationTypeGrossPAy } from "../../../../data";
import EmployeeCheck from "../../../../common/EmployeeCheck";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function CreateSalaryTemplate({
  open,
  close = () => {},
  refresh,
}) {
  const { t } = useTranslation();
  const [addCreateSalaryTemplate, setCreateLoanSettings] = useState(open);
  const [activeBtnValue, setActiveBtnValue] = useState("salaryTemplateBuilder");
  const [nextStep, setNextStep] = useState(0);
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );
  const [earningsData, setEarningsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeBtn, setActiveBtn] = useState(0);
  const [presentage, setPresentage] = useState(0);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [deductionOptions, setDeductionOptions] = useState([]);
  const [selectedDeductionNames, setSelectedDeductionNames] = useState([]);
  const [overallDeductionAmount, setOverallDeductionAmount] = useState(0);

  const [earningsvalue, setEarningsvalue] = useState(false);
  const [employeeSearchData, setEmployeeSearchData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [allEmploylist, setAllemploylist] = useState([]);
  const [assignEmployee, setAssignEmployee] = useState([]);
  const [salaryTemplateIdData, setSalaryTemplateIdData] = useState([]);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [employeeId, setEmployeeId] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [unmappedEmployees, setUnmappedEmployees] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [intialEarningsData, setIntialEarningsData] = useState([]);
  const [deductions, setDeductions] = useState([
    // {
    //   id: 1,
    //   deducationname: null,
    //   deducationcalculationType: null,
    //   deducationamountPerMonth: "",
    //   deducationcalculationTypeId: "",
    //   editable: true,
    // },
  ]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState([]);

  const [selectedEarningsIds, setSelectedEarningsIds] = useState([]);
  const [selectedDeductionIds, setSelectedDeductionIds] = useState([]);

  console.log(selectedEmployeeId, "selectedEmployeeId");
  const handleClose = () => {
    close();
    refresh();
    setCreateLoanSettings(false);
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
  const CreateSalaryTemplateSteps = [
    {
      id: 0,
      value: 0,
      title: "Salary Template Builder",
      data: "salaryTemplateBuilder",
    },
    {
      id: 1,
      value: 1,
      title: "Assign",
      data: "assign",
    },
  ];
  const navigateBtn = [{ id: 1, value: "Employees", title: "Employees" }];
  const [activeTab, setActiveTab] = useState(navigateBtn[0].id);
  const getValidationSchema = () => {
    let schema = yup.object().shape({
      salaryTemplateBuilderName: yup
        .string()
        .required("Template Name is required"),
      templateEmployeeType: yup.string().required("Employee Type is required"),
    });

    if (earningsvalue === true) {
      schema = schema.shape({
        deducations: yup
          .array()
          .min(1, "Deduction amount per month must be less than Total earnings")
          .required(
            "Deduction amount per month must be less than Total earnings"
          ),
      });
    } else {
      schema = schema.shape({
        deducations: yup
          .array()
          .min(1, "Deduction amount per month is required")
          .required("Deduction amount per month is required"),
      });
    }

    return schema;
  };
  const earningsValidationSchema = yup.array().of(
    yup.object().shape({
      name: yup.string().when("$isFirst", {
        is: false,
        then: yup.string().required("Earnings Name is required"),
        otherwise: yup.string(),
      }),
      calculationType: yup.string().when("$isFirst", {
        is: false,
        then: yup.string().required("Calculation Type is required"),
        otherwise: yup.string(),
      }),
      amountPerMonth: yup.string().required("Amount Per Month is required"),
    })
  );

  const formik = useFormik({
    initialValues: {
      calculationType: "",
      templateEmployeeType: "",
      salaryTemplateBuilderName: "",
      earnings: [],
      deducations: [],
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnMount: false,
    validationSchema: yup.object().shape({
      salaryTemplateBuilderName: yup
        .string()
        .required("Template Name is required"),
      templateEmployeeType: yup.string().required("Employee Type is required"),
      // earnings: earningsValidationSchema,
      // deducations: yup.array().of(
      //   yup.object().shape({
      //     deducationname: yup.string().required("Deduction Name is required"),
      //     deducationcalculationType: yup
      //       .string()
      //       .required("Deduction Calculation Type is required"),
      //     deducationamountPerMonth: yup
      //       .string()
      //       .required("Deduction Amount Per Month is required"),
      //   })
      // ),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      const filteredDeductions = deductions.filter((deduction) => {
        return (
          deduction.deducationname ||
          deduction.deducationcalculationType ||
          deduction.deducationamountPerMonth ||
          deduction.deducationcalculationTypeId
        );
      });

      if (!updateId) {
        try {
          const result = await Payrollaction(
            PAYROLLAPI.CREATE_Salary_Template_Builder_RECORD,
            {
              socialSecurityContributionName: e.socialSecurityContributionName,
              companyId: companyId,
              templateName:
                e.salaryTemplateBuilderName.charAt(0).toUpperCase() +
                e.salaryTemplateBuilderName.slice(1),
              templateEmployeeType: e.templateEmployeeType,
              grossSalary: overallDeductionAmount.monthlyNetEarnings,
              isActive: 1,
              createdBy: loggedEmployeeId,
              earnings,
              deductions: filteredDeductions,
            }
          );

          if (result.status === 200) {
            setSalaryTemplateIdData(result.result.insertedId);
            openNotification("success", "Successful", result.message);
            setPresentage(1);
            setNextStep(nextStep + 1);
            setActiveBtnValue("assign");
            setLoading(false);
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
      } else {
        // Transform earnings data
        const transformedEarnings = earnings.map((earning) => ({
          componetId: earning.componetId,
          calculationTypeId: earning.calculationTypeId,
          value: earning.value,
          amount: earning.amountPerMonth,
        }));

        // Transform deductions data
        const transformedDeductions = deductions.map((deduction) => ({
          componetId: deduction.componetId,
          calculationTypeId:
            deduction.deducationcalculationTypeId ||
            deduction.calculationTypeId,
          value: deduction.value,
          amount: deduction.deducationamountPerMonth,
        }));

        // Create the API request body
        const requestBody = {
          salaryTemplateId: updateId,
          companyId: companyId,
          templateName:
            formik.values.salaryTemplateBuilderName.charAt(0).toUpperCase() +
            formik.values.salaryTemplateBuilderName.slice(1),
          templateEmployeeType: formik.values.templateEmployeeType,
          grossSalary: overallDeductionAmount.monthlyNetEarnings,
          isActive: 1,
          modifiedBy: loggedEmployeeId,
          earnings: transformedEarnings,
          deductions: transformedDeductions,
        };

        try {
          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_Salarytemplate_RECORD_BY_ID,
            requestBody
          );

          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setPresentage(1);
            setNextStep(nextStep + 1);
            setActiveBtnValue("assign");
            setLoading(false);
          } else if (result.status === 400) {
            const errorMessage =
              result.errors &&
              result.errors[0] &&
              result.errors[0].socialSecurityContributionName;
            openNotification("error", "Info", errorMessage || result.message);
            setLoading(false);
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } catch (error) {
          openNotification(
            "error",
            "Info",
            "There was an error while updating the salary template. Please try again."
          );
          setLoading(false);
        }
      }
    },
  });

  const initialValues = {
    templateName: "",
  };

  const Formik2 = useFormik({
    initialValues,

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object({}),
    onSubmit: async (e) => {
      const assignedEmployeeIds = [...selectedEmployees, ...unmappedEmployees]
        .filter((each) => each.assign)
        .map((each) => each.id);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero based
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      try {
        const result = await Payrollaction(
          PAYROLLAPI.ASSIGN_EMPLOYEE_FOR_SALARYTEMPLATE,
          {
            salaryTemplateId: salaryTemplateIdData || updateId,
            companyId: companyId,
            withEffectfrom: formattedDate,
            isActive: 1,
            createdBy: loggedEmployeeId,
            employeeId: selectedEmployeeId
              .map((each) => each.assign && each.id)
              .filter((data) => data),
          }
        );
        if (result.status === 200) {
          openNotification("success", "Successful", result.message, () => {
            close();
          });
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 1000);
        } else {
          openNotification("error", "Info", result.message);
          setLoading(false);
        }
      } catch (error) {
        openNotification("error", "Info", error.message);
        setLoading(false);
      }
    },
  });

  //getEarningList to get the list of earnings and to show it in Earnings Name

  let initialEarnings = null;

  const getEarningList = async () => {
    try {
      // Fetch earnings data from API
      const result = await Payrollaction(PAYROLLAPI.GET_ALL_EARNINGS_RECORDS, {
        companyId: companyId,
        isActive: 1,
      });
      setEarningsData(result?.result);

      const initialEarnings = result?.result.find(
        (entry) => entry.isEditable === "0"
      );

      if (initialEarnings) {
        setEarnings([
          {
            id: 1,
            componetId: initialEarnings.earningsId,
            name: initialEarnings.earningsName,
            calculationType: "Fixed",
            calculationTypeId: 1,
            amountPerMonth: "0", // Explicitly set to "0"
            amount: "0", // Explicitly set to "0"
            value: "0", // Explicitly set to "0"
            totalEarnings: 0, // Default total earnings
            editable: false,
          },
        ]);
      }
      setIntialEarningsData(initialEarnings);
      // Set initial earnings state with "Basic" selected
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getEarningList();
  }, []);

  // Add new earnings entry handleAddCondition to Create new rows of Earnings Name , Calculation Type , Amount Per Month

  const handleAddCondition = () => {
    setEarnings((prevEarnings) => [
      ...prevEarnings,
      {
        id: prevEarnings.length + 1,
        name: null,
        calculationType: null,
        amount: "0", // Set default to "0"
        amountPerMonth: "0", // Set default to "0"
        value: "0", // Set default to "0"
        totalEarnings: 0, // Default total earnings
        editable: true,
      },
    ]);

    formik.setFieldValue("earnings", [
      ...formik.values.earnings,
      {
        name: "",
        calculationType: "",
        amount: "0", // Set default to "0"
        amountPerMonth: "0", // Set default to "0"
        value: "0", // Set default to "0"
        totalEarnings: 0, // Default total earnings
      },
    ]);
  };

  // Delete earnings entry handleDeleteCondition to Delete the already created rows of Earnings Name , Calculation Type , Amount Per Month

  const handleDeleteCondition = (index) => {
    const deletedEarningsId = earnings[index].componetId;

    // Remove the selected earningsId from selectedEarningsIds
    setSelectedEarningsIds((prevIds) =>
      prevIds.filter((id) => id !== deletedEarningsId)
    );

    // Remove the row from earnings state
    setEarnings((prevEarnings) => prevEarnings.filter((_, i) => i !== index));

    formik.setFieldValue(
      "earnings",
      formik.values.earnings.filter((_, i) => i !== index)
    );

    // Enable the selected option in the dropdown options
    const name = earnings[index].name;
    setSelectedOptions((prevOptions) =>
      prevOptions.filter((option) => option !== name)
    );
  };

  // const handleDropdownChange = (index, selectedOption) => {
  //   setEarnings((prevEarnings) =>
  //     prevEarnings.map((prevCondition, i) => {
  //       if (i === index) {
  //         return {
  //           ...prevCondition,
  //           name: selectedOption.earningsName,
  //           componetId: selectedOption.earningsId,
  //         };
  //       }
  //       return prevCondition;
  //     })
  //   );
  //   // Add selected option to the list of selected options
  //   setSelectedOptions((prevOptions) => [
  //     ...prevOptions,
  //     selectedOption.earningsName,
  //   ]);
  // };
  const handleDropdownChange = (index, selectedOption) => {
    setEarnings((prevEarnings) =>
      prevEarnings.map((prevCondition, i) => {
        if (i === index) {
          if (prevCondition.componetId) {
            setSelectedEarningsIds((prevIds) =>
              prevIds.filter((id) => id !== prevCondition.componetId)
            );
          }
          // Add the newly selected earningsId to selectedEarningsIds
          setSelectedEarningsIds((prevIds) => [
            ...prevIds,
            selectedOption.earningsId,
          ]);
          return {
            ...prevCondition,
            name: selectedOption.earningsName,
            componetId: selectedOption.earningsId,
            amount: prevCondition.amount || "0", // Ensure default "0"
            amountPerMonth: prevCondition.amountPerMonth || "0", // Ensure default "0"
            value: prevCondition.value || "0", // Ensure default "0"
          };
        }
        return prevCondition;
      })
    );
  };

  // const handleDropdownChange = (index, selectedOption) => {
  //   const newSelectedOptions = [...selectedOptions];
  //   newSelectedOptions[index] = selectedOption.earningsName;
  //   setSelectedOptions(newSelectedOptions);

  //   const newEarnings = [...earnings];
  //   newEarnings[index].name = selectedOption.earningsName;
  //   // Update other properties of newEarnings if needed
  //   setEarnings(newEarnings);
  // };

  const calculateTotalEarnings = (
    index,
    calculationType,
    amountPerMonth,
    callback
  ) => {
    let newTotalEarnings = 0;

    if (calculationType === "Fixed") {
      const amount = Number(amountPerMonth.replace(/\D/g, ""));
      newTotalEarnings = amount * 12 || 0;
    } else if (calculationType === "PercentageofBasicPay") {
      const percentage = Number(amountPerMonth.replace(/\D/g, ""));
      newTotalEarnings =
        (calculateTotalEarningsForBasicPay() * percentage) / 100 || 0;
    }

    setEarnings((prevEarnings) =>
      prevEarnings.map((prevCondition, i) =>
        i === index
          ? {
              ...prevCondition,
              totalEarnings: newTotalEarnings,
              amount: prevCondition.amount || "0",
              amountPerMonth: prevCondition.amountPerMonth || "0",
              value: prevCondition.value || "0",
            }
          : prevCondition
      )
    );

    callback(newTotalEarnings);
  };

  // const calculateOverallEarnings = () => {
  //   let overallEarnings = 0;
  //   earnings.forEach((condition) => {
  //     if (condition.totalEarnings) {
  //       overallEarnings += Number(condition.totalEarnings);
  //     }
  //   });
  //   return overallEarnings;
  // };

  // When the user changes the calculationType dropdown

  const handleCalculationTypeChange = (index, newValue) => {
    // Find the corresponding ID for the selected calculation type
    const selectedCalculationType = calculationType.find(
      (type) => type.value === newValue
    );
    const calculationTypeId = selectedCalculationType
      ? selectedCalculationType.id
      : null;

    // Update calculationType and calculationTypeId for the specified entry
    setEarnings((prevEarnings) =>
      prevEarnings.map((prevCondition, i) =>
        i === index
          ? {
              ...prevCondition,
              calculationType: newValue, // Set the calculationType
              calculationTypeId: calculationTypeId, // Set the calculationTypeId
            }
          : prevCondition
      )
    );
  };

  //getDeductionsList to get the list of earnings and to show it in Deduction Name

  const getDeductionsList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_DEDUCTIONS_RECORDS,
        {
          companyId: companyId,
          isActive: 1,
        }
      );
      setDeductionOptions(result?.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDeductionsList();
    calculateOverallDeductionAmount();
  }, [deductions]);

  // Add new deduction row handleAddConditionDeducations to create new rows of Deduction Name, Deduction Calculation Type , Deduction Amount Per Month

  const handleAddConditionDeducations = () => {
    setDeductions((prevDeducations) => [
      ...prevDeducations,
      {
        id: prevDeducations.length + 1,
        deducationname: null,
        deducationcalculationType: null,
        deducationamountPerMonth: "",
        editable: true,
      },
    ]);

    calculateOverallDeductionAmount();

    formik.setFieldValue("deducations", [
      ...formik.values.deducations,
      {
        deducationname: "",
        deducationcalculationType: "",
        deducationamountPerMonth: "",
      },
    ]);
  };

  // Delete deduction row handleDeleteConditionDeducations to delete the previously created  rows of Deduction Name, Deduction Calculation Type , Deduction Amount Per Month

  const handleDeleteConditionDeducations = (index) => {
    const deletedDeductionId = deductions[index].componetId;

    // Remove the selected deductionId from selectedDeductionIds
    setSelectedDeductionIds((prevIds) =>
      prevIds.filter((id) => id !== deletedDeductionId)
    );

    // Remove the row from deductions state
    setDeductions((prevDeductions) =>
      prevDeductions.filter((_, i) => i !== index)
    );
    formik.setFieldValue(
      "deducations",
      formik.values.deducations.filter((_, i) => i !== index)
    );
    const name = deductions[index].deducationname;
    setSelectedDeductionNames((prevOptions) =>
      prevOptions.filter((option) => option !== name)
    );
    calculateOverallDeductionAmount();
  };

  // Calculate overall earnings
  const calculateOverallEarnings = () => {
    let overallEarnings = 0;
    earnings.forEach((condition) => {
      // Sum up total earnings from each entry
      overallEarnings += Number(condition.totalEarnings || 0);
    });
    return overallEarnings;
  };

  // Calculate overall deduction amount and net earnings
  const calculateOverallDeductionAmount = () => {
    // Calculate total amount of deductions
    let totalDeductions = 0;
    deductions.forEach((deduction) => {
      if (deduction.deducationcalculationType === "Fixed") {
        totalDeductions += Number(deduction.deducationamountPerMonth) * 12;
      } else if (
        deduction.deducationcalculationType === "PercentageofBasicPay"
      ) {
        totalDeductions += calculateDeductionAmounts(
          Number(deduction.deducationamountPerMonth)
        );
      } else if (
        deduction.deducationcalculationType === "PercentageofTotalEarnings"
      ) {
        totalDeductions += calculateDeductionAmountFromTotalEarnings(
          Number(deduction.deducationamountPerMonth)
        );
      }
    });

    // Calculate overall earnings
    const overallEarnings = calculateOverallEarnings();

    // Calculate net earnings as overall earnings minus total deductions
    const netEarnings = overallEarnings - totalDeductions;

    if (overallEarnings && netEarnings <= 0) {
      setEarningsvalue(true);
      // setDeductions(deductions.map((each) => ({ ...each, error:"The input value must be less than total earnings. "})))
    } else {
      // setDeductions(deductions.map((each) => ({ ...each, error: " " })))
      setEarningsvalue(false);
    }

    // Calculate monthly net earnings
    const monthlyNetEarnings = netEarnings / 12;

    // Update the state with the new overall deduction amount
    setOverallDeductionAmount({
      totalAmount: totalDeductions,
      netEarnings: netEarnings,
      monthlyNetEarnings: monthlyNetEarnings,
    });
  };

  useEffect(() => {
    calculateOverallDeductionAmount();
  }, [deductions, earnings]);

  const handleDeductionNameChange = (index, selectedName) => {
    // Update selected deduction name for a particular row
    setSelectedDeductionNames((prevNames) => {
      const updatedNames = [...prevNames];
      updatedNames[index] = selectedName;
      return updatedNames;
    });
  };

  const calculateTotalEarningsForBasicPay = () => {
    // Find the index of the "Basic" entry in the earnings array
    const basicIndex = earnings.findIndex(
      (earning) => earning.name === intialEarningsData?.earningsName
    );

    // Retrieve the amount per month for the "Basic" entry
    const basicAmountPerMonth = earnings[basicIndex].amountPerMonth;

    // Calculate the total earnings for the "Basic" entry
    const totalEarningsForBasic = basicAmountPerMonth
      ? Number(basicAmountPerMonth) * 12
      : 0;

    return totalEarningsForBasic;
  };

  const calculateDeductionAmounts = (percentage) => {
    const basicPayTotal = calculateTotalEarningsForBasicPay();
    return (percentage / 100) * basicPayTotal;
  };

  const calculateDeductionAmountFromTotalEarnings = (percentage) => {
    const overallEarnings = calculateOverallEarnings();
    return (percentage / 100) * overallEarnings;
  };

  const handleDeductionDropdownChange = (index, selectedOption) => {
    setDeductions((prevDeducations) =>
      prevDeducations.map((prevCondition, i) => {
        if (i === index) {
          // If there's a previous selection, remove it from selectedDeductionIds
          if (prevCondition.componetId) {
            setSelectedDeductionIds((prevIds) =>
              prevIds.filter((id) => id !== prevCondition.componetId)
            );
          }
          // Add the newly selected deductionId to selectedDeductionIds
          setSelectedDeductionIds((prevIds) => [
            ...prevIds,
            selectedOption.deductionId,
          ]);
          return {
            ...prevCondition,
            deducationname: selectedOption.deductionName,
            componetId: selectedOption.deductionId,
          };
        }
        return prevCondition;
      })
    );
    // Add selected deduction name to the list of selected deduction names
    setSelectedDeductionNames((prevNames) => {
      const newOptions = [...prevNames];
      newOptions[index] = selectedOption.deductionName;
      return newOptions;
    });
  };

  const handleDeductionDropdownChangeForCalculationType = (
    index,
    selectedOption
  ) => {
    setDeductions((prevDeducations) =>
      prevDeducations.map((prevCondition, i) => {
        if (i === index) {
          return {
            ...prevCondition,
            deducationname: selectedOption.deductionName,
            componetId: selectedOption.deductionId,
            calculationType: selectedOption.calculationType, // Add calculation type to the deduction object
            calculationTypeId: selectedOption.calculationTypeId, // Add calculation type ID to the deduction object
          };
        }
        return prevCondition;
      })
    );

    // Add selected deduction name to the list of selected deduction names
    setSelectedDeductionNames((prevNames) => [
      ...prevNames,
      selectedOption.deductionName,
    ]);
  };

  const getEmployee = async () => {
    let templateId = salaryTemplateIdData;
    if (updateId && updateId.length > 0) {
      templateId = updateId;
    }

    if (!templateId) {
      console.error("No salary template ID available.");
      return;
    }

    const result = await Payrollaction(
      PAYROLLAPI.GET_EMPLOYEE_LIST_FOR_SALARY_TEMPLATE,
      {
        companyId: companyId,
        salaryTemplateId: templateId,
      }
    );
    setAllemploylist([
      ...result.result.selectedEmployees,
      ...result.result.unmappedEmployees,
    ]);

    const selected = result.result.selectedEmployees.map((each) => ({
      id: each.employeeId,
      label: each.employeeName,
      value: each.profilePicture,
      assign: true,
    }));

    const unmapped = result.result.unmappedEmployees.map((each) => ({
      id: each.employeeId,
      label: each.employeeName,
      value: each.profilePicture,
      assign: false,
    }));

    setSelectedEmployees(selected);
    setUnmappedEmployees(unmapped);
    setEmployeeSearchData(
      result.result.selectedEmployees.concat(result.result.unmappedEmployees)
    );
  };

  useEffect(() => {
    setUnmappedEmployees(
      searchData.map((each) => ({
        id: each.employeeId,
        label: each.employeeName,
        value: each.profilePicture,
        assign: false,
      }))
    );
  }, [searchData]);

  useEffect(() => {
    switch (activeBtnValue) {
      default:
        break;
      case "assign":
        getEmployee();
        break;
    }
  }, [activeBtnValue]);

  const handleToggleList = (id, checked) => {
    if (id === 0) {
      setSelectedEmployees((prev) =>
        prev.map((employee) => ({ ...employee, assign: checked }))
      );
      setUnmappedEmployees((prev) =>
        prev.map((employee) => ({ ...employee, assign: checked }))
      );
    } else {
      setSelectedEmployees((prev) =>
        prev.map((employee) =>
          employee.id === id ? { ...employee, assign: checked } : employee
        )
      );
      setUnmappedEmployees((prev) =>
        prev.map((employee) =>
          employee.id === id ? { ...employee, assign: checked } : employee
        )
      );
    }
  };

  const onScroll = (e) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 400) {
      getEmployee();
    }
  };

  useEffect(() => {
    setSelectedEmployees((prev) =>
      prev.map((employee) =>
        assignEmployee.includes(employee.id)
          ? { ...employee, assign: true }
          : employee
      )
    );
    setUnmappedEmployees((prev) =>
      prev.map((employee) =>
        assignEmployee.includes(employee.id)
          ? { ...employee, assign: true }
          : employee
      )
    );
  }, [employeeSearchData, assignEmployee]);

  const getSalarytemplateRecordsById = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await Payrollaction(
        PAYROLLAPI.GET_Salarytemplate_RECORD_BY_ID,
        {
          id: e,
        }
      );

      if (result.result && result.result.length > 0) {
        const record = result.result[0];

        // Set formik field values
        formik.setFieldValue("salaryTemplateBuilderName", record.templateName);
        formik.setFieldValue(
          "templateEmployeeType",
          record.templateEmployeeType
        );

        // Map earnings data to the formik field structure
        const earningsData = record.earnings.map((earning) => ({
          id: earning.salaryTemplateDetailsId,
          componetId: earning.componetId,
          name: earning.earningsName,
          calculationType: earning.calculationType,
          calculationTypeId: earning.calculationTypeId,
          amountPerMonth: earning.amount,
          value: earning.value,
          totalEarnings: earning.amount * 12, // Assuming total earnings is amount * 12
          editable: true,
          // Include any other necessary fields
        }));
        // Set earnings data in formik state
        formik.setFieldValue("earnings", earningsData);
        setEarnings(earningsData);
        setSelectedEarningsIds(
          record.earnings.map((each) => parseInt(each.componetId))
        );
        console.log(
          record.earnings.map((each) => each.componetId),
          "idsss"
        );
        // Map deductions data to the formik field structure
        const deductionsData = record.deductions.map((deduction) => ({
          id: deduction.salaryTemplateDetailsId,
          componetId: deduction.componetId,
          deducationname: deduction.deductionName,
          deducationcalculationType: deduction.calculationType,
          deducationcalculationTypeId: deduction.calculationTypeId,
          deducationamountPerMonth: deduction.amount,
          value: deduction.value,
          // Include any other necessary fields
        }));
        setSelectedDeductionIds(
          record.deductions.map((each) => parseInt(each.componetId))
        );
        setOverallDeductionAmount(record.grossSalary);
        // Set deductions data in formik state
        formik.setFieldValue("deducations", deductionsData);
        setDeductions(deductionsData);

        // Set other fields, such as employee information, as necessary
        // For instance, you could use `setEmployeeId` if needed:
        const employeeId = record.employee.map((emp) => emp.employeeId);
        setEmployeeList(employeeId);
        setEmployeeId(employeeId);
      } else {
        console.log("No data found for the given ID");
      }
    }
  };

  useEffect(() => {
    getSalarytemplateRecordsById(updateId);
  }, [updateId]);

  const updateUserForSalarytemplatedById = async () => {
    try {
      const assignedEmployeeIds = [...selectedEmployees, ...unmappedEmployees]
        .filter((each) => each.assign)
        .map((each) => each.id);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero based
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      const result = await Payrollaction(
        PAYROLLAPI.UPDATE_Salarytemplate_EMPLOYEES_BY_ID,
        {
          salaryTemplateId: updateId,
          withEffectfrom: formattedDate,
          isActive: 1,
          createdBy: loggedEmployeeId,
          employeeId: selectedEmployeeId
            .map((each) => each.assign && each.id)
            .filter((data) => parseInt(data)),
        }
      );

      if (result.status === 200) {
        openNotification("success", "Successful", result.message, () => {
          close();
        });
        setTimeout(() => {
          handleClose();
          refresh();
          // window.location.reload();
        }, 1000);
      } else {
        openNotification("error", "Info", result.message);
      }
    } catch (error) {
      openNotification("error", "Info", error.message);
      console.log(error);
    }
  };

  useEffect(() => {}, [earnings]);

  useEffect(() => {
    if (activeBtn < 1 && activeBtn !== nextStep) {
      setActiveBtn(1 + activeBtn);
      setActiveBtnValue(CreateSalaryTemplateSteps?.[activeBtn + 1].data);
    }
  }, [nextStep]);

  useEffect(() => {}, []);

  return (
    <DrawerPop
      placement="bottom"
      background="#F8FAFC"
      open={addCreateSalaryTemplate}
      close={(e) => {
        // console.log(e);
        handleClose();
      }}
      contentWrapperStyle={{
        position: "absolute",
        height: "100%",
        top: 0,
        // left: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        borderRadius: 0,
        borderTopLeftRadius: "0px !important",
        borderBottomLeftRadius: 0,
      }}
      header={[
        !updateId ? t("Create Salary Template") : t("Update Salary Template"),
        !updateId
          ? t("Create Salary Template By Simple Steps")
          : t("Update Salary Template By Simple Steps"),
      ]}
      headerRight={
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5">
            <p className="text-sm font-medium text-gray-400">{t("Help")}</p>
            <RxQuestionMarkCircled className="text-2xl font-medium text-gray-400 " />
          </div>
        </div>
      }
      footerBtn={[
        t("Cancel"),
        // !updateId ? t("Save&Continue") : t("Update&Continue"),
      ]}
      footerBtnDisabled={loading}
      className="widthFull"
      stepsData={CreateSalaryTemplateSteps}
      buttonClick={(e) => {
        if (activeBtnValue === "salaryTemplateBuilder") {
          formik.handleSubmit();
        } else if (activeBtnValue === "assign") {
          if (!updateId) {
            Formik2.handleSubmit();
          } else {
            getEmployee(updateId);
            updateUserForSalarytemplatedById();
          }
        }
      }}
      buttonClickCancel={(e) => {
        if (activeBtn > 0) {
          setActiveBtn(activeBtn - 1);
          setNextStep(nextStep - 1);
          setActiveBtnValue(CreateSalaryTemplateSteps?.[activeBtn - 1].data);
        }
      }}
      nextStep={nextStep}
      activeBtn={activeBtn}
      saveAndContinue={true}
    >
      <FlexCol className={"md:w-3/4 w-full mx-auto gap-6"}>
        {CreateSalaryTemplateSteps && (
          <div className="w-3/5 mx-auto mb-10  sm:w-9/12">
            <Stepper
              steps={CreateSalaryTemplateSteps}
              currentStepNumber={activeBtn}
              presentage={presentage}
            />
          </div>
        )}
        {activeBtnValue === "salaryTemplateBuilder" ? (
          <>
            <FlexCol>
              <Accordion
                title={t("Basic Details")}
                description={t("Setup salary template details.")}
                initialExpanded={true}
                padding={true}
                className={"bg-white dark:bg-dark"}
              >
                <div className="grid items-center grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <FormInput
                      title={t("Template Name")}
                      placeholder={t("Template Name")}
                      change={(e) => {
                        formik.setFieldValue("salaryTemplateBuilderName", e);
                      }}
                      required={true}
                      value={formik.values.salaryTemplateBuilderName}
                      error={formik.errors.salaryTemplateBuilderName}
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <RadioButton
                      options={[
                        {
                          label: t("Regular"),
                          value: "1",
                        },
                        {
                          label: t("Contract"),
                          value: "2",
                        },
                      ]}
                      value={formik.values.templateEmployeeType}
                      change={(e) => {
                        formik.setFieldValue("templateEmployeeType", e);
                      }}
                      required={true}
                      title={t("Employee Type ")}
                      error={formik.errors.templateEmployeeType}
                    />
                  </div>
                </div>
              </Accordion>
            </FlexCol>

            <FlexCol>
              <Accordion
                title={t("Earnings")}
                description={t("Setup earnings that employees can apply for.")}
                initialExpanded={true}
                padding={true}
                className={"bg-white dark:bg-dark"}
              >
                <div className="flex flex-col gap-10">
                  {earnings
                    .sort((a, b) => (a.name === "Basic Pay" ? -1 : 1)) // Sort so "Basic Pay" is first
                    .map((condition, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="grid grid-cols-4 gap-4">
                          {/* Earnings Name Field */}
                          {condition.name ===
                          intialEarningsData?.earningsName ? (
                            <div className="col-span-4 md:col-span-1">
                              <FormInput
                                title={t("Earnings Name")}
                                showValueParagraph={true}
                                placeholder={t(initialEarnings?.earningsName)}
                                value={condition.name}
                                disabled={true} // Disable editing for non-editable entries
                                websiteLink={false}
                              />
                            </div>
                          ) : (
                            <div className="col-span-4 md:col-span-1">
                              <Dropdown
                                title={t("Earnings Name")}
                                showValueParagraph={true}
                                placeholder={t("Choose Earning Name")}
                                value={condition.name}
                                disabled={false}
                                change={(e) => {
                                  const selectedOption = earningsData.find(
                                    (option) => option.earningsName === e
                                  );
                                  handleDropdownChange(index, selectedOption);
                                }}
                                websiteLink={false}
                                options={earningsData
                                  .filter(
                                    (earning) =>
                                      !selectedEarningsIds.includes(
                                        parseInt(earning.earningsId)
                                      ) &&
                                      earning.earningsName !==
                                        initialEarnings?.earningsName &&
                                      earning.isEditable !== "0" // Filter out non-editable entries
                                  )
                                  .map((earning) => ({
                                    label: earning.earningsName,
                                    value: earning.earningsName,
                                    id: earning.earningsId,
                                  }))}
                                error={
                                  formik.touched.earnings &&
                                  formik.errors.earnings &&
                                  formik.errors.earnings[index]?.name
                                }
                              />
                            </div>
                          )}

                          {/* Calculation Type Field */}
                          {condition.name ===
                          intialEarningsData?.earningsName ? (
                            <div className="col-span-4 md:col-span-1">
                              <FormInput
                                title={t("Calculation Type")}
                                showValueParagraph={true}
                                placeholder={t("Fixed")}
                                value={condition.calculationType}
                                disabled={true}
                                websiteLink={false}
                              />
                            </div>
                          ) : (
                            <div className="col-span-4 md:col-span-1">
                              <Dropdown
                                title={t("Calculation Type")}
                                showValueParagraph={true}
                                placeholder={t("Choose Calculation Type")}
                                value={condition.calculationType}
                                change={(selectedOption) =>
                                  handleCalculationTypeChange(
                                    index,
                                    selectedOption
                                  )
                                }
                                disabled={
                                  condition.name ===
                                  intialEarningsData?.earningsName
                                } // Disable editing for non-editable entries
                                websiteLink={false}
                                options={calculationType}
                                error={
                                  formik.touched.earnings &&
                                  formik.errors.earnings &&
                                  formik.errors.earnings[index]?.calculationType
                                }
                              />
                            </div>
                          )}

                          {/* Amount Per Month or Percentage Field */}
                          <div className="relative flex flex-col w-full col-span-4 md:col-span-1">
                            <FormInput
                              title={
                                condition.calculationType ===
                                "PercentageofBasicPay"
                                  ? t("% of Basic Pay")
                                  : t("Calculation Amount Per Month")
                              }
                              showValueParagraph={true}
                              placeholder={
                                condition.calculationType ===
                                "PercentageofBasicPay"
                                  ? t("20%")
                                  : t("Calculation Amount Per Month")
                              }
                              value={
                                condition.amountPerMonth === "" ||
                                condition.amountPerMonth === "0"
                                  ? "0"
                                  : condition.amountPerMonth
                              }
                              change={(e) => {
                                let newValue = e.replace(/^0+/, "");

                                if (
                                  condition.calculationType ===
                                  "PercentageofBasicPay"
                                ) {
                                  // Remove any non-numeric characters and limit to 3 digits
                                  newValue = newValue
                                    .replace(/\D/g, "")
                                    .slice(0, 3);

                                  // Ensure the value does not exceed 100
                                  newValue = Math.min(
                                    Number(newValue),
                                    100
                                  ).toString();
                                  const handleValueCalculation = (
                                    newTotalEarnings
                                  ) => {
                                    // Calculate value using newTotalEarnings
                                    const value = newTotalEarnings / 12 || "0";

                                    // Update state with new value
                                    setEarnings((prevEvaluation) =>
                                      prevEvaluation.map((prevCondition, i) =>
                                        i === index
                                          ? {
                                              ...prevCondition,
                                              amount: value,
                                              amountPerMonth: value,
                                              value: value,
                                            }
                                          : prevCondition
                                      )
                                    );
                                  };

                                  calculateTotalEarnings(
                                    index,
                                    condition.calculationType,
                                    newValue,
                                    handleValueCalculation
                                  );
                                } else {
                                  // Remove any non-numeric characters and limit to 8 digits
                                  newValue = newValue
                                    .replace(/\D/g, "")
                                    .slice(0, 8);
                                }

                                // Update the state to reflect the current value
                                setEarnings((prevEvaluation) =>
                                  prevEvaluation.map((prevCondition, i) =>
                                    i === index
                                      ? {
                                          ...prevCondition,
                                          amount: newValue || "0", // Set to "0" if empty
                                          amountPerMonth: newValue || "0",
                                          value: newValue || "0",
                                        }
                                      : prevCondition
                                  )
                                );
                                calculateTotalEarnings(
                                  index,
                                  condition.calculationType,
                                  newValue,
                                  () => {}
                                );
                              }}
                              className="w-full"
                              websiteLink={false}
                              error={
                                formik.touched.earnings &&
                                formik.errors.earnings &&
                                formik.errors.earnings[index]?.amountPerMonth
                              }
                            />

                            {condition.calculationType !==
                              intialEarningsData?.earningsName &&
                              condition.calculationType !== "" && (
                                <p className="absolute -bottom-5 pblack">
                                  {condition.totalEarnings} Per Annum
                                </p>
                              )}
                          </div>

                          {/* Delete Button */}
                          {condition.name !== "Basic Pay" &&
                            condition.editable && (
                              <div className="flex items-end justify-end col-span-4 md:col-span-1">
                                <div
                                  onClick={() => handleDeleteCondition(index)}
                                  className="text-lg 2xl:text-xl rounded-md size-8 2xl:size-10 vhcenter transition duration-300 hover:bg-red-500 group bg-[#F2F4F7] cursor-pointer"
                                >
                                  <Tooltip placement="top" title="Delete">
                                    <PiTrash className="text-red-600 group-hover:text-white group-hover:opacity-100  " />
                                  </Tooltip>
                                </div>
                              </div>
                            )}
                        </div>
                        <div className="v-divider"></div>
                      </div>
                    ))}

                  <div className="flex items-center">
                    <AddMore
                      name="Add Earnings"
                      className="!text-black"
                      change={(e) => {
                        handleAddCondition();
                      }}
                    />
                  </div>
                </div>
              </Accordion>
            </FlexCol>

            <FlexCol>
              <Accordion
                title={t("Deductions")}
                description={t(
                  "Setup deductions that employees can apply for."
                )}
                initialExpanded={true}
                padding={true}
                className={"bg-white dark:bg-dark"}
              >
                <div className="flex flex-col gap-10">
                  {deductions.map((condition, index) => (
                    <div key={index}>
                      <div className="grid grid-cols-4 gap-4">
                        {/* Dropdown */}
                        <div className="col-span-4 md:col-span-1">
                          <Dropdown
                            title={t("Deduction Name")}
                            showValueParagraph={true}
                            placeholder={t("Choose Deduction Name")}
                            value={condition.deducationname}
                            disabled={false}
                            change={(e) => {
                              const selectedOption = deductionOptions.find(
                                (option) => option.deductionName === e
                              );
                              handleDeductionDropdownChange(
                                index,
                                selectedOption
                              );

                              setDeductions((prevEvaluation) =>
                                prevEvaluation.map((prevCondition, i) =>
                                  i === index
                                    ? {
                                        ...prevCondition,
                                        deducationname: e,
                                        deducationamountPerMonth: "0", // Reset to "0"
                                        value: 0, // Reset value to 0
                                        amount: 0, // Reset amount to 0
                                        deducationcalculationType: "", // Reset calculation type dropdown
                                      }
                                    : prevCondition
                                )
                              );
                            }}
                            websiteLink={false}
                            options={deductionOptions
                              .filter(
                                (deduction) =>
                                  !selectedDeductionIds.includes(
                                    parseInt(deduction.deductionId)
                                  )
                              )
                              .map((deduction) => ({
                                label: deduction.deductionName,
                                value: deduction.deductionName,
                                id: deduction.deductionId,
                              }))}
                            // onSelectChange={(options) =>
                            //   console.log(options, "selected option")
                            // }
                            icondropDown={true}
                            error={
                              formik.errors.deducations &&
                              formik.errors.deducations[index]?.deducationname
                            }
                          />
                        </div>

                        <div className="col-span-4 md:col-span-1">
                          <Dropdown
                            title={t("Deduction Calculation Type")}
                            showValueParagraph={true}
                            placeholder={t("Choose Deduction Calculation Type")}
                            value={condition.deducationcalculationType}
                            change={(e) => {
                              const selectedCalculationType =
                                calculationTypeGrossPAy.find(
                                  (type) => type.value === e
                                );
                              const calculationTypeId = selectedCalculationType
                                ? selectedCalculationType.id
                                : null;

                              setDeductions((prevEvaluation) =>
                                prevEvaluation.map((prevCondition, i) =>
                                  i === index
                                    ? {
                                        ...prevCondition,
                                        deducationcalculationType: e,
                                        deducationamountPerMonth: Number(
                                          condition.deducationamountPerMonth
                                        )
                                          ? e === "Fixed"
                                            ? Number(
                                                condition.deducationamountPerMonth
                                              ) * 12
                                            : e === "PercentageofBasicPay"
                                            ? calculateDeductionAmounts(
                                                Number(
                                                  condition.deducationamountPerMonth
                                                )
                                              )
                                            : e === "PercentageofTotalEarnings"
                                            ? calculateDeductionAmountFromTotalEarnings(
                                                Number(
                                                  condition.deducationamountPerMonth
                                                )
                                              )
                                            : condition.deducationamountPerMonth
                                          : condition.deducationamountPerMonth,
                                        calculationTypeId: calculationTypeId,
                                      }
                                    : prevCondition
                                )
                              );
                            }}
                            websiteLink={false}
                            options={calculationTypeGrossPAy}
                            // onSelectChange={(options) =>
                            //   console.log(options, "selected option")
                            // }
                            error={
                              formik.errors.deducations &&
                              formik.errors.deducations[index]
                                ?.deducationcalculationType
                            }
                          />
                        </div>

                        <div className="relative flex flex-col w-full col-span-4 md:col-span-1">
                          <FormInput
                            title={t("Deduction Amount Per Month")}
                            showValueParagraph={true}
                            maxLength={8}
                            placeholder={t("Deduction Amount Per Month")}
                            value={
                              isNaN(condition.value) || condition.value === ""
                                ? "0"
                                : condition.value
                            }
                            change={(e) => {
                              let value = e.replace(/[^0-9.]/g, "");
                              value = parseInt(value);
                              if (isNaN(value)) {
                                value = 0; // Set to 0 if the parsed value is NaN
                              }

                              if (
                                condition.deducationcalculationType ===
                                  "PercentageofBasicPay" &&
                                (value > 100 || value < 0)
                              ) {
                                console.error(
                                  "Invalid input. Please enter a value between 0 and 100."
                                );
                                return;
                              }

                              if (
                                condition.deducationcalculationType ===
                                  "PercentageofTotalEarnings" &&
                                (value > 100 || value < 0)
                              ) {
                                console.error(
                                  "Invalid input. Please enter a value between 0 and 100."
                                );
                                return;
                              }

                              setDeductions((prevEvaluation) =>
                                prevEvaluation.map((prevCondition, i) =>
                                  i === index
                                    ? {
                                        ...prevCondition,
                                        deducationamountPerMonth: e,
                                        value:
                                          prevCondition.deducationcalculationType ===
                                          "Fixed"
                                            ? value
                                            : prevCondition.deducationcalculationType ===
                                              "PercentageofBasicPay"
                                            ? value
                                            : prevCondition.deducationcalculationType ===
                                              "PercentageofTotalEarnings"
                                            ? value
                                            : null,
                                        amount:
                                          prevCondition.deducationcalculationType ===
                                          "Fixed"
                                            ? value
                                            : prevCondition.deducationcalculationType ===
                                              "PercentageofBasicPay"
                                            ? calculateDeductionAmounts(value) /
                                              12
                                            : prevCondition.deducationcalculationType ===
                                              "PercentageofTotalEarnings"
                                            ? calculateDeductionAmountFromTotalEarnings(
                                                value
                                              ) / 12
                                            : null,
                                      }
                                    : prevCondition
                                )
                              );
                            }}
                            className="w-full"
                            error={
                              formik.errors.deducations &&
                              formik.errors.deducations[index]
                                ?.deducationamountPerMonth
                            }
                          />

                          {condition.deducationcalculationType === "Fixed" && (
                            <p className="absolute -bottom-5 pblack">
                              {isNaN(Number(condition.deducationamountPerMonth))
                                ? 0
                                : Number(condition.deducationamountPerMonth) *
                                  12}{" "}
                              Per Annum
                            </p>
                          )}

                          {condition.deducationcalculationType ===
                            "PercentageofBasicPay" && (
                            <p className="absolute -bottom-5 pblack">
                              {isNaN(Number(condition.deducationamountPerMonth))
                                ? 0
                                : calculateDeductionAmounts(
                                    Number(condition.deducationamountPerMonth)
                                  )}{" "}
                              Per Annum
                            </p>
                          )}

                          {condition.deducationcalculationType ===
                            "PercentageofTotalEarnings" && (
                            <p className="absolute -bottom-5 pblack">
                              {isNaN(Number(condition.deducationamountPerMonth))
                                ? 0
                                : calculateDeductionAmountFromTotalEarnings(
                                    Number(condition.deducationamountPerMonth)
                                  )}{" "}
                              Per Annum
                            </p>
                          )}
                        </div>

                        {/* <div>
                            Overall Deduction Amount:{" "}
                            {overallDeductionAmount.totalAmount}
                          </div> */}

                        <div className="flex items-end justify-end col-span-4 md:col-span-1">
                          <div
                            onClick={() =>
                              handleDeleteConditionDeducations(index)
                            }
                            className="text-lg 2xl:text-xl rounded-md size-8 2xl:size-10 vhcenter transition duration-300 hover:bg-red-500 group bg-[#F2F4F7] cursor-pointer"
                          >
                            <Tooltip placement="top" title="Delete">
                              <PiTrash className="text-red-600 group-hover:text-white group-hover:opacity-100 " />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                      {/* <div className="v-divider"></div> */}
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <AddMore
                      name="Add Deductions"
                      className="!text-black"
                      change={(e) => {
                        handleAddConditionDeducations();
                      }}
                    />
                  </div>
                </div>
              </Accordion>
            </FlexCol>

            <div className="flex flex-col w-full">
              <div className="flex items-center justify-end gap-4">
                <p className="font-semibold h2">Gross Pay</p>
                <p className="font-semibold h1">
                  {" "}
                  {isNaN(overallDeductionAmount.monthlyNetEarnings)
                    ? null
                    : overallDeductionAmount.monthlyNetEarnings}
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pblack">
                {isNaN(overallDeductionAmount.netEarnings) ? null : (
                  <p>{overallDeductionAmount.netEarnings}</p>
                )}
                <p>Per Annum</p>
              </div>
            </div>
          </>
        ) : (
          // <div className="flex justify-center w-full">
          //   <FlexCol>
          //     <Heading
          //       title={t("Assign")}
          //       description={t("Assign")}
          //       padding={false}
          //       className="Text_area col-span-2"
          //     />
          //     <div className="flex flex-col gap-6 p-2">
          //       <div className="!rounded-2xl flex flex-col gap-6 ">
          //         {navigateBtn && (
          //           <div className="flex gap-2 p-[6px] bg-[#FAFAFA] dark:bg-secondaryDark border border-black border-opacity-10 rounded-xl flex-wrap">
          //             {navigateBtn?.map((tab) => (
          //               <button
          //                 key={tab.id}
          //                 onClick={() => {
          //                   setAllSelect(false);
          //                   console.log(tab.value);
          //                   setAssignBtnName(tab.value);
          //                   setActiveTab(tab.id);
          //                 }}
          //                 className={`${activeTab === tab.id ? "" : ""
          //                   } text-sm font-medium whitespace-nowrap py-3 px-[18px] relative rounded-lg group`}
          //               >
          //                 {activeTab === tab.id && (
          //                   <motion.div
          //                     layoutId="bubble"
          //                     className="absolute inset-0 z-10 rounded-lg bg-accent"
          //                     transition={{
          //                       type: "spring",
          //                       duration: 0.6,
          //                     }}
          //                   ></motion.div>
          //                 )}
          //                 <span
          //                   className={`${activeTab === tab.id
          //                     ? "relative z-20 text-white"
          //                     : " text-black dark:text-white group-hover:text-primary"
          //                     }`}
          //                 >
          //                   {tab.title}
          //                 </span>
          //               </button>
          //             ))}
          //           </div>
          //         )}
          //         <SearchBox
          //           placeholder="Search Employees"
          //           value={searchValue}
          //           change={(e) => {
          //             console.log(e);
          //             setSarchValue(e);
          //           }}
          //           icon={<LuSearch className="text-[20px]" />}
          //           data={assignBtnName === "employees" && employeeSearchData}
          //           onSearch={(value) => {
          //             console.log(value);
          //             setSearchData(value);
          //           }}
          //         />
          //         <div className="flex flex-col gap-8">
          //           <div className="md:grid md:items-center flex flex-col grid-cols-12 gap-3 py-2 ">
          //             <div className="flex items-center gap-2 justify-between col-span-5">
          //               <div className="flex items-center justify-between">
          //                 <CheckBoxInput
          //                   change={(e) => {
          //                     handleToggleList(0, e);
          //                     setAllSelect(e);
          //                     console.log(e);
          //                   }}
          //                   value={allSelect}
          //                 >
          //                   Select All
          //                 </CheckBoxInput>
          //               </div>
          //               <p className="mb-0 text-sm font-semibold text-accent">
          //                 All Employees-
          //                 {assignBtnName === "employees" &&
          //                   selectedEmployees.length + unmappedEmployees.length}
          //               </p>
          //             </div>
          //             <div className="flex items-center justify-end col-span-7 ">
          //               {allSelect && (
          //                 <div className="flex justify-end items-center text-[12px] font-medium text-accent py-2 px-3 rounded-full bg-[#F9F5FF] dark:bg-dark">
          //                   <p className="mb-0 ">Remove All</p>
          //                   <RxCross2 className=" text-[18px] font-medium pl-1 text-[#9E77ED]" />
          //                 </div>
          //               )}
          //             </div>
          //           </div>

          //           <div className="flex flex-row gap-8">
          //             {/* Column for unmapped employees */}
          //             <div className="flex-1">
          //               <h2>UnSelected Employees</h2>
          //               <List>
          //                 <VirtualList
          //                   data={unmappedEmployees}
          //                   height={400}
          //                   itemHeight={47}
          //                   itemKey="id"
          //                   onScroll={onScroll}
          //                 >
          //                   {(item) => (
          //                     <List.Item
          //                       key={item.id}
          //                       onClick={() => {
          //                         setAssignEmployee([
          //                           ...assignEmployee,
          //                           item.id,
          //                         ]);
          //                       }}
          //                       className="cursor-pointer"
          //                     >
          //                       <CheckBoxInput
          //                         change={(e) => handleToggleList(item.id, e)}
          //                         value={item.assign}
          //                         className="pr-2"
          //                       />
          //                       <List.Item.Meta
          //                         avatar={
          //                           <Avatar

          //                             alt={item.label}
          //                             className="w-12 h-12 mx-2"
          //                           >
          //                             {item.value ? null : item.label.charAt(0).toUpperCase()}
          //                           </Avatar>
          //                         }
          //                         title={
          //                           <a href="https://ant.design">
          //                             {item.label}
          //                           </a>
          //                         }
          //                         description={item.id}
          //                         className="flex items-center"
          //                       />
          //                     </List.Item>
          //                   )}
          //                 </VirtualList>
          //               </List>
          //             </div>

          //             {/* Column for selected employees */}
          //             <div className="flex-1">
          //               <h2>Selected Employees</h2>
          //               <List>
          //                 <VirtualList
          //                   data={selectedEmployees}
          //                   height={400}
          //                   itemHeight={47}
          //                   itemKey="id"
          //                   onScroll={onScroll}
          //                 >
          //                   {(item) => (
          //                     <List.Item
          //                       key={item.id}
          //                       onClick={() => {
          //                         setAssignEmployee(
          //                           assignEmployee.filter(
          //                             (id) => id !== item.id
          //                           )
          //                         );
          //                       }}
          //                       className="cursor-pointer"
          //                     >
          //                       <CheckBoxInput
          //                         change={(e) => handleToggleList(item.id, e)}
          //                         value={item.assign}
          //                         className="pr-2"
          //                       />
          //                       <List.Item.Meta
          //                         avatar={
          //                           <Avatar

          //                             alt={item.label}
          //                             className="w-12 h-12 mx-2"
          //                           >
          //                             {item.value ? null : item.label.charAt(0).toUpperCase()}
          //                           </Avatar>
          //                         }
          //                         title={
          //                           <a href="https://ant.design">
          //                             {item.label}
          //                           </a>
          //                         }
          //                         description={item.id}
          //                         className="flex items-center"
          //                       />
          //                     </List.Item>
          //                   )}
          //                 </VirtualList>
          //               </List>
          //             </div>
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //   </FlexCol>
          // </div>

          <div className="flex justify-center w-full">
            <EmployeeCheck
              title={t("Assign Employees")}
              description={t("Assign")}
              employee={employeeList} //[1,2,3,4]
              // department={departmentList}
              // location={locationList}
              navigateBtn={navigateBtn}
              datas={allEmploylist}
              customData={true}
              assignData={(employee, department, location) => {
                console.log(employee, "employeeData");

                setSelectedEmployeeId(employee);
                // setEmployeeList(employee);
                // setDepartmentList(department);
                // setLocationList(location);
              }}
            />
          </div>
        )}
      </FlexCol>
    </DrawerPop>
  );
}
