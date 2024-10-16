import React, { useEffect, useState } from "react";
import { PiEyeFill } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import DragCard from "./DragCard";
import API, { action } from "../Api";
import { NoData } from "../common/SVGFiles";
import NoImagePlaceholder from "../../assets/images/noImg.webp";
import TeamImg from "../../assets/images/discover/Reporting-team.png";
import EmployeeQuickViewModal from "../Employee/EmployeeQuickViewModal";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function TeamMemberCard() {
  const { t } = useTranslation();
  const [teams, setTeams] = useState([]);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTeams = async () => {
    const result = await action(API.DASHBOARD_EMPLOYEE_TEAMS, {
      id: employeeId,
      companyId: companyId,
    });
    setTeams(
      result.result.map((each) => ({
        id: each.employeeId,
        name:
          each.firstName?.charAt(0).toUpperCase() +
          each.firstName?.slice(1) +
          " " +
          each.lastName?.charAt(0).toUpperCase() +
          each.lastName?.slice(1),
        img: each.profilePicture,
        designation:
          each.designation?.charAt(0).toUpperCase() +
          each.designation?.slice(1),
        phone: each.phone,
        Action: "Request",
        Date1: "Feb 20",
        Date2: "2024(1,Day)",
        Status: "Pending",
      }))
    );
  };
  useEffect(() => {
    getTeams();
  }, []);

  const handleIconClick = (id) => {
    setSelectedEmployeeId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployeeId(null);
  };

  return (
    <DragCard
      count={teams.length > 0 ? teams.length : null}
      // icon={<PiUsers size={18} />}
      imageIcon={TeamImg}
      header={t("Reporting Team Members")}
      className="h-full"
    >
      {teams?.length > 0 ? (
        <div className="flex flex-col gap-5 overflow-auto px-1.5 max-h-56 2xl:max-h-56">
          {teams?.map((data, i) => (
            <div className="flex flex-col gap-2" key={i}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-8 overflow-hidden rounded-full 2xl:size-10 shrink-0 bg-primaryalpha/20 dark:bg-primaryalpha/30 vhcenter border-2 border-white shadow-md`}
                  >
                    {data?.img ? (
                      <img
                        // src={record.logo}
                        src={data?.img ? data?.img : NoImagePlaceholder}
                        className="object-cover object-center w-full h-full"
                        alt=""
                      />
                    ) : (
                      <p className="font-semibold text-primary">
                        {data?.name?.charAt(0).toUpperCase()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="pblack">{data?.name}</p>
                    <p className="text-black text-opacity-50 dark:text-white 2xl:text-xs text-[9px]">
                      {data?.designation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs actions 2xl:text-sm dark:text-white">
                  {/* <div
                    onClick={() => {
                      // window.open(`tel:${data.phone}`, "_blank");
                      // window.location.href = `tel:${data.phone}`;
                    }}
                    className="overflow-hidden text-gray-400 rounded-full size-7 vhcenter bg-primaryalpha/10"
                  >
                    <BiSolidPhoneCall />
                  </div> */}
                  <button
                    onClick={() => handleIconClick(data.id)}
                    className="overflow-hidden text-gray-400 rounded-full size-7 vhcenter bg-primaryalpha/10"
                  >
                    <PiEyeFill size={14} />
                  </button>
                </div>
                {/* Add a horizontal line after each item except for the last one */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-56">
          <NoData />
        </div>
      )}

      {isModalOpen && (
        <EmployeeQuickViewModal
          open={isModalOpen}
          close={closeModal}
          employeeId={selectedEmployeeId}
          companyDataId={companyId}
        />
      )}
    </DragCard>
  );
}
