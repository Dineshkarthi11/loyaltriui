import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { myAttendenceHeaderList } from "../../data";
import { DatePicker, Flex } from "antd";
import FlexCol from "../../common/FlexCol";
import Regularize from "./Regularize";
import API, { action } from "../../Api";
import Heading from "../../common/Heading";
import Tabs from "../../common/Tabs";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function MyAttendance({ employee }) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [updateId, setUpdateId] = useState();

  const [myAttendence, setMyAttendence] = useState([]);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(
    employee || localStorageData.employeeId
  );
  const [monthAndyear, setMonthAndYear] = useState();
  const [navigationPath, setNavigationPath] = useState("attendance");
  const [excusesList, setExcusesList] = useState([]);

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
    setEmployeeId(employee);
  }, [employee]);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const getMyAttendence = async () => {
    try {
      const result = await action(API.GET_MY_ATTENDENCE, {
        employeeId: employeeId,
        neededYearAndMonth: monthAndyear || null,
        companyId: companyId,
      });
      if (result.status === 200) {
        setMyAttendence(result.result);
      } else {
        setMyAttendence([]);
      }
    } catch (error) {
      openNotification("error", "Failed..", error.code);
    }
  };

  useEffect(() => {
    getMyAttendence();
  }, [monthAndyear]);

  const { MonthPicker } = DatePicker;

  const tabs = [
    {
      id: 1,
      title: t("Report"),
      value: "attendance",
    },
    {
      id: 2,
      title: t("Regularizations"),
      value: "regularizations",
    },
  ];

  const actionId = [
    {
      attendance: { id: "employeeDailyAttendanceId" },
      regularizations: { id: "Regularizations" },
    },
  ];
  const actionData = [
    {
      attendance: { id: 1, data: myAttendence },
      regularizations: { id: 2, data: excusesList },
    },
  ];
  const getExcuse = async () => {
    const result = await action(API.GET_REQULARIZE, {
      neededYearAndMonth: monthAndyear,
      employeeId: employeeId,
    });
    if (result.status === 200) {
      setExcusesList(result.result);
    } else {
      setExcusesList([]);
    }
  };

  useEffect(() => {
    getExcuse();
  }, [monthAndyear]);

  return (
    <FlexCol>
      <Flex justify="space-between">
        <Heading
          title={t("My Attendance")}
          description={t("Manage_Leaves_Types_Description")}
        />
      </Flex>
      <Tabs
        tabs={tabs}
        // data={companyList}
        header={myAttendenceHeaderList}
        tabClick={(e) => {
          console.log(e, "e");
          setNavigationPath(e);
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
        inputType={[
          {
            id: 1,
            type: (
              <MonthPicker
                picker="month"
                className={" w-36"}
                onChange={(e, i) => {
                  setMonthAndYear(i);
                  console.log(i);
                }}
              />
            ),
          },
        ]}
        clickDrawer={(e, id) => {
          setUpdateId(id);
          setShow(e);
        }}
      />

      <Regularize
        open={show}
        close={() => {
          setShow(false);
        }}
        employeeId={employeeId}
        updateId={updateId}
      />
    </FlexCol>
  );
}
