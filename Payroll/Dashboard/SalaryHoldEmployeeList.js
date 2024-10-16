import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DragCard from "../../common/DragCard";
import { Link } from "react-router-dom";
import ProgressBarMulti from "./ProgressBarMulti";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import dayjs from "dayjs";
import { fetchCompanyDetails } from "../../common/Functions/commonFunction";
import Avatar from "../../common/Avatar";
import { NoData } from "../../common/SVGFiles";

const SalaryHoldEmployeeList = React.memo(() => {
  const { t } = useTranslation();

  const [employeesalryhold, setEmployeesalaryhold] = useState([]);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [currentMonthYear, setCurrentMonthYear] = useState(
    dayjs().format("MMMM YYYY")
  );
  const [companyDetails, setCompanyDetails] = useState(null);

  const getAllEmployeeSalaryHoldList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_EMPLOYEE_SALARY_HOLD_LIST,
        {
          companyId: companyId,
        }
      );
      console.log(employeesalryhold, "data of payroll status deatial");
      setEmployeesalaryhold(result?.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAllEmployeeSalaryHoldList();
  }, []);

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format("MMM YYYY");
    setCurrentMonthYear(formattedDate);
  };

  // useEffect(() => {
  //     const companyId = getCompanyIdFromLocalStorage();
  //     if (companyId) {
  //         fetchCompanyDetails(companyId).then((details) =>
  //             setCompanyDetails(details)
  //         );
  //     }

  //     const handleStorageChange = () => {
  //         const companyId = getCompanyIdFromLocalStorage();
  //         if (companyId) {
  //             fetchCompanyDetails(companyId).then((details) =>
  //                 setCompanyDetails(details)
  //             );
  //         }
  //     };

  //     window.addEventListener("storage", handleStorageChange);

  //     return () => {
  //         window.removeEventListener("storage", handleStorageChange);
  //     };
  // }, []);

  return (
    <DragCard header={"Salary Hold Employee List"} className="h-full">
      <div className="w-full overflow-y-auto h-72 md:h-56 2xl:h-72 responsiveTable">
        <table className="flex flex-row flex-no-wrap w-full">
          <thead className="text-gray-500">
            <tr className="flex flex-col mb-2 text-[10px] 2xl:text-xs uppercase rounded-l-lg flex-no wrap sm:table-row sm:rounded-none sm:mb-0 bg-primaryalpha/10 dark:bg-primaryalpha/30 sm:bg-transparent dark:sm:bg-transparent">
              <th className="p-1 font-medium text-left 2xl:p-3">
                EMPLOYEE NAME
              </th>
              <th className="p-1 font-medium text-left 2xl:p-3">NET SALARY</th>
              <th className="p-1 font-medium text-left 2xl:p-3">YEAR</th>
            </tr>
          </thead>
          <tbody className="flex-1 sm:flex-none">
            {employeesalryhold?.length === 0 ? (
              <tr>
                <td colSpan="3">
                  <NoData />
                </td>
               
              </tr>
            ) : (
              employeesalryhold?.map((employee) => (
                <tr
                  key={employee.id}
                  className="flex flex-col text-[10px] 2xl:text-xs font-medium text-grey dark:text-white mb-2 flex-no wrap sm:table-row sm:mb-0 hover:bg-slate-600/5"
                >
                  <td className="p-2 2xl:p-3">
                    <div className="flex items-center gap-1">
                      <Avatar
                        image={employee.profilePicture}
                        name={employee.employeeName}
                      />
                      <div className="flex flex-col gap-0.5 2xl:gap-1">
                        <div className="text-xs 2xl:text-sm font-medium text-black dark:text-white">
                          {employee.employeeName}
                        </div>
                        <div className="text-[10px] 2xl:text-xs">
                          {employee.designation}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 2xl:p-3">{employee.netsalary}</td>
                  <td className="p-2 2xl:p-3">{employee.salaryMonthYear}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DragCard>
  );
});

export default SalaryHoldEmployeeList;
