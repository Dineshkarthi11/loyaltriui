import React, { useEffect, useState } from "react";
import TableAnt from "../common/TableAnt";
import API, { action } from "../Api";
import { workEntryHeader } from "../data";
import { PiBriefcase } from "react-icons/pi";
import ModalAnt from "../common/ModalAnt";
import Avatar from "../common/Avatar";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function WorkEntry({ employee }) {
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(
    employee || localStorageData.employeeId
  );
  const [modalDetails, setModalDetails] = useState({
    openModal: false,
    details: "",
  });

  const [workEntry, setWorkEntry] = useState([]);

  useEffect(() => {
    setEmployeeId(employee);
  }, [employee]);

  const getWorkEntryList = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_ID_BASED_WORK_ENTRY, {
        id: employeeId,
        companyId: companyId,
      });
      if (result.status === 200) {
        setWorkEntry(result.result);
      }
    } catch (error) {
      console.error("Error fetching employee list:", error);
    }
  };

  useEffect(() => {
    getWorkEntryList();
  }, [employeeId]);

  const locationObject = modalDetails.details?.location
    ? JSON.parse(modalDetails.details?.location)
    : "";

  return (
    <div>
      <TableAnt
        data={workEntry}
        header={workEntryHeader}
        path="My_Work_Entries"
        viewOutside={true}
        viewClick={(e, details) => {
          setModalDetails({ openModal: true, details: details });
        }}
      />

      <ModalAnt
        isVisible={modalDetails.openModal}
        onClose={() => setModalDetails({ openModal: false, details: "" })}
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
            <h2 className="h2">Work Entry Details</h2>
          </div>
          <div className="max-h-[320px] overflow-auto flex flex-col gap-3 mt-2 pr-1.5">
            <div className="flex items-center text-[10px] 2xl:text-xs">
              <div className="w-[80px]">
                <p className="text-slate-500">Work Name</p>
              </div>
              <p className="font-semibold">
                {modalDetails.details?.workName?.charAt(0).toUpperCase() +
                  modalDetails.details?.workName?.slice(1)}
              </p>
            </div>
            <div className="flex items-center text-[10px] 2xl:text-xs dark:text-white">
              <div className="w-[80px]">
                <p className="text-slate-500">Units Done</p>
              </div>
              <p className="font-semibold">
                {modalDetails.details?.unitCount} units
              </p>
            </div>
            <div className="flex items-center text-[10px] 2xl:text-xs dark:text-white">
              <div className="w-[80px]">
                <p className="text-slate-500">Created On</p>
              </div>
              <p className="font-semibold">{modalDetails.details?.date}</p>
            </div>
            <div className="flex items-center text-[10px] 2xl:text-xs dark:text-white">
              <div className="w-[80px]">
                <p className="text-slate-500">Location</p>
              </div>
              <p className="font-semibold">{locationObject?.locationName}</p>
            </div>
            <div className="flex items-center dark:text-white">
              <div className="w-[80px]">
                <p className="text-slate-500 text-[10px] 2xl:text-xs">
                  Created by
                </p>
              </div>
              <p className="flex items-center gap-1">
                <Avatar
                  image={modalDetails.details?.profilePicture}
                  name={modalDetails.details?.employeeName}
                  className="size-6 2xl:size-8"
                />
                <p className="font-semibold text-[10px] 2xl:text-xs">
                  {modalDetails.details?.employeeName?.charAt(0).toUpperCase() +
                    modalDetails.details?.employeeName?.slice(1)}
                </p>
              </p>
            </div>
            <div className="flex flex-col pt-3 p-2 gap-2 text-[10px] 2xl:text-xs rounded-lg bg-primaryalpha/5">
              <div className="text-slate-500">Description</div>
              <div>{modalDetails.details?.description}</div>
            </div>

            {typeof modalDetails.details.Attachments === "object" &&
              modalDetails.details.Attachments !== null && (
                <div className="flex flex-col pt-3 gap-2">
                  <div className="text-slate-500 text-[10px] 2xl:text-xs">
                    {modalDetails.details?.Attachments?.length} Attachments
                  </div>
                  {modalDetails.details?.Attachments?.length !== 0 && (
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {modalDetails.details?.Attachments?.map((item, index) => (
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
