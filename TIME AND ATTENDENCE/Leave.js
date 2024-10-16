import React, { useEffect, useState } from "react";
import API, { action } from "../Api";
import TableAnt from "../common/TableAnt";
import Add_leaveType from "./Leave/Add_leaveType";
import { useTranslation } from "react-i18next";
import ButtonClick from "../common/Button";
import axios from "axios";
import { motion } from "framer-motion";
import ModalPop from "../common/ModalPop";
import { Flex } from "antd";
import FlexCol from "../common/FlexCol";
import Heading from "../common/Heading";
import PopImg from "../../assets/images/EmpLeaveRequest.svg";
import { IoSettingsSharp } from "react-icons/io5";
import DrawerPop from "../common/DrawerPop";
import LeaveConfig from "./Leave/LeaveConfig";
import ModalAnt from "../common/ModalAnt";
import AssignLeaveTypes from "./Leave/AssignLeaveTypes";
import { leaveModal } from "../data";

const Leave = ({ Action = () => {} }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [openLeaveConfig, setOpenLeaveConfig] = useState(false);

  const [openPop, setOpenPop] = useState("");

  const handleClose = () => {
    setShow(false);
    setOpenPop("");
  };
  const handleShow = () => {
    setShow(true);
    setOpenPop("Configuration");
  };
  const [navigationValue, setNavigationValue] = useState(t("Leave"));
  const [updateId, setUpdateId] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));

  const [viewOpen, setViewOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [assignStep, setAssignStep] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState();
  const [leavetypes, setLeavetypes] = useState([]);

  const header = [
    {
      Leave: [
        {
          id: 1,
          title: t("Leave_Type"),
          value: "leaveType",
          bold: true,
          fixed: "left",
        },
        {
          id: 2,
          title: t("Description"),
          value: "description",
          width: "500px",
        },
        {
          id: 3,
          title: t("Employees"),
          value: "multiImage",
          multiImage: true,
          view: true,
        },

        // {
        //   id: 4,
        //   title: t("Created_On"),
        //   value: "createdOn",
        //   dataIndex: "createdOn",
        //   sorter: (a, b) => {
        //     const dateA = new Date(a.createdOn);
        //     const dateB = new Date(b.createdOn);
        //     return dateA.getTime() - dateB.getTime();
        //   },
        //   sortOrder: "ascent",
        // },
        {
          id: 5,
          title: t("Status"),
          value: "isActive",
          actionToggle: true,
          alterValue: "",
          key: "basicLeaveType",
          valueData: 0,
        },

        {
          id: 6,
          title: "",
          value: "action",
          fixed: "right",
          key: "basicLeaveType",
          valueData: 1,
          dotsVertical: true,
          width: 50,
          dotsVerticalContent: [
            {
              title: "Update",
              value: "updateLeave",
              customField: "employee",
            },
            {
              title: "Assign",
              value: "assign",
              customField: "employee",
            },
            {
              title: "Delete",
              value: "delete",
              confirm: true,
              // leaveKey: "2",
              key: true,
              keyData: "basicLeaveType",
              valueData: 2,
            },
          ],
        },
        // {
        //   id: 5,
        //   title: "",
        //   value: "",
        //   actionToggle: true,
        // },
      ],
    },
  ];

  // Call getList when the component mounts
  useEffect(() => {
    getList();
  }, []);

  const getList = async (callback) => {
    // console.log(API.GET_LEAVE_TYPES, companyId);
    try {
      const result = await action(API.GET_LEAVE_TYPES, {
        companyId: companyId,
      });

      setLeavetypes(
        result?.result?.map((each) => ({
          ...each,
          employeeName: each?.employee?.map((data) => data.firstName),
          name: each?.employee?.map((data) => data.firstName),
          multiImage: each?.employee?.map((data) => data.profilePicture),
          employeeId: each?.employee?.map((data) => data.employeeId),
        }))
      );

      // Execute the callback function if provided
      if (callback) {
        callback();
      }
    } catch (error) {
      console.error("Error fetching leave types:", error);
    }
  };

  // Assign Leave Types
  const getIDbasedleaveType = async (e) => {
    try {
      const result = await action(API.GET_LEAVE_TYPES_ID_BASED_RECORDS, {
        id: e,
      });
      // Set the fetched data to the state

      setFetchedData(result?.result || []);
      setViewOpen(true);
      // console.log("DATA", fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      console.log("Id", updateId);
    }
  };

  const [delLeavetypes, setdelLeavetypes] = useState([]);
  const delList = async (company) => {
    try {
      const result = await axios.post(
        API.HOST + API.DELETE_LEAVE_TYPES + "/" + updateId,
        { company } // Include the 'company' prop in the request payload if needed
      );

      setdelLeavetypes(result?.data?.tbl_leaveType);
    } catch (error) {}
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* {companyId ? (
      <>*/}
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        <Heading title={t("Leave")} description={t("leave_Description")} />

        {/* <Breadcrumbs
          items={breadcrumbItems}leavetypes
          description={t("leave_Description")}
        /> */}
        <div className="flex gap-2 sm:flex-row">
          <ButtonClick
            BtnType="default"
            handleSubmit={() => {
              setOpenLeaveConfig(true);
            }}
            icon={<IoSettingsSharp className="text-center text-primary" />}
            className={"flex justify-center gap-0"}
          ></ButtonClick>
          <ButtonClick
            buttonName={t(`Add ${navigationValue} Type`)}
            handleSubmit={() => {
              setShow(true);
            }}
            BtnType="Add"
          />
        </div>
      </div>
      <TableAnt
        data={leavetypes}
        header={header}
        actionID="leaveTypeId"
        updateApi={API.UPDATE_LEAVE_TYPES_STATUS}
        deleteApi={API.DELETE_LEAVE_TYPES}
        path="Leave"
        referesh={() => {
          getList();
        }}
        buttonClick={(e, company) => {
          // setUpdateId(e);
        }}
        deleteRecord={(e, company) => {
          // deleteRecord(e, company); // Pass the 'company' prop to deleteRecord
        }}
        viewOutside={true}
        viewClick={(e) => {
          getIDbasedleaveType(e);
        }}
        scroll={true}
        scrollXY={[1300, 300]}
        clickDrawer={(e, value, id, details) => {
          // console.log(e, value, id, details, "detailsdetails");
          setUpdateId(id);

          if (value === "assign") {
            setAssignStep(true);
          } else {
            // if (details?.employee?.length > 0) {
            setSelectedLeaveType(details);
            //   setAssignStep(true)
            // } else {
            handleShow();

            // }
          }
        }}
      />
      <ModalAnt
        isVisible={fetchedData && viewOpen ? true : false}
        onClose={() => setViewOpen(false)}
        // width="435px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
      >
        <div className="flex flex-col gap-5 md:w-[700px] 2xl:w-[553px] p-2 h-[80vh] 2xl:h-[642px] ">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-14 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
              <img src={PopImg} alt="Img" className="rounded-full w-[28px]" />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              Leave Policy View
            </p>
            <div className="m-auto">
              <p className="text-center text-xs 2xl:text-sm text-grey dark:text-gray-400">
                Manage unused leave, pay rates, including standard and
                conditional rates for different leave durations.
              </p>
            </div>
          </div>
          <div className="overflow-auto flex flex-col gap-3 pr-1.5">
            <div className="bg-[#F9F9F9] border dark:bg-[#0B1019]  rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2 ">
              <div className=" ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                  {leaveModal.map((each) => (
                    <div
                      className={`flex flex-col gap-2 text-xs 2xl:text-sm ${each?.className}`}
                    >
                      <p className="  text-grey">{each.title}</p>
                      <p className=" font-semibold ">
                        {fetchedData[each.value] || "----"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2 ">
              <div>
                <p className="font-medium text-xs 2xl:text-sm ">
                  Unused Leave Details
                </p>
              </div>
              <div className=" border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  <div className="flex flex-col gap-2  text-xs 2xl:text-sm">
                    <p className="text-grey ">Leave Rule</p>
                    <p className="font-semibold ">
                      {fetchedData?.unusedLeaveRule?.unusedleaveRuleType ||
                        "----"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2  text-xs 2xl:text-sm">
                    <p className="text-grey ">Carry Forward</p>
                    <p className="font-semibold ">
                      {fetchedData?.unusedLeaveRule?.rule.limit || "----"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg p-0 dark:text-slate-400 flex flex-col gap-2">
              <div className="borderbot">
                <p className="px-4 py-3 font-medium text-xs 2xl:text-sm">
                  Default Pay Rate
                </p>
              </div>
              <div className="px-4 py-3">
                <table className="w-full text-xs 2xl:text-sm border-collapse">
                  <thead>
                    <tr className="text-center">
                      <th
                        className="borderb text-grey py-2 font-medium"
                        rowSpan={2}
                      >
                        Pay Type
                      </th>
                      <th
                        className="borderb text-grey py-2 font-medium"
                        colSpan={3}
                      >
                        Calculation
                      </th>
                    </tr>
                    <tr className="text-center">
                      <th className="borderb text-grey py-2 font-medium">
                        Days
                      </th>
                      <th className="borderb text-grey py-2 font-medium">
                        Percentage Paid
                      </th>
                      <th className="borderb text-grey py-2 font-medium">
                        Salary Component
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      <td className="borderb py-2 font-semibold">
                        {fetchedData?.leavePayRate?.default?.payType || "----"}
                      </td>
                      <td className="borderb py-2 font-semibold">
                        {fetchedData?.leavePayRate?.default?.calculation
                          ?.days || "----"}
                      </td>
                      <td className="borderb py-2 font-semibold">
                        {fetchedData?.leavePayRate?.default?.calculation
                          ?.percentage || "----"}
                      </td>
                      <td className="borderb py-2 font-semibold">
                        {fetchedData?.leavePayRate?.default?.calculation
                          ?.salaryComponent || "----"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg p-0 dark:text-slate-400 flex flex-col gap-2">
              <div className="borderbot ">
                <p className="font-medium text-xs 2xl:text-sm px-4 py-3">
                  Conditional Pay Rate
                </p>
              </div>
              <div className="px-4 py-3">
                <table className=" w-full text-xs 2xl:text-sm overflow-x-auto">
                  <thead>
                    <tr className="text-center ">
                      <th
                        className="text-grey py-2 borderb font-medium"
                        rowSpan={2}
                      >
                        Minimum Days
                      </th>
                      <th
                        className="text-grey py-2 borderb font-medium"
                        rowSpan={2}
                      >
                        Pay Type
                      </th>
                      <th
                        className="text-grey py-2 borderb font-medium"
                        rowSpan={2}
                      >
                        Rule Type
                      </th>
                      <th
                        className="text-grey py-2 borderb font-medium"
                        colSpan={3}
                      >
                        Calculation
                      </th>
                    </tr>
                    <tr className="text-center ">
                      <th className="text-grey py-2 borderb font-medium">
                        Days
                      </th>
                      <th className="text-grey py-2 borderb font-medium">
                        Percentage Paid
                      </th>
                      <th className="text-grey py-2 borderb font-medium">
                        Salary Component
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchedData?.leavePayRate?.conditional?.map(
                      (item, index) => (
                        <tr className="text-center borderb" key={index}>
                          <td className="py-2 font-semibold borderb">
                            {item.minDays || "----"}
                          </td>
                          <td className="py-2 font-semibold borderb">
                            {item.payType || "----"}
                          </td>
                          <td className="py-2 font-semibold borderb">
                            {item.ruleType || "----"}
                          </td>
                          <td className="py-2 font-semibold borderb">
                            {item.calculation?.days || "----"}
                          </td>
                          <td className="py-2 font-semibold borderb">
                            {item.calculation?.percentagepaid || "----"}
                          </td>
                          <td className="py-2 font-semibold">
                            {item.calculation?.salaryComponent || "----"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2 ">
              <div>
                <p className="font-medium text-xs 2xl:text-sm ">
                  Leave Allowance Details
                </p>
              </div>

              <div className=" border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  <div className="flex flex-col gap-2  text-xs 2xl:text-sm">
                    <p className="text-grey ">Leave Days</p>
                    <p className="font-semibold ">
                      {fetchedData?.unusedLeaveRule?.rule.calculation.days ||
                        "----"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2  text-xs 2xl:text-sm">
                    <p className="text-grey ">Recurring Policy</p>
                    <p className="font-semibold ">
                      {fetchedData?.leaveLimitPer || "----"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2  text-xs 2xl:text-sm">
                    <p className="text-grey ">Calendar Days</p>
                    <p className="font-semibold ">
                      {fetchedData?.leaveDays || "----"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="bg-[#F9F9F9] border dark:bg-[#0B1019] rounded-lg px-4	py-3 dark:text-slate-400 flex flex-col gap-2 ">
                <div>
                  <p className="font-medium text-xs 2xl:text-sm ">
                    Pay Rate Details
                  </p>
                </div>

                <div className="flex flex-col gap-2 border-t">
                  <div className="flex flex-col gap-2 mt-3">
                    <div className="flex gap-2  text-xs 2xl:text-sm">
                      <p className="text-grey ">Default Pay Rate:</p>
                      <p className="font-semibold ">Paid Leave</p>
                    </div>
                    <div className="flex flex-col gap-2  text-xs 2xl:text-sm">
                      <p className="text-grey ">Conditional Pay Rate:</p>

                      <div className="flex justify-between items-center">
                        <p className="text-grey">
                          1 Between{" "}
                          <span className="text-black dark:text-white font-semibold">
                            10
                          </span>{" "}
                          and{" "}
                          <span className="text-black dark:text-white font-semibold">
                            20 days
                          </span>{" "}
                        </p>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-primaryalpha/5 rounded-full px-2 py-0.5">
                          Paid Leave
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-grey">
                          2 Greater than{" "}
                          <span className="text-black dark:text-white font-semibold">
                            20 days
                          </span>{" "}
                        </p>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-primaryalpha/5 rounded-full px-2 py-0.5">
                          Paid Leave
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-grey">
                          3 Between{" "}
                          <span className=" text-black dark:text-white font-semibold">
                            10{" "}
                          </span>{" "}
                          and{" "}
                          <span className=" text-black dark:text-white font-semibold">
                            20 days
                          </span>{" "}
                        </p>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-primaryalpha/5 rounded-full px-2 py-0.5">
                          Paid Leave
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
          </div>
        </div>
      </ModalAnt>

      {/* </>
    // ) : (
    //   <CompanyCard
    //     CompanyID={(id) => {
    //       setCompanyId(id);
    //       console.log(id, "CompanyIdUpdates");
    //     }}
    //     path={["Setting", "Company"]}
    //   />
    // )} */}

      {openLeaveConfig && (
        <LeaveConfig
          open={openLeaveConfig}
          close={(e) => {
            setOpenLeaveConfig(e);
          }}
        />
      )}

      {show && (
        <Add_leaveType
          open={show}
          close={(e) => {
            getList();
            setShow(e);
            setUpdateId(null);
            handleClose();
          }}
          // updateId={updateId}
          refresh={() => {
            getList();
          }}
          openPolicy={openPop}
          updateId={updateId}
          assignStep={assignStep}
        />
      )}

      {assignStep && (
        <AssignLeaveTypes
          open={assignStep}
          close={(e) => {
            setAssignStep(false);
            getList();
            setUpdateId(null);
          }}
          // openPolicy={openPop}
          updateId={updateId}
          // assignStep={assignStep}
        />
      )}
    </div>
  );
};

export default Leave;
