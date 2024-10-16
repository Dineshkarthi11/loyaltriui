import React from "react";
import { Card, Button } from "antd";
import { useTranslation } from "react-i18next";
// import Button from "../common/Button";

// ICONS
import { PiChartLineUpLight } from "react-icons/pi";
import { LuLayers } from "react-icons/lu";
import { FiCalendar } from "react-icons/fi";
import { LuMailPlus } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { FaCircleCheck } from "react-icons/fa6";
import { FaClock } from "react-icons/fa6";

// IMAGES
import Gmail from "../../assets/images/gmail.png";
import Teams from "../../assets/images/teams.png";
import User from "../../assets/images/user1.jpeg";

const TasksOverview = () => {
  const primaryColor = localStorage.getItem("mainColor");
  const { t } = useTranslation();
  const EmployeeTaskOverviewCard = [
    {
      id: 1,
      icon: <PiChartLineUpLight />,
      color: "#6A4BFC",
      title: "40%",
      subtitle: t("Card1_Subtitle"),
    },
    {
      id: 2,
      icon: <LuLayers />,
      color: "#FFB36F",
      title: "5 Tasks",
      subtitle: t("Card2_Subtitle"),
    },
    {
      id: 3,
      icon: <FiCalendar />,
      color: "#FF4F4F",
      title: "40%",
      subtitle: t("Card3_Subtitle"),
    },
  ];
  const EmployeeTasksOverview = [
    {
      id: 1,
      completed: true,
      title: t("Employment_Information"),
      subtitle: "",
      img: "",
      userImg: "",
      btn: true,
      btnName: t("Btn_View"),
    },
    {
      id: 2,
      completed: false,
      title: t("Invite_to_Onboarding"),
      subtitle: t("Bank_Details"),
      img: "",
      userImg: "",
      btn: true,
      btnName: t("Btn_invite"),
    },
    {
      id: 3,
      completed: false,
      title: t("Apps"),
      subtitle: "",
      img: [Gmail, Teams],
      userImg: "",
      btn: true,
      btnName: t("Btn_Add"),
    },
    {
      id: 4,
      completed: false,
      title: t("Contract"),
      subtitle: t("Employement_Agreement"),
      img: "",
      userImg: "",
      btn: true,
      btnName: t("Btn_Start"),
    },
    {
      id: 5,
      completed: true,
      title: t("Assets_and_Documents"),
      subtitle: "",
      img: "",
      userImg: "",
      btn: true,
      btnName: t("Btn_invite"),
    },
    {
      id: 6,
      completed: false,
      title: t("Payroll_Onboarding"),
      subtitle: t("Bank_Details"),
      img: "",
      userImg: User,
      btn: false,
      btnName: t("Pending"),
    },
    {
      id: 7,
      completed: false,
      title: t("Address_Details"),
      subtitle: "",
      img: "",
      userImg: User,
      btn: false,
      btnName: t("Pending"),
    },
  ];
  const userName = "Khadija Ahamed";
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-4">
          <div
            className={`rounded-full bg-white-20 w-14 h-14 bg-[${primaryColor}] bg-opacity-10 text-primary vhcenter flex-shrink-0`}
            style={{ backgroundColor: `rgba(${primaryColor}, 1)` }}
          >
            <FiUser size={32} />
          </div>
          <div className="flex flex-col">
            <h1 className="h1">{t("Oboarding", { userName })}</h1>
            <p className="para">{t("Onboarding_desc")}</p>
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          className="bg-primary rounded-lg px-[18px] py-2.5 text-sm font-semibold flex  gap-2 items-center justify-center leading-6 z-50"
        >
          <LuMailPlus /> {t("Btn_invite_user", { userName })}
        </Button>
      </div>

      <div className="flex flex-col gap-5 text sm:flex-row">
        {EmployeeTaskOverviewCard.map((cards) => (
          <Card
            className="w-full sm:w-72"
            bodyStyle={{ padding: 16 }}
            key={cards.id}
          >
            <div
              className={`p-1.5 rounded-[4px] vhcenter text-white shadow-md shadow-[${cards.color}] bg-opacity-20 mb-2 w-6 h-6`}
              style={{ backgroundColor: `${cards.color}` }}
            >
              {" "}
              {cards.icon}
            </div>
            <h1 className="h1">{cards.title}</h1>
            <p className="para"> {cards.subtitle}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-6 box-wrapper">
        {EmployeeTasksOverview.map((tasks) => (
          <div
            className="flex flex-col justify-between gap-4 px-4 py-5 bg-white border rounded-lg sm:items-center xs:flex-row border-secondaryWhite dark:border-secondaryDark dark:bg-black"
            key={tasks.id}
          >
            <div className="flex items-center gap-2.5">
              {tasks.completed ? (
                <FaCircleCheck className=" text-[#12B76A] text-lg flex-shrink-0" />
              ) : (
                <FaClock className="text-[#667085] text-xl flex-shrink-0" />
              )}
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <p className="text-base font-medium leading-none dark:text-white">
                  {tasks.title}
                </p>
                {tasks.subtitle && (
                  <div
                    className={`font-medium text-xs rounded-2xl vhcenter px-2 py-1 bg-[${primaryColor}] bg-opacity-10 text-primary`}
                    style={{ backgroundColor: `rgba(${primaryColor}, 1)` }}
                  >
                    <p>{tasks.subtitle}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                {tasks.img &&
                  tasks.img.map((imgurl, index) => (
                    <img key={index} className="" src={imgurl} alt={`Image ${index}`} />
                  ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              {tasks.userImg && (
                <div className="w-6 h-6 overflow-hidden rounded-full ring-2 ring-secondaryWhite">
                  <img src={tasks.userImg} alt="" />
                </div>
              )}

              {tasks.btn ? (
                <Button className="w-full xs:min-w-[82px] text-sm font-semibold">
                  {tasks.btnName}
                </Button>
              ) : (
                <div
                  className={`font-medium text-xs rounded-2xl vhcenter px-2.5 py-1 bg-secondaryWhite dark:bg-secondaryDark dark:text-white `}
                >
                  <p>{tasks.btnName}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksOverview;
