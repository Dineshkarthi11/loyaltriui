import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API, { action } from "../../Api";
import FlexCol from "../../common/FlexCol";
import ButtonClick from "../../common/Button";
import TableAnt from "../../common/TableAnt";
import Bulk from "../../../assets/images/Bulk.png";
import pdf from "../../../assets/images/uploader/pdf.png";
import docs from "../../../assets/images/uploader/document-2 1.png";
import imag from "../../../assets/images/uploader/Group.png";
import PopImg from "../../../assets/images/EmpLeaveRequest.svg";
import ModalAnt from "../../common/ModalAnt";
import { GoDotFill } from "react-icons/go";
import Choose from "../../common/Choose";
import * as yup from "yup";
import Heading from "../../common/Heading";
import TextArea from "../../common/TextArea";
import Avatar from "../../common/Avatar";
import LeaveApproveDrawer from "./LeaveApproveDrawer";
import { useFormik } from "formik";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function EmployeeLeave() {
  const { t } = useTranslation();
  const [selectedCount, setSelectedCount] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState({ type: "", status: false });
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState([]);

  const [employeeLeave, setEmployeeLeave] = useState([]);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [approvedBtn, setApprovedBtn] = useState();
  const [approvedEmployeeIds, setApprovedEmployeeIds] = useState();
  const [view, setView] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");
  const [isdata, setIsData] = useState();
  const [unChecked, setunChecked] = useState("");

  const [approvedDetails, setApprovedDetails] = useState();
  const [employeeLeaveHeaderList, setEmployeeLeaveHeaderList] = useState([
    {
      Requests: [
        {
          id: 1,
          title: "Employee",
          value: "employeeName",
          logo: true,
        },
        {
          id: 2,
          title: "Leave From Date",
          value: "leaveDateFrom",
        },
        {
          id: 3,
          title: "Leave To Date",
          value: "leaveDateTo",
        },

        {
          id: 4,
          title: "Reason",
          value: "leaveReason",
          width: "300px",
        },
        {
          id: 5,
          title: "Leave Type",
          value: "LeaveTypeName",
        },

        {
          id: 6,
          title: "Requested On",
          value: "requestedDate",
        },
        {
          id: 7,
          title: "Status",
          value: "requestStatusName",
          status: true,
          colour: "requestStatusColour",
          mainStatus: "mainStatus",
          mainStatusColor: "mainStatusColor",
          dotsVertical: true,
          fixed: "right",
        },
      ],
    },
  ]);

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const getEmployeeLeave = async () => {
    try {
      const result = await action(API.EMPLOYEE_LEAVES, {
        id: employeeId,
        companyId: companyId,
      });

      const updatedLeaves = result.result.map((item) => ({
        ...item,
        requestStatus:
          item.mainStatus === "pending"
            ? item.mainStatus
            : item.requestStatusName,
      }));
      setEmployeeLeave(updatedLeaves);
    } catch (error) {
      openNotification("error", "Failed..", error.code);
      console.log(error);
    }
  };

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
      console.error("Error opening the file:", error);
      alert("Failed to open the file");
    }
  };

  const toggleModal = (Id, data) => {
    setIsOpen(!isOpen);
    setModalData([data]);
  };

  useEffect(() => {
    getEmployeeLeave();
  }, []);

  useEffect(() => {
    // getEmployeeList();
  }, [employeeId]);

  const formik = useFormik({
    initialValues: {
      remark: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      remark: yup.string().required("Remark is Required"),
    }),

    onSubmit: async (e) => {
      try {
        const result = await action(API.EMPLOYEE_APPROVED, {
          id: employeeId,
          employeeId: approvedDetails?.map((each) => each.employeeId) || null,
          remarks: e.remark,
          superiorEmployeeId: employeeId,
          requestStatus: requestStatus,
          companyId: companyId,
          leaveTypeId: approvedDetails?.map((each) => each.leaveType) || null,
          employeeLeaveApplicationId: approvedEmployeeIds || null,
          isFinalHeirarchy:
            approvedDetails?.map((each) => each.isFinalHeirarchy) || null,
          createdBy: employeeId,
        });
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            getEmployeeLeave();
          }, 1000);
          setunChecked(true);
          setApprovedBtn(false);
          setIsOpenModal({ type: "", status: false });
        } else {
          openNotification("error", "Failed..", result.code);
        }
      } catch (error) {
        openNotification("error", "Failed..", error.code);
      }
    },
  });

  return (
    <FlexCol>
      <Heading
        title={t("Employee_Leave")}
        description={t(
          "Oversees and approves employee leave requests, ensuring proper leave management."
        )}
      />

      <div className={`${approvedBtn && "mb-fit md:mb-20"}`}>
        <TableAnt
          data={employeeLeave}
          header={employeeLeaveHeaderList}
          actionID="employeeLeaveApplicationId"
          path="Requests"
          buttonClick={(Id, data) => {
            toggleModal(Id, data);
          }}
          selectedRow={(key, value, details) => {
            setApprovedBtn(details.length !== 0 ? key : false);
            setApprovedEmployeeIds(value);
            setApprovedDetails(details);
            setSelectedCount(details.length);
          }}
          headerTools={true}
          viewOutside={true}
          viewClick={(e, text) => {
            setView(true);
            setIsData(text);
            setApprovedEmployeeIds([parseInt(e)]);
          }}
          referesh={(e) => {
            setunChecked(false);
          }}
          unChecked={unChecked}
        />
      </div>

      {approvedBtn && (
        <Choose selectedCount={selectedCount}>
          <p className="flex items-center gap-2">
            <ButtonClick
              buttonName={"Reject"}
              BtnType="primary"
              danger
              handleSubmit={() => {
                setRequestStatus("Rejected");
                setIsOpenModal({ type: "Rejected", status: true });
              }}
            />
            <ButtonClick
              buttonName={"Approve"}
              BtnType="primary"
              handleSubmit={() => {
                setRequestStatus("Approved");
                setIsOpenModal({ type: "Approved", status: true });
              }}
            />
          </p>
        </Choose>
      )}

      {isOpen && (
        <LeaveApproveDrawer
          open={isOpen}
          employeeId={approvedEmployeeIds}
          details={approvedDetails}
          actionApi={API.EMPLOYEE_APPROVED}
          data={modalData}
          close={(e) => {
            setIsOpen(e);
          }}
        />
      )}

      <ModalAnt
        isVisible={isOpenModal.status}
        onClose={() => {
          formik.resetForm();
          setIsOpenModal({ type: "", status: false });
        }}
        // width="435px"
        showCancelButton={true}
        cancelButtonClass="w-full"
        showTitle={false}
        centered={true}
        padding="8px"
        showOkButton={true}
        okText={
          isOpenModal.type === "Approved"
            ? "Confirm Approval"
            : "Confirm Reject"
        }
        okButtonDanger={isOpenModal.type === "Approved" ? false : true}
        okButtonClass="w-full"
        onOk={() => {
          if (isOpenModal.type === "Approved") {
            setRequestStatus("Approved");
          } else {
            setRequestStatus("Rejected");
          }
          formik.handleSubmit();
        }}
        error={formik.values.remark === "" ? true : false}
      >
        <div className="flex flex-col gap-2.5 md:w-[435px] 2xl:w-[522px] p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-14 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
              <img src={Bulk} alt="" className="rounded-full w-[28px]" />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              {isOpenModal.type === "Approved"
                ? "Confirm Bulk Leave Approval"
                : "Confirm Reject Leave Approval"}
            </p>
          </div>
          <div className="m-auto">
            <p className="text-center text-xs 2xl:text-sm text-gray-500">
              {isOpenModal.type === "Approved"
                ? "Are you sure you want to approve the selected leave requests? You can add any remarks below before confirming the approval."
                : "Are you sure you want to reject the selected leave requests? You can add any remarks below before confirming the approval."}
            </p>
          </div>
          <div className="max-h-[320px] overflow-auto mt-2 flex flex-col gap-2">
            <TextArea
              title="Remarks"
              placeholder="Remarks here"
              value={formik.values.remark}
              change={(e) => {
                formik.setFieldValue("remark", e);
              }}
              error={formik.errors.remark}
              required
            />
            <div
              className={`font-medium text-xs 2xl:text-sm ${
                isOpenModal.type === "Approved"
                  ? "text-primary"
                  : "text-red-500"
              }`}
            >
              {selectedCount > 1
                ? `${selectedCount} Requests Selected`
                : `${selectedCount} Request Selected`}
            </div>
          </div>
        </div>
      </ModalAnt>

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
          <div className="max-h-[320px] overflow-auto flex flex-col gap-3 pt-2 pr-1.5">
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
                    {isdata?.LeaveTypeName}
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
                        ? "bg-orange-100 text-yellow-600 dark:bg-yellow-600/30"
                        : isdata?.status === "Rejected"
                        ? " bg-red-100 text-red-600 dark:bg-red-600/30"
                        : "bg-green-100 text-green-600 dark:bg-green-600/30"
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
                    {isdata?.requestedDate}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs 2xl:text-sm text-grey">No:of days</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {isdata?.totalLeaveDays}
                    {isdata?.leaveSession === "secondHalf" && " / Second half"}
                    {isdata?.leaveSession === "firstHalf" && " / First half"}
                  </p>
                </div>
              </div>
            </div>
            {isdata?.leaveAttachments && (
              <div className="borderb rounded-lg p-3 bg-[#F9F9F9] dark:bg-dark cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Attachment</p>
                  <div className="flex gap-2 items-center">
                    <img
                      alt="Attachment"
                      src={
                        isdata?.extension === "pdf"
                          ? pdf
                          : isdata?.extension === "png"
                          ? imag
                          : docs
                      }
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
            <div className="borderb rounded-lg p-3 bg-[#F9F9F9] dark:bg-dark">
              <div className="flex flex-col gap-2">
                <p className="font-medium text-xs 2xl:text-sm">Reason</p>
                <p className="text-grey text-[10px] 2xl:text-xs">
                  {isdata?.leaveReason}
                </p>
              </div>
            </div>
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
              {isdata &&
                isdata.approvalData &&
                isdata.approvalData.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="font-medium text-xs 2xl:text-sm text-grey">
                      Approval Flow Employee Status
                    </div>
                    {isdata.approvalData.map((item) => (
                      <div
                        key={item?.employeeId}
                        className="flex items-center justify-between mb-2"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar
                            image={item?.profilePicture || ""}
                            name={item?.firstName || ""}
                            className="border-2 border-white shadow-md"
                          />
                          <div className="flex flex-col gap-0.5">
                            <p className="font-medium text-xs 2xl:text-sm">
                              {item?.firstName}
                            </p>
                            <p className="text-grey text-[10px] 2xl:text-xs">
                              {item?.designation}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p
                            className={`flex items-center justify-end gap-1 h-[20px] 2xl:w-[150px] 2xl:h-[24px] rounded-full text-xs 2xl:text-sm ${
                              item?.status === "Pending"
                                ? "text-orange-600"
                                : item?.status === "Rejected"
                                ? "text-red-600"
                                : item?.status === "No Action Required"
                                ? "text-primary"
                                : "text-green-600"
                            }`}
                          >
                            {item?.status}
                          </p>
                          <p className="flex justify-end text-grey text-[10px] 2xl:text-xs">
                            {item?.modifiedOn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      </ModalAnt>
    </FlexCol>
  );
}
