import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading2 from "../../common/Heading2";
import ButtonClick from "../../common/Button";
import SalrySlipImg from "../../../assets/images/SalrySlipImg.png";
import {
  PiCaretDown,
  PiCaretRightBold,
  PiDownload,
  PiHandCoins,
  PiMoneyWavy,
  PiTrendDown,
  PiTrendUp,
} from "react-icons/pi";
import DateSliderPicker from "../../common/DatePickerSlide";
import ModalAnt from "../../common/ModalAnt";
import FlexCol from "../../common/FlexCol";
import { Flex } from "antd";

import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import PayrollTableDetails from "../../common/PayrollTableDetails";
import FileSaver from "file-saver";
import { fetchCompanyDetails } from "../../common/Functions/commonFunction";
import ButtonDropdown from "../../common/ButtonDropdown";
import ReviseSalaryStructure from "./ReviseSalaryStructure";
import RevisionHistory from "./RevisionHistory";
import SalaryStructureTable from "./SalaryStructureTable";
import StatutoryCardNew from "./StatutoryCardNew";
import SalaryStructureTablePerDay from "./SalaryStructureTablePerDay";
import EditSalaryStructure from "./EditSalaryStructure";
import DateSelect from "../../common/DateSelect";
import { useNotification } from "../../../Context/Notifications/Notification";
import { Calender2, MySalary } from "../../common/SVGFiles";

