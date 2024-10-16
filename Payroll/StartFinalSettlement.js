import React, { useEffect, useState } from "react";
import DrawerPop from "../common/DrawerPop";
import Stepper from "../common/Stepper";
import { useTranslation } from "react-i18next";
import { BsInfoCircle } from "react-icons/bs";
import Accordion from "../common/Accordion";
import { RiCalendarLine, RiDownload2Line } from "react-icons/ri";
import {
  PiCalendarBlank,
  PiPencilSimpleLight,
  PiCalendarCheck,
  PiCalendarX,
  PiClockCountdownLight,
  PiCoinsBold,
} from "react-icons/pi";
import Heading2 from "../common/Heading2";
import FormInput from "../common/FormInput";
import ButtonClick from "../common/Button";
import { Flex, Tooltip } from "antd";
import FlexCol from "../common/FlexCol";
import ModalPayroll from "../common/ModalPayroll";

import maternityImg from "../../assets/images/LeaveBalanceImages/primary/maternity-primary.png";
import maternityImg1 from "../../assets/images/LeaveBalanceImages/theme/maternity-theme.png";
import img1 from "../../assets/images/payrollFinalSettlement/img1.svg";
import img2 from "../../assets/images/payrollFinalSettlement/img2.svg";
import API, { action } from "../Api";
import PAYROLLAPI, { Payrollaction } from "../PayRollApi";
import { useFormik } from "formik/dist";
import Avatar from "../common/Avatar";
import { useNotification } from "../../Context/Notifications/Notification";
import { fetchCompanyDetails } from "../common/Functions/commonFunction";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function StartFinalSettlement({
  open,
  close = () => {},
  updateId,
  offBoardingId,
  refresh = () => {},
}) {
  console.log(updateId, "updateId");
  const { t } = useTranslation();
  const primaryColor = localStorageData.mainColor;
  const [show, setShow] = useState(open);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBtnValue, setActiveBtnValue] = useState("leavedetails"); //leavedetails // gratuity // loandetails // overview
  const [presentage, setPresentage] = useState(0);
  const [nextStep, setNextStep] = useState(0);
  const [activeBtn, setActiveBtn] = useState(0);
  const [inputshow, setInputshow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState("");
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [leaveData, setLeaveData] = useState([]);
  const [employeeId, setemployeeId] = useState(localStorageData.employeeId);

  const [employedetails, setEmployedetails] = useState([]);
  const [gratuity, setGratuity] = useState([]);
  const [totalgratuity, setTotalgratuity] = useState("");
  const [leavingDate, setLeavingdate] = useState("");
  const [EarningsData, setEarningsData] = useState([]);
  const [DeductionData, setDeductionData] = useState([]);
  const [totalearnings, setTotalearnings] = useState("");
  const [totaldeduction, setTotalDeduction] = useState("");
  const [joiningDate, setJoinigDate] = useState("");
  const [totalPayable, setTotalPayable] = useState("");
  const [leavedataMessage, setleavedataMessage] = useState("");
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loan, setLoan] = useState();
  const [totalLop, setTotalLop] = useState("");

  const [totalLopdedduction, setTotalLopDeduction] = useState("");

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);

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
    close(false);
  };

  const inputshowbutton = (id) => {
    const check = leavebalanceData.find((data) => data.leaveTypeId === id);
    setDemo(check);
    setInputshow(true);
  };

  const handleInputChange = (e, id) => {
    const value = e;
    setLeaveData((prevLeaveData) => {
      const existingItemIndex = prevLeaveData.findIndex(
        (item) => item.leaveTypeId === id
      );

      if (existingItemIndex !== -1) {
        // Update the existing item
        const updatedLeaveData = prevLeaveData.map((item, index) =>
          index === existingItemIndex
            ? { ...item, leaveBalanceAmount: value }
            : item
        );
        return updatedLeaveData;
      } else {
        // Add a new item
        const leaveBalanceCount =
          leavebalanceData.find((item) => item.leaveTypeId === id)
            ?.leaveBalanceCount || 0;
        return [
          ...prevLeaveData,
          {
            leaveTypeId: id,
            leaveBalanceCount,
            leaveBalanceAmount: value,
            createdBy: employeeId,
          },
        ];
      }
    });
    setleavebalanceData((prevData) => {
      return prevData.map((item) =>
        item.leaveTypeId === id ? { ...item, leaveBalanceAmount: value } : item
      );
    });
  };

  useEffect(() => {}, [leaveData]);
  const openModal = () => {
    setIsModalOpen(true);
    //fetch data here
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

  const [steps, setSteps] = useState([
    {
      id: 1,
      value: 0,
      title: t("Leave Details"),
      data: "leavedetails",
    },
    {
      id: 2,
      value: 1,
      title: "Gratuity Calculation",
      data: "gratuity",
    },
    {
      id: 3,
      value: 2,
      title: t("Loan Details"),
      data: "loandetails",
    },
    {
      id: 4,
      value: 3,
      title: t("Overview"),
      data: "overview",
    },
  ]);
  const [leavebalanceData, setleavebalanceData] = useState([]);
  // const leavebalanceData = [
  //   {
  //     id: 1,
  //     img: primaryColor === "#EE2E5E" ? sickImg1 : sickImg,
  //     title: "Sick Leave",
  //     leaveAssigned: "03",
  //     remainLeaves: "02",
  //   },
  //   {
  //     id: 2,
  //     img: primaryColor === "#EE2E5E" ? vacationImg1 : vacationImg,
  //     title: "Vacations",
  //     leaveAssigned: "03",
  //     remainLeaves: "02",
  //   },
  //   {
  //     id: 3,
  //     img: primaryColor === "#EE2E5E" ? casualImg1 : casualImg,
  //     title: "Casual Leave",
  //     leaveAssigned: "03",
  //     remainLeaves: "02",
  //   },
  //   {
  //     id: 4,
  //     img: primaryColor === "#EE2E5E" ? maternityImg1 : maternityImg,
  //     title: "Maternity",
  //     leaveAssigned: "30",
  //     remainLeaves: "15",
  //   },
  //   {
  //     id: 5,
  //     img: primaryColor === "#EE2E5E" ? comboImg1 : comboImg,
  //     title: "Combo Off",
  //     leaveAssigned: "03",
  //     remainLeaves: "02",
  //   }
  // ];
  // const employedetails = [
  //   {
  //     id: 1,
  //     // profile: profile,
  //     // name: "Alexander paul",
  //     // joiningdate: "05/10/2021",
  //     // leavingdate: "6/7/2024",
  //     // designation: "UI UX Designer",
  //     // empid: 23568,
  //      employeeId:1,
  //       employeeName:"Alexander paul",
  //       profilePicture:profile,
  //       designation:"UI UX Designer",
  //       joiningDate:"05/10/2021",
  //       leavingDate:"6/7/2024"

  //   }
  // ]

  const LoanData = [
    {
      id: 1,
      Loan: "Loan Name",
      status: "Open",
      description: "lorem ipsum dummy text dolar sit.",
      detail: {
        Approved_By: "Addison Meyer",
        Disbursement_Date: "20 may 2024",
        Loan_Name: "Loan Name",
        Description: "lorem ipsum dummy text dolar sit.",
        principal: "AED 2000",
        Annual_Interest_Rate: "1%",
        Total_Paid_Instalment: "AED 0.00",
        Tenure: "22 Months",
        Completion: "10/22 Months",
        Remaining_principal: "AED 1,20,000",
        Remaining_Instalment: "AED 1,20,000",
        Deduct_from_final_settlement: "Button",
      },
    },
    {
      id: 2,
      Loan: "Loan Name",
      status: "Closed",
      description: "lorem ipsum dummy text dolar sit.",
      detail: {
        Approved_By: "Addison Meyer",
        Disbursement_Date: "20 may 2024",
        Loan_Name: "Loan Name",
        Description: "lorem ipsum dummy text dolar sit.",
        principal: "AED 2000",
        Annual_Interest_Rate: "1%",
        Total_Paid_Instalment: "AED 0.00",
        Tenure: "22 Months",
        Completion: "10/22 Months",
        Remaining_principal: "AED 1,20,000",
        Remaining_Instalment: "AED 1,20,000",
        Close_Date: "31 mar 2026",
      },
    },
  ];

  const dateData = [
    {
      id: 1,
      icon: <PiCalendarBlank className="w-4.5 h-4.5" />,
      text: "Salary Month",
      date: "May 2024",
    },
    {
      id: 2,
      icon: <PiClockCountdownLight className="w-4.5 h-4.5" />,
      text: "Working Days",
      date: "23",
      text2: "days",
    },
    {
      id: 3,
      icon: <PiCalendarCheck className="w-4.5 h-4.5" />,
      text: "Present Days",
      date: "23",
      text2: "days",
    },
    {
      id: 4,
      icon: <PiCalendarX className="w-4.5 h-4.5" />,
      text: "Present Days",
      date: "0",
      text2: "days",
    },
  ];

  const Gratuity_calculation = [
    {
      id: 1,
      fromdate: "1/06/2008",
      todate: "1/06/2008",
      grat_year_amount: "5 YRS / AED 7000.00",
      grat_month_amount: "0 MNTHS / AED 00.00",
      grat_day_amount: "0 DAYS / AED 00.00",
      basic_pay: "AED 2000.00",
      percentage: "100%",
      lop_dduction: "0 DAYS / AED 00.00",
      total_amount: "AED 35678.00",
      bgColor: "bg-[#FFF9EB]",
      textColor: "text-[#E1A200]",
    },
    {
      id: 2,
      fromdate: "1/06/2013",
      todate: "23/05/2024",
      grat_year_amount: "10 yrs/ AED 20,000.00",
      grat_month_amount: "11 Mnths/ AED 1833.00",
      grat_day_amount: "13 days/ AED 125.94",
      basic_pay: "AED 2000.00",
      percentage: "100%",
      lop_dduction: "12 days / AED 6573.00",
      total_amount: "AED 21893.54",
      to_be_paid: "AED 21893.54",
      bgColor: "bg-[#F2FBFF]",
      textColor: "text-[#007DB6]",
    },
  ];

  // const EarningsData = [
  //   {
  //     Basic_Pay: "AED 1533.00",
  //     HRA: "AED 2793.00",
  //     Other: "AED 2133.00",
  //     VAL: "AED 268.00",
  //     SPAL: "---",
  //     CON: "---",
  //     Gratuity: "AED 28894",
  //     Leave_salary: "AED 00.00",
  //   }
  // ]

  // const DeductionData = [
  //   {
  //     LOP_Amount: "AED 1533.00",
  //     VAD: "AED 2793.00",
  //     Other_Deduction: "AED 2133.00",
  //     ADVA: "AED 268.00",
  //     Loan_Deduction: "AED 12000.00",
  //     Loan: "AED 28894",
  //     Pro_Expense: "AED 28894",
  //     Labour_Expense: "----",
  //   }
  // ]

  useEffect(() => {
    // console.log(nextStep, activeBtn);
    if (activeBtn < 4 && activeBtn !== nextStep) {
      /// && activeBtn !== nextStep
      setActiveBtn(1 + activeBtn);
      // setNextStep(nextStep);
      // console.log(1 + activeBtn);
      // console.log(steps?.[activeBtn + 1].data, "data");
      setActiveBtnValue(steps?.[activeBtn + 1].data);
    }
  }, [nextStep]);

  const getemployeeloan = async () => {
    try {
      const result = await Payrollaction(PAYROLLAPI.Employee_Final_Loan, {
        companyId: parseInt(companyId),
        employeeId: updateId,
      });

      const { openLoans, closedLoans } = result.result;

      const transformedLoanData = loanDataTransformer(openLoans, closedLoans);

      setLoan(transformedLoanData);
    } catch (error) {
      return error;
    }
  };

  const loanDataTransformer = (openLoans, closedLoans) => {
    const formatLoan = (loan, isClosed = false) => ({
      id: Math.random(), // generate a unique ID (or you can customize it)
      Loan: loan.loanName,
      status: isClosed ? "Closed" : "Open",
      description: loan.description,
      detail: {
        Approved_By: loan.approvedBy,
        Disbursement_Date: loan.disbursementDate,
        Loan_Name: loan.loanName,
        Description: loan.description,
        principal: `AED ${loan.principal}`,
        Annual_Interest_Rate: `${loan.interestRate}%`,
        Total_Paid_Instalment: `AED ${loan.totalPaidInstallement}`,
        Tenure: `${loan.tenure} Months`,
        Completion: loan.complition,
        Remaining_principal: `AED ${loan.remainingPrincipal}`,
        Remaining_Instalment: `AED ${loan.remainingInstallement}`,
        ...(isClosed
          ? { Close_Date: loan.closeDate || "N/A" } // Add close date if loan is closed
          : { Deduct_from_final_settlement: "Button" }),
      },
    });

    const transformedOpenLoans = openLoans.map((loan) =>
      formatLoan(loan, false)
    );
    const transformedClosedLoans = closedLoans.map((loan) =>
      formatLoan(loan, true)
    );

    return [...transformedOpenLoans, ...transformedClosedLoans];
  };
  useEffect(() => {
    getemployeeloan();
  }, [activeBtnValue === "loandetails"]);

  const getemployeeFinalLeaveEncashment = async () => {
    console.log("hhhh");
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_FINALSETTLEMENT_employeeFinalLeaveEncashment,
        {
          companyId: parseInt(companyId),
          employeeId: updateId,
        }
      );

      setleavebalanceData(
        result.result.leaveBalanceData.map((items) => ({
          leaveTypeId: items.leaveTypeId,
          leaveName: items.leaveName,
          img: primaryColor === "#EE2E5E" ? maternityImg1 : maternityImg,
          leaveAssignedCount: items.leaveAssignedCount,
          leaveBalanceCount: items.leaveBalanceCount,
          leaveBalanceAmount: items.leaveBalanceAmount,
        }))
      );
      const personalInfo = [result.result.personalInfo];

      setLeavingdate(result.result.personalInfo.leavingDate);

      setEmployedetails(
        personalInfo.map((employee) => ({
          employeeId: employee.employeeId,
          employeeName: employee.employeeName,
          profilePicture: employee.profilePicture,
          designation: employee.designation,
          joiningDate: employee.joiningDate,
          leavingDate: employee.leavingDate,
        }))
      );
      setJoinigDate(result.result.personalInfo.joiningDate);
      if (result.status === 200) {
        setleavedataMessage(result.message);
      } else if (result.status === 500) {
        setleavedataMessage(result.message);
      }
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    getEmployeegrativity();
  }, [activeBtnValue === "gratuity"]);

  const formik = useFormik({
    initialValues: {
      companyId: "",
      employeeId: updateId,
    },
    onSubmit: async () => {
      setLoading(true);
      try {
        if (leavebalanceData.length > 0) {
          const response = await Payrollaction(
            PAYROLLAPI.SAVE_employeeFinalLeaveEncashmentSave,
            {
              companyId: companyId,
              employeeId: updateId,
              leaveData: leaveData,
            }
          );

          if (response.status === 200) {
            openNotification("success", "Successful", response?.message);
            setNextStep(nextStep + 1);
            setLoading(false);
          } else {
            openNotification("error", "Info", response?.message);
            setLoading(false);
          }
        } else {
          setNextStep(nextStep + 1);
          setLoading(false);
          setPresentage(presentage + 1);
        }
      } catch (error) {
        setLoading(false);
        return error;
      }
    },
  });
  const getEmployeegrativity = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYEE_FINAL_GRATIVITY,
        {
          companyId: companyId,
          employeeId: updateId,
        }
      );
      // "totalLOPcount": 0,
      // "totalLOPdeduction": 0,
      // "totalGratuity": 8160
      // const Array = [response.result]
      setTotalLop(result.result.totalLOPcount);

      setTotalLopDeduction(result.result.totalLOPdeduction);
      const gratuityData = result.result.gratuityData;

      const Gratuity_calculation = gratuityData.flatMap((item, index) => {
        const { slabStart, slabEnd, LOPcount, periodGratuity, revisions } =
          item;

        const grat_year_amount = periodGratuity.years;
        const grat_month_amount = periodGratuity.months;
        const grat_day_amount = periodGratuity.days;

        const lop_dduction = `${LOPcount} DAYS / ${
          companyDetails?.currency
        } ${item.LOPdeduction.toFixed(2)}`;

        return revisions.map((revision, revIndex) => {
          const basic_pay = `${companyDetails?.currency} ${parseFloat(
            revision.basicSalary
          ).toFixed(2)}`;
          const total_amount = `${
            companyDetails?.currency
          } ${revision.revisionGratuity.toFixed(2)}`;

          return {
            id: index + 1 + revIndex, // Generate unique ID considering the revision index
            fromdate: new Date(revision.start).toLocaleDateString("en-GB"),
            todate: new Date(revision.end).toLocaleDateString("en-GB"),
            grat_year_amount,
            grat_month_amount,
            grat_day_amount,
            basic_pay,
            percentage: "100%",
            lop_dduction,
            total_amount,
            bgColor: "bg-[#FFF9EB]",
            textColor: "text-[#E1A200]",
          };
        });
      });
      setGratuity(Gratuity_calculation);
      setTotalgratuity(result.result.totalGratuity);
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    getemployeeFinalLeaveEncashment();
  }, [show]);

  const getEmployeefinalsummery = async () => {
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_EMPLOYEE_FINALSUMMERY, {
        companyId: companyId,
        employeeId: updateId,
      });
      setEarningsData(
        result.result.earnings.map((items) => ({
          id: items.id,
          type: items.type,
          name: items.name,
          amount: items.amount,
        }))
      );
      setDeductionData(
        result.result.deductions.map((items) => ({
          id: items.id,
          type: items.type,
          name: items.name,
          amount: items.amount,
        }))
      );
      setTotalearnings(result.result.totalErnings);
      setTotalDeduction(result.result.totalDeductions);
      setTotalPayable(result.result.TotalPayable);
    } catch (error) {
      return error;
    }
  };
  const formik2 = useFormik({
    initialValues: {
      companyId: "",
      employeeId: "",
      leavingDate: "",
      totalLOPcount: "",
      totalLOPdeduction: "",
      totalGratuity: "",
      createdBy: "",
    },
    onSubmit: async () => {
      setLoading(true);

      try {
        if (gratuity.length > 0) {
          const response = await Payrollaction(
            PAYROLLAPI.SAVE_EMPLOYEE_FINAL_GRATUITY,
            {
              companyId: companyId,
              employeeId: updateId,
              leavingDate: leavingDate,
              totalLOPcount: totalLop,
              totalLOPdeduction: totalLopdedduction,
              totalGratuity: totalgratuity,
              createdBy: employeeId,
            }
          );
          if (response.status === 200) {
            // openNotification("success", "Successful", response?.message);
            openNotification(
              "success",
              "Successful",
              "Gratuity Calculation added successfully"
            );
            setNextStep(nextStep + 1);
            setLoading(false);
            setPresentage(presentage + 1);
          } else {
            setLoading(false);
            openNotification("error", "Failed", response?.message);
          }
        } else {
          setNextStep(nextStep + 1);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        return error;
      }
    },
  });
  const UpdateEmployeeStatus = async () => {
    try {
      const result = await action(API.UPDATE_EMPLOYEE_STATUS_OFFBAORDING, {
        employeeId: updateId,
        offBoardingId: offBoardingId,
        offBoardingStatusId: 4,
      });
    } catch (error) {
      return error;
    }
  };
  const handleSummarySave = async () => {
    try {
      const response = await Payrollaction(
        PAYROLLAPI.SAVE_EMPLOYEE_FINAL_SUMMARY,
        {
          companyId: companyId,
          employeeId: updateId,
          joiningDate: joiningDate,
          leavingDate: leavingDate,
          createdBy: employeeId,
          earnings: EarningsData,
          deductions: DeductionData,
          totalErnings: totalearnings,
          totalDeductions: totaldeduction,
          TotalPayable: totalPayable,
        }
      );
      if (response.status === 200) {
        UpdateEmployeeStatus();
        openNotification("success", "Successful", response?.message);
        refresh(true);
        handleClose();
      } else {
        openNotification("error", "Info", response?.message);
      }
    } catch (error) {
      return error;
    }
  };

  // const roundedAmnt = Math.round(totalPayable);

  // const roundedTotalEarnings =
  //   parseFloat(roundedAmnt).toFixed(2) - parseFloat(totalPayable).toFixed(2);

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
        close(e);
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
        // background:"#F8FAFC"
      }}
      handleSubmit={(e) => {
        // saveEmployeePunchInMethod();
      }}
      buttonClick={(e) => {
        // formik.handleSubmit()
        switch (activeBtnValue) {
          case "leavedetails":
            formik.handleSubmit();
            // setNextStep(nextStep+1)
            // getEmployeegrativity()
            break;
          case "gratuity":
            // formik.handleSubmit()

            formik2.handleSubmit();
            setPresentage(presentage + 1);
            break;
          case "loandetails":
            setNextStep(nextStep + 1);
            getEmployeefinalsummery();
            setPresentage(presentage + 1);
            break;

          default:
            handleSummarySave();
        }
        // setNextStep(nextStep+1)
      }}
      // updateBtn={isUpdate}
      // updateFun={() => {}}
      header={[
        t("Offboarding-Final Settlement"),
        t("Manage you companies here"),
      ]}
      buttonClickCancel={(e) => {
        if (activeBtn > 0) {
          setActiveBtn(activeBtn - 1);
          setPresentage(presentage - 1);
          setNextStep(nextStep - 1);
          setActiveBtnValue(steps?.[activeBtn - 1].data);
          console.log(activeBtn - 1);
        }
      }}
      stepsData={steps}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
      nextStep={nextStep}
      activeBtn={activeBtn}
      saveAndContinue={true}
    >
      <FlexCol className={"max-w-[1092px] mx-auto"}>
        {steps && (
          <Flex justify="center">
            <div className="sticky z-50 w-full px-5 pb-6 top-6">
              <Stepper
                steps={steps}
                currentStepNumber={activeBtn}
                presentage={presentage}
              />
            </div>
          </Flex>
        )}
        <div className="flex flex-col gap-10  mt-3">
          {activeBtnValue === "leavedetails" ? (
            <div className="box-wrapper flex flex-col gap-6">
              {employedetails?.map((item, index) => (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between ">
                    <div className="flex gap-2 items-center">
                      <Avatar
                        className="size-10 2xl:size-14 border-2 border-white shadow-md"
                        textClassName="text-lg 2xl:text-xl"
                        image={item.profilePicture}
                        name={item?.employeeName}
                      />
                      <span className="flex flex-col dark:text-white">
                        <div className="flex items-center gap-2">
                          <h1 className="font-semibold text-base 2xl:text-lg">
                            {item.employeeName}
                          </h1>
                          <p className=" text-primary bg-primaryalpha/10 dark:bg-primaryalpha/30 text-xs 2xl:text-sm	rounded-2xl font-medium px-3 py-1 vhcenter min-w-[118px] min-h-5	">
                            EMP ID:#{item.employeeId}
                          </p>
                        </div>
                        <p className="font-medium text-sm 2xl:text-base text-gray-500 dark:text-gray-400">
                          {item.designation}
                        </p>
                      </span>
                    </div>
                    <div className="flex gap-2 items-center dark:text-white mt-2 md:mt-0">
                      <div className="border rounded-[10px] border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 dark:bg-dark w-[46px] h-[46px] flex justify-center items-center">
                        <RiCalendarLine className="text-lg" />
                      </div>
                      <span>
                        <p className="text-xs 2xl:text-sm text-gray-500 dark:text-gray-400">
                          Joining Date
                        </p>
                        <p className="font-semibold text-sm 2xl:text-base">
                          {item.joiningDate}
                        </p>
                      </span>
                    </div>
                  </div>

                  <div className="divider-h" />

                  <div>
                    <Heading2
                      title="Leave Balance Details"
                      description="Calculate Leave balance details."
                    />
                    <div className="flex flex-col gap-5 mt-5">
                      {leavedataMessage}
                      {leavebalanceData?.map((item, index) => (
                        <div
                          key={index}
                          className="border rounded-xl flex flex-col gap-2 md:flex-row md:justify-between md:items-center"
                        >
                          <div className="flex items-center gap-3 p-2">
                            <div className="vhcenter w-16 h-16 2xl:w-[69px] 2xl:h-[69px] rounded-md shrink-0 bg-primaryalpha/10 dark:bg-[#07A86D]/20">
                              <img
                                className="w-8 h-8 2xl:w-10 2xl:h-10"
                                src={item.img}
                                alt="Profile"
                              />
                            </div>
                            <div className="flex flex-col gap-2 w-fit dark:text-white">
                              <p className="font-semibold text-[14px] 2xl:text-lg">
                                {item.leaveName}
                              </p>
                              <p className="flex items-center font-medium text-xs 2xl:text-sm gap-0.5 md:gap-1">
                                <span className="text-slate-500 dark:text-slate-400">
                                  {" "}
                                  Total leave assigned :
                                </span>
                                <span>{item.leaveAssignedCount}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 font-medium text-xs 2xl:text-sm xs:items-start xs:ml-2 ">
                            <div className="text-left">
                              <p className="text-slate-500 dark:text-slate-400">
                                Balance Leave :
                              </p>
                              <p className="flex items-center gap-1 ">
                                <span className="text-primary font-bold">
                                  {item.leaveBalanceCount}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400">
                                  leaves remaining
                                </span>
                              </p>
                            </div>
                          </div>

                          {inputshow == true &&
                          demo.leaveTypeId == item.leaveTypeId ? (
                            <div className="flex gap-1 mr-4 items-center md:m-0 xs:mb-2 xs:ml-2 ">
                              <p className="font-medium text-[11px] md:text-[12px] dark:text-white">
                                Amount
                              </p>
                              <span className="flex gap-1 items-center">
                                <FormInput
                                  placeholder="Amount"
                                  className="md:w-[160px] 2xl:w-[168px]"
                                  value={
                                    leaveData.find(
                                      (data) =>
                                        data.leaveTypeId === item.leaveTypeId
                                    )?.leaveBalanceAmount || ""
                                  }
                                  change={(e) =>
                                    handleInputChange(e, item.leaveTypeId)
                                  }
                                />
                                <Tooltip
                                  placement="top"
                                  title="Calculation based on Basic Salary/ calendar days * no of leave count"
                                >
                                  <BsInfoCircle className="w-[29px] text-slate-500 dark:text-white" />
                                </Tooltip>
                              </span>
                            </div>
                          ) : (
                            <div className="flex gap-1 mr-4 items-center md:m-0 xs:mb-2 xs:ml-2">
                              <div className="flex items-center gap-3">
                                <p className="font-medium text-[11px] md:text-[12px] dark:text-white">
                                  Amount
                                </p>
                                <span className="flex items-center gap-5 md:gap-12">
                                  <p className="font-bold text-[12px]">
                                    {" "}
                                    {item.leaveBalanceAmount}{" "}
                                  </p>
                                  <PiPencilSimpleLight
                                    onClick={() =>
                                      inputshowbutton(item.leaveTypeId)
                                    }
                                    className="text-primary text-[16px]"
                                  />
                                </span>
                              </div>
                              <span className="flex gap-1 items-center">
                                <Tooltip
                                  placement="top"
                                  title="Calculation based on Basic Salary/ calendar days * no of leave count"
                                >
                                  <BsInfoCircle className="w-[29px] text-slate-500 dark:text-white" />
                                </Tooltip>
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeBtnValue === "gratuity" ? (
            <>
              <div className="box-wrapper flex flex-col gap-6">
                {employedetails?.map((item, index) => (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center">
                      <div className="flex gap-2 items-center ">
                        <Avatar
                          className="size-10 2xl:size-14 border-2 border-white shadow-md"
                          textClassName="text-lg 2xl:text-xl"
                          image={item.profilePicture}
                          name={item?.employeeName}
                        />

                        <span className="flex flex-col dark:text-white">
                          <div className="flex items-center gap-2">
                            <h1 className="font-semibold text-base 2xl:text-lg">
                              {item.employeeName}
                            </h1>
                            <p className=" text-primary bg-primaryalpha/10 dark:bg-primaryalpha/30 text-xs 2xl:text-sm	rounded-2xl font-medium px-3 py-1 vhcenter min-w-[118px] min-h-5	">
                              EMP ID:#{item.employeeId}
                            </p>
                          </div>
                          <p className="font-medium text-sm 2xl:text-base text-gray-500 dark:text-gray-400">
                            {item.designation}
                          </p>
                        </span>
                      </div>
                      <div className="flex gap-2 items-center dark:text-white">
                        <div className="border rounded-[10px] border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 dark:bg-dark w-[46px] h-[46px] flex justify-center items-center">
                          <RiCalendarLine className="text-lg" />
                        </div>
                        <span>
                          <p className="text-xs 2xl:text-sm text-gray-500 dark:text-gray-400">
                            Joining Date
                          </p>
                          <p className="font-semibold text-sm 2xl:text-base">
                            {item.joiningDate}
                          </p>
                        </span>
                      </div>
                    </div>

                    <div className="divider-h" />

                    <div>
                      <Heading2
                        title="Gratuity Calculation"
                        description="Calculate your gratuity here."
                      />
                      <div className="flex flex-col gap-5 mt-5 ">
                        {gratuity?.map((items) => (
                          <div
                            className="p-1 rounded-lg border border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 dark:bg-[#07A86D]/20 flex flex-col gap-1 "
                            key={items.id}
                          >
                            <div
                              className={`${items.bgColor} ${items.textColor} p-3 rounded-md mb-1`}
                            >
                              <p className="flex flex-col gap-1 sm:flex-row items-center font-semibold text-[12px]">
                                <span>FROM DATE:{items.fromdate}</span>-
                                <span>TO DATE: {items.todate}</span>
                              </p>
                            </div>
                            <div className="flex flex-col bg-[#FAFAFA] dark:bg-[#07A86D]/20 p-3 rounded-md">
                              <div className="py-2 grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-72 text-xs border-b border-gray-300 text-nowrap">
                                <div className="flex flex-col gap-1">
                                  <p className="text-gray-600 dark:text-gray-400">
                                    GRAT.YEAR & AMOUNT
                                  </p>
                                  <p className="dark:text-white font-semibold">
                                    {items.grat_year_amount}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="text-gray-600 dark:text-gray-400">
                                    GRAT.MONTH & AMOUNT
                                  </p>
                                  <p className="dark:text-white font-semibold">
                                    {items.grat_month_amount}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="text-gray-600 dark:text-gray-400">
                                    GRAT.DAYS & AMOUNT
                                  </p>
                                  <p className="dark:text-white font-semibold">
                                    {items.grat_day_amount}
                                  </p>
                                </div>
                              </div>
                              <div className="py-2 grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-72 text-xs text-nowrap">
                                <div className="flex flex-col gap-1">
                                  <p className="text-gray-600 dark:text-gray-400">
                                    BASIC PAY
                                  </p>
                                  <p className="dark:text-white font-semibold">
                                    {items.basic_pay}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="text-gray-600 dark:text-gray-400">
                                    % OF BASIC PAY
                                  </p>
                                  <p className="dark:text-white font-semibold">
                                    {items.percentage}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="text-gray-600 dark:text-gray-400">
                                    LOP & DEDUCTION
                                  </p>
                                  <p className="dark:text-white font-semibold">
                                    {items.lop_dduction}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {items.to_be_paid ? (
                              <div className="bg-[#F0F0F0] dark:bg-[#07A86D]/20 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4 p-3 rounded-md text-[12px] text-center py-4 dark:text-white">
                                <div className="col-span-1 flex items-center justify-start">
                                  <p className="font-medium">TO BE PAID</p>
                                </div>
                                <div className="col-span-1 flex items-center justify-end">
                                  <p className="font-medium">
                                    {items.to_be_paid}
                                  </p>
                                </div>
                                <div className="col-span-1 flex items-center justify-center">
                                  <p className="text-primary font-semibold">
                                    TOTAL AMOUNT
                                  </p>
                                </div>
                                <div className="col-span-1 flex items-center justify-end">
                                  <p className="text-primary font-bold">
                                    {items.total_amount}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-[#F0F0F0] dark:bg-[#07A86D]/20 grid grid-cols-2 p-3 rounded-md text-[12px] text-center text-primary py-4 ">
                                <div className="col-span-1 flex justify-end ">
                                  <p className="font-semibold">TOTAL AMOUNT</p>
                                </div>
                                <div className="col-span-1 flex justify-start ">
                                  <p className="ml-auto font-bold">
                                    {items.total_amount}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <footer className="border-t border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 dark:bg-dark dark:text-white">
                  <div className="flex justify-between w-full mt-3 mb-3 items-center ">
                    <div className="pl-1 md:pl-32 2xl:text-[14px] flex flex-col gap-1">
                      <p className="text-[12px]">Round off Amount</p>
                      <p className="font-bold text-[13px]">
                        {" "}
                        {companyDetails.currency} 0.46
                      </p>
                    </div>
                    <div className="pr-1 md:pr-32 text-[#00B107] flex flex-col gap-1">
                      <p className="text-[12px] 2xl:text-[14px] font-bold text-right">
                        Payable Amount
                      </p>
                      <p className="font-semibold sm:text-sm lg:text-lg	2xl:text-xl">
                        {companyDetails.currency} {totalgratuity}
                      </p>
                    </div>
                  </div>
                </footer>
              </div>
            </>
          ) : activeBtnValue === "loandetails" ? (
            <div className="flex flex-col gap-3 w-full">
              <div className="box-wrapper flex flex-col gap-6">
                {employedetails?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center"
                  >
                    <div className="flex gap-2">
                      <div className="flex gap-2 items-center ">
                        <Avatar
                          className="size-10 2xl:size-14 border-2 border-white shadow-md"
                          textClassName="text-lg 2xl:text-xl"
                          image={item.profilePicture}
                          name={item?.employeeName}
                        />

                        <span className="flex flex-col dark:text-white">
                          <div className="flex items-center gap-2">
                            <h1 className="font-semibold text-base 2xl:text-lg">
                              {item.employeeName}
                            </h1>
                            <p className=" text-primary bg-primaryalpha/10 dark:bg-primaryalpha/30 text-xs 2xl:text-sm	rounded-2xl font-medium px-3 py-1 vhcenter min-w-[118px] min-h-5	">
                              EMP ID:#{item.employeeId}
                            </p>
                          </div>
                          <p className="font-medium text-sm 2xl:text-base text-gray-500 dark:text-gray-400">
                            {item.designation}
                          </p>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center dark:text-white">
                      <div className="border rounded-[10px] border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 dark:bg-dark w-[46px] h-[46px] flex justify-center items-center">
                        <RiCalendarLine className="text-lg" />
                      </div>
                      <span>
                        <p className="text-xs 2xl:text-sm text-gray-500 dark:text-gray-400">
                          Joining Date
                        </p>
                        <p className="font-semibold text-sm 2xl:text-base">
                          {item.joiningDate}
                        </p>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <>
                {loan?.map((item, index) => (
                  <Accordion
                    title={item.Loan}
                    description={item.description}
                    status={item.status}
                    // className={"xs:w-700px lg:w-[1045px]"}
                  >
                    {/* {console.log(LoanData, "LoanData")} */}
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 md:gap-4 dark:text-white 2xl:pr-3">
                      {Object.entries(item.detail)?.map(
                        ([subKey, subValue]) => (
                          <div key={subKey}>
                            {subValue === "Button" ? (
                              <ButtonClick
                                handleSubmit={openModal}
                                buttonName={t(`Deduct from final settlement`)}
                                icon={<PiCoinsBold />}
                              />
                            ) : (
                              <div className="flex flex-col gap-1 overflow-hidden">
                                <p className="font-medium text-slate-400 text-[10px] 2xl:text-xs">
                                  {subKey.replace(/_/g, " ")}
                                </p>
                                <p
                                  className="font-semibold text-xs 2xl:text-sm truncate"
                                  title={subValue}
                                >
                                  {subValue}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </Accordion>
                ))}
              </>
            </div>
          ) : (
            <>
              <div className="box-wrapper flex flex-col gap-6">
                {employedetails?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center"
                  >
                    <div className="flex gap-2">
                      <div className="flex gap-2 items-center ">
                        <Avatar
                          className="size-10 2xl:size-14 border-2 border-white shadow-md"
                          textClassName="text-lg 2xl:text-xl"
                          image={item.profilePicture}
                          name={item?.employeeName}
                        />

                        <span className="flex flex-col dark:text-white">
                          <div className="flex items-center gap-2">
                            <h1 className="font-semibold text-base 2xl:text-lg">
                              {item.employeeName}
                            </h1>
                            <p className=" text-primary bg-primaryalpha/10 dark:bg-primaryalpha/30 text-xs 2xl:text-sm	rounded-2xl font-medium px-3 py-1 vhcenter min-w-[118px] min-h-5	">
                              EMP ID:#{item.employeeId}
                            </p>
                          </div>
                          <p className="font-medium text-sm 2xl:text-base text-gray-500 dark:text-gray-400">
                            {item.designation}
                          </p>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center dark:text-white">
                      <div className="border rounded-[10px] border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 dark:bg-dark w-[46px] h-[46px] flex justify-center items-center">
                        <RiCalendarLine className="text-lg" />
                      </div>
                      <span>
                        <p className="text-xs 2xl:text-sm text-gray-500 dark:text-gray-400">
                          Joining Date
                        </p>
                        <p className="font-semibold text-sm 2xl:text-base">
                          {item.joiningDate}
                        </p>
                      </span>
                    </div>
                  </div>
                ))}
                <div className="divider-h" />
                <div className="flex flex-col items-center gap-2 md:gap-0 md:flex-row md:justify-between">
                  <p className="font-medium text-slate-500 dark:text-slate-300 text-xs 2xl:text-sm">
                    Final Settlement Compilation
                  </p>
                  <ButtonClick
                    handleSubmit={() => {}}
                    buttonName={t(`Download report`)}
                    icon={<RiDownload2Line />}
                  />
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                  {dateData?.map((data, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={`vhcenter size-9 borderb rounded-lg shrink-0 dark:bg-dark`}
                      >
                        {data.icon}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs 2xl:text-sm text-slate-500 dark:text-slate-300">
                          {data.text}
                        </p>
                        <p className="flex items-center gap-1 font-semibold text-sm 2xl:text-base">
                          <span>{data.date}</span>
                          <span className="text-primary">{data?.text2}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <div className="flex flex-col gap-1 md:gap-3">
                    <div className="vhcenter borderb rounded min-h-11 2xl:min-h-12 shrink-0 dark:bg-[#07A86D]/20 font-semibold text:xs 2xl:text-sm">
                      Earnings
                    </div>
                    <div className="borderb rounded-lg dark:bg-[#07A86D]/20 p-2 min-h-80">
                      <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-100 rounded-md p-2 min-h-8 text-[10px] 2xl:text-sm text-slate-400 dark:text-slate-600">
                        <p>REMARKS</p>
                        <p>AMOUNT</p>
                      </div>
                      <div className="p-2">
                        {EarningsData?.map((earning, index) => (
                          <div key={index} className="flex flex-col gap-4 pt-4">
                            <div className="flex items-center justify-between font-medium text-xs 2xl:text-sm">
                              <p className="text-slate-500 dark:text-slate-400">
                                {earning.name}
                              </p>
                              <p>{earning.amount}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="borderb rounded dark:bg-[#07A86D]/20 p-2 min-h-[48px] 2xl:min-h-[54px]">
                      <div className="flex items-center justify-between p-2 font-bold test-xs 2xl:text-sm text-primary">
                        <p>Total Earnings</p>
                        <p>{totalearnings}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 md:gap-3">
                    <div className="vhcenter borderb rounded min-h-11 2xl:min-h-12 shrink-0 dark:bg-[#07A86D]/20 font-semibold text:xs 2xl:text-sm">
                      Deductions
                    </div>
                    <div className="borderb rounded-lg dark:bg-[#07A86D]/20 p-2 min-h-80">
                      <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-100 rounded-md p-2 min-h-8 text-[10px] 2xl:text-sm text-slate-400 dark:text-slate-600">
                        <p>REMARKS</p>
                        <p>AMOUNT</p>
                      </div>
                      <div className="p-2">
                        {DeductionData?.map((data, index) => (
                          <div key={index} className="flex flex-col gap-4 pt-4">
                            <div className="flex items-center justify-between font-medium text-xs 2xl:text-sm">
                              <p className="text-slate-500 dark:text-slate-400">
                                {data.name}
                              </p>
                              <p>{data.amount}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="borderb rounded dark:bg-[#07A86D]/20 p-2 min-h-[48px] 2xl:min-h-[54px]">
                      <div className="flex items-center justify-between p-2 font-bold test-xs 2xl:text-sm text-red-500">
                        <p>Total Deductions</p>
                        <p>{totaldeduction}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="divider-h" />
                <div className="flex items-center mt-5 justify-center dark:text-white">
                  <div className="lg:w-[1045px] h-9 2xl:h-12">
                    <div className="flex items-center justify-between gap-1 sm:gap-2">
                      <div className="flex items-center gap-2 md:gap-10 lg:gap-20">
                        <p className="flex flex-col gap-2">
                          <span className="font-medium text-[10px] 2xl:text-sm">
                            Net Total
                          </span>
                          <span className="font-bold text-xs 2xl:text-sm">
                            {companyDetails.currency} &nbsp;
                            {totalPayable
                              ? parseFloat(totalPayable).toFixed(2)
                              : "0.00"}
                          </span>
                        </p>
                        {/* <p className="flex flex-col gap-2">
                          <span className="font-medium text-[10px] 2xl:text-sm">
                            Round off amount
                          </span>
                          <span className="font-bold text-xs 2xl:text-sm">
                            {companyDetails.currency} &nbsp;
                            {roundedTotalEarnings
                              ? parseFloat(roundedTotalEarnings).toFixed(2)
                              : "0.00"}
                          </span>
                        </p> */}
                      </div>
                      <div className="flex flex-col gap-0.5 sm:gap-2 text-green-600">
                        <p className="font-medium text-[10px] 2xl:text-xs text-right">
                          Payable Amount
                        </p>
                        <p className="font-semibold sm:text-sm lg:text-lg	2xl:text-xl">
                          {companyDetails.currency} &nbsp;
                          {totalPayable
                            ? parseFloat(Math.floor(totalPayable)).toFixed(2)
                            : "0.00"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <ModalPayroll
          isOpen={isModalOpen}
          onClose={closeModal}
          buttonSubmit="Yes"
          className="w-[350px] h-[300px] 2xl:w-[486px] 2xl:h-[323px]"
          // handleSubmit={}
        >
          <div className="flex flex-col items-center justify-center w-full h-full gap-5">
            <div className="flex items-center gap-2">
              <div className="overflow-hidden border-2 border-white dark:border-0 rounded-full 2xl:size-16 size-14 hover:border-primaryalpha/10">
                <img
                  src={img1}
                  alt="modalimg"
                  className="object-cover object-center w-full h-full"
                />
              </div>
              <div className="overflow-hidden border-2 border-white dark:border-0 rounded-full 2xl:size-14 size-12 -translate-y-2 hover:border-primaryalpha/10">
                <img
                  src={img2}
                  alt="modalimg"
                  className="object-cover object-center w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-center dark:text-white">
              <div className="font-semibold	text-lg	 2xl:text-xl">
                Deduct from Final Settlement ?
              </div>
              <div className="font-style: italic text-slate-500 dark:text-slate-300 text-[10px] 2xl:text-xs">
                "Are you sure you want to deduct this loan amount from final
                settlement?"
              </div>
            </div>
          </div>
        </ModalPayroll>
      </FlexCol>
    </DrawerPop>
  );
}
