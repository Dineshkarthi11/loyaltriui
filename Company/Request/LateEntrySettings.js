import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";

import TextArea from "../../common/TextArea";
import { PiDotOutlineFill } from "react-icons/pi";
import avatar from "../../../assets/images/user1.jpeg";
import Frame from "../../../assets/images/Frame 1171276923.png";
import { PiClockCountdownLight } from "react-icons/pi";
import { PiCoinsLight } from "react-icons/pi";
import API, { action } from "../../Api";
import Loader from "../../common/Loader";
import ButtonClick from "../../common/Button";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function LateEntrySettings({
  open,
  close = () => {},
  attendanceId,
  companyDataId,
  refresh = () => {},
  deductionId,
  companyId,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [deductionDetails, setDeductionDetails] = useState([]);
  const [reason, setReason] = useState(null);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const handleClose = () => {
    setShow(false);
  };

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const getAttendenceDeduction = async () => {
    try {
      const result = await action(
        API.GET_EMPLOYEE_ATTENDENCE_DEDUCTION,
        {
          id: deductionId,
        }
        // "http://192.168.0.34/loyaltri-server/api/main"
      );
      if (result.status === 200) {
        setDeductionDetails(result.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAttendenceDeduction();
  }, [deductionId]);

  const addPardonfine = async () => {
    try {
      if (!reason) {
        setReason("");
      } else {
        const result = await action(
          API.ADD_EMPLOYEE_PARDON,
          {
            companyId: companyId,
            selectedType: "pardon",
            responseBy: employeeId,
            remarks: reason,
            employeeAttendanceDeductionIds: [deductionId],
          }
          // "http://192.168.0.34/loyaltri-server/api/main"
        );
        if (result.status === 200) {
          // console.log(result);
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            handleClose();
          }, 1200);
        } else {
          openNotification("error", "Failed ", result.message);
        }
      }
    } catch (error) {
      console.log(error);
      openNotification("error", "Failed ", error.message);
    }
  };

  const applyFine = async () => {
    try {
      if (!reason) {
        setReason("");
      } else {
        const result = await action(
          API.ADD_EMPLOYEE_PARDON,
          {
            companyId: companyId,
            selectedType: "fine",
            responseBy: employeeId,
            remarks: reason,
            employeeAttendanceDeductionIds: [deductionId],
          }
          // "http://192.168.0.34/loyaltri-server/api/main"
        );
        if (result.status === 200) {
          // console.log(result);
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            handleClose();
          }, 1200);
        } else {
          openNotification("error", "Failed ", result.message);
        }
      }
    } catch (error) {
      console.log(error);
      openNotification("error", "Failed ", error.message);
    }
  };

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        handleClose();
      }}
      contentWrapperStyle={
        {
          // maxWidth: "600px",
        }
      }
      handleSubmit={(e) => {
        // console.log(e);
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        //   UpdateIdBasedCountry();
      }}
      header={[
        !UpdateBtn ? t("Request") : t(""),
        !UpdateBtn
          ? t("Standardizing Entry Request Procedures for Timely Accuracy")
          : t(""),
      ]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      // footerBtn={[t("Apply Fine "), !UpdateBtn ? t("Pardon Fine") : t("")]}
      customButton={
        <p className="flex items-center gap-2">
          <ButtonClick
            buttonName={"Apply Fine"}
            BtnType="primary"
            danger
            handleSubmit={() => {
              applyFine();
            }}
          />
          <ButtonClick
            buttonName={"Pardon Fine"}
            BtnType="primary"
            handleSubmit={() => {
              addPardonfine();
            }}
          />
        </p>
      }
    >
      {Object.keys(deductionDetails).length > 0 ? (
        <div className="flex flex-col gap-6 2xl:gap-8 ">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 2xl:gap-3.5 items-center">
              <div className="overflow-hidden border-2 border-white rounded-full shadow-md size-[45px] 2xl:size-[55px] shrink-0 bg-primaryLight text-primary">
                {deductionDetails?.profilePicture ? (
                  <img
                    src={deductionDetails?.profilePicture}
                    alt="profilePicture"
                    className="object-cover object-center w-full h-full"
                  />
                ) : (
                  <p className="flex items-center justify-center h-full text-2xl font-semibold ">
                    {deductionDetails?.employeeName?.charAt(0).toUpperCase()}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-0.5	">
                <p className="font-semibold text-sm 2xl:text-base">
                  {deductionDetails?.employeeName}
                </p>
                <p className="text-xs 2xl:text-sm text-gray-500">
                  EMP Code: {deductionDetails?.code}
                </p>
              </div>
            </div>
            <p className="text-xs 2xl:text-sm text-gray-500">
              Date: {deductionDetails.deductionDate}
            </p>
          </div>
          <div className="flex gap-1 items-center 2xl:gap-3.5">
            <p className="text-sm 2xl:text-base text-gray-500">
              Assigned Shift:
            </p>

            <p className="flex items-center 2xl:gap-1.5 text-gray-700 px-0.5 w-fit rounded-2xl bg-gray-100 dark:bg-gray-600/30 dark:text-gray-300">
              <PiDotOutlineFill size={24} />
              <p className="font-medium pr-2 text-xs 2xl:text-sm">
                {deductionDetails?.shiftName}
              </p>
            </p>
          </div>
          <div className="flex flex-col gap-7 2xl:gap-8">
            <div className="flex gap-[46px] 2xl:gap-12">
              <div className="flex flex-col gap-2">
                <p className="text-sm 2xl:text-base text-gray-500">
                  Request Type
                </p>
                <p className="text-sm 2xl:text-base font-medium">
                  {deductionDetails?.deductionDetails}
                </p>
              </div>
              {/* <div className="flex flex-col gap-2">
              <p className="text-sm 2xl:text-base text-gray-500">Fine Type</p>

              <p className="flex items-center 2xl:gap-1.5 text-primary px-0.5 w-fit rounded-2xl bg-primaryalpha/5 ">
                <PiDotOutlineFill size={24} />
                <p className="font-medium pr-2 text-xs 2xl:text-sm">
                  2x Basic Salary
                </p>
              </p>
            </div> */}
            </div>
            <div className="flex gap-[46px] 2xl:gap-12">
              <div className="flex flex-col gap-2">
                <p className="text-sm 2xl:text-base text-gray-500">
                  {deductionDetails?.deductionDetails === "Late Entry"
                    ? "Late By"
                    : "Early By"}
                </p>
                <div className="flex gap-1.5 2xl:gap-2 items-center">
                  <PiClockCountdownLight className="size-[22px] 2xl:size-[24px] text-gray-500" />
                  <p className="text-sm 2xl:text-base text-red-600 font-semibold">
                    {deductionDetails?.timeDifference}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm 2xl:text-base text-gray-500">
                  Fine Amount
                </p>
                <div className="flex gap-1.5 2xl:gap-2 items-center">
                  <PiCoinsLight className="size-[22px] 2xl:size-[24px] text-gray-500" />
                  <p className="text-sm 2xl:text-base text-red-600 font-semibold">
                    {deductionDetails?.deductionAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 2xl:gap-2.5">
            <p className="font-medium text-xs 2xl:text-sm">Reason:</p>
            <div className="bg-[#F8F8FA] dark:bg-dark rounded-lg p-3 2xl:p-3.5 text-xs 2xl:text-sm">
              <p className="text-xs 2xl:text-sm break-all">
                {deductionDetails?.excuseReason}
              </p>
            </div>
          </div>

          <TextArea
            title="Comments"
            placeholder="Comment"
            value={reason}
            change={(e) => {
              setReason(e);
            }}
            error={reason === "" ? "Comments is required" : ""}
            required
          />

          {/* <div className="flex flex-col gap-5 2xl:gap-6">
          <p className="text-xs 2xl:text-sm font-medium">
            Hierarchy Approval Status
          </p>

          <div className="flex justify-between items-center">
            <div className="flex gap-3 2xl:gap-3.5 items-center">
              <div className="overflow-hidden border-2 border-white rounded-full shadow-md size-[46px] 2xl:size-12 shrink-0">
                <img
                  src={Frame}
                  alt="image"
                  className="object-cover object-center w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-0.5	">
                <p className="font-medium text-sm 2xl:text-base">
                  Brendon Stokes{" "}
                </p>
                <p className="text-xs 2xl:text-sm text-gray-500">
                  Chief Operations Officer
                </p>
              </div>
            </div>
            <div>
              <p className=" text-[10px] 2xl:text-xs text-gray-500">
                Not updated
              </p>
              <p className=" text-[10px] 2xl:text-xs text-gray-500">
                -----------
              </p>
            </div>
          </div>
        </div> */}
        </div>
      ) : (
        <Loader />
      )}
    </DrawerPop>
  );
}