const PayrollSalaryOverview = ({ path, employee }) => {
  const { t } = useTranslation();
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [salaryDataa, setSalaryDataa] = useState({});
  const [revisionHistory, setRevisionHistory] = useState([]);
  const [year, setYear] = useState(currentYear);
  const [months, setMonths] = useState([]);
  const [statutoryData, setStatutoryData] = useState([]);
  const { showNotification } = useNotification();
  const [genSlip, setGenSlip] = useState(false);
  const [structureSalaryDetails, setStructureSalaryDetails] = useState([]);

  const [salarySlipMonth, setSalarySlipMonth] = useState();
  const [companyData, setCompanyData] = useState({});
  const [error, setError] = useState(false);

  const handleDateChange = (newDate) => {
    const newYear = new Date(newDate).getFullYear();
    setSelectedDate(new Date(newDate));
    setYear(newYear);
  };

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  // console.log(year, "datee year dataa");

  const fetchData = async () => {
    try {
      const response = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYEE_DASHBOARD_PAYROLL_VIEW_DATA,
        {
          companyId: companyId,
          employeeId: employee,
          year: year,
        }
      );

      const result = response.result;
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Get the current date for comparison
      const currentDate = new Date();

      // Initialize months with the processed data
      const processedMonths = monthNames.map((month, index) => {
        const key = `${month} ${year}`;
        const monthData = result.yearMonthPayouts[key] || {};

        // Check if the month has passed or is the current month
        const isPastOrCurrentMonth =
          new Date(year, index, 1) <=
          new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        return {
          month: month.toUpperCase().substring(0, 3),
          year: year,
          salary: parseFloat(monthData.netsalary || 0),
          isProcessed: !!monthData.netsalary || isPastOrCurrentMonth, // Allow clicking if past or processed
          isSalaryProcessed: !!monthData.netsalary, // Differentiate processed and non-processed months
        };
      });

      setMonths(processedMonths);
      setSalaryDataa(result.CurrentSalaryDetails);
      setRevisionHistory(result.revisionHistory);
      setStructureSalaryDetails(result.StructureSalaryDetails.isRevisable);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    getcompanyDetails();
  }, [employee, year]);

  const getcompanyDetails = async () => {
    try {
      fetchCompanyDetails(companyId).then((details) => setCompanyData(details));
    } catch (error) {
      console.log(error.message);
    }
  };

  // console.log(structureSalaryDetails, "structureSalaryDetails");

  const fetchEmployeeStatutoryData = async () => {
    try {
      const response = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYEE_DASHBOARD_PAYROLL_VIEW_DATA_FOR_STATUTORY_DATA,
        {
          companyId: companyId,
          employeeId: employee,
        }
      );
      const result = response.result;
      // console.log(
      //   result,
      //   "payroll view for employee views datas fot statutory"
      // );

      // Transform the fetched data into the required format
      const formattedData = [
        {
          title: "Enable EPF Contribution",
          employeeContribution: `₹ ${result.EPF.employeeContribution} of Actual PF Wage`,
          employerContribution: `₹ ${result.EPF.employerContribution} of Actual PF Wage`,
          DeductionCyle: "Monthly",
          isActive: result.EPF.status,
        },
        {
          title: "Enable ESI Contribution",
          employeeContribution: `${result.ESI.employeeContribution}% of Gross Salary`,
          employerContribution: `${result.ESI.employerContribution}% of Gross Salary`,
          DeductionCyle: "Monthly",
          isActive: result.ESI.status,
        },
        {
          title: "Enable Professional Tax",
          State: "Kerala",
          DeductionCyle: "Monthly",
          isActive: result.PT.status,
        },
        {
          title: "Enable Labour Welfare Fund",
          employeeContribution: `₹ ${result.LWF.employeeContribution}`,
          employerContribution: `₹ ${result.LWF.employerContribution}`,
          DeductionCyle: "Monthly",
          isActive: result.LWF.status,
        },
      ];

      // Set the transformed data to the state
      setStatutoryData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeStatutoryData();
  }, []);

  const downloadSalarySlipForEmployeePayroll = async () => {
    if (!salarySlipMonth) {
      // Trigger error if the month is not selected
      setError(true);
      return;
    }

    // Clear the error if the month is selected
    setError(false);

    try {
      const employeeId = employee; // Assumes employee state/variable is defined
      const companyId = localStorage.getItem("companyId");

      const formatMonthYear = (salarySlipMonth) => {
        const date = new Date(salarySlipMonth);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2); // Format month with 2 digits
        return `${year}-${month}`;
      };

      const formattedMonthYear = formatMonthYear(salarySlipMonth);

      const result = await Payrollaction(
        PAYROLLAPI.DOWNLOAD_SALARYSLIP_PARTICULAR_EMPLOYEE,
        {
          employeeId: employeeId,
          companyId: companyId,
          salaryPayoutMonthYear: formattedMonthYear,
        }
      );

      if (result.status === 200) {
        const { filename, filecontent } = result.result;

        // Decode base64 file content
        const byteCharacters = atob(filecontent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const file = new Blob([byteArray], { type: "application/pdf" });

        // Save the file using FileSaver.js
        FileSaver.saveAs(file, filename);

        // Close the modal after successful slip generation
        setGenSlip(false);
      } else {
        openNotification("error", "Info", result.message);
      }
    } catch (error) {
      console.error(error);
      openNotification("error", "Info", error.message);
    }
  };

  return (
    <>
      <div className={`w-full flex flex-col gap-6`}>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <Heading2
            title={t("Salary Overview")}
            description={t(
              "Gain insights into your compensation package with our salary overview"
            )}
          />
          <ButtonClick
            buttonName={"Generate Salary Slip"}
            icon={<PiDownload size={20} />}
            handleSubmit={() => {
              setGenSlip(true);
            }}
          />
        </div>

        <div className="flex flex-col gap-4 p-3 rounded-lg borderb">
          <div className="flex items-center gap-6">
            <h4 className="h3 !font-semibold">Monthly Overview</h4>
            <DateSliderPicker
              datepicker={false}
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              mode="year"
              width="w-16"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
            {months.map((monthData, index) => (
              <MonthlyCard
                key={index}
                {...monthData}
                employee={employee}
                companyData={companyData}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <MySalaryCard
            path={path}
            data={salaryDataa}
            employee={employee}
            companyData={companyData}
          />
          <LastRevisionCard
            data={revisionHistory}
            employee={employee}
            isRevisable={structureSalaryDetails}
            companyData={companyData}
          />
        </div>

        {parseInt(companyData.isPFESIenabled) === 1 && (
          <StatutoryCardNew data={statutoryData} companyData={companyData} />
        )}
      </div>

      <ModalAnt
        isVisible={genSlip}
        onClose={() => setGenSlip(false)}
        width="453px"
        showTitle={false}
        centered={true}
        padding="10px"
        showOkButton={true}
        showCancelButton={true}
        okText="Generate Slip"
        okButtonClass="w-full"
        cancelButtonClass="w-full"
        onOk={downloadSalarySlipForEmployeePayroll} // # add your functionality here.
        error={error} // Pass error state to ModalAnt
        errorMessage="Please select a month" // Custom error message
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="size-[46px] borderb rounded-full vhcenter bg-primaryalpha/10 text-primary">
              <img src={SalrySlipImg} alt=" " />
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <p className="font-semibold text-text-lg 2xl:text-xl">
                Generate Salary Slip
              </p>
              <p className="flex text-center text-xs font-medium text-gray-500 2xl:text-sm">
                Generate a detailed salary slip for employees, showcasing
                earnings, deductions, and net pay effortlessly with a single
                click
              </p>
            </div>
          </div>
          <div className="borderb bg-[#F9F9F9] dark:bg-dark rounded-lg p-2 flex flex-col gap-5">
            <DateSelect
              title={"Month"}
              placeholder={"Month"}
              value={salarySlipMonth}
              maxdate={true}
              dateFormat="MM-YYYY"
              pickerType="month"
              change={(e) => {
                setSalarySlipMonth(e);
                setError(false);
              }}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">Please select a month</p>
            )}
          </div>
        </div>
      </ModalAnt>
    </>
  );
};

