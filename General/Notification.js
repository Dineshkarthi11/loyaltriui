import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import ToggleBtn from "../common/ToggleBtn";
import { useTranslation } from "react-i18next";
import API, { action } from "../Api";
import { useFormik } from "formik";
import * as yup from "yup";
import Heading from "../common/Heading";
import localStorageData from "../common/Functions/localStorageKeyValues";
export default function Notification() {
  const { t } = useTranslation();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);

  const [notificationData, setNotificationData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [initialValues, setInitialValues] = useState({});

  const toggleAccordion = (id) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({}),
    onSubmit: async (values) => {
      try {
        const result = await action(API.THEME_SETTINGS, {
          employeeId: employeeId,
          notificationDatas: {
            emailNotification: {
              generalUpdates: values.generalUpdates || 0,
              taskReminders: values.taskReminders || 0,
              meetingInvitations: values.meetingInvitations || 0,
              employeeRequests: values.emailemployeeRequests || 0,
              systemAlerts: values.systemStatus || 0,
            },
            pushNotification: {
              taskUpdates: values.taskUpdates || 0,
              meetingReminders: values.meetingReminders || 0,
              instantMessages: values.instantMessages || 0,
              pushemployeeRequests: values.pushemployeeRequests || 0,
              attendanceUpdates: values.attendanceUpdates || 0,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleToggleList = (id, checked, value) => {
    setNotificationData((prevData) =>
      prevData.map((item) => ({
        ...item,
        contents: item.contents.map((content) =>
          content.id === id ? { ...content, isActive: checked } : content
        ),
      }))
    );
    formik.setFieldValue(value, checked ? 1 : 0);
    formik.handleSubmit();
  };

  const getNotifications = async () => {
    try {
      const result = await action(API.GET_APPEARANCE_THEME, {
        employeeId: employeeId,
      });
      if (result.status === 200) {
        const emailNotification =
          result.result?.notificationDatas?.emailNotification || {};
        const pushNotification =
          result.result?.notificationDatas?.pushNotification || {};

        const data = [
          {
            id: 1,
            title: t("Email_Notification"),
            description: t("Email_Notification_description"),
            contents: [
              {
                id: 1,
                subTitle: t("General_Updates"),
                subTitleDescription: t("General_Updates_description"),
                value: "generalUpdates",
                isActive: emailNotification.generalUpdates === 1,
              },
              {
                id: 2,
                subTitle: t("Task_Reminders"),
                subTitleDescription: t("Task_Reminders_description"),
                value: "taskReminders",
                isActive: emailNotification.taskReminders === 1,
              },
              {
                id: 3,
                subTitle: t("Meeting_Invitations"),
                subTitleDescription: t("Meeting_Invitations_description"),
                value: "meetingInvitations",
                isActive: emailNotification.meetingInvitations === 1,
              },
              {
                id: 4,
                subTitle: t("Employee_Requests"),
                subTitleDescription: t("Employee_Requests_description"),
                value: "emailemployeeRequests",
                isActive: emailNotification.employeeRequests === 1,
              },
              {
                id: 5,
                subTitle: t("System_Status_alerts"),
                subTitleDescription: t("System_Status_alerts_description"),
                value: "systemStatus",
                isActive: emailNotification.systemAlerts === 1,
              },
            ],
          },
          {
            id: 2,
            title: t("Push_Notification"),
            description: t("Push_Notification_description"),
            contents: [
              {
                id: 6,
                subTitle: t("Instant_Messages"),
                subTitleDescription: t("Instant_Messages_description"),
                value: "instantMessages",
                isActive: pushNotification.instantMessages === 1,
              },
              {
                id: 7,
                subTitle: t("Task_Updates"),
                subTitleDescription: t("Task_Updates_description"),
                value: "taskUpdates",
                isActive: pushNotification.taskUpdates === 1,
              },
              {
                id: 8,
                subTitle: t("Meeting_Invitations"),
                subTitleDescription: t("Meeting_Reminders_description"),
                value: "meetingReminders",
                isActive: pushNotification.meetingReminders === 1,
              },
              {
                id: 9,
                subTitle: t("Employee_Requests"),
                subTitleDescription: t("Employee_Requests_description"),
                value: "pushemployeeRequests",
                isActive: pushNotification.pushemployeeRequests === 1,
              },
              {
                id: 10,
                subTitle: t("Attendance_Updates"),
                subTitleDescription: t("Attendance_Updates_description"),
                value: "attendanceUpdates",
                isActive: pushNotification.attendanceUpdates === 1,
              },
            ],
          },
        ];
        setNotificationData(data);
        setExpanded(Object.fromEntries(data.map((item) => [item.id, true])));

        setInitialValues({
          generalUpdates: emailNotification.generalUpdates,
          taskReminders: emailNotification.taskReminders,
          meetingInvitations: emailNotification.meetingInvitations,
          emailemployeeRequests: emailNotification.employeeRequests,
          systemStatus: emailNotification.systemAlerts,
          taskUpdates: pushNotification.taskUpdates,
          meetingReminders: pushNotification.meetingReminders,
          instantMessages: pushNotification.instantMessages,
          pushemployeeRequests: pushNotification.employeeRequests,
          attendanceUpdates: pushNotification.attendanceUpdates,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);
  return (
    <div className="flex flex-col gap-6">
      <Heading title={t("Notification")} description={t("Main_Description")} />

      <div className="relative flex flex-col gap-6">
        {/*  Accordian item 1 */}
        {notificationData.map((item) => (
          <div key={item.id} className="borderb rounded-lg">
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
                  <div
                    key={subitems.id}
                    className="flex flex-row-reverse justify-between md:flex-row "
                  >
                    <div>
                      <p class="acco-subhead">{subitems.subTitle}</p>
                      <p class="para">{subitems.subTitleDescription}</p>
                    </div>
                    <div className="pr-3 form-select md:w-80">
                      <ToggleBtn
                        className="md:float-right rtl:md:float-left"
                        value={subitems.isActive}
                        change={(e) => {
                          handleToggleList(subitems.id, e, subitems.value);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
