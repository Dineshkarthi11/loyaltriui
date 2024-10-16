import React, { useEffect, useState } from "react";
import { PiBriefcase } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { useTranslation } from "react-i18next";
import SearchBox from "../common/SearchBox";
import EmpwrkEtyAccordion from "./EmployeeProfile/EmpwrkEtyAccordion";
import Heading from "../common/Heading";
import Heading2 from "../common/Heading2";
import API, { action } from "../Api";
import { getEmployeeList } from "../common/Functions/commonFunction";
import ModalAnt from "../common/ModalAnt";
import Avatar from "../common/Avatar";
import { NoData } from "../common/SVGFiles";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function EmployeeWorkEntries() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchFilter, setSearchFilter] = useState();
  const [selectedWorkEntry, setSelectedWorkEntry] = useState({});

  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  const [task, setTask] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  const openModal = (e) => {
    setSelectedWorkEntry(e);
    setIsModalOpen(true);
  };

  const getList = async () => {
    try {
      const result = await getEmployeeList();

      setEmployeeList(result);
      setSearchFilter(result);
    } catch (error) {
      console.error("Error fetching employee list:", error.message);
    }
  };

  const getWorkEntryDetails = async () => {
    try {
      const result = await action(API.DASHBOARD_EMPLOYEE_TASK, {
        companyId: companyId,
        //   id: employeeIdData,
      });

      setTask(result.result);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    getList();
    getWorkEntryDetails();
  }, []);

  return (
    <div className={`w-full flex flex-col gap-6`}>
      <Heading title="Employee Work Entries" description="some dummy text" />

      <div className="flex flex-col items-center justify-between md:flex-row">
        <div className="flex flex-col items-center md:flex-row gap-2 md:gap-8">
          <p className="flex items-center gap-3 dark:text-white">
            <Heading2 title="Total Employees" />
            <p className="rounded-md bg-primaryalpha/10 py-[3px] px-[9px] text-primary">
              {employeeList.length}
            </p>
          </p>
        </div>
        <div className="flex items-center gap-2 pt-3 md:pt-0">
          <SearchBox
            data={employeeList}
            placeholder={t("Search reports")}
            value={searchValue}
            icon={<CiSearch className=" dark:text-white" />}
            className="mt-0 w-ful md:w-auto"
            error=""
            change={(value) => {
              setSearchValue(value);
            }}
            onSearch={(value) => {
              setSearchFilter(value);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {searchFilter?.map((item) => (
          <EmpwrkEtyAccordion
            key={item.employeeId}
            profileImg={item?.profilePicture}
            name={item?.fullName}
            Id={item?.code}
            msg={"Work Entries Added"}
            count={item?.workCount || 0}
          >
            {item?.workCount !== 0 ? (
              <div className="flex flex-col gap-2.5 divide-y divide-black/10 dark:divide-white/10">
                {task?.map(
                  (child, childIndex) =>
                    item.employeeId === child.employeeId && (
                      <div
                        key={childIndex}
                        className={childIndex === 0 ? "" : "pt-2.5"}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <p className="font-semibold dark:text-white text-xs 2xl:text-sm">
                              {child.workName
                                ? child.workName.charAt(0).toUpperCase() +
                                  child.workName.slice(1)
                                : ""}
                            </p>
                            <p className="text-slate-500 text-xs 2xl:text-sm">
                              {child.description}
                            </p>
                          </div>
                          <p
                            className="text-primary text-xs 2xl:text-sm cursor-pointer font-semibold hover:underline"
                            onClick={() => openModal(child)}
                          >
                            View Details
                          </p>
                        </div>
                      </div>
                    )
                )}
              </div>
            ) : (
              <NoData />
            )}
          </EmpwrkEtyAccordion>
        ))}
      </div>

      <ModalAnt
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // width="435px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[553px] p-2">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <PiBriefcase size={24} className="text-primary" />
            </div>
            <h2 className="h2">Work Entry</h2>
          </div>
          <div className="max-h-[320px] overflow-auto flex flex-col gap-3 mt-2 pr-1.5">
            <div className="flex items-center gap-14 text-[10px] 2xl:text-xs">
              <div className="text-slate-500">Work Name</div>
              <div className="font-semibold">
                {selectedWorkEntry?.workName?.charAt(0).toUpperCase() +
                  selectedWorkEntry?.workName?.slice(1)}
              </div>
            </div>
            <div className="flex items-center gap-14 text-[10px] 2xl:text-xs dark:text-white">
              <div className="text-slate-500">Units Done</div>
              <div className="font-semibold">
                {selectedWorkEntry?.unitCount} units
              </div>
            </div>
            <div className="flex items-center gap-14 text-[10px] 2xl:text-xs dark:text-white">
              <div className="text-slate-500">Created On</div>
              <div className="font-semibold">{selectedWorkEntry?.date}</div>
            </div>
            <div className="flex items-center gap-14 dark:text-white">
              <div className="text-slate-500 text-[10px] 2xl:text-xs">
                Created by
              </div>
              <div className="flex items-center gap-1">
                <Avatar
                  image={selectedWorkEntry?.profilePicture}
                  name={selectedWorkEntry?.employeeName}
                  className="size-6 2xl:size-8"
                />
                <div className="font-semibold text-[10px] 2xl:text-xs">
                  {selectedWorkEntry?.employeeName?.charAt(0).toUpperCase() +
                    selectedWorkEntry?.employeeName?.slice(1)}
                </div>
              </div>
            </div>

            <div className="flex flex-col pt-3 p-2 gap-2 text-[10px] 2xl:text-xs rounded-lg bg-primaryalpha/5">
              <div className="text-slate-500">Description</div>
              <div>{selectedWorkEntry?.description}</div>
            </div>

            {typeof selectedWorkEntry?.Attachments === "object" &&
              selectedWorkEntry?.Attachments !== null && (
                <div className="flex flex-col pt-3 gap-2">
                  <div className="text-slate-500 text-[10px] 2xl:text-xs">
                    {selectedWorkEntry?.Attachments?.length} Attachments
                  </div>
                  {selectedWorkEntry?.Attachments?.length !== 0 && (
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {selectedWorkEntry?.Attachments?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 w-[155px] 2xl:w-[167px] h-[50px] 2xl:h-[54px] borderb px-3 py-2 rounded-lg bg-[#F8F8FA] dark:text-white dark:bg-dark"
                        >
                          <img src={item} alt="img" className="w-6 h-6" />
                          <a
                            href={item}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary cursor-pointer font-normal"
                          >
                            View file
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </ModalAnt>
    </div>
  );
}
