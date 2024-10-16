import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Flex, Tooltip } from "antd";
import PopImg from "../../../assets/images/EmpLeaveRequest.svg";
import API, { action } from "../../Api";
import FlexCol from "../../common/FlexCol";
import TableAnt from "../../common/TableAnt";
import { myLeaveHeaderList } from "../../data";
import virus from "../../../assets/images/leave/virus.svg";
import { FiAlertCircle } from "react-icons/fi";
import LeaveRequest from "./LeaveRequest";
import "react-multi-carousel/lib/styles.css";
import { lightenColor } from "../../common/lightenColor";
import { useSelector } from "react-redux";
import leaveimg from "../../../assets/images/image 1467.png";
import pdf from "../../../assets/images/uploader/pdf.png";
import docs from "../../../assets/images/uploader/document-2 1.png";
import imag from "../../../assets/images/uploader/Group.png";

// SWIPER SLIDER
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { PiArrowCircleLeft, PiArrowCircleRight } from "react-icons/pi";
import ModalAnt from "../../common/ModalAnt";
import { GoDotFill } from "react-icons/go";
import Avatar from "../../common/Avatar";
import Heading from "../../common/Heading";
import CustomSkeleton from "../../common/CustomSkeleton";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function MyLeaves({ employee = null, path }) {
  const { t } = useTranslation();
  const themeMode = useSelector((state) => state.layout.mode);

  const [show, setShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [myLeave, setMyLeave] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [leaveId, setLeaveId] = useState(null);

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(
    employee || localStorageData.companyId
  );
  const [updateId, setUpdateId] = useState();
  const [view, setView] = useState(false);
  const [isdata, setIsData] = useState();
  const [modalData, setModalData] = useState(null);
  const [skeleton, setSkeleton] = useState(false);

  const toggleModal = (data) => {
    setIsOpen(!isOpen);
    setModalData(data);
  };
  useEffect(() => {
    if (employee) setEmployeeId(employee);
    setCompanyId(localStorageData.companyId);
  }, [employee]);

  const getMyLeave = async () => {
    try {
      const result = await action(API.GET_MY_LEAVE_LIST, {
        id: employeeId,
        companyId: companyId,
      });
      if (result.status === 200) {
        setMyLeave(result.result);
      } else {
        setMyLeave([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMyLeaveSummary = async (e) => {
    try {
      setSkeleton(true);
      const result = await action(API.GET_EMPLOYEE_LEAVE_SUMMARY, {
        id: employeeId,
      });
      console.log(result.result, "result.result===");
      if (result.status === 200) {
        setLeaveSummary(result.result);
        setSkeleton(false);
      } else {
        setSkeleton(false);
        setLeaveSummary([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyLeave();
    getMyLeaveSummary();
  }, [employeeId]);

  const primaryColor = localStorageData.mainColor;
  const lighterColor = lightenColor(primaryColor, 0.91);

  const handleFileView = (fileUrl) => {
    if (!fileUrl) {
      alert("No file to view");
      return;
    }

    try {
      // Extract the file extension from the file name, ignoring query parameters
      const urlWithoutQuery = fileUrl.split("?")[0];
      const fileType = urlWithoutQuery.split(".").pop().toLowerCase();

      const imageTypes = ["jpg", "jpeg", "png", "gif"];
      const googleDocsTypes = ["doc", "docx"];
      const pdfType = ["pdf"];

      if (imageTypes.includes(fileType) || pdfType.includes(fileType)) {
        // Directly open image files and PDFs in a new tab
        window.open(fileUrl, "_blank");
      } else if (googleDocsTypes.includes(fileType)) {
        // Use Google Docs Viewer for .doc and .docx files
        const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
          fileUrl
        )}&embedded=true`;
        window.open(googleViewerUrl, "_blank");
      } else {
        // Fallback for unsupported file types
        alert(
          `This file type (${fileType}) may not be viewable in the browser.`
        );
      }
    } catch (error) {
      alert("Failed to open the file");
    }
  };

  return (
    <FlexCol>
      {path === "myleaves" ? (
        <div className="flex flex-col items-start justify-between w-full gap-3 sm:items-center sm:flex-row">
          <Heading
            title="My Leaves"
            description="Tracks an employee's personel leave balances,requests,and aprovals"
          />
        </div>
      ) : (
        ""
      )}

      {leaveSummary?.length > 0 ? (
        <div className="flex flex-col items-center w-full gap-2 overflow-y-hidden lg:flex-row lg:gap-0">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            className="relative w-full lg:w-[95%]"
            breakpoints={{
              700: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1316: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
            }}
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
          >
            {leaveSummary?.map((each) => (
              <SwiperSlide className="!bg-transparent">
                <div
                  className="h-[195px] flex flex-col gap-3.5 border-[3px] border-[#F9F9F9] rounded-xl p-4 mr-2 dark:border-black w-full"
                  style={{
                    background: `linear-gradient(180deg, ${
                      themeMode === "dark"
                        ? "rgba(72, 72, 72, 1)"
                        : lighterColor
                    } 0%, rgba(255, 255, 255, 0.00) 99.67%)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 2xl:gap-2">
                      <div className="p-1.5 border-2 border-white rounded-full shadow size-9 vhcenter bg-primaryalpha/10">
                        <img src={virus} alt=" " />
                      </div>
                      <p className="text-sm font-semibold 2xl:text-base dark:text-white">
                        {each?.leaveType?.charAt(0)?.toUpperCase() +
                          each?.leaveType?.slice(1)?.split("_").join(" ")}
                      </p>
                      <Tooltip placement="top" title={"View details"}>
                        <FiAlertCircle
                          className=" text-grey hover:text-primary cursor-pointer transform duration-300"
                          onClick={() => toggleModal(each)}
                        />
                      </Tooltip>
                    </div>
                    <p
                      onClick={() => {
                        setShow(true);
                        setLeaveId(each.leaveTypeId);
                      }}
                      className=" cursor-pointer flex text-green-700 2xl:text-xs text-[9px] bg-green-50 rounded-full px-[8px] py-[4px] font-medium h-fit"
                    >
                      {t("Apply_Leave")}
                    </p>
                  </div>
                  <Flex
                    justify="space-between"
                    className="text-sm font-medium text-grey"
                  >
                    <p className="text-xs ">{t("Yearly_Total_leave")}</p>
                    <p className=" px-[7px] bg-grayLight rounded-md text-black">
                      {each.leaveCount}
                    </p>
                  </Flex>
                  <Flex
                    justify="space-between"
                    className="text-sm font-medium text-grey"
                  >
                    <p className="text-xs ">{t("Yearly_availed")}</p>
                    <p className=" px-[7px] bg-primaryLight text-primary rounded-md">
                      {each.leaveTaken}
                    </p>
                  </Flex>
                  <Flex
                    justify="space-between"
                    className="text-sm font-medium text-grey"
                  >
                    <p className="text-xs ">{t("Leave Encashed")}</p>
                    <p className=" px-[7px] bg-grayLight rounded-md text-black">
                      {each.leaveEncashed}
                    </p>
                  </Flex>
                  <Flex
                    justify="space-between"
                    className="text-sm font-medium text-grey"
                  >
                    <p className="text-xs ">{t("Yearly_Balance")}</p>
                    <p className=" px-[7px] bg-redlight text-red-600 rounded-md">
                      {each.leaveBalance}
                    </p>
                  </Flex>
                </div>
              </SwiperSlide>
            ))}

            {/* </div> */}
          </Swiper>
          {leaveSummary.length > 3 && (
            <div className="z-50 w-full lg:w-[5%] h-full lg:h-[165px] bg-white dark:bg-black lg:shadow-[0px_4px_23px_0px] lg:shadow-[rgba(191,_183,_229,_0.38)] vhcenter flex-row-reverse  lg:flex-col">
              <div className="text-3xl cursor-pointer swiper-button-next text-primaryalpha dark:text-white">
                <Tooltip title={"Right"}>
                  <PiArrowCircleRight />
                </Tooltip>
              </div>
              <div className="text-3xl cursor-pointer swiper-button-prev text-primaryalpha dark:text-white">
                <Tooltip placement="bottom" title={"Left"}>
                  <PiArrowCircleLeft />
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      ) : (
        skeleton && (
          <div className="flex flex-col items-center w-full gap-2 overflow-y-hidden lg:flex-row lg:gap-6">
            <CustomSkeleton
              rows={3}
              width={"100%"}
              avatar={{ size: 36 }}
              title
            />
            <CustomSkeleton
              rows={3}
              width={"100%"}
              avatar={{ size: 36 }}
              title
            />
            <CustomSkeleton
              rows={3}
              width={"100%"}
              avatar={{ size: 36 }}
              title
            />
          </div>
        )
      )}

      <TableAnt
        data={myLeave}
        header={myLeaveHeaderList}
        actionID="employeeLeaveApplicationId"
        deleteApi={API.DELETE_EMPLOYEE_LEAVE_REQUEST}
        path="Request_History" //Attendance
        clickDrawer={(e, i, value, details) => {
          if (i === "view") {
            setView(true);
          } else {
            setShow(e);
          }
        }}
        buttonClick={(e) => {
          setUpdateId(e);
        }}
        TblBtnView={true}
        TblBtnName={t("New_Leave_Request")}
        TblBtnSubmit={(e) => {
          setShow(true);
        }}
        viewOutside={true}
        viewClick={(e, text) => {
          setView(true);
          setIsData(text);
        }}
        referesh={() => {
          getMyLeave();
          getMyLeaveSummary();
        }}
      />
      {show === true && (
        <LeaveRequest
          open={show}
          close={() => {
            setLeaveId(null);
            setUpdateId(null);
            setShow(false);
          }}
          employeeId={employeeId}
          updateId={updateId}
          refresh={() => {
            getMyLeave();
          }}
          leaveId={leaveId}
        />
      )}
      <ModalAnt
        isVisible={view}
        onClose={() => setView(false)}
        // width="435px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[553px] p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-14 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
              <img src={PopImg} alt="Img" className="rounded-full w-[28px]" />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              Employee Leave Request
            </p>
          </div>
          <div className="m-auto">
            <p className="text-center text-xs 2xl:text-sm text-gray-500">
              Review and manage employee leave requests efficiently. Ensure all
              leave applications are handled promptly and accurately to maintain
              smooth operations and employee satisfaction.
            </p>
          </div>
          <div className="max-h-[320px] overflow-auto flex flex-col gap-3 mt-2 pr-1.5">
            <div className="flex flex-col gap-4 borderb rounded-lg p-3 bg-[#F9F9F9] dark:bg-dark">
              <div className="flex items-center gap-2">
                <Avatar
                  image={isdata?.profilePicture}
                  name={isdata?.employeeName}
                  className="border-2 border-white shadow-md"
                />
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium text-xs 2xl:text-sm">
                    {isdata?.employeeName}
                  </p>
                  <p className="text-[10px] 2xl:text-xs text-grey">
                    {isdata?.designation}
                  </p>
                </div>
              </div>
              <div className="divider-h"></div>
              <div className="grid grid-cols-3 justify-evenly gap-4">
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs 2xl:text-sm text-grey">Leave Type</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {isdata?.leaveType}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs 2xl:text-sm text-grey">
                    Leave Start Date
                  </p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {isdata?.leaveDateFrom}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs 2xl:text-sm text-grey">
                    Leave End Date
                  </p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {isdata?.leaveDateTo}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs 2xl:text-sm text-grey">Status</p>
                  <p
                    className={`flex items-center justify-center gap-1 w-[90px] h-[20px] 2xl:w-[98px] 2xl:h-[24px] rounded-full ${
                      isdata?.requestStatusName === "Pending"
                        ? "bg-orange-100 text-orange-600"
                        : isdata?.requestStatusName === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <GoDotFill size={14} />
                    <p className="font-medium text-xs 2xl:text-sm">
                      {isdata?.requestStatusName}
                    </p>
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs 2xl:text-sm text-grey">Requested On</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {isdata?.createdOn}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs 2xl:text-sm text-grey">No:of days</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {isdata?.totalLeaveDays}
                  </p>
                </div>
              </div>
            </div>
            <div className="borderb rounded-lg p-3 bg-[#F9F9F9] dark:bg-dark">
              <div className="flex flex-col gap-2">
                <div className="flex-1 p-1">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-xs 2xl:text-sm">
                      Created By
                    </p>
                    <div className="flex items-center gap-2">
                      <Avatar
                        image={isdata?.createdBy?.profilePicture}
                        name={isdata?.createdBy?.employeeName}
                        className="border border-white shadow-md"
                      />
                      <div className="flex flex-col">
                        <p className="text-xs 2xl:text-sm font-semibold">
                          {isdata?.createdBy?.employeeName}
                        </p>
                        <p className="text-grey text-xs">
                          {isdata?.createdBy?.designation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-xs 2xl:text-sm">Reason</p>
                    <p className="text-grey text-[10px] 2xl:text-xs">
                      {isdata?.leaveReason}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {isdata?.leaveAttachments && (
              <div className="borderb rounded-lg p-3 bg-[#F9F9F9] dark:bg-dark cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Attachment</p>
                  <div className="flex gap-2 items-center">
                    <img
                      src={
                        isdata?.extension === "pdf"
                          ? pdf
                          : isdata?.extension === "png"
                          ? imag
                          : docs
                      }
                      alt="Attachment"
                      className="size-5"
                    />

                    <p
                      className="text-xs 2xl:text-sm font-medium"
                      onClick={() => {
                        handleFileView(isdata?.leaveAttachments);
                      }}
                    >
                      {isdata?.attachmentName}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isdata?.suemployees?.comment && <div className="divider-h"></div>}
            {isdata?.suemployees?.comment && (
              <div className="flex flex-col gap-1">
                <div className="font-medium text-xs 2xl:text-sm text-grey">
                  Comment
                </div>
                <div className="font-medium text-xs 2xl:text-sm">
                  {isdata?.suemployees?.comment}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {isdata?.adminData && (
                <>
                  <div className="font-medium text-xs 2xl:text-sm text-grey">
                    Approved by Admin
                  </div>
                  <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-2">
                      <Avatar
                        image={isdata.adminData.profilePicture || ""}
                        name={isdata.adminData.fullName}
                        className="border-2 border-white shadow-md"
                      />
                      <div className="flex flex-col">
                        <p className="font-medium text-sm">
                          {isdata.adminData.fullName}
                        </p>
                        <p className="text-grey text-xs">
                          {isdata.adminData.designation}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p
                        className={`font-semibold text-xs ${
                          isdata?.mainStatus === "Pending"
                            ? "text-orange-600"
                            : isdata?.mainStatus === "Rejected"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {isdata?.mainStatus}
                      </p>

                      <p className="text-grey text-xs">
                        {isdata.adminData.modifiedOn}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {isdata && (
                <div>
                  {Object.keys(isdata.track).map((stepKey) => {
                    const employees = isdata.track[stepKey];
                    const stepName =
                      stepKey.charAt(0).toUpperCase() + stepKey.slice(1); // Convert stepKey to a readable format

                    return (
                      <div key={stepKey} className="flex flex-col gap-4">
                        <h3 className="font-medium text-lg">{stepName}</h3>
                        <div className="flex flex-col gap-2">
                          {employees.map((employee) => (
                            <div
                              key={employee.id}
                              className="flex items-center justify-between p-2 border-b"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar
                                  image={employee.image || ""}
                                  name={employee.name}
                                  className="border-2 border-white shadow-md"
                                />
                                <div className="flex flex-col">
                                  <p className="font-medium text-sm">
                                    {employee.name}
                                  </p>
                                  <p className="text-grey text-xs">
                                    {employee.designation}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <p
                                  className={`font-semibold text-xs ${
                                    employee?.status === "Pending"
                                      ? "text-orange-600"
                                      : employee?.status === "Rejected"
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {employee?.status}
                                </p>

                                <p className="text-grey text-xs">
                                  {employee?.modifiedOn}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </ModalAnt>

      <ModalAnt
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        // width="435px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[553px] p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-14 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
              <img
                src={leaveimg}
                alt="#leaveimg"
                className="rounded-full w-[28px]"
              />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              Leave Balance Preview
            </p>
          </div>
          <div className="m-auto">
            <p className="text-center text-xs 2xl:text-sm text-gray-500">
              A Leave Balance Preview shows an employee's available leave time,
              including vacation, sick leave, and personal days. It details
              accrued, used, and remaining leave to help plan time off.
            </p>
          </div>
          <div className="flex flex-col gap-4  bg-[rgb(249,249,249)] border dark:bg-[#0B1019] rounded-lg p-3 2xl:p-4">
            <div className="border-b flex flex-col">
              <div className="flex gap-2 2xl:gap-2.5 items-center mb-3 ">
                <div className="p-1.5 border-2 border-white rounded-full shadow-md size-9 vhcenter bg-primaryalpha/10">
                  <img src={virus} alt="virus" />
                </div>
                <div>
                  <p className="font-medium text-sm 2xl:text-base">
                    {modalData?.leaveType ? modalData.leaveType : "--"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col gap-2 text-[10px] 2xl:text-xs">
                <p className="text-gray-500">Yearly Total Leave</p>
                <p className="font-bold">
                  {modalData && modalData.leaveBalance}{" "}
                  <spann className="font-semibold">available</spann>
                </p>
              </div>

              <div className="flex flex-col gap-2 text-[10px] 2xl:text-xs">
                <p className="text-gray-500">Yearly Availed</p>
                <p className="font-bold">
                  {modalData && modalData.leaveTaken}{" "}
                  <spann className="font-semibold">availed</spann>
                </p>
              </div>
              <div className="flex flex-col gap-2 text-[10px] 2xl:text-xs">
                <p className="text-gray-500">Yearly Balance</p>
                <p className="font-bold">
                  {modalData && modalData.leaveBalance}{" "}
                  <spann className="font-semibold">remaining</spann>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#F9F9F9] dark:bg-[#0B1019] border rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2 ">
            <p className="font-medium text-sm 2xl:text-base ">
              Current Month Summary
            </p>
            <div className=" border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                <div className="flex flex-col gap-2  text-[10px] 2xl:text-xs">
                  <p className="text-gray-500 ">Balance</p>
                  <p className="font-semibold ">
                    {modalData?.leaveBalance ? modalData.leaveBalance : "--"}
                  </p>
                </div>
                <div className="flex flex-col gap-2  text-[10px] 2xl:text-xs">
                  <p className="text-gray-500 ">Leave Lapsed</p>
                  <p className="font-semibold ">--</p>
                </div>
                <div className="flex flex-col gap-2  text-[10px] 2xl:text-xs">
                  <p className="text-gray-500 ">Leave Approved</p>
                  <p className="font-semibold ">--</p>
                </div>
                <div className="flex flex-col gap-2  text-[10px] 2xl:text-xs">
                  <p className="text-gray-500 ">Bought Forward</p>
                  <p className="font-semibold ">--</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalAnt>
    </FlexCol>
  );
}
