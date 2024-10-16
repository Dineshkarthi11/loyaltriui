import React, { useEffect, useState } from "react";
import DragCard from "../../common/DragCard";
import { useTranslation } from "react-i18next";
import { PiMoney } from "react-icons/pi";
import ButtonClick from "../../common/Button";
import { Link } from "react-router-dom";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import dayjs from "dayjs";
import { fetchCompanyDetails } from "../../common/Functions/commonFunction";

const TotalEarnings = React.memo(() => {
  const [companyTotalPaymentData, setCompanyTotalPaymentData] = useState([]);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [currentMonthYear, setCurrentMonthYear] = useState(
    dayjs().format("MMMM YYYY")
  );
  const [companyDetails, setCompanyDetails] = useState(null);

  const { t } = useTranslation();

  const getPayrollDetailsInDashboardForTotalPayementView = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_PAYROLL_DETAILS_FOR_NET_TRANSACTIONS_IN_DASHBOARD,
        {
          companyId: companyId,
          salaryPayoutMonthYear: currentMonthYear,
        }
      );
      // console.log(result?.result, "data of payroll payement deatial");
      setCompanyTotalPaymentData(result?.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getPayrollDetailsInDashboardForTotalPayementView();
  }, [currentMonthYear]);

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format("MMM YYYY");
    setCurrentMonthYear(formattedDate);
  };

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


  // console.log(companyDetails?.currency, "companyDetails")

  return (
    <DragCard className="h-full" isHeader={false}>
      <div className="relative h-full">
        <div className="rounded-xl overflow-hidden absolute top-0 left-0 h-[93px] bg-primaryalpha/30 w-full z-0">
          {/* <TotalHeader /> */}
        </div>

        <div className="relative z-10 flex flex-col items-center justify-between h-full gap-4 pt-12">
          <div className="overflow-hidden rounded-full shadow-2xl size-20 bg-primary vhcenter shadow-primaryalpha/80">
            <PiMoney size={36} className="text-white" />
          </div>

          {companyTotalPaymentData && (
            <>
              <h1 className="!font-bold h1">
                {companyDetails?.currency === "AED"
                  ? `${Number(companyTotalPaymentData?.totalNetPay?.toFixed(2) ?? '0.00').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${companyDetails?.currency}`
                  : `${companyDetails?.currency} ${Number(companyTotalPaymentData?.totalNetPay?.toFixed(2) ?? '0.00').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </h1>


              <p className="pblack !text-primary font-semibold">
                {companyDetails?.currency === "AED"
                  ? `${Number(companyTotalPaymentData?.processedPay?.toFixed(2) ?? '0.00').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${companyDetails?.currency}`
                  : `${companyDetails?.currency} ${Number(companyTotalPaymentData?.processedPay?.toFixed(2) ?? '0.00').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </p>


              <p className="text-[8px] 2xl:text-xs dark:text-white">
                {" "}
                <span className="text-grey">Process till data</span>{" "}
                <span>{currentMonthYear}</span>
              </p>
              <p className="text-[8px] 2xl:text-xs text-[#F01E1E] font-medium">
                Total Unpaid:
                {companyDetails?.currency === "AED"
                  ? `${Number(companyTotalPaymentData?.totalUnpaid?.toFixed(2) ?? '0.00').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${companyDetails?.currency}`
                  : `${companyDetails?.currency} ${Number(companyTotalPaymentData?.totalUnpaid?.toFixed(2) ?? '0.00').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </p>


            </>
          )}

          <Link
            to="/payrollTable"
            className="w-full h-[50px] flex items-center justify-center bg-primaryalpha text-white rounded-md hover:bg-primaryalpha/80 hover:text-white transition-colors duration-200"
          >
            {t("View Payroll Table")}
          </Link>
        </div>
      </div>
    </DragCard>
  );
});

export default TotalEarnings;
