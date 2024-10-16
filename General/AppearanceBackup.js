import React, { useEffect, useState } from "react";
import themeImg from "../../assets/images/light-mode.png";
import { RxDot } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import { PiDotOutlineFill } from "react-icons/pi";
import ToggleBtn from "../common/ToggleBtn";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, rtl } from "../../Redux/layoutSlice";
import Select from "react-select";
export default function Appearance() {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();

  const [themeModeSelect, setThemeModeSelect] = useState("light");
  const [languageChange, setLanguageChange] = useState(
    localStorage.getItem("layout") === "rtl"
      ? { value: "ar", label: "Arabic" }
      : { value: "en", label: "English" }
  );
  const themeModes = [
    {
      id: 1,
      image: themeImg,
      mode: "light",
      themeTitle: "System - Light",
    },
    {
      id: 2,
      image: themeImg,
      mode: "dark",
      themeTitle: "System - Dark",
    },
    {
      id: 3,
      image: themeImg,
      mode: "pink",
      themeTitle: "Custom - Pink",
    },
  ];
  const options = [
    { value: "en", label: "English" },
    { value: "ar", label: "Arabic" },
  ];
  const recentAppOptions = [
    { value: "", label: "App One" },
    { value: "", label: "App Two" },
  ];
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };
  return (
    <div className="p-2 -z-10">
      <div className="justify-start block p-2 pt-3 ">
        <h1 className="pb-2 text-xl dark:text-white">{t("Appearance")}</h1>
        <p className="text-xs dark:text-white opacity-70">
          {t("Appearance_Description")}
        </p>
      </div>
      {/* Inter face theme */}
      <div className="justify-center block grid-cols-12 gap-2 p-2 pt-3 border md:grid rounded-xl">
        <div className="p-2 md:col-span-4">
          <p className="mb-1 text-lg dark:text-white">
            {t("Inter_face_theme")}
          </p>
          <p className="w-48 text-xs dark:text-white opacity-70">
            {t("Inter_face_theme_Description")}
          </p>
        </div>
        <div className="relative items-center block gap-3 p-2 mb-1 md:col-span-7 md:flex px-auto justify-evenly">
          {themeModes?.map((each) => (
            <div
              className={`systen_theam md:mx-0 mx-auto xl:w-[184px] md:my-0 my-2  md:w-[150px] w-[184px]  relative block justify-center items-end border-2  ${
                themeModeSelect === each.mode
                  ? "border-primary"
                  : "border-[#b8b7b7]"
              }   bg-[#d9d9d9] dark:bg-ash`}
              onClick={() => setThemeModeSelect(each.mode)}
            >
              <img
                src={each.image}
                alt=""
                className="flex items-center justify-center p-3"
              />

              <div
                className={` mb-0 p-2 dark:bg-ash bg-[#fff] flex justify-start items-center w-full rounded-b-[13px]  ${
                  themeModeSelect === each.mode ? "" : ""
                } `}
              >
                <RxDot
                  className={`text-3xl ${
                    themeModeSelect === each.mode ? "text-primary" : ""
                  } `}
                />
                <p className=" dark:text-white mb-0 md:text-[13px]">
                  {each.themeTitle}
                </p>
              </div>
              {themeModeSelect === each.mode && (
                <TiTick className="absolute text-white rounded-full -top-2 -right-2 bg-primary text-md dark:bg-ash" />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Sidebar Feacture */}
      <div className="grid-cols-12 gap-2 p-2 pt-3 my-4 border md:grid rounded-xl">
        <div className="p-2 md:col-span-4">
          <p className="mb-1 dark:text-white text-md">
            {t("Sidebar_Feacture")}
          </p>
          <p className="text-xs dark:text-white opacity-70">
            {t("Sidebar_Feacture_Description")}
          </p>
        </div>
        <div className="items-center block gap-5 p-2 mb-1 md:col-span-4">
          {/* <select
            className="relative form-select before:border-none"
            aria-label="Default select example "
          >
            <PiDotOutlineFill className="absolute text-green-700 " />

            <option selected>
              {/* <span className="flex items-center text-xl text-green-700 ">. 
            </span>
              *
              {t("Recent_used_apps")}
            </option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select> */}
          <Select
            // defaultValue={languageChange}
            onChange={(e) => {
              // setLanguageChange(e.value)
              // changeLanguage(e.value);
              console.log(e.value);
            }}
            options={recentAppOptions}
            placeholder={t("Recent_used_apps")}
            // className="text-sm "
            classNames={{
              control: (state) =>
                state.isFocused
                  ? "border-red-600"
                  : "border-grey-300 dark:bg-ash dark:text-white ",
            }}
          />
        </div>
      </div>

      <div className="grid-cols-12 gap-2 p-2 pt-3 my-4 border md:grid rounded-xl">
        <div className="p-2 md:col-span-4">
          <p className="mb-1 text-md dark:text-white">{t("Language")}</p>
          <p className="text-xs opacity-70 dark:text-white">
            {t("Language_Description")}
          </p>
        </div>
        <div className="items-center block gap-5 p-2 mb-1 md:col-span-4">
          {/* <select
            className="relative w-full p-2 pr-5 bg-white border rounded-md before:border-none"
            aria-label="Default select example "
            onChange={(e) => {
              changeLanguage(e.target.value);
              // rtl("rtl" );
              // dispatch(increment(1))
              // console.log(e.target.value === "ar" ? "rtl" : "ltr");
                // save theme to local storage
    localStorage.setItem('layout', e.target.value === "ar" ? "rtl" : "ltr");
              dispatch(rtl(e.target.value === "ar" ? "rtl" : "ltr"));
            }}
          >
            <PiDotOutlineFill className="absolute top-0 left-0 text-green-700 " />

            <option selected className="pl-5" value="en">
              {/* <span className="flex items-center text-xl text-green-700 ">. 
            </span>
              *
              English
            </option>
            {/* <option value="en">One</option> *
            <option value="ar">Arabic</option>
            {/* <option value="3">Three</option> *
          </select> */}
          <Select
            defaultValue={languageChange}
            onChange={(e) => {
              // setLanguageChange(e.value)
              changeLanguage(e.value);
              localStorage.setItem("layout", e.value === "ar" ? "rtl" : "ltr");
              dispatch(rtl(e.value === "ar" ? "rtl" : "ltr"));
              // console.log(e.value);
            }}
            options={options}
            placeholder="Choose Language"
            // className="text-sm "
            classNames={{
              control: (state) =>
                state.isFocused
                  ? "border-red-600"
                  : "border-grey-300 dark:bg-ash dark:text-white ",
            }}
          />
          <div className="flex items-start my-4">
            <ToggleBtn />

            <div className="px-4 ">
              <p className="mb-1 text-sm dark:text-white">
                {t("Show_Arabic_in_table_fields")}
              </p>
              <p className="text-xs opacity-70 dark:text-white">
                {t("Show_Arabic_in_table_fields_Description")}
              </p>
            </div>
          </div>
          <div className="flex items-start my-4">
            <ToggleBtn />

            <div className="px-4 ">
              <p className="mb-1 text-sm dark:text-white">{t("Enable")}</p>
              <p className="text-xs opacity-70 dark:text-white">
                {t("Enable_Description")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid-cols-12 gap-2 p-2 pt-3 my-4 border md:grid rounded-xl">
        <div className="p-2 md:col-span-4">
          <p className="mb-1 1text-md dark:text-white">
            {t("Search_Command_Bar")}
          </p>
          <p className="text-xs opacity-70 dark:text-white">
            {t("Search_Command_BarDescription")}
          </p>
        </div>
        <div className="items-center block gap-5 p-2 mb-1 md:col-span-4">
          <div className="flex items-start my-4">
            <ToggleBtn />
            <div className="px-4 ">
              <p className="mb-1 text-sm dark:text-white">
                {t("Show_Suggestion")}
              </p>
              <p className="text-xs opacity-70 dark:text-white">
                {t("Show_Suggestion_Description")}
              </p>
            </div>
          </div>
          <div className="flex items-start my-4">
            <ToggleBtn />

            <div className="px-4 ">
              <p className="mb-1 text-sm dark:text-white">
                {t("Disable_Voice_Comma")}
              </p>
              <p className="text-xs opacity-70 dark:text-white">
                {t("Disable_Voice_Comma_Description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/*kjplokql;k  alknokjwqmgi i will do th work with in an hour and complete the task that can be doen with 5 days should be doen this hould be this functioncan bedone in the process  */