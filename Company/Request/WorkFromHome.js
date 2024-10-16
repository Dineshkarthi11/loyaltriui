import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import TableAnt from "../../common/TableAnt";
import ModalAnt from "../../common/ModalAnt";
import popimage from "../../../assets/images/image 1467.png";
import TextArea from "../../common/TextArea";
import API, { action } from "../../Api";
import ButtonClick from "../../common/Button";
import { useNotification } from "../../../Context/Notifications/Notification";
import { Popconfirm } from "antd";
import Avatar from "../../common/Avatar";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function WorkFromHome({
  refresh = () => {},
  requestEmployeeId = "",
  specialRequestId = "",
  handleclose = () => {},
  data = [],
  referesh = () => {},
}) {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [approveOpen, setApproveOpen] = useState("");
  const [RejectOpen, setRejectOpen] = useState("");

  const [isOpen, setIsOpen] = useState("");
  const [workfromHomeRequest, setWorkfromHomeRequest] = useState([]);
  const [FilterKey, setFilterKey] = useState("All");
  const [modalData, setModalData] = useState([]);
  const [workFromHomeData, setWorkFromHomeData] = useState([]);

  const [companyId, setcompanyId] = useState(localStorageData.companyId);
  const [Id, setId] = useState("");
  const [actionEmployeeId, setActionEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [content, setContent] = useState("");
  const [blink, setBlink] = useState(false);
  const [modalDetails, setModalDetails] = useState({
    openModal: false,
    details: "",
  });

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const header = [
    {
      Work_From_Home: [
        {
          id: 1,
          title: t("Employee Name"),
          value: ["employeeName", "code"],
          bold: true,
          flexColumn: true,
          logo: true,
        },
        {
          id: 2,
          title: t("From Date"),
          value: "fromDate",
        },
        {
          id: 3,
          title: t("To Date"),
          value: "toDate",
        },
        {
          id: 4,
          title: t("Reason"),
          value: "requestDescription",
          width: 300,
        },
        {
          id: 5,
          title: "Approving Employees",
          value: "multiImage",
          multiImage: true,
          view: true,
        },
        {
          id: 6,
          title: t("Employee Status"),
          value: "requestStatusName",
          status: true,
          colour: "requestStatusColour",
          mainStatus: "mainStatus",
          mainStatusColor: "mainStatusColor",
        },
        {
          id: 7,
          title: "",
          key: "requestStatusName",
          value: "Pending",
          Approve: true,
          mainStatus: "mainStatus",
        },
      ],
    },
  ];
  const [counts, setCounts] = useState({
    All: 0,
    Pending: 0,
    Approved: 0,
    Rejected: 0,
  });
  const statuses = [
    { label: "All", count: counts.All },
    { label: "Approved", count: counts.Approved },
    { label: "Pending", count: counts.Pending },
    { label: "Rejected", count: counts.Rejected },
  ];

  const toggleModal = (Id, data) => {
    setId(Id);
    setIsOpen(!isOpen);
    setModalData([data]);
  };

  useEffect(() => {
    if (data?.status === 200) {
      const tableData = data.result?.map((each) => {
        const employees = Array.isArray(each.approvalData)
          ? each.approvalData
          : [each.approvalData];

        return {
          ...each,

          name: employees?.map((data) => data.firstName),
          multiImage: employees?.map((data) => data.profilePicture),
          employeeId: employees?.map((data) => data.employeeId),
          // statusdot: employees?.map((data) => data.status),
        };
      });
      setWorkFromHomeData(tableData);
      setWorkfromHomeRequest(tableData);
      let filteredData = data?.result;

      setCounts({
        All: filteredData.length,
        Pending: filteredData.filter(
          (request) =>
            request.requestStatusName === "Pending" &&
            request.mainStatus === "Pending"
        ).length,
        Approved: filteredData.filter(
          (request) =>
            request.requestStatusName === "Approved" ||
            request.mainStatus === "Approved"
        ).length,
        Rejected: filteredData.filter(
          (request) =>
            request.requestStatusName === "Rejected" ||
            request.mainStatus === "Rejected"
        ).length,
      });
    }
  }, [data]);

  useMemo(() => {
    switch (FilterKey) {
      case "All":
        setWorkfromHomeRequest(workFromHomeData);
        break;

      case "Approved":
        setWorkfromHomeRequest(
          workFromHomeData.filter(
            (request) =>
              request.requestStatusName === "Approved" ||
              request.mainStatus === "Approved"
          )
        );

        break;
      case "Pending":
        setWorkfromHomeRequest(
          workFromHomeData.filter(
            (request) =>
              request.requestStatusName === "Pending" &&
              request.mainStatus === "Pending"
          )
        );
        break;

      case "Rejected":
        setWorkfromHomeRequest(
          workFromHomeData.filter(
            (request) =>
              request.requestStatusName === "Rejected" ||
              request.mainStatus === "Rejected"
          )
        );
        break;

      default:
        break;
    }
  }, [FilterKey]);

  const getSpecialRequest = async (Id) => {
    try {
      const result = await action(API.GET_SPECIAL_REQUESTBY_ID, {
        id: specialRequestId,
      });
      if (specialRequestId) {
        setIsOpen(!isOpen);
      }
      setModalData([result?.result]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (specialRequestId) {
      getSpecialRequest();
    }
  }, [specialRequestId]);

  const handleAprove = async () => {
    try {
      const result = await action(API.APPROVE_SPECIAL_REQUEST, {
        specialRequestId: Id || specialRequestId,
        actionEmployeeId: actionEmployeeId,
        actionStatus: 1,
        actionRemarks: content || null,
        companyId: companyId,
        requestType: 1,
      });
      if (result.status === 200) {
        openNotification("success", "Success", result.message);
        referesh();
        handleclose();
        setTimeout(() => {
          setIsOpen(false);
          refresh(true);
        }, 1000);
      } else if (result.status === 500) {
        openNotification("error", "Failed", result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleReject = async () => {
    try {
      const result = await action(API.APPROVE_SPECIAL_REQUEST, {
        specialRequestId: Id || specialRequestId,
        actionEmployeeId: actionEmployeeId,
        actionStatus: 2,
        actionRemarks: content || null,
        companyId: companyId,
        requestType: 1,
      });
      if (result.status === 200) {
        openNotification("success", "Success", result.message);
        referesh();
        handleclose();
        setTimeout(() => {
          setIsOpen(false);

          refresh(true);
        }, 1000);
      } else if (result.status === 500) {
        openNotification("error", "Failed", result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={`  w-full flex flex-col gap-6 `}>
      <TableAnt
        data={workfromHomeRequest}
        header={header}
        path={"Work_From_Home"}
        actionID="specialRequestId"
        buttonClick={(rowData, text) => {
          toggleModal(rowData, text);
        }}
        filterTools={true}
        statuses={statuses}
        FilterDataChange={(e) => {
          setFilterKey(e);
        }}
        activeStatus={FilterKey}
        viewOutside={true}
        viewClick={(e, details) => {
          setModalDetails({ openModal: true, details: details });
        }}
      />
      {/* to show approve and Reject popup */}
      <ModalAnt
        isVisible={isOpen}
        onClose={() => {
          if (approveOpen || RejectOpen) {
            setBlink(true);

            setTimeout(() => setBlink(false), 500);
          } else {
            setIsOpen(false);
          }

          handleclose();
          setContent("");
        }}
        // width="435px"

        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-2 w-full">
            <Popconfirm
              placement="top"
              title={"Confirm To Reject"}
              description={
                "Are you sure to Reject this Work From Home Request?"
              }
              okText="Confirm"
              cancelText="No"
              onCancel={() => {
                setRejectOpen(false);
              }}
              onConfirm={() => {
                handleReject();
                setRejectOpen(false);
              }}
              open={RejectOpen}
              // className="activeBtn"
              style={{}}
              overlayClassName={blink && RejectOpen ? "blink-effect" : ""}
            >
              <ButtonClick
                buttonName={"Reject"}
                BtnType="primary"
                className={"m-auto w-full 2xl:w-[228px]"}
                danger
                handleSubmit={() => {
                  setApproveOpen(false);
                  setRejectOpen(true);
                }}
              />
            </Popconfirm>
            <Popconfirm
              placement="top"
              title={"Confirm To Approve"}
              description={
                "Are you sure to Approve this Work From home Request"
              }
              okText="Confirm"
              cancelText="No"
              onCancel={() => {
                setApproveOpen(false);
              }}
              onConfirm={() => {
                handleAprove();
                setApproveOpen(false);
              }}
              open={approveOpen}
              overlayClassName={blink && approveOpen ? "blink-effect" : ""}
              style={{}}
            >
              <ButtonClick
                buttonName={"Approve"}
                BtnType="primary"
                className={"m-auto w-full 2xl:w-[228px]"}
                handleSubmit={() => {
                  setRejectOpen(false);
                  setApproveOpen(true);
                  // handleAprove();
                }}
              />
            </Popconfirm>
          </div>
        }
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[506px] p-2">
          {modalData?.map((data, index) => (
            <>
              <div className="flex gap-3 items-center">
                <div className="border-2 border-[#FFFFFF] size-[44px] rounded-full flex items-center justify-center bg-[#CBCAFC66]">
                  <img
                    src={popimage}
                    alt="#PunchImage"
                    className="rounded-full w-[28px]"
                  />
                </div>
                <p className="font-semibold text-[18px] 2xl:text-[20px]">
                  Work From Home Request
                </p>
              </div>
              <div className="flex gap-10 text-[10px] 2xl:text-[12px] p-2 border-b ">
                <div className="flex flex-col gap-2 text-gray-500 dark:text-gray-400">
                  <p>Request Type</p>
                  <p>From</p>
                  <p>To</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Work From Home</p>
                  <p>{data?.fromDate}</p>
                  <p>{data?.toDate}</p>
                </div>
              </div>
              <div className="flex gap-10 text-[10px] 2xl:text-[12px] items-center pr-12 ">
                <p className="text-gray-500 dark:text-gray-400 p-2">
                  Created By
                </p>
                <div className="flex gap-1 items-center">
                  {data?.profilePicture ? (
                    <div className="overflow-hidden border-2 border-white rounded-full shadow-md 2xl:size-10 size-8 shrink-0">
                      <img
                        src={data?.profilePicture}
                        alt="profilePicture"
                        className="object-cover object-center w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="overflow-hidden border-2 border-white rounded-full shadow-md 2xl:size-10 size-8 shrink-0 bg-primaryalpha/20 dark:bg-primaryalpha/30 vhcenter">
                      <p className="font-semibold  text-primary">
                        {specialRequestId
                          ? data?.reqEmployeeName?.charAt(0).toUpperCase()
                          : data?.employeeName?.charAt(0).toUpperCase()}
                      </p>
                    </div>
                  )}
                  <p className="font-medium text-[10px] 2xl:text-[12px]">
                    {specialRequestId
                      ? data?.reqEmployeeName
                      : data?.employeeName}
                  </p>
                </div>
              </div>
              <div className="bg-[#F8F8FA] rounded-lg p-2 text-[10px] 2xl:text-[12px] dark:bg-black">
                <p>Reason:</p>
                <p className="truncate text-gray-500 dark:text-gray-400">
                  {data?.requestDescription}
                </p>
              </div>
              <div className="">
                <TextArea
                  title="Comment"
                  placeholder="Comment"
                  change={(e) => {
                    setContent(e);
                  }}
                  value={content}
                />
              </div>
            </>
          ))}
        </div>
      </ModalAnt>

      {/* open modal when click on data to show details */}
      <ModalAnt
        isVisible={modalDetails.openModal}
        onClose={() => setModalDetails({ openModal: false, details: "" })}
        // width="435px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
      >
        <div className="flex flex-col gap-2.5 w-[485px] p-2  ">
          <>
            <div className="flex gap-3 items-center">
              <div className="border-2 border-[#FFFFFF] size-[44px] rounded-full flex items-center justify-center bg-[#CBCAFC66]">
                <img
                  src={popimage}
                  alt="#PunchImage"
                  className="rounded-full w-[28px]"
                />
              </div>
              <p className="font-semibold text-xl 2xl:text-2xl">
                Work From Home Request
              </p>
            </div>
            <div className="flex gap-10 text-[10px] 2xl:text-xs p-2 text-slate-500 dark:text-slate-400">
              <div className="flex flex-col gap-2">
                <p>Request Type</p>
                <p>From</p>
                <p>To</p>
              </div>
              <div className="flex flex-col gap-2">
                <p>Work From Home</p>
                <p>{modalDetails?.details?.fromDate}</p>
                <p>{modalDetails?.details?.toDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] 2xl:text-xs p-2">
              <p className="text-slate-500 dark:text-slate-400">
                Employee Status
              </p>
              {modalDetails?.details?.mainStatus === "Pending" ? (
                <div
                  className={`rounded-full px-2 py-0.5 w-fit text-[10px] 2xl:text-sm vhcenter flex-nowrap`}
                  style={{
                    color:
                      modalDetails?.details?.requestStatusColour || undefined,
                    backgroundColor: modalDetails?.details?.requestStatusColour
                      ? `${modalDetails?.details?.requestStatusColour}20`
                      : undefined,
                  }}
                >
                  <div className="font-semibold">
                    {modalDetails?.details?.requestStatusName}
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-full px-2 py-0.5 w-fit text-[10px] 2xl:text-sm vhcenter flex-nowrap`}
                  style={{
                    color: modalDetails?.details?.mainStatusColor || undefined,
                    backgroundColor: modalDetails?.details?.mainStatusColor
                      ? `${modalDetails?.details?.mainStatusColor}20`
                      : undefined,
                  }}
                >
                  <div className="font-semibold">
                    {modalDetails?.details?.mainStatus}
                  </div>
                </div>
              )}
            </div>
            {modalDetails?.details?.requestDescription && (
              <div className="bg-[#F8F8FA] dark:bg-[#1B1B1B] rounded-lg p-2 text-slate-500 dark:text-slate-400 text-[10px] 2xl:text-xs">
                <div>Reason:</div>
                <div className="leading-3">
                  {modalDetails?.details?.requestDescription}
                </div>
              </div>
            )}

            {modalDetails?.details?.actionRemarks && (
              <div className="text-[10px] 2xl:text-xs">
                <div className="font-medium">Comment</div>
                <div className="border bg-[#F4F4F4] dark:bg-[#1B1B1B] rounded-lg p-2.5 mt-2">
                  <div>{modalDetails?.details?.actionRemarks}</div>
                </div>
              </div>
            )}
            {modalDetails?.details?.approvalData && (
              <div className="flex flex-col gap-2">
                <div className="font-medium text-xs 2xl:text-sm text-grey">
                  Approval Flow Employee Status
                </div>
                {modalDetails?.details?.approvalData.map((item) => (
                  <div
                    key={item.employeeId}
                    className="flex items-center justify-between mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar
                        image={item.profilePicture || ""}
                        name={item.firstName || ""}
                        className="border-2 border-white shadow-md"
                      />
                      <div className="flex flex-col gap-0.5">
                        <p className="font-medium text-xs 2xl:text-sm">
                          {item.firstName}
                        </p>
                        <p className="text-grey text-[10px] 2xl:text-xs">
                          {item.designation}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {modalDetails?.details?.isByAdmin >= 1 &&
                      item.status === "Pending" ? (
                        <p className="flex items-center justify-center">
                          No Action Required
                        </p>
                      ) : (modalDetails?.details?.isByAdmin === "0" ||
                          modalDetails?.details?.isByAdmin === null ||
                          modalDetails?.details?.isByAdmin === 0 ||
                          modalDetails?.details?.isByAdmin === "") &&
                        modalDetails?.details?.mainStatus !== "Pending" &&
                        item.status === "Pending" ? (
                        <p className="flex items-center justify-center">
                          No Action Required
                        </p>
                      ) : (
                        <p
                          className={`flex items-center justify-end gap-1 w-[90px] h-[20px] 2xl:w-[98px] 2xl:h-[24px] rounded-full ${
                            item.status === "Pending"
                              ? " text-orange-600"
                              : item.status === "Rejected"
                              ? " text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {item.status}
                        </p>
                      )}

                      <p className="flex text-grey text-[10px] 2xl:text-xs justify-end ">
                        {item.modifiedOn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {modalDetails?.details?.adminData && (
              <div className="pt-2 flex flex-col gap-2">
                <h3 className="font-medium text-xs 2xl:text-sm">
                  Action Taken By Admin
                </h3>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Avatar
                      image={modalDetails?.details?.adminData.profilePicture}
                      name={modalDetails?.details?.adminData.fullName}
                      className="border-2 border-white shadow-md"
                    />
                    <div className="flex flex-col gap-0.5">
                      <p className="font-medium text-xs 2xl:text-sm">
                        {modalDetails?.details?.adminData.fullName}
                      </p>
                      <p className="text-grey text-[10px] 2xl:text-xs">
                        {modalDetails?.details?.adminData.designation}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p
                      className={`flex items-center justify-center gap-1 w-[90px] h-[20px] 2xl:w-[98px] 2xl:h-[24px] rounded-full ${
                        modalDetails?.details?.mainStatus === "Pending"
                          ? "text-orange-600"
                          : modalDetails?.details?.mainStatus === "Rejected"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {modalDetails?.details?.mainStatus}
                    </p>
                    <p className="text-grey text-[10px] 2xl:text-xs">
                      {modalDetails?.details?.adminData.modifiedOn}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </ModalAnt>
    </div>
  );
}
