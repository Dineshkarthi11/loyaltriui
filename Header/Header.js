import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import ProfileDropdown from "./ProfileDropdown";
import { CgMenuLeft } from "react-icons/cg";
import Notification from "./Notification";
import SelectCompany from "./SelectCompany";
import CommandMenu from "../common/CommandMenu";
import Trial from "./Trial";
import { decryptFun } from "../common/Functions/commonFunction";
import { SidebarResponsive } from "../Menus/SidebarResponsive";

export default function Header({ companyData = () => {} }) {
  const hamburger = useSelector((state) => state.layout.hamburger);
  const [isHamburgerClicked, setHamburgerClicked] = useState(false);
  const [localStorageData, setLocalStorageData] = useState(
    decryptFun(localStorage.getItem("encryptedData"))
  );

  const handleHamburgerClick = () => {
    setHamburgerClicked(!isHamburgerClicked);
  };
  // useEffect(() => {
  //   first;

  //   return () => {
  //     second;
  //   };
  // }, [third]);

  return (
    // <!-- component -->
    <nav
      className={`  bg-white w-full grid grid-cols-12 gap-2 relative justify-end items-center mx-auto px-4 lg:px-5 2xl:h-[70px] dark:bg-dark1 border-b border-opacity-10 dark:border-dark3/100 py-[14px] z-[999]`}
    >
      <div
        className={` ${
          hamburger === false
            ? "lg:col-span-1 hidden brand-name lg:block"
            : "sm:col-span-0 hidden"
        } `}
      >
        {hamburger === false && (
          <h1
            className="text-xl font-semibold 2xl:text-2xl text-primaryalpha dark:text-white"
            title="brand name"
          >
            Loyaltri
          </h1>
        )}
      </div>
      {/* hamburger */}
      <div className="h-full col-span-2 text-black sm:col-span-1 dark:text-white lg:hidden">
        <div
          className="hamburger w-8 h-full 2xl:w-[50px] rounded-md 2xl:rounded-xl  cursor-pointer dark:bg-dark2 bg-secondaryWhite flex justify-center items-center p-[6px]"
          onClick={handleHamburgerClick}
        >
          <div
            className={`flex-col gap-[2px] 2xl:gap-1 vhcenter ${
              isHamburgerClicked ? "is-active" : ""
            }`}
          >
            <span
              className={`line w-3 2xl:w-[18px] h-[1px] bg-black dark:bg-gray-100 block mx-auto transition-all duration-300 ease-in-out transform ${
                isHamburgerClicked ? "translate-x-[3px]" : ""
              }`}
            ></span>
            <span
              className={`line w-3 2xl:w-[18px] h-[1px] bg-black dark:bg-gray-100 block mx-auto transition-all duration-300 ease-in-out transform ${
                isHamburgerClicked ? "" : "translate-x-0"
              }`}
            ></span>
            <span
              className={`line w-3 2xl:w-[18px] h-[1px] bg-black dark:bg-gray-100 block mx-auto transition-all duration-300 ease-in-out transform ${
                isHamburgerClicked ? "-translate-x-[3px]" : ""
              }`}
            ></span>
          </div>
        </div>
      </div>
      <SidebarResponsive
        isHamburgerClicked={isHamburgerClicked}
        handleHamburgerClick={handleHamburgerClick}
      />

      <div
        className={` ${
          hamburger === false
            ? "vhcenter lg:col-span-2 md:col-span-3 sm:col-span-2  xl:col-span-2 col-span-3 2xl:col-span-2 4xl:col-span-3"
            : "col-span-3 sm:col-span-2 md:col-span-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3 4xl:col-span-4"
        } flex gap-4 items-center col-span-6`}
      >
        <SelectCompany
          selectCompanyData={(e) => {
            companyData(e);
          }}
        />
      </div>
      {/* <!-- search bar --> */}
      <div
        className="justify-end hidden 2xl:justify-center sm:block sm:col-span-5 md:col-span-4 lg:col-span-4 xl:col-span-3 2xl:col-span-4 4xl:col-span-3"
        title="search"
      >
        {localStorageData?.userData?.permissions.some(
          (id) => parseInt(id) === 28
        ) && <CommandMenu />}
      </div>
      {/* <div className="flex justify-end col-span-3 xl:justify-center sm:col-span-3 md:col-span-2 lg:col-span-2 xl:col-span-2 4xl:col-span-3">
        <DarkModeSwitch />
      </div> */}

      {/* <!-- login --> */}
      <div className="flex justify-end col-span-4 sm:col-span-4 md:col-span-4 lg:col-span-5 xl:col-span-6 2xl:col-span-5 4xl:col-span-5">
        {/* if DarkModeSwitch is show then uncomment beloy line and comment above */}
        {/* <div className="flex justify-end col-span-4 sm:col-span-3 md:col-span-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3 4xl:col-span-2"> */}
        <div className="relative flex items-center justify-end">
          <Trial className="hidden sm:flex" />
          <Notification />
          <ProfileDropdown />
        </div>
      </div>
      {/* <!-- end login --> */}
    </nav>
  );
}
