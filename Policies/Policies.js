/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import FlexCol from "../common/FlexCol";
import Heading from "../common/Heading";
import ButtonClick from "../common/Button";
import TableAnt from "../common/TableAnt";
import { policiesHeader, timeOutPolicyHeader } from "../data";
import API, { action } from "../Api";
import AddPolicies from "./AddPolicies";
import { useTranslation } from "react-i18next";
import logo from "../../assets/images/EmpLeaveRequest.svg";
import ModalAnt from "../common/ModalAnt";
import { NoData } from "../common/SVGFiles";
import { useNotification } from "../../Context/Notifications/Notification";
import { Table, Typography } from "antd";
import ToggleBtn from "../common/ToggleBtn";
import Heading2 from "../common/Heading2";
import imgorange from "../../assets/images/calendar-orange.png";

export default function Policies() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [timeOutPolicyData, setTimeoutPolicyData] = useState(null);
  const [navigationValue, setNavigationValue] = useState(t("Work_policys"));

  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
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

  const getPolicies = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_WORK_POLICY, {
        companyId: parseInt(companyId),
      });
      setPolicies(
        result.result?.map((each) => ({
          ...each,
          employeeName: each.employee?.map((data) => data.firstName),
          name: each.employee?.map((data) => data.firstName),
          multiImage: each.employee?.map((data) => data.profilePicture),
          employeeId: each.employee?.map((data) => data.employeeId),
        }))
      );
    } catch (error) {
      openNotification("error", "Failed..", error.code);
      console.log(error);
    }
  };

  useEffect(() => {
    getPolicies();
  }, []);
  const getIdBasedEmployeeDetails = async (e, view) => {
    try {
      const result = await action(API.GET_ID_BASED_EMPLOYEE_WORK_POLICY, {
        id: e,
      });
      setTimeoutPolicyData(result.result);
      if (view === "vieClick") {
        setViewOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const tableData =
    timeOutPolicyData?.workPolicyDetails[0]?.workRules?.missPunch?.rule;

  const columns = [
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          If Miss punch occurs more than
        </span>
      ),
      dataIndex: "minutes",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">{data} min</Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Deduction Type
        </span>
      ),
      dataIndex: "deductionType",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data
              ?.replace(/([A-Z])/g, " $1")
              .charAt(0)
              .toUpperCase() + data?.replace(/([A-Z])/g, " $1").slice(1) ||
              "--"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Deduction Component
        </span>
      ),
      dataIndex: "deductionComponent",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {(data &&
              data
                ?.replace(/([A-Z])/g, " $1")
                .charAt(0)
                .toUpperCase() + data?.replace(/([A-Z])/g, " $1").slice(1)) ||
              "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">Days</span>
      ),
      dataIndex: "days",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data
              ?.replace(/([A-Z])/g, " $1")
              .charAt(0)
              .toUpperCase() + data?.replace(/([A-Z])/g, " $1").slice(1) ||
              "--"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Amount
        </span>
      ),
      dataIndex: "amount",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data ? data : "---"}
          </Typography.Text>
        );
      },
    },
  ];

  // ATTENDANCE ON HOLIDAY TABLE
  const holidayData =
    timeOutPolicyData?.workPolicyDetails[0]?.workRules?.attendanceOnHoliday;

  let convertedData = [];
  let convertedDataObject = [];
  let salaryMultiplierObject = [];

  switch (holidayData?.Type) {
    case "overtime":
      convertedData = holidayData?.values?.map((data, i) => ({
        keyt: i,
        Type: holidayData.Type,
        maximumWorkinghours: holidayData.maximumWorkinghours,
        minimumWorkinghours: holidayData.minimumWorkinghours,
        amount: data.amount,
        minutes: data.minutes,
        salaryComponent: data.salaryComponent,
        salaryMultiplier: data.salaryMultiplier,
        type: data.type,
      }));
      break;
    case "comboOff":
      convertedDataObject = [
        {
          Type: holidayData?.Type,
          maximumWorkinghours: holidayData?.maximumWorkinghours,
          minimumWorkinghours: holidayData?.minimumWorkinghours,
          halfDay: holidayData?.values.halfDay,
          fullDay: holidayData?.values.fullfDay,
        },
      ];
      break;
    default:
    case "salaryMultiplier":
      salaryMultiplierObject = [
        {
          Type: holidayData?.Type,
          maximumWorkinghours: holidayData?.maximumWorkinghours,
          minimumWorkinghours: holidayData?.minimumWorkinghours,
          salaryComponent: holidayData?.values.salaryComponent,
          salaryMultiplier: holidayData?.values.salaryMultiplier,
        },
      ];
  }

  const columnsHoiliday = [
    // {
    //   title: "Type",
    //   dataIndex: "Type",
    //   render: (data) => {
    //     return (
    //       <Typography.Text className="text-[13px]">
    //         {data[0].toUpperCase() + data.slice(1)}
    //       </Typography.Text>
    //     );
    //   },
    // },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Maximum Working
        </span>
      ),
      dataIndex: "maximumWorkinghours",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data !== "" ? data : "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Minimum Working
        </span>
      ),
      dataIndex: "minimumWorkinghours",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data !== "" ? data : "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Amount
        </span>
      ),
      dataIndex: "amount",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data ?? "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Minutes
        </span>
      ),
      dataIndex: "minutes",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data ?? "---"}
          </Typography.Text>
        );
      },
    },
    // {
    //   title: (
    //     <span className="text-grey text-xs 2xl:text-sm font-normal">
    //       Salary Component
    //     </span>
    //   ),
    //   dataIndex: "salaryComponent",
    //   render: (data) => {
    //     return (
    //       <Typography.Text className="text-[13px]">
    //         {data
    //           ?.replace(/([A-Z])/g, " $1")
    //           .charAt(0)
    //           .toUpperCase() + data?.replace(/([A-Z])/g, " $1").slice(1) ||
    //           "---"}
    //       </Typography.Text>
    //     );
    //   },
    // },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">Type</span>
      ),
      dataIndex: "type",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data
              ?.replace(/([A-Z])/g, " $1")
              .charAt(0)
              .toUpperCase() + data?.replace(/([A-Z])/g, " $1").slice(1) ||
              "---"}
          </Typography.Text>
        );
      },
    },
  ];

  const columnsComboOff = [
    // {
    //   title: "Type",
    //   dataIndex: "Type",
    //   render: (data) => {
    //     return (
    //       <Typography.Text className="text-[13px]">
    //         {data[0].toUpperCase() + data.slice(1)}
    //       </Typography.Text>
    //     );
    //   },
    // },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Maximum Working
        </span>
      ),
      dataIndex: "maximumWorkinghours",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data !== "" ? data : "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Minimum Working
        </span>
      ),
      dataIndex: "minimumWorkinghours",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data !== "" ? data : "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Full Day
        </span>
      ),
      dataIndex: "fullDay",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data ?? "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Half Day
        </span>
      ),
      dataIndex: "halfDay",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data ?? "---"}
          </Typography.Text>
        );
      },
    },
  ];

  const columnsSalaryMultiplier = [
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Maximum Working
        </span>
      ),
      dataIndex: "maximumWorkinghours",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data !== "" ? data : "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Minimum Working
        </span>
      ),
      dataIndex: "minimumWorkinghours",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data !== "" ? data : "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Salary Component
        </span>
      ),
      dataIndex: "salaryComponent",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data
              ?.replace(/([A-Z])/g, " $1")
              .charAt(0)
              .toUpperCase() + data?.replace(/([A-Z])/g, " $1").slice(1) ||
              "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Salary Multiplier
        </span>
      ),
      dataIndex: "salaryMultiplier",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data ? data + "x" : "---"}
          </Typography.Text>
        );
      },
    },
  ];

  // OVERTIME TABLE DATA
  const overTimeTabledata =
    timeOutPolicyData?.workPolicyDetails[0]?.workRules?.overTime?.values;

  const overTimeData =
    timeOutPolicyData?.workPolicyDetails[0]?.workRules?.overTime;

  const columnsOverTime = [
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Full day
        </span>
      ),
      dataIndex: "fullDay",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">{data}</Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Half Day
        </span>
      ),
      dataIndex: "halfDay",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">{data}</Typography.Text>
        );
      },
    },
  ];

  const columnsCustomRate = [
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          If Employee works more than
        </span>
      ),
      dataIndex: "minutes",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">{data}</Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Salary Component
        </span>
      ),
      dataIndex: "salaryComponent",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data
              ?.replace(/([A-Z])/g, " $1")
              .charAt(0)
              .toUpperCase() + data?.replace(/([A-Z])/g, " $1").slice(1) ||
              "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">Type</span>
      ),
      dataIndex: "type",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data
              ?.replace(/([A-Z])/g, " $1")
              .charAt(0)
              .toUpperCase() + data?.replace(/([A-Z])/g, " $1").slice(1) ||
              "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Salary Multiplier
        </span>
      ),
      dataIndex: "salaryMultiplyer",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data ? data + "x" : "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Amount
        </span>
      ),
      dataIndex: "amount",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data ?? "---"}
          </Typography.Text>
        );
      },
    },
  ];

  const columnsFixedRate = [
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          If Employee works more than
        </span>
      ),
      dataIndex: "minutes",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data ?? "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Amount Per Minute
        </span>
      ),
      dataIndex: "amount",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]"> {data}</Typography.Text>
        );
      },
    },
  ];

  // var today = new Date();
  // var nextDate = new Date(new Date().setDate(today.getDate() - 32));

  // INOUT POLICIES TABLE DATA
  const exitRuleTabledata =
    timeOutPolicyData?.workPolicyDetails[2]?.workRules?.exitRule?.rule;

  const lateEntryRuleTabledata =
    timeOutPolicyData?.workPolicyDetails[0]?.workRules?.lateEntryRule?.rule;

  const BreakRuleTabledata =
    timeOutPolicyData?.workPolicyDetails[1]?.workRules?.breakRule?.rule;

  const columnsInOut = [
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          If Miss punch occurs more than
        </span>
      ),
      dataIndex: "minutes",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data ? data + " min" : "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Deduction Type
        </span>
      ),
      dataIndex: "deductionType",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data
              ?.replace(/([A-Z])/g, " $1")
              .charAt(0)
              .toUpperCase() + data?.replace(/([A-Z])/g, " $1").slice(1) ||
              "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Deduction Component
        </span>
      ),
      dataIndex: "deductionComponent",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data
              ?.replace(/([A-Z])/g, " $1")
              .charAt(0)
              .toUpperCase() + data?.replace(/([A-Z])/g, " $1").slice(1) ||
              "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">
          Amount
        </span>
      ),
      dataIndex: "amount",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data ? data : "---"}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <span className="text-grey text-xs 2xl:text-sm font-normal">Days</span>
      ),
      dataIndex: "days",
      render: (data) => {
        return (
          <Typography.Text className="text-[13px]">
            {data ? data : "---"}
          </Typography.Text>
        );
      },
    },
  ];

  return (
    <FlexCol>
      <div className="flex flex-col items-center gap-2 md:gap-0 md:flex-row md:justify-between ">
        <Heading
          title={t("Work_policys")}
          description={t("Main_Excuse_desc")}
          className=" colcolumnsCustomRate-span-2"
        />
        <div className=" flex justify-end">
          <ButtonClick
            buttonName={t("Create_Policies")}
            handleSubmit={() => {
              setShow(true);
              console.log(true);
            }}
            BtnType="Add"
          />
        </div>
      </div>
      <TableAnt
        data={policies}
        header={policiesHeader}
        actionID="workPolicyId"
        // updateApi={API.UPDATE_ONLY_ISACTIVE}
        path={"Work_Policy"}
        navigationValue={navigationValue}
        buttonClick={(e, company) => {
          setUpdateId(e);
          setShow(true);
          // if (e) {
          //   getIdBasedEmployeeDetails(e);
          // }
          // setViewOpen(true);
          console.log("Value", updateId);
        }}
        clickDrawer={(e, id) => {
          // handleShow();
        }}
        deleteApi={API.DELETE_ALL_POLICY}
        viewOutside={true}
        viewClick={(e) => {
          console.log("true", e);
          getIdBasedEmployeeDetails(e, "vieClick");
        }}
        referesh={() => {
          getPolicies();
        }}
      />

      {show && (
        <AddPolicies
          open={show}
          close={(e) => {
            setShow(e);
            setUpdateId("");
            getPolicies();
          }}
          // actionID="workPolicyId"
          // viewDetails={true}
          // buttonClick={(e, company) => {
          //   console.log(e);
          //   setUpdateId(e);
          // }}
          updateId={updateId}
          refresh={() => {
            getPolicies();
          }}
        />
      )}
      <ModalAnt
        isVisible={viewOpen}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        testData
        centered={true}
        onClose={(e) => {
          setViewOpen(false);
        }}
      >
        <div className="flex flex-col gap-5 md:w-[653px] 2xl:w-[745px] h-3/4 p-2">
          <div className="flex flex-col gap-2.5 items-center mx-auto">
            <div className="border-2 border-[#FFFFFF] size-14 2xl:size-[60px] rounded-full flex items-center justify-center bg-[#CBCAFC66]">
              <img src={logo} alt="Img" className="rounded-full w-[28px]" />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              {timeOutPolicyData?.workPolicyType}
            </p>
            {/* <div className="m-auto">
              <p className="text-center text-xs 2xl:text-sm text-grey dark:text-gray-400">
                {timeOutPolicyData?.workPolicyName?.charAt(0).toUpperCase() +
                  timeOutPolicyData?.workPolicyName?.slice(1)}
              </p>
            </div> */}
          </div>
          <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2">
            <div
              className={
                "w-full flex gap-2 bg-[#F9F9F9] dark:bg-[#0B1019] items-center"
              }
            >
              <div className="dark:text-white text-xs 2xl:text-sm font-medium">
                {`Work Policy Name : 
              ${
                timeOutPolicyData?.workPolicyName?.charAt(0).toUpperCase() +
                timeOutPolicyData?.workPolicyName?.slice(1)
              }`}
              </div>
            </div>
          </div>
          {timeOutPolicyData?.workPolicyTypeId === "4" && (
            <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-1 dark:text-slate-400 flex flex-col gap-2">
              {/* <p className="font-medium text-xs 2xl:text-sm ">
                If Miss punch occurs more than
              </p> */}

              <div className="">
                {tableData?.length !== 0 ? (
                  <Table
                    scroll={{ x: "400px", y: "120px" }}
                    dataSource={tableData}
                    columns={columns}
                    pagination={false}
                    className="overflow-auto"
                  />
                ) : (
                  <p className="vhcenter p-5">
                    <NoData />
                  </p>
                )}
              </div>
            </div>
          )}
          {timeOutPolicyData?.workPolicyTypeId === "3" &&
          holidayData?.Type === "overtime" ? (
            <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2">
              <p className="font-medium text-xs 2xl:text-sm ">
                {holidayData?.Type === "overtime" && "Over Time"}
              </p>

              <div className="border-t">
                {convertedData?.length !== 0 ? (
                  <Table
                    scroll={{ x: "400px" }}
                    dataSource={convertedData}
                    columns={columnsHoiliday}
                    pagination={false}
                  />
                ) : (
                  <p className="vhcenter p-5">
                    <NoData />
                  </p>
                )}
              </div>
            </div>
          ) : holidayData?.Type === "comboOff" ? (
            <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2">
              <p className="font-medium text-xs 2xl:text-sm ">
                {holidayData?.Type === "comboOff" && "Combo Off"}
              </p>

              <div className="border-t">
                {convertedDataObject?.length !== 0 ? (
                  <Table
                    scroll={{ x: "400px" }}
                    dataSource={convertedDataObject}
                    columns={columnsComboOff}
                    pagination={false}
                  />
                ) : (
                  <p className="vhcenter p-5">
                    <NoData />
                  </p>
                )}
              </div>
            </div>
          ) : holidayData?.Type === "salaryMultiplier" ? (
            <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2">
              <p className="font-medium text-xs 2xl:text-sm ">
                Salary Multiplier
              </p>

              <div className="border-t">
                {salaryMultiplierObject?.length !== 0 ? (
                  <Table
                    scroll={{ x: "400px" }}
                    dataSource={salaryMultiplierObject}
                    columns={columnsSalaryMultiplier}
                    pagination={false}
                  />
                ) : (
                  <p className="vhcenter p-5">
                    <NoData />
                  </p>
                )}
              </div>
            </div>
          ) : (
            holidayData?.Type === "doNotConsider" && (
              <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2">
                <p className="font-medium text-xs 2xl:text-sm ">
                  Do Not Consider
                </p>
                <div className="border-t flex gap-3">
                  <img
                    className="size-[50px] shrink-0"
                    src={imgorange}
                    alt=""
                  />
                  <Heading2
                    title={"Not Consider Attendance On Holidays"}
                    description={
                      "Opt not to consider attendance on holidays for additional compensation or compensatory time off."
                    }
                  />
                </div>

                {/* <div className="border-t">
                  {convertedDataObject?.length !== 0 ? (
                    <Table
                      scroll={{ x: "1000px" }}
                      dataSource={convertedDataObject}
                      columns={columnsHoiliday}
                      pagination={false}
                    />
                  ) : (
                    <p className="vhcenter p-5">
                      <NoData />
                    </p>
                  )}
                </div> */}
              </div>
            )
          )}

          {timeOutPolicyData?.workPolicyTypeId === "2" &&
            (overTimeData?.Type === "complimentaryOff" ? (
              <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2">
                <p className="font-medium text-xs 2xl:text-sm ">
                  Complimentary Off
                </p>

                <div className="border-t">
                  {overTimeTabledata?.length !== 0 ? (
                    <Table
                      scroll={{ x: "300px" }}
                      dataSource={overTimeTabledata}
                      columns={columnsOverTime}
                      pagination={false}
                    />
                  ) : (
                    <p className="vhcenter p-5">
                      <NoData />
                    </p>
                  )}
                </div>
              </div>
            ) : overTimeData?.Type === "customRate" ? (
              <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2">
                <p className="font-medium text-xs 2xl:text-sm ">
                  Custom Rate
                </p>

                <div className="border-t">
                  {overTimeTabledata?.length !== 0 ? (
                    <Table
                      scroll={{ x: "400px", y: "120px" }}
                      dataSource={overTimeTabledata}
                      columns={columnsCustomRate}
                      pagination={false}
                      className="overflow-auto"
                    />
                  ) : (
                    <p className="vhcenter p-5">
                      <NoData />
                    </p>
                  )}
                </div>
              </div>
            ) : (
              overTimeData?.Type === "fixedRate" && (
                <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2">
                  <p className="font-medium text-xs 2xl:text-sm ">
                    Fixed Rate
                  </p>

                  <div className="border-t">
                    {overTimeTabledata?.length !== 0 ? (
                      <Table
                        scroll={{ x: "400px" }}
                        dataSource={overTimeTabledata}
                        columns={columnsFixedRate}
                        pagination={false}
                      />
                    ) : (
                      <p className="vhcenter p-5">
                        <NoData />
                      </p>
                    )}
                  </div>
                </div>
              )
            ))}
          {timeOutPolicyData?.workPolicyTypeId === "1" && (
            <div className="h-64 overflow-y-auto pr-0.5 flex flex-col gap-5">
              <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2">
                <p className="font-medium text-xs 2xl:text-sm ">
                  Late Entry Rule: If employee late more than
                </p>

                <div className="border-t">
                  {lateEntryRuleTabledata?.length !== 0 ? (
                    <Table
                      scroll={{ x: "400px", y: "120px" }}
                      dataSource={lateEntryRuleTabledata}
                      columns={columnsInOut}
                      pagination={false}
                      className="overflow-auto"
                    />
                  ) : (
                    <p className="vhcenter p-5">
                      <NoData />
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2">
                <p className="font-medium text-xs 2xl:text-sm ">
                  Break Rule: If employee late more than
                </p>

                <div className="border-t">
                  {BreakRuleTabledata?.length !== 0 ? (
                    <Table
                      scroll={{ x: "400px", y: "120px" }}
                      dataSource={BreakRuleTabledata}
                      columns={columnsInOut}
                      pagination={false}
                      className="overflow-auto"
                    />
                  ) : (
                    <p className="vhcenter p-5">
                      <NoData />
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2">
                <p className="font-medium text-xs 2xl:text-sm ">
                  Early Exit: If employee exits early by
                </p>

                <div className="border-t">
                  {exitRuleTabledata?.length !== 0 ? (
                    <Table
                      scroll={{ x: "400px", y: "120px" }}
                      dataSource={exitRuleTabledata}
                      columns={columnsInOut}
                      pagination={false}
                      className="overflow-auto"
                    />
                  ) : (
                    <p className="vhcenter p-5">
                      <NoData />
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* {timeOutPolicyData?.workPolicyDetails.length > 0 ? (
            <div className="overflow-auto max-h-[380px] flex flex-col gap-3 pr-1.5">
              {timeOutPolicyData?.workPolicyDetails?.map((item) =>
                item?.workRuleType === "1" ? (
                  <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2 ">
                    <div>
                      <p className="font-medium text-xs 2xl:text-sm ">
                        Late Entry Rule: If employee late more than
                      </p>
                    </div>

                    <div className="border-t">
                      <div className="mt-3">
                        {item?.workRules?.lateEntryRule?.rule?.map(
                          (each, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs 2xl:text-sm p-2"
                            >
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">Time</p>
                                <p className="font-medium ">
                                  {each?.minutes || "--"} min
                                </p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey ">Deduction Type</p>
                                <p className="font-medium ">
                                  {each?.deductionType
                                    ?.replace(/([A-Z])/g, " $1")
                                    .charAt(0)
                                    .toUpperCase() +
                                    each?.deductionType
                                      ?.replace(/([A-Z])/g, " $1")
                                      .slice(1) || "--"}
                                </p>
                              </div>
                              {each?.deductionType === "fixedAmount" ? (
                                <div className="flex flex-col gap-0.5">
                                  <p className="text-grey ">Amount</p>
                                  <p className="font-medium ">
                                    AED {each?.amount || "--"}
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <div className="flex flex-col gap-0.5">
                                    <p className="text-grey ">
                                      Deduction Component
                                    </p>
                                    <p className="font-medium ">
                                      {each?.deductionComponent
                                        ?.replace(/([A-Z])/g, " $1")
                                        .charAt(0)
                                        .toUpperCase() +
                                        each?.deductionComponent
                                          ?.replace(/([A-Z])/g, " $1")
                                          .slice(1) || "--"}
                                    </p>
                                  </div>

                                  <div className="flex flex-col gap-0.5">
                                    <p className="text-grey ">Days</p>
                                    <p className="font-medium ">
                                      {each.days
                                        ?.replace(/([A-Z])/g, " $1")
                                        .charAt(0)
                                        .toUpperCase() +
                                        each.days
                                          ?.replace(/([A-Z])/g, " $1")
                                          .slice(1) || "--"}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : item?.workRuleType === "2" ? (
                  <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2 ">
                    <div>
                      <p className="font-medium text-xs 2xl:text-sm ">
                        Break Rule: If employee late more than
                      </p>
                    </div>
                    <div className="border-t">
                      <div className=" mt-3">
                        {item?.workRules?.breakRule?.rule?.map(
                          (each, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs 2xl:text-sm p-2"
                            >
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">Time</p>
                                <p className="font-medium">
                                  {each?.minutes || "--"} min
                                </p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">Deduction Type</p>
                                <p className="font-medium">
                                  {each?.deductionType
                                    ?.replace(/([A-Z])/g, " $1")
                                    .charAt(0)
                                    .toUpperCase() +
                                    each?.deductionType
                                      ?.replace(/([A-Z])/g, " $1")
                                      .slice(1) || "--"}
                                </p>
                              </div>
                              {each?.deductionType === "fixedAmount" ? (
                                <div className="flex flex-col gap-0.5">
                                  <p className="text-grey">Amount</p>
                                  <p className="font-medium">
                                    {" "}
                                    AED {each?.amount || "--"}
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <div className="flex flex-col gap-0.5">
                                    <p className="text-grey">
                                      Deduction Component
                                    </p>
                                    <p className="font-medium">
                                      {each?.deductionComponent
                                        ?.replace(/([A-Z])/g, " $1")
                                        .charAt(0)
                                        .toUpperCase() +
                                        each?.deductionComponent
                                          ?.replace(/([A-Z])/g, " $1")
                                          .slice(1) || "--"}
                                    </p>
                                  </div>

                                  <div className="flex flex-col gap-0.5">
                                    <p className="text-grey">Days</p>
                                    <p className="font-medium">
                                      {each?.days
                                        ?.replace(/([A-Z])/g, " $1")
                                        .charAt(0)
                                        .toUpperCase() +
                                        each?.days
                                          ?.replace(/([A-Z])/g, " $1")
                                          .slice(1) || "--"}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : item?.workRuleType === "3" ? (
                  <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2 ">
                    <div>
                      <p className="font-medium text-xs 2xl:text-sm ">
                        Early Exit: If employee exits early by
                      </p>
                    </div>
                    <div className="border-t">
                      <div className=" mt-3">
                        {item?.workRules?.exitRule?.rule?.map((each, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs 2xl:text-sm p-2"
                          >
                            <div className="flex flex-col gap-0.5">
                              <p className="text-grey">Time</p>
                              <p className="font-medium">
                                {each?.minutes || "--"} min
                              </p>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <p className="text-grey">Deduction Type</p>
                              <p className="font-medium">
                                {each?.deductionType
                                  ?.replace(/([A-Z])/g, " $1")
                                  .charAt(0)
                                  .toUpperCase() +
                                  each?.deductionType
                                    ?.replace(/([A-Z])/g, " $1")
                                    .slice(1) || "--"}
                              </p>
                            </div>
                            {each?.deductionType === "fixedAmount" ? (
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">Amount</p>
                                <p className="font-medium">
                                  AED {each?.amount || "--"}
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="flex flex-col gap-0.5">
                                  <p className="text-grey">
                                    Deduction Component
                                  </p>
                                  <p className="font-medium">
                                    {each?.deductionComponent
                                      ?.replace(/([A-Z])/g, " $1")
                                      .charAt(0)
                                      .toUpperCase() +
                                      each?.deductionComponent
                                        ?.replace(/([A-Z])/g, " $1")
                                        .slice(1) || "--"}
                                  </p>
                                </div>

                                <div className="flex flex-col gap-0.5">
                                  <p className="text-grey">Days</p>
                                  <p className="font-medium">
                                    {each?.days
                                      ?.replace(/([A-Z])/g, " $1")
                                      .charAt(0)
                                      .toUpperCase() +
                                      each?.days
                                        ?.replace(/([A-Z])/g, " $1")
                                        .slice(1) || "--"}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : item?.workRuleType === "4" ? (
                  <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2 ">
                    <div>
                      <p className="font-medium text-xs 2xl:text-sm ">
                        {item?.workRules?.overTime?.Type?.replace(
                          /([A-Z])/g,
                          " $1"
                        )
                          .charAt(0)
                          .toUpperCase() +
                          item?.workRules?.overTime?.Type?.replace(
                            /([A-Z])/g,
                            " $1"
                          ).slice(1)}{" "}
                        : If employee exits early by
                      </p>
                    </div>
                    <div className="border-t">
                      <div className="flex flex-col gap-3">
                        <div className="mt-3">
                          {item?.workRules?.overTime?.values?.map(
                            (each, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-xs 2xl:text-sm gap-4 p-2"
                              >
                                {item?.workRules?.overTime?.Type ===
                                "complimentaryOff" ? (
                                  <>
                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">Full Day</p>
                                      <p className="font-medium">
                                        {each?.fullDay || "--"}
                                      </p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">Half Day</p>
                                      <p className="font-medium">
                                        {each?.halfDay
                                          ?.replace(/([A-Z])/g, " $1")
                                          .charAt(0)
                                          .toUpperCase() +
                                          each?.halfDay
                                            ?.replace(/([A-Z])/g, " $1")
                                            .slice(1) || "--"}
                                      </p>
                                    </div>
                                  </>
                                ) : item?.workRules?.overTime?.Type ===
                                  "customRate" ? (
                                  <>
                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">Time</p>
                                      <p className="font-medium">
                                        {each?.minutes || "--"}
                                      </p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">
                                        salary Component
                                      </p>
                                      <p className="font-medium">
                                        {each?.salaryComponent || "--"}
                                      </p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">Type</p>
                                      <p className="font-medium">
                                        {each?.type || "--"}
                                      </p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">
                                        salary Multiplyer
                                      </p>
                                      <p className="font-medium">
                                        {each?.salaryMultiplyer + "x" || "--"}
                                      </p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">Type</p>
                                      <p className="font-medium">
                                        {item?.workRules?.overTime?.Type ||
                                          "--"}
                                      </p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">Time</p>
                                      <p className="font-medium">
                                        {each?.minutes || "--"} min
                                      </p>
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">Type</p>
                                      <p className="font-medium">
                                        {item.workRules.overTime.Type?.charAt(
                                          0
                                        ).toUpperCase() +
                                          item.workRules.overTime.Type?.replace(
                                            /([A-Z])/g,
                                            " $1"
                                          ).slice(1) || "--"}
                                      </p>
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">
                                        Amount per minute
                                      </p>
                                      <p className="font-medium">
                                        AED {each?.amount || "--"}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : item?.workRuleType === "5" ? (
                  <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4 py-3 dark:text-slate-400 flex flex-col gap-2">
                    <div>
                      <p className="font-medium text-xs 2xl:text-sm">
                        Late Entry: If employee exits early by
                      </p>
                    </div>

                    <div className="border-t">
                      <div className="mt-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-xs 2xl:text-sm gap-4 p-2">
                          {item.workRules.attendanceOnHoliday?.Type ===
                          "salaryMultiplier" ? (
                            <>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">Type</p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday?.Type ||
                                    "--"}
                                </p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">
                                  Maximum Working Hours
                                </p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday
                                    ?.maximumWorkinghours || "--"}
                                </p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">
                                  Minimum Working Hours
                                </p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday
                                    ?.minimumWorkinghours || "--"}
                                </p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">Salary Component</p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday?.values
                                    ?.salaryComponent || "--"}
                                </p>
                              </div>
                              {item.workRules.attendanceOnHoliday?.values
                                ?.salaryMultiplier && (
                                <div className="flex flex-col gap-0.5">
                                  <p className="text-grey">Salary Multiplier</p>
                                  <p className="font-medium">
                                    {item.workRules.attendanceOnHoliday?.values
                                      ?.salaryMultiplier + "x" || "--"}
                                  </p>
                                </div>
                              )}
                            </>
                          ) : item.workRules.attendanceOnHoliday?.Type ===
                            "comboOff" ? (
                            <>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">Type</p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday?.Type ||
                                    "--"}
                                </p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">
                                  Maximum Working Hours
                                </p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday
                                    ?.maximumWorkinghours || "--"}
                                </p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">
                                  Minimum Working Hours
                                </p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday
                                    ?.minimumWorkinghours || "--"}
                                </p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">Full Day</p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday?.values
                                    ?.fullDay || "--"}
                                </p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">Half Day</p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday?.values
                                    ?.halfDay || "--"}
                                </p>
                              </div>
                            </>
                          ) : item.workRules.attendanceOnHoliday?.Type ===
                            "overtime" ? (
                            <>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">Type</p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday?.Type ||
                                    "--"}
                                </p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">
                                  Maximum Working Hours
                                </p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday
                                    ?.maximumWorkinghours || "--"}
                                </p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">
                                  Minimum Working Hours
                                </p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday
                                    ?.minimumWorkinghours || "--"}
                                </p>
                              </div>
                              {item.workRules.attendanceOnHoliday?.values?.map(
                                (value, index) => (
                                  <>
                                    {value?.amount && (
                                      <div className="flex flex-col gap-0.5">
                                        <p className="text-grey">Amount</p>
                                        <p className="font-medium">
                                          {value?.amount || "--"}
                                        </p>
                                      </div>
                                    )}
                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">Minutes</p>
                                      <p className="font-medium">
                                        {value?.minutes || "--"}
                                      </p>
                                    </div>
                                    {value?.salaryComponent && (
                                      <div className="flex flex-col gap-0.5">
                                        <p className="text-grey">
                                          Salary Component
                                        </p>
                                        <p className="font-medium">
                                          {value?.salaryComponent || "--"}
                                        </p>
                                      </div>
                                    )}
                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">Type</p>
                                      <p className="font-medium">
                                        {value?.type || "--"}
                                      </p>
                                    </div>
                                    {value?.salaryMultiplyer && (
                                      <div className="flex flex-col gap-0.5">
                                        <p className="text-grey">
                                          Salary Multiplier
                                        </p>
                                        <p className="font-medium">
                                          {value?.salaryMultiplyer + "x" ||
                                            "--"}
                                        </p>
                                      </div>
                                    )}
                                  </>
                                )
                              )}
                            </>
                          ) : item.workRules.attendanceOnHoliday?.Type ===
                            "doNotConsider" ? (
                            <>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">Type</p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday?.Type ||
                                    "--"}
                                </p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">
                                  Maximum Working Hours
                                </p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday
                                    ?.maximumWorkinghours || "--"}
                                </p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-grey">
                                  Minimum Working Hours
                                </p>
                                <p className="font-medium">
                                  {item.workRules.attendanceOnHoliday
                                    ?.minimumWorkinghours || "--"}
                                </p>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  item?.workRuleType === "6" && (
                    <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4 py-3 dark:text-slate-400 flex flex-col gap-2">
                      <div>
                        <p className="font-medium text-xs 2xl:text-sm">
                          If Miss punch occurs more than
                        </p>
                      </div>

                      <div className="border-t">
                        <div className="mt-3">
                          {item?.workRules?.missPunch?.rule?.map(
                            (each, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-xs 2xl:text-sm gap-4 p-2"
                              >
                                <div className="flex flex-col gap-0.5">
                                  <p className="text-grey">Time</p>
                                  <p className="font-medium">
                                    {each?.minutes || "--"} min
                                  </p>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <p className="text-grey">Deduction Type</p>
                                  <p className="font-medium">
                                    {each?.deductionType
                                      ?.replace(/([A-Z])/g, " $1")
                                      .charAt(0)
                                      .toUpperCase() +
                                      each?.deductionType
                                        ?.replace(/([A-Z])/g, " $1")
                                        .slice(1) || "--"}
                                  </p>
                                </div>
                                {each?.deductionType === "fixedAmount" ? (
                                  <div className="flex flex-col gap-0.5">
                                    <p className="text-grey">Amount</p>
                                    <p className="font-medium">
                                      AED {each?.amount || "--"}
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">
                                        Deduction Component
                                      </p>
                                      <p className="font-medium col-span-2">
                                        {each?.deductionComponent
                                          ?.replace(/([A-Z])/g, " $1")
                                          .charAt(0)
                                          .toUpperCase() +
                                          each?.deductionComponent
                                            ?.replace(/([A-Z])/g, " $1")
                                            .slice(1) || "--"}
                                      </p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                      <p className="text-grey">Days</p>
                                      <p className="font-medium">
                                        {each?.days
                                          ?.replace(/([A-Z])/g, " $1")
                                          .charAt(0)
                                          .toUpperCase() +
                                          each?.days
                                            ?.replace(/([A-Z])/g, " $1")
                                            .slice(1) || "--"}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          ) : (
            <p className="vhcenter p-5">
              {" "}
              <NoData />
            </p>
          )} */}
        </div>
      </ModalAnt>
      {/* )} */}
    </FlexCol>
  );
}
