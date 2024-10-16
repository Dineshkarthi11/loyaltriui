import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../../../common/DrawerPop";
import EmployeeCheck from "../../../../common/EmployeeCheck";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";
import { useNotification } from "../../../../../Context/Notifications/Notification";

export default function AssignEmpProvidentFund({
  open,
  close = () => {},
  updateId,
  refresh = () => {},
  statutoryConfigurationId,
  statutorySettingsId,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeCheckList, setEmployeeCheckList] = useState([]);
  const [esiCountDate, setEsiCountDate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

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

  const getCheckedEmployeeForStateInsurance = async (
    setEmployeeCheckedListEpf
  ) => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYESS_FOR_ESI_ASSIGNED_LIST,
        {
          companyId: companyId,
          statutoryConfigurationId: statutoryConfigurationId,
        }
      );

      const empData = result?.result.selectedEmployees;
      console.log(empData, "empData");
      setEmployeeList(empData?.length > 0 ? empData : null);
      setEsiCountDate(
        result?.result.numberandjoining.map((each) => ({
          id: each.employeeId, // Ensure the ID is correctly mapped
          ...each,
          errorMessage: null,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log(esiCountDate, "esiCountdataemployee");
  useEffect(() => {
    getCheckedEmployeeForStateInsurance();
  }, []);

  console.log(esiCountDate, "esiCountdataemployee");
  console.log(employeeCheckList, "employ");
  // Utility function to format the PF number
  const formatPFNumber = (value) => {
    const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, ""); // Remove non-alphanumeric chars

    // Insert slashes at the correct positions
    const part1 = cleanedValue.slice(0, 2); // e.g., MH
    const part2 = cleanedValue.slice(2, 5); // e.g., BAN
    const part3 = cleanedValue.slice(5, 12); // e.g., 0000064
    const part4 = cleanedValue.slice(12, 15); // e.g., 000
    const part5 = cleanedValue.slice(15, 22); // e.g., 0000123

    let formatted = "";
    if (part1) formatted += part1;
    if (part2) formatted += `/${part2}`;
    if (part3) formatted += `/${part3}`;
    if (part4) formatted += `/${part4}`;
    if (part5) formatted += `/${part5}`;

    return formatted;
  };

  // Function to remove slashes when saving PF number
  const removeSlashesFromPFNumber = (value) => {
    return value.replace(/\//g, "");
  };

  // PF Number validation function
  const isValidPFNumber = (value) => {
    const cleanedValue = removeSlashesFromPFNumber(value);
    console.log(cleanedValue, "cleanedValue");
    return cleanedValue.length === 22; // Check for exactly 22 characters (without slashes)
  };

  // UAN Number validation function
  const isValidUANNumber = (value) => {
    const uanRegex = /^\d{12}$/;
    return uanRegex.test(value);
  };

  // Handle validation for PF and UAN numbers
  const validateFields = () => {
    const errors = {};

    // Filter assigned employees
    const selectedEmployees = employeeCheckList.filter(
      (employee) => employee.assign === true
    );

    selectedEmployees.forEach((employee) => {
      const pfNumber = employee[`PFnumber${employee.id}`];
      const uanNumber = employee[`UAN${employee.id}`];

      // Validate PF number format
      if (!pfNumber) {
        errors[employee.id] = {
          ...errors[employee.id],
          PFnumber: "PF number is required",
        };
      } else if (!isValidPFNumber(pfNumber)) {
        errors[employee.id] = {
          ...errors[employee.id],
          PFnumber: "Required format: MH/BAN/0000064/000/0000123",
        };
      }

      // Validate UAN number format
      if (!uanNumber) {
        errors[employee.id] = {
          ...errors[employee.id],
          UAN: "UAN number is required",
        };
      } else if (!isValidUANNumber(uanNumber)) {
        errors[employee.id] = {
          ...errors[employee.id],
          UAN: "Required format: 100904319456 (12 digits)",
        };
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  // Handle saving the employees
  const saveEmployee = async () => {
    if (!validateFields()) {
      openNotification("error", "Info", "Please fill PF number and UAN number");
      return;
    }

    setLoading(true);
    try {
      const result = await Payrollaction(PAYROLLAPI.ASSIGN_EMPLOYEE_FOR_ESI, {
        statutoryConfigurationId,
        companyId,
        employeeId: employeeCheckList
          .map((each) =>
            each.assign
              ? {
                  employeeId: each.id,
                  number: removeSlashesFromPFNumber(each[`PFnumber${each.id}`]), // Remove slashes before saving
                  UAN: each[`UAN${each.id}`],
                  joiningDate: "",
                }
              : null
          )
          .filter((data) => data !== null),
        createdBy: loggedEmployeeId,
        restrictionValue: null,
        statutorySettingsId,
        withEffectfrom: "2024-07-04",
      });

      if (result.status === 200) {
        openNotification("success", "Successful", result.message);
        setTimeout(() => {
          handleClose();
          refresh();
          setLoading(false);
        }, 1500);
      } else {
        openNotification("error", "Info", result.message);
        setLoading(false);
      }
    } catch (error) {
      openNotification("error", "Info", error.code);
      setLoading(false);
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
        !updateId ? t("Assign Employee Provident Fund") : t("Update Assignies"),
        !updateId
          ? t("Manage Assign Employee Provident Fund")
          : t("Update Selected Assignies"),
      ]}
      handleSubmit={(e) => {
        saveEmployee();
      }}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
    >
      {(employeeList?.length > 0 || employeeList === null) && (
        <div className="max-w-[1500px] w-full mx-auto">
          <EmployeeCheck
            title="Assign Employee Provident Fund"
            description="Manage your Assignies here"
            navigateBtn={navigateBtn}
            assignBtnEPF={true}
            employee={employeeList || []}
            assignData={(employee) => {
              setEmployeeCheckList(employee);
            }}
            validationChange={() => {
              validateFields();
            }}
            customField={[
              {
                title: "PF Number",
                inputField: "PFnumber",
                type: "text",
                value: "",
                error: "errorMessage",
              },
              {
                title: "UAN Number",
                inputField: "UAN",
                type: "text",
                value: "",
              },
            ]}
            selectedCount={esiCountDate}
            error={validationErrors}
          />
        </div>
      )}
    </DrawerPop>
  );
}
