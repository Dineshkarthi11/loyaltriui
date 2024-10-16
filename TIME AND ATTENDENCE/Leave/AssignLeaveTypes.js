import React, { useEffect, useMemo, useState } from "react";
import EmployeeCheck from "../../common/EmployeeCheck";
import { navigateBtn } from "../../data";
import API, { action } from "../../Api";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function AssignLeaveTypes({ updateId, open, close = () => {} }) {
  const { t } = useTranslation();

  const [show, setShow] = useState(open);

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);

  const [departmentList, setDepartmentList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [leaveCountList, setLeaveCountList] = useState([]);
  const [assignLeaveCount, setAssignLeaveCount] = useState();

  const [employeeCheckList, setEmployeeCheckList] = useState([]);
  const [departmentCheckList, setDepartmentCheckList] = useState([]);
  const [locationCheckList, setLocationCheckList] = useState([]);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );
  // Assign Leave Types
  const getIDbasedleaveType = async () => {
    try {
      const result = await action(API.GET_LEAVE_TYPES_ID_BASED_RECORDS, {
        id: updateId,
      });

      setEmployeeList(result.result?.LeaveTypeApplicable?.employeeIds || []);
      setDepartmentList(
        result.result?.LeaveTypeApplicable?.departmentIds || []
      );
      setLocationList(result.result?.LeaveTypeApplicable?.locationIds || []);

      setLeaveCountList(
        result.result?.LeaveTypeApplicable?.leaveCountDatas || []
      );
      setAssignLeaveCount(result?.result?.leaveCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const UpdateAssignEmployee = async () => {
    try {
      const result = await action(API.UPDATE_ASSIGN_EMPLOYEE_LEAVE_TYPES, {
        leaveTypeId: updateId,
        companyId: companyId,
        employeeId:
          employeeCheckList
            ?.map((each) => each.assign && each.id)
            .filter((data) => parseInt(data)) || [],
        departmentId:
          departmentCheckList
            ?.map((each) => each.assign && each.id)
            .filter((data) => parseInt(data)) || [],
        locationId:
          locationCheckList
            ?.map((each) => each.assign && each.id)
            .filter((data) => parseInt(data)) || [],
        leaveCount:
          employeeCheckList
            ?.map((each) => each.assign && each[`${"leaveCount" + each.id}`])
            .filter((data) => parseInt(data)) || [],
        createdBy: employeeId,
      });
      if (result.status === 200) {
        openNotification("success", "Successful", result.message);
        setTimeout(() => {
          setShow(false);
        }, 1000);
      } else {
        openNotification("error", "Info", result.message);
      }
    } catch (error) {
      openNotification("error", "Failed", error.code);
    }
  };

  useEffect(() => {
    if (updateId) {
      getIDbasedleaveType();
    }
  }, [updateId]);

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        setShow(false);
      }}
      contentWrapperStyle={{
        position: "absolute",
        height: "100%",
        top: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        borderRadius: 0,
        borderTopLeftRadius: "0px !important",
        borderBottomLeftRadius: 0,
      }}
      background="#F8FAFC"
      handleSubmit={(e) => {
        UpdateAssignEmployee();
      }}
      header={[
        !updateId ? t("Create_Leave_Type") : t("Update Employee Leave Types"),
        !updateId
          ? t("Complete_Leave_Type_in_few_steps")
          : t("Update Employee Leave Type in few steps"),
      ]}
      footerBtn={[t("Cancel"), t("Submit")]}
    >
      <div className={"max-w-[1072px] mx-auto"}>
        {employeeList.length > 0 && (
          <EmployeeCheck
            title="Applicability"
            description="Manage your companies holidays here"
            employee={employeeList}
            department={departmentList}
            location={locationList}
            navigateBtn={navigateBtn}
            assignData={(employee, department, location) => {
              setEmployeeCheckList(employee);
              setDepartmentCheckList(department);
              setLocationCheckList(location);
            }}
            customField={[
              {
                title: "Leave Count",
                inputField: "leaveCount",
                type: "text",
                value: assignLeaveCount,
                maxLength: 3,
              },
            ]}
            selectedCount={leaveCountList}
          />
        )}
      </div>
    </DrawerPop>
  );
}
