import React, { useState } from "react";
import logo from "../../assets/images/logo.png";

import Discover from "../../assets/images/compass-3-fill.svg";
import Company from "../../assets/images/building 1.svg";
import Payroll from "../../assets/images/usd-circle (1).svg";
import Time from "../../assets/images/clock-three.svg";
import Recruitment from "../../assets/images/users 1.svg";
import Performance from "../../assets/images/dashboard.svg";
import company_img from "../../assets/images/Rectangle 363.png";
import Arrow_Top from "../../assets/images/Vector.svg";
import Arrow_Bottom from "../../assets/images/Vector_bottom.svg";

// import Collapse from "react-bootstrap/Collapse";
// import Button from "react-bootstrap/Button";

import Appearance from "../../assets/images/mail-open-line.svg";
import Settings from "../../assets/images/Frame 530632.svg";
import Help from "../../assets/images/Frame 53063.svg";
import { AiOutlineHome, AiOutlineLink } from "react-icons/ai";
import Menus from "./Menus";
// import Toast from "react-bootstrap/Toast";
import { Link } from "react-router-dom";
import OrganisactionMenu from "./OrganisactionMenu";
import menusLanguage from "../Language/Menus/English";
import { useTranslation } from "react-i18next";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineNotifications,
} from "react-icons/md";
// import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { RiStackFill } from "react-icons/ri";
import { LuUser2 } from "react-icons/lu";
import { CgFileDocument } from "react-icons/cg";
import { IoColorPaletteOutline } from "react-icons/io5";

