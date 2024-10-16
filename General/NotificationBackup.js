import React from "react";
import ToggleBtn from "../common/ToggleBtn";
import { useTranslation } from "react-i18next";

export default function Notification() {
  const { t } = useTranslation();

  const notificationData = [
    {
      id: 1,
      title: t("Email_Notification"),
      description: t("Email_Notification_description"),
      toggleData: [
        {
          id: 1,
          subTitle: t("General_Updates"),
          subTitleDescription: t("General_Updates_description"),
        },
        {
          id: 2,
          subTitle: t("Task_Reminders"),
          subTitleDescription: t("Task_Reminders_description"),
        },
        {
          id: 3,
          subTitle: t("Meeting_Invitations"),
          subTitleDescription: t("Meeting_Invitations_description"),
        },
        {
          id: 4,
          subTitle: t("Employee_Requests"),
          subTitleDescription: t("Employee_Requests_description"),
        },
        {
          id: 5,
          subTitle: t("System_Status_lerts"),
          subTitleDescription: t("System_Status_lerts_description"),
        },
      ],
    },
    {
      id: 2,
      title: t("Push_Notification"),
      description: t("Push_Notification_description"),
      toggleData: [
        {
          id: 1,
          subTitle: t("Instant_Messages"),
          subTitleDescription: t("Instant_Messages_description"),
        },
        {
          id: 2,
          subTitle: t("Task_Updates"),
          subTitleDescription: t("Task_Updates_description"),
        },
        {
          id: 3,
          subTitle: t("Meeting_Reminders"),
          subTitleDescription: t("Meeting_Reminders_description"),
        },
        {
          id: 4,
          subTitle: t("Employee_Requests"),
          subTitleDescription: t("Employee_Requests_description"),
        },
        {
          id: 5,
          subTitle: t("Attendance_Updates"),
          subTitleDescription: t("Attendance_Updates_description"),
        },
      ],
    },
  ];

  return (
    <div className="block justify-start items-start  p-4">
      <div className=" ">
        <h1 className="text-2xl dark:text-white">{t("Notification_settings")}</h1>
        <p className="text-xs opacity-70 dark:text-white">
          {t("Notification_settings_description")}
        </p>
      </div>
      {notificationData?.map((each) => (
        <div className="grid grid-cols-12 gap-3 border rounded-xl px-3 py-4 my-3">
          <div className=" col-span-3">
            <div className="">
              <h6 className="text-sm dark:text-white">{each.title}</h6>
              <p className="pr-5 text-[10px] opacity-70 dark:text-white">{each.description}</p>
            </div>
          </div>
          <div className=" col-span-9 grid grid-cols-10">
            {each.toggleData?.map((subdata) => (
              <>
                <div className="col-span-1">
                  <ToggleBtn />
                </div>
                <div className="col-span-9 grid grid-cols-10">
                  <div className=" col-span-6">
                    <h6 className="text-sm dark:text-white">{subdata.subTitle}</h6>
                    <p className="text-[10px] opacity-70 dark:text-white">
                      {subdata.subTitleDescription}
                    </p>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
