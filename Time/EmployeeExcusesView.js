import React, { useEffect, useState } from "react";
import ModalPop from "../common/ModalPop";
import API, { action } from "../Api";

export default function EmployeeExcusesView({
  viewOpen,
  approvedEmployeeId,
  close = () => {},
}) {
  const [superiorEmployees, setSuperiorEmployees] = useState([]);

  const getApproveList = async () => {
    console.log(approvedEmployeeId);
    const result = await action(API.EMPLOYEE_LEAVE_APPROVE_LIST, {
      employeeLeaveApplicationId: approvedEmployeeId[0],
    });
    setSuperiorEmployees(result.result[0]);
    console.log(result);
  };
  useEffect(() => {
    getApproveList();
  }, []);

  return (
    <div>
      <ModalPop
        width={1000}
        open={viewOpen}
        title={<h1 className="">Employee Excuses</h1>}
        close={(e) => {
          close(false);
          //   setViewOpen(e);
          //   setUpdateId(null);
        }}
      >
        {/* {superiorEmployees && console.log(Object.keys(superiorEmployees))} */}
        <div className=" grid grid-cols-4 gap-2 p-2 border border-primaryLight rounded-md bg-primaryLight">
          <div className=" flex flex-col gap-4">
            <div className=" flex justify-between">
              <h1 className="h2">Employee Name</h1>
              <p className="">:</p>
            </div>
            <div className=" flex justify-between">
              <h1 className="h2"> Type</h1>
              <p className="">:</p>
            </div>
            <div className=" flex justify-between">
              <h1 className="h2">Leave Start Date</h1>
              <p className="">:</p>
            </div>
            <div className=" flex justify-between">
              <h1 className="h2">Leave End Date</h1>
              <p className="">:</p>
            </div>
            <div className=" flex justify-between">
              <h1 className="h2">Remarks</h1>
              <p className="">:</p>
            </div>
            {/* <div className=" flex justify-between">
              <h1 className="h2">Leave Types</h1>
              <p className="">:</p>
            </div> */}
            <div className=" flex justify-between">
              <h1 className="h2">Status</h1>
              <p className="">:</p>
            </div>
            <div className=" flex justify-between">
              <h1 className="h2">Requested On</h1>
              <p className="">:</p>
            </div>
          </div>

          <div className=" flex flex-col gap-4">
            <h1>{superiorEmployees?.firstName || "--"}</h1>
            <h1>{superiorEmployees?.assetTypeName || "--"}</h1>
            <h1>{superiorEmployees?.leaveDateFrom || "--"}</h1>
            <h1>{superiorEmployees?.leaveDateTo || "--"}</h1>
            <h1>{superiorEmployees?.leaveReason || "--"}</h1>
            {/* <h1>{superiorEmployees?.leaveType || "--"}</h1> */}
            <h1>{superiorEmployees?.status || "--"}</h1>
            <h1>{superiorEmployees?.createdOn || "--"}</h1>
          </div>
          <div className=" col-span-2 flex flex-col gap-4">
            <h1 className="h1 border-b border-primary w-fit">
              Approved / Rejected
            </h1>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-3 gap-4 bg-redlight p-1 rounded-md opacity-60">
                <h1 className="h2">Approved By</h1>
                <h1 className="h2">Status</h1>
                <h1 className="h2">Remarks</h1>
              </div>
              <div className="flex flex-col gap-4">
                {superiorEmployees?.suemployees?.map((each) => (
                  <div className="grid grid-cols-3 gap-4">
                    <h1 className=" text-primary">
                      {each?.SuperiorEmployeeFirstName?.charAt(
                        0
                      ).toUpperCase() +
                        each?.SuperiorEmployeeFirstName?.slice(1) +
                        " " +
                        each.SuperiorEmployeeLastName?.charAt(0).toUpperCase() +
                        each?.SuperiorEmployeeLastName?.slice(1)}
                    </h1>
                    <h1 className="  text-primary">{each.status}</h1>
                    <h1
                      className={`${
                        each.status === "Approved"
                          ? " text-green-500 bg-greenLight"
                          : "text-red-500 bg-redlight"
                      } py-1 px-2 rounded-full w-fit `}
                    >
                      {each.remarks?.charAt(0).toUpperCase() +
                        each?.remarks?.slice(1) || "--"}
                    </h1>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ModalPop>
    </div>
  );
}
