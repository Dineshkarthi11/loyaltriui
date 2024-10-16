import React, { useEffect, useState } from "react";
import axios from "axios";
import ShiftImage from "../../../../assets/images/Add_shift.png";
import AddShift from "./AddShift";
import { Flex, Select, notification } from "antd";
import Button from "../../../common/Button";
import API, { action } from "../../../Api";
import Breadcrumbs from "../../../common/BreadCrumbs";
import Tabs from "../../../common/Tabs";
import AddShiftScheme from "./AddShiftScheme";
import { useTranslation } from "react-i18next";
import ButtonClick from "../../../common/Button";
import FlexCol from "../../../common/FlexCol";
import TableAnt from "../../../common/TableAnt";
import Heading from "../../../common/Heading";
import { useNotification } from "../../../../Context/Notifications/Notification";

export default function Shift() {
  // const { companyId } = useParams();
  const { t } = useTranslation();
  const [navigationPath, setNavigationPath] = useState("shift");
  const [navigationValue, setNavigationValue] = useState(t("Shift"));
  const [leaveTypeList, setLeaveTypeList] = useState();
  const [shiftList, setShiftList] = useState();
  const [shiftSchemaList, setShiftSchemaList] = useState();
  const [shift, setShift] = useState([]);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [updateId, setUpdateId] = useState("");
  const [show, setShow] = useState(false);
  const [openPop, setOpenPop] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [active, setactive] = useState();

  const splitTitle = navigationPath.split("_");
  const jsonResult = splitTitle
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const breadcrumbItems = [
    { label: t("Settings"), url: "" },
    { label: t("Time_and_attendence"), url: "" },
    { label: navigationValue, url: "" },
  ];

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

  const header = [
    {
      //   leaveTypes: [
      //     // {
      //     //   id: 1,
      //     //   title: "LeaveType",
      //     //   value: "leaveType",
      //     // },
      //     {
      //       id: 1,
      //       title: "Description",
      //       value: "description",
      //     },
      //     {
      //       id: 2,
      //       title: "Action",
      //       value: "",
      //       action: true,
      //     },
      //   ],
      shift: [
        {
          id: 1,
          title: t("Shift"),
          value: "shift",
          bold: true,
        },
        {
          id: 2,
          title: t("Session"),
          value: "session",
          // bold: true,
        },
        {
          id: 3,
          title: t("Shift_Type"),
          value: "shiftType",
          // bold: true,
        },
        {
          id: 4,
          title: t("Start_Time"),
          value: "startTime",
          // block: true,
        },
        {
          id: 5,
          title: t("End_Time"),
          value: "endTime",
          // block: true,
        },
        {
          id: 6,
          title: t("Work_Hours"),
          value: "workHours",
          // block: true,
        },
        // {
        //   id: 7,
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
          id: 7,
          title: t("Half_Time"),
          value: "halfTime",
          // block: true,
        },
        {
          id: 8,
          title: t("Status"),
          value: "isActive",
          actionToggle: true,
        },
        {
          id: 9,
          title: t("Action"),
          value: "",
          action: true,
        },
      ],
      shift_Scheme: [
        {
          id: 1,
          title: t("Shift_Schemes"),
          value: "shiftScheme",
          bold: true,
        },
        {
          id: 2,
          title: t("Shift Scheme Type"),
          value: "shiftSchemeType",
        },
        {
          id: 3,
          title: t("Shift"),
          value: "shiftDatas",
          flexValue: "shift",
          flexRow: true,
        },
        {
          id: 4,
          title: t("Description"),
          value: "description",
        },
        {
          id: 5,
          title: t("Employees"),
          value: "multiImage",
          multiImage: true,
          view: true,
        },
        // {
        //   id: 4,
        //   title: 'Created On',
        //   value: 'createdOn',
        //   dataIndex: 'createdOn',
        //   sorter: (a, b) => {
        //     const dateA = new Date(a.createdOn)
        //     const dateB = new Date(b.createdOn)
        //     return dateA.getTime() - dateB.getTime()
        //   },
        //   sortOrder: 'ascent'
        // },
        {
          id: 6,
          title: t("Action"),
          value: "",
          action: true,
        },
      ],
    },
  ];
  const tabs = [
    {
      id: 1,
      title: t("Shift"),
      value: "shift",
      navValue: "Shift",
    },
    {
      id: 2,
      title: t("Shift_Scheme"),
      value: "shift_Scheme",
      navValue: "Shift Scheme",
    },
  ];

  const actionData = [
    {
      //   leaveTypes: { id: 1, data: leaveTypeList },
      shift: { id: 2, data: shiftList },
      shift_Scheme: { id: 3, data: shiftSchemaList },
    },
  ];
  const actionId = [
    {
      //   leaveTypes: { id: "leaveTypeId" },
      shift: { id: "shiftId" },
      shift_Scheme: { id: "shiftSchemeId" },
    },
  ];
  const updateApi = [
    {
      //   leaveTypes: { id: 1, api: API.UPDATE_LEAVE_TYPES },
      shift: { id: 2, api: API.UPDATE_SHIFT_STATUS },
      shift_Scheme: { id: 3, api: API.UPDATE_SHIFT_SCHEME },
    },
  ];
  const deleteApi = [
    {
      //   leaveTypes: { id: 1, api: API.DELETE_LEAVE_TYPES },
      shift: { id: 2, api: API.DELETE_SHIFT },
      shift_Scheme: { id: 3, api: API.DELETE_SHIFT_SCHEME },
    },
  ];
  const getShift = async () => {
    const result = await action(API.GET_SHIFT_RECORDS, {
      companyId: companyId,
    });
    setShift(
      result.result?.map((each) => ({
        label: each.shift,
        value: each.shiftId,
        color: each.shiftColor,
      }))
    );
    // result.data.tbl_shift?.map((each) =>
    //   shift.push({
    //     label: each.shift,
    //     value: each.shiftId,
    //     color: each.shiftColor,
    //   })
    // );
  };
  const getLeaveTypesList = async () => {
    const result = await axios.post(
      API.HOST + API.GET_LEAVE_TYPES + "/" + companyId
    );
    setLeaveTypeList(result.data.tbl_leaveType);
  };
  const getShiftList = async () => {
    const result = await action(API.GET_SHIFT_RECORDS, {
      companyId: companyId,
    });
    setShiftList(
      result?.result.map((each) => ({
        session: each?.isNightShift === "0" ? "Morning" : "Night",
        ...each,
      }))
    );
  };
  const getShiftSchemaList = async () => {
    const result = await action(
      API.GET_SHIFT_SCHEME,
      { companyId: companyId }
      // 'http://192.168.0.44:82/loyaltri-server/api/main'
    );
    setShiftSchemaList(
      result?.result?.map((each) => ({
        ...each,
        employeeName: each.employee?.map((data) => data.employeeName),
        name: each.employee?.map((data) => data.employeeName),
        multiImage: each.employee?.map((data) => data.profilePicture),
        employeeId: each.employee?.map((data) => data.employeeId),
      }))
    );
  };
  useEffect(() => {
    switch (navigationPath) {
      default:
        getLeaveTypesList();
        break;
      case "shift":
        getShiftList();
        break;
      case "shift_Scheme":
        // getShift()
        getShiftSchemaList();
        break;
    }
  }, [navigationPath, companyId]);
  return (
    <div className="flex flex-col gap-6">
      {/* {companyId ? (
        <> */}
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        <div>
          {/* <Breadcrumbs
            items={breadcrumbItems}
            description={t("Shift_Main_Dec")}
          /> */}
          <Heading title={t("Shift")} description={t("Shift_Main_Dec")} />
        </div>
        <div className="flex flex-col gap-6 sm:flex-row">
          <Button
            handleSubmit={
              () => {
                // console.log("show");
                handleShow();
                // if (e === navigationPath) {
                // setShow(true);

                // setCompanyId(company);
                setOpenPop(navigationPath);
                setUpdateId(null);
                // } else {
                // setOpenPop(navigationPath);

                setShow(true);
                // console.log(company, "companyparentId");
                // if (company === "edit") {
                // setUpdateId(e);
                // }
              }
              // buttonClick(btnName, companyData.companyId);
            }
            // updateFun=""
            // updateBtn={true} // Set to true if it's an update button
            buttonName={`Create ${navigationValue}`} // Set the button name
            className="your-custom-styles" // Add any additional class names for styling
            BtnType="Add" // Specify the button type (Add or Update)
          />
        </div>
      </div>
      <Tabs
        tabs={tabs}
        // data={companyList}
        header={header}
        navigationValue={navigationValue}
        tabClick={(e) => {
          // console.log(e, "e");
          setNavigationPath(e);
        }}
        tabChange={(e) => {
          setNavigationValue(e);
        }}
        data={
          Object.keys(actionData[0]).includes(navigationPath)
            ? actionData[0]?.[navigationPath].data
            : null
        }
        // actionToggle={true}
        actionID={
          Object.keys(actionId[0]).includes(navigationPath)
            ? actionId[0]?.[navigationPath].id
            : null
        }
        // path={["Settings", "Company"]}
        // companyList={false}
        buttonClick={(e, company) => {
          console.log(company, "company", e);
          if (e === true) {
            // setShow(e);
          } else if (e === navigationPath) {
            // setShow(true);

            // setCompanyId(company);
            setOpenPop(e);
            setUpdateId(null);
          } else {
            setOpenPop(navigationPath);

            setShow(true);
            // console.log(company, "companyparentId");
            // if (company === "edit") {
            setUpdateId(e);
            // }
          }
        }}
        clickDrawer={(e) => {
          handleShow();
        }}
        navigationClick={(e) => {
          setNavigationPath(e);
        }}
        activeOrNot={(e) => {
          setactive(e);
        }}
        updateApi={
          Object.keys(updateApi[0]).includes(navigationPath)
            ? updateApi[0]?.[navigationPath].api
            : null
        }
        deleteApi={
          Object.keys(deleteApi[0]).includes(navigationPath)
            ? deleteApi[0]?.[navigationPath].api
            : null
        }
        referesh={() => {
          switch (navigationPath) {
            default:
              getLeaveTypesList();
              break;
            case "shift":
              getShiftList();
              break;
            case "shift_Scheme":
              getShift();
              getShiftSchemaList();
              break;
          }
        }}
      />
      {/* </>
      ) : (
        <CompanyCard
          CompanyID={(id) => {
            setCompanyId(id);
            console.log(id);
          }}
          path={["Setting", "Payroll"]}
        />
      )} */}
      {/* {openPop === "leaveTypes" && show && (
        <AddLeaveType
          open={show}
          close={(e) => {
            setShow(e);
          }}
          updateId={updateId}
          companyDataId={companyId}
          refresh={() => {
            getLeaveTypesList();
          }}
          notification={(type, title, message) => {
            console.log(type, title, message);
            openNotification(type, title, message);
          }}
          // shiftList={shift}
        />
      )} */}
      {openPop === "shift" && show && (
        <AddShift
          open={show}
          close={(e) => {
            getShiftList();
            setShow(e);
          }}
          updateId={updateId}
          companyDataId={companyId}
          refresh={() => {
            getShiftList();
          }}

          // shiftList={shift}
        />
      )}
      {openPop === "shift_Scheme" && show && (
        <AddShiftScheme
          open={show}
          close={(e) => {
            getShiftSchemaList();
            setShow(e);
          }}
          shiftList={shift}
          updateId={updateId}
          companyDataId={companyId}
          refresh={() => {
            getShiftSchemaList();
          }}
        />
      )}
    </div>
  );
}
