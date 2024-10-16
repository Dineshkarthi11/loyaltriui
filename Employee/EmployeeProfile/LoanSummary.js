import React, { useMemo, useState } from "react";
import popImg from "../../../assets/images/userPrivileges/Salary access.png"
import DrawerPop from "../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import { BoxWrapper } from "../../common/BoxWrapper";
import Accordion from "../../common/Accordion";
import Avatar from "../../common/Avatar";
import ButtonDropdown from "../../common/ButtonDropdown";
import { PiCaretDown, PiDotsThreeVertical, PiPencilSimple } from "react-icons/pi";
import EditTenure from "./EditTenure";
import PauseLoan from "./PauseLoan";
import ModalAnt from "../../common/ModalAnt";
import { Tooltip } from "antd";
import EditInstallment from "./EditInstallment";

export default function LoanSummary({ open, close = () => { } }) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [drawerPop, setDrawerPop] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);

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

  const LoanData = [
    {
      id: 1,
      Loan: "Loan Name",
      status: "Open",
      description: "lorem ipsum dummy text dolar sit.",
      detail: {
        Approved_By: "Addison Meyer",
        Disbursement_Date: "20 may 2024",
        Loan_Name: "Loan Name",
        Description:
          "lorem ipsum dummy text dolar sit lorem ipsum dummy text dolar sit lorem ipsum dummy text dolar sit.",
        principal: "AED 2000",
        Annual_Interest_Rate: "1%",
        Total_Paid_Instalment: "AED 0.00",
        Tenure: "22 Months",
        Completion: "10/22 Months",
        Remaining_principal: "AED 1,20,000",
        Remaining_Instalment: "AED 1,20,000",
        Close_Date: "31 mar 2026",
      },
    },
  ];

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        handleClose();
        close(e);
      }}
      contentWrapperStyle={{
        position: "absolute",
        height: "100%",
        top: 0,

        // left: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        borderRadius: 0,
        borderTopLeftRadius: "0px !important",
        borderBottomLeftRadius: 0,
      }}
      background="#F8FAFC"
      handleSubmit={(e) => {
        // saveEmployeePunchInMethod();
      }}
      bodyPadding={25}
      header={[
        t("Loan Summary"),
        t(
          "Gain insights into your compensation package with our salary overview"
        ),
      ]}
      footer={false}
    >
      <div className="flex flex-col gap-6 max-w-[1076px] mx-auto">

        <div className='borderb rounded-xl px-4 py-3 bg-white dark:bg-dark'>
          <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row items-center sm:justify-between">
            <div className='flex items-center gap-2'>
              <Avatar
                image={""}
                name="sdf"
                className='size-10'
              />
              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-2'>
                  <p className='font-semibold text-sm 2xl:text-base'>Employee Name</p>
                  <div className='px-2 py-0.5 rounded-full bg-primaryalpha/10 text-primary text-xs 2xl:text-sm font-medium'>
                    {`EMP Id: # 123213`}
                  </div>
                </div>
                <p className='text-[10px] 2xl:text-xs text-grey'>Designation</p>
              </div>
            </div>


            <ButtonDropdown
              buttonName={
                <div className="flex items-center gap-1">
                  <PiDotsThreeVertical
                    className="text-xl size-4"
                  />
                  <p>Loan Actions</p>
                </div>
              }
              items={[
                {
                  key: "1",
                  label: "Edit Tenure",
                  value: "edit_tenure"
                },
                {
                  key: "2",
                  label: "Pause",
                  value: "pause"
                },
                {
                  key: "3",
                  label: "Write Off",
                  value: "write_off"
                },
                {
                  key: "4",
                  label: "Close",
                  value: "close"
                },
              ]}
              onSelect={(key, value) => {
                setDrawerPop(value);
                setOpenDrawer(true);
              }}
            />
          </div>

        </div>

        {LoanData?.map((item, index) => (
          <Accordion
            title={item.Loan}
            description={item.description}
            status={item.status}
            initialExpanded="true"
            className={'bg-white dark:bg-dark'}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 md:gap-6 dark:text-white 2xl:pr-3 overflow-hidden">
              {Object.entries(item.detail)?.map(([subKey, subValue]) => (
                <div key={subKey}>
                  <div className="flex flex-col gap-2">
                    <p className="font-medium text-grey text-[10px] 2xl:text-xs">
                      {subKey.replace(/_/g, " ").toUpperCase()}
                    </p>
                    <p
                      className="font-semibold text-xs 2xl:text-sm truncate"
                      title={subValue}
                    >
                      {subValue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Accordion>
        ))}

        <BoxWrapper
          title="Instalment Summary"
          description="By providing a thorough salary overview."
          className={"bg-white dark:bg-dark"}
          contentClassName={"p-0 bg-white dark:bg-dark"}
        >
          <table className="min-w-full bg-white border-collapse table-fixed dark:bg-dark">
            <tr className="text-[10px] 2xl:text-xs !font-medium text-grey h-11 2xl:h-12  text-left uppercase">
              <td className="p-4">Instalment Date</td>
              <td>Closing Principal Balance</td>
              <td>Principal Repaid in Balance </td>
              <td>Principal Repaid in Balance</td>
              <td>Instalment Amount</td>
            </tr>

            <tbody className="">
              <tr className="bg-[#F8F8F8] rounded-lg h-11 2xl:h-12 text-[10px] 2xl:text-xs dark:bg-dark dark:text-white">
                <td className="p-4">30 JUN 2024</td>
                <td>AED 1,20,000</td>
                <td>AED 14,000</td>
                <td>AED 1,20,000</td>
                <td><div className="flex items-center gap-1">
                  <Tooltip placement="top" title={"Edit"}>
                    <PiPencilSimple className="text-grey size-4 hover:text-primary cursor-pointer" onClick={() => {
                      setDrawerPop('edit_installment');
                      setOpenDrawer(true);
                    }} />
                  </Tooltip>
                  <p>AED 1,20,000</p>
                </div>
                </td>
              </tr>
            </tbody>
          </table>
        </BoxWrapper>
      </div>


      {openDrawer && drawerPop === "edit_tenure" && (
        <EditTenure
          open={openDrawer}
          close={(e) => {
            setOpenDrawer(e)
            setDrawerPop('')
          }}

        />
      )}

      {openDrawer && drawerPop === "pause" && (
        <PauseLoan
          open={openDrawer}
          close={(e) => {
            setOpenDrawer(e)
            setDrawerPop('')
          }}

        />
      )}

      {openDrawer && drawerPop === "edit_installment" && (
        <EditInstallment
          open={openDrawer}
          close={(e) => {
            setOpenDrawer(e)
            setDrawerPop('')
          }}

        />
      )}

      {drawerPop === "write_off" && (
        <ModalAnt
          isVisible={openDrawer}
          onClose={() => setOpenDrawer(false)}
          // width="435px"
          showTitle={false}
          centered={true}
          padding="10px"
          showOkButton={true}
          showCancelButton={true}
          okText="Confirm write off"
          okButtonClass="w-full"
          cancelButtonClass="w-full"
          // onOk={downloadSalarySlipForEmployeePayroll}   # add your functionality here. */}
        >          
          <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[553px] p-2">
            <div className="flex flex-col gap-2.5 items-center m-auto">
              <div className="border-2 border-[#FFFFFF] size-12 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/5">
                <img
                  src={popImg}
                  alt="Img"
                  className="rounded-full w-7 2xl:w-9"
                />
              </div>
              <p className="font-semibold text-center text-[17px] 2xl:text-[19px] max-w-[233px]">
                Are you sure you want to Write Off Loan?
              </p>
            </div>
            <div className="m-auto">
              <p className="text-center text-xs 2xl:text-sm text-gray-500 max-w-[370px] px-5 py-2">
                Installment of the past will remain and no future instalments will be accecpted.
              </p>
            </div>
          </div>
        </ModalAnt>
      )}

      {drawerPop === "close" && (
        <ModalAnt
          isVisible={openDrawer}
          onClose={() => setOpenDrawer(false)}
          // width="435px"
          showTitle={false}
          centered={true}
          padding="10px"
          showOkButton={true}
          showCancelButton={true}
          okText="Confirm Closing"
          okButtonClass="w-full"
          cancelButtonClass="w-full"
          // onOk={downloadSalarySlipForEmployeePayroll}   # add your functionality here. */}
        >

          <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[553px] p-2">
            <div className="flex flex-col gap-2.5 items-center m-auto">
              <div className="border-2 border-[#FFFFFF] size-12 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/5">
                <img
                  src={popImg}
                  alt="Img"
                  className="rounded-full w-7 2xl:w-9"
                />
              </div>
              <p className="font-semibold text-center text-[17px] 2xl:text-[19px] max-w-[233px]">
                Are you sure you want to Close Loan?
              </p>
            </div>
            <div className="m-auto">
              <p className="text-center text-xs 2xl:text-sm text-gray-500 max-w-[370px] px-5 py-2">
                The action cannot be undone. Please review the loan details and terms before proceeding.
              </p>
            </div>
          </div>
        </ModalAnt>
      )}

    </DrawerPop>
  );
}
