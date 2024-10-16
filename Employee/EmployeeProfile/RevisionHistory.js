import React, { useEffect, useMemo, useState } from "react";
import mnthoverview from "../../../assets/images/mnthoverview.png";
import DrawerPop from "../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import FlexCol from "../../common/FlexCol";
import Avatar from "../../common/Avatar";
import Heading2 from "../../common/Heading2";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import { fetchCompanyDetails } from "../../common/Functions/commonFunction";

export default function RevisionHistory({
  open = "",
  close = () => { },
  employee,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [year, setYear] = useState(currentYear);
  const [employeeInfo, setEmployeeInfo] = useState({});
  const [revisionHistory, setRevisionHistory] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const handleClose = () => {
    setShow(false);
  };

  const getRevisionHistoryList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYEE_DASHBOARD_PAYROLL_VIEW_DATA,
        {
          companyId: companyId,
          employeeId: employee,
          year: year,
        }
      );
      const { employeeInfo, revisionHistory } = result?.result;
      setEmployeeInfo(employeeInfo);
      setRevisionHistory(revisionHistory);
      // console.log(result?.result, "data of getRevisionHistoryList ");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getRevisionHistoryList();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString)
      .toLocaleDateString("en-GB", options)
      .replace(/\//g, "-");
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
  // console.log(companyDetails.currency, "ccc");


  return (
    <DrawerPop
      open={show}
      placement="bottom"
      background="#F8FAFC"
      avatar={true}
      src={mnthoverview}
      contentWrapperStyle={{
        position: "absolute",
        height: "100%",
        top: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        borderRadius: 0,
        borderTopLeftRadius: "0px !important",
        borderBottomLeftRadius: 0,
      }}
      close={(e) => {
        handleClose();
      }}
      header={[
        t("Revision History"),
        t(
          "Gain insights into your compensation package with our salary overview"
        ),
      ]}
      footer={false}
    >
      <FlexCol className={"max-w-[1076px] mx-auto"}>
        <div className="borderb rounded-xl px-4 py-3 bg-white dark:bg-dark">
          <div className="flex items-center gap-2">
            <Avatar
              image={employeeInfo.profilePicture || ""}
              name={employeeInfo.name || ""}
              className="size-10"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm 2xl:text-base">
                  {employeeInfo.name || "Employee Name"}
                </p>
                <div className="px-2 py-0.5 rounded-full bg-primaryalpha/10 text-primary text-xs 2xl:text-sm font-medium">
                  {`EMP Id: # ${employeeInfo.code || "123213"}`}
                </div>
              </div>
              <p className="text-[10px] 2xl:text-xs text-grey">
                {employeeInfo.designation || "Designation"}
              </p>
            </div>
          </div>
        </div>

        <div className="borderb rounded-xl p-2 bg-white dark:bg-dark">
          <Heading2
            title="Salary Revisions"
            description={`Total ${revisionHistory.length} revision history`}
            className="bg-primaryalpha/10 dark:-primaryalpha/20  rounded-md p-3"
          />
          <table className="min-w-full border-collapse table-fixed">
            <thead>
              <tr className="text-[10px] 2xl:text-xs text-gray-500 h-11 2xl:h-12">
                <th className="px-4 text-left font-normal">Previous Salary</th>
                <th className="px-4 text-left font-normal">Revised Salary</th>
                <th className="px-4 text-left font-normal">Status</th>
                <th className="px-4 text-left font-normal">Change%</th>
                <th className="px-4 text-left font-normal">Effective Date</th>
                <th className="px-4 text-left font-normal">Created Date</th>
                <th className="px-4 text-left font-normal">Initiated Date</th>
              </tr>
            </thead>
            <tbody>
              {revisionHistory.map((row, index) => (
                <tr
                  key={index}
                  className="text-[10px] 2xl:text-xs h-11 2xl:h-12 font-semibold"
                >
                  <td className="px-4 border-b">

                     {companyDetails?.currency && companyDetails.currency.length > 1
                      ? `${(row.oldGrossSalary != null ? parseFloat(row.oldGrossSalary).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','):"0")} ${companyDetails.currency}`
                      : `${companyDetails?.currency ?? 'Currency'} ${(row.oldGrossSalary != null ? parseFloat(row.oldGrossSalary).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','):"0")}`}

                  </td>
                  <td className="px-4 border-b">

                    {companyDetails?.currency && companyDetails.currency.length > 1
                      ? `${parseFloat(row.newGrossSalary).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${companyDetails.currency}`
                      : `${companyDetails?.currency} ${parseFloat(row.newGrossSalary).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                  </td>
                  <td className="px-4 border-b">
                    {/* Status is currently empty */}
                    --
                    <div
                      className={`px-2 py-0.5 text-[10px] w-fit rounded-full`}
                    ></div>
                  </td>
                  <td className="px-4 border-b">{parseFloat(row.changePercentage).toFixed(2)}%
                    

                  </td>
                  <td className="px-4 border-b">
                    {formatDate(row.newWithEffectFrom)}
                  </td>
                  <td className="px-4 border-b">{formatDate(row.createdOn)}</td>
                  <td className="px-4 border-b">
                    {formatDate(row.newWithEffectFrom)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FlexCol>
    </DrawerPop>
  );
}
