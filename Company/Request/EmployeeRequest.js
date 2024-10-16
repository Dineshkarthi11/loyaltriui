import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../common/Heading";

import DateSliderPicker from "../../common/DatePickerSlide";
import TabsNew from "../../common/TabsNew";
import Excuses from "./Excuses";
import Overtime from "./Overtime";
import PunchApproval from "./PunchApproval";
import WorkFromHome from "./WorkFromHome";
import LetterRequests from "./LetterRequests";
import { Alert } from "antd";
import { useLocation } from "react-router-dom";
import API, { action } from "../../Api";
import { count } from "d3";
import localStorageData from "../../common/Functions/localStorageKeyValues";

function EmployeeRequest() {
  const { t } = useTranslation();
  const [monthAndyear, setMonthAndYear] = useState();
  const [openBendingApproval, setOpenBendingApproval] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [specialRequestId, setspecialRequestId] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const dateFormater = (data) => {
    const date = !data ? new Date() : data;
    console.log(data);

    const year = date?.getFullYear();
    const month = String(date?.getMonth() + 1).padStart(2, "0");

    // Create the YYYY-MM-DD format
    const formattedDate = `${year}-${month}`;
    return formattedDate;
  };
  const [requestEmployeeId, setRequestEmployeeId] = useState("");
  const [data, setData] = useState("");
  const location = useLocation();
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [tabValue, setTabValue] = useState("all");

  const [excusesCount, setExcusesCount] = useState(0);
  const [overTimeCount, setOverTimeCount] = useState(0);
  const [punchApprovalCount, setPunchApprovalCount] = useState(0);
  const [workFromHomeCount, setWorkFromHomeCount] = useState(0);
  const [LetterRequestCount, setLetterRequestCount] = useState(0);

  const [excusesEmployeeList, setExcusesEmployeeList] = useState(null);
  const [overTimedata, setOverTimeData] = useState([]);
  const [punchApprovalData, setpunchApprovalData] = useState([]);
  const [workFromHomeData, setWorkFromHomeData] = useState([]);
  const [letterRequest, setLetterRequest] = useState([]);

  useEffect(() => {
    setMonthAndYear(dateFormater(new Date()));
  }, []);

  useEffect(() => {
    if (location.state && location.state.data) {
      setData(location.state.data);
    }

    const handleBeforeUnload = () => {
      window.history.replaceState({}, document.title);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.state]);
  useEffect(() => {
    if (data) {
      const typeToTabMap = {
        Excuses: 1,
        "Punch Approval": 3,
        "Work From Home": 4,
        "Letter Request": 5,
      };
      const initialTab = typeToTabMap[data.Type] || 1;
      setActiveTab(initialTab);
      setRequestEmployeeId(data?.employeeId);
      setspecialRequestId(data?.specialRequestId);
    }
  }, [data]);
  const handleDateChange = (date, type) => {
    let dateValue = null;
    // dateFormater(date);
    if (type === "datePicker") {
      dateValue = date;
    } else {
      dateValue = new Date(date).toISOString().slice(0, 10);
    }
    setMonthAndYear(date);
    setSelectedDate(new Date(dateValue));
    setTabValue("all");
  };
  const getEmployeeExcuses = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_REQULARIZE, {
        superiorEmployeeId: employeeId,
        neededYearAndMonth: monthAndyear,
        companyId: companyId,
      });
      if (result.status === 200) {
        setExcusesCount(result?.result?.length);
        setExcusesEmployeeList(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getEmployeeOverTime = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_OVERTIME, {
        superiorEmployeeId: employeeId,
        neededYearAndMonth: monthAndyear,
        companyId: companyId,
      });
      if (result.status === 200) {
        setOverTimeCount(result?.result?.length);
        setOverTimeData(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAttendenceDeduction = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_PUNCH_APPUROVAL, {
        superiorEmployeeId: employeeId,
        neededYearAndMonth: monthAndyear,
        companyId: companyId,
      });
      if (result.status === 200) {
        setPunchApprovalCount(result?.result?.length);
        setpunchApprovalData(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getWorkFromRequest = async () => {
    try {
      const result = await action(API.GET_ALL_SPECIALREQUEST, {
        superiorEmployeeId: employeeId,
        companyId: companyId,
        requestType: 1,
        month: monthAndyear,
      });
      if (result.status === 200) {
        setWorkFromHomeCount(result?.result?.length);
        setWorkFromHomeData(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLetterRequest = async () => {
    try {
      const result = await action(API.GET_ALL_SPECIALREQUEST, {
        superiorEmployeeId: employeeId,
        companyId: companyId,
        requestType: 2,
        month: monthAndyear,
      });
      if (result.status === 200) {
        setLetterRequestCount(result?.result?.length);
        setLetterRequest(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    switch (tabValue) {
      case "excuses":
        getEmployeeExcuses();

        break;
      case "overtime":
        getEmployeeOverTime();

        break;
      case "punch_approval":
        getAttendenceDeduction();

        break;
      case "work_from_home":
        getWorkFromRequest();

        break;
      case "letter_requests":
        getLetterRequest();

        break;
      case "all":
        getEmployeeExcuses();
        getEmployeeOverTime();
        getAttendenceDeduction();
        getWorkFromRequest();
        getLetterRequest();
        break;

      default:
        getEmployeeExcuses();
        getEmployeeOverTime();
        getAttendenceDeduction();
        getWorkFromRequest();
        getLetterRequest();

        break;
    }
  }, [tabValue, monthAndyear]);

  const tabs = [
    {
      id: 1,
      title: t("Excuses"),
      value: "excuses",
      content: (
        <Excuses
          date={monthAndyear}
          viewNotification={(each) => {
            setOpenBendingApproval(each);
          }}
          data={excusesEmployeeList}
          referesh={() => {
            getEmployeeExcuses();
          }}
        />
      ),
      count: excusesCount,
    },
    {
      id: 2,
      title: t("Overtime"),
      value: "overtime",
      content: (
        <Overtime
          date={monthAndyear}
          data={overTimedata}
          referesh={() => {
            getEmployeeOverTime();
          }}
        />
      ),
      count: overTimeCount,
    },
    {
      id: 3,
      title: t("Punch Approval"),
      value: "punch_approval",
      content: (
        <PunchApproval
          date={monthAndyear}
          data={punchApprovalData}
          referesh={() => {
            getAttendenceDeduction();
          }}
        />
      ),
      count: punchApprovalCount,
    },
    {
      id: 4,
      title: t("Work From Home"),
      value: "work_from_home",
      content: (
        <WorkFromHome
          requestEmployeeId={requestEmployeeId}
          specialRequestId={specialRequestId}
          handleclose={() => {
            setspecialRequestId("");
            setRequestEmployeeId("");
            setData(null);
          }}
          data={workFromHomeData}
          referesh={() => {
            getWorkFromRequest();
          }}
        />
      ),
      count: workFromHomeCount,
    },

    {
      id: 5,
      title: t("Letter Requests"),
      value: "letter_requests",
      content: (
        <LetterRequests
          requestEmployeeId={requestEmployeeId}
          specialRequestId={specialRequestId}
          handleclose={() => {
            setspecialRequestId("");
            setRequestEmployeeId("");
            setData(null);
          }}
          data={letterRequest}
          referesh={() => {
            getLetterRequest();
          }}
        />
      ),
      count: LetterRequestCount,
    },
  ];

  return (
    <div className={`w-full flex flex-col gap-6`}>
      <div>
        <Heading
          title="Employee Requests"
          description="Manage employee requests for excuses, punch adjustments, overtime, remote work, and document submissions"
        />
      </div>
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        <div className="flex items-center gap-4">
          <p className="font-semibold text-base 2xl:text-lg dark:text-white">
            Request Details
          </p>
          <DateSliderPicker
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            width="w-36"
            mode={"month"}
            // datepicker={false}
          />
          {/* {openBendingApproval ? (
            <Alert message="Approval Pending for other month" banner closable />
          ) : null} */}
        </div>
      </div>

      <TabsNew
        tabs={tabs}
        initialTab={activeTab}
        tabClick={(e) => {
          setTabValue(e);
        }}
        count={true}
      />
    </div>
  );
}

export default EmployeeRequest;
