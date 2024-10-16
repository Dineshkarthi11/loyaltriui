// ThemeContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { mode, themeColor } from "../../Redux/slice";
import { lightenColor } from "../../components/common/lightenColor";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const chroma = require("chroma-js");

  
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const defaultColor = "#6A4BFC"; 
  const [color, setColor] = useState(
    localStorage.getItem("mainColor") || defaultColor
  );

  

  useEffect(() => {
    const rgbaColor = hexToRGBA(color);
    document.documentElement.style.setProperty("--primary-color", color);
    document.documentElement.style.setProperty("--primary", rgbaColor);

    // Light color
    const rgbaColorArray = rgbaColor.split(",").map(Number);
    const originalColor = chroma.rgb(rgbaColorArray);
    const lighterColor = originalColor.mix("white", 0.8); // Mix with white to lighten

    document.documentElement.style.setProperty(
      "--primaryLight",
      lighterColor.css()
    );
    // const lightColor = lightenColor(color, 50);
    // document.documentElement.style.setProperty("--primaryLight", lightColor);

    localStorage.setItem("mainColor", color);
    dispatch(mode(theme));
    dispatch(themeColor(color));
  }, [color, theme, dispatch]);

  const hexToRGBA = (hex, alpha) => {
    let r = parseInt(hex?.slice(1, 3), 16);
    let g = parseInt(hex?.slice(3, 5), 16);
    let b = parseInt(hex?.slice(5, 7), 16);

    if (alpha) {
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
      return `${r}, ${g}, ${b}`;
    }
  };

  const toggleTheme = (themeMode) => {
    setTheme(themeMode);
    localStorage.setItem("theme", themeMode);
  };

  const changeColor = (newColor) => {
    // console.log(newColor);
    setColor(newColor);
    localStorage.setItem("mainColor", newColor);
    // localStorage.setItem("mainColorLight", newColor);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, changeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
