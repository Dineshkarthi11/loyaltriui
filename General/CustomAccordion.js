import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { IoIosArrowForward } from "react-icons/io";
import { FlagIcon } from "react-flag-kit";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { rtl } from "../../Redux/slice";
import ToggleBtn from "../common/ToggleBtn";
import { useMediaQuery } from "react-responsive";

const CustomAccordion = ({ saved_theme, value }) => {
  const isSmallScreen = useMediaQuery({ maxWidth: 1439 });
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const [languageChange, setLanguageChange] = useState(
    localStorage.getItem("layout") === "rtl" ? "ar" : "en"
  );
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("layout", language === "ar" ? "rtl" : "ltr");
    dispatch(rtl(language === "ar" ? "rtl" : "ltr"));
  };


  const mode = useSelector((state) => state.layout.rtl);
  useEffect(() => {
    if (mode) {
      setLanguageChange(mode === "rtl" ? "ar" : "en");
    }
  }, [mode]);

  const { Option } = Select;
  const languageOptions = [
    { value: "en", label: "English", code: "US" },
    { value: "ar", label: "Arabic", code: "AE" },
  ];

  const [accordionData, setAccordionData] = useState([
    {
      id: 1,
      title: t("Language"),
      description: t("Language_Description"),
      contents: [
        {
          id: 1,
          title: t("Select_Language"),
          subtitle: t("Select_Language_Description"),
          value: "language",
          input: true,
          switch: false,
          isActive: false,
        },
        {
          id: 2,
          title: t("Show_Arabic_in_table_fields"),
          subtitle: t("Show_Arabic_in_table_fields_Description"),
          value: "showArabic",
          input: false,
          switch: true,
          isActive: value.showArabic,
        },
        {
          id: 3,
          title: t("Show_Suggestion"),
          subtitle: t("Show_Suggestion_Description"),
          value: "showSuggestion",
          input: false,
          switch: true,
          isActive: value.showSuggestion,
        },
      ],
    },
    {
      id: 2,
      title: t("Search_Command_Bar"),
      description: t("Search_Command_BarDescription"),
      contents: [
        {
          id: 4,
          title: t("Disable_Voice_Comma"),
          subtitle: t("Disable_Voice_Comma_Description"),
          value: "disablevoiceCommands",
          input: false,
          switch: true,
          isActive: value.disablevoiceCommands,
        },
        {
          id: 5,
          title: t("Show_Suggestion"),
          subtitle: t("Show_Suggestion_Description"),
          value: "showdisablevoiceSuggestion",
          input: false,
          switch: true,
          isActive: value.showdisablevoiceSuggestion,
        },
      ],
    },
  ]);

  const [expanded, setExpanded] = useState(
    Object.fromEntries(accordionData.map((item) => [item.id, true]))
  );
  const toggleAccordion = (id) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  const handleToggleList = (id, value, checked) => {
    const updatedAccordionData = accordionData.map((section) => ({
      ...section,
      contents: section.contents.map((content) =>
        content.id === id ? { ...content, isActive: checked } : content
      ),
    }));

    setAccordionData(updatedAccordionData);
    saved_theme(value, checked);
  };

  return (
    <div className="relative flex flex-col gap-6">
      {accordionData.map((item) => (
        <div
          key={item.id}
          className="borderb rounded-lg"
        >
          <h2>
            <button
              type="button"
              className="flex items-center justify-between w-full px-6 py-4 font-semibold text-left"
              onClick={() => toggleAccordion(item.id)}
              aria-expanded={expanded[item.id]}
              aria-controls={`acco-text-${item.id}`}
            >
              <div className="text-left rtl:text-right">
                <h1 className="acco-subhead">{item.title}</h1>
                <p className="para">{item.description}</p>
              </div>
              <div className="rounded-[4px] bg-secondaryWhite dark:bg-secondaryDark p-[5px]">
                <IoIosArrowForward
                  size={18}
                  className={`transition duration-300 ease-out origin-center transform text-black text-opacity-20 dark:text-white dark:text-opacity-20 ${
                    expanded[item.id] ? "!rotate-90" : ""
                  }`}
                />
              </div>
            </button>
          </h2>
          <div
            id={`acco-text-${item.id}`}
            role="region"
            aria-labelledby={`acco-title-${item.id}`}
            className={`grid overflow-hidden text-sm transition-all duration-300 ease-in-out ${
              expanded[item.id]
                ? "grid-rows-[1fr] opacity-100 p-6 border-t border-secondaryDark dark:border-white border-opacity-10 dark:border-opacity-20"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="flex flex-col gap-8 overflow-hidden">
              {item.contents.map((subitems) => (
                <div key={subitems.id} className="input-group">
                  <div>
                    <p className="acco-subhead">{subitems.title}</p>
                    <p className="para">{subitems.subtitle}</p>
                  </div>
                  <div className="w-full form-select md:w-80">
                    {subitems.input ? (
                      <Select
                        className="text-white"
                        style={{
                          width: "100%",
                        }}
                        value={languageChange}
                        onChange={(value) => {
                          setLanguageChange(value);
                          changeLanguage(value);
                          localStorage.setItem(
                            "layout",
                            value === "ar" ? "rtl" : "ltr"
                          );
                          dispatch(rtl(value === "ar" ? "rtl" : "ltr"));

                          saved_theme(subitems.value, value);
                        }}
                        size={isSmallScreen ? "default" : "large"}
                        optionFilterProp="children"
                        filterSort={(optionA, optionB) => {
                          const labelA = optionA.children
                            ?.toString()
                            .toLowerCase();
                          const labelB = optionB.children
                            ?.toString()
                            .toLowerCase();
                          return labelA.localeCompare(labelB);
                        }}
                      >
                        {languageOptions.map((language) => (
                          <Option key={language.value} value={language.value}>
                            <div className="flex items-center gap-3 country-option">
                              <div>
                                <FlagIcon
                                  code={language.code}
                                  className="w-5 h-5 rounded-full"
                                />
                              </div>
                              <span>{language.label}</span>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    ) : (
                      <ToggleBtn
                        className="md:float-right rtl:md:float-left"
                        value={subitems.isActive}
                        change={(checked) => {
                          handleToggleList(subitems.id, subitems.value, checked);
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomAccordion;
