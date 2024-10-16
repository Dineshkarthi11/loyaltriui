import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import { Image } from "antd";
import API, { action } from "../../Api";
import { RxDotFilled } from "react-icons/rx";
import {
  PiAlarm,
  PiCoffee,
  PiGpsFix,
  PiMapPin,
  PiSignIn,
  PiSignOut,
} from "react-icons/pi";
import Noimage from "../../../assets/images/noImg.webp";
import Loader from "../../common/Loader";
import { NoData } from "../../common/SVGFiles";
import { AiOutlineInteraction } from "react-icons/ai";
import ModalAnt from "../../common/ModalAnt";
import GoogleMap from "../../common/GoogleMap";

export default function EmployeeTimeline({
  open,
  close = () => {},
  attendanceId,
  companyDataId,
  refresh = () => {},
  employeeId,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);

  const [attendenceDetails, setAttendenceDetails] = useState([]);
  const [isModal, setIsModal] = useState(false);

  const handleSetIsModal = () => {
    setIsModal(!isModal);
  };
  const [isModal2, setIsModal2] = useState(false);

  const handleSetIsModal2 = () => {
    setIsModal2(!isModal2);
  };

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

  const getAttendenceDetails = async () => {
    const result = await action(API.GET_ATTENDANCE_LOG, {
      employeeDailyAttendanceId: attendanceId,
      employeeId: employeeId,
      // employeeDailyAttendanceId: 4752,
      // employeeId: 225,
    });
    setAttendenceDetails(result?.result);
  };
  useEffect(() => {
    getAttendenceDetails();
  }, []);

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
      updateBtn={UpdateBtn}
      header={[
        !UpdateBtn ? t("Attendance Timeline") : t(""),
        !UpdateBtn ? t("Manage attendance timeline here.") : t(""),
      ]}
      footer={false}
    >
      <FlexCol gap={24}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`size-10 overflow-hidden rounded-full 2xl:size-[53px] shrink-0 bg-primaryalpha/10 vhcenter`}
            >
              {attendenceDetails?.employeeData?.profilePicture ? (
                <img
                  // src={record.logo}
                  src={attendenceDetails?.employeeData?.profilePicture}
                  className="object-cover object-center w-full h-full"
                  alt="profileimage"
                />
              ) : (
                <p className="text-xs font-semibold text-primary 2xl:text-sm">
                  {attendenceDetails?.employeeData?.employeeName
                    ?.charAt(0)
                    .toUpperCase()}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <h2 className="font-semibold h2">
                {attendenceDetails?.employeeData?.employeeName
                  ?.charAt(0)
                  .toUpperCase() +
                  attendenceDetails?.employeeData?.employeeName?.slice(1)}
              </h2>
              <p className="pblack !text-grey para">
                Emp Code : {attendenceDetails?.employeeData?.code}
              </p>
            </div>
          </div>
          <FlexCol gap={8}>
            <p className="flex items-center gap-1 text-sm text-grey 2xl:text-base">
              <span> Date:</span>
              <span>
                {new Date(
                  attendenceDetails?.employeeData?.attendanceDate
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
            </p>
            <p className="px-1.5 py-0.5 h-fit flex gap-1 items-center font-medium w-fit bg-gray-100 text-gray-700 dark:bg-gray-600/30 dark:text-gray-300 rounded-full text-[9px] 2xl:text-[11px]">
              <RxDotFilled size={14} />
              {attendenceDetails?.employeeData?.shift || "No Shift"}
            </p>
          </FlexCol>
        </div>
        {attendenceDetails?.logs?.length > 0 ? (
          <div class="flex-auto">
            {attendenceDetails?.logs?.map((each) => (
              <div class="relative flex flex-col justify-center">
                {/* Loop Content here */}

                {/* Punch IN  */}
                {each.remark === "punchIn" && (
                  <div class="relative pb-10">
                    <div class="absolute left-4 2xl:left-5 h-full border-r-[1.5px] border-[#676767] opacity-[0.2] border-dashed"></div>
                    <span class="absolute inline-flex size-8 2xl:size-10 items-center justify-center rounded-full bg-[#61c451] ring-[4px] ring-[#61c451]/20 text-center font-semibold text-white">
                      <PiSignIn size={18} />
                    </span>
                    <div class="ml-14 w-auto pt-1 flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p class="text-sm 2xl:text-base flex items-center gap-2">
                            <span className="text-grey"> Punch In via</span>
                            <span className="font-bold ">
                              {each?.datas.punchType
                                ?.replace(/([A-Z])/g, " $1")
                                .charAt(0)
                                .toUpperCase() +
                                each?.datas.punchType
                                  ?.replace(/([A-Z])/g, " $1")
                                  .slice(1) || "--"}
                            </span>
                          </p>
                          <p class="text-sm 2xl:text-base text-grey">
                            by{" "}
                            {attendenceDetails?.employeeData?.employeeName
                              ?.charAt(0)
                              .toUpperCase() +
                              attendenceDetails?.employeeData?.employeeName?.slice(
                                1
                              )}{" "}
                            on{" "}
                            {/* {new Date(each?.datas.eventDate)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                              .replace(/ /g, " ")} */}
                            {new Date(
                              attendenceDetails?.employeeData?.attendanceDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        {/* <div className="v-divider !h-8" /> */}
                        {/* <div className="bg-[#e33608] text-[10px] text-white 2xl:text-xs rounded-full px-4 py-3 text-center">
                    Late : 10 Minutes
                  </div> */}
                      </div>

                      <div className=" rounded-xl p-1.5 bg-[#F9F9F9] dark:bg-dark flex items-center gap-1.5 w-fit">
                        <div className="overflow-hidden w-[100px] h-[92px] rounded-lg">
                          {each?.datas?.punchInImage ? (
                            <Image
                              className="object-cover object-center w-full h-full"
                              alt="#PunchImage"
                              src={
                                each?.datas?.punchInImage
                                  ? each?.datas?.punchInImage
                                  : Noimage
                              }
                            />
                          ) : (
                            <img
                              src={Noimage}
                              alt="#PunchImage"
                              className="object-cover object-center w-full h-full"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="flex flex-col gap-1.5">
                            <div className="bg-white dark:bg-white/10 p-1.5 rounded-lg flex gap-1.5 items-center">
                              <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                                <PiAlarm size={16} />
                              </div>
                              <p className="text-xs font-medium">
                                Punch In: {each?.datas.time}
                              </p>
                            </div>
                            <div className="bg-white dark:bg-white/10 p-1.5 rounded-lg flex gap-1.5 items-center">
                              <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                                <PiGpsFix size={16} />
                              </div>
                              <p className="text-xs font-medium">
                                {/* Location Here  */}
                                {each?.datas?.punchInLocation
                                  ? each?.datas?.punchInLocation
                                  : "No location"}

                                {/* {each?.attendanceData?.punchRemarks
                                ?.replace(/([A-Z])/g, " $1")
                                .charAt(0)
                                .toUpperCase() +
                                each?.attendanceData?.punchRemarks
                                  ?.replace(/([A-Z])/g, " $1")
                                  .slice(1) || "--"} */}
                              </p>
                            </div>
                          </div>
                          <div
                            className="bg-white dark:bg-white/10 p-1.5 rounded-lg h-[94px] text-primaryalpha hover:bg-primaryalpha/10 transition-all duration-300 vhcenter cursor-pointer dark:text-white"
                            onClick={() => handleSetIsModal(true)}
                          >
                            <PiMapPin size={16} />
                            <ModalMap
                              title="Check In Location"
                              address={
                                each?.datas?.punchInLocation
                                  ? each?.datas?.punchInLocation
                                  : "FXP4+V7G, Thiruvananthapuram, India - 695014"
                              }
                              isModal={isModal}
                              setIsModal={setIsModal}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Start Break */}
                {each.remark === "startBreak" && (
                  <div class="relative pb-10">
                    <div class="absolute left-4 2xl:left-5 h-full border-r-[1.5px] border-[#676767] opacity-[0.2] border-dashed"></div>
                    <span class="absolute inline-flex size-8 2xl:size-10 items-center justify-center rounded-full bg-grey ring-[4px] ring-grey/20 text-center font-semibold text-white">
                      <PiCoffee size={18} />
                    </span>
                    <div class="ml-14 w-auto pt-1 flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p class="text-sm 2xl:text-base text-grey font-bold">
                            {each.remark
                              ?.replace(/([A-Z])/g, " $1")
                              .charAt(0)
                              .toUpperCase() +
                              each?.remark
                                ?.replace(/([A-Z])/g, " $1")
                                .slice(1) || "--"}
                          </p>
                          <p class="text-sm 2xl:text-base">
                            <span className="text-grey">
                              {new Date(each?.datas.eventDate)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                .replace(/ /g, " ")}
                              :{" "}
                            </span>
                            <span>{each.datas.time}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/*  End Break */}
                {each.remark === "endBreak" && (
                  <div class="relative pb-10">
                    <div class="absolute left-4 2xl:left-5 h-full border-r-[1.5px] border-[#676767] opacity-[0.2] border-dashed"></div>
                    <span class="absolute inline-flex size-8 2xl:size-10 items-center justify-center rounded-full bg-grey ring-[4px] ring-grey/20 text-center font-semibold text-white">
                      <PiCoffee size={18} />
                    </span>
                    <div class="ml-14 w-auto pt-1 flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p class="text-sm 2xl:text-base text-grey font-bold">
                            {each.remark
                              ?.replace(/([A-Z])/g, " $1")
                              .charAt(0)
                              .toUpperCase() +
                              each?.remark
                                ?.replace(/([A-Z])/g, " $1")
                                .slice(1) || "--"}
                          </p>
                          <p class="text-sm 2xl:text-base">
                            <span className="text-grey">
                              {new Date(each?.datas.eventDate)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                .replace(/ /g, " ")}{" "}
                              :{" "}
                            </span>
                            <span>{each.datas.time}</span>
                          </p>
                        </div>
                        <div className="v-divider !h-8" />
                        <div className="bg-[#E74B14] text-[10px] text-white 2xl:text-xs rounded-full px-4 py-3 text-center">
                          Break Duration : {each?.datas.timeTaken}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Punch In via Geo Fencing  */}
                {/* <div class="relative pb-10">
              <div class="absolute left-4 2xl:left-5 h-full border-r-[1.5px] border-[#676767] opacity-[0.2] border-dashed"></div>
              <span class="absolute inline-flex size-8 2xl:size-10 items-center justify-center rounded-full bg-[#61c451] ring-[4px] ring-[#61c451]/20 text-center font-semibold text-white">
                <PiSignIn size={18} />
              </span>
              <div class="ml-14 w-auto pt-1 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-sm 2xl:text-base">
                      <span className="text-grey"> Punch In via</span>
                      <span> Geo Fencing</span>
                    </p>
                    <p class="text-sm 2xl:text-base text-grey">
                      by {employeeDetails?.employeeName} on
                      {new Date(employeeDetails?.date)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, " ")}
                      {/* Date to this format 14 May 2024 *
                    </p>
                  </div>
                </div>

                <div className=" rounded-xl p-1.5 bg-[#F9F9F9] dark:bg-dark flex flex-col gap-1.5 w-fit">
                  {/* Image Hidden here *
                  <div className="bg-white dark:bg-white/10 p-1.5 rounded-lg flex gap-1.5 items-center">
                    <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                      <PiAlarm size={16} />
                    </div>
                    <p className="text-xs font-medium">
                      Punch In: {employeeDetails?.firstCheckInTime}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-white/10 p-1.5 rounded-lg flex gap-1.5 items-center">
                    <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                      {/* <PiGpsFix size={16} /> *
                      <PiAlarm size={16} />
                    </div>
                    <p className="text-xs font-medium">
                      {/* Location Here  *
                      {employeeDetails?.dutyType}
                    </p>
                  </div>
                </div>
              </div>
            </div> */}

                {/* Punch Out  */}
                {each.remark === "punchOut" && (
                  <div class="relative pb-10">
                    <div class="absolute left-4 2xl:left-5 h-full border-r-[1.5px] border-[#676767] opacity-[0.2] border-dashed hidden"></div>
                    <span class="absolute inline-flex size-8 2xl:size-10 items-center justify-center rounded-full bg-[#C51910] ring-[4px] ring-[#C51910]/20 text-center font-semibold text-white">
                      <PiSignOut size={18} />
                    </span>
                    <div class="ml-14 w-auto pt-1 flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p class="text-sm 2xl:text-base">
                            <span className="text-grey"> Punch out via </span>
                            <span className="font-bold ">
                              {each?.datas.punchOutType
                                ?.replace(/([A-Z])/g, " $1")
                                .charAt(0)
                                .toUpperCase() +
                                each?.datas.punchOutType
                                  ?.replace(/([A-Z])/g, " $1")
                                  .slice(1) || "--"}
                            </span>
                          </p>
                          <p class="text-sm 2xl:text-base text-grey">
                            by{" "}
                            {attendenceDetails?.employeeData?.employeeName
                              ?.charAt(0)
                              .toUpperCase() +
                              attendenceDetails?.employeeData?.employeeName?.slice(
                                1
                              )}{" "}
                            on{" "}
                            {/* {new Date(each?.datas.eventDate)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                              .replace(/ /g, " ")} */}
                            {new Date(
                              attendenceDetails?.employeeData?.attendanceDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}
                            {/* Date to this format 14 May 2024 */}
                          </p>
                        </div>
                        {/* {attendenceDetails.extraHours ? (
                      <>
                        <div className="v-divider !h-8" />
                        <div className="bg-[#5F18E9] text-[10px] text-white 2xl:text-xs rounded-full px-4 py-3 text-center">
                          Overtime : ${attendenceDetails.extraHours}
                        </div>
                      </>
                    ) : (
                      attendenceDetails?.isRegularizationNeeded === 1 && (
                        <>
                          <div className="v-divider !h-8" />{" "}
                          <div className="bg-[#5F18E9] text-[10px] text-white 2xl:text-xs rounded-full px-4 py-3 text-center">
                            ${attendenceDetails.hoursWorkedMessage}
                          </div>
                        </>
                      )
                    )} */}
                      </div>

                      <div className=" rounded-xl p-1.5 bg-[#F9F9F9] dark:bg-dark flex items-center gap-1.5 w-fit">
                        <div className="overflow-hidden w-[100px] h-[92px] rounded-lg">
                          {each?.datas?.punchOutImage ? (
                            <Image
                              className="object-cover object-center w-full h-full"
                              alt="punchOutImage"
                              src={each.datas.punchOutImage}
                            />
                          ) : (
                            <img
                              src={Noimage}
                              alt="punchOutImage"
                              className="object-cover object-center w-full h-full"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="flex flex-col gap-1.5">
                            <div className="bg-white dark:bg-white/10 p-1.5 rounded-lg flex gap-1.5 items-center">
                              <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                                <PiAlarm size={16} />
                              </div>
                              <p className="text-xs font-medium">
                                Punch Out: {each?.datas.time}
                              </p>
                            </div>
                            <div className="bg-white dark:bg-white/10 p-1.5 rounded-lg flex gap-1.5 items-center">
                              <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                                <PiGpsFix size={16} />
                              </div>
                              <p className="text-xs font-medium">
                                {/* Location Here  */}
                                {each?.datas?.punchOutLocation
                                  ? each?.datas?.punchOutLocation
                                  : "No location"}

                                {/* {each?.attendanceData?.punchRemarks
                                ?.replace(/([A-Z])/g, " $1")
                                .charAt(0)
                                .toUpperCase() +
                                each?.attendanceData?.punchRemarks
                                  ?.replace(/([A-Z])/g, " $1")
                                  .slice(1) || "--"} */}
                              </p>
                            </div>
                          </div>
                          <div
                            className="bg-white dark:bg-white/10 p-1.5 rounded-lg h-[94px] text-primaryalpha hover:bg-primaryalpha/10 transition-all duration-300 vhcenter cursor-pointer dark:text-white"
                            onClick={() => handleSetIsModal2(true)}
                          >
                            <PiMapPin size={16} />
                            <ModalMap
                              title="Check Out Location"
                              address={
                                each?.datas?.punchOutLocation
                                  ? each?.datas?.punchOutLocation
                                  : "FXP4+V7G, Thiruvananthapuram, India - 695014"
                              }
                              isModal={isModal2}
                              setIsModal={setIsModal2}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {each.remark === "Actions" && (
                  <div class="relative pb-10">
                    {/* <div class="absolute left-4 2xl:left-5 h-full border-r-[1.5px] border-[#676767] opacity-[0.2] border-dashed"></div> */}
                    <span class="absolute inline-flex size-8 2xl:size-10 items-center justify-center rounded-full bg-grey ring-[4px] ring-grey/20 text-center font-semibold text-white">
                      <AiOutlineInteraction size={18} />
                    </span>
                    <div class="ml-14 w-auto pt-1 flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p class="text-sm 2xl:text-base text-grey font-bold">
                            {each.remark
                              ?.replace(/([A-Z])/g, " $1")
                              .charAt(0)
                              .toUpperCase() +
                              each?.remark
                                ?.replace(/([A-Z])/g, " $1")
                                .slice(1) || "--"}
                          </p>
                          <p class="text-sm 2xl:text-base">
                            <span className="text-grey">
                              {new Date(each?.datas.eventDate)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                .replace(/ /g, " ")}
                            </span>
                            <span>{each.datas.time}</span>
                          </p>
                        </div>
                        {/* <div className="v-divider !h-8" /> */}
                        <div className="bg-[#E74B14] text-[10px] text-white 2xl:text-xs rounded-full px-4 py-3 text-center">
                          {each?.datas.message}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : attendenceDetails?.logs ? (
          <NoData />
        ) : (
          <Loader />
        )}
      </FlexCol>
    </DrawerPop>
  );
}

const ModalMap = ({ address, isModal, setIsModal, title }) => {
  return (
    <ModalAnt
      title={title}
      showTitle={true}
      isVisible={isModal}
      showOkButton={false}
      showCancelButton={true}
      cancelText="OK"
      centered={true}
      padding="10px"
      onClose={(e) => {
        setIsModal(false);
      }}
      width="540px"
    >
      <GoogleMap address={address} />
    </ModalAnt>
  );
};
