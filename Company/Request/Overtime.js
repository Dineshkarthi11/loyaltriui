import React, { useEffect, useState } from "react";
import API, { action } from "../../Api";
import { RxDotFilled } from "react-icons/rx";
import { PiClock, PiSignIn, PiSignOut } from "react-icons/pi";
import CheckBoxInput from "../../common/CheckBoxInput";
import ModalAnt from "../../common/ModalAnt";
import ButtonClick from "../../common/Button";
import TextArea from "../../common/TextArea";
import { Skeleton } from "antd";
import OvertimeSettingsDrawer from "./OvertimeSettingsDrawer";
import SearchBox from "../../common/SearchBox";
import popimage from "../../../assets/images/image 1467.png";
import { useNotification } from "../../../Context/Notifications/Notification";
import Choose from "../../common/Choose";
import { NoData } from "../../common/SVGFiles";
import * as yup from "yup";
import { useFormik } from "formik";
import localStorageData from "../../common/Functions/localStorageKeyValues";

const OverTime = ({ date = null, data = [], referesh = () => {} }) => {
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [isOpenPardon, setIsOpenPardon] = useState({ type: "", status: false });
  const [pardonDisplay, setPardonDisplay] = useState(false);
  const [selectedCount, setSelectedCount] = useState(null);
  const [requestStatus, setRequestStatus] = useState("");

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const [open, setOpen] = useState(false);
  const [drawerData, setDrawerData] = useState(null);
  const [overTimeDetails, setOverTimeDetails] = useState(null);
  const [overTimeSearchdata, setOverTimeSearchData] = useState([]);
  const [searchValue, setSearchValue] = useState([]);

  const showDrawer = (data) => {
    setOpen(true);
    setDrawerData(data);
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setOverTimeSearchData((prevData) =>
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
        employeeName: each.employees[0].employeeName,
      }))
    );

    setOverTimeDetails((prevData) =>
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

  const checkConditions = (data) => {
    // console.log(data, "data");
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
      checkConditions(overTimeDetails?.length > 0 ? overTimeDetails : [])
    );
    setSelectedCount(
      countSelectedEmployees(overTimeDetails?.length > 0 ? overTimeDetails : [])
    );
  }, [overTimeDetails]);

  const getEmployeeOverTime = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_OVERTIME, {
        superiorEmployeeId: employeeId,
        neededYearAndMonth: date,
        companyId: companyId,
      });
      if (result.status === 200) {
        setOverTimeSearchData(
          result.result.map((each, index) => ({
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
            employeeName: each.employees[0].employeeName,
          }))
        );
        setOverTimeDetails(
          result.result.map((each, index) => ({
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
      } else {
        setOverTimeDetails([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const formik = useFormik({
    initialValues: {
      remark: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      remark: yup.string().required("Comment is Required"),
    }),
    onSubmit: async (e) => {
      try {
        const result = await action(API.OVER_TIME_APPROVE_REJECT, {
          selectedType: requestStatus,
          responseBy: employeeId,
          remarks: e.remark,
          employeeOvertimeDataIds: overTimeDetails
            ?.flatMap((each) =>
              each.employees.flatMap((item) =>
                item.status
                  .filter((itemStatus) => itemStatus.statusSelected)
                  .map((itemStatus) => itemStatus.employeeOvertimeDataId)
              )
            )
            .filter(Boolean),
        });
        if (result.status === 200) {
          referesh();
          openNotification("success", "Successful", result.message);
          setIsOpenPardon({ status: false });
        } else {
          openNotification("error", "Info ", result.message);
        }
      } catch (error) {
        openNotification("error", "Failed ", error.message);
      }
    },
  });

  useEffect(() => {
    if (data.status === 200) {
      setOverTimeSearchData(
        data.result.map((each, index) => ({
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
          employeeName: each.employees[0].employeeName,
        }))
      );
      setOverTimeDetails(
        data.result.map((each, index) => ({
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
            titleRight={`Select All Employees `}
            titleClassName="text-primary font-semibold"
            // indeterminate={indeterminate}
          />
          <div>
            <SearchBox
              placeholder="Search"
              value={searchValue}
              change={(e) => {
                setSearchValue(e);
              }}
              data={overTimeSearchdata}
              onSearch={(value) => {
                setOverTimeDetails(value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full">
          {overTimeDetails?.length > 0 ? (
            overTimeDetails?.map((each, index) => (
              <>
                <div key={index} className="flex flex-col gap-3">
                  <div className="text-xs 2xl:text-sm font-semibold dark:text-white">
                    {each.date}
                  </div>
                  <div className="flex flex-col gap-3.5 p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-dark">
                    <div className="flex items-center">
                      <CheckBoxInput
                        value={each.selecteEmloyees}
                        change={(e) => {
                          setOverTimeSearchData((prevData) =>
                            prevData?.map((data) => ({
                              id: data.id,
                              date: data.date,
                              selecteEmloyees:
                                data.id === each.id ? e : data.selecteEmloyees,
                              employees: data.employees.map((item) => ({
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
                              employeeName: each.employees[0].employeeName,
                            }))
                          );
                          setOverTimeDetails((prevData) =>
                            prevData?.map((data) => ({
                              id: data.id,
                              date: data.date,
                              selecteEmloyees:
                                data.id === each.id ? e : data.selecteEmloyees,
                              employees: data.employees.map((item) => ({
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
                    {each.employees?.map((item) => (
                      <div
                        className={`px-3.5 py-2.5 borderb !border-opacity-10 rounded-lg w-full grid grid-cols-12 gap-4 items-center relative transition-all duration-300 ${
                          selectedEmployees.includes(item.employeeId)
                            ? "bg-primaryalpha/10 dark:bg-primaryalpha/25 !border-primaryalpha/20"
                            : "bg-white dark:bg-[#131827]"
                        }`}
                      >
                        <div className="flex flex-col gap-4 col-span-12 md:col-span-3">
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
                            {item.shiftName
                              ? item.shiftName
                              : "Shift not Assigned"}
                          </p>
                        </div>

                        <div className=" flex-col flex col-span-12 gap-3.5 md:col-span-9">
                          <div className="flex flex-col lg:flex-row justify-between gap-[18px] col-span-10 sm:col-span-5 lg:col-span-3">
                            <div className="flex items-center gap-2 xs:gap-[20px] flex-wrap">
                              <div className="flex items-center gap-1">
                                <PiSignIn size={16} className="text-grey" />
                                <p className="text-[10px] leading-[18px] 2xl:text-xs font-medium text-grey">
                                  Check In
                                </p>
                                <p className="text-xs lg:text-[10px] 2xl:text-xs leading-[20px] font-semibold dark:text-white space-x-1 vhcenter gap-1">
                                  {item.firstCheckInTime
                                    ? item.firstCheckInTime
                                    : "00h 00m"}
                                </p>
                              </div>
                              <div className="v-divider !h-2/3 hidden sm:block"></div>
                              <div className="flex items-center gap-1">
                                <PiSignOut size={16} className="text-grey" />
                                <p className="text-[10px] leading-[18px] 2xl:text-xs font-medium text-grey">
                                  Check Out
                                </p>
                                <p className="text-xs lg:text-[10px] 2xl:text-xs leading-[20px] font-semibold dark:text-white space-x-1 vhcenter gap-1">
                                  {item.lastCheckOutTime
                                    ? item.lastCheckOutTime
                                    : "00h 00m"}
                                </p>
                              </div>
                              <div className="v-divider !h-2/3 hidden sm:block"></div>
                              <div className="flex items-center gap-1">
                                <PiClock size={16} className="text-grey" />
                                <p className="text-[10px] leading-[18px] 2xl:text-xs font-medium text-grey">
                                  Total Hours
                                </p>
                                <p className="text-xs lg:text-[10px] 2xl:text-xs  leading-[20px] font-semibold dark:text-white space-x-1 vhcenter gap-1">
                                  {item.totalWorkHours
                                    ? item.totalWorkHours
                                    : "00h 00m"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="divider-h" />
                          <div className="flex flex-wrap gap-4">
                            {item.status?.map((status) => (
                              <button
                                className={`borderb h-8 2xl:h-10 transition-all duration-300 min-w-[170px] xl:w-auto p-[3px] text-[10px] 2xl:text-sm rounded-md text-start leading-6 flex items-center font-semibold text-[#349C5E] bg-white dark:bg-dark gap-4 pr-6`}
                                onClick={() => showDrawer(status)}
                              >
                                <div className="rounded px-2 py-1 bg-[#ECFDF3] h-full vhcenter">
                                  <p
                                    className={`text-sm lg:text-xs 2xl:text-sm`}
                                  >
                                    {status.overTimeDetails === "OverTime"
                                      ? "Overtime"
                                      : status.overTimeDetails}
                                  </p>
                                </div>
                                <p>{status.timeExtra}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="absolute right-3 top-3">
                          <CheckBoxInput
                            titleRight="Select"
                            value={item.selected}
                            change={(select) => {
                              setOverTimeSearchData((prevData) =>
                                prevData?.map((each) => ({
                                  id: each.id,
                                  date: each.date,
                                  selecteEmloyees: each.selecteEmloyees,
                                  employees: each.employees.map((value) => ({
                                    ...value,
                                    selected:
                                      item.id === value.id
                                        ? select
                                        : value.selected,
                                    status: value.status.map((itemStatus) => ({
                                      ...itemStatus,
                                      statusSelected:
                                        item.id === value.id
                                          ? select
                                          : itemStatus.statusSelected,
                                    })),
                                  })),
                                  employeeName: each.employees[0].employeeName,
                                }))
                              );
                              setOverTimeDetails((prevData) =>
                                prevData?.map((each) => ({
                                  id: each.id,
                                  date: each.date,
                                  selecteEmloyees: each.selecteEmloyees,
                                  employees: each.employees.map((value) => ({
                                    ...value,
                                    selected:
                                      item.id === value.id
                                        ? select
                                        : value.selected,
                                    status: value.status.map((itemStatus) => ({
                                      ...itemStatus,
                                      statusSelected:
                                        item.id === value.id
                                          ? select
                                          : itemStatus.statusSelected,
                                    })),
                                  })),
                                }))
                              );
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {index < overTimeDetails.length - 1 && (
                  <div className="divider-h" />
                )}
              </>
            ))
          ) : overTimeDetails?.length <= 0 ? (
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

      {open && (
        <OvertimeSettingsDrawer
          data={drawerData}
          open={open}
          close={() => {
            setOpen(false);
            referesh();
          }}
        />
      )}

      {/* </DrawerPop> */}

      <ModalAnt
        isVisible={isOpenPardon.status}
        onClose={() => {
          formik.resetForm();
          setIsOpenPardon({ type: "", status: false });
        }}
        // width="435px"
        showCancelButton={true}
        cancelButtonClass="w-full"
        showTitle={false}
        centered={true}
        padding="8px"
        showOkButton={true}
        okText={
          isOpenPardon.type === "Approve"
            ? "Confirm Approval"
            : "Confirm Reject"
        }
        okButtonDanger={isOpenPardon.type === "Approve" ? false : true}
        okButtonClass="w-full"
        onOk={() => {
          if (isOpenPardon.type === "Approve") {
            setRequestStatus("Approved");
          } else {
            setRequestStatus("Rejected");
          }
          formik.handleSubmit();
        }}
        error={formik.values.remark === "" ? true : false}
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[506px] p-2">
          <div className="flex flex-col gap-2 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-[44px] rounded-full flex items-center justify-center bg-[#CBCAFC66]">
              <img
                src={popimage}
                alt="#PunchImage"
                className="rounded-full w-[28px]"
              />
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
              value={formik.values.remark}
              change={(e) => {
                formik.setFieldValue("remark", e);
              }}
              error={formik.errors.remark}
              required
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

export default OverTime;
