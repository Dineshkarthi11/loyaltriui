import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonClick from "../../common/Button";
import Heading from "../../common/Heading";
import CreateNewRole from "../CreateNewRole";
import { useFormik } from "formik";
import * as yup from "yup";
import TabsNew from "../../common/TabsNew";
import TableAnt from "../../common/TableAnt";
import API, { action } from "../../Api";
import AssignUserRole from "../AssignUserRole";
import { AttendenceAccess } from "../../data";
import { BiSolidLayer } from "react-icons/bi";
import { HiUsers } from "react-icons/hi2";

import Biometric from "../../../assets/images/userPrivileges/Biometric.png";
import Approval from "../../../assets/images/userPrivileges/Approval.png";
import GeoFencing from "../../../assets/images/userPrivileges/GeoFencing.png";
import Normal from "../../../assets/images/userPrivileges/Normal.png";
import QrCode from "../../../assets/images/userPrivileges/QrCode.png";
import Selfie from "../../../assets/images/userPrivileges/Selfie.png";
import NotRequired from "../../../assets/images/userPrivileges/NotRequired.png";
import WebPunch from "../../../assets/images/userPrivileges/WebPunch.png";

import AccessList from "./AccessList";
import UserList from "./UserList";
import BiometricSettings from "./BiometricSettings";
import AccessSettings from "./AccessSettings";
import { getEmployeeList } from "../../common/Functions/commonFunction";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function UserPrivileges() {
  const { t } = useTranslation();
  const [updateId, setUpdateId] = useState("");
  const [clickDeatils, setClickDeatils] = useState({});
  const [updateUserId, setUpdateUserId] = useState("");
  const [activerole, setActiverole] = useState("RolesManagement");
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showAccessList, setShowAccessList] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showBiometricSettings, setShowBiometricSettings] = useState(false);
  const [rowDetails, setRowDetails] = useState(null);
  const [privileges, setPrivileges] = useState([]);
  const [userList, setUserList] = useState([]);
  const [navigationInsidePath, setNavigationInsidePath] =
    useState("Access_List");
  const [navigationInsidePath2, setNavigationInsidePath2] =
    useState("Roles_History");
  const [accessListData, setAccessListData] = useState([]);
  const [UseListData, setUseListData] = useState([]);

  const handleShow = () => {
    setShow(true);
  };

  const [navigationPath, setNavigationPath] = useState("RolesManagement");
  const [navigationValue, setNavigationValue] = useState(t("Roles_Management"));

  const navigateBtn = [
    {
      id: 1,
      value: "RolesManagement",
      title: t("Roles_Management"),
      navValue: t("Roles_Management"),
    },
    {
      id: 2,
      value: "AttendanceAccess",
      title: t("Attendance_Access"),
      navValue: t("Attendance_Access"),
    },
    {
      id: 3,
      value: "AccessSettings",
      title: t("Access_Settings"),
      navValue: t("Access_Settings"),
    },
  ];

  const RolesManagementHeader = [
    {
      Roles_History: [
        {
          id: 1,
          title: t("Roles"),
          value: "roleName",
          bold: true,
        },
        {
          id: 2,
          title: t("Employees"),
          value: "multiImage",
          multiImage: true,
          view: true,
        },
        {
          id: 3,
          title: t("Status"),
          value: "isActive",
          actionToggle: true,
        },
        {
          id: 4,
          title: t("Action"),
          value: "",
          customaction: true,
          isDelete: true,
          width: 100,
        },
      ],
      Users_History: [
        {
          id: 1,
          title: t("Employees"),
          value: "employeeName",
          bold: true,
        },
        {
          id: 2,
          title: t("Roles"),
          value: "roles",
          flexValue: "roleName",
          flexRow: true,
        },
        // {
        //   id: 3,
        //   title: t("Status"),
        //   value: "isActive",
        //   actionToggle: true,
        // },
        {
          id: 4,
          title: t(""),
          value: "",
          action: true,
          hideIcon: "delete",
          width: 50,
        },
      ],
    },
  ];

  const getPunchMethod = async () => {
    try {
      const result = await action(API.GET_PUNCH_METHOD, {
        companyId: companyId,
        isActive: 1,
      });

      setAccessListData(
        result.result?.map((each) => ({
          id: each.punchMethodId,
          access: each.punchMethod,
          employeeName: each.employee?.map((data) => data.firstName),
          logo:
            each.punchMethodId === 1
              ? NotRequired
              : each.punchMethodId === 2
              ? WebPunch
              : each.punchMethodId === 3
              ? Selfie
              : each.punchMethodId === 4
              ? GeoFencing
              : each.punchMethodId === 5
              ? Normal
              : each.punchMethodId === 6
              ? QrCode
              : each.punchMethodId === 7
              ? Biometric
              : each.punchMethodId === 8 && Approval,
          name: each.employee?.map((data) => data.employeeName),
          multiImage: each.employee?.map((data) => data.profilePicture),
          employeeId: each.employee?.map((data) => data.employeeId),
          // image: "eeeeeeeee",
          isActive: each.isActive,
          button: 1,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getEmployee = async () => {
    try {
      const result = await getEmployeeList();
      setUseListData(
        result?.map((each) => ({ ...each, logo: each.profilePicture }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getRoleList = async (callback) => {
    try {
      const result = await action(API.GET_ALL_ROLELIST, {
        id: companyId,
      });

      // Map roles array from the API response to match Rolelistheader structure
      const data = result?.result || [];

      const modifiedData = data.map((rolelist) => {
        const employeeName = rolelist.employees?.map(
          (data) => data.employeeName
        );
        const profilePicture = rolelist.employees?.map(
          (data) => data.profilePicture
        );
        const employeeId = rolelist.employees?.map((data) => data.employeeId);
        const roleId = rolelist.roleId;
        console.log(roleId, "roleeee id daataa");
        return {
          roleId: rolelist.roleId,
          roleName: rolelist.roleName,
          multiImage: profilePicture,
          name: employeeName,
          employeeName: employeeName,
          employeeId: employeeId,
          isActive: rolelist.isActive,
          isDelete: rolelist.isDelete,
        };
      });

      setPrivileges(modifiedData);

      // Execute the callback function if provided
      if (callback) {
        callback();
      }
    } catch (error) {
      console.error("Error fetching leave types:", error);
    }
    <div className="flex"></div>;
  };

  const getUserRoleList = async (callback) => {
    try {
      const result = await action(API.GET_ALL_USERLIST, {
        id: companyId,
      });

      const data = result?.result || [];
      const modifiedData = data.map((employeelist) => {
        const roles = employeelist.roles || [];
        const formattedRoles = roles.reduce((acc, role, index) => {
          acc[`role${index + 1}`] = role.roleName;
          return acc;
        }, {});
        return {
          employeeId: employeelist?.employeeId,
          employeeName: employeelist?.employeeName,
          roles: roles,
          isActive: employeelist?.isActive,
          code: employeelist?.code,
          ...formattedRoles,
        };
      });

      setUserList(modifiedData);

      if (callback) {
        callback();
      }
    } catch (error) {
      console.error("Error fetching leave types:", error);
    }
  };

  useEffect(() => {
    getRoleList();
    getUserRoleList();
    getPunchMethod();
    getEmployee();
  }, []);

  const actionData = [
    {
      Roles_History: { id: 1, data: privileges },
      Users_History: { id: 2, data: userList },
      Access_List: { id: 3, data: accessListData },
      Users_List: { id: 4, data: UseListData }, //AttendenceUserData  UseListData
    },
  ];
  const actionId = [
    {
      Roles_History: { id: "roleId" },
      Users_History: { id: "employeeId" },
      Access_List: { id: "id" },
      Users_List: { id: "employeeId" },
    },
  ];
  const updateApi = [
    {
      Roles_History: { id: 1, api: API.TOGGLE_UPDATE },
      Users_History: { id: 2, api: API.TOGGLE_USER_UPDATE },
    },
  ];

  const deleteApi = [
    {
      Roles_History: { id: 1, api: API.DELETE_ROLE_RECORD },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <div>
          <Heading
            title="User Privileges"
            description="Establishing roles and delegating responsibilities"
          />
        </div>
        {activerole === "RolesManagement" && (
          <div className="gap-4 ">
            <ButtonClick
              buttonName={t("Create_New_Role")}
              handleSubmit={() => {
                setShow(true);
                console.log(true);
              }}
              BtnType="add"
            />
          </div>
        )}
      </div>

      <TabsNew
        tabs={navigateBtn}
        navigationValue={navigationValue}
        tabClick={(e) => {
          setActiverole(e);
        }}
        path={navigationPath}
        tabChange={(e) => {
          setNavigationValue(e);
        }}
      />

      {activerole === "RolesManagement" ? (
        <TableAnt
          path={navigationInsidePath2}
          header={RolesManagementHeader}
          handleTabChange={(e) => {
            setNavigationInsidePath2(e, "ggggggggggg");
          }}
          data={
            Object.keys(actionData[0]).includes(navigationInsidePath2)
              ? actionData[0]?.[navigationInsidePath2].data
              : null
          }
          actionID={
            Object.keys(actionId[0]).includes(navigationInsidePath2)
              ? actionId[0]?.[navigationInsidePath2].id
              : null
          }
          updateApi={
            Object.keys(updateApi[0]).includes(navigationInsidePath2)
              ? updateApi[0]?.[navigationInsidePath2].api
              : null
          }
          deleteApi={
            Object.keys(deleteApi[0]).includes(navigationInsidePath2)
              ? deleteApi[0]?.[navigationInsidePath2].api
              : null
          }
          showDeleteIcon={true}
          buttons={[
            {
              title: t("Role_List"),
              icon: <BiSolidLayer className=" " />,
              className: " border-primary font-semibold ",
              value: "Roles_History",
              active: navigationInsidePath2 === "Roles_History" ? true : false,
            },
            {
              title: t("Users_List"),
              icon: <HiUsers className=" " />,
              className: " border-primary font-semibold ",
              value: "Users_History",
              active: navigationInsidePath2 === "Users_History" ? true : false,
            },
          ]}
          referesh={() => {
            switch (navigationInsidePath2) {
              default:
                getRoleList();
                break;
              case "Users_History":
                getUserRoleList();
                break;
            }
          }}
          clickDrawer={(e, details, j, k) => {
            if (navigationInsidePath2 === "Roles_History") {
              setUpdateId(details.roleId);
              handleShow();
            } else {
              setUpdateUserId(details.employeeId);
              setShowUser(e);
              setRowDetails(details);
            }
          }}
        />
      ) : activerole === "AttendanceAccess" ? (
        <TableAnt
          path={navigationInsidePath}
          header={AttendenceAccess}
          handleTabChange={(e) => {
            setNavigationInsidePath(e, "ggggggggggg");
          }}
          data={
            Object.keys(actionData[0]).includes(navigationInsidePath)
              ? actionData[0]?.[navigationInsidePath].data
              : null
          }
          actionID={
            Object.keys(actionId[0]).includes(navigationInsidePath)
              ? actionId[0]?.[navigationInsidePath].id
              : null
          }
          buttons={[
            {
              title: "Access List",
              icon: <BiSolidLayer className=" " />,
              className: " border-primary font-semibold ",
              value: "Access_List",
              active: navigationInsidePath === "Access_List" ? true : false,
            },
            {
              title: "Users List",
              icon: <HiUsers className=" " />,
              className: " border-primary font-semibold ",
              value: "Users_List",
              active: navigationInsidePath === "Users_List" ? true : false,
            },
          ]}
          clickDrawer={(e, id, deatils, buttonName) => {
            setClickDeatils(deatils);
            setUpdateId(id);
            if (navigationInsidePath === "Access_List") {
              if (buttonName === "Settings") {
                setShowBiometricSettings(e);
              } else {
                setShowAccessList(e);
              }
            } else {
              setShowUserList(e);
            }
          }}
          viewOutside={true}
        />
      ) : (
        activerole === "AccessSettings" && <AccessSettings />
      )}

      {show && (
        <CreateNewRole
          open={show}
          close={(e) => {
            setUpdateId(null);
            setShow(false);
            getRoleList();
            getUserRoleList();
          }}
          refresh={() => {}}
          updateId={updateId}
        />
      )}
      {showUser && (
        <AssignUserRole
          open={showUser}
          close={(e) => {
            getUserRoleList();
            setShowUser(e);
            setUpdateId(null);
          }}
          refresh={() => {
            getUserRoleList();
          }}
          data={rowDetails}
          updateId={updateUserId}
        />
      )}
      {/* Attendance Access ->  Access List -> Assign (Attendence Access)*/}
      {showAccessList && (
        <AccessList
          open={showAccessList}
          close={() => {
            setShowAccessList(false);
            getPunchMethod();
          }}
          updateId={updateId}
        />
      )}
      {/* Attendance Access ->  Access List -> settings (Punch device) */}
      {showBiometricSettings && (
        <BiometricSettings
          open={showBiometricSettings}
          close={() => {
            setShowBiometricSettings(false);
          }}
          updateId={updateId}
        />
      )}
      {/* Attendance Access -> Users List -> Edit Acess (Assign attendence Methods)*/}
      {showUserList && (
        <UserList
          open={showUserList}
          close={() => {
            setShowUserList(false);
            getEmployee();
          }}
          updateId={updateId}
          data={clickDeatils}
        />
      )}
    </div>
  );
}
