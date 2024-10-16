import React, { useEffect, useRef, useState } from "react";
import DragCard from "../../common/DragCard";
import { useTranslation } from "react-i18next";
import DateSelect from "../../common/DateSelect";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import dayjs from "dayjs";
import Avatar from "../../common/Avatar";
import { NoData } from "../../common/SVGFiles";

const UnAssignedSalaryTemplateEmployeeList = React.memo(() => {
    const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
    const [paymentData, setPaymentData] = useState([]);
    const [currentMonthYear, setCurrentMonthYear] = useState(
        dayjs().format("MMMM YYYY")
    );
    const [selectedDate, setSelectedDate] = useState(dayjs().format("MMM YYYY"));
    const [
        unAssignedSalaryTemplateEmployeeList,
        setUnAssignedSalaryTemplateEmployeeList,
    ] = useState([]);

    const { t } = useTranslation();

  

    

    const getUnAssignedSalaryTemplateEmployeelist = async () => {
        try {
            const result = await Payrollaction(
                PAYROLLAPI.GET_ALL_SALARY_TEMPLATE_UNASSIGNED_LIST,

                {
                    companyId: companyId,
                }
            );

            // console.log(result?.result, "data of getUnAssignedSalaryTemplateEmployeelist");

            setUnAssignedSalaryTemplateEmployeeList(result.result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        getUnAssignedSalaryTemplateEmployeelist();
    }, []);

    return (
      <DragCard header={"Salary Template Not Assigned Employees"}>
        <div className="w-full overflow-y-auto h-72 md:h-56 2xl:h-72 responsiveTable">
          <table className="flex flex-row flex-no-wrap w-full">
            <thead className="text-gray-500">
              <tr className="flex flex-col mb-2 text-[10px] 2xl:text-xs uppercase rounded-l-lg flex-no wrap sm:table-row sm:rounded-none sm:mb-0 bg-primaryalpha/10 dark:bg-primaryalpha/30 sm:bg-transparent dark:sm:bg-transparent">
                <th className="p-1 font-medium text-left 2xl:p-3">EMPLOYEE</th>
                <th className="p-1 font-medium text-left 2xl:p-3">
                  Designation
                </th>
                <th className="p-1 font-medium text-left 2xl:p-3">
                  Joining Date
                </th>
              </tr>
            </thead>
            <tbody className="flex-1 sm:flex-none">
              
              {unAssignedSalaryTemplateEmployeeList?.length === 0 ? (
                  <tr>
                    <td colSpan="3">
                      <NoData />
                    </td>

                  </tr>
                ) : (
              unAssignedSalaryTemplateEmployeeList.map((item, index) => (
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
                          # {item.code || ""}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-2 2xl:p-3">
                    {item.designation && item.departmentName
                      ? `${item.designation} / ${item.departmentName}`
                      : item.designation || item.departmentName || "--"}
                  </td>
                  <td className="p-2 2xl:p-3">{item.joiningDate}</td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </DragCard>
    );
});

export default UnAssignedSalaryTemplateEmployeeList;
