import React, { useEffect, useState } from "react";
import DragCard from "./DragCard";
import API, { action } from "../Api";
import { NoData } from "../common/SVGFiles";
import { PiCaretRight } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import workImg from "../../assets/images/discover/work3d.png";
import localStorageData from "../common/Functions/localStorageKeyValues";
export default function WorkEntriesCard({ employeeId }) {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState("All Work Entries");

  const [selectedData, setSelectedData] = useState([]);
  const [task, setTask] = useState([]);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [permissions, setPermissions] = useState([]);

  // Retrieve permissions from local storage
  useEffect(() => {
    const loginData = localStorageData.LoginData;
    if (
      loginData &&
      loginData.userData &&
      Array.isArray(loginData.userData.permissions)
    ) {
      setPermissions(loginData.userData.permissions);
    } else {
      setPermissions([]);
    }
  }, []);

  const getTask = async () => {
    try {
      const result = await action(API.DASHBOARD_EMPLOYEE_TASK, {
        companyId: companyId,
        //   id: employeeIdData,
        superiorEmployeeId: loggedInEmployeeId,
      });

      setTask(result.result);
      if (selectedOption === "All Work Entries") {
        setSelectedData(result.result);
      } else if (selectedOption === "My Work Entries") {
        setSelectedData(
          result.result.filter((entry) => entry.employeeId === employeeId)
        );
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSegmentChange = (value) => {
    setSelectedOption(value);
  };
  useEffect(() => {
    getTask();
  }, [selectedOption]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const hasPermission = (permissionId) => permissions.includes(permissionId);

  const segmentPermissions = {
    "All Work Entries": 50,
    "My Work Entries": 51,
  };

  const filteredSegmentOptions = [
    { label: "All Work Entries", count: task?.length || 0 },
    {
      label: "My Work Entries",
      count:
        task.filter((entry) => entry.employeeId === employeeId)?.length || 0,
    },
  ].filter((segment) => hasPermission(segmentPermissions[segment.label]));

  if (filteredSegmentOptions?.length === 0) {
    return null;
  }

  return (
    <DragCard
      imageIcon={workImg}
      header={t("Work Entries")}
      segment
      segmentSelected={selectedOption}
      segmentOptions={filteredSegmentOptions}
      className="h-full p-2.5"
      segmentOnchange={handleSegmentChange}
    >
      {selectedData?.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <p className="text-xs lg:text-[10px] 2xl:text-xs">
              <span className="text-grey">Total Work Entries</span> :{" "}
              <span className="text-black font-bold dark:text-white">
                {selectedData.length}
              </span>
            </p>
            <Link
              to="/EmployeeWorkEntries"
              className="flex items-center justify-end gap-1.5"
            >
              <p className="text-primary text-xs 2xl:text-sm font-medium">
                View Details
              </p>
              <PiCaretRight size={16} className="text-primary" />
            </Link>
          </div>
          <div className="flex flex-col gap-3 mt-1 overflow-auto h-36 max-h-36 2xl:max-h-36 pr-2.5">
            {selectedData.map((item, index) => (
              <div
                className="rounded-xl bg-[#F8F9FA] p-2.5 dark:bg-dark dark:text-white"
                key={index}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-semibold text-xs lg:text-[10px] 2xl:text-xs capitalize leading-6">
                      {item.workName}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs lg:text-[10px] 2xl:text-xs">
                        <span className="text-grey">
                          {formatDate(item.createdOn)}{" "}
                        </span>
                        <span className="text-primary font-semibold">
                          {item.employeeName}
                        </span>
                      </p>

                      {item.employeeName?.length > 2 && (
                        <div className="overflow-hidden rounded-full shadow-md 2xl:size-6 border border-white  size-5 bg-primaryalpha/20 dark:bg-primaryalpha/30 shrink-0 vhcenter">
                          {item.Attachments?.length > 0 ? (
                            <img
                              src={item.Attachments[0]}
                              alt="attachment"
                              className="object-cover object-center w-full h-full"
                            />
                          ) : (
                            <p className="text-primary font-medium text-xs lg:text-[10px] 2xl:text-xs">
                              {item.employeeName?.charAt(0).toUpperCase()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-44 mt-0.5">
          <NoData />
        </div>
      )}
    </DragCard>
  );
}
