import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonClick from "../../common/Button";
import NewRequest from "./NewRequest";
import DateSliderPicker from "../../common/DatePickerSlide";
import { PiDownloadSimpleLight } from "react-icons/pi";
import ModalAnt from "../../common/ModalAnt";
import popimage from "../../../assets/images/image 1467.png";
import Tabs from "../../common/Tabs";
import Heading from "../../common/Heading";
import API, { action } from "../../Api";
import Avatar from "../../common/Avatar";
import dayjs from "dayjs";
import localStorageData from "../../common/Functions/localStorageKeyValues";

function MyRequest() {
  const { t } = useTranslation();
  const [workfromHome, setWokrfromHome] = useState([]);
  const [letterRequest, setLetterRequest] = useState([]);
  const [openPop, setOpenPop] = useState("");
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [navigationPath, setNavigationPath] = useState("Work_From_Home");
  const [navigationValue, setNavigationValue] = useState(t("Work From Home"));
  const [FilterKey, setFilterKey] = useState("All");
  const [workFromHomeFilterdata, setWorkfromhomeFilterData] = useState([]);
  const [letterRequestFilterdata, setLetterRequestFilterData] = useState([]);
  const viewOutside = navigationPath === "Work_From_Home" ? true : false;

  const [employeeId, setemployeeId] = useState(localStorageData.employeeId);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  const handleDateChange = (date, type) => {
    let dateValue = null;
    if (type === "datePicker") {
      dateValue = date;
    } else {
      dateValue = new Date(date).toISOString().slice(0, 10);
    }
    setSelectedDate(new Date(dateValue));
  };
  const [requestId, setRequestID] = useState(null);

  const tabs = [
    {
      id: 1,
      value: "Work_From_Home",
      title: "Work From Home",
      navValue: "Work From Home",
    },
    {
      id: 2,
      value: "Letter_Request",
      title: "Letter Request",
      navValue: "Letter Requests",
    },
  ];

  const header = [
    {
      Work_From_Home: [
        {
          id: 1,
          title: t("From Date"),
          value: "fromDate",
          bold: true,
        },
        {
          id: 2,
          title: t("To Date"),
          value: "toDate",
          bold: true,
        },
        {
          id: 3,
          title: t("Reason"),
          value: "requestDescription",
          width: 400,
        },

        {
          id: 4,
          title: t("Status"),
          value: "requestStatusName",
          status: true,
          colour: "requestStatusColour",
        },

        {
          id: 6,
          title: "",
          value: 1,

          Regularize: true,
          icons: <PiDownloadSimpleLight />,
          buttonName: "View Detail",
        },
        {
          id: 7,
          title: "",

          width: 50,
          showvertical: true,
          key: "requestStatusName",

          dotsVerticalContent: [
            {
              title: "Update",
              value: "update",
            },
            {
              title: "Delete",
              value: "delete",
              confirm: true,
            },
          ],
        },
      ],
      Letter_Request: [
        {
          id: 1,
          title: t("Applied Date"),
          value: "fromDate",
          bold: true,
        },
        {
          id: 2,
          title: t("Requested For"),
          value: "requestLetterType",
          bold: true,
        },
        {
          id: 3,
          title: t("Purpose"),
          value: "requestDescription",
        },

        {
          id: 4,
          title: t("Status"),
          value: "requestStatusName",
          status: true,
          colour: "requestStatusColour",
        },
        // {
        //   id: 5,
        //   title: "Steps",
        //   value: "track",
        //   icons: <PiDownloadSimpleLight />,
        //   // verticalstepper: true,
        //   miniStepper: true,
        //   // steps: ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5", "Step 6"],
        //   // currentStep:3,
        //   // errorSteps: [3,4],
        // },
        // {
        //   id: 6,
        //   title: "",
        //   key: "requestStatusName",
        //   // Download: true,
        //   icons: <PiDownloadSimpleLight />,
        //   // buttonName: "Download",
        //   // file: "approvedDocument",
        // },
        {
          id: 7,
          title: "",

          width: 50,
          showvertical: true,
          key: "requestStatusName",

          dotsVerticalContent: [
            {
              title: "Update",
              value: "update",
            },
            {
              title: "Delete",
              value: "delete",
              confirm: true,
            },
          ],
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

  const [modalData, setModalData] = useState("");
  const toggleModal = (rowData, actionID, text) => {
    // console.log(typeof text, "text");

    if (typeof text === "object") {
      setIsOpen(rowData);
      // console.log(text, "sasdadasda");
      setModalData(text);
    } else {
      setShow(true);
      setOpenPop("newrequest");
      setRequestID(text);
    }
  };

  const actionData = [
    {
      Work_From_Home: { id: 1, data: workFromHomeFilterdata },
      Letter_Request: { id: 2, data: letterRequestFilterdata },
    },
  ];
  const deleteApi = [
    {
      Work_From_Home: { id: 1, api: API.DELETE_REQUEST_TYPE },
      Letter_Request: { id: 2, api: API.DELETE_REQUEST_TYPE },
    },
  ];

  const getMyRequestWorkfromHome = async () => {
    try {
      const result = await action(API.GET_WORKFROMHOME_REQUEST, {
        employeeId: employeeId,
        requestType: 1,
        companyId: companyId,
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
      });

      // console.log(result);

      if (result.status === 200) {
        let filteredData = result.result.map((items) => ({
          specialRequestId: items.specialRequestId,
          fromDate: items.fromDate,
          toDate: items.toDate,
          requestDescription: items.requestDescription,
          requestStatusName: items.requestStatusName,
          requestStatusColour: items.requestStatusColour,
          track: items.track,
          adminData: items.adminData,
          isByAdmin: items.isByAdmin,
          // verticalstepper:true
        }));

        setCounts({
          All: filteredData.length,
          Pending: filteredData.filter(
            (request) => request.requestStatusName === "Pending"
          ).length,
          Approved: filteredData.filter(
            (request) => request.requestStatusName === "Approved"
          ).length,
          Rejected: filteredData.filter(
            (request) => request.requestStatusName === "Rejected"
          ).length,
        });

        // if (FilterKey === 'Pending') {
        //   // console.log(filteredData, "Key");
        //   filteredData = filteredData.filter(request => request.requestStatusName === 'Pending');
        // } else if (FilterKey === 'Approved') {
        //   // console.log(filteredData, "Key");
        //   filteredData = filteredData.filter(request => request.requestStatusName === 'Approved');
        // } else if (FilterKey === 'Rejected') {
        //   // console.log(filteredData, "Key");
        //   filteredData = filteredData.filter(request => request.requestStatusName === 'Rejected');
        // }

        // console.log(filteredData, "Key");
        setWokrfromHome(filteredData);
        setWorkfromhomeFilterData(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useMemo(() => {
    switch (FilterKey) {
      case "Pending":
        setWorkfromhomeFilterData(
          workfromHome.filter(
            (request) => request.requestStatusName === "Pending"
          )
        );
        break;

      case "Approved":
        setWorkfromhomeFilterData(
          workfromHome.filter(
            (request) => request.requestStatusName === "Approved"
          )
        );
        break;
      case "Rejected":
        setWorkfromhomeFilterData(
          workfromHome.filter(
            (request) => request.requestStatusName === "Rejected"
          )
        );
        break;
      case "All":
        setWorkfromhomeFilterData(workfromHome);

        break;
      default:
        setWorkfromhomeFilterData(workfromHome);
        break;
    }
  }, [FilterKey]);

  const getMyLetterRequest = async () => {
    try {
      const result = await action(API.GET_WORKFROMHOME_REQUEST, {
        employeeId: employeeId,
        requestType: 2,
        companyId: companyId,
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
      });

      // console.log(result);

      if (result.status === 200) {
        let filteredData = result.result.map((items) => ({
          specialRequestId: items.specialRequestId,
          fromDate: items.fromDate,
          toDate: items.toDate,
          requestDescription: items.requestDescription,
          requestStatusName: items.requestStatusName,
          requestStatusColour: items.requestStatusColour,
          requestLetterType: items.requestLetterType,
          requestStatus: items.requestStatus,

          track: items.track,
          approvedDocument: items.approvedDocument,
          adminData: items.adminData,
          isByAdmin: items.isByAdmin,
        }));

        setCounts({
          All: filteredData.length,
          Pending: filteredData.filter(
            (request) => request.requestStatusName === "Pending"
          ).length,
          Approved: filteredData.filter(
            (request) => request.requestStatusName === "Approved"
          ).length,
          Rejected: filteredData.filter(
            (request) => request.requestStatusName === "Rejected"
          ).length,
        });

        // if (FilterKey === 'Pending') {
        //   // console.log(filteredData, "Key");
        //   filteredData = filteredData.filter(request => request.requestStatusName === 'Pending');
        // } else if (FilterKey === 'Approved') {
        //   // console.log(filteredData, "Key");
        //   filteredData = filteredData.filter(request => request.requestStatusName === 'Approved');
        // } else if (FilterKey === 'Rejected') {
        //   // console.log(filteredData, "Key");
        //   filteredData = filteredData.filter(request => request.requestStatusName === 'Rejected');
        // }

        // console.log(filteredData, "Key");
        setLetterRequest(filteredData);
        setLetterRequestFilterData(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useMemo(() => {
    switch (FilterKey) {
      case "Pending":
        setLetterRequestFilterData(
          letterRequest.filter(
            (request) => request.requestStatusName === "Pending"
          )
        );
        break;

      case "Approved":
        setLetterRequestFilterData(
          letterRequest.filter(
            (request) => request.requestStatusName === "Approved"
          )
        );
        break;
      case "Rejected":
        setLetterRequestFilterData(
          letterRequest.filter(
            (request) => request.requestStatusName === "Rejected"
          )
        );
        break;
      case "All":
        // console.log("App", workfromHome);
        setLetterRequestFilterData(letterRequest);

        break;
      default:
        setLetterRequestFilterData(letterRequest);
        break;
    }
  }, [FilterKey]);
  useEffect(() => {
    if (navigationValue === "Work From Home") {
      getMyRequestWorkfromHome();
      // console.log("Key");
    } else {
      getMyLetterRequest();
    }
  }, [navigationValue, selectedDate]);

  return (
    <div className={`  w-full flex flex-col gap-6 `}>
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        <div>
          <Heading
            title={"My Request"}
            description={
              "Assists in requesting work-related documents and enables employees to submit work-from-home requests seamlessly."
            }
          />
        </div>
        <div className="flex items-center flex-col gap-4 md:gap-6 sm:flex-row">
          <DateSliderPicker
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            mode={"day"}
            // datepicker={false}
          />
          <ButtonClick
            BtnType="add"
            buttonName={t("Create New Request")}
            handleSubmit={() => {
              setOpenPop("newrequest");
              setShow(true);
            }}
          />
        </div>
      </div>

      <Tabs
        tabs={tabs}
        header={header}
        actionID="specialRequestId"
        clickDrawer={(rowData, actionID, text) => {
          toggleModal(rowData, actionID, text);
        }}
        tabClick={(e) => {
          // console.log(e, "e");
          setNavigationPath(e);
        }}
        tabChange={(e) => {
          setNavigationValue(e);
          // console.log(e, "navigationValue");
        }}
        data={
          Object.keys(actionData[0]).includes(navigationPath)
            ? actionData[0]?.[navigationPath].data
            : null
        }
        deleteApi={
          Object.keys(deleteApi[0]).includes(navigationPath)
            ? deleteApi[0]?.[navigationPath].api
            : null
        }
        filterTools={true}
        statuses={statuses}
        FilterDataChange={(e) => {
          // console.log(e, "Key");
          setFilterKey(e);
        }}
        activeStatus={FilterKey}
        referesh={() => {
          getMyRequestWorkfromHome();
          getMyLetterRequest();
        }}
        viewOutside={viewOutside}
      />

      {openPop === "newrequest" && show && (
        <NewRequest
          open={show}
          close={(e) => {
            setShow(e);
            setRequestID("");
          }}
          refresh={() => {
            getMyRequestWorkfromHome();
            getMyLetterRequest();
          }}
          navigationValue={navigationValue}
          requestId={requestId}
        />
      )}

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
        <div className="flex flex-col gap-2.5 w-[485px] p-2  ">
          <>
            {/* {console.log(modalData, "modal")} */}
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
                <p>{modalData.fromDate}</p>
                <p>{modalData.toDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] 2xl:text-xs p-2">
              <p className="text-slate-500 dark:text-slate-400">
                Request Status
              </p>
              <div
                className={`rounded-full px-2 py-0.5 w-fit text-[10px] 2xl:text-sm vhcenter flex-nowrap`}
                style={{
                  color: modalData.requestStatusColour || undefined,
                  backgroundColor: modalData.requestStatusColour
                    ? `${modalData.requestStatusColour}20`
                    : undefined,
                }}
              >
                <div className="font-semibold">
                  {modalData.requestStatusName}
                </div>
              </div>
            </div>

            <div className="bg-[#F8F8FA] dark:bg-[#1B1B1B] rounded-lg p-2 text-slate-500 dark:text-slate-400 text-[10px] 2xl:text-xs">
              <div className=" font-semibold border-b">Reason</div>
              <div className="leading-3">{modalData.requestDescription}</div>
            </div>

            {modalData?.actionRemarks && (
              <div className="text-[10px] 2xl:text-xs">
                <div className="font-medium">Comment</div>
                <div className="border bg-[#F4F4F4] dark:bg-[#1B1B1B] rounded-lg p-2.5 mt-2">
                  <div>{modalData?.actionRemarks}</div>
                </div>
              </div>
            )}
            {modalData?.adminData && (
              <div className="pt-2 flex flex-col gap-2">
                <h3 className="font-medium text-xs 2xl:text-sm">
                  Action Taken By Admin
                </h3>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Avatar
                      image={modalData?.adminData.profilePicture}
                      name={modalData?.adminData.fullName}
                      className="border-2 border-white shadow-md"
                    />
                    <div className="flex flex-col gap-0.5">
                      <p className="font-medium text-xs 2xl:text-sm">
                        {modalData?.adminData.fullName}
                      </p>
                      <p className="text-grey text-[10px] 2xl:text-xs">
                        {modalData?.adminData.designation}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p
                      className={`flex items-center justify-center gap-1 w-[90px] h-[20px] 2xl:w-[98px] 2xl:h-[24px] rounded-full ${
                        modalData.requestStatusName === "Pending"
                          ? "text-orange-600"
                          : modalData.requestStatusName === "Rejected"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {modalData?.requestStatusName}
                    </p>
                    <p className="text-grey text-[10px] 2xl:text-xs">
                      {modalData?.adminData.modifiedOn}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {modalData && (
              <div className="max-h-[320px] overflow-auto">
                {Object.keys(modalData?.track).map((stepKey) => {
                  const employees = modalData?.track[stepKey];
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
                              {employee?.status === "Pending" &&
                              parseInt(modalData?.isByAdmin) >= 1 ? (
                                <p>No Action Required</p>
                              ) : (
                                //   : employee?.status === "Pending" &&
                                //   (modalData?.isByAdmin === "0" ||
                                //     modalData?.isByAdmin === 0 ||
                                //     modalData?.isByAdmin === null ||
                                //     modalData?.isByAdmin === "") &&
                                //     modalData?.mainStatus!=="Pending" ? (
                                //   <p>No Action Required</p>
                                // ) : (
                                <p
                                  className={`flex items-center justify-end gap-1 text-sm 2xl:text-md rounded-full ${
                                    employee?.status === "Pending"
                                      ? "text-orange-600"
                                      : employee?.status === "Rejected"
                                      ? "text-red-600"
                                      : employee?.status === "Approved"
                                      ? "text-green-600"
                                      : "text-black dark:text-white"
                                  }`}
                                >
                                  {employee?.status}
                                </p>
                              )}
                              <p className="text-grey text-xs">
                                {employee.modifiedOn}
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
          </>
        </div>
      </ModalAnt>
    </div>
  );
}

export default MyRequest;
