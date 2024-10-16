import React, { useEffect, useState } from "react";
import { Flex, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";

import DrawerPop from "../common/DrawerPop";
import { action } from "../Api";
import FlexCol from "../common/FlexCol";
import Heading from "../common/Heading";
import FormInput from "../common/FormInput";
import FileUpload from "../common/FileUpload";

import { loanPolicy } from "../data";
import Dropdown from "../common/Dropdown";
import PAYROLLAPI, { Payrollaction } from "../PayRollApi";
import Heading2 from "../common/Heading2";

export default function EmployeeLoanViewPage({
  open,
  close = () => {},
  employeeLoanId,
}) {
  const { t } = useTranslation();
  const [newLoanRequest, setNewLoanRequest] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loanType, setLoanType] = useState(1);

  const [loanPolicyDetails, setLoanPolicyDetails] = useState({});
  const [loanDetails, setLoanDetails] = useState({});
  const [repaymentPlan, setRepaymentPlan] = useState([]);
  const [attachment,setAttachment]=useState()
//   const tableData = [
//     {
//       installedNumber: 1,
//       amountToPay: "AED 200.41",
//       outstanding: "AED 5402.32",
//     },
//     {
//       installedNumber: 1,
//       amountToPay: "AED 200.41",
//       outstanding: "AED 5402.32",
//     },
//     {
//       installedNumber: 1,
//       amountToPay: "AED 200.41",
//       outstanding: "AED 5402.32",
//     },
//     {
//       installedNumber: 1,
//       amountToPay: "AED 200.41",
//       outstanding: "AED 5402.32",
//     },
//   ];

  const handleClose = () => {
    close(false);
    setNewLoanRequest(false);
  };

  console.log(employeeLoanId, "employee loan id data");

  const getEmployeeLoanViewRecordsByIds = async (employeeLoanId) => {
    const result = await Payrollaction(
      PAYROLLAPI.GET_EMPLOYEE_LOAN_REQUEST_RECORDS_BY_ID,
      {
        id: employeeLoanId,
      }
    );

    if (result.status === 200 && result.result.length > 0) {
      const loanData = result.result[0];
      setAttachment(loanData.attachments)
      setLoanPolicyDetails(loanData.tempdataloanPolicyDetails);
      setLoanDetails({
        amount: loanData.amount,
        reason: loanData.reason,
        tenureMonths: loanData.tenureMonths,
      });
      setRepaymentPlan(loanData.tenureAmountData);
    } else {
      // Handle errors here
      console.error("Error fetching loan data", result.message);
    }
  };

  useEffect(() => {
    getEmployeeLoanViewRecordsByIds(employeeLoanId);
  }, [employeeLoanId]);

  return (
    <DrawerPop
      background="#F8FAFC"
      open={newLoanRequest}
      close={(e) => {
        handleClose();
        close(e);
      }}
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
      header={[
        t("Employee Loan Request Details"),
        t("Employee Loan Request Details"),
      ]}
      footer={false}
    >
      <Flex justify="center" align="center" className="md:w-5/6 m-auto">
        <FlexCol>
          <FlexCol className={"border rounded-xl bg-white dark:bg-dark p-4"}>
            <Heading2
              title={t("Loan Policy")}
              description={t("Selected loan policy")}
              className={"bg-primaryalpha/10 p-3 rounded-lg dark:bg-gray-800"}
            />
            <div className="text-sm vhcenter">
              {t("Following Loan policy has been selected by the employee")}
            </div>
            <div className="flex flex-wrap items-center gap-3 dark:text-white vhcenter">
              <div
                className={`col-span-4 p-4 border rounded-2xl cursor-pointer showDelay dark:bg-dark md:w-80 ${
                  loanType === loanPolicyDetails.loanPolicyId &&
                  "border-primary "
                } `}
                // onClick={() => {
                //   setLoanType(loanPolicyDetails.loanPolicyId);
                // }}
              >
                <div className="flex justify-between items-start">
                  <div className=" flex flex-col gap-2">
                    <h3 className=" text-sm font-semibold">
                      {loanPolicyDetails.loanPolicyName}
                    </h3>
                    <p className=" text-xs font-medium text-[#667085] pt-2">
                      {loanPolicyDetails.description}
                    </p>
                    <p className="flex justify-between pt-4 gap-1">
                      <p className="flex flex-col p-1  border rounded-lg">
                        <span className="text-xs text-[#667085]">
                          {t("Min Loan Amount")}
                        </span>
                        <span className="font-semibold">
                          {loanPolicyDetails.minimumValue}
                        </span>
                      </p>
                      <p className="flex flex-col p-1 border rounded-lg">
                        <span className="text-xs text-[#667085]">
                          {t("Max Loan Amount")}
                        </span>
                        <span className="font-semibold">
                          {loanPolicyDetails.maximumValue}
                        </span>
                      </p>
                    </p>
                  </div>
                  <div
                    className={`${
                      loanType === loanPolicyDetails.loanPolicyId &&
                      "border-primary"
                    } border  rounded-full`}
                  >
                    <div
                      className={`font-semibold text-base w-4 h-4 border-2 border-white rounded-full ${
                        loanType === loanPolicyDetails.loanPolicyId &&
                        "text-primary bg-primary"
                      } `}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </FlexCol>
         
          {loanPolicyDetails.length !== 0 &&(

<>
          <FlexCol className={"border rounded-xl dark:bg-dark bg-white p-4"}>
            <Heading2
              title={t("Loan Details")}
              description={t(
                "Enter the particulars regarding the loan you need"
              )}
              className={"bg-primaryalpha/10 p-3 rounded-lg dark:bg-gray-800"}
            />
            <div className="flex flex-col gap-3 md:w-2/3 mx-auto">
              <FormInput
                title={t("Loan amount")}
                placeholder={t("Loan amount")}
                description={`Min Loan Amount ${loanPolicyDetails.minimumValue} - Max Loan Amount ${loanPolicyDetails.maximumValue}`}
                value={loanDetails.amount}
                change={() => {}}
                error={""}
                disabled={true}
              />
              <FormInput
                title={t("Purpose")}
                placeholder={t("Reason")}
                value={loanDetails.reason}
                change={() => {}}
                error={""}
                disabled={true}
              />
              <Dropdown
                title={t("Tenure (in months)")}
                placeholder={t("Choose")}
                value={loanDetails.tenureMonths}
                change={() => {}}
                options={[]}
                className="text-sm "
                description={t("Please explain why you require a loan.")}
                disabled={true}
              />
              <div className="flex flex-col gap-2 text-sm text-gray-900 mt-4">
                {t(
                  "Please upload any relevant document to be considered with the loan request."
                )}
                {/* <FileUpload change={() => {}} /> */}
                {attachment !== null && attachment !== undefined ? <a href={attachment} target="_blank"> {attachment.substring(attachment.lastIndexOf('/') + 1, attachment.indexOf('?'))}</a> : <FileUpload change={() => {}} />}
              </div>
            </div>
          </FlexCol>

          <FlexCol className={"border rounded-xl dark:bg-dark bg-white p-4"}>
            <Heading2
              title={t("Repayment Plan")}
              description={t("Have a look at your payments scheduled")}
              className={"bg-primaryalpha/10 p-3 rounded-lg dark:bg-gray-800"}
            />
            <div className="border rounded-lg p-2">
              <table className="w-full table-auto">
                <thead className="borderb rounded-lg dark:bg-dark bg-[#F4F4F4]">
                  <tr className="text-grey">
                    <th className="px-4 py-2">{t("Installment Number")}</th>
                    <th className="px-4 py-2">{t("Amount to Pay")}</th>
                    <th className="px-4 py-2">{t("Outstanding")}</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {repaymentPlan.map((data, index) => {
                    const outstanding =
                      loanDetails.amount - data.amount * (index + 1);
                    return (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{data.EMI}</td>
                        <td className="px-4 py-2">{data.amount}</td>
                        <td className="px-4 py-2">{outstanding}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </FlexCol>
          </>
           )}
           
        </FlexCol>
      </Flex>
    </DrawerPop>
  );
}
