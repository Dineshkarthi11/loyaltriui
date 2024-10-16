import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../../../common/DrawerPop";
import EmployeeCheck from "../../../../common/EmployeeCheck";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";
import { useNotification } from "../../../../../Context/Notifications/Notification";

export default function AssignEmpStateInsurance({
  open,
  close = () => {},
  updateId,
  refresh = () => {},
  statutoryConfigurationId,
  statutorySettingsId,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState([]);
  const [esiCountDate, setEsiCountDate] = useState([]);
  const [employeeCheckedListEsi, setEmployeeCheckedListEsi] = useState([]);
  const [loading, setLoading] = useState(false);

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );

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

  const navigateBtn = [
    { id: 1, value: "Employees", title: "Employees" },
    // { id: 2, value: "Departments", title: "Departments" },
    // { id: 3, value: "Locations", title: "Locations" },
  ];

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

      const empData = result?.result.selectedEmployees;
      setSelectedEmployeeId(empData?.length > 0 ? empData : null);
      setEsiCountDate(result?.result.numberandjoining);

      // setEmployeeCheckedListEsi(
      //   selectedEmployeeIds.map((employee) => employee.employeeId)
      // );
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
        companyId: companyId,
        employeeId: employeeCheckedListEsi
          .map(
            (each) =>
              each.assign && {
                employeeId: each.id,
                number: each[`${"ESInumber" + each.id}`],
                joiningDate: each[`${"ESIjoiningDate" + each.id}`],
              }
          )
          .filter((data) => data),
        createdBy: loggedEmployeeId,
        restrictionValue: null,
        statutorySettingsId: statutorySettingsId,
        withEffectfrom: "2024-07-04",
      });

      if (result.status === 200) {
        openNotification("success", "Successful", result.message, () => {});
        setTimeout(() => {
          handleClose();
          refresh();
          setLoading(false);
        }, 1500);
      } else {
        openNotification("error", "Info", result.message);
        setLoading(false);
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
        !updateId ? t("Assign Employee Insurance") : t("Update Assignies"),
        !updateId
          ? t("Manage Assign Employee Insurance")
          : t("Update Selected Assignies"),
      ]}
      handleSubmit={(e) => {
        saveEmployee();
      }}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
    >
      {(selectedEmployeeId?.length > 0 || selectedEmployeeId == null) && (
        <div className="max-w-[1200px] mx-auto">
          <EmployeeCheck
            title="Assign Employee Insurance"
            description="Manage your Assignies here"
            navigateBtn={navigateBtn}
            employee={selectedEmployeeId || []}
            assignData={(employee) => {
              setEmployeeCheckedListEsi(employee);
            }}
            customField={[
              {
                title: "ESI Number",
                inputField: "ESInumber",
                type: "text",
                value: "",
              },
              {
                title: "ESI Join Date",
                inputField: "ESIjoiningDate",
                type: "date",
                value: "",
              },
            ]}
            selectedCount={esiCountDate}
          />
        </div>
      )}
    </DrawerPop>
  );
}
