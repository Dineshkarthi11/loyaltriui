import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import mnthoverview from "../../../assets/images/mnthoverview.png";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import Avatar from "../../common/Avatar";
import Heading2 from "../../common/Heading2";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import { Flex } from "antd";
import { fetchCompanyDetails } from "../../common/Functions/commonFunction";

export default function SalaryStructureTablePerDay({
  open = "",
  close = () => {},
  updateId = "",
  employee,
}) {
  const { t } = useTranslation();
  const [companyId] = useState(localStorage.getItem("companyId"));
  const [currentYear] = useState(new Date().getFullYear());
  const [year] = useState(currentYear);
  const [show, setShow] = useState(open);
  const [structureSalaryDetails, setStructureSalaryDetails] = useState({
    basicSalary: "0.00",
    allowence: "0.00",
    deductions: "0.00",
    earningsList: [],
    deductionList: [],
    statutoryList: [],
    additionAdjustments: [],
    workExpense: [],
    deductionAdjustments: [],
  });
  const [employeeInfo, setEmployeeInfo] = useState({
    employeeId: "",
    name: "",
    profilePicture: null,
    designation: "",
  });
  const [salaryTemplate, setSalaryTemplate] = useState("");
  const [grossEarnings, setGrossEarnings] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [netPayable, setNetPayable] = useState(0);
  const [companyDetails, setCompanyDetails] = useState("");

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

  const getSalaryStructureDetails = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYEE_DASHBOARD_PAYROLL_VIEW_DATA,
        {
          companyId,
          employeeId: employee,
          year,
        }
      );
      const {
        StructureSalaryDetails = {},
        employeeInfo = {},
        salaryTemplateName = "",
        CurrentSalaryDetails = {},
      } = result.result || {};

      const earningsList = (CurrentSalaryDetails.earningsList || []).map(
        (earning) => ({
          earningsName: earning.earningsName,
          NetAmount: earning.amount,
          YearlyAmount: earning.amount * 12,
        })
      );

      const additionAdjustments = (
        CurrentSalaryDetails.additionAdjustments || []
      ).map((addition) => ({
        additionName: addition.additionName,
        amount: parseFloat(addition.amount),
      }));

      const workExpense = (CurrentSalaryDetails.workExpense || []).map(
        (expense) => ({
          categoryName: expense.categoryName,
          amount: parseFloat(expense.amount),
        })
      );

      const deductionList = (CurrentSalaryDetails.deductionList || []).map(
        (deduction) => ({
          deductionName: deduction.deductionName,
          NetAmount: deduction.amount,
          YearlyAmount: deduction.amount * 12,
        })
      );

      const deductionAdjustments = (
        CurrentSalaryDetails.deductionAdjustments || []
      ).map((deduction) => ({
        deductionName: deduction.deductionName,
        amount: parseFloat(deduction.amount),
      }));

      const grossEarnings =
        earningsList.reduce((sum, item) => sum + item.NetAmount, 0) +
        additionAdjustments.reduce((sum, item) => sum + item.amount, 0)+
        workExpense.reduce((sum, item) => sum + item.amount, 0);

      

      const totalDeductions =
        deductionList.reduce((sum, item) => sum + item.NetAmount, 0) +
        deductionAdjustments.reduce((sum, item) => sum + item.amount, 0);

      const netPayable = grossEarnings - totalDeductions;

      setStructureSalaryDetails({
        ...StructureSalaryDetails,
        earningsList,
        additionAdjustments,
        workExpense,
        deductionList,
        deductionAdjustments,
      });
      setEmployeeInfo(employeeInfo);
      setSalaryTemplate(salaryTemplateName);
      setGrossEarnings(grossEarnings);
      setTotalDeductions(totalDeductions);
      setNetPayable(netPayable);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getSalaryStructureDetails();
  }, []);

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
      close={handleClose}
      header={[
        t("Live Salary"),
        t(
          "Gain insights into your compensation package with our salary Per Day overview"
        ),
      ]}
      footer={false}
    >
      <FlexCol
        className={"max-w-[1077px] m-auto borderb rounded-xl bg-white p-2 dark:bg-dark"}
      >
        <div className="borderb rounded-xl px-4 py-3 bg-white dark:bg-dark">
          <div className="flex flex-col gap-1.5 md:flex-row md:gap-0 items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                image={employeeInfo.profilePicture || ""}
                name={employeeInfo.name}
                className="size-10"
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm 2xl:text-base">
                    {employeeInfo.name}
                  </p>
                  <div className="px-2 py-0.5 rounded-full bg-primaryalpha/10 text-primary text-xs 2xl:text-sm font-medium">
                    {`EMP Id: # ${employeeInfo.code}`}
                  </div>
                </div>
                <p className="text-[10px] 2xl:text-xs text-grey">
                  {employeeInfo.designation} | {employeeInfo.joiningDate}
                </p>
              </div>
            </div>
            <div className="borderb px-4 py-2 flex flex-col gap-2 bg-[#F9F9F9] dark:bg-[#303030] rounded-lg items-start max-w-[163px]">
              <p className="font-semibold text-xs 2xl:text-sm">
                Salary Template
              </p>
              <p className="text-grey text-[10px] 2xl:text-sm">
                {salaryTemplate}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FlexCol>
            <div className="text-center borderb bg-primary text-white p-2 font-bold rounded-md gap-2">
              Earnings
            </div>
            <div className="borderb rounded-xl bg-white p-2 dark:bg-gray-700">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F6F4FF] dark:bg-primaryalpha/50 rounded-md text-left">
                    <th className="p-2">Earnings Name</th>
                    <th className="p-2">NetAmount</th>
                  </tr>
                </thead>
                <tbody className="bg-[#FAFAFA] dark:bg-gray-700">
                  {structureSalaryDetails.earningsList.length > 0 ? (
                    structureSalaryDetails.earningsList.map(
                      (earning, index) => (
                        <tr key={index}>
                          <td className="p-2">{earning.earningsName}</td>
                          <td className="p-2">
                            {companyDetails?.currency &&
                            companyDetails.currency.length > 1
                              ? `${earning.NetAmount.toFixed(2).replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                )} ${companyDetails.currency}`
                              : `${
                                  companyDetails.currency
                                } ${earning.NetAmount.toFixed(2).replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                )}`}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center p-4 text-gray-500">
                        No data
                      </td>
                    </tr>
                  )}

                  {/* Additions */}
                  {structureSalaryDetails.additionAdjustments.length > 0 && (
                    <>
                      <tr>
                        <td colSpan="2" className="text-center font-bold p-2">
                          Additions
                        </td>
                      </tr>
                      {structureSalaryDetails.additionAdjustments.map(
                        (addition, index) => (
                          <tr key={index}>
                            <td className="p-2">{addition.additionName}</td>
                            <td className="p-2">
                              {companyDetails?.currency &&
                              companyDetails.currency.length > 1
                                ? `${addition.amount
                                    .toFixed(2)
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                                    companyDetails.currency
                                  }`
                                : `${companyDetails.currency} ${addition.amount
                                    .toFixed(2)
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                            </td>
                          </tr>
                        )
                      )}
                    </>
                  )}

                  {/* Work Expense */}
                  {structureSalaryDetails.workExpense.length > 0 && (
                    <>
                      <tr>
                        <td colSpan="2" className="text-center font-bold p-2">
                          Work Expense
                        </td>
                      </tr>
                      {structureSalaryDetails.workExpense.map(
                        (expense, index) => (
                          <tr key={index}>
                            <td className="p-2">{expense.categoryName}</td>
                            <td className="p-2">
                              {companyDetails?.currency &&
                              companyDetails.currency.length > 1
                                ? `${expense.amount
                                    .toFixed(2)
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                                    companyDetails.currency
                                  }`
                                : `${companyDetails.currency} ${expense.amount
                                    .toFixed(2)
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                            </td>
                          </tr>
                        )
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </FlexCol>

          <FlexCol>
            <div className="text-center borderb bg-primary text-white p-2 font-bold rounded-md gap-2">
              Deductions
            </div>
            <div className="borderb rounded-xl bg-white p-2 dark:bg-gray-700">
              <table className="w-full border-collapse">
                <thead className="rounded-xl">
                  <tr className="bg-[#F6F4FF] dark:bg-primaryalpha/50 rounded-md text-left">
                    <th className="p-2">Deductions Name</th>
                    <th className="p-2">NetAmount</th>
                  </tr>
                </thead>
                <tbody className="bg-[#FAFAFA] dark:bg-gray-700">
                  {structureSalaryDetails.deductionList.length > 0 ? (
                    structureSalaryDetails.deductionList.map(
                      (deduction, index) => (
                        <tr key={index}>
                          <td className="p-2">{deduction.deductionName}</td>
                          <td className="p-2">
                            {companyDetails?.currency &&
                            companyDetails.currency.length > 1
                              ? `${deduction.NetAmount.toFixed(2).replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                )} ${companyDetails.currency}`
                              : `${
                                  companyDetails.currency
                                } ${deduction.NetAmount.toFixed(2).replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                )}`}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center p-4 text-gray-500">
                        No data
                      </td>
                    </tr>
                  )}

                  {/* Deduction Adjustments */}
                  {structureSalaryDetails.deductionAdjustments.length > 0 && (
                    <>
                      <tr>
                        <td colSpan="2" className="text-center font-bold p-2">
                          Deductions
                        </td>
                      </tr>
                      {structureSalaryDetails.deductionAdjustments.map(
                        (deduction, index) => (
                          <tr key={index}>
                            <td className="p-2">{deduction.deductionName}</td>
                            <td className="p-2">
                              {companyDetails?.currency &&
                              companyDetails.currency.length > 1
                                ? `${deduction.amount
                                    .toFixed(2)
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                                    companyDetails.currency
                                  }`
                                : `${companyDetails.currency} ${deduction.amount
                                    .toFixed(2)
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                            </td>
                          </tr>
                        )
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </FlexCol>
        </div>

        <Flex
          gap={14}
          justify="space-between"
          align="center"
          className="w-full p-4 pr-4 borderb rounded-xl bg-white dark:bg-black"
        >
          <div className="flex flex-col sm:flex-row items-center w-full gap-3 mt-auto">
            <div className="flex flex-1 justify-between">
              <p className="justify-start font-semibold text-xs 2xl:text-sm text-primaryalpha">
                Gross Earnings
              </p>
              <p className="justify-end font-semibold text-xs 2xl:text-sm text-primaryalpha">
                {companyDetails?.currency && companyDetails.currency.length > 1
                  ? `${grossEarnings
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                      companyDetails.currency
                    }`
                  : `${companyDetails.currency} ${grossEarnings
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
              </p>
            </div>
            <p className="text-grey hidden sm:block">{`|`}</p>
            <div className="flex flex-1 justify-between">
              <p className="justify-start font-semibold text-xs 2xl:text-sm text-red-500">
                Total Deductions
              </p>
              <p className="justify-end font-semibold text-xs 2xl:text-sm text-red-500">
                {companyDetails?.currency && companyDetails.currency.length > 1
                  ? `${totalDeductions
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                      companyDetails.currency
                    }`
                  : `${companyDetails.currency} ${totalDeductions
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
              </p>
            </div>
          </div>
        </Flex>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between bordert pl-4 pt-4 pr-4">
            <p className="text-xs 2xl:text-sm font-medium">
              Net Payable Amount{" "}
              <span className="text-xs text-grey">
                (Gross Earnings & Deductions)
              </span>
            </p>
            <p className="text-sm 2xl:text-base font-semibold">
              {companyDetails?.currency && companyDetails.currency.length > 1
                ? `${netPayable
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                    companyDetails.currency
                  }`
                : `${companyDetails.currency} ${netPayable
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
            </p>
          </div>
        </div>
      </FlexCol>
    </DrawerPop>
  );
}
