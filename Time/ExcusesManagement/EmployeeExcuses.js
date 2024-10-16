import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DatePicker, Flex } from "antd";
import FlexCol from "../../common/FlexCol";
import Heading from "../../common/Heading";
import TableAnt from "../../common/TableAnt";
import { employeeExcuseHeader } from "../../data";
import API, { action } from "../../Api";
import Approved from "../Approved";
import ButtonClick from "../../common/Button";
import Rejected from "../Rejected";
import EmployeeExcusesView from "../EmployeeExcusesView";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function EmployeeExcuses() {
  const { t } = useTranslation();

  const [navigationValue, setNavigationValue] = useState(t("Employee Excuses"));

  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [monthAndyear, setMonthAndYear] = useState(null);
  const [excusesEmployeeList, setExcusesEmployeeList] = useState([]);
  const { MonthPicker } = DatePicker;

  const [approvedBtn, setApprovedBtn] = useState();
  const [approvedEmployeeIds, setApprovedEmployeeIds] = useState();
  const [approved, setApproved] = useState(false);
  const [approvedDetails, setApprovedDetails] = useState();
  const [reject, setReject] = useState(false);
  const [view, setView] = useState(false);

  const getEmployeeExcuses = async () => {
    const result = await action(API.GET_EMPLOYEE_REQULARIZE, {
      superiorEmployeeId: employeeId,
      neededYearAndMonth: monthAndyear,
    });
    console.log(result);
    setExcusesEmployeeList(result.result);
  };

  useEffect(() => {
    getEmployeeExcuses();
  }, [monthAndyear]);

  return (
    <FlexCol>
      <Flex justify="space-between">
        <Heading title={t("Employee_Excuses")} description={t("Dsc_excuse")} />
        {approvedBtn && (
          <Flex>
            <ButtonClick
              buttonName={t("Reject")}
              handleSubmit={() => {
                setReject(true);
              }}
              className={"bg-red-500 text-white"}
            />
            <ButtonClick
              buttonName={t("Approve")}
              handleSubmit={() => {
                setApproved(true);
              }}
              className={"bg-primary text-white"}
            />
          </Flex>
        )}
      </Flex>

      <TableAnt
        data={excusesEmployeeList}
        header={employeeExcuseHeader}
        actionID="employeeRegularizationId"
        path="Regularization"
        navigationValue={navigationValue}
        clickDrawer={(e, i, value, details) => {
          console.log(e, i, value, details);
          if (i === "approve") {
            setApproved(e);
          } else if (i === "reject") {
            setReject(true);
          } else if (i === "view") {
            setView(true);
          }
          setApprovedEmployeeIds(value);
          setApprovedDetails([details]);
        }}
        selectedRow={(key, value, details) => {
          console.log(value, details);

          setApprovedBtn(details.length !== 0 ? key : false);
          setApprovedEmployeeIds(value);
          setApprovedDetails(details);
        }}
        headerTools={true}
        viewOutside={true}
        viewClick={(e) => {
          console.log("true", e);
          setView(true);
          setApprovedEmployeeIds([parseInt(e)]);
        }}
        inputType={[
          {
            id: 1,
            type: (
              <MonthPicker
                className={" w-36"}
                onChange={(e, i) => {
                  console.log(i);
                  setMonthAndYear(i);
                }}
              />
            ),
          },
        ]}
      />

      {approved && (
        <Approved
          open={approved}
          close={() => {
            setApproved(false);
          }}
          refresh={() => {
            getEmployeeExcuses();
          }}
          employeeId={approvedEmployeeIds}
          details={approvedDetails}
          employeeShowValue={[
            { id: 1, title: "Employee Name", value: "employeeName" },
            { id: 2, title: "Excuse Type", value: "excuseType" },
            { id: 3, title: "Excuse Date", value: "excuseDate" },
          ]}
          actionApi={API.UPDATE_REGULARIZING_REQUEST}
        />
      )}
      {reject && (
        <Rejected
          open={reject}
          close={() => {
            setReject(false);
          }}
          refresh={() => {
            getEmployeeExcuses();
          }}
          employeeId={approvedEmployeeIds}
          details={approvedDetails}
          employeeShowValue={[
            { id: 1, title: "Employee Name", value: "employeeName" },
            { id: 2, title: "Excuse Type", value: "excuseType" },
          ]}
          actionApi={API.UPDATE_REGULARIZING_REQUEST}
        />
      )}
      {view && (
        <EmployeeExcusesView
          viewOpen={view}
          approvedEmployeeId={approvedEmployeeIds}
          close={(e) => {
            setView(false);
          }}
        />
      )}
    </FlexCol>
  );
}
