import { motion } from "framer-motion";
import React from "react";
import { RiMoonClearFill, RiSunFill } from "react-icons/ri";
import { useTheme } from "../../Context/Theme/ThemeContext";

export default function DarkModeSwitch() {
  const { theme, toggleTheme, getPrimaryColor } = useTheme();
  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  const handleToggle = () => {
    toggleTheme(theme === "dark" ? "light" : "dark");
    // saveApperance(theme === "dark" ? "light" : "dark");
  };
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  return (
    <div
      onClick={handleToggle}
      className={`flex-start flex h-8 2xl:h-10 w-14 2xl:w-[72px] rounded-[50px] bg-secondaryWhite p-[4px] shadow-inner hover:cursor-pointer dark:bg-secondaryDark ${
        theme === "dark" && "place-content-end"
      }`}
    >
      <motion.div
        className="flex w-6 h-6 2xl:h-[30px] 2xl:w-[30px] items-center justify-center rounded-full bg-primary"
        layout
        transition={spring}
      >
        <motion.div whileTap={{ rotate: 360 }}>
          {theme === "dark" ? (
            <RiMoonClearFill className="w-4 h-4 text-white " />
          ) : (
            <RiSunFill className="w-4 h-4 text-white " />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
