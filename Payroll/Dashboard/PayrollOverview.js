import React, { useEffect, useState } from "react";
import Dropdown from "../../common/Dropdown";
import { PiCalendarBlank, PiClock, PiDiamondsFour } from "react-icons/pi";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "../../common/BreadCrumbs";
import useCurrentDateTime from "../../common/CurrentDateTime";
import MultiSelectDropDown from "../../common/MultiSelectDropDown";
import PayrollStatus from "./PayrollStatus";
import PayrollSummary from "./PayrollSummary";
import EmployeePaymentSummary from "./EmployeePaymentSummary";
import TotalEarnings from "./TotalEarnings";
import Heading from "../../common/Heading";
import DateAndTime from "../../Discover/DateAndTime";
import UnAssignedSalaryTemplateEmployeeList from "./UnAssignedSalaryTemplateEmployeeList";
import SalaryHoldEmployeeList from "./SalaryHoldEmployeeList";


export default function PayrollOverview() {
  const { t } = useTranslation();

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleDropdownChange = (selectedValues) => {
    setSelectedOptions(selectedValues);
  };

  const options = [
    { label: "Work Schedule", value: "workschedule" },
    { label: "Leave Balance", value: "leavebalance" },
    { label: "Requests", value: "requests" },
    { label: "Meatings", value: "meatings" },
    { label: "Team Member", value: "teammember" },
    { label: "Turn Over Rates", value: "turnover" },
    { label: "Document", value: "document" },
    { label: "Holiday", value: "holiday" },
    { label: "My Feeds", value: "myfeeds" },
  ];

  const breadcrumbItems = [{ label: t("Payroll_Overview"), url: "" }];
  // const ResponsiveGridLayout = WidthProvider(Responsive);

  // Get date and time values from CurrentDateTime component
  const { currentDate, currentTime } = useCurrentDateTime();
  return (
    <div className="absolute top-0 left-0 bg-primaryalpha/5 flex flex-col gap-6 dark:bg-[#171C28] w-full overflow-auto p-6">
      <div className="flex flex-col flex-wrap justify-between gap-4 md:items-center md:flex-row">
        {/* <Breadcrumbs
          items={breadcrumbItems}
          description="Provides employees with a comprehensive view of their salary receivables, including insights into salary hikes, deductions, and other financial aspects."
        /> */}
        <Heading
          title={t("Payroll_Overview")}
          description="Provides employees with a comprehensive view of their salary receivables, including insights into salary hikes, deductions, and other financial aspects."
        />

        <div className="flex w-full md:w-auto items-center sm:flex-row flex-col gap-3 bg-white dark:bg-black divide-y sm:divide-y-0  sm:divide-x dark:divide-x-0 group rounded-xl p-2.5">
          <DateAndTime />

          <div className="w-full pt-3 pl-3 sm:pt-0 sm:w-auto vhcenter">
            <MultiSelectDropDown
              icon={<PiDiamondsFour size={16} />}
              className="2xl:h-10"
              options={options}
              onChange={handleDropdownChange}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 ">
        {/* <div className="flex flex-col h-full col-span-12 gap-6 lg:pr-0 lg:col-span-8 2xl:col-span-7">
          <PayrollSummary />
          <EmployeePaymentSummary />
        </div>

        <div className="h-full col-span-12 lg:col-span-4 2xl:col-span-5">
          <PayrollStatus />
        </div> */}
        <div className="col-span-12 xl:col-span-8">
          <PayrollSummary />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <PayrollStatus />
        </div>
        <div className="col-span-12 xl:col-span-8">
          <EmployeePaymentSummary />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <TotalEarnings />
        </div>
        <div className="col-span-12 xl:col-span-8">
          <UnAssignedSalaryTemplateEmployeeList/>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <SalaryHoldEmployeeList />
        </div>
      </div>
    </div>
  );
}
