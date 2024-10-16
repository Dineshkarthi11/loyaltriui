import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../../../common/DrawerPop";
import EmployeeCheck from "../../../../common/EmployeeCheck";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function AssignLabourWelfareFund({
  open,
  close = () => {},
  updateId,
  refresh = () => {},
  statutoryConfigurationId,
  statutorySettingsId,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState([]);
  const [employeeCheckedListLwf, setEmployeeCheckedListLwf] = useState([]);

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

  const handleClose = () => {
    setShow(false);
  };

  const navigateBtn = [{ id: 1, value: "Employees", title: "Employees" }];

  const getCheckedEmployeeForStateInsurance = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYESS_FOR_ESI_ASSIGNED_LIST,
        {
          companyId: companyId,
          statutoryConfigurationId: statutoryConfigurationId,
        }
      );
      // const selectedEmployeeIds = result?.selectedEmployees.map((employee) => ({
      //   employeeId: employee.employeeId,
      //   employeeName: employee.employeeName,
      // }));
      // console.log(
      //   selectedEmployeeIds.map((employee) => employee.employeeId),
      //   "selected employee data"
      // );

      // setEmployeeCheckedListLwf(
      //   selectedEmployeeIds.map((employee) => employee.employeeId)
      // );
      const empData = result?.result.selectedEmployees;
      setSelectedEmployeeId(empData?.length > 0 ? empData : null);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCheckedEmployeeForStateInsurance();
  }, []);

  const saveEmployee = async () => {
    setLoading(true);
    try {
      const result = await Payrollaction(PAYROLLAPI.ASSIGN_EMPLOYEE_FOR_ESI, {
        statutoryConfigurationId: statutoryConfigurationId,
        statutorySettingsId: statutorySettingsId,
        companyId: companyId,
        employeeId: employeeCheckedListLwf
          .filter((each) => each.assign)
          .map((each) => ({
            employeeId: each.id,
            number: null,
            joiningDate: null,
          })),
        createdBy: loggedEmployeeId,
        restrictionValue: null,
        withEffectfrom: "2024-07-04",
      });

      if (result.status === 200) {
        openNotification("success", "Successful", result.message, () => {});
        setTimeout(() => {
          handleClose();
          refresh();
          setLoading(false);
        }, 1000);
      } else {
        openNotification("error", "Info", result.message);
        setLoading(false);
      }
    } catch (error) {
      openNotification("error", "Info", error.code);
      setLoading(false);

      console.log(error);
    }
  };

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
      placement="bottom"
      contentWrapperStyle={{
        position: "absolute",
        height: "100%",
        top: 0,
        // left: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        borderRadius: 0,
        borderTopLeftRadius: "0px !important",
        borderBottomLeftRadius: 0,
        background: "#F8FAFC",
      }}
      header={[
        !updateId
          ? t("Assign Employee Labour Welfare Fund")
          : t("Update Assignies"),
        !updateId
          ? t("Manage Assign Employee Labour Welfare Fund")
          : t("Update Selected Assignies"),
      ]}
      handleSubmit={(e) => {
        saveEmployee();
      }}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
    >
      {(selectedEmployeeId?.length > 0 || selectedEmployeeId === null) && (
        <div className="max-w-[890px] mx-auto">
          <EmployeeCheck
            title="Assign Employee Labour Welfare Fund"
            description="Manage your Assignies here"
            navigateBtn={navigateBtn}
            employee={selectedEmployeeId || ""}
            assignData={(employee) => {
              setEmployeeCheckedListLwf(employee);
            }}
          />
        </div>
      )}
    </DrawerPop>
  );
}
