import React, { useEffect, useState } from "react";
import companyImg from "../../assets/images/Rectangle 363.png";
import { HiOutlineDotsVertical, HiOutlineMail } from "react-icons/hi";
import { IoMdCall } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import {
  AiFillFacebook,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { TfiWorld } from "react-icons/tfi";
import { LiaCopy } from "react-icons/lia";
import { PiDotOutlineFill, PiDotsSixVerticalBold } from "react-icons/pi";
import { IoCamera } from "react-icons/io5";

import { BiLogoLinkedinSquare, BiSolidEditAlt } from "react-icons/bi";
import OrganisationLanguage from "../Language/Organisation/English";
import { useTranslation } from "react-i18next";
import img from "../../assets/images/Avatar.png";
import logo from "../../assets/images/image 380.png";
import ToggleBtn from "../common/ToggleBtn";
import axios from "axios";
import API from "../Api";
import AddCompany from "./Company/AddCompany";
import { Switch } from "antd";

export default function OrganisationBackup() {
  const { t } = useTranslation();
  const [organisationList, setOrganisationList] = useState([]);
  const [show, setShow] = useState(false);
  const [toggle, setToggle] = useState();
  const [toggleId, setToggleId] = useState();
  const [countryList, setCountryList] = useState([]);

  const Contact = [
    {
      img: img,
      name: "Salma Hisham",
      CTO: "CTO",
      phone: "+971 50521252",
      email: "khadija@loyaltri.com",
      link: "www.mhtrust.com",
    },
    {
      img: img,
      name: "Salma Hisham",
      CTO: "CTO",
      phone: "+971 50521252",
      email: "khadija@loyaltri.com",
      link: "www.mhtrust.com",
    },
  ];

  const getRecord = async () => {
    const result = await axios.get(API.HOST + API.GET_ORGANISACTION_RECORDS);
    setOrganisationList(result.data.tbl_organisation);
  };

  useEffect(() => {
    getRecord();
  }, []);
  const handleToggle = (id, checked) => {
    // console.log(checked);
    // console.log(switches);
    setOrganisationList(
      (prevSwitches) =>
        prevSwitches?.map((sw) =>
          // console.log(sw.companyId , id )
          sw?.organisationId === id
            ? { ...sw, isActive: checked === true ? 1 : 0 }
            : sw
        )

      // prevSwitches.map((sw) => (sw.id === i ? { ...sw, value: checked } : sw))
    );
  };

  const updateOrganisaction = async (id, checked) => {
    const result = await axios.post(API.HOST + API.UPDATE_ORGANISACTION, {
      organisationId: id,
      isActive: checked === true ? 1 : 0,
    });
  };
  const getContryList = async () => {
    const result = await axios.get(API.HOST + API.GET_COUNTRY_LIST);
    if (result.status === 200) {
      result?.data?.tbl_country?.map((each, i) =>
        countryList.push({
          value: each.countryId,
          label: each.countryName,
        })
      );
    }
  };
  useEffect(() => {
    getContryList();
  }, []);

  return (
    <div className=" ">
      <div className=" bg-[#F1F1F1] h-[140px] dark:bg-ash"></div>
      <div className="  grid grid-cols-12 gap-4 border-b-2 border-b-[#e4e1e1]">
        <div className=" col-span-5 flex gap-2 pl-5">
          <div className=" block justify-center relative -top-5 ">
            <div className="relative  p-3 rounded-full bg-[#F3EDE9]  dark:bg-ash flex justify-center border-2 border-white shadow-sm">
              <img src={companyImg} alt="" className=" w-24 h-24" />
              <IoCamera className=" absolute  bottom-1 right-5 z-0 text-xl p-1 bg-accent text-white rounded-full " />
            </div>
            <div className="flex justify-center">
              <p className="mb-0 text-[10px]  text-center m-2 px-1 w-10  flex justify-center opacity-20 dark:text-white">
                {t("Remove_Image")}
              </p>
            </div>
          </div>
          <div className="p-3">
            <h1 className=" text-2xl dark:text-white pb-[18.5px]">MH TRUST</h1>
            <div className="flex items-center gap-[13px] justify-start text-sm pb-[16.5px] dark:text-white">
              <IoMdCall className="mr-2 dark:text-white" />
              <p> +971 50521252</p>
              <MdContentCopy className="dark:text-white " />
            </div>
            <div className="flex items-center gap-[13px] justify-start text-sm pb-[18.5px] dark:text-white">
              <HiOutlineMail className="mr-2 dark:text-white" />
              <p> khadija@loyaltri.com</p>
              <MdContentCopy className="dark:text-white " />
            </div>
            <div className="flex justify-around">
              <AiFillFacebook className="dark:text-white cursor-pointer text-4xl p-2  border rounded-full opacity-65 text-[#d3d1d1]" />
              <AiOutlineTwitter className="cursor-pointer dark:text-white text-4xl p-2  border rounded-full opacity-65 text-[#d3d1d1]" />
              <AiFillYoutube className="dark:text-white cursor-pointer text-4xl p-2  border rounded-full opacity-65 text-[#d3d1d1]" />
              <BiLogoLinkedinSquare className="dark:text-white cursor-pointer text-4xl p-2  border rounded-full opacity-65 text-[#d3d1d1]" />
            </div>
          </div>
        </div>
        <div className="col-span-7 grid grid-cols-12 pt-3">
          <div className=" col-span-4 ">
            <div className="pb-2">
              <p className="mb-0  text-[10px] opacity-70 dark:text-white ">
                {t("Address")}
              </p>
              <p className="text-xs font-bold dark:text-white ">
                9th Arcade, Swift Tower
              </p>
            </div>
            <div className="  pb-3">
              <div className="">
                <p className="mb-0  text-[10px] opacity-70 dark:text-white ">
                  {t("Country")}
                </p>
                <p className="text-xs font-bold dark:text-white ">
                  United Arab Emirates
                </p>
              </div>
            </div>
            <div className=" flex gap-2 items-center">
              <TfiWorld className="dark:text-white " />
              <p className="mb-0 text-xs dark:text-white "> www.mhtrust.com</p>
              <MdContentCopy className="dark:text-white " />
            </div>
          </div>
          <div className="col-span-4">
            <div className="pb-2">
              <p className="mb-0  text-[10px] opacity-70 dark:text-white ">
                {t("City")}
              </p>
              <p className="text-xs font-bold dark:text-white ">Dubai</p>
            </div>
            <div className="  pb-2">
              <div className="">
                <p className="mb-0  text-[10px] opacity-70 dark:text-white ">
                  {t("Region")}
                </p>
                <p className="text-xs font-bold dark:text-white ">
                  Eastern Region
                </p>
              </div>
            </div>
            <div className="  pb-2">
              <div className="">
                <p className="mb-0  text-[10px] opacity-70 dark:text-white ">
                  {t("Currency")}
                </p>
                <p className="text-xs font-bold dark:text-white ">AED</p>
              </div>
            </div>
          </div>
          <div className="col-span-4 block justify-end ">
            <div className="flex justify-end items-center">
              <button className="flex  items-center justify-center dark:text-white  text-white text-xs  rounded-md font-bold p-2 bg-accent">
                <BiSolidEditAlt className="mx-1 dark:text-white " />
                {t("Edit")}
              </button>
              <PiDotsSixVerticalBold className="mx-3 dark:text-white " />
            </div>
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-12 gap-4 px-4">
        <div className=" col-span-6  ">
          <h2 className="my-4 text-[16px] dark:text-white ">
            {t("ContactInfo")}
          </h2>
          <div className="grid grid-cols-9 ">
            {Contact.map((each, i) => (
              <div
                key={i}
                className=" col-span-4  dark:bg-ash text-[10px] border rounded-lg p-2 mr-3"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <img src={img} alt="" className="w-5" />
                  <p className="mb-0 text-[11px] dark:text-white ">
                    {each.name}
                  </p>
                  <p className="mb-0 text-[11px] opacity-60 dark:text-white ">
                    {each.CTO}
                  </p>
                  <HiOutlineDotsVertical className="dark:text-white  opacity-60" />
                </div>

                <p className="flex items-center justify-start text-[11px] mb-1.5 dark:text-white ">
                  <IoMdCall className="ltr:mr-2 rtl:ml-2 dark:text-white " />{" "}
                  {each.phone}
                  <MdContentCopy className="ltr:ml-2 rtl:mr-2 dark:text-white " />
                </p>
                <p className="flex items-center justify-start text-[11px] mb-1.5 dark:text-white ">
                  <HiOutlineMail className="ltr:mr-2 rtl:ml-2 dark:text-white  " />

                  {each.email}
                  <MdContentCopy className="ltr:ml-2 rtl:mr-2 dark:text-white " />
                </p>
                <p className="flex items-center justify-start text-[11px] mb-1.5 dark:text-white ">
                  <HiOutlineMail className="ltr:mr-2 rtl:ml-2 dark:text-white " />
                  {each.link}
                  <MdContentCopy className="ltr:ml-2 rtl:mr-2 dark:text-white " />
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className=" col-span-6 ">
          <h2 className="my-4 text-[16px] dark:text-white ">
            {t("Documents")}
          </h2>
          <div className=" h-28 p-3 border rounded-lg dark:bg-ash">
            <h2 className=" text-[11px] font-bold mb-3 dark:text-white ">
              EatX LLC
            </h2>
            <h2 className=" text-[11px] dark:text-white ">Tom & Serg LLC</h2>
          </div>
        </div>
      </div>
      <div className="  block justify-center items-center mb-4 ">
        <div className="flex justify-between items-center w-full px-4 py-4">
          <h2 className="mb-0 text-[16px] dark:text-white ">
            {t("Companylist")}
          </h2>
          <button
            type="submit"
            className="p-2 border rounded-md pl-5 bg-accent text-white text-xs"
            onClick={() => {
              setShow(true);
              // console.log("worked");
            }}
          >
            <span className="m-1 text-md dark:text-white ">+</span>{" "}
            {t("Add_Company")}
          </button>
        </div>
        {organisationList?.map((each, i) => (
          <div
            key={i}
            className=" font-Graphik grid grid-cols-12 gap-2 mx-4 my-1 border rounded-lg p-[18px]  items-center justify-center  dark:bg-ash "
          >
            <div className="flex justify-center">
              <img src={logo} alt="" className=" col-span-1  w-8" />
            </div>
            <div className="block col-span-2 px-2">
              <h2 className="mb-1 text-[12px] dark:text-white  font-bold">
                {each.organisation}
              </h2>
              <p className="mb-0 text-[11px] dark:text-white  opacity-60">
                {each.url}
              </p>
            </div>
            <div className="col-span-1">
              <p className={`  text-start mb-0 `}>
                <span
                  // className={`  text-green-800 px-2 py-1.5 bg-green-100 rounded-xl text-[10px]  dark:text-white `}
                  className={`${
                    parseInt(each?.isActive) === 1
                      ? "text-[green] bg-greenLight"
                      : "text-red-600 bg-redlight"
                  }  p-2  rounded-xl text-[10px]  dark:text-white font-bold`}
                >
                  {parseInt(each.isActive) === 1 ? "Active" : "InActive"}
                </span>
              </p>
            </div>
            <p className="text-[10px]   col-span-2 mb-0 dark:text-white  ">
              {/* Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit.. */}
              {each.description}
            </p>
            <div className=" col-span-3 text-center pl-2 ">
              <p className="flex items-center justify-start text-[11px] mb-1.5 dark:text-white ">
                <HiOutlineMail className="ltr:mr-2 rtl:ml-2 dark:text-white " />
                {each.email}
                <MdContentCopy className="ltr:ml-2 rtl:mr-2 dark:text-white " />
              </p>
              <p className="flex items-center justify-start text-[11px] mb-1.5 dark:text-white ">
                <HiOutlineMail className="ltr:mr-2 rtl:ml-2 dark:text-white " />
                {each.phone}
                <MdContentCopy className="ltr:ml-2 rtl:mr-2 dark:text-white " />
              </p>
            </div>
            <div className="flex items-center justify-start   col-span-2">
              <FaLocationDot className="ltr:pr-1 rtl:pl-1 text-md dark:text-white " />
              <p className=" text-[11px] mb-0 dark:text-white ">
                {each.address}
              </p>
            </div>
            <div className="col-span-1 flex justify-end items-center">
              {/* <ToggleBtn
                value={true}
                change={(e) => {
                  console.log(e);
                }}
              /> */}
              <Switch
                checked={parseInt(each?.isActive)}
                onChange={(checked) => {
                  handleToggle(each?.organisationId, checked);
                  setToggle(checked);
                  setToggleId(i);
                  // buttonClick(each.companyId);
                  // activeOrNot(checked);
                  updateOrganisaction(each?.organisationId, checked);
                }}
                className=" bg-[#c2c0c0aa]"
              />
              <HiOutlineDotsVertical className=" opacity-60 dark:text-white " />
            </div>
          </div>
        ))}
      </div>

      {show && (
        <AddCompany
          open={show}
          country={countryList}
          close={(e) => {
            // console.log(e);
            setShow(e);
          }}
        />
      )}
    </div>
  );
}
