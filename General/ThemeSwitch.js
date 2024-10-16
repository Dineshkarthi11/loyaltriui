import React from "react";
import { RxDot } from "react-icons/rx";
import { useTranslation } from "react-i18next";
import themeImg1 from "../../assets/images/light-mode.png";
import themeImg2 from "../../assets/images/dark-mode.png";
import { useTheme } from "../../Context/Theme/ThemeContext";
import axios from "axios";
import API from "../Api";

const ThemeSwitch = ({ change = () => {} }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme, getPrimaryColor } = useTheme();
  const handleRadioChange = (event) => {
    const themeValue = event.target.value;
    toggleTheme(themeValue);
    change(themeValue);
  };

  const loginData = JSON.parse(localStorage.getItem("LoginData"));

  return (
    <ul className="flex flex-wrap justify-center gap-4 sm:flex-nowrap">
      <li className="relative sm:w-36 2xl:w-52">
        <input
          className="sr-only peer"
          type="radio"
          value="light"
          name="theme"
          id="light"
          checked={theme === "light"}
          onChange={handleRadioChange}
        />
        <label
          className="flex flex-col overflow-hidden border-2 cursor-pointer rounded-xl focus:outline-none dark:border-secondaryDark peer-checked:border-accent"
          htmlFor="light"
        >
          <div className="h-full p-5 bg-[#D9D9D9] dark:bg-secondaryDark vhcenter">
            <img src={themeImg1} alt="" />
          </div>
          <div className="flex items-center h-10 pl-2 bg-white dark:bg-secondaryDark">
            <RxDot
              className={`text-xl 2xl:text-3xl ${
                theme === "light" ? "text-primary" : " text-[#A2A2A2]"
              } `}
            />
            <p className="mb-0 text-[10px] text-black  2xl:text-sm dark:text-white">
              {t("System - Light")}
            </p>
          </div>
        </label>
      </li>

      <li className="relative sm:w-36 2xl:w-52">
        <input
          className="sr-only peer"
          type="radio"
          value="dark"
          name="theme"
          id="dark"
          checked={theme === "dark"}
          onChange={handleRadioChange}
        />
        <label
          className="flex flex-col overflow-hidden border-2 cursor-pointer rounded-xl focus:outline-none dark:border-secondaryDark peer-checked:border-accent"
          htmlFor="dark"
        >
          <div className="h-full p-5 bg-[#D9D9D9] dark:bg-secondaryDark vhcenter">
            <img src={themeImg2} alt="" />
          </div>
          <div className="flex items-center h-10 pl-2 bg-white dark:bg-secondaryDark">
            <RxDot
              className={`text-xl 2xl:text-3xl ${
                theme === "dark" ? "text-primary" : " text-[#A2A2A2]"
              } `}
            />
            <p className="mb-0 text-[10px] text-black  2xl:text-sm dark:text-white">
              {t("System - Dark")}
            </p>
          </div>
        </label>
      </li>

      {/* <li className="relative sm:w-36 2xl:w-52">
        <input
          className="sr-only peer"
          type="radio"
          value="pink"
          name="theme"
          id="pink"
          checked={theme === "pink"}
          onChange={handleRadioChange}
        />
        <label
          className="flex flex-col overflow-hidden border-2 cursor-pointer rounded-xl focus:outline-none dark:border-secondaryDark peer-checked:border-accent"
          htmlFor="pink"
        >
          <div className="h-full p-5 bg-[#D9D9D9] dark:bg-secondaryDark vhcenter">
            <img src={themeImg3} alt="" />
          </div>
          <div className="flex items-center h-10 pl-2 bg-white dark:bg-secondaryDark">
            <RxDot
              className={`text-xl 2xl:text-3xl ${theme === "pink" ? "text-primary" : " text-[#A2A2A2]"
                } `}
            />
            <p className="mb-0 text-[10px] text-black  2xl:text-sm dark:text-white">
              {t("System_Pink")}
            </p>
          </div>
        </label >
      </li > */}
    </ul>
  );
};

export default ThemeSwitch;
