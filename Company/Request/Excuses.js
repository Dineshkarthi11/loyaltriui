import React, { useEffect, useMemo, useState } from "react";
import ExcusesCard from "./ExcusesCard";
import ButtonClick from "../../common/Button";
import CheckBoxInput from "../../common/CheckBoxInput";
import LateEntrySettings from "./LateEntrySettings";
import {
  PiClockCountdown,
  PiClockCountdownLight,
  PiCoinsLight,
  PiDownloadSimpleLight,
  PiFingerprint,
  PiHourglassHigh,
  PiSignOut,
} from "react-icons/pi";
import popimage from "../../../assets/images/image 1467.png";
import TableAnt from "../../common/TableAnt";
import ModalAnt from "../../common/ModalAnt";
import { t } from "i18next";
import SearchBox from "../../common/SearchBox";
import API, { action } from "../../Api";
import TextArea from "../../common/TextArea";
import { MdOutlineSelectAll } from "react-icons/md";
import Choose from "../../common/Choose";
import { useNotification } from "../../../Context/Notifications/Notification";
import { NoData } from "../../common/SVGFiles";
import { Skeleton } from "antd";
import * as yup from "yup";
import { useFormik } from "formik";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function Excuses({
  date = null,
  viewNotification,
  data = [],
  referesh = () => {},
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [show, setShow] = useState(false);
  const [showModelDate, setShowModelDate] = useState([]);
  const [seletedTab, setSelectedTab] = useState("ExcusesCard");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPardon, setIsOpenPardon] = useState({ type: "", status: false });

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);

  const [excusesEmployeeSearch, setExcusesEmployeeSearch] = useState([]);
  const [searchValue, setSearchvalue] = useState(null);

  const [excusesEmployeeList, setExcusesEmployeeList] = useState(null);
  const [excusesFilterList, setExcusesFilterList] = useState([]);
  const [pardonDisplay, setPardonDisplay] = useState(false);
  const [selectedCount, setSelectedCount] = useState(null);
  const [approveRejectList, setApproveRejectList] = useState([]);

  const [modalData, setModalData] = useState({});
  const [excuesesCount, setExcueseCount] = useState({});
  const [filterClickItem, setFilterClickItem] = useState({});
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

  const toggleModal = (data) => {
    setIsOpen(!isOpen);
    if (data.employeeRegularizationId)
      getApproveRejectDetailsById(data.employeeRegularizationId);
  };

  // const changeTab = (value) => {
  //   setSelectedTab(value.title);
  //   getApproveRejectList(value.value);
  // };

  const getExcueseCount = async () => {
    try {
      const result = await action(API.GET_EXCUSES_COUNT, {
        neededYearAndMonth: date,
        superiorEmployeeId: employeeId,
        companyId: companyId,
      });
      if (result.status === 200) {
        setExcueseCount(result.result);
        if (result.result?.haveOldRequests) {
          viewNotification(result.result?.haveOldRequests);
        }
      } else {
      }
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    if (date) getExcueseCount();
  }, [date]);

  useMemo(() => {
    if (filterClickItem !== "All") {
      setExcusesEmployeeList(
        excusesFilterList
          ?.map((each) =>
            each.employees.map((item) =>
              item.status.filter((itemStatus) =>
                filterClickItem === itemStatus.deductionDetails ? true : false
              )
            )[0]
              ? {
                  ...each,
                  employees: each.employees.map((item) => ({
                    ...item,
                    status: item.status.filter((itemStatus) =>
                      filterClickItem === itemStatus.deductionDetails
                        ? {
                            ...itemStatus,
                          }
                        : null
                    ),
                  })),
                }
              : null
          )
          ?.map(
            (each) =>
              each?.employees?.some((item) => item.status?.length > 0) && each
          )
          .filter(Boolean)
      );
    } else {
      setExcusesEmployeeList(excusesFilterList);
    }
  }, [filterClickItem]);

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setExcusesEmployeeSearch((prevData) =>
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

    setExcusesEmployeeList((prevData) =>
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

  const header1 = [
    {
      approved: [
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
          title: t("Excuse Type"),
          value: "excuseType",
        },
        {
          id: 3,
          title: t("Status"),
          value: "status",
          status: true,
          colour: "color",
        },
        {
          id: 4,
          title: "",
          value: "isRegularizationNeeded",
          Regularize: true,
          icons: <PiDownloadSimpleLight />,
          buttonName: "View Detail",
        },
      ],
    },
  ];

  const header2 = [
    {
      rejected: [
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
          title: t("Excuse Type"),
          value: "excuseType",
        },
        {
          id: 3,
          title: t("Status"),
          value: "status",
          status: true,
          colour: "color",
        },
        {
          id: 4,
          title: "",
          value: "isRegularizationNeeded",
          Regularize: true,
          icons: <PiDownloadSimpleLight />,
          buttonName: "View Detail",
        },
      ],
    },
  ];

  const filterItems = {
    cardsOne: [
      {
        title: "All",
        count:
          parseInt(excuesesCount?.lateEntries) +
          parseInt(excuesesCount?.excessBreak) +
          parseInt(excuesesCount?.earlyExit) +
          parseInt(excuesesCount?.missPunch),
        icon: <MdOutlineSelectAll />,
        color: "#6A4BFC",
        value: "All",
      },
      {
        title: "Late Entries",
        count: excuesesCount?.lateEntries,
        icon: <PiClockCountdown />,
        color: "#6A4BFC",
        value: "Late Entry",
      },
      {
        title: "Excess Break",
        count: excuesesCount?.excessBreak,
        icon: <PiHourglassHigh />,
        color: "#00BBC7",
        value: "Excess Break",
      },
      {
        title: "Early Exit",
        count: excuesesCount?.earlyExit,
        icon: <PiSignOut />,
        color: "#298ae6",
        value: "Early Exit",
      },
      {
        title: "Miss Punch",
        count: excuesesCount?.missPunch,
        icon: <PiFingerprint />,
        color: "#EC7100",
        value: "Miss Punch",
      },
    ],
    cardsTwo: [
      {
        title: "Pardoned",
        value: "pardon",
        count: excuesesCount?.approved,
        color: "#188038",
      },
      {
        title: "Applied Fine",
        value: "fine",
        count: excuesesCount?.rejected,
        color: "#C60606",
      },
    ],
  };

  const getApproveRejectDetailsById = async (RegularizationId) => {
    try {
      const result = await action(API.GET_APPROVE_REJECT_DETAILS, {
        id: RegularizationId,
      });
      if (result.status === 200) {
        setModalData(result.result);
      }
    } catch (error) {
      return error;
    }
  };

  const getApproveRejectList = async (e) => {
    try {
      const result = await action(API.GET_REGULARIZING_APPROVE_REJECT_LIST, {
        filter: e,
        superiorEmployeeId: employeeId,
        neededYearAndMonth: date,
        companyId: companyId,
      });
      if (result.status === 200) {
        // setApproveRejectList(result.result);
        setApproveRejectList(
          result.result?.map((each) => ({
            ...each,
            logo: each.profilePicture,
            color: each.status === "pardon" ? "#027A48" : "#C4320A",
            status: each.status === "pardon" ? "Pardoned" : "Applied Fine",
            isRegularizationNeeded: 1,
          }))
        );
      }
    } catch (error) {
      return error;
    }
  };

  useMemo(() => {
    if (data?.status === 200) {
      setExcusesEmployeeSearch(
        data?.result?.map((each, index) => ({
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
      setExcusesEmployeeList(
        data?.result?.map((each, index) => ({
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
      setExcusesFilterList(
        data?.result?.map((each, index) => ({
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
          if (status.statusSelected && employee.selected) {
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
    // console.log(excusesEmployeeList);
  }, [excusesEmployeeList]);
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
        const result = await action(API.ADD_EMPLOYEE_PARDON, {
          companyId: companyId,
          selectedType: requestStatus,
          responseBy: employeeId,
          remarks: e.remark,
          employeeAttendanceDeductionIds: excusesEmployeeList
            ?.flatMap((each) =>
              each.employees.flatMap((item) =>
                item.status
                  .filter((itemStatus) => itemStatus.statusSelected)
                  .map((itemStatus) => itemStatus.employeeAttendanceDeductionId)
              )
            )
            .filter(Boolean),
        });
        if (result.status === 200) {
          referesh();
          getExcueseCount();
          openNotification("success", "Successful", result.message);
          setIsOpenPardon({ status: false });
        } else {
          openNotification("error", "Failed ", result.message);
        }
      } catch (error) {
        openNotification("error", "Failed ", error.message);
      }
    },
  });

  useEffect(() => {
    setPardonDisplay(
      checkConditions(
        excusesEmployeeList?.length > 0 ? excusesEmployeeList : []
      )
    );

    setSelectedCount(
      countSelectedEmployees(
        excusesEmployeeList?.length > 0 ? excusesEmployeeList : []
      )
    );
  }, [excusesEmployeeList]);

  return (
    <div className="flex flex-col gap-6">
      <div className="  h-full flex flex-col lg:flex-row items-baseline lg:items-center lg:flex-wrap gap-4 justify-between">
        <div className="grid grid-cols-1 xss:grid-cols-2 md:grid-cols-5 gap-6 w-full md:w-auto">
          {filterItems.cardsOne.map((card, index) => (
            <div
              key={index}
              className="borderb rounded-lg p-2 flex items-center gap-3 hover:shadow-lg pr-3 cursor-pointer transition-all duration-300 bg-white dark:bg-dark"
              onClick={() => {
                setFilterClickItem(card.value);
              }}
            >
              <div
                className={`size-[51px] lg:size-10 2xl:size-[51px] rounded vhcenter text-[28px] lg:text-xl 2xl:text-[28px]`}
                style={{
                  backgroundColor: `${card.color}15`,
                  color: card.color,
                }}
              >
                {card.icon}
              </div>

              <div>
                <p className="text-grey text-xs lg:text-[10px] 2xl:text-xs">
                  {card.title}
                </p>
                <p className="text-base lg:text-sm 2xl:text-base font-semibold dark:text-white">
                  {!card?.count ? "" : card?.count}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
          {filterItems.cardsTwo.map((card, index) => (
            <div
              key={index}
              className="borderb rounded-lg p-2 2xl:p-3 2xl:pr-8 flex items-center hover:shadow-lg pr-8 cursor-pointer transition-all duration-300 bg-white dark:bg-dark w-full md:w-auto"
              style={{
                color: card.color,
                backgroundColor: `${
                  filterClickItem === card.value
                    ? `${card.color}25`
                    : "transparent"
                }`,
              }}
              onClick={() => {
                setFilterClickItem(card.value);
                getApproveRejectList(card.value);
              }}
            >
              {/* Add This Line into style when Active "backgroundColor: `${card.color}25`"  */}
              <div>
                <p className="text-xs lg:text-[10px] 2xl:text-xs">
                  {card.title}
                </p>
                <p className="text-base lg:text-sm 2xl:text-base font-semibold dark:text-white">
                  {card.count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        {filterClickItem === "pardon" ? (
          <div>
            <TableAnt
              header={header1}
              data={approveRejectList}
              path="approved"
              clickDrawer={(rowData, i, data, l) => {
                toggleModal(data);
              }}
              viewOutside={true}
              viewClick={() => {
                setIsOpen(true);
              }}
            />
          </div>
        ) : filterClickItem === "fine" ? (
          <div>
            <TableAnt
              header={header2}
              data={approveRejectList}
              path="rejected"
              clickDrawer={(rowData, i, data, l) => {
                toggleModal(data);
              }}
              viewClick={() => {
                setIsOpen(true);
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex sm:items-center flex-col-reverse sm:flex-row gap-4 justify-between">
              <CheckBoxInput
                value={selectAll}
                change={handleSelectAllChange}
                titleRight="Select All Employees"
                titleClassName="text-primary font-semibold"
                // indeterminate={indeterminate}
              />
              <div>
                <SearchBox
                  placeholder="Search"
                  data={excusesEmployeeSearch}
                  value={searchValue}
                  change={(e) => {
                    setSearchvalue(e);
                  }}
                  onSearch={(value) => {
                    setExcusesEmployeeList(value);
                  }}
                />
              </div>
            </div>
            <div
              className={`flex flex-col gap-8 overflow-scroll ${
                pardonDisplay && "mb-fit md:mb-20"
              }`}
            >
              {excusesEmployeeList?.length > 0 ? (
                excusesEmployeeList?.map((data, index) => (
                  <>
                    <div key={index} className="flex flex-col gap-3">
                      <div className="text-xs 2xl:text-sm font-semibold dark:text-white">
                        {data.date}
                      </div>
                      <div className="flex flex-col gap-3 bg-[#F8FAFC] dark:bg-dark rounded-lg p-3.5">
                        <div className="flex items-center">
                          <CheckBoxInput
                            value={data.selecteEmloyees}
                            change={(e) => {
                              setExcusesEmployeeSearch((prevData) =>
                                prevData?.map((each) => ({
                                  id: each.id,
                                  date: each.date,
                                  selecteEmloyees:
                                    data.id === each.id
                                      ? e
                                      : each.selecteEmloyees,
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
                                  employeeName: each.employees[0].employeeName,
                                }))
                              );
                              setExcusesEmployeeList((prevData) =>
                                prevData?.map((each) => ({
                                  id: each.id,
                                  date: each.date,
                                  selecteEmloyees:
                                    data.id === each.id
                                      ? e
                                      : each.selecteEmloyees,
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

                              // handleByDateChange(data.id);
                            }}
                            titleRight="Select All"
                          />
                        </div>
                        <div className="flex-col flex gap-3.5">
                          <ExcusesCard
                            data={data}
                            ButtonClick={(e, value, id) => {
                              // console.log(value, "value");
                              setShowModelDate(value);
                              //   setAttendanceId(id);
                              // if (value === "Late Entry") {
                              setShow(e);
                              // }
                            }}
                            selectCheckBoxChange={(employeeId, select) => {
                              setExcusesEmployeeSearch((prevData) =>
                                prevData?.map((each) => ({
                                  id: each.id,
                                  date: each.date,
                                  selecteEmloyees: each.selecteEmloyees,
                                  employees: each.employees.map((item) => ({
                                    ...item,
                                    selected:
                                      employeeId === item.id
                                        ? select
                                        : item.selected,
                                    status: item.status.map((itemStatus) => ({
                                      ...itemStatus,
                                      statusSelected:
                                        employeeId === item.id
                                          ? select
                                          : itemStatus.statusSelected,
                                    })),
                                  })),
                                  employeeName: each.employees[0].employeeName,
                                }))
                              );
                              setExcusesEmployeeList((prevData) =>
                                prevData?.map((each) => ({
                                  id: each.id,
                                  date: each.date,
                                  selecteEmloyees: each.selecteEmloyees,
                                  employees: each.employees.map((item) => ({
                                    ...item,
                                    selected:
                                      employeeId === item.id
                                        ? select
                                        : item.selected,
                                    status: item.status.map((itemStatus) => ({
                                      ...itemStatus,
                                      statusSelected:
                                        employeeId === item.id
                                          ? select
                                          : itemStatus.statusSelected,
                                    })),
                                  })),
                                }))
                              );
                            }}
                            statusSelectedChange={(statusId, select) => {
                              setExcusesEmployeeSearch((prevData) =>
                                prevData?.map((each) => ({
                                  id: each.id,
                                  date: each.date,
                                  selecteEmloyees: false,
                                  employees: each.employees.map((item) => ({
                                    ...item,
                                    // selected: item.selected,
                                    selected: item.selected,
                                    status: item.status.map((itemStatus) => ({
                                      ...itemStatus,
                                      statusSelected:
                                        statusId === itemStatus.id
                                          ? select
                                          : itemStatus.statusSelected,
                                    })),
                                  })),
                                  employeeName: each.employees[0].employeeName,
                                }))
                              );
                              setExcusesEmployeeList((prevData) =>
                                prevData?.map((each) => ({
                                  id: each.id,
                                  date: each.date,
                                  selecteEmloyees: false,
                                  employees: each.employees.map((item) => ({
                                    ...item,
                                    selected: item.selected,
                                    // selected: item.status.some(
                                    //   (each) => each.id === statusId
                                    // )
                                    //   ? select
                                    //   : item.selected,
                                    status: item.status.map((itemStatus) => ({
                                      ...itemStatus,
                                      statusSelected:
                                        statusId === itemStatus.id
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
                    </div>
                    {index < excusesEmployeeList?.length - 1 && (
                      <div className="divider-h" />
                    )}
                  </>
                ))
              ) : excusesEmployeeList?.length <= 0 ? (
                <NoData />
              ) : (
                <Skeleton />
              )}
            </div>
          </div>
        )}
      </div>

      {pardonDisplay && (
        <Choose selectedCount={selectedCount}>
          <p className="flex items-center gap-2">
            <ButtonClick
              buttonName={"Apply Fine"}
              BtnType="primary"
              danger
              handleSubmit={() => {
                setIsOpenPardon({ type: "fine", status: true });
              }}
            />
            <ButtonClick
              buttonName={"Pardon Fine"}
              BtnType="primary"
              handleSubmit={() => {
                setIsOpenPardon({ type: "pardon", status: true });
              }}
            />
          </p>
        </Choose>
      )}

      {show && (
        <LateEntrySettings
          open={show}
          close={() => {
            getExcueseCount();
            referesh();
            setShow(false);
          }}
          deductionId={showModelDate.employeeAttendanceDeductionId}
          companyId={companyId}
          // refresh={() => {
          //   getEmployeeAttendence();
          // }}
          // employeeDetails={employeeDetails}
        />
      )}

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
        okText={isOpenPardon.type === "pardon" ? "Pardon Fine" : "Apply Fine"}
        okButtonDanger={isOpenPardon.type === "pardon" ? false : true}
        okButtonClass="w-full"
        onOk={() => {
          if (isOpenPardon.type === "pardon") {
            setRequestStatus("pardon");
          } else {
            setRequestStatus("fine");
          }
          formik.handleSubmit();
        }}
        error={formik.values.remark === "" ? true : false}

        // onClose={() => {
        //   setRemarks(null);
        //   setIsOpenPardon({ status: false })
        // }}
        // okText={isOpenPardon.type}
        // // cancelText={"Reject"}
        // okButtonClass={"  2xl:w-[228px]"}
        // cancelButtonClass={"m-auto w-full 2xl:w-[228px]"}
        // cancelButtonDanger={true}
        // okButtonType={"primary"}
        // danger
        // showTitle={false}
        // centered={true}
        // padding="8px"
        // showCancelButton={false}
        // okButtonDanger={isOpenPardon.type !== "Pardon Fine" && true}
        // onOk={() => {
        //   if (isOpenPardon.type === "Pardon Fine") {
        //     addPardonfine();
        //     setRemarks(null);
        //   } else {
        //     applyFine();
        //     setRemarks(null);
        //   }
        // }}
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
              {isOpenPardon.type === "pardon"
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
                isOpenPardon.type === "pardon" ? "text-primary" : "text-red-500"
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
            <div className="border-2 border-[#FFFFFF] size-14 2xl:size-[60px] rounded-full flex items-center justify-center bg-[#CBCAFC66] dark:bg-dark">
              <img
                src={popimage}
                alt="popimage"
                className="rounded-full w-[28px]"
              />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              {modalData?.excuseType}
            </p>
          </div>
          {/* <div className="m-auto">
            <p className="text-center text-xs 2xl:text-sm text-gray-500">
              Employee Excuse reason and its actioned details for irregularity
              in daily attendance
            </p>
          </div> */}
          <div className="flex flex-col gap-6  bg-[#F9F9F9] dark:bg-dark rounded-lg p-3 2xl:p-4">
            {/* <div className="flex gap-[46px] 2xl:gap-12">
              <div className="flex flex-col gap-2 text-xs 2xl:text-sm">
                <p className="text-gray-500">Request Type</p>
                <p className="font-semibold">{modalData.excuseType}</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs 2xl:text-sm text-gray-500">Fine Type</p>
                <p className="flex items-center 2xl:gap-1.5 text-primaryalpha px-0.5 w-fit rounded-2xl bg-primaryalpha/5 ">
                  <PiDotOutlineFill size={24} />
                  <p className="font-medium pr-2 text-xs 2xl:text-sm">
                  2x Basic Salary
                  </p>
                </p>
              </div>
            </div> */}
            <div className="flex gap-[46px] 2xl:gap-12 ">
              <div className="flex flex-col gap-2">
                <p className="text-xs 2xl:text-sm text-gray-500">Late By</p>
                <div className="flex gap-1.5 2xl:gap-2 items-center">
                  <PiClockCountdownLight className="size-[19px] 2xl:size-5  text-gray-500" />
                  <p className="text-xs 2xl:text-sm text-red-600 font-semibold">
                    {modalData?.excuseType}
                  </p>
                </div>
              </div>
              {modalData.status !== "pardon" && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs 2xl:text-sm text-gray-500">
                    Fine Amount
                  </p>
                  <div className="flex gap-1.5 2xl:gap-2 items-center">
                    <PiCoinsLight className="size-[19px] 2xl:size-6 text-gray-500" />
                    <p className="text-xs 2xl:text-sm text-red-600 font-semibold">
                      {modalData?.deductionAmount}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#F9F9F9] dark:bg-dark rounded-lg px-4	py-3 dark:text-slate-400 ">
            <p className="font-medium text-xs 2xl:text-sm ">Reason:</p>
            <p className="break-all text-[10px] 2xl:text-xs text-slate-500 dark:text-gray-400 ">
              {modalData?.excuseReason}
            </p>
          </div>
          <div className="border-t mt-2 flex flex-col gap-1.5 2xl:gap-2 text-xs 2xl:text-sm">
            <p className="font-medium text-gray-500 mt-3">Attendance Date:</p>
            <p className="font-medium">{modalData?.attendanceDate}</p>
          </div>
          <div className="border-t mt-2 flex flex-col gap-1.5 2xl:gap-2 text-xs 2xl:text-sm">
            <p className="font-medium text-gray-500 mt-3">Comment</p>
            <p className="font-medium">{modalData?.remarks}</p>
          </div>
          <div className="flex flex-col gap-1.5 2xl:gap-2 mt-1">
            <p className="font-medium text-xs 2xl:text-sm text-gray-500">
              Pardoned by
            </p>
            {modalData.approvers?.map((each) => (
              <div className="flex justify-between items-center">
                <div className="flex gap-1.5 2xl:gap-2 items-center">
                  <div className="overflow-hidden border-2 border-white rounded-full shadow-md size-8 2xl:size-12 shrink-0">
                    <img
                      src={each.profilePicture}
                      alt="Frameimage"
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 2xl:gap-1	">
                    <p className="font-medium text-xs 2xl:text-sm">
                      {each.approverName}
                    </p>
                    <p className="text-[10px] 2xl:text-xs text-gray-500">
                      {each.designation}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 2xl:gap-1.5 text-[10px] 2xl:text-xs">
                  <p
                    className={`${
                      modalData.status === "pardon"
                        ? "text-[#349C5E]"
                        : "text-[#C4320A]"
                    } font-semibold text-right`}
                  >
                    {modalData.status === "pardon"
                      ? "Pardoned"
                      : "Applied Fine"}
                  </p>
                  {/* <p className="text-gray-500">12/12/2024</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalAnt>
    </div>
  );
}
