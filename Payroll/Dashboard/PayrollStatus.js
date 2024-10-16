import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DragCard from "../../common/DragCard";
import { Link } from "react-router-dom";
import ProgressBarMulti from "./ProgressBarMulti";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import dayjs from "dayjs";
import { fetchCompanyDetails } from "../../common/Functions/commonFunction";
import { NoData } from "../../common/SVGFiles";

const PayrollStatus = React.memo(() => {
  const { t } = useTranslation();

  const [
    companyTotalPayrollStatusPaymentData,
    setCompanyTotalPayrollStatusPaymentData,
  ] = useState(null);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [currentMonthYear, setCurrentMonthYear] = useState(
    dayjs().format("MMMM YYYY")
  );
  const [companyDetails, setCompanyDetails] = useState(null);

  const {
    totalEmployeeCount = 0,
    totalSettledCount = 0,
    totalPendingCount = 0,
    totalUnpaidCount = 0,
    getlatestEntries = [],
  } = companyTotalPayrollStatusPaymentData || {};

  const getPayrollDetailsInDashboardForPayrollStatusView = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_PAYROLL_DETAILS_FOR_PAYROLL_STATUS_IN_DASHBOARD,
        {
          companyId: companyId,
          salaryPayoutMonthYear: currentMonthYear,
        }
      );
      // console.log(result?.result, "data of payroll status deatial");
      setCompanyTotalPayrollStatusPaymentData(result?.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getPayrollDetailsInDashboardForPayrollStatusView();
  }, [currentMonthYear]);

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format("MMM YYYY");
    setCurrentMonthYear(formattedDate);
  };

  let categories = [
    {
      label: "Successfully Paid",
      percentage:
        totalEmployeeCount === 0
          ? 0
          : Math.floor((totalSettledCount / totalEmployeeCount) * 100),
      color: "#61C451",
    },
    {
      label: "Pending",
      percentage:
        totalEmployeeCount === 0
          ? 0
          : Math.floor((totalPendingCount / totalEmployeeCount) * 100),
      color: "#FAC35A",
    },
    {
      label: "Unpaid",
      percentage:
        totalEmployeeCount === 0
          ? 0
          : Math.floor((totalUnpaidCount / totalEmployeeCount) * 100),
      color: "#F97952",
    },
  ];

  const nonZeroCategories = categories.filter(
    (category) => category.percentage > 0
  );

  if (
    nonZeroCategories.length === 1 &&
    nonZeroCategories[0].percentage === 100
  ) {
    categories = nonZeroCategories;
  }

  if (categories.every((category) => category.percentage === 0)) {
    categories = [];
  }

  const getCompanyIdFromLocalStorage = () => {
    return localStorage.getItem("companyId");
  };

  useEffect(() => {
    const companyId = getCompanyIdFromLocalStorage();
    if (companyId) {
      fetchCompanyDetails(companyId).then((details) =>
        setCompanyDetails(details)
      );
    }

    const handleStorageChange = () => {
      const companyId = getCompanyIdFromLocalStorage();
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

  return (
    <DragCard header={t("Payroll_Status")} className="h-full">
      <div className="flex flex-col gap-4 p-3">
        <p className="subhead">
          {totalEmployeeCount} {t("Employees")}
        </p>
        {categories.length > 0 && (
          <ProgressBarMulti categories={categories} barClassName="h-2.5" />
        )}

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="subhead">{t("Latest_Payments")}</p>
            <Link to="/payrollTable" className="text-xs link text-grey">
              View All
            </Link>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto h-60">
            {getlatestEntries.length === 0 ? (
              // <p className="text-center text-grey">{t("No Data")}</p>
              <NoData />
            ) : (
              getlatestEntries.map((payment, index) => (
                <div className="flex items-center justify-between" key={index}>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-semibold pblack">
                        {payment.employeeName}
                      </p>
                      <p className="text-[7px] 2xl:text-xs text-grey">
                        {payment.designation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <p
                      className={`text-[7px] 2xl:text-xs px-2 py-0.5 rounded-full  ${
                        payment.isSalaryHold === "0"
                          ? " bg-green-500/10 text-green-500 dark:bg-green-500/20"
                          : " bg-red-500/10 text-red-500 dark:bg-red-500/20"
                      }`}
                    >
                      {payment.isSalaryHold === "0" ? "Paid" : "Unpaid"}
                    </p>
                    <p className="font-semibold pblack">
                      {companyDetails?.currency === "AED"
                        ? `${
                            parseFloat(payment.netsalary)?.toFixed(2) || "0.00"
                          } ${companyDetails?.currency}`
                        : `${companyDetails?.currency} ${
                            parseFloat(payment.netsalary)?.toFixed(2) || "0.00"
                          }`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DragCard>
  );
});

export default PayrollStatus;
