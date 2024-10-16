import React, { useEffect, useMemo, useState } from "react";
import DrawerPop from "../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import {
  PiClockCountdownLight,
  PiCoinsLight,
  PiDotOutlineFill,
} from "react-icons/pi";
import API, { action } from "../../Api";
import Loader from "../../common/Loader";
import { NoData } from "../../common/SVGFiles";
import useNotification from "antd/es/notification/useNotification";

export default function RegularizeDetails({
  open,
  close = () => {},
  updateId,
  selectedMethod,
  Heading,
}) {
  const [show, setShow] = useState(open);

  const [regularizeDetails, setRegularizeDetails] = useState([]);

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

  const getRegularizeDetails = async () => {
    try {
      const result = await action(
        API.GET_REDULARIZE_DETAILS,
        {
          employeeDailyAttendanceId: updateId,
          selectedMethod: selectedMethod, //isFine
        }
        // "http://192.168.0.34/loyaltri-server/api/main"
      );
      if (result.status === 200) {
        setRegularizeDetails(result.result);
        console.log(result);
      } else {
        openNotification("error", "Failed..", result.message);
      }
    } catch (error) {
      openNotification("error", "Failed..", error.code);
    }
    // setMyAttendence(result);
  };

  useEffect(() => {
    getRegularizeDetails();
  }, []);

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
      updateFun={() => {
        //   UpdateIdBasedCountry();
      }}
      header={[`${Heading} Details`]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      // footerBtn={[t("Apply Fine "), !UpdateBtn ? t("Pardon Fine") : t("")]}
    >
      {Object.keys(regularizeDetails).length > 0 ? (
        <div className="flex flex-col gap-6 2xl:gap-8 ">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 2xl:gap-3.5 items-center">
              <div className="overflow-hidden border-2 border-white rounded-full shadow-md size-[45px] 2xl:size-[55px] shrink-0 bg-primaryLight text-primary">
                {regularizeDetails?.profilePicture ? (
                  <img
                    src={regularizeDetails[0]?.profilePicture}
                    alt="profilePicture"
                    className="object-cover object-center w-full h-full"
                  />
                ) : (
                  <p className="flex items-center justify-center h-full text-2xl font-semibold ">
                    {regularizeDetails[0]?.employeeName
                      ?.charAt(0)
                      .toUpperCase()}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-0.5	">
                <p className="font-semibold text-sm 2xl:text-base">
                  {regularizeDetails[0]?.employeeName}
                </p>
                <p className="text-xs 2xl:text-sm text-gray-500">
                  EMP Code: {regularizeDetails[0]?.code}
                </p>
              </div>
            </div>
            <p className="text-xs 2xl:text-sm text-gray-500">
              Date: {regularizeDetails[0].createdOn}
            </p>
          </div>
          <div className="flex gap-1 items-center 2xl:gap-3.5">
            <p className="text-sm 2xl:text-base text-gray-500">
              Assigned Shift:
            </p>

            <p className="flex items-center 2xl:gap-1.5 text-gray-700 px-0.5 w-fit rounded-2xl bg-gray-100 dark:bg-gray-600/30 dark:text-gray-300">
              <PiDotOutlineFill size={24} />
              <p className="font-medium pr-2 text-xs 2xl:text-sm">
                {regularizeDetails[0]?.shiftName}
              </p>
            </p>
          </div>
          {regularizeDetails.map((each, i) => (
            <div className=" bg-sky-50/50 dark:bg-dark rounded-xl p-4 ">
              <div key={i} className="flex flex-col gap-7 2xl:gap-8">
                <div className="flex gap-[46px] 2xl:gap-12">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm 2xl:text-base text-gray-500">
                      Request Type
                    </p>
                    <p className="text-sm 2xl:text-base font-medium ">
                      {each?.deductionDetails}
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
                      Late By
                    </p>
                    <div className="flex gap-1.5 2xl:gap-2 items-center">
                      <PiClockCountdownLight className="size-[22px] 2xl:size-[24px] text-gray-500" />
                      <p className="text-sm 2xl:text-base text-red-600 font-semibold">
                        {each?.timeDifference}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm 2xl:text-base text-gray-500">
                      Deduction Amount
                    </p>
                    <div className="flex gap-1.5 2xl:gap-2 items-center">
                      <PiCoinsLight className="size-[22px] 2xl:size-[24px] text-gray-500" />
                      <p className="text-sm 2xl:text-base text-red-600 font-semibold">
                        {each?.deductionAmount}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 2xl:gap-2.5">
                  <p className="font-medium text-xs 2xl:text-sm text-gray-500">
                    Reason:
                  </p>
                  <div className="bg-[#fff] dark:bg-dark rounded-lg p-3 2xl:p-3.5 text-xs 2xl:text-sm">
                    <p className="text-xs 2xl:text-sm break-all">
                      {each?.excuseReason}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-2.5 2xl:gap-2.5">
            <p className="font-medium text-xs 2xl:text-sm text-gray-500">
              Comments:
            </p>
            <div className="bg-[#F8F8FA] dark:bg-dark rounded-lg p-3 2xl:p-3.5 text-xs 2xl:text-sm">
              <p className="text-xs 2xl:text-sm break-all">
                {regularizeDetails[0]?.remarks}
              </p>
            </div>
          </div>

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
      ) : Object.keys(regularizeDetails).length === 0 ? (
        <NoData />
      ) : (
        <Loader />
      )}
    </DrawerPop>
  );
}
