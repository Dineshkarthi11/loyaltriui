
import React, { useEffect, useRef, useState } from "react";
import DragCard from "../../common/DragCard";
import { useTranslation } from "react-i18next";
import DateSelect from "../../common/DateSelect";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import dayjs from "dayjs";
import Avatar from "../../common/Avatar";
import { NoData } from "../../common/SVGFiles";

const EmployeePaymentSummary = React.memo(() => {
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [paymentData, setPaymentData] = useState([]);
  const [currentMonthYear, setCurrentMonthYear] = useState(
    dayjs().format("MMMM YYYY")
  );
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("MMM YYYY")
  );

  const { t } = useTranslation();

  useEffect(() => {
    getEmployessPayrollDetailsInDashboard();
  }, [currentMonthYear]);

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format("MMMM YYYY"); // need to pass full month name to backend.
    setCurrentMonthYear(formattedDate);
    const formattedDate2 = dayjs(date).format("MMM YYYY");
    setSelectedDate(formattedDate2);
  };

  // console.log(currentMonthYear, "current month yearr");

  const getEmployessPayrollDetailsInDashboard = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYEES_SALARY_PAYMENT_SUMARY_DETAILS,
        {
          companyId: companyId,
          salaryPayoutMonthYear: currentMonthYear,
        }
      );
      // console.log(result?.result, "data of employee payroll");
      setPaymentData(result?.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  return (
    <DragCard header={t("Employee_Payment_Summary")}>
      <DateSelect
        pickerType="month"
        dateFormat="MMM YYYY"
        className="w-32 "
        value={selectedDate}
        change={handleDateChange}
      />
      <div className="w-full overflow-y-auto h-72 md:h-56 2xl:h-72 responsiveTable">
        <table className="flex flex-row flex-no-wrap w-full">
          <thead className="text-gray-500">
            <tr className="flex flex-col mb-2 text-[10px] 2xl:text-xs uppercase rounded-l-lg flex-no wrap sm:table-row sm:rounded-none sm:mb-0 bg-primaryalpha/10 dark:bg-primaryalpha/30 sm:bg-transparent dark:sm:bg-transparent">
              <th className="p-1 font-medium text-left 2xl:p-3">EMPLOYEE</th>
              <th className="p-1 font-medium text-left 2xl:p-3">
                Total Salary
              </th>
              <th className="p-1 font-medium text-left 2xl:p-3">Settled</th>
              <th className="p-1 font-medium text-left 2xl:p-3">Pending</th>
            </tr>
          </thead>
          <tbody className="flex-1 sm:flex-none">
            {paymentData?.length === 0 ? (
              <tr>
                <td colSpan="3">
                  <NoData />
                </td>

              </tr>
            ) : (
            paymentData.map((item, index) => (
              <tr
                key={index}
                className="flex flex-col text-[10px] 2xl:text-xs font-medium text-grey dark:text-white mb-2 flex-no wrap sm:table-row sm:mb-0 hover:bg-slate-600/5 md:border-y border-black/5 dark:border-white/10"
              >
                <td className="p-2 2xl:p-3">
                  <div className="flex items-center gap-1">
                    <Avatar
                      image={item.profilePicture}
                      name={item.employeeName}
                    />
                    <div className="flex flex-col gap-0.5 2xl:gap-1">
                      <div className="text-xs 2xl:text-sm font-medium text-black dark:text-white">
                        {item.employeeName}
                      </div>
                      <div className="text-[10px] 2xl:text-xs">
                        {item.designation || ""}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-2 2xl:p-3">
                  {item.totalSalary
                    ? Number(
                      parseFloat(item.totalSalary).toFixed(2)
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                    : "0.00"}
                </td>
                <td className="p-2 2xl:p-3">
                  {item.Settled
                    ? Number(
                      parseFloat(item.Settled).toFixed(2)
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                    : "0.00"}
                </td>
                <td className="p-2 2xl:p-3">
                  {item.Pending
                    ? Number(
                      parseFloat(item.Pending).toFixed(2)
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                    : "0.00"}
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
    </DragCard>
  );
});

export default EmployeePaymentSummary;

