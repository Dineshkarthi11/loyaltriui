import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomAccordion from "./CustomAccordion";
import ThemeSwitch from "./ThemeSwitch";
import API, { action } from "../Api";
import { useFormik } from "formik";
import * as yup from "yup";
import Dropdown from "../common/Dropdown";
import { useTheme } from "../../Context/Theme/ThemeContext";
import ThemeColor from "../common/ThemeColor";
import { useDispatch } from "react-redux";
import { rtl } from "../../Redux/slice";
import Loader from "../common/Loader";
import Heading from "../common/Heading";
import localStorageData from "../common/Functions/localStorageKeyValues";

const Appearance = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [appearanceDeatils, setAppearanceDeatils] = useState([]);

  const recentAppOptions = [
    {
      value: "1",
      label: "Recently Used Apps",
    },
    {
      value: "2",
      label: "Recently Used Pages",
    },
    {
      value: "3",
      label: "Top Pages",
    },
    {
      value: "4",
      label: "Identified Pages",
    },
    {
      value: "5",
      label: "Resolved Pages",
    },
    {
      value: "6",
      label: "Cancelled Pages",
    },
  ];

  const formik = useFormik({
    initialValues: {
      interfaceTheme: "",
      sidebarFeature: "",
      language: "",
      showArabic: "",
      showSuggestion: "",
      disablevoiceCommands: "",
      showdisablevoiceSuggestion: "",
      themeColor: "",
      // dateOfBirth: "",
      // bloodGroup: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      // firstName: yup.string().required("First Name is Required"),
      // lastName: yup.string().required("Last Name is Required"),
      // email: yup.string().required("Email is Required"),
      // mobile: yup.string().min(10).max(10).required("Mobile is Required"),
      // // gender: yup.string().required("Gender is Required"),
      // // dateOfBirth: yup.string().required("Date of Birth Group is Required"),
    }),
    onSubmit: async (e) => {
      // console.log(e, "eeeeeeeee");

      try {
        const result = await action(API.THEME_SETTINGS, {
          // id: appearanceId,
          employeeId: employeeId,
          appearanceDatas: {
            interfaceTheme: e.interfaceTheme,
            themeColor: e.themeColor,
            sidebarFeature: e.sidebarFeature,
            language: {
              selectLanguage: e.language,
              showArabicInTableFields: e.showArabic,
              showSuggestion: e.showSuggestion,
            },
            searchAndCommandBar: {
              disableVoiceCommands: e.disablevoiceCommands,
              showSuggestion: e.showdisablevoiceSuggestion,
            },
          },
          createdBy: employeeId,
        });
        // console.log(result);
        // }
      } catch (error) {
        console.log(error);
      }
    },
  });
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  const getAPPearance = async () => {
    try {
      const result = await action(API.GET_APPEARANCE_THEME, {
        employeeId: employeeId,
      });
      if (result.status === 200) {
        setAppearanceDeatils(result.result);

        toggleTheme(
          result.result?.appearanceDatas.interfaceTheme !== "" ||
            result.result?.appearanceDatas.interfaceTheme !== null
            ? result.result?.appearanceDatas.interfaceTheme
            : "light"
        );
        changeColor(
          result.result?.appearanceDatas.themeColor !== "" &&
            result.result?.appearanceDatas.themeColor !== null
            ? result.result?.appearanceDatas.themeColor
            : "#6A4BFC"
        );

        if (result.result?.appearanceDatas.interfaceTheme === "dark") {
          handleToggle(result.result?.appearanceDatas.interfaceTheme);
        } else {
          document.documentElement.classList.remove("dark");
        }
        localStorage.setItem(
          "layout",
          result.result?.appearanceDatas?.language?.selectLanguage === "ar"
            ? "rtl"
            : "ltr"
        );
        dispatch(
          rtl(
            result.result?.appearanceDatas?.language?.selectLanguage === "ar"
              ? "rtl"
              : "ltr"
          )
        );
        formik.setFieldValue(
          "interfaceTheme",
          result.result?.appearanceDatas.interfaceTheme
        );
        formik.setFieldValue(
          "themeColor",
          result.result?.appearanceDatas.themeColor !== "" ||
            result.result?.appearanceDatas.themeColor !== null
            ? result.result?.appearanceDatas.themeColor
            : "#6A4BFC"
        );

        formik.setFieldValue(
          "sidebarFeature",
          result.result?.appearanceDatas.sidebarFeature
        );
        formik.setFieldValue(
          "language",
          result.result?.appearanceDatas.language.selectLanguage
        );
        formik.setFieldValue(
          "showArabic",
          result.result?.appearanceDatas.language.showArabicInTableFields
        );
        formik.setFieldValue(
          "showSuggestion",
          result.result?.appearanceDatas.language.showSuggestion
        );
        formik.setFieldValue(
          "disablevoiceCommands",
          result.result?.appearanceDatas.searchAndCommandBar
            .disableVoiceCommands
        );
        formik.setFieldValue(
          "showdisablevoiceSuggestion",
          result.result?.appearanceDatas.searchAndCommandBar.showSuggestion
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAPPearance();
  }, []);

  const { changeColor } = useTheme();

  const handleToggle = (e) => {
    toggleTheme(e);
  };
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  return (
    <>
      {formik.values.themeColor ? (
        <div className="flex flex-col gap-6">
          <div>
            <Heading
              title={t("Appearance_settings")}
              description={t("Main_Description")}
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 box-wrapper !bg-transparent">
              <div className="flex flex-col justify-between gap-6 md:gap-3 md:flex-row">
                <div>
                  <p className="acco-subhead">{t("Inter_face_theme")}</p>
                  <p className="para">{t("Inter_face_theme_Description")}</p>
                </div>
                <ThemeSwitch
                  change={(e) => {
                    handleToggle(e);
                    console.log(e);
                    formik.setFieldValue("interfaceTheme", e);
                    formik.handleSubmit();
                  }}
                  value={formik.values.interfaceTheme}
                />
              </div>
              <div className="flex flex-col justify-between gap-3 md:items-center md:flex-row">
                <div>
                  <p className="acco-subhead">{t("Theme_color")}</p>
                  <p className="para">{t("Inter_face_theme_Description")}</p>
                </div>
                <ThemeColor
                  change={(e) => {
                    console.log(e, "eeeeeeeee");
                    formik.setFieldValue("themeColor", e);
                    formik.handleSubmit();
                  }}
                  value={formik.values.themeColor}
                />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 md:items-center md:gap-0 box-wrapper !bg-transparent md:flex-row">
              <div>
                <p className="acco-subhead">{t("Sidebar_feature")}</p>
                <p className="para">{t("Sidebar_feature_Description")}</p>
              </div>
              <div className="w-full form-select md:w-80">
                <Dropdown
                  value={formik.values.sidebarFeature || "1"}
                  change={(e) => {
                    formik.setFieldValue("sidebarFeature", e);
                    formik.handleSubmit();
                  }}
                  options={recentAppOptions}
                />
              </div>
            </div>

            <div>
              <CustomAccordion
                saved_theme={(name, value) => {
                  formik.setFieldValue(name, value);
                  formik.handleSubmit();
                  console.log(name, value);
                }}
                value={appearanceDeatils}
              />
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Appearance;
