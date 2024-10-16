import React from "react";
import { HiPlus } from "react-icons/hi2";
import { IoIosArrowBack } from "react-icons/io";
import profile from "../../assets/images/Ellipse 71.svg";
import { BsDot } from "react-icons/bs";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Progress, Space } from "antd";
import { MdContentCopy, MdLocalPhone } from "react-icons/md";
import { useTranslation } from "react-i18next";

export default function EmployeeDetails() {
  const { t } = useTranslation();
  return (
    <div className=" px-3 pt-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center ">
          <button className=" font-Inter shadow-sm p-2 border rounded-md text-sm flex items-center justify-center">
            <IoIosArrowBack />
            <span className="font-Inter pl-2">{t("Back_to_All_Employee")}</span>
          </button>
          <p className="mb-0 text-sm pl-10 font-Inter  ">
            {t("All_Employees")} <span>{">"} </span>Khadija Ahmed
          </p>
        </div>
        <div className="">
          <button className="  p-2 bg-primary border text-xs text-white  rounded-lg mx-1">
            <div className="flex justify-center items-center font-Inter ">
              <HiPlus className="text-xl mr-2" />
              <span> {t("Add_company_button")} </span>
            </div>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-3">
        <div className="relative col-span-4  border border-opacity-50 rounded-[10px] py-2 px-3">
          {/* <div className="> */}
          <div className=" block justify-center text-center p-2 ">
            <div className="  flex justify-center p-3">
              <img
                src={profile}
                alt=""
                className=" w-40 h-40 p-1 border-white shadow-sm border-2 rounded-full"
              />
              <BiDotsVerticalRounded className=" absolute top-2 right-1 text-xl opacity-40" />
            </div>
            <h2 className=" text-[20px]">Khadija Ahmed</h2>
            <p className="mb-2 text-sm opacity-50">Project Manager</p>
            <div className=" flex justify-center items-center ">
              <p className=" flex justify-center items-center text-green bg-greenLight rounded-[10px] px-2">
                <BsDot className="text-2xl text-start" />
                <span>Active</span>
              </p>
            </div>
          </div>
          <div className="w-full ">
            <h6 className=" text-sm mb-0">Profile Completion</h6>
            <Space direction="vertical" className="w-full">
              <Progress percent={80} />
            </Space>
          </div>
          <div className=" flex justify-between bg-[#F6F8FB] rounded-full">
            <div className="">
              <MdLocalPhone className=" text-2xl p-1 bg-primary rounded-full text-white" />
              <div className="">
                <p className="opacity-50 text-[12px] mb-0">Phone Number</p>
                <p className=" text-sm mb-0">+91 5512121212</p>
              </div>
            </div>
            <MdContentCopy />
          </div>
        </div>
        <div className=" col-span-8"></div>
      </div>
    </div>
  );
}
