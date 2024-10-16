import React, { useEffect, useMemo, useState } from "react";
import API, { action } from "../../Api";
import { RxDotFilled } from "react-icons/rx";
import { PiAlarm, PiGpsFix } from "react-icons/pi";
import CheckBoxInput from "../../common/CheckBoxInput";
import Noimage from "../../../assets/images/noImg.webp";
import ModalAnt from "../../common/ModalAnt";
import ButtonClick from "../../common/Button";
import SearchBox from "../../common/SearchBox";
import popimage from "../../../assets/images/image 1467.png";
import TextArea from "../../common/TextArea";
import { useNotification } from "../../../Context/Notifications/Notification";
import Choose from "../../common/Choose";
import { NoData } from "../../common/SVGFiles";
import { Skeleton } from "antd";
import localStorageData from "../../common/Functions/localStorageKeyValues";

const PunchApproval = ({ date = null, data = [], referesh = () => {} }) => {
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);

  const [employeeAttendenceList, setEmployeeAttendenceList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [punchApprovalDetails, setpunchApprovalDetails] = useState(null);

  const [punchApprovalSearchData, setpunchApprovalSearchData] = useState([]);
  const [searchValue, setSarchValue] = useState();

  const [pardonDisplay, setPardonDisplay] = useState(false);
  const [selectedCount, setSelectedCount] = useState(null);
  const [isOpenPardon, setIsOpenPardon] = useState({ type: "", status: false });
  const [remarks, setRemarks] = useState(null);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  const indeterminate =
    selectedEmployees.length > 0 &&
    selectedEmployees.length < employeeAttendenceList.length;

  const checkConditions = (data) => {
    for (const record of data) {
      if (record.selecteEmloyees) {
        return true;
      }
      for (const employee of record.employees) {
        if (employee.selected) {
          return true;
        }
        for (const status of employee.status) {
          if (status.statusSelected) {
            return true;
          }
        }
      }
    }
    return false;
  };
  const countSelectedEmployees = (data) => {
    let count = 0;
    data.forEach((record) => {
      record.employees.forEach((employee) => {
        if (employee.selected) {
          count++;
        }
      });
    });
    return count;
  };

  useEffect(() => {
    setPardonDisplay(
      checkConditions(
        punchApprovalDetails?.length > 0 ? punchApprovalDetails : []
      )
    );
    setSelectedCount(
      countSelectedEmployees(
        punchApprovalDetails?.length > 0 ? punchApprovalDetails : []
      )
    );
  }, [punchApprovalDetails]);

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setpunchApprovalSearchData((prevData) =>
      prevData?.map((each) => ({
        id: each.id,
        date: each.date,
        selecteEmloyees: !selectAll,
        employees: each.employees.map((item) => ({
          ...item,
          selected: !selectAll,
          status: item.status.map((itemStatus) => ({
            ...itemStatus,
            statusSelected: !selectAll,
          })),
        })),
      }))
    );
    setpunchApprovalDetails((prevData) =>
      prevData?.map((each) => ({
        id: each.id,
        date: each.date,
        selecteEmloyees: !selectAll,
        employees: each.employees.map((item) => ({
          ...item,
          selected: !selectAll,
          status: item.status.map((itemStatus) => ({
            ...itemStatus,
            statusSelected: !selectAll,
          })),
        })),
      }))
    );
  };

  const [isOpen, setIsOpen] = useState([false, false]);
  const [modalData, setModalData] = useState(null);

  const toggleModal = (idx, target, data) => {
    setIsOpen((p) => {
      p[idx] = target;
      return [...p];
    });
    setModalData(data);
  };

  const addPardonfine = async () => {
    try {
      const result = await action(API.PUNCH_APPROVAL_REJECT, {
        selectedType: "approved",
        responseBy: employeeId,
        remarks: remarks,
        employeeDailyAttendanceIds: punchApprovalDetails?.flatMap((each) =>
          each.employees
            .filter((item) => item.selected)
            .map((itemStatus) => itemStatus.employeeDailyAttendanceId)
        ),
      });
      if (result.status === 200) {
        referesh();
        openNotification("success", "Successful", result.message);
        setIsOpenPardon({ status: false });
      } else {
        openNotification("error", "Failed ", result.message);
      }
    } catch (error) {
      console.log(error);
      openNotification("error", "Failed ", error.message);
    }
  };

  const applyFine = async () => {
    try {
      const result = await action(API.PUNCH_APPROVAL_REJECT, {
        selectedType: "reject",
        responseBy: employeeId,
        remarks: remarks,
        employeeDailyAttendanceIds: punchApprovalDetails?.flatMap((each) =>
          each.employees
            .filter((item) => item.selected)
            .map((itemStatus) => itemStatus.employeeDailyAttendanceId)
        ),
      });
      if (result.status === 200) {
        referesh();
        openNotification("success", "Successful", result.message);
        setIsOpenPardon({ status: false });
      } else {
        openNotification("error", "Failed ", result.message);
      }
    } catch (error) {
      console.log(error);
      openNotification("error", "Failed ", error.message);
    }
  };

  useMemo(() => {
    if (data.status === 200) {
      setpunchApprovalSearchData(
        data.result?.map((each, index) => ({
          id: index + 1,
          date: each.date,
          selecteEmloyees: false,
          employees: each.employees.map((item, i) => ({
            id: `${i + 1}employees${+index}`,
            ...item,
            selected: false,
            status: item.status.map((itemStatus, j) => ({
              id: `${i + 1}sta${j}tus${+index}`,
              ...itemStatus,
              statusSelected: false,
            })),
          })),
        }))
      );
      setpunchApprovalDetails(
        data.result?.map((each, index) => ({
          id: index + 1,
          date: each.date,
          selecteEmloyees: false,
          employees: each.employees.map((item, i) => ({
            id: `${i + 1}employees${+index}`,
            ...item,
            selected: false,
            status: item.status.map((itemStatus, j) => ({
              id: `${i + 1}sta${j}tus${+index}`,
              ...itemStatus,
              statusSelected: false,
            })),
          })),
        }))
      );
    }
  }, [data]);
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex sm:items-center flex-col-reverse sm:flex-row gap-4 justify-between">
          <CheckBoxInput
            value={selectAll}
            change={handleSelectAllChange}
            titleRight="Select All Employees"
            titleClassName="text-primary font-semibold"
            indeterminate={indeterminate}
          />
          <div>
            <SearchBox
              placeholder="Search"
              value={searchValue}
              change={(e) => {
                setSarchValue(e);
              }}
              data={punchApprovalSearchData}
              onSearch={(value) => {
                setpunchApprovalDetails(value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full">
          {punchApprovalDetails?.length > 0 ? (
            punchApprovalDetails?.map((data, index) => (
              <>
                <div key={index} className="flex flex-col gap-3">
                  <div className="text-xs 2xl:text-sm font-semibold dark:text-white">
                    {data.date}
                  </div>
                  <div className="flex flex-col gap-3.5 p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-dark">
                    <div className="flex items-center">
                      <CheckBoxInput
                        value={data.selecteEmloyees}
                        change={(e) => {
                          setpunchApprovalSearchData((prevData) =>
                            prevData?.map((each) => ({
                              id: each.id,
                              date: each.date,
                              selecteEmloyees:
                                data.id === each.id ? e : each.selecteEmloyees,
                              employees: each.employees.map((item) => ({
                                ...item,
                                selected:
                                  data.id === each.id ? e : item.selected,
                                status: item.status.map((itemStatus) => ({
                                  ...itemStatus,
                                  statusSelected:
                                    data.id === each.id
                                      ? e
                                      : itemStatus.statusSelected,
                                })),
                              })),
                            }))
                          );
                          setpunchApprovalDetails((prevData) =>
                            prevData?.map((each) => ({
                              id: each.id,
                              date: each.date,
                              selecteEmloyees:
                                data.id === each.id ? e : each.selecteEmloyees,
                              employees: each.employees.map((item) => ({
                                ...item,
                                selected:
                                  data.id === each.id ? e : item.selected,
                                status: item.status.map((itemStatus) => ({
                                  ...itemStatus,
                                  statusSelected:
                                    data.id === each.id
                                      ? e
                                      : itemStatus.statusSelected,
                                })),
                              })),
                            }))
                          );
                        }}
                        titleRight="Select All"
                      />
                    </div>
                    {data?.employees?.map((item) => (
                      <div
                        className={`px-3.5 py-2.5 borderb rounded-lg w-full grid grid-cols-12 gap-4 items-center relative transition-all duration-300 `}
                        key={index}
                      >
                        <div className="flex flex-col gap-4 col-span-12 sm:col-span-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`size-8 overflow-hidden rounded-full 2xl:size-10 shrink-0 bg-primaryalpha/10 vhcenter`}
                            >
                              {item.profilePicture ? (
                                <img
                                  // src={record.logo}
                                  src={item.profilePicture}
                                  className="object-cover object-center w-full h-full"
                                  alt="Profile"
                                />
                              ) : (
                                <p className="font-semibold text-primary text-xs 2xl:text-sm">
                                  {item.employeeName?.charAt(0).toUpperCase()}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <p className="pblack font-semibold">
                                {item.employeeName?.charAt(0).toUpperCase() +
                                  item.employeeName?.slice(1)}
                              </p>
                              <p className="pblack !text-grey">
                                EMP Code: {item.code}
                              </p>
                            </div>
                          </div>
                          <p className="px-1.5 py-0.5 h-fit flex gap-1 items-center font-medium w-fit bg-gray-100 text-gray-700 rounded-full text-[9px] 2xl:text-[11px]">
                            <RxDotFilled size={14} />
                            {item.shiftName ? item.shiftName : "No Shift"}
                          </p>
                        </div>

                        <div className=" flex-col flex col-span-12 gap-1.5 sm:col-span-4">
                          <p className="text-[10px] 2xl:text-xs font-medium text-[#349C5E]">
                            Punch In
                          </p>
                          <div className="flex items-center gap-3.5">
                            <div
                              className="overflow-hidden size-[74px] rounded-lg border-2 border-[#EBEBEB] cursor-pointer"
                              onClick={() => toggleModal(0, true, item)}
                            >
                              <img
                                src={
                                  item?.punchInImage
                                    ? item?.punchInImage
                                    : item.profilePicture || Noimage
                                }
                                alt="#PunchImage"
                                className="object-cover object-center w-full h-full"
                              />
                            </div>
                            <div className="flex flex-col gap-2.5">
                              <div className=" flex gap-1.5 items-center">
                                <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                                  <PiAlarm size={16} />
                                </div>
                                <p className="text-xs 2xl:text-sm dark:text-white font-medium">
                                  {item?.firstCheckInTime}
                                </p>
                              </div>
                              <div className=" flex gap-1.5 items-center">
                                <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                                  <PiGpsFix size={16} />
                                </div>
                                <p className="text-xs 2xl:text-sm dark:text-white font-medium">
                                  {/* Location Here  */}
                                  {item?.punchRemarks || "No Location"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className=" flex-col flex col-span-12 gap-1.5 sm:col-span-4">
                          <p className="text-[10px] 2xl:text-xs font-medium text-[#E10707]">
                            Punch Out
                          </p>
                          <div className="flex items-center gap-3.5">
                            <div
                              className="overflow-hidden size-[74px] rounded-lg border-2 border-[#EBEBEB] cursor-pointer"
                              onClick={() => toggleModal(1, true, item)}
                            >
                              <img
                                src={
                                  item?.punchInImage
                                    ? item?.punchInImage
                                    : item.profilePicture || Noimage
                                }
                                alt="#PunchImage"
                                className="object-cover object-center w-full h-full"
                              />
                            </div>
                            <div className="flex flex-col gap-2.5">
                              <div className=" flex gap-1.5 items-center">
                                <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                                  <PiAlarm size={16} />
                                </div>
                                <p className="text-xs 2xl:text-sm dark:text-white font-medium">
                                  {item?.lastCheckOutTime}
                                </p>
                              </div>
                              <div className=" flex gap-1.5 items-center">
                                <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                                  <PiGpsFix size={16} />
                                </div>
                                <p className="text-xs 2xl:text-sm dark:text-white font-medium">
                                  {/* Location Here  */}
                                  {item?.punchRemarks || "No Location"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute right-3 top-3">
                          <CheckBoxInput
                            titleRight="Select"
                            value={item.selected}
                            change={(select) => {
                              setpunchApprovalSearchData((prevData) =>
                                prevData?.map((each) => ({
                                  id: each.id,
                                  date: each.date,
                                  selecteEmloyees: each.selecteEmloyees,
                                  employees: each.employees.map(
                                    (itemvalue) => ({
                                      ...item,
                                      selected:
                                        itemvalue.id === item.id
                                          ? select
                                          : item.selected,
                                      status: item.status.map((itemStatus) => ({
                                        ...itemStatus,
                                        statusSelected:
                                          itemvalue.id === item.id
                                            ? select
                                            : itemStatus.statusSelected,
                                      })),
                                    })
                                  ),
                                }))
                              );
                              setpunchApprovalDetails((prevData) =>
                                prevData?.map((each) => ({
                                  id: each.id,
                                  date: each.date,
                                  selecteEmloyees: each.selecteEmloyees,
                                  employees: each.employees.map(
                                    (itemvalue) => ({
                                      ...item,
                                      selected:
                                        itemvalue.id === item.id
                                          ? select
                                          : item.selected,
                                      status: item.status.map((itemStatus) => ({
                                        ...itemStatus,
                                        statusSelected:
                                          itemvalue.id === item.id
                                            ? select
                                            : itemStatus.statusSelected,
                                      })),
                                    })
                                  ),
                                }))
                              );
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {index < punchApprovalDetails.length - 1 && (
                  <div className="divider-h" />
                )}
              </>
            ))
          ) : punchApprovalDetails?.length <= 0 ? (
            <NoData />
          ) : (
            <Skeleton />
          )}
        </div>

        {pardonDisplay && (
          <Choose selectedCount={selectedCount}>
            <p className="flex items-center gap-2">
              <ButtonClick
                buttonName={"Reject Selected"}
                BtnType="primary"
                danger
                handleSubmit={() => {
                  setIsOpenPardon({ type: "Reject", status: true });
                }}
              />
              <ButtonClick
                buttonName={"Approve Selected"}
                BtnType="primary"
                handleSubmit={() => {
                  setIsOpenPardon({ type: "Approve", status: true });
                }}
              />
            </p>
          </Choose>
        )}
      </div>

      {/* Punch IN Modal  */}
      <ModalAnt
        isVisible={isOpen[0]}
        onClose={() => toggleModal(0, false)}
        // width="435px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="0px"
      >
        <div className="flex flex-col gap-2.5">
          <div className="overflow-hidden size-[300px] rounded-[14px]">
            <img
              src={
                modalData?.punchInImage
                  ? modalData?.punchInImage
                  : modalData?.profilePicture || Noimage
              }
              alt="#PunchImage"
              className="object-cover object-center w-full h-full"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="bg-white dark:bg-white/10 p-1.5 rounded-lg flex gap-1.5 items-center">
              <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                <PiAlarm size={16} />
              </div>
              <p className="text-xs  font-medium">
                Punch In: {modalData?.firstCheckInTime}
              </p>
            </div>
            <div className="bg-white dark:bg-white/10 p-1.5 rounded-lg flex gap-1.5 items-center">
              <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                <PiGpsFix size={16} />
              </div>
              <p className="text-xs  font-medium">
                {/* Location Here  */}
                {modalData?.punchRemarks}
              </p>
            </div>
          </div>
        </div>
      </ModalAnt>

      {/* Punch Out Modal  */}
      <ModalAnt
        isVisible={isOpen[1]}
        onClose={() => toggleModal(1, false)}
        // width="435px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="0px"
      >
        <div className="flex flex-col gap-2.5">
          <div className="overflow-hidden size-[300px] rounded-[14px]">
            <img
              src={
                modalData?.punchInImage
                  ? modalData?.punchInImage
                  : modalData?.profilePicture || Noimage
              }
              alt="#PunchImage"
              className="object-cover object-center w-full h-full"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="bg-white dark:bg-white/10 p-1.5 rounded-lg flex gap-1.5 items-center">
              <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                <PiAlarm size={16} />
              </div>
              <p className="text-xs font-medium">
                Punch In: {modalData?.firstCheckInTime}
              </p>
            </div>
            <div className="bg-white dark:bg-white/10 p-1.5 rounded-lg flex gap-1.5 items-center">
              <div className="rounded-full size-8 bg-primaryalpha/10 dark:bg-primaryalpha/30 vhcenter text-primaryalpha dark:text-white">
                <PiGpsFix size={16} />
              </div>
              <p className="text-xs font-medium">
                {/* Location Here  */}
                {modalData?.punchRemarks}
              </p>
            </div>
          </div>
        </div>
      </ModalAnt>
      <ModalAnt
        isVisible={isOpenPardon.status}
        onClose={() => {
          setRemarks(null);
          setIsOpenPardon({ status: false });
        }}
        okText={isOpenPardon.type}
        // cancelText={"Reject"}
        okButtonClass={"  2xl:w-[228px]"}
        cancelButtonClass={"m-auto w-full 2xl:w-[228px]"}
        cancelButtonDanger={true}
        cancelButtonType="primary"
        danger
        showTitle={false}
        centered={true}
        padding="8px"
        showCancelButton={false}
        okButtonDanger={isOpenPardon.type !== "Approve" && true}
        onOk={() => {
          if (isOpenPardon.type === "Approve") {
            addPardonfine();
          } else {
            applyFine();
          }
        }}
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[506px] p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-14 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
              <img src={popimage} alt="" className="rounded-full w-[28px]" />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              {isOpenPardon.type}
            </p>
          </div>
          <div className="m-auto">
            <p className="text-center text-xs 2xl:text-sm text-gray-500">
              {isOpenPardon.type === "Approve"
                ? "Are you sure you want to approve the selected leave requests? You can add any remarks below before confirming the approval."
                : "Are you sure you want to reject the selected leave requests? You can add any remarks below before confirming the approval."}
            </p>
          </div>
          <div className="max-h-[320px] overflow-auto mt-2 flex flex-col gap-2">
            <TextArea
              title="Comment"
              placeholder="Comment"
              value={remarks}
              change={(e) => {
                setRemarks(e);
              }}
            />
            <div
              className={`font-medium text-xs 2xl:text-sm ${
                isOpenPardon.type === "Approve"
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
    </>
  );
};

export default PunchApproval;
