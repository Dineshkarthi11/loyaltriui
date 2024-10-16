import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";
import PAYROLLAPI, { Payrollaction } from "../PayRollApi";
import Heading from "../common/Heading";
import PayrollSalaryOverview from "../Employee/EmployeeProfile/PayrollSalaryOverview";
import localStorageData from "../common/Functions/localStorageKeyValues";

const MySalary = () => {
  const { t } = useTranslation();

  const [navigationPath, setNavigationPath] = useState("monthly_Pay");

  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  // List Data
  const [monthlyPayList, setmonthlyPayList] = useState([]);
  const [myadjustmentList, setMyAdjustmentList] = useState([]);
  const [employeeId, setemployeeId] = useState(localStorageData.employeeId);
  const [selectedOption, setSelectedOption] = useState("Closed");
  const [monthYearList, setMonthYearList] = useState([]);
  const [
    employeeCurrentDateSalaryDetails,
    setEmployeeCurrentDateSalaryDetails,
  ] = useState();

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);

  const getEmployeeSalaryStillDate = async (monthYear) => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.Get_EMPLOYEE_SALARY_DATA_UNTIL_CURRENT_DATE,
        {
          companyId: companyId,
          salaryPayoutMonthYear: monthYear,
          employeeId: employeeId,
        }
      );

      if (result.status === 200) {
        console.log(result.result, "payroll table data suceesfully loaded");
        setEmployeeCurrentDateSalaryDetails([result.result]);
      } else {
        console.log("Failed to fetch data:", result.message);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const getMyAdjustmentList = async (monthYear) => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.Get_EMPLOYEE_ADJUSTEMENT_LIST_BASED_ON_MONTH,
        {
          companyId: companyId,
          salaryPayoutMonthYear: monthYear || null,
          employeeId: employeeId,
        }
      );

      if (result.status === 200 && result.result && result.result.length > 0) {
        // console.log(result.result, "adjustmentResult");
        const newResult = result.result.map((item) => ({
          // ...item,
          name: item.name,
          type: item.type,
          dateIncurred: item.dateIncurred,
          amount: Number(item.amount).toFixed(2),
        }));
        setMyAdjustmentList(newResult);
      } else {
        console.log("Failed to fetch data:", result.message);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    switch (navigationPath) {
      case "monthly_Pay":
        if (selectedOption && selectedOption.monthYear !== "All") {
          // getMetmonthlyPayList(selectedOption.monthYear);
          getEmployeeSalaryStillDate(selectedOption.monthYear);
        } else {
          // getMetmonthlyPayList(null);
          getEmployeeSalaryStillDate(null);
        }
        break;
      case "my_Adjustment":
        if (selectedOption && selectedOption.monthYear !== "All") {
          getMyAdjustmentList(selectedOption.monthYear);
        } else {
          getMyAdjustmentList(null);
        }
        break;
      default:
        break;
    }
  }, [navigationPath, selectedOption]);

  const handleMenuClick = (e) => {
    const selectedIndex = parseInt(e.key);
    const selectedOptionData = monthYearList[selectedIndex];
    setSelectedOption(selectedOptionData);
    console.log(selectedOptionData, "seelected option dataaa");
  };

  useEffect(() => {
    if (selectedOption) {
      // getMetmonthlyPayList(selectedOption.monthYear);
      getEmployeeSalaryStillDate(selectedOption.monthYear);
      getMyAdjustmentList(selectedOption.monthYear);
    }
  }, [selectedOption]);

  const menu = (
    <Menu onClick={handleMenuClick}>
      {monthYearList.map((option, index) => (
        <Menu.Item key={index}>
          <div className="flex items-center gap-2 ml-auto">
            {/* Display the status in lime or gray color based on its value */}
            {/* <div
              className={`${
                option.status === "Closed" ? "bg-gray-500" : "bg-lime-500"
              } min-w-16 px-3 pt-0 pb-0 rounded-md text-white`}
            >
              {option.status}
            </div> */}
            {/* Display the `monthYear` value */}
            <div className="font-bold">{option.monthYear}</div>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

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
        let monthYearList = result.result.MonthYearList;

        // Add "All" option to the beginning of the list
        monthYearList.unshift({ monthYear: "All" });

        setMonthYearList(monthYearList);
        console.log(monthYearList, "month year list dataaa");

        // Determine the initial selected option
        const currentDate = new Date();
        const currentMonthYear = `${currentDate.toLocaleString("default", {
          month: "long",
        })} ${currentDate.getFullYear()}`;

        let initialSelectedOption = null;

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

        // If initial option is available, call getPayrollTable with the initial selected monthYear
        if (initialSelectedOption) {
          // getMetmonthlyPayList(initialSelectedOption.monthYear);
          getEmployeeSalaryStillDate(selectedOption.monthYear);
          getMyAdjustmentList(initialSelectedOption.monthYear);
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

  return (
    <div className={`  w-full flex flex-col gap-6 `}>
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        {/* <div>
          <p className="font-bold text-lg">My Salary</p>
          <p className="para">
            {t(
              "Provides a concise overview of current and historical salary disbursements for employees."
            )}
          </p>
        </div> */}
        <Heading
          title="My Salary"
          description={t(
            "Provides a concise overview of current and historical salary disbursements for employees."
          )}
        />

        <div className="flex flex-col gap-6 sm:flex-row">
          {/* <Dropdown overlay={menu} placement="bottomCenter">
            <Button
              className="flex items-center gap-2 ml-auto"
              size={isSmallScreen ? "default" : "large"}
            >
              
              <div className="font-bold">{selectedOption?.monthYear}</div>
              <IoIosArrowDown className="transition-all bg-transparent border-none outline-none 2xl:text-2xl hover:text-primary" />
            </Button>
          </Dropdown> */}

          {/* <ButtonClick
            // handleSubmit={() => {
            //   console.log("show");
            //   handleShow();
            //   setOpenPop(navigationPath);
            //   setUpdateId(false);
            //   setShow(true);
            // }}
            buttonName={`Download Salary Slip`} // Set the button name
            className="your-custom-styles" // Add any additional class names for styling
            BtnType="primary" // Specify the button type (Add or Update)
          /> */}
        </div>
      </div>
      {/* <Tabs
        tabs={tabs}
        // data={companyList}
        header={header}
        tabClick={(e) => {
          console.log(e, "e");
          setNavigationPath(e);
        }}
        tabChange={(e) => {
          setNavigationValue(e);
        }}
        data={
          Object.keys(actionData[0]).includes(navigationPath)
            ? actionData[0]?.[navigationPath].data
            : null
        }
        // actionToggle={true}
        // actionID={
        //   Object.keys(actionId[0]).includes(navigationPath)
        //     ? actionId[0]?.[navigationPath].id
        //     : null
        // }
        path={navigationPath}
        // companyList={false}
        // buttonClick={(e, company) => {
        //   // console.log(company, "company", e);
        //   if (e === true) {
        //     // setShow(e);
        //   } else if (e === navigationPath) {
        //     // setShow(true);
        //     console.log(company, "companyId");
        //     // setCompanyId(company);
        //     setOpenPop(e);
        //     setUpdateId(false);
        //   } else {
        //     setOpenPop(navigationPath);

        //     // setShow(true);
        //     // console.log(company, "companyparentId");
        //     // if (company === "edit") {
        //     setUpdateId(e);
        //     // }
        //   }
        // }}
        clickDrawer={(e) => {
          // handleShow();
          // console.log(e);
          // setShow(e);
        }}
        navigationClick={(e) => {
          // console.log(e);
          setNavigationPath(e);
          // handleClose();
        }}
        activeOrNot={(e) => {
          // console.log(e, "active check");
          // updateCompany();
          // setactive(e);
        }}
        // updateApi={
        //   Object.keys(updateApi[0]).includes(navigationPath)
        //     ? updateApi[0]?.[navigationPath].api
        //     : null
        // }
        // deleteApi={
        //   Object.keys(deleteApi[0]).includes(navigationPath)
        //     ? deleteApi[0]?.[navigationPath].api
        //     : null
        // }
        referesh={() => {
          switch (navigationPath) {
            default:
              // getMetmonthlyPayList(selectedOption.monthYear);
              getEmployeeSalaryStillDate(selectedOption.monthYear);
              break;
            case "my_Adjustment":
              getMyAdjustmentList(selectedOption.monthYear);
              break;
          }
        }}
      /> */}
      <PayrollSalaryOverview employee={employeeId} />
    </div>
  );
};

export default MySalary;
