import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// import { useSelector } from "react-redux";
import DrawerPop from "../../common/DrawerPop";
import { IoIosArrowForward } from "react-icons/io";
import TabsNew from "../../common/TabsNewAccordian";
import { useSelector, useDispatch } from "react-redux";
import { setAccordionItem } from "../../../Redux/action";

// IMAGES
import {
  Vacation,
  Virus,
  Mother,
  Kaaba,
  Calendar,
} from "../../common/SVGFiles";
// import Virus from "../../../assets/images/leave/virus.svg";
// import Mother from "../../../assets/images/leave/mother.svg";
// import Kaaba from "../../../assets/images/leave/kaaba.svg";
// import Calendar from "../../../assets/images/leave/Calendar.svg";
import store from "../../../Redux/store";
import id from "faker/lib/locales/id_ID";
import TabsNewAccordian from "../../common/TabsNewAccordian";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function LeaveTemplate({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
  dispatch,
  onAction,
  Action = () => {},
}) {
  const { t } = useTranslation();
  const layout = useSelector((state) => state.layout.value);
  const [Ksa, setKsa] = useState([]);
  const [Dubai, setDubai] = useState([]);
  const selectedAccordionItem = useSelector(
    (state) => state.accordion.accordionItem
  );

  const dispatchRedux = useDispatch();

  const [show, setShow] = useState(open);
  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const accordionData = [
    {
      India: [
        {
          id: 1,
          img: <Vacation />,
          title: t("Vacation"),
          subtitle: t("VacationSub"),
          description: t("DescriptionDesc"),
          allowancePay: {
            leavedays: t("CalendarDays"),
            Leavepayrate: t("Paid"),
          },

          leaveCount: 54,
        },
        {
          id: 2,
          img: <Virus />,
          title: t("Sick"),
          subtitle: t("VacationSub"),
          description: t("DescriptionDesc"),
          allowancePay: {
            leavedays: t("CalendarDays"),
            Leavepayrate: t("Paid"),
          },

          leaveCount: 5,
        },
        {
          id: 3,
          img: <Mother />,
          title: t("Maternity"),
          subtitle: t("VacationSub"),
          description: "hi",
          allowancePay: {
            leavedays: t("CalendarDays"),
            Leavepayrate: t("Paid"),
          },

          leaveCount: 4,
        },
        {
          id: 4,
          img: <Kaaba />,
          title: t("Hajj"),
          subtitle: t("VacationSub"),
          description: t("DescriptionDesc"),
          allowancePay: {
            leavedays: t("CalendarDays"),
            Leavepayrate: t("Paid"),
          },

          leaveCount: 21,
        },
        {
          id: 5,
          img: <Calendar />,
          title: t("ComboOff"),
          subtitle: t("VacationSub"),
          description: t("DescriptionDesc"),
          allowancePay: {
            leavedays: t("CalendarDays"),
            Leavepayrate: t("Paid"),
          },

          leaveCount: 14,
        },
      ],
    },
    {
      Dubai: [
        {
          id: 1,
          img: <Vacation />,
          title: t("Vacation"),
          subtitle: t("VacationSub"),
          description: t("DescriptionDesc"),
          allowancePay: {
            leavedays: t("CalendarDays"),
            Leavepayrate: t("Paid"),
          },

          leaveCount: 54,
        },
        {
          id: 2,
          img: <Virus />,
          title: t("Sick"),
          subtitle: t("VacationSub"),
          description: t("DescriptionDesc"),
          allowancePay: {
            leavedays: t("CalendarDays"),
            Leavepayrate: t("Paid"),
          },

          leaveCount: 5,
        },
        {
          id: 3,
          img: <Mother />,
          title: t("Maternity"),
          subtitle: t("VacationSub"),
          description: "hi",
          allowancePay: {
            leavedays: t("CalendarDays"),
            Leavepayrate: t("Paid"),
          },

          leaveCount: 4,
        },
        {
          id: 4,
          img: <Kaaba />,
          title: t("Hajj"),
          subtitle: t("VacationSub"),
          description: t("DescriptionDesc"),
          allowancePay: {
            leavedays: t("CalendarDays"),
            Leavepayrate: t("Paid"),
          },

          leaveCount: 21,
        },
        {
          id: 5,
          img: <Calendar />,
          title: t("ComboOff"),
          subtitle: t("VacationSub"),
          description: t("DescriptionDesc"),
          allowancePay: {
            leavedays: t("CalendarDays"),
            Leavepayrate: t("Paid"),
          },

          leaveCount: 14,
        },
      ],
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const [expanded, setExpanded] = useState({
    [accordionData[0].id]: true,
    ...Object.fromEntries(
      accordionData.slice(1).map((item) => [item.id, false])
    ),
  });
  // console.log("expanded ACCo:", expanded, accordionData);

  const toggleAccordion = (id) => {
    setExpanded((prevExpanded) => {
      const newExpanded = { ...prevExpanded };

      // Close all other items
      Object.keys(newExpanded).forEach((itemId) => {
        if (itemId !== id) {
          newExpanded[itemId] = false;
        }
      });

      // Toggle the selected item
      newExpanded[id] = !prevExpanded[id];

      return newExpanded;
    });
  };
  const [navigationPath, setNavigationPath] = useState(["Ksa"]);

  const tabs = [
    // {
    //   id: 1,
    //   title: "USA",

    // },
    {
      id: 1,
      title: "India",
    },
    {
      id: 2,
      title: "Dubai",
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // useEffect(() => {
  //   console.log("selectedAccordionItem:", selectedAccordionItem);
  // }, [selectedAccordionItem]);
  const handleSubmit = () => {
    // Trigger the callback with the desired action
    onAction("Configuration");
  };

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        setShow(false);
      }}
      contentWrapperStyle={{
        width: "550px",
      }}
      handleSubmit={(e) => {
        // console.log(e);
        // formik.handleSubmit();
        if (selectedAccordionItem.id) {
          handleSubmit();
          setShow(false);
        } else {
          openNotification("error", "Info", "Please Choose Leave Template");
          // console.log(selectedAccordionItem.id, "rrrrrrrr");
        }
      }}
      Action={(e) => {
        handleSubmit();
      }}
      // handleSubmit={handleSubmit}
      //   updateBtn={isUpdate}
      updateFun={() => {
        // updateIdBasedLeaveType();
      }}
      header={[t("LeaveTemplate"), t("LeaveTemplateDesc")]}
      footerBtn={[t("Cancel"), t("UsethisTemplate")]}
    >
      <div className="relative w-full h-full ">
        {/* TABS SECTION  */}
        <TabsNewAccordian
          tabs={tabs}
          accordionData={accordionData}
          onTabChange={handleTabChange}
          onclick={(e) => {
            // console.log(e);
            // formik.handleSubmit();
            handleSubmit(e);
            setShow(false);
          }}
        />
        {/* ACCORDIAN SECTION  */}
      </div>
    </DrawerPop>
  );
}