export default function Home() {
  const { t } = useTranslation();

  const [menu, setMenu] = useState(t("Discover"));
  const [show, setShow] = useState(false);
  const [showSideMenu, setShowideMenu] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const menus = [
    { id: 1, title: t("Discover"), icon: Discover },
    { id: 2, title: t("Company"), icon: Company },
    { id: 3, title: t("Payroll"), icon: Payroll },
    { id: 4, title: t("Time"), icon: Time },
    { id: 5, title: t("Recruitment"), icon: Recruitment },
    { id: 6, title: t("Performance"), icon: Performance, ddhdh: [{}] },
  ];
  const menusTwo = [
    { id: 1, title: t("Settings"), icon: Settings },
    { id: 2, title: t("Help"), icon: Help },
  ];
  const subMenusOne = [
    { id: 1, title: t("Appearance"), icon: Appearance },
    { id: 2, title: t("Notification"), icon: Appearance },
    { id: 3, title: t("User_Privileges"), icon: Appearance },
  ];
  const subMenusTwo = [
    { id: 1, title: t("Settings"), icon: Appearance },
    { id: 2, title: t("Company"), icon: Appearance },
    { id: 3, title: t("Designation"), icon: Appearance },
    { id: 4, title: t("Document_Types"), icon: Appearance },
    { id: 5, title: t("Assets_Types"), icon: Appearance },
    
  ];
  const discoverMenu = [
    {
      id: 1,
      title: t("Employees"),
      status: false,
      subMenu: [
        {
          id: 1,
          title: t("Appearance"),
          icon: <IoColorPaletteOutline className="mx-2 text-xl" />,
          link: "/appearance",
        },
        {
          id: 2,
          title: t("Notification"),
          icon: <MdOutlineNotifications className="mx-2  text-xl" />,
          link: "/notification",
        },
        {
          id: 3,
          title: t("User_Privileges"),
          icon: <AiOutlineLink className="mx-2  text-xl" />,
          link: "/userPrivileges",
        },
      ],
    },
    // {
    //   id: 2,
    //   title: t("Organisation"),
    //   status: false,
    //   subMenu: [
    //     {
    //       id: 1,
    //       title: t("Settings"),
    //       icon: <RiStackFill className="mx-2  text-xl" />,
    //       link: "/organisaction",
    //     },
    //     {
    //       id: 2,
    //       title: t("Company"),
    //       icon: <HiOutlineBuildingOffice2 className="mx-2  text-xl" />,
    //       link: "/company",
    //     },
    //     {
    //       id: 3,
    //       title: t("Designation"),
    //       icon: <LuUser2 className="mx-2  text-xl" />,
    //       link: "/designation",
    //     },
    //     {
    //       id: 4,
    //       title: t("Document_Types"),
    //       icon: <CgFileDocument className="mx-2  text-xl" />,
    //       link: "/documentTypes",
    //     },
    //     {
    //       id: 5,
    //       title: t("Assets_Types"),
    //       icon: <AiOutlineHome className="mx-2  text-xl" />,
    //       link: "/assetsTypes",
    //     },
    //   ],
    // },
    {
      id: 2,
      title: t("Recruitment"),
      status: false,
      subMenu: [
        {
          id: 1,
          title: t("Employees"),
          icon: <RiStackFill className="mx-2  text-xl" />,
          link: "/employees",
        },
        {
          id: 2,
          title: t("Employees Deatils"),
          icon: <RiStackFill className="mx-2  text-xl" />,
          link: "/employeesDeatils",
        },
        {
          id: 3,
          title: "Shift",
          icon: <RiStackFill className="mx-2  text-xl" />,
          link: "/shift",
        },
        {
          id: 4,
          title: "Shift Scheme",
          icon: <RiStackFill className="mx-2  text-xl" />,
          link: "/shiftScheme",
        },
        {
          id: 5,
          title: "Assign shift",
          icon: <RiStackFill className="mx-2  text-xl" />,
          link: "/assignshift",
        },
      ],
    },
  ];
  const companyMenu = [
    {
      id: 1,
      title: t("General"),
      status: false,
      subMenu: [
        {
          id: 1,
          title: t("Appearance"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/appearance",
        },
        {
          id: 2,
          title: t("Notification"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/employee",
        },
        {
          id: 3,
          title: t("User_Privileges"),
          icon: <AiOutlineHome className="mx-2" />,
        },
      ],
    },
    {
      id: 2,
      title: t("Organisation"),
      status: false,
      subMenu: [
        {
          id: 1,
          title: t("Settings"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/organisaction",
        },
        {
          id: 2,
          title: t("Company"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/company",
        },
        {
          id: 3,
          title: t("Designation"),
          icon: <AiOutlineHome className="mx-2" />,
        },
        {
          id: 4,
          title: t("Document_Types"),
          icon: <AiOutlineHome className="mx-2" />,
        },
        {
          id: 5,
          title: t("Assets_Types"),
          icon: <AiOutlineHome className="mx-2" />,
        },
      ],
    },
  ];

  const payRollMenu = [
    {
      id: 1,
      title: t("Employees"),
      status: false,
      subMenu: [
        {
          id: 1,
          title: t("Appearance"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/appearance",
        },
        {
          id: 2,
          title: t("Notification"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/employee",
        },
        {
          id: 3,
          title: t("User_Privileges"),
          icon: <AiOutlineHome className="mx-2" />,
        },
      ],
    },
    {
      id: 2,
      title: t("Organisation"),
      status: false,
      subMenu: [
        {
          id: 1,
          title: t("Settings"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/organisaction",
        },
        {
          id: 2,
          title: t("Company"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/company",
        },
        {
          id: 3,
          title: t("Designation"),
          icon: <AiOutlineHome className="mx-2" />,
        },
        {
          id: 4,
          title: t("Document_Types"),
          icon: <AiOutlineHome className="mx-2" />,
        },
        {
          id: 5,
          title: t("Assets_Types"),
          icon: <AiOutlineHome className="mx-2" />,
        },
      ],
    },
  ];
  const timeMenu = [
    {
      id: 1,
      title: t("General"),
      status: false,
      subMenu: [
        {
          id: 1,
          title: t("Appearance"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/appearance",
        },
        {
          id: 2,
          title: t("Notification"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/employee",
        },
        {
          id: 3,
          title: t("User_Privileges"),
          icon: <AiOutlineHome className="mx-2" />,
        },
      ],
    },
  ];
  const recruitmentMenu = [
    {
      id: 1,
      title: t("General"),
      status: false,
      subMenu: [
        {
          id: 1,
          title: t("Appearance"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/appearance",
        },
        {
          id: 2,
          title: t("Notification"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/employee",
        },
        {
          id: 3,
          title: t("User_Privileges"),
          icon: <AiOutlineHome className="mx-2" />,
        },
        
      ],
    },
  ];
  const performanceMenu = [
    {
      id: 1,
      title: t("General"),
      status: false,
      subMenu: [
        {
          id: 1,
          title: t("Appearance"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/appearance",
        },
        {
          id: 2,
          title: t("Notification"),
          icon: <AiOutlineHome className="mx-2" />,
          link: "/employee",
        },
        {
          id: 3,
          title: t("User_Privileges"),
          icon: <AiOutlineHome className="mx-2" />,
        },
      ],
    },
  ];

  return (
    <div className=" flex ltr:pl-3 py-2 rtl:pr-3  dark:bg-black h-screen  sticky top-0 ">
      {/* Menus section */}
      {/* accent_background */}

      <div className=" w-20  dark:bg-black bg-slateBlue border h-full  ltr:rounded-l-3xl rtl:rounded-r-3xl text-center ">
        <div className="px-2 pt-2">
          <img
            className=" text-white xl:px-1 px-2 lg:pb-3 pt-1"
            src={logo}
            alt=""
          />
        </div>

        <div className="lg:h-screen w-20  relative ">
          {/* pb-5 items-center */}
          <div className=" w-20   ">
            {menus?.map((each, index) => (
              <div
                key={index}
                className="text-center flex justify-center cursor-pointer"
              >
                <div className="block justify-center">
                  <div
                    className="flex justify-center mt-2"
                    onClick={() => {
                      setMenu(each.title);
                      setShowideMenu(true);
                      // alert(each.title);
                    }}
                  >
                    <div className="menu_background xl:rounded-[12px] rounded-[8px] w-9 flex justify-center p-2">
                      <img
                        src={each.icon}
                        alt=""
                        key={index}
                        className="block justify-center text-white iconSize  text-center"
                      />
                    </div>
                  </div>
                  <p className="icon_text_color px-4 pt-1 mb-0 font-Graphik text-[11px] text-white ">
                    {each.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className=" w-20  absolute bottom-2">
          {menusTwo?.map((each, index) => (
            <div
              key={index}
              className="my-1 text-center flex justify-center items-end cursor-pointer"
            >
              <div className="block justify-center">
                <div
                  className="flex justify-center "
                  onClick={() => {
                    setMenu(each.title);
                    setShowideMenu(true);
                    // alert(each.title);
                  }}
                >
                  <div className="menu_background xl:rounded-[12px] rounded-[8px] w-9 flex justify-center p-2">
                    <img
                      src={each.icon}
                      alt=""
                      key={index}
                      className="block justify-center text-white iconSize  text-center"
                    />
                  </div>
                </div>
                <p className="icon_text_color px-4 pt-1 mb-0 font-Graphik text-[11px] text-white ">
                  {each.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu list  */}
      {/* <Toast
        onClose={() => setShowideMenu(false)}
        show={showSideMenu}
        delay={3000}
        style={{ maxWidth: 212, border: "none", boxShadow: "none" }}
        className="w-56 "
      >
        <div className=" block menu_style border ltr:rounded-r-xl rtl:rounded-l-xl h-full dark:bg-black ">
          <div className="pb-3 flex justify-between items-center">
            <h1 className="Loyaltri_text_color text-primary ps-2 text-xl mb-0">
              Loyaltri
            </h1>
            <div
              className=" pr-2 cursor-pointer"
              onClick={() => setShowideMenu(false)}
            >
              <MdOutlineKeyboardArrowLeft className="pb-1 px-2" />
            </div>
          </div>
          <OrganisactionMenu />
          <div className="pt-4 ">
            <Menus
              subMenus={
                menu === t("Discover")
                  ? null
                  : menu === t("Company")
                  ? null
                  : menu === t("Payroll")
                  ? null
                  : menu === t("Time")
                  ? null
                  : menu === t("Recruitment")
                  ? null
                  : menu === t("Performance")
                  ? null
                  : menu === t("Settings")
                  ? discoverMenu
                  : null
              }
            />
            <></>
          </div>
        </div>
      </Toast> */}
    </div>
  );
}
