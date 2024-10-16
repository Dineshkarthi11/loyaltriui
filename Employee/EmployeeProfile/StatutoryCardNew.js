import React, { useEffect, useState } from "react";
import Heading2 from "../../common/Heading2";
import FlexCol from "../../common/FlexCol";
import { fetchCompanyDetails } from "../../common/Functions/commonFunction";
import { NoData } from "../../common/SVGFiles";

export default function StatutoryCardNew({ data, companyData }) {
  // console.log(data, "statutorydata");
  const [companyDetails, setCompanyDetails] = useState([]);
  const getMonthlyAmount = (amountString) => {
    if (!amountString) return 0;
    // Extract the numeric part from the amount string
    const amount = parseFloat(amountString.toString().replace(/[^\d.-]/g, ""));
    return isNaN(amount) ? 0 : amount;
  };

  // const formatYearlyAmount = (amount) => {
  //   // Calculate yearly amount
  //   return amount * 12;
  // };

  const formatTitle = (title) => {
    switch (title) {
      case "Enable EPF Contribution":
        return "EPF";
      case "Enable ESI Contribution":
        return "ESI";
      case "Enable Professional Tax":
        return "ProfessionalTax(PT)";
      case "Enable Labour Welfare Fund":
        return "LabourWelfareFund(LWF)";
      default:
        return title;
    }
  };

  // const extractContributionType = (title) => {
  //   const parts = title.split(" ");
  //   return parts.length > 1 ? parts[1] : title;
  // };
  // const getCompanyIdFromLocalStorage = () => {
  //   return localStorage.getItem("companyId");
  // };
  // useEffect(() => {
  //   const companyId = getCompanyIdFromLocalStorage();
  //   if (companyId) {
  //     fetchCompanyDetails(companyId).then((details) =>
  //       setCompanyDetails(details)
  //     );
  //   }

  //   const handleStorageChange = () => {
  //     const companyId = getCompanyIdFromLocalStorage();
  //     if (companyId) {
  //       fetchCompanyDetails(companyId).then((details) =>
  //         setCompanyDetails(details)
  //       );
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);
  // console.log(companyDetails.currency, "ccc");
  return (
    <div className="p-3 rounded-lg borderb">
      <div className="flex items-center justify-between">
        <Heading2
          title="Statutory Components"
          description="Gain insights into your compensation package with our salary overview"
        />
        {/* <ButtonClick buttonName={"Edit Statutory Components"} /> */}
      </div>

      <div className="grid grid-cols-4 justify-around text-xs 2xl:text-sm text-grey pt-4">
        <p className="px-4 text-left">Components</p>
        <p className="px-4 text-center">Type</p>
        <p className="px-4 text-center">Deduction Cycle</p>
        <p className="px-4 text-center">Monthly</p>
        {/* <p className="px-4 text-center">Yearly</p> */}
      </div>

      <FlexCol gap={12}>
        {data?.length === 0 ? (
          <div className="flex justify-center items-center w-full h-full">
            <NoData />
          </div>
        ) : (
          data.map((item, index) => (
            <div
              key={index}
              className={`bg-primaryalpha/10 dark:bg-primaryalpha/20 rounded-lg px-4 ${
                index === 0 ? "mt-4" : ""
              }`}
            >
              <div className="grid grid-cols-4 items-center justify-around text-xs 2xl:text-sm">
                <div className="py-3">
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold text-sm 2xl:text-base">
                      {formatTitle(item.title)}
                    </p>
                    <p className="font-medium text-grey">
                      Employee Contribution
                    </p>
                  </div>
                </div>
                <p className="py-3 text-center">Fixed</p>
                <p className="py-3 text-center">{item.DeductionCyle}</p>
                <p className="py-3 text-center">
                  {/* {getMonthlyAmount(item.employeeContribution)} */}
                  {companyData?.currency && companyData.currency.length > 1
                    ? `${parseFloat(getMonthlyAmount(item.employeeContribution))
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                        companyData.currency
                      }`
                    : `${companyData?.currency} ${parseFloat(
                        getMonthlyAmount(item.employeeContribution)
                      )
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                </p>
                {/* <p className="py-3 text-center">
                {formatYearlyAmount(
                  getMonthlyAmount(item.employeeContribution)
                )}
              </p> */}
              </div>
              <div className="divider-h"></div>
              <div className="grid grid-cols-4 items-center justify-around text-xs 2xl:text-sm">
                <div className="py-3">
                  <p className="font-medium text-grey">Employer Contribution</p>
                </div>
                <p className="py-3 text-center">Fixed</p>
                <p className="py-3 text-center">{item.DeductionCyle}</p>
                <p className="py-3 text-center">
                  {/* {getMonthlyAmount(item.employerContribution)} */}
                  {companyData?.currency && companyData.currency.length > 1
                    ? `${parseFloat(getMonthlyAmount(item.employerContribution))
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                        companyData.currency
                      }`
                    : `${companyData?.currency} ${parseFloat(
                        getMonthlyAmount(item.employerContribution)
                      )
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                </p>
                {/* <p className="py-3 text-center">
                {formatYearlyAmount(
                  getMonthlyAmount(item.employerContribution)
                )}
              </p> */}
              </div>
            </div>
          ))
        )}
      </FlexCol>
    </div>
  );
}
