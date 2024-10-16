import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import EmployeeCheck from "../../common/EmployeeCheck";
import { useFormik } from "formik";
import API, { action } from "../../Api";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function AssignApprovalTemplate({
  open,
  close = () => {},
  updateId,
  companyDataId,
  approvalTypeId,
  approvalFlowApplicabilityId,
  refresh,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [isUpdate, setIsUpdate] = useState(false);
  const [employeeId, setEmployeeId] = useState([]);
  const [approvedEmployee, setApprovedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  const navigateBtn = [{ id: 1, value: "Employees", title: "Employees" }];
  // console.log(approvalFlowApplicabilityId,"approvalFlowApplicabilityId")
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

  const formik = useFormik({
    initialValues: {},

    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await action(API.CREATE_UPDATE_APPROVEL_MAPPING, {
          approvalFlowApplicabilityId: approvalFlowApplicabilityId || null,
          approvalTypeId: approvalTypeId,
          approvalTemplateId: updateId,
          companyId: companyDataId,
          employeeIds:
            employeeId
              .map((each) => each.assign && each.id)
              .filter((data) => data) || null,
          departmentIds: null,
          locationIds: null,
        });
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 1000);
        } else if (result.status === 500) {
          openNotification("success", "Successful", result.message);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
  });
  const getApproveEmployee = async () => {
    try {
      const result = await action(API.GET_APPROVED_EMPLOYEE, {
        companyId: companyDataId,
        approvalTemplateId: updateId,
      });

      const employeeId = result.result.map((emp) => parseInt(emp.employeeId));
      setApprovedEmployee(employeeId);
    } catch (error) {
      console.error("Error fetching approval types:", error);
    }
  };

  useEffect(() => {
    getApproveEmployee();
  }, [updateId]);

  return (
    <div>
      <DrawerPop
        open={show}
        close={(e) => {
          handleClose();
        }}
        background="#F8FAFC"
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
        }}
        handleSubmit={(e) => {
          formik.handleSubmit();
        }}
        updateBtn={isUpdate}
        header={[
          !isUpdate ? t("Create New Approval Flow") : t("Update Approval Flow"),
          !isUpdate ? t("Create New Approval Flow") : t("Update Approval Flow"),
        ]}
        footerBtn={[t("Cancel"), t("Save")]}
        footerBtnDisabled={loading}
      >
        {approvedEmployee &&
          Array.isArray(approvedEmployee) &&
          approvedEmployee.length >= 0 && (
            <div className="max-w-[890px] mx-auto">
              <EmployeeCheck
                title="Assign Template"
                description="Assign Employees."
                navigateBtn={navigateBtn}
                employee={approvedEmployee}
                assignData={(employee, department, location) => {
                  // console.log(employee
                  //     .map((each) => each.assign && each.id)
                  //     .filter((data) => data),"updateId")
                  //     console.log(employee
                  //         ,"updateId")
                  setEmployeeId(employee);

                  // setDepartmentList(department);
                  // setLocationList(location);
                }}
              />
            </div>
          )}
      </DrawerPop>
    </div>
  );
}
