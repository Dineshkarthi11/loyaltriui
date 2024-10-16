
import React, { useEffect, useState } from "react";
import FormInput from "../common/FormInput";
import ToggleBtn from "../common/ToggleBtn";
import TimeSelect from "../common/TimeSelect";
import CheckBoxInput from "../common/CheckBoxInput";
import DrawerPop from "../common/DrawerPop";
import { Flex, Radio, notification } from "antd";
import Dropdown from "../common/Dropdown";
import TextArea from "../common/TextArea";
import RadioButton from "../common/RadioButton";
import ButtonClick from "../common/Button";
import FlexCol from "../common/FlexCol";
import Avatar from "../common/Avatar";
import DateSelect from "../common/DateSelect";
import { useFormik } from "formik";
import API, { action } from "../Api";
import PAYROLLAPI, { Payrollaction } from "../PayRollApi";
import { GoDotFill } from "react-icons/go";

const MyLoanStatusViewPage = ({ open, details, employeeLoanId, close = () => { } }) => {
  const [show, setShow] = useState(open);
  const [selectedOption, setSelectedOption] = useState(0);
  const [loanDetails, setLoanDetails] = useState(null);



  const handleClose = () => {
    close();
    setShow(false);
  };

  const getEmployeeLoanViewRecordsByIds = async (employeeLoanId) => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYEE_LOAN_REQUEST_RECORDS_BY_ID,
        {
          id: employeeLoanId,
        }
      );

      if (result.status === 200) {
        setLoanDetails(result.result[0]);
      }

      // console.log(result, "resultdataa");
    } catch (error) {
      // console.error("Error fetching employee loan records:", error);
    }
  };


  useEffect(() => {
    if (employeeLoanId) {
      getEmployeeLoanViewRecordsByIds(employeeLoanId);
    }
  }, [employeeLoanId]);

  const getStatusLabel = (status, approvedDate) => {
    switch (status) {
      case "0":
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs 2xl:text-sm font-semibold text-orange-500">
              Pending
            </span>
            <span className="text-[10px] 2xl:xs text-grey">
              {approvedDate}
            </span>
          </div>
        );
      case "1":
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs 2xl:text-sm font-semibold text-green-500">
              Approved
            </span>
            <span className="text-[10px] 2xl:xs text-grey">
              {approvedDate}
            </span>
          </div>
        );
      case "2":
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs 2xl:text-sm font-semibold text-red-500">
              Rejected
            </span>
            <span className="text-[10px] 2xl:xs text-grey">
              {approvedDate}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  // console.log(loanDetails, "employeeloan");

  return (
    <DrawerPop
      open={show}
      close={handleClose}
      contentWrapperStyle={{
        width: "590px",
      }}
      handleSubmit={(e) => {
        console.log(e);
      }}
      updateBtn={""}
      updateFun={() => { }}
      header={["Loan Status", "Requested Loan Status Details"]}
    >
      <FlexCol className="p-4">
        {loanDetails && (
          <>
            {/* Loan Policy Details */}
            <div className="flex items-center justify-between">
              <div className=" flex items-center gap-2">
                <Avatar
                  image={loanDetails?.profilePicture}
                  name={loanDetails?.employeeName}
                  className="border-2 border-white shadow-md size-10 2xl:size-12"
                />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm 2xl:text-base font-medium">
                    {loanDetails?.employeeName}
                  </p>
                  <p className="text-grey text-xs 2xl:text-sm">
                    EMP Code: #{loanDetails?.code}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 text-xs 2xl:text-sm">
                <p className="text-grey">Applied Date</p>
                <p className="font-medium">{loanDetails?.createdOn}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 items-start sm:items-center sm:flex-row sm:justify-between sm:w-[380px]">
              <div className="flex flex-col gap-1.5">
                <p className="text-grey text-sm 2xl:text-base">Loan Policy Name</p>
                <p className="text-sm 2xl:text-base font-medium">{loanDetails?.tempdataloanPolicyDetails?.loanPolicyName}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-grey text-sm 2xl:text-base">Amount Type</p>
                <p className="text-sm 2xl:text-base font-medium">{loanDetails?.tempdataloanPolicyDetails?.AmountType}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 items-start sm:items-center sm:flex-row sm:justify-between sm:w-[380px]">
              <div className="flex flex-col gap-1.5">
                <p className="text-grey text-sm 2xl:text-base">Amount</p>
                <p className="text-sm 2xl:text-base font-medium">{loanDetails?.amount}</p>
              </div>
              <div className="flex flex-col gap-1.5 md:ml-auto">
                <p className="text-grey text-sm 2xl:text-base"> Tenure Months</p>
                <p className="text-sm 2xl:text-base font-medium">{loanDetails?.tenureMonths}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-grey text-sm 2xl:text-base">Description</p>
              <p className="text-sm 2xl:text-base font-medium">{loanDetails?.tempdataloanPolicyDetails?.description}</p>
            </div>


            {/* Tenure Amount Data Table */}
            <div className="self-stretch flex-col gap-4 flex px-5 py-3 bg-primaryalpha/5 rounded-lg">
              <div className="text-sm 2xl:text-base font-semibold">
                Tenure Amount Data
              </div>

              <div className='borderb px-5 py-3 rounded-lg mt-1 mb-3 bg-white dark:bg-dark'>
                <div className="flex items-center justify-between text-xs 2xl:text-sm font-semibold">
                  <p>Installments	</p>
                  <p>Amount</p>
                </div>
                <div className='divider-h m-auto mt-3 mb-3' />
                <div className="flex flex-col gap-3">
                  {loanDetails?.tenureAmountData?.map((tenure, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <p>Installment {tenure.EMI}	</p>
                      <p>{tenure.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>




            {/* Approvers */}
            <div className="self-stretch flex-col gap-6 flex mb-4">
              <div className="text-sm 2xl:text-base font-semibold">
                Hierarchy Approval Status
              </div>
              <div className="grid grid-cols-1 gap-5">
                {loanDetails?.approvers?.map((approver, index) => (
                  <div key={index} className="flex items-center justify-between">

                    <div className="flex items-center gap-1">
                      <Avatar
                        image={approver?.profilePicture}
                        name={approver?.employeeName}
                        className="border-2 border-white shadow-md size-8 2xl:size-10"
                      />

                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm 2xl:text-base">
                          {approver?.employeeName}
                        </span>
                        <span className="text-grey text-[10px] 2xl:text-xs">
                          {approver?.designation}
                        </span>
                      </div>
                    </div>

                    {getStatusLabel(approver?.actionStatus, approver?.approvedDate)}

                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </FlexCol>
    </DrawerPop>
  );
};

export default MyLoanStatusViewPage;









