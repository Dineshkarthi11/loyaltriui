import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import TableAnt from "../../common/TableAnt";
import ModalAnt from "../../common/ModalAnt";
import TextArea from "../../common/TextArea";
import FileUpload from "../../common/FileUpload";
import popupimg from "../../../assets/images/image 1470.png";
import API, { action, fileAction } from "../../Api";
import ButtonClick from "../../common/Button";
import { useNotification } from "../../../Context/Notifications/Notification";
import { Popconfirm } from "antd";
import localStorageData from "../../common/Functions/localStorageKeyValues";
export default function LetterRequests({
  refresh = () => {},
  requestEmployeeId = "",
  specialRequestId = "",
  handleclose = () => {},
  data = [],
  referesh = () => {},
}) {
  const { t } = useTranslation();
  const { showNotification } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [letterRequest, setLetterRequest] = useState([]);
  const [approveOpen, setApproveOpen] = useState(false);
  const [RejectOpen, setRejectOpen] = useState(false);
  const [employeeId, setemployeeId] = useState(localStorageData.employeeId);
  const [companyId, setcompanyId] = useState(localStorageData.companyId);
  const [Id, setId] = useState("");
  const [actionEmployeeId, setActionEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [content, setContent] = useState("");
  const [file, setfile] = useState("");
  const [FilterKey, setFilterKey] = useState("All");
  const [letterRequestData, setLetterRequestData] = useState([]);
  const [blink, setBlink] = useState(false);

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
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

  const header = [
    {
      Letter_Requests: [
        {
          id: 1,
          title: t("Employee Name"),
          value: ["employeeName", "code"], // Ensure this matches the key in data
          bold: true,
          flexColumn: true,
          logo: true,
        },
        {
          id: 2,
          title: t("Letter Type"),
          value: "requestLetterType",
        },
        {
          id: 3,
          title: t("Purpose"),
          value: "requestDescription",
        },
        {
          id: 4,
          title: t("Requested On"),
          value: "fromDate", // Ensure this matches the key in data (you might need to update data objects)
        },
        {
          id: 5,
          title: "Employee Status",
          value: "requestStatusName",
          status: true,
          colour: "requestStatusColour",
          mainStatus: "mainStatus",
          mainStatusColor: "mainStatusColor",
        },
        {
          id: 6,
          title: "Approving Employees",
          value: "multiImage",
          multiImage: true,
          view: true,
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

  const [modalData, setModalData] = useState(null);
  const toggleModal = (Id, data) => {
    setId(Id);
    setIsOpen(!isOpen);

    setModalData([data]);
    setfile({
      name: data.documentName,
    });
  };
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

  useMemo(() => {
    if (data?.result === 200) {
      const tableData = data.result?.map((each) => {
        const employees = Array.isArray(each.approvalData)
          ? each.approvalData
          : [each.approvalData];

        return {
          ...each,

          name: employees?.map((data) => data.firstName),
          multiImage: employees?.map((data) => data.profilePicture),
          employeeId: employees?.map((data) => data.employeeId),
          statusdot: employees?.map((data) => data.status),
        };
      });

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

      setLetterRequest(tableData);
      setLetterRequestData(tableData);
    }
  }, [data]);

  useMemo(() => {
    switch (FilterKey) {
      case "Pending":
        setLetterRequest(
          letterRequestData.filter(
            (request) =>
              request.requestStatusName === "Pending" &&
              request.mainStatus === "Pending"
          )
        );
        break;

      case "Approved":
        setLetterRequest(
          letterRequestData.filter(
            (request) =>
              request.requestStatusName === "Approved" ||
              request.mainStatus === "Approved"
          )
        );
        break;
      case "Rejected":
        setLetterRequest(
          letterRequestData.filter(
            (request) =>
              request.requestStatusName === "Rejected" ||
              request.mainStatus === "Rejected"
          )
        );
        break;
      case "All":
        setLetterRequest(letterRequestData);
        break;
      default:
        setLetterRequest(letterRequestData);
        break;
    }
  }, [FilterKey]);
  const handleAprove = async () => {
    try {
      const formData = new FormData();
      formData.append("action", API.GET_LETTER_REQUEST);
      formData.append(
        "jsonParams",
        JSON.stringify({
          specialRequestId: Id || specialRequestId,
          actionEmployeeId: actionEmployeeId,
          actionStatus: 1,
          actionRemarks: content || null,
          requestType: 2,
          companyId: companyId,
        })
      );
      formData.append("file", file || null);
      const result = await fileAction(formData);
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
      const formData = new FormData();
      formData.append("action", API.GET_LETTER_REQUEST);
      formData.append(
        "jsonParams",
        JSON.stringify({
          specialRequestId: Id || specialRequestId,
          actionEmployeeId: actionEmployeeId,
          actionStatus: 2,
          actionRemarks: content || null,
          requestType: 2,
          companyId: companyId,
        })
      );
      handleclose();
      formData.append("file", file || null);
      const result = await fileAction(formData);
      if (result.status === 200) {
        openNotification("success", "Success", result.message);
        referesh();
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
  useEffect(() => {}, [modalData]);
  const handlePreview = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <div className={`  w-full flex flex-col gap-6 `}>
      <TableAnt
        data={letterRequest}
        header={header}
        path={"Letter_Requests"}
        actionID="specialRequestId"
        buttonClick={(rowData, text) => {
          toggleModal(rowData, text);
        }}
        filterTools={true}
        statuses={statuses}
        FilterDataChange={(e) => {
          // console.log(e, "Key");
          setFilterKey(e);
        }}
        activeStatus={FilterKey}
      />

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
          setfile(null);
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
              description={"Are you sure to Reject this Letter Request?"}
              okText="Confirm"
              cancelText="No"
              onCancel={() => {
                setRejectOpen(false);
              }}
              onConfirm={() => {
                // console.log("hh");
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
              description={"Are you sure to Approve Letter Request?"}
              okText="Confirm"
              cancelText="No"
              onCancel={() => {
                setApproveOpen(false);
              }}
              onConfirm={() => {
                // console.log("hh");
                handleAprove();
                setApproveOpen(false);
              }}
              open={approveOpen}
              // className="activeBtn"
              overlayClassName={blink && approveOpen ? "blink-effect" : ""}
              style={{}}
            >
              <ButtonClick
                buttonName={"Approve"}
                BtnType="primary"
                className={"m-auto w-full 2xl:w-[228px]"}
                handleSubmit={() => {
                  setApproveOpen(true);
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
                    src={popupimg}
                    alt="#PunchImage"
                    className="rounded-full w-[28px]"
                  />
                </div>
                <p className="font-semibold text-[18px] 2xl:text-[20px]">
                  Letter Request
                </p>
              </div>
              <div className="flex gap-10 text-[10px] 2xl:text-xs p-2 border-b ">
                <div className="flex flex-col gap-2 text-gray-500 dark:text-gray-400">
                  <p>Requested For</p>
                  <p>Requested On</p>
                </div>
                <div className="flex flex-col gap-2 font-semibold">
                  <p>{data?.requestLetterType}</p>
                  <p>{data?.fromDate}</p>
                </div>
              </div>
              <div className="flex gap-10 text-[10px] 2xl:text-xs items-center pr-12 ">
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
                  <p className="font-medium text-[10px] 2xl:text-xs">
                    {" "}
                    {specialRequestId
                      ? data?.reqEmployeeName
                      : data?.employeeName}
                  </p>
                </div>
              </div>
              <div className="bg-[#F8F8FA] rounded-lg p-2 text-[10px] 2xl:text-xs dark:bg-black">
                <p className="text-slate-500 dark:text-slate-400">Purpose:</p>
                <p className="truncate">{data?.requestDescription}</p>
              </div>
              <FileUpload
                title={"Upload Letter"}
                change={(e) => {
                  setfile(e);
                  // console.log(e, "fileupload");
                }}
                showUploadList={false}
                fileName={file?.name}
              />
              <div className="flex flex-col gap-2">
                {data?.approvedDocument && (
                  <>
                    <p>
                      File is already uploaded By {""}
                      {data?.documentUploader?.employeeName} To See Press View
                      Button
                    </p>
                    <ButtonClick
                      buttonName={"View"}
                      handleSubmit={(e) =>
                        handlePreview(data?.approvedDocument)
                      }
                    />
                  </>
                )}
              </div>
              <div>
                <TextArea
                  title="Comment"
                  placeholder="Mark Comments Here"
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
    </div>
  );
}
