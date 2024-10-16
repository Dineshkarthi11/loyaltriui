import React, { useEffect, useRef, useState } from "react";
import TableAnt from "../common/TableAnt";
import API, { action } from "../Api";
import { Button, Checkbox, Dropdown, Flex, Menu } from "antd";
import ButtonClick from "../common/Button";
import FlexCol from "../common/FlexCol";
import { IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { PiCoinsFill, PiUserFill } from "react-icons/pi";
import Lock from "../../assets/images/lock 2.svg";
import Sheet from "../../assets/images/sheets 2.svg";
import ModalImg from "../../assets/images/modalpayroll.png";
import ApprovalImg from "../../assets/images/SalrySlipImg.png";
import { useMediaQuery } from "react-responsive";
import PAYROLLAPI, { Payrollaction } from "../PayRollApi";
import PayrollTableDetails from "../common/PayrollTableDetails";
import Heading from "../common/Heading";
import ModalAnt from "../common/ModalAnt";
import { useNotification } from "../../Context/Notifications/Notification";
import { fetchCompanyDetails } from "../common/Functions/commonFunction";
import PaymentSummary from "./PaymentSummary";
import ModalPayroll from "../common/ModalPayroll";
import { FiSave } from "react-icons/fi";
import FileSaver from "file-saver";
import FormInput from "../common/FormInput";
import DropDWN from "../common/Dropdown";

import employeeone from "../../assets/images/user1.jpeg";
import employetwo from "../../assets/images/user.png";
import employeethree from "../../assets/images/user2.jpeg";
import employeefour from "../../assets/images/Rectangle 328(1).png";
import employeefive from "../../assets/images/Rectangle 328.png";
import reminderimg from "../../assets/images/Reminder.png";
import checkCircle from "../../assets/images/CheckCircle.png";
import { HiPlusSm } from "react-icons/hi";
import { BsInfoCircleFill } from "react-icons/bs";
import PayrollTransactionReview from "./PayrollTransactionReview";
import TransactionApproval from "./TransactionApproval";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function PayrollTable({ refresh = () => {} }) {
  const [fakeReload, setFakeReload] = useState(false);
  const [isPFESIenabled, setIsPFESIenabled] = useState(
    parseInt(localStorageData.pfDetails)
  );
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery({ maxWidth: 1439 });
  const [paymentDrawer, setPayment] = useState(false);

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [PayrollTableList, setPayrollTableList] = useState([]);
  const [updateId, setUpdateId] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [monthYearList, setMonthYearList] = useState([]);
  const [openPop, setOpenPop] = useState("");
  const [salaryTemplateId, setSalaryTemplateId] = useState([]);
  const [employeeName, setEmployeeName] = useState([]);
  const [isSalaryHold, setisSalaryHold] = useState([]);
  const [isSettled, setisSettled] = useState([]);
  const [totalNetPay, setTotalNetPay] = useState(null);
  const [processedPay, setProcessedPay] = useState(null);
  const [totalUnpaid, setTotalUnpaid] = useState(null);
  const [totalUnpaidEmployeeCount, setTotalUnpaidEmployeeCount] =
    useState(null);
  const [selectedEmployeeIdsData, setSelectedEmployeeIdsData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [payrollTableLength, setPayrollTableLength] = useState(null);
  const [key, setKey] = useState([]);
  const [refreshTable, setRefreshTable] = useState(false);
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [functionRender, setFunctionRender] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [tableCount, setTableCount] = useState(null);

  const [departmentList, setDepartmentList] = useState([]);

  const [categorylist, setCategorylist] = useState([]);

  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState([]);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEmployeeData, setCurrentEmployeeData] = useState(null);

  const [dataPerPage, setDataPerPage] = useState(1);

  const [moreData, setMoreData] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const [reminder, setReminder] = useState(false);
  const [transactionReview, setTransactionReview] = useState(false);
  const [transactionApproval, setTransactionApproval] = useState(false);
  const [salaryCalculation, setSalaryCalculation] = useState("monthly");
  const [SalaryCalculationData, setSalaryCalculationData] = useState();
  const disablePagination = true;

  console.log(SalaryCalculationData, "SalaryCalculationData");
  const openModal = () => {
    setIsModalOpen(true);
    fetchDataFromAPIForSelectedEmployess();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setKey([]);
    setRefreshTable((prevState) => !prevState);
  };

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
    setLoggedInEmployeeId(localStorageData.employeeId);
  }, []);
  const [modalVisible, setModalVisible] = useState(false);
  const [payrollSalarySlipModalData, setPayrollSalarySlipModalData] = useState(
    {}
  );

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  const [selectedOption, setSelectedOption] = useState({});
  const [isLiveSalary, setIsLiveSalary] = useState(false);

  console.log(isPFESIenabled, "isEPFenableddataa");
  console.log(typeof isPFESIenabled, "isEPFenableddatatypee");
  useEffect(() => {
    const checkValue = () => {
      if (isNaN(isPFESIenabled)) {
        setIsPFESIenabled(parseInt(isPFESIenabled));
        setFakeReload((prev) => !prev);
      }
    };
    const intervalId = setInterval(checkValue, 1);
    return () => clearInterval(intervalId);
  }, [companyId]);

  const payrollTableListHeader = [
    {
      Payroll_Table: [
        {
          id: 1,
          title: "NAME",
          value: ["employeeName", "code", "paymentmethodname"],
          flexColumn: true,
          logo: true,
          // logoClass: "rounded-md",
          width: 240,
          fixed: "left",
        },
        {
          id: 2,
          title: "BASIC SALARY",
          value: "basicPay",
        },
        {
          id: 3,
          title: "ALLOWANCES",
          value: "totalAllowances",
          width: 120,
        },
        // {
        //   id: 4,
        //   title: "VARIABLE PAY",
        //   value: "variablePay",
        // },

        {
          id: 5,
          title: "GROSS PAY",
          value: "grossSalary",
        },
        {
          id: 19,
          title: "DEDUCTIONS",
          value: "totalDeductions",
        },

        {
          id: 7,
          title: "NET ADDITIONS",
          value: "totalAdditionsAdjustment",
        },

        ...(isPFESIenabled === 0
          ? [
              {
                id: 8,
                title: "SSC",
                value: "SSC",
                width: 120,
              },
            ]
          : []),

        {
          id: 9,
          title: "ARREARS",
          value: "Arrears",
          width: 120,
        },

        {
          id: 10,
          title: "NET DEDUCTIONS",
          value: "totalDeductionsAdjustment",
        },

        {
          id: 11,
          title: "NET SALARY",
          value: "netsalary",
        },

        // {
        //   id: 11,
        //   title: "PAYSLIP",
        //   value: "payslip",
        //   icon: <PiDownloadSimpleBold />,
        //   downloadIcon: true,
        //   width: 120,
        // },

        // {
        //   id: 5,

        //   title: "Action",
        //   value: "action",
        //   action: true,
        //   title: "Action",
        //   value: "action",
        //   action: true,

        //   title: "GROSS PAY",
        //   value: "grossPay",
        // },

        // {
        //   id: 6,
        //   title: "WORK EXPENSES",
        //   value: "workExpenses",
        // },

        // {
        //   id: 7,
        //   title: "NET ADDITIONS",
        //   value: "netAdditions",
        // },

        // {
        //   id: 8,
        //   title: "SSC",
        //   value: "ssc",
        // },

        // {
        //   id: 9,
        //   title: "ARREARS",
        //   value: "arrears",
        // },

        // {
        //   id: 10,
        //   title: "NET DEDUCTIONS",
        //   value: "netDeductions",
        // },
        // {
        //   id: 11,
        //   title: "",
        //   value: "action",
        //   fixed: "right",
        //   // width: 40
        // },

        {
          id: 18,
          title: "",
          value: "action",
          fixed: "right",
          width: 50,
          key: "isSettled",
          valueData: 1,
          dotVerticalDropdown: true,
          dotVerticalDropdownContent: [
            {
              key: "1",
              label: "Salary Hold",
              value: "salaryhold",
              // icon: <PiCreditCardBold/>
            },
            {
              key: "2",
              label: "Salary Release",
              value: "salaryrelease",
              // icon: <PiCreditCardBold/>
            },

            {
              key: "3",
              label: "Download Pay Slip",
              value: "downloadpayslip",
              // icon: <PiCreditCardBold/>
            },
            {
              key: "4",
              label: "View",
              value: "view",
              // icon: <PiCreditCardBold/>
            },
          ],
        },
      ],
    },
  ];

  const handleMenuClick = (e) => {
    setDataPerPage(1);
    const selectedIndex = parseInt(e.key);
    const selectedOptionData = monthYearList[selectedIndex];
    setSelectedOption(selectedOptionData);
  };
  const getCategory = async () => {
    try {
      const result = await action(API.GET_CATEGORY, { companyId: companyId });

      setCategorylist([
        ...result.result.map((each) => ({
          label: each.category,

          value: each.categoryId,
        })),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getDepartment = async () => {
    try {
      const result = await action(API.GET_DEPARTMENT, {
        companyId: companyId,
      });

      setDepartmentList([
        ...result.result.map((each) => ({
          label: each.department,
          value: each.departmentId,
        })),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDepartment();

    getCategory();
  }, []);

  useEffect(() => {
    if (selectedOption && selectedOption.monthYear) {
      console.log(selectedOption.monthYear, "selected monthyear");
    }
  }, [selectedOption]);

  const getGeneralDataBasedOnMonths = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_COMPANY_GENERALDATA_RECORD_BY_MONTHS,
        {
          companyId: companyId,
        }
      );

      if (
        result.status === 200 &&
        result.result &&
        result.result.MonthYearList
      ) {
        const monthYearList = result.result.MonthYearList;
        setMonthYearList(monthYearList);

        // Determine the initial selected option
        const currentDate = new Date();
        const currentMonthYear = `${currentDate.toLocaleString("default", {
          month: "long",
        })} ${currentDate.getFullYear()}`;

        let initialSelectedOption = "";

        // Check if the current month and year is available in the list
        for (let option of monthYearList) {
          if (option.monthYear === currentMonthYear) {
            initialSelectedOption = option;
            break;
          }
        }

        // If the current month and year is not available, select the most recent one
        if (!initialSelectedOption && monthYearList.length > 0) {
          initialSelectedOption = monthYearList[monthYearList.length - 1];
        }

        // Set the initial selected option
        setSelectedOption(initialSelectedOption);

        console.log(initialSelectedOption, "intialldata");
        console.log(selectedOption.monthYear, "selected monthyear");

        // If initial option is available, call getPayrollTable with the initial selected monthYear
        if (initialSelectedOption) {
          // getPayrollTable(initialSelectedOption.monthYear);
        }
      } else {
        console.log("No data found for the given company ID");
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    getGeneralDataBasedOnMonths();
  }, []);

  const handleLiveSalaryToggle = () => {
    const newLiveSalaryState = !isLiveSalary;
    setIsLiveSalary(newLiveSalaryState);
    setSalaryCalculation(newLiveSalaryState ? "live" : "monthly");

    setDataPerPage(1); // Reset pagination
    setPayrollTableList([]); // Clear data
    setIsLoading(true); // Set loading to true

    getPayrollTable(
      selectedOption?.monthYear,
      1,
      10,
      newLiveSalaryState ? "live" : "monthly"
    );
  };

  const changePagination = (e) => {
    const newPage = e.current;
    setDataPerPage(newPage);

    // Pass the correct salaryCalculation state
    getPayrollTable(
      selectedOption?.monthYear,
      "all",
      newPage,
      10,
      salaryCalculation
    );
  };

  const getPayrollTable = async (
    monthYear,
    value,
    pageno = 1,
    limit = 10,
    passedSalaryCalculation = salaryCalculation
  ) => {
    console.log(monthYear, "monthYear");
    console.log(salaryCalculation, "salaryCalculation");
    setMoreData(true);
    setIsLoading(true);
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_COMPANY_GENERAL_PAYROLL_DATA_RECORD_BY_MONTH,
        {
          companyId: companyId,
          salaryPayoutMonthYear: monthYear || null,
          limit: 20,
          pageno: dataPerPage,

          departmentId: selectedDepartmentIds.length
            ? selectedDepartmentIds
            : null,

          categoryId: selectedCategoryIds.length ? selectedCategoryIds : null,
          salaryCalculation: passedSalaryCalculation,
        }
      );

      if (result.status === 200 && result.result) {
        setTableCount(result.count);
        const updatedResult = result.result.map((item) => {
          const actionLabel =
            item.isSalaryHold === 1 ? "Salary Release" : "Salary Hold";
          const actionValue =
            item.isSalaryHold === 1 ? "salaryrelease" : "salaryhold";

          return {
            ...item,
            employeeName: item?.employeeName,
            basicPay: item?.basicPay
              ? Number(item.basicPay.toFixed(2)).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00",
            totalAllowances: item?.totalAllowances
              ? Number(item.totalAllowances.toFixed(2)).toLocaleString(
                  "en-US",
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )
              : "0.00",
            grossSalary: item?.grossSalary
              ? Number(item.grossSalary.toFixed(2)).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00",
            totalWorkExpense: item?.totalWorkExpense
              ? Number(item.totalWorkExpense.toFixed(2)).toLocaleString(
                  "en-US",
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )
              : "0.00",
            totalAdditionsAdjustment: item?.totalAdditionsAdjustment
              ? Number(item.totalAdditionsAdjustment.toFixed(2)).toLocaleString(
                  "en-US",
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )
              : "0.00",
            SSC: item?.SSC
              ? Number(item.SSC.toFixed(2)).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00",
            arrears: item?.Arrears
              ? Number(item.Arrears.toFixed(2)).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00",
            totalDeductionsAdjustment: item?.totalDeductionsAdjustment
              ? Number(
                  item.totalDeductionsAdjustment.toFixed(2)
                ).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00",
            netsalary: item?.netsalary
              ? Number(item.netsalary.toFixed(2)).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00",
            totalDeductions: item?.totalDeductions
              ? Number(item.totalDeductions.toFixed(2)).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )
              : "0.00",
            logo: item?.profilePicture,
            designation: item?.designation,
            code: item?.code,
            salaryCalculation: item?.salaryCalculation,
            salaryMonthYear: monthYear,
            actionLabel: actionLabel,
            actionValue: actionValue,
          };
        });
        console.log(updatedResult, "updated");

        // setPayrollTableList(updatedResult);
        setPayrollTableLength(updatedResult.length);
        setMoreData(true);
        if (value === "all") {
          setPayrollTableList(updatedResult);
        } else {
          setPayrollTableList((prevState) => [...prevState, ...updatedResult]);
        }

        setDataPerPage((prevPage) => prevPage + 1);
        console.log(updatedResult, "payroll table data");
        console.log(updatedResult.length, "payroll table length");
      } else {
        console.log("Failed to fetch data:", result.message);
        setMoreData(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const menu2 = (
    <Menu onClick={handleMenuClick}>
      {monthYearList.map((option, index) => (
        <Menu.Item key={index}>
          <div className="flex items-center gap-2 ml-auto">
            {/* Display the status in lime or gray color based on its value */}
            <div
              className={`${
                option.status === "Closed" ? "bg-gray-500" : "bg-lime-500"
              } min-w-16 px-3 pt-0 pb-0 rounded-md text-white text-xs lg:text-[10px] 2xl:text-xs h-6 vhcenter`}
            >
              {option.status}
            </div>
            {/* Display the `monthYear` value */}
            <div className="text-xs font-bold">{option.monthYear}</div>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  const options = [
    {
      label: "Download Gratuity File",
      value: "downloadGratuityFile",
      icon: Sheet,
    },
    {
      label: "Close Payroll Cycle",
      value: "closePayrollCycle",
      icon: Lock,
    },
    {
      label: "Mass Upload Variable Pays",
      value: "massUploadVariablePays",
      icon: Sheet,
    },
    {
      label: "Mass Upload Additions",
      value: "massUploadAdditions",
      icon: Sheet,
    },
    {
      label: "Mass Upload Deductions",
      value: "massUploadDeductions",
      icon: Sheet,
    },
  ];
  const menu = (
    <Menu>
      {options.map((option) => (
        <Menu.Item key={option.value} icon={<img src={option.icon} alt="" />}>
          {option.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  // Call getPayrollTable whenever the selected option changes
  useEffect(() => {
    if (selectedOption) {
      setDataPerPage(1);
      getPayrollTable(
        selectedOption.monthYear,
        "all",
        1,
        10,
        isLiveSalary ? "live" : "monthly"
      );
      fetchDataFromAPI(selectedOption.monthYear);
    }
  }, [
    selectedOption,
    isLiveSalary,
    selectedDepartmentIds,
    selectedCategoryIds,
  ]);

  const fetchDataFromAPI = async (monthYear) => {
    try {
      const response = await Payrollaction(
        PAYROLLAPI.GET_COMPANY_GENERAL_PAYROLL_DATA_RECORD_MONTHLY_COUNTS,
        {
          companyId: companyId,
          salaryPayoutMonthYear: monthYear,

          departmentId: selectedDepartmentIds.length
            ? selectedDepartmentIds
            : null,

          categoryId: selectedCategoryIds.length ? selectedCategoryIds : null,
        }
      );
      if (response.status === 200 && response.result) {
        // Update the state variables with the data from the API response
        setTotalNetPay(parseFloat(response.result.totalNetPay));
        setProcessedPay(parseFloat(response.result.processedPay));
        setTotalUnpaid(parseFloat(response.result.totalUnpaid));
        setTotalUnpaidEmployeeCount(response.result.totalUnpaidEmployeeCount);
      } else {
        console.error("API error:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch data from API:", error);
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const fetchDataFromAPIForSelectedEmployess = async () => {
    try {
      const response = await Payrollaction(
        PAYROLLAPI.GET_SELECTED_EMPLOYEES_DETAILS_IN_POPUP,

        selectedEmployeeIdsData
      );
      if (response.status === 200 && response.result) {
        setSummaryData(response.result);
        console.log(response.result, "selected employee ids data for popup ");
      } else {
        console.error("API error:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch data from API:", error);
    }
  };

  const saveDataForSelectedEmployessData = async (data) => {
    try {
      const response = await Payrollaction(
        PAYROLLAPI.SAVE_SELECTED_EMPLOYEES_DETAILS_IN_POPUP,

        data || selectedEmployeeIdsData
      );

      if (response.status === 200 && response.result) {
        console.log(response.result, "selected employee ids data for popup ");
        openNotification("success", "Successful", response.message);
        setTimeout(() => {
          closeModal();
          // setFunctionRender(!functionRender);
          // refresh();
          setDataPerPage(1); // Reset pagination to page 1
          getPayrollTable(selectedOption.monthYear, "all", 1);
        }, 1000);
      } else {
        console.error("API error:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch data from API:", error);
    }
  };

  console.log(selectedOption.monthYear, " outside ");

  const handleDownloadClick = (rowData) => {
    console.log("Download payslip for:", rowData);
  };

  const handleSalaryHoldClick = (rowData = null) => {
    const dataToUpdate = rowData
      ? [rowData]
      : selectedEmployeeIdsDataRef.current;

    if (dataToUpdate.length === 0) {
      console.log("No employees selected.");
      return;
    }

    const updatedData = dataToUpdate.map((employee) => ({
      ...employee,
      isSalaryHold: 1,
      payoutMonthYear: null,
      isActive: 1,
      createdBy: loggedInEmployeeId,
      salaryMonthYear: employee.salaryMonthYear,
      SSC: parseFloat(employee.SSC),
      arrears: parseFloat(employee.arrears),
      basicPay: parseFloat(employee.basicPay.replace(/,/g, "")),
      grossSalary: parseFloat(employee.grossSalary.replace(/,/g, "")),
      netsalary: parseFloat(employee.netsalary.replace(/,/g, "")),
      totalAdditionsAdjustment: parseFloat(
        employee.totalAdditionsAdjustment.replace(/,/g, "")
      ),
      totalAllowances: parseFloat(employee.totalAllowances.replace(/,/g, "")),
      // totalDeductions: parseFloat(employee.totalDeductions.replace(/,/g, "")),
      totalDeductionsAdjustment: parseFloat(
        employee.totalDeductionsAdjustment.replace(/,/g, "")
      ),
      totalErnings: parseFloat(employee.totalErnings),
      totalWorkExpense: parseFloat(employee.totalWorkExpense.replace(/,/g, "")),
    }));

    setSelectedEmployeeIdsData(updatedData);
    saveDataForSelectedEmployessData(updatedData);

    if (updatedData[0].salaryMonthYear) {
      console.log(updatedData[0].salaryMonthYear, "Updated month");
      getPayrollTable(updatedData[0].salaryMonthYear);
    }
  };

  // const handleSalaryReleaseClick = (rowData = null) => {
  //   const dataToUpdate = rowData
  //     ? [rowData]
  //     : selectedEmployeeIdsDataRef.current;

  //   if (dataToUpdate.length === 0) {
  //     console.log("No employees selected.");
  //     return;
  //   }

  //   console.log(dataToUpdate,"dataToUpdate")
  //   const updatedData = dataToUpdate.map((employee) => ({
  //     ...employee,
  //     isSalaryHold: 0,
  //     payoutMonthYear: null,
  //     isActive: 1,
  //     createdBy: loggedInEmployeeId,
  //     salaryMonthYear: employee.salaryMonthYear,
  //     SSC: parseFloat(employee.SSC),
  //     arrears: parseFloat(employee.arrears),
  //     basicPay: parseFloat(employee.basicPay.replace(/,/g, "")),
  //     grossSalary: parseFloat(employee.grossSalary.replace(/,/g, "")),
  //     netsalary: parseFloat(employee.netsalary.replace(/,/g, "")),
  //     totalAdditionsAdjustment: parseFloat(
  //       employee.totalAdditionsAdjustment.replace(/,/g, "")
  //     ),
  //     totalAllowances: parseFloat(employee.totalAllowances.replace(/,/g, "")),
  //     // totalDeductions: parseFloat(employee.totalDeductions.replace(/,/g, "")),
  //     totalDeductionsAdjustment: parseFloat(
  //       employee.totalDeductionsAdjustment.replace(/,/g, "")
  //     ),
  //     totalErnings: parseFloat(employee.totalErnings),
  //     totalWorkExpense: parseFloat(employee.totalWorkExpense.replace(/,/g, "")),
  //   }));

  //   setSelectedEmployeeIdsData(updatedData);
  //   mainHandleSalaryReleaseMethod(updatedData);

  //   if (updatedData[0].salaryMonthYear) {
  //     console.log(updatedData[0].salaryMonthYear, "Updated month");
  //     getPayrollTable(updatedData[0].salaryMonthYear);
  //   }
  // };

  console.log(selectedOption.monthYear, "outside");

  const mainHandleSalaryReleaseMethod = async (data) => {
    try {
      const employeeId = data.employeeId;
      const salaryMonthYear = data.salaryMonthYear;
      const currentDate = new Date();
      const payoutMonthYear = currentDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      const response = await Payrollaction(
        PAYROLLAPI.SALARY_RELEASE_FOR_PARTICULAR_EMPLOYEE_BY_ID,
        {
          employeeId: employeeId,
          salaryMonthYear: salaryMonthYear,
          payoutMonthYear: payoutMonthYear,
        }
      );

      if (response.status === 200 && response.result) {
        console.log(response.result, "selected employee ids data for popup ");
        openNotification("success", "Successful", response.message);
        setTimeout(() => {
          setFunctionRender(!functionRender);
          refresh();
          getPayrollTable(selectedOption.monthYear);
        }, 1000);
      } else {
        console.error("API error:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch data from API:", error);
    }
  };

  const selectedEmployeeIdsDataRef = useRef(selectedEmployeeIdsData);

  useEffect(() => {
    selectedEmployeeIdsDataRef.current = selectedEmployeeIdsData;
    console.log(
      "selectedEmployeeIdsDataRef current value:",
      selectedEmployeeIdsDataRef.current
    );
  }, [selectedEmployeeIdsData]);

  useEffect(() => {
    console.log(key, "key....");
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
  const handleDepartmentChange = (departmentId) => {
    if (departmentId === null) {
      setSelectedDepartmentIds([]); // Clear selection for "All Department"
    } else {
      if (selectedDepartmentIds.includes(departmentId)) {
        // Remove department from selection

        setSelectedDepartmentIds(
          selectedDepartmentIds.filter((id) => id !== departmentId)
        );
      } else {
        // Add department to selection

        setSelectedDepartmentIds([...selectedDepartmentIds, departmentId]);
      }
    }
  };

  const handleCategoryChange = (categoryId) => {
    if (categoryId === null) {
      setSelectedCategoryIds([]); // Clear selection for "All Category"
    } else {
      if (selectedCategoryIds.includes(categoryId)) {
        // Remove category from selection

        setSelectedCategoryIds(
          selectedCategoryIds.filter((id) => id !== categoryId)
        );
      } else {
        // Add category to selection

        setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
      }
    }
  };

  const departmentmenu = (
    <Menu>
      <Menu.Item key="all">
        <Checkbox
          checked={selectedDepartmentIds.length === 0}
          onChange={() => handleDepartmentChange(null)}
        >
          All Department
        </Checkbox>
      </Menu.Item>

      {departmentList.map((department) => (
        <Menu.Item key={department.value}>
          <Checkbox
            checked={selectedDepartmentIds.includes(department.value)}
            onChange={() => handleDepartmentChange(department.value)}
          >
            {department.label}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  const categorylistmenu = (
    <Menu>
      <Menu.Item key="all">
        <Checkbox
          checked={selectedCategoryIds.length === 0}
          onChange={() => handleCategoryChange(null)}
        >
          All Category
        </Checkbox>
      </Menu.Item>

      {categorylist.map((category) => (
        <Menu.Item key={category.value}>
          <Checkbox
            checked={selectedCategoryIds.includes(category.value)}
            onChange={() => handleCategoryChange(category.value)}
          >
            {category.label}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  const downloadSalarySlipForEmployeePayroll = async (e) => {
    try {
      console.log(e);
      const employeeId = payrollSalarySlipModalData.employeeId;
      const monthYear = selectedOption.monthYear;

      console.log(selectedOption.monthYear, "selected month year in tableant");

      const formatMonthYear = (monthYear) => {
        const date = new Date(monthYear);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        return `${year}-${month}`;
      };

      const formattedMonthYear = formatMonthYear(monthYear);

      console.log(formattedMonthYear, "formatted month year in tableant");

      const result = await Payrollaction(
        PAYROLLAPI.DOWNLOAD_SALARYSLIP_PARTICULAR_EMPLOYEE,
        {
          employeeId: employeeId,
          companyId: companyId,
          salaryPayoutMonthYear: formattedMonthYear,
        }
      );

      console.log(result.result, "result data for salary slip download");

      // Save the PDF file
      if (result.status === 200) {
        const filename = result.result.filename;
        const filecontent = result.result.filecontent;

        // Decode base64 file content
        const byteCharacters = atob(filecontent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        console.log(byteArray, "dattdaaa");
        const file = new Blob([byteArray], { type: "application/pdf" });

        // Save the file using FileSaver.js
        FileSaver.saveAs(file, filename);
      } else {
        openNotification("error", "Info", result.message);
      }
    } catch (error) {
      openNotification("error", "Info", error.message);
    }
    setModalVisible(false);
  };

  const showModal = (data) => {
    setCurrentEmployeeData(data);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSave = async () => {
    await mainHandleSalaryReleaseMethod(currentEmployeeData);
    setIsModalVisible(false); // Close the modal after saving
  };

  const modalEmployedata = [
    {
      name: "abhi",
      image: employeeone,
      regularise: "pending", //pending
    },
    {
      name: "abhi",
      image: employetwo,
      regularise: "pending",
    },
    {
      name: "abhi",
      image: employeethree,
      regularise: "pending",
    },
    {
      name: "abhi",
      image: employeefour,
      regularise: "pending",
    },
    {
      name: "abhi",
      image: employeefive,
      regularise: "pending",
    },
  ];
  const pendingCount = modalEmployedata.filter(
    (data) => data.regularise === "pending"
  ).length;
  const requestedCount = modalEmployedata.filter(
    (data) => data.regularise === "requested"
  ).length;
  const totalCount = modalEmployedata.length;
  return (
    <FlexCol>
      <Flex justify="space-between">
        <Heading
          title={t("Payroll Table")}
          description={t(
            "Understanding salary variations due to additional deductions or recurring adjustments."
          )}
        />
        <div className="flex items-center gap-2">
          {/* <ButtonClick
            buttonName={t("Payments")}
            BtnType="primary"
            handleSubmit={() => {
              setPayment(true);
              console.log(true);
            }}
          />
          <ButtonClick
            buttonName={t("Download Salary Slip")}
            handleSubmit={() => {
              setShow(true);
              console.log(true);
            }}
            icon={<PiFiles size={20} />}
          /> */}
          {/* <Dropdown overlay={menu} placement="bottomLeft">
            <Button
              className="flex items-center gap-2 ml-auto"
              size={isSmallScreen ? "default" : "large"}
            >
              <div>More Option</div>
              <IoIosArrowDown className="transition-all bg-transparent border-none outline-none 2xl:text-2xl hover:text-primary" />
            </Button>
          </Dropdown> */}
        </div>
      </Flex>

      <div className="flex items-center gap-1 md:gap-2">
        <div>
          <Dropdown overlay={menu2} placement="bottomCenter">
            <Button
              className="flex items-center gap-1 px-1 md:ml-auto md:gap-2"
              size={isSmallScreen ? "default" : "large"}
            >
              {/* Display status with appropriate color */}
              <div
                className={`${
                  selectedOption?.status === "Closed"
                    ? "bg-gray-500"
                    : "bg-lime-500"
                } min-w-16 px-3 pt-0 pb-0 rounded-md text-white text-xs lg:text-[10px] 2xl:text-xs h-full vhcenter`}
              >
                {selectedOption?.status}
              </div>
              {/* Display the formatted `monthYear` value */}
              <div className="text-xs font-bold">
                {selectedOption?.monthYear}
              </div>
              <IoIosArrowDown className="transition-all bg-transparent border-none outline-none hover:text-primary" />
            </Button>
          </Dropdown>
          {/* Render payrollTableList data as needed */}
        </div>

        {/* <div>
            <div className="flex items-center gap-1 md:gap-4">
              <FilterBtn colors={customColors} />
              <Button
                className="flex items-center justify-center h-full gap-2 font-medium bg-white dark:bg-black dark:text-white flex-nowrap"
                size={isSmallScreen ? "default" : "large"}
              >
                <div>Columns</div>
                <FiSettings className="text-base 2xl:text-lg" />
              </Button>
            </div>
          </div> */}
        <Dropdown overlay={departmentmenu} placement="bottomCenter">
          <Button
            className="flex h-full gap-2 font-medium bg-white dark:bg-black dark:text-white flex-nowrap"
            size={isSmallScreen ? "default" : "large"}
          >
            <div>Department</div>
          </Button>
        </Dropdown>

        <Dropdown overlay={categorylistmenu} placement="bottomCenter">
          <Button
            className="flex h-full gap-2 font-medium bg-white dark:bg-black dark:text-white flex-nowrap"
            size={isSmallScreen ? "default" : "large"}
          >
            <div>Category</div>
          </Button>
        </Dropdown>

        <Button
          className={`flex h-full gap-2 font-medium ${
            isLiveSalary
              ? "bg-primary text-white"
              : "bg-white dark:bg-black dark:text-white"
          }`}
          size={isSmallScreen ? "default" : "large"}
          onClick={handleLiveSalaryToggle}
          style={{ transition: "none" }}
        >
          <div>Live Salary</div>
        </Button>
      </div>

      <div className="bg-white borderb py-4 rounded-[10px] w-full h-full dark:bg-black grid grid-cols-12 divide-y xss:divide-y-0 md:divide-x divide-black/10 dark:divide-white/20 items-center">
        <div className="flex flex-col col-span-12 gap-1 px-5 py-5 md:py-0 xss:col-span-6 md:col-span-3">
          <div className="flex items-center gap-2">
            <p className="pblack !text-grey">Total Net Pay for</p>
            <p className="px-2.5 rounded-full text-[11px] py-0.5 text-[#6A4BFC] bg-[#6A4BFC]/10 dark:bg-[#6A4BFC]/20 border border-[#6A4BFC]/40">
              {selectedOption.monthYear}
            </p>
          </div>
          {totalNetPay ? (
            <h1 className="h1 !text-[#6A4BFC] !font-semibold flex gap-1">
              {companyDetails?.currency === "AED"
                ? `${Number(totalNetPay?.toFixed(2) ?? "0.00").toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )} ${companyDetails?.currency}`
                : `${companyDetails?.currency} ${Number(
                    totalNetPay?.toFixed(2) ?? "0.00"
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </h1>
          ) : (
            <h1 className="h1 !text-[#6A4BFC] !font-semibold flex gap-1">
              &#8377; 0.00
            </h1>
          )}
        </div>
        <div className="flex flex-col col-span-12 gap-1 px-5 py-5 md:py-0 xss:col-span-6 md:col-span-3">
          <div className="flex items-center gap-2">
            <p className="pblack !text-grey">Processed till date</p>
            <p className="px-2.5 rounded-full text-[11px] py-0.5 text-[#00BD2A] bg-[#00BD2A]/10 dark:bg-[#00BD2A]/20 border border-[#00BD2A]/40">
              {selectedOption.monthYear}
            </p>
          </div>
          {totalNetPay ? (
            <h1 className="h1 !text-[#00BD2A] !font-semibold flex gap-1">
              {companyDetails?.currency === "AED"
                ? `${Number(processedPay?.toFixed(2) ?? "0.00").toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )} ${companyDetails?.currency}`
                : `${companyDetails?.currency} ${Number(
                    processedPay?.toFixed(2) ?? "0.00"
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </h1>
          ) : (
            <h1 className="h1 !text-[#00BD2A] !font-semibold flex gap-1">
              &#8377; 0.00
            </h1>
          )}
        </div>
        <div className="flex flex-col col-span-12 gap-1 px-5 py-5 md:py-0 xss:col-span-6 md:col-span-3">
          <div className="flex items-center gap-2">
            <p className="pblack !text-grey">Total Unpaid</p>
            <p className="px-2.5 rounded-full text-[11px] py-0.5 text-[#E30000] bg-[#E30000]/10 dark:bg-[#E30000]/20 border border-[#E30000]/40">
              {totalUnpaidEmployeeCount !== null
                ? totalUnpaidEmployeeCount
                : "0"}{" "}
              employees
            </p>
          </div>
          {totalNetPay ? (
            <h1 className="h1 !text-[#E30000] !font-semibold flex gap-1">
              {companyDetails?.currency === "AED"
                ? `${Number(totalUnpaid?.toFixed(2) ?? "0.00").toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )} ${companyDetails?.currency}`
                : `${companyDetails?.currency} ${Number(
                    totalUnpaid?.toFixed(2) ?? "0.00"
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </h1>
          ) : (
            <h1 className="h1 !text-[#E30000] !font-semibold flex gap-1">
              &#8377; 0.00
            </h1>
          )}
        </div>
        <div className="flex flex-col justify-end col-span-12 gap-3 px-5 py-5 md:py-0 xss:col-span-6 md:col-span-3">
          <p className="pblack !text-grey">Review & Submit</p>
          <ButtonClick
            buttonName={t("Submit Transaction")}
            BtnType="primary"
            handleSubmit={openModal}
            disabled={!key.length}
          />
        </div>
      </div>
      {isNaN(isPFESIenabled) ? null : (
        <TableAnt
          disablePagination={disablePagination}
          dataPerPage={dataPerPage}
          isLoadingState={isLoading}
          moreData={moreData}
          data={PayrollTableList}
          header={payrollTableListHeader}
          actionID="employeeId"
          selectedRow={(key, value, e) => {
            console.log(key, "keyy dataa");
            console.log(e, "daa dataa");
            console.log(value, "dataa");
            setKey(e);

            const transformedData = e.map((employee) => ({
              companyId: companyId,
              employeeId: employee.employeeId,
              grossSalary: parseFloat(employee.grossSalary.split(",").join("")),
              payoutMonthYear: selectedOption.monthYear,
              employeeType: employee.employeeType || 0,
              salaryTemplateId: employee.salaryTemplateId,
              totalErnings: employee.totalErnings,
              totalDeductions: employee.totalDeductions,
              totalAdditionsAdjustment: parseFloat(
                employee.totalAdditionsAdjustment.split(",").join("")
              ),
              totalDeductionsAdjustment: parseFloat(
                employee.totalDeductionsAdjustment.split(",").join("")
              ),
              totalWorkExpense: parseFloat(
                employee.totalWorkExpense.split(",").join("")
              ),
              salaryMonthYear: selectedOption.monthYear,
              totalAllowances: selectedOption.allowances || 0,
              isActive: 1,
              createdBy: loggedInEmployeeId,
              netsalary: parseFloat(employee.netsalary.split(",").join("")),
              salaryCalculation: employee.salaryCalculation,
            }));

            console.log(transformedData, "Transformed data");

            setSelectedEmployeeIdsData(transformedData);
            getPayrollTable(selectedOption.monthYear, 1, 10, salaryCalculation);
          }}
          selectedMonthYear={selectedOption.monthYear}
          headerTools={true}
          path={"Payroll_Table"}
          clickDrawer={(showPopup, details, id, data) => {
            console.log(id, details, showPopup, "showPopup");
            console.log(details, "detailssss");

            if (details === "salaryhold") {
              handleSalaryHoldClick(data);
            } else if (details === "salaryrelease") {
              // mainHandleSalaryReleaseMethod(data);
              showModal(data);
            } else if (details === "downloadpayslip") {
              setPayrollSalarySlipModalData(data);
              setModalVisible(true);
            } else if (details === "view") {
              setUpdateId(id);
              setOpenPop(true);
              setSalaryTemplateId(details.salaryTemplateId);
              setEmployeeName(details.employeeName);
              setisSettled(details.isSettled);
              setisSalaryHold(details.isSalaryHold);
              setSalaryCalculationData(details.salaryCalculation);
            }
          }}
          refresh={() => {
            getPayrollTable(selectedOption.monthYear, 1, 10, salaryCalculation);
          }}
          scroll={true}
          scrollXY={[1500, 400]}
          viewOutside={true}
          viewClick={(key, details, showPopup) => {
            console.log(key, details, showPopup, "showPopupdataaaa");
            setUpdateId(key);
            setOpenPop(true);
            setSalaryTemplateId(details.salaryTemplateId);
            setEmployeeName(details.employeeName);
            setisSettled(details.isSettled);
            setisSalaryHold(details.isSalaryHold);
            setSalaryCalculationData(details.salaryCalculation);
          }}
          // handleSalaryHoldClick={handleSalaryHoldClick}
          // handleSalaryReleaseClick={handleSalaryReleaseClick}
          key={refreshTable ? "refresh" : "initial"}
          changePagination={(e) => {
            getPayrollTable(
              selectedOption?.monthYear,
              e?.current,
              e?.pageSize,
              salaryCalculation
            );
          }}
          paginationCount={tableCount}
        />
      )}

      {openPop && (
        <PayrollTableDetails
          open={openPop}
          salaryTemplateId={salaryTemplateId}
          close={(e) => {
            setOpenPop(false);
          }}
          selectedMonthYear={selectedOption.monthYear}
          employeeName={employeeName}
          employeeId={updateId}
          isSettled={isSettled}
          isSalaryHold={isSalaryHold}
          salaryCalculation={SalaryCalculationData}
          refresh={() => {
            getPayrollTable(selectedOption.monthYear);
            console.log(refresh, "refresh completed");
          }}
        />
      )}

      {paymentDrawer && (
        <PaymentSummary
          open={paymentDrawer}
          close={(e) => {
            setPayment(false);
          }}
        />
      )}

      {transactionReview && (
        <PayrollTransactionReview
          open={transactionReview}
          close={(e) => {
            setTransactionReview(false);
          }}
        />
      )}
      {transactionApproval && (
        <TransactionApproval
          open={transactionApproval}
          close={(e) => {
            setTransactionApproval(false);
          }}
        />
      )}
      <ModalPayroll
        isOpen={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        buttonSubmit="Save"
        icon={<FiSave />}
        className="!w-[92%] md:!w-[555px]"
        handleSubmit={downloadSalarySlipForEmployeePayroll}
      >
        <div className="flex flex-col items-center justify-center w-full h-full gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 bg-primaryalpha/10">
              <img
                src={ModalImg}
                alt="modalimg"
                className="object-cover object-center w-full h-full"
              />
            </div>
            <h2 className="h2">Save As</h2>
            <p className="para !font-normal">
              Save pay slip as a your preferred format with a custom name for
              organized record-keeping.
            </p>
          </div>
          <div className="flex items-center justify-between w-full gap-3">
            <FormInput
              title={"Name"}
              placeholder={"Name"}
              value={`${payrollSalarySlipModalData.employeeName || ""} ${
                selectedOption.monthYear || ""
              }`}
              disabled={true}
            />
            <DropDWN
              title={"Extension"}
              className="w-40"
              options={[
                { value: "pdf", label: "PDF" },
                { value: "excel", label: "Excel" },
                { value: "jpg", label: "JPG" },
                { value: "jpeg", label: "JPEG" },
              ]}
              value="pdf"
              disabled={true}
              // change={handleOptionChange}
            />
          </div>
        </div>
      </ModalPayroll>

      {/* <ModalPayroll
          isOpen={isModalOpen}
          onClose={closeModal}
          buttonSubmit="Submit Transaction"
          handleSubmit={saveDataForSelectedEmployessData}
        >
          <div className="flex flex-col items-center justify-center w-full h-full gap-5">
            {summaryData && (
              <>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 bg-primaryalpha/10">
                    <img
                      src={ModalImg}
                      alt="modalimg"
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                  <h2 className="h2">Review & Submit Transaction</h2>
                  <p className="para !font-normal">
                    Save pay slip as a your preferred format with a custom name
                    for organized record-keeping.
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 p-1 border rounded-lg border-primaryalpha/5 bg-primaryalpha/[0.03]">
                    <div className="rounded vhcenter size-10 bg-primaryalpha/10 text-primaryalpha">
                      <PiUserFill size={20} />
                    </div>
                    <div className="flex flex-col leading-none">
                      <p className="text-grey text-xs lg:text-[9px] 2xl:text-xs">
                        Employees
                      </p>
                      <h3 className="h3 !font-semibold">
                        {summaryData.totalEmployees} / {payrollTableLength}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-1 border rounded-lg border-[#FF7A00]/5 bg-[#FF7A00]/[0.03]">
                    <div className="rounded vhcenter size-10 bg-[#FF7A00]/10 text-[#FF7A00]">
                      <PiCoinsFill size={20} />
                    </div>
                    <div className="flex flex-col leading-none">
                      <p className="text-grey text-xs lg:text-[9px] 2xl:text-xs">
                        Total Net Pay
                      </p>
                      <h3 className="h3 !font-semibold">
                        AED {summaryData.totalNetPay.toFixed(2)}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="w-full responsiveTable">
                  <table className="flex flex-row flex-no-wrap w-full">
                    <thead className="text-gray-500 rounded sm:bg-primaryalpha/5 sm:border border-primaryalpha/10">
                      <tr className="flex flex-col mb-2 text-xs xl:text-[9px] 2xl:text-xs uppercase rounded-l-lg flex-no wrap sm:table-row sm:rounded-none sm:mb-0 bg-primaryalpha/10 dark:bg-white/20 sm:bg-transparent dark:sm:bg-transparent">
                        <th className="p-3 font-normal text-left">
                          TRADE LICENSE
                        </th>
                        <th className="p-3 font-normal text-left">
                          PAYMENT METHOD
                        </th>
                        <th className="p-3 font-normal text-left">
                          NUMBER OF EMPLOYEES
                        </th>
                        <th className="p-3 font-normal text-left">NET PAYOUT</th>
                      </tr>
                    </thead>
                    <tbody className="flex-1 sm:flex-none">
                      <tr className="flex flex-col text-xs xl:text-[9px] 2xl:text-xs dark:text-white mb-2 flex-no wrap sm:table-row sm:mb-0 hover:bg-slate-600/5">
                        <td className="p-3">
                          {summaryData.bank.companyTraidLicens}
                        </td>
                        <td className="p-3 truncate">Bank Transfer</td>
                        <td className="p-3 truncate">
                          {summaryData.bank.employeeCount}
                        </td>
                        <td className="p-3 truncate">
                          AED {summaryData.bank.TotalNetPay.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="flex flex-col text-xs xl:text-[9px] 2xl:text-xs dark:text-white mb-2 flex-no wrap sm:table-row sm:mb-0 hover:bg-slate-600/5">
                        <td className="p-3">
                          {summaryData.exchangeHouse.companyTraidLicens}
                        </td>
                        <td className="p-3 truncate">Cash</td>
                        <td className="p-3 truncate">
                          {summaryData.exchangeHouse.employeeCount}
                        </td>
                        <td className="p-3 truncate">
                          AED {summaryData.exchangeHouse.TotalNetPay.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="flex flex-col text-xs xl:text-[9px] 2xl:text-xs dark:text-white mb-2 flex-no wrap sm:table-row sm:mb-0 hover:bg-slate-600/5">
                        <td className="p-3">
                          {summaryData.cash.companyTraidLicens}
                        </td>
                        <td className="p-3 truncate">Cash</td>
                        <td className="p-3 truncate">
                          {summaryData.cash.employeeCount}
                        </td>
                        <td className="p-3 truncate">
                          AED {summaryData.cash.TotalNetPay.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="flex flex-col text-xs xl:text-[9px] 2xl:text-xs dark:text-white mb-2 flex-no wrap sm:table-row sm:mb-0 hover:bg-slate-600/5">
                        <td className="p-3">
                          {summaryData.cheque.companyTraidLicens}
                        </td>
                        <td className="p-3 truncate">Cheque</td>
                        <td className="p-3 truncate">
                          {summaryData.cheque.employeeCount}
                        </td>
                        <td className="p-3 truncate">
                          AED {summaryData.cheque.TotalNetPay.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </ModalPayroll> */}

      <ModalAnt
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // width="435px"
        // showOkButton={true}
        // showCancelButton={false}
        onOk={saveDataForSelectedEmployessData}
        showTitle={false}
        centered={true}
        padding="8px"
        okText={"Submit"}
      >
        <div className="flex flex-col gap-5 md:w-[445px] 2xl:w-[553px] p-2">
          {summaryData && (
            <>
              <div className="flex flex-col items-center gap-2">
                <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 bg-primaryalpha/10">
                  <img
                    src={ModalImg}
                    alt="modalimg"
                    className="object-cover object-center w-full h-full"
                  />
                </div>
                <p className="font-semibold text-[17px] 2xl:text-[19px]">
                  Review & Submit Transaction
                </p>
                <p className="para !font-normal">
                  Save pay slip as a your preferred format with a custom name
                  for organized record-keeping.
                </p>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 p-1 border rounded-lg border-primaryalpha/5 bg-primaryalpha/[0.03]">
                  <div className="rounded vhcenter size-8 bg-primaryalpha/10 text-primaryalpha">
                    <PiUserFill size={20} />
                  </div>
                  <div className="flex flex-col gap-1 leading-none">
                    <p className="text-grey text-xs lg:text-[9px] 2xl:text-xs">
                      Employees
                    </p>
                    <p className="text-xs font-bold 2xl:text-base ">
                      {summaryData.totalEmployees} / {payrollTableLength}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-1 border rounded-lg border-[#FF7A00]/5 bg-[#FF7A00]/[0.03]">
                  <div className="rounded vhcenter size-8 bg-[#FF7A00]/10 text-[#FF7A00]">
                    <PiCoinsFill size={20} />
                  </div>
                  <div className="flex flex-col gap-1 leading-none">
                    <p className="text-grey text-xs lg:text-[9px] 2xl:text-xs">
                      Total Net Pay
                    </p>
                    <h3 className="mt-6 text-xs font-bold 2xl:text-base">
                      {companyDetails?.currency}{" "}
                      {summaryData.totalNetPay.toFixed(2)}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="w-full responsiveTable">
                <table className="flex flex-row flex-no-wrap w-full">
                  <thead className="text-gray-500 rounded sm:bg-primaryalpha/5 sm:border border-primaryalpha/10 h-7">
                    <tr className="flex flex-col mb-2 text-xs xl:text-[9px] 2xl:text-xs uppercase rounded-l-lg flex-no wrap sm:table-row sm:rounded-none sm:mb-0 bg-primaryalpha/10 dark:bg-white/20 sm:bg-transparent dark:sm:bg-transparent">
                      <th className="font-medium text-[10px] 2xl:text-sm">
                        TRADE LICENSE
                      </th>
                      <th className="font-medium text-[10px] 2xl:text-xs">
                        PAYMENT METHOD
                      </th>
                      <th className="font-medium text-[10px] 2xl:text-xs">
                        NUMBER OF EMPLOYEES
                      </th>
                      <th className="font-medium text-[10px] 2xl:text-xs">
                        NET PAYOUT
                      </th>
                    </tr>
                  </thead>
                  <tbody className="flex-1 sm:flex-none">
                    {summaryData.bank && (
                      <tr className="flex flex-col text-[10px] 2xl:text-xs dark:text-white mb-2 flex-no wrap sm:table-row sm:mb-0 hover:bg-slate-600/5">
                        <td className="p-3">
                          {summaryData.bank.companyTraidLicens}
                        </td>
                        <td className="p-3 truncate">Bank Transfer</td>
                        <td className="p-3 text-center truncate ">
                          {summaryData.bank.employeeCount}
                        </td>
                        <td className="p-3 truncate ">
                          {companyDetails?.currency}{" "}
                          {summaryData.bank.TotalNetPay.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {summaryData.exchangeHouse && (
                      <tr className="flex flex-col text-[10px] 2xl:text-xs dark:text-white mb-2 flex-no wrap sm:table-row sm:mb-0 hover:bg-slate-600/5">
                        <td className="p-3">
                          {summaryData.exchangeHouse.companyTraidLicens}
                        </td>
                        <td className="p-3 truncate">Exchange House</td>
                        <td className="p-3 text-center truncate">
                          {summaryData.exchangeHouse.employeeCount}
                        </td>
                        <td className="p-3 truncate">
                          {companyDetails?.currency}{" "}
                          {summaryData.exchangeHouse.TotalNetPay.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {summaryData.cash && (
                      <tr className="flex flex-col text-[10px] 2xl:text-xs dark:text-white mb-2 flex-no wrap sm:table-row sm:mb-0 hover:bg-slate-600/5">
                        <td className="p-3">
                          {summaryData.cash.companyTraidLicens}
                        </td>
                        <td className="p-3 truncate">Cash</td>
                        <td className="p-3 text-center truncate">
                          {summaryData.cash.employeeCount}
                        </td>
                        <td className="p-3 truncate">
                          {companyDetails?.currency}{" "}
                          {summaryData.cash.TotalNetPay.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {summaryData.cheque && (
                      <tr className="flex flex-col text-[10px] 2xl:text-xs dark:text-white mb-2 flex-no wrap sm:table-row sm:mb-0 hover:bg-slate-600/5">
                        <td className="p-3">
                          {summaryData.cheque.companyTraidLicens}
                        </td>
                        <td className="p-3 truncate">Cheque</td>
                        <td className="p-3 text-center truncate">
                          {summaryData.cheque.employeeCount}
                        </td>
                        <td className="p-3 truncate">
                          {companyDetails?.currency}{" "}
                          {summaryData.cheque.TotalNetPay.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {summaryData.bankWIthoutWPS && (
                      <tr className="flex flex-col text-[10px] 2xl:text-xs dark:text-white mb-2 flex-no wrap sm:table-row sm:mb-0 hover:bg-slate-600/5">
                        <td className="p-3">
                          {summaryData.bankWIthoutWPS.companyTraidLicens}
                        </td>
                        <td className="p-3 truncate">Bank without WPS</td>
                        <td className="p-3 text-center truncate">
                          {summaryData.bankWIthoutWPS.employeeCount}
                        </td>
                        <td className="p-3 truncate">
                          {companyDetails?.currency}{" "}
                          {summaryData.bankWIthoutWPS.TotalNetPay.toFixed(2)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </ModalAnt>

      <ModalAnt
        // isVisible={isModalOpen}
        // onClose={() => setIsModalOpen(false)}
        // width="435px"
        // showOkButton={true}
        // showCancelButton={false}
        onOk={saveDataForSelectedEmployessData}
        showTitle={false}
        centered={true}
        padding="8px"
        showOkButton={false}
        showCancelButton={false}
        customButton={
          <div className="flex flex-col w-full gap-2">
            <div className="grid grid-cols-2 w-full gap-3">
              <ButtonClick
                className="w-full"
                buttonName={`${
                  reminder == true ? "Sent Successfully!!" : "Send Reminder"
                }`}
                handleSubmit={() => {
                  setReminder(true);
                }}
                icon={
                  <img
                    src={reminder == true ? checkCircle : reminderimg}
                    alt="emoji"
                    className="size-5 2xl:size-6 shrink-0"
                  />
                }
              />
              {/* <ButtonClick
                className="w-full"
                buttonName="Sent Successfully!!"
                icon={<img
                  src={checkCircle}
                  alt="emoji"
                  className="size-7 2xl:size-6 shrink-0"
                />}
              /> */}
              {pendingCount == totalCount ? (
                <ButtonClick
                  BtnType="primary"
                  className="w-full"
                  buttonName={"View Details"}
                  handleSubmit={() => {
                    setTransactionApproval(true);
                  }}
                />
              ) : (
                <ButtonClick
                  BtnType="primary"
                  className="w-full"
                  buttonName={`Continue with ${requestedCount}`}
                  handleSubmit={() => {
                    setTransactionReview(true);
                  }}
                />
              )}
            </div>
            <div className="flex items-center gap-1 m-auto">
              <BsInfoCircleFill className="text-base text-grey" />
              <p className="text-grey text-[10px] 2xl:text-xs">
                reminder will send to those who are able to approve requests
              </p>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-5 md:w-[445px] 2xl:w-[553px] p-2">
          {summaryData && (
            <>
              <div className="flex flex-col items-center gap-2">
                <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 bg-primaryalpha/10">
                  <img
                    src={ApprovalImg}
                    alt="modalimg"
                    className="object-cover object-center w-full h-full"
                  />
                </div>
                <p className="font-semibold text-sm 2xl:text-base text-center">
                  Approvals Pending for SelectedEmployees!!
                </p>
                <p className="text-[10px] 2xl:text-xs text-center text-grey">
                  Some employee requests are pending approval. You can send
                  reminders or proceed with approved transactions.
                </p>
              </div>
              <div className="flex gap-3 flex-col m-auto">
                {pendingCount == totalCount ? (
                  <p className="text-xs 2xl:text-sm text-red-500">
                    Approvals pending for{" "}
                    <span className="font-semibold">{pendingCount}</span>{" "}
                    employees
                  </p>
                ) : (
                  <p className="text-xs 2xl:text-sm text-red-500">
                    Approvals pending for
                    <span className="font-semibold">
                      {" "}
                      {pendingCount} out of {totalCount}
                    </span>{" "}
                    employees
                  </p>
                )}
                <div className="text-center flex m-auto gap-3 items-center">
                  <div className="flex -space-x-3 rtl:space-x-reverse">
                    {modalEmployedata?.slice(0, 3).map((data, index) => (
                      <div
                        key={index}
                        className="overflow-hidden bg-white border border-white rounded-full size-8"
                      >
                        <img
                          className="object-cover object-center w-full h-full"
                          src={data.image}
                          alt=""
                          title={data.name}
                        />
                      </div>
                    ))}
                    {modalEmployedata.length > 3 && (
                      <>
                        <div className="flex items-center justify-center p-1 overflow-hidden text-center bg-[#E6E5FF] border border-white rounded-full size-8 ">
                          <HiPlusSm className="text-sm text-primaryalpha" />
                          <p className=" text-[10px] font-semibold text-primaryalpha">
                            {modalEmployedata.length - 3}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="v-divider !h-4" />
                  <div>
                    <p className="text-[10px] 2xl:text-xs text-primaryalpha font-medium underline cursor-pointer">
                      View details
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ModalAnt>

      <ModalAnt
        isVisible={isModalVisible}
        centered={true}
        padding="8px"
        onClose={handleCancel}
        onOk={handleSave}
        okText={"Submit"}
      >
        <div className="flex flex-col gap-5 md:w-[445px] 2xl:w-[553px] p-2">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 bg-primaryalpha/10">
              <img
                src={ModalImg}
                alt="modalimg"
                className="object-cover object-center w-full h-full"
              />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              Confirm Salary Release
            </p>
            <p className="text-grey text-[10px] 2xl:text-xs">
              This will process the employee's held salary.
            </p>
            <p className="text-grey text-[10px] 2xl:text-xs">
              Are you sure you want to proceed?
            </p>
          </div>
        </div>
      </ModalAnt>
    </FlexCol>
  );
}