const MonthlyCard = ({
  month,
  year,
  salary,
  isProcessed,
  employee,
  companyData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState("");
  const [isSettled, setIsSettled] = useState(1);
  const [isSalaryHold, setIsSalaryHold] = useState(0);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const { showNotification } = useNotification();

  const monthFullNames = {
    JAN: "January",
    FEB: "February",
    MAR: "March",
    APR: "April",
    MAY: "May",
    JUN: "June",
    JUL: "July",
    AUG: "August",
    SEP: "September",
    OCT: "October",
    NOV: "November",
    DEC: "December",
  };

  const fullMonthName = `${monthFullNames[month]} ${year}`;

  console.log(fullMonthName, "fullMonthName");

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const fetchSalaryTemplate = async () => {
    try {
      const response = await Payrollaction(
        PAYROLLAPI.GET_PAYROLLTABLE_EMPLOYEE_DATA_EMPLOYEE_ADJUSTEMENTS,
        {
          employeeId: employee,
          salaryPayoutMonthYear: fullMonthName,
          companyId: companyId,
        }
      );

      if (response.status !== 200) {
        throw new Error(response.message);
      }
      setIsOpen(true);
    } catch (error) {
      openNotification("error", "Error", error.message);
      setIsOpen(false);
    }
  };
  const toggleModal = async () => {
    if (isProcessed) {
      if (!salary) {
        setIsSettled(0);
        setIsSalaryHold(0);
      }
      await fetchSalaryTemplate();
    }
  };

  return (
    <>
      <div
        className={`borderb bg-white dark:bg-[#0a0a0a] group justify-between flex items-center rounded-lg p-[14px] transition-all duration-300 ${
          isProcessed
            ? "opacity-100 hover:bg-primaryalpha/15 cursor-pointer"
            : "opacity-70 dark:opacity-50 mix-blend-luminosity text-grey"
        }`}
        onClick={() => isProcessed && toggleModal(true)}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-between">
            <Calender2 />
            <div className="rounded borderb h-10 w-full vhcenter absolute left-1/2 -translate-x-[51%] bottom-1/4 translate-y-[34%] blurcal">
              <h3 className="text-xs lg:text-[10px] 2xl:text-xs font-medium ">
                {month}
              </h3>
            </div>
          </div>
          {isProcessed ? (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs lg:text-[10px] 2xl:text-xs text-grey font-medium">
                <span className="text-black dark:text-white">{year}</span>
              </p>
              <p className="text-sm font-semibold dark:text-white lg:text-xs 2xl:text-sm whitespace-nowrap">
                {companyData.currency} {salary.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-xs lg:text-[10px] 2xl:text-xs font-medium flex flex-col gap-2">
              <span>Not Processed</span>
            </p>
          )}
        </div>
        <PiCaretRightBold className="text-grey group-hover:text-primary" />
      </div>
      {isOpen && (
        <PayrollTableDetails
          isSettled={isSettled}
          isSalaryHold={isSalaryHold}
          open={isOpen}
          close={(e) => {
            setIsOpen(e);
          }}
          employeeId={employee}
          selectedMonthYear={fullMonthName}
        />
      )}
    </>
  );
};
const MySalaryCard = ({ path, data, employee, companyData }) => {
  const [isAccountNoVisible, setIsAccountNoVisible] = useState(false);
  const [salaryStruct, setSalaryStruct] = useState(false);
  const [salaryStructPerDay, setsalaryStructPerDay] = useState(false);

  return (
    <>
      <div className="flex flex-col col-span-12 gap-4 p-3 rounded-lg borderb xl:col-span-7 2xl:col-span-7">
        <div className="flex items-center justify-between gap-2 title">
          {path === "employeeProfile" ? (
            <h4 className="h3 !font-semibold">Salary</h4>
          ) : (
            <h4 className="h3 !font-semibold">My Salary</h4>
          )}
          <div
            className="text-sm 2xl:text-sm lg:text-xs text-primary !underline dark:text-white cursor-pointer"
            onClick={() => {
              setSalaryStruct(true);
            }}
          >
            View Salary Structure
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="relative w-fit h-fit">
            <MySalary className="w-[260px] xss:w-full h-full" />
            <div className="absolute inset-0 w-full h-full px-4 pt-4 pb-3">
              <div className="flex flex-col gap-2.5 xss:gap-3.5">
                <div>
                  <p className="2xl:text-xs text-[10px]">Current Net</p>
                  <p className="text-xl font-bold 2xl:text-2xl">
                    {companyData?.currency && companyData.currency.length > 1
                      ? `${(data.netSalary || 0)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                          companyData.currency
                        }`
                      : `${companyData?.currency || ""} ${(data.netSalary || 0)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                  </p>
                </div>
                <div>
                  <p className="2xl:text-[10px] text-[8px]">Account No</p>
                  <p className="text-xs font-semibold 2xl:text-sm">
                    {isAccountNoVisible
                      ? data.accountNo || "--"
                      : data.accountNo
                      ? `${data.accountNo.slice(0, 5)} ******`
                      : "--"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setsalaryStructPerDay(true);
                }}
                className="w-fit h-9 bg-primary absolute text-xs font-medium text-white rounded-full px-4 py-2.5 bottom-2 right-8 xss:right-[52px] cursor-pointer"
              >
                View Details
              </button>
            </div>
          </div>
          <FlexCol gap={12}>
            <div className="flex items-center justify-between gap-3">
              <Flex align="center" gap={12}>
                <div className="bg-[#6A4BFC] rounded-full size-[43px] vhcenter text-white">
                  <PiMoneyWavy size={24} />
                </div>
                <p className="text-grey text-xs 2xl:text-xs lg:text-[10px]">
                  Basic Salary
                </p>
              </Flex>
              <p className="text-sm font-semibold lg:text-xs 2xl:text-sm dark:text-white">
                {companyData?.currency && companyData.currency.length > 1
                  ? `${(data.basicSalary || 0)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                      companyData.currency
                    }`
                  : `${companyData?.currency || ""} ${(data.basicSalary || 0)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Flex align="center" gap={12}>
                <div className="bg-[#FF9A43] rounded-full size-[43px] vhcenter text-white">
                  <PiHandCoins size={24} />
                </div>
                <p className="text-grey text-xs 2xl:text-xs lg:text-[10px]">
                  Allowance
                </p>
              </Flex>
              <p className="text-sm font-semibold lg:text-xs 2xl:text-sm dark:text-white">
                {companyData?.currency && companyData.currency.length > 1
                  ? `${(data.allowence || 0)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                      companyData.currency
                    }`
                  : `${companyData?.currency || ""} ${(data.allowence || 0)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Flex align="center" gap={12}>
                <div className="bg-[#FC4848] rounded-full size-[43px] vhcenter text-white">
                  <PiTrendDown size={24} />
                </div>
                <p className="text-grey text-xs 2xl:text-xs lg:text-[10px]">
                  Deduction
                </p>
              </Flex>
              <p className="text-sm font-semibold lg:text-xs 2xl:text-sm dark:text-white">
                {companyData?.currency && companyData.currency.length > 1
                  ? `${(data.deductions || 0)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                      companyData.currency
                    }`
                  : `${companyData?.currency || ""} ${(data.deductions || 0)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
              </p>
            </div>
          </FlexCol>
        </div>
      </div>
      {salaryStruct && (
        <SalaryStructureTable
          salaryStructure={data.salaryStructure}
          open={salaryStruct}
          close={(e) => {
            setSalaryStruct(e);
          }}
          employee={employee}
        />
      )}
      {salaryStructPerDay && (
        <SalaryStructureTablePerDay
          salaryStructure={data.salaryStructure}
          open={salaryStructPerDay}
          close={(e) => {
            setsalaryStructPerDay(e);
          }}
          employee={employee}
        />
      )}
    </>
  );
};

const LastRevisionCard = ({ data, employee, isRevisable, companyData }) => {
  const [isOpenPop, setOpenPop] = useState(false);
  const [drawerPop, setDrawerPop] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [drawerComponent, setDrawerComponent] = useState("");

  const openPopUP = () => {
    setOpenPop(!isOpenPop);
  };

  // Process data to get the latest two items based on year
  const getLatestTwoItems = (data) => {
    // Sort data by createdOn date in descending order
    const sortedData = [...data].sort(
      (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
    );

    // Get unique years from the sorted data
    const uniqueYears = [
      ...new Set(
        sortedData.map((item) => new Date(item.createdOn).getFullYear())
      ),
    ];

    // Filter data to include only items from the latest two unique years
    const latestTwoYearsData = sortedData.filter((item) =>
      uniqueYears.slice(0, 2).includes(new Date(item.createdOn).getFullYear())
    );

    // Return the first two items from the filtered data
    return latestTwoYearsData.slice(0, 2);
  };

  const latestTwoItems = getLatestTwoItems(data);

  return (
    <div className="flex flex-col col-span-12 gap-4 p-3 rounded-lg borderb xl:col-span-5 2xl:col-span-5">
      <div className="flex items-center justify-between gap-2 title">
        <h4 className="h3 !font-semibold">Last Revisions</h4>
        <div className="flex items-center gap-3">
          <div
            className="text-sm 2xl:text-sm lg:text-xs text-primary !underline dark:text-white cursor-pointer"
            onClick={openPopUP}
          >
            View All Revisions
          </div>

          {parseInt(isRevisable) === 1 && (
            <ButtonDropdown
              buttonName={
                <div className="flex items-center gap-1">
                  <p>Salary Actions</p>
                  <PiCaretDown className="text-xl size-4" />
                </div>
              }
              items={[
                {
                  key: "1",
                  label: "Revise Salary",
                  value: "revise_salary",
                },
                {
                  key: "2",
                  label: "Edit Salary",
                  value: "edit_salary",
                },
              ]}
              onSelect={(key, value) => {
                setDrawerPop(true);
                setDrawerComponent(value);
              }}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-[18px]">
        {latestTwoItems.map((item, index) => (
          <div
            className="flex items-center justify-between p-4 rounded-lg borderb"
            key={index}
          >
            <div className="flex items-center gap-5">
              <div className="size-12 rounded-full vhcenter shadow-[0px_4px_11px_0px] shadow-[#349C5E]/10 dark:bg-dark">
                <PiTrendUp size={20} className="text-[#349C5E]" />
              </div>
              <div>
                <p className="text-sm leading-5 text-grey 2xl:text-sm lg:text-xs">
                  Revised Salary
                </p>
                <p className="text-sm font-semibold leading-5 lg:text-xs 2xl:text-sm dark:text-white">
                  {companyData?.currency && companyData.currency.length > 1
                    ? `${parseFloat(item.newGrossSalary)
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                        companyData.currency
                      }`
                    : `${companyData?.currency} ${parseFloat(
                        item.newGrossSalary
                      )
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <p className="text-sm text-grey lg:text-xs 2xl:text-sm">
                {new Date(item.createdOn).getFullYear()}
              </p>
              {/* <PiCaretRight size={20} className="text-grey" /> */}
            </div>
          </div>
        ))}
      </div>

      {isOpenPop && (
        <RevisionHistory
          open={isOpenPop}
          data=""
          close={(e) => {
            setOpenPop(e);
          }}
          employee={employee}
        />
      )}

      {drawerPop && drawerComponent === "revise_salary" && (
        <ReviseSalaryStructure
          open={drawerPop}
          close={(e) => {
            setDrawerPop(e);
          }}
          updateId={updateId}
          employee={employee}
        />
      )}

      {drawerPop && drawerComponent === "edit_salary" && (
        <EditSalaryStructure
          open={drawerPop}
          close={(e) => {
            setDrawerPop(e);
          }}
          updateId={updateId}
          employee={employee}
        />
      )}
    </div>
  );
};

export default PayrollSalaryOverview;
