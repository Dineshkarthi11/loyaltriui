import React from "react";
import ToggleBtn from "../common/ToggleBtn";
import user1 from "../../assets/images/Rectangle 330.png";
import checked from "../../assets/images/check-line.svg";
import { MdCheck, MdMail, MdMailOutline } from "react-icons/md";
import { RiLockLine } from "react-icons/ri";
import FormInput from "../common/FormInput";
import SearchBox from "../common/SearchBox";
import { useTranslation } from "react-i18next";

export default function Privileges() {
  const { t } = useTranslation();

  const privilegesData = [
    {
      id: 1,
      title: t("Payroll"),
      description: t("Payroll_description"),
      status: t("Activated"),
    },
    {
      id: 2,
      title: t("Performance"),
      description: t("Performance_description"),
      status: t("Deactivated"),
    },
    {
      id: 3,
      title: t("Leave"),
      description: t("Leave_description"),
      status: t("Deactivated"),
    },
    {
      id: 4,
      title: t("VR_Analytics"),
      description: t("VR_Analytics_description"),
      status: t("Deactivated"),
    },
    {
      id: 5,
      title: t("Augment_Reality"),
      description: t("Augment_Reality_description"),
      status: t("Activated"),
    },
    {
      id: 6,
      title: t("Recruitment"),
      description: t("Recruitment_description"),
      status: t("Deactivated"),
    },
    {
      id: 7,
      title: t("Company"),
      description: t("Company_description"),
      status: t("Deactivated"),
    },
    {
      id: 8,
      title: t("Attendance"),
      description: t("Attendance_description"),
      status: t("Activated"),
    },
  ];
  const userData = [
    {
      id: 1,
      name: "Syed Ali",
      status: "Enabled",
    },
    {
      id: 2,
      name: "Sabeer KM",
      status: "Disabled",
    },
    {
      id: 3,
      name: "Fatima Ansar",
      status: "Disabled",
    },
    {
      id: 4,
      name: "Nazar Abdulla",
      status: "Disabled",
    },
    {
      id: 5,
      name: "Hisham",
      status: "Disabled",
    },
    {
      id: 6,
      name: "Mashrooq",
      status: "Disabled",
    },
    // {
    //   id: 7,
    //   name: "Bilal Asaad",
    //   status: "Disabled",
    // },
  ];

  return (
    <div className="block justify-start items-start p-4">
      <div className="  font-inter">
        <h1 className="text-2xl dark:text-white">{t("User_Privileges")}</h1>
        <p className="text-xs opacity-50 dark:text-white pb-3 mb-0">
          {t("User_Privileges_description")}
        </p>
      </div>
      <div className="border-b border-b-[#dadada123]"></div>
      <div className=" py-4 mb-3">
        <div className=" ">
          <div className=" font-inter">
            <h6 className="text-sm dark:text-white">{t("Features_Modules")}</h6>
            <p className="pr-5 text-[12px] opacity-50 dark:text-white">
              {t("Features_Modules_description")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-5">
          {privilegesData?.map((each) => (
            <div className="dark:bg-ash shadow-md col-span-3 border rounded-xl py-2 mb-2">
              <div className="flex justify-between items-center border-b border-b-[#dadada] border-b-opacity-70 p-3">
                <p className="mb-0 font-semibold text-sm dark:text-white font-Poppins">
                  {each.title}
                </p>
                <ToggleBtn value={each.status === t("Activated")} />
              </div>
              <div className="p-3">
                <p className="text-xs opacity-50 dark:text-white   font-Poppins">
                  {each.description}
                </p>
                <br />
                <span
                  className={`text-xs font-bold p-1.5 rounded-full ${each.status === t("Activated")
                    ? "bg-greenLight text-green"
                    : "bg-redlight text-red-500"
                    }`}
                >
                  {each.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className=" border-t border-t-[#dadada] border-opacity-70 pt-4 ">
        <div className=" ">
          <div className="">
            <h2 className="text-sm dark:text-white  font-Graphik font-extrabold">
              {t("Users")}
            </h2>
            <p className="pr-5 text-[12px] opacity-50 dark:text-white  font-Graphik">
              {t("Users_description")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-6 py-2">
          {userData?.map((each) => (
            <div
              className={`dark:bg-ash shadow-sm relative col-span-1.6 p-2 font-inter text-center border-2 rounded-xl cursor-pointer ${each.status === "Enabled"
                ? "border-[#6A4BFC]"
                : "border-[#dadada]"
                }`}
            >
              <div className="flex justify-center py-3">
                <img
                  src={user1}
                  alt=""
                  className="border-2 border-[#e2e0e0] rounded-full"
                />
              </div>
              <p className="mb-1 text-sm dark:text-white font-Poppins">
                {each.name}
              </p>
              <p className="mb-2 text-sm opacity-50 dark:text-white font-Poppins">
                {each.status}
              </p>
              {each.status === "Enabled" ? (
                <div className="absolute -top-2 -right-2 bg-[#6A4BFC] p-0.5 rounded-full font-inter">
                  <MdCheck className="text-xl text-white" />
                </div>
              ) : (
                <div className="absolute -top-2 -right-2 bg-[#E6E6E6] dark:bg-ash p-1 rounded-full">
                  <RiLockLine className="text-lg opacity-40 dark:text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
      <div className=" py-4  ">
        <div className=" ">
          <div className="w-96 ">
            <p className="mb-1 text-sm dark:text-white font-Inter">
              {t("Search")}
            </p>
            <SearchBox
              icon={<MdMailOutline className="dark:text-white opacity-50" />}
              className="w-96 dark:bg-ash"
              placeholder={t("Search")}
              change={() => { }}
              value=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
