import React, { useEffect, useRef, useState } from "react";
import company_img from "../../assets/images/Rectangle 363.png";
import Arrow_Top from "../../assets/images/Vector.svg";
import Arrow_Bottom from "../../assets/images/Vector_bottom.svg";
// import Button from "react-bootstrap/esm/Button";
import { PiDotOutlineFill, PiDotsSixVerticalBold } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Popover } from "antd";
import API from "../Api";
import axios from "axios";

import { companyIdSet } from "../../Redux/slice";
import { getCompanyList } from "../common/Functions/commonFunction";

export default function OrganisactionMenu() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const layout = useSelector((state) => state.layout.value);
  const [isHamburgerClicked, setHamburgerClicked] = useState(
    JSON.parse(localStorage.getItem("hamburgerClicked"))
  );

  const [companyData, setCompanyData] = useState();

  const [organisationId, setOrganisationId] = useState(
    localStorage.getItem("organisationId")
  );

  const getCompany = async () => {
    const result = await getCompanyList(organisationId);
    console.log(result);
    localStorage.setItem("companyId", result[0].companyId);
    setCompanyData(result);
  };
  useEffect(() => {
    setOrganisationId(localStorage.getItem("organisationId"));
    getCompany();
    // getCompanyList();
    // console.log(companyData, "companyData ");
  }, []);

  const [company, setCompany] = useState({
    image: company_img,
    title: t("Cordova_Solutions"),
    members: t("Team_plan"),
  });
  // {t("Reset_to_default")}
  //   const [companyImage,setCompanyImage]=useState()
  //   const [title,setTitle]=useState()
  //   const []
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const storedHamburgerClicked = JSON.parse(
    localStorage.getItem("hamburgerClicked")
  );
  const content = (
    <div
      className="z-50 mt-2 "
      onMouseLeave={() => {
        setShow(!show);
        console.log("wwwwwwww");
      }}
    >
      {/* <div className="block rounded-xl dark:bg-[#292F3D] bg-[#f4f4f4] p-2 shadow-2xl"> */}
      {companyData?.map((each, i) => (
        <div
          key={i}
          className="flex items-center justify-between cursor-pointer group "
          onClick={() => {
            console.log(each.companyId, "each.companyId");
            localStorage.setItem("companyId", each.companyId);

            setCompany({
              image: company_img,
              title: each.company,
              // members: "4.5K members",
            });
            setShow(!show);
            window.location.reload();
          }}
        >
          {/* // <div className="block"> */}
          <div className="flex items-center w-full p-2 transition-all duration-300 rounded-lg hover:bg-primary hover:bg-opacity-10">
            <PiDotsSixVerticalBold className="mr-2 text-xl text-[#d6d6d6] " />
            <img
              src={company_img}
              alt=""
              className="p-1 bg-slate-100 rounded-xl"
            />
            <div className="block px-2 ">
              <p className="mb-0 text-sm group-hover:text-white font-Graphik">
                {each.company}
              </p>
              {/* <div className="flex">
                <p className="mb-0 text-sm opacity-50 group-hover:text-white font-Graphik">
                  Team plan
                </p>
                {/* <span className="px-1 mb-0 text-sm opacity-50">.</span> *
                <PiDotOutlineFill className="mb-0 text-2xl group-hover:text-white opacity-40 " />
                <p className="mb-0 text-sm opacity-50 group-hover:text-white">
                  4.5K members
                </p>
              </div> */}
            </div>
          </div>
          {/* // </div> */}
        </div>
      ))}
      {/* </div> */}
    </div>
  );

  return (
    <Popover content={content} placement="right" trigger="click">
      <button
        ref={target}
        onClick={() => setShow(!show)}
        className="w-full p-2 rounded-[10px] bg-[#F4F4F4] border border-black border-opacity-10 dark:bg-[#292F3D]"
      >
        <div className="flex items-center justify-between ">
          <div className="flex items-center">
            <img src={company.image} alt="" className="rounded-full w-9 h-9" />
            <div className="flex flex-col items-start ltr:pl-2 rtl:pr-2">
              <p className="p-0 mb-0 text-xs font-medium dark:text-white">
                {company.title}
              </p>
              {/* <p className="mb-0 text-xs opacity-50 dark:text-white">
                {company.members}
              </p> */}
            </div>
          </div>
          <div className="pr-2 ">
            <img src={Arrow_Top} alt="" className="px-2 pb-1" />
            <img src={Arrow_Bottom} alt="" className="px-2" />
          </div>
        </div>
      </button>
    </Popover>
  );
}
