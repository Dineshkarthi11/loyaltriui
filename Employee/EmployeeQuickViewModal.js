import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../common/DrawerPop";
import { Button, notification, message, Menu, Dropdown } from "antd";
import copy from "clipboard-copy";
import API, { action } from "../Api";
import {
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import ProgressBar from "../common/Progressbar";
import { MdContentCopy } from "react-icons/md";
import {
  PiClockCountdown,
  PiCode,
  PiDeviceMobileCamera,
  PiEnvelopeSimple,
  PiX,
} from "react-icons/pi";
import FlexCol from "../common/FlexCol";
import { RxDotFilled } from "react-icons/rx";
import workExp from "../../assets/images/workExp.png";
import { lightenColor } from "../common/lightenColor";
import { SiIndeed } from "react-icons/si";
import { RiFacebookFill } from "react-icons/ri";
import { useNotification } from "../../Context/Notifications/Notification";

export default function EmployeeQuickViewModal({
  open,
  close = () => {},
  employeeId,
  companyDataId,
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [employeeList, setEmployeeList] = useState([]);
  const [sociallink, setSociallink] = useState([{}]);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const primaryColor = localStorage.getItem("mainColor"); // GET PRIMARY COLOR
  const [messageApi, contextHolder2] = message.useMessage();

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);
  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );
  const handleClose = () => {
    setShow(false);
  };
  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const getList = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_ID_BASED_RECORDS, {
        id: employeeId,
      });
      setEmployeeList(result?.result);

      // console.log(result, "hiii");
    } catch (error) {
      console.error("Error fetching employee list:", error);
    }
  };

  useEffect(() => {
    getList();
  }, []);
  const handleCopyClick = (value) => {
    copy(value);
    // console.log(value);
    messageApi.open({
      type: "success",
      content: `${value} is copied successfully`,
    });
  };

  // Work Experience Sample Data
  const workExpData = [
    {
      id: 1,
      company: "Loyaltri Solutions",
      position: "Marketing Lead",
      from: "Jan 2024",
      to: "Present",
    },
    {
      id: 2,
      company: "SquareSpace",
      position: "Product Manger",
      from: "May 2020",
      to: "Dec 2023",
    },
  ];
  const lighterColor = lightenColor(primaryColor, 0.94);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const socialdetails = [
    sociallink.linkedInLink && {
      id: 3,
      title: "LinkedIn",
      value: "linkedInLink",
      icon: <FaLinkedinIn />,
      link: sociallink.linkedInLink,
    },

    sociallink.instagramLink && {
      id: 4,
      title: "Instagram",
      value: "instagramLink",
      icon: <FaInstagram />,
      link: sociallink.instagramLink,
    },
    sociallink.whatsAppLink && {
      id: 5,
      title: "Whatsapp",
      value: "whatsAppLink",
      icon: <FaWhatsapp />,
      link: sociallink.whatsAppLink,
    },
    sociallink.faceBookLink && {
      id: 6,
      title: "Facebook",
      value: "faceBookLink",
      icon: <RiFacebookFill />,
      link: sociallink.faceBookLink,
    },
    sociallink.twitterLink && {
      id: 7,
      title: "Twitter",
      value: "twitterLink",
      icon: <FaXTwitter />,
      link: sociallink.twitterLink,
    },
    sociallink.NaukriLink && {
      id: 8,
      title: "Naukri",
      value: "NaukriLink",
      icon: null,
      link: sociallink.NaukriLink,
    },
    sociallink.gulfTalentLink && {
      id: 9,
      title: "Gulf Talent",
      value: "gulfTalentLink",
      icon: null,
      link: sociallink.gulfTalentLink,
    },
    sociallink.indeedLink && {
      id: 10,
      title: "Indeed",
      value: "indeedLink",
      icon: <SiIndeed />,
      link: sociallink.indeedLink,
    },
  ].filter((item) => item);

  const fetchapi = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_ID_BASED_RECORDS, {
        id: employeeId,
      });
      setSociallink(result.result);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      // Handle error state or logging as needed
    }
  };
  useEffect(() => {
    fetchapi();
  }, [employeeId]);
  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
      contentWrapperStyle={{
        width: "472px",
      }}
      handleSubmit={(e) => {
        console.log(e);
      }}
      closable={false}
      headerTitle={false}
      bodyPadding="0"
      footer={false}
    >
      <>
        {contextHolder2}
        <div className="relative flex flex-col gap-4 p-4">
          {/* <div className="absolute top-0 right-0 left-0 bg-primaryalpha/20 h-[132px]"></div> */}
          <div className="h-[132px] absolute top-0 right-0 left-0 border-b border-black dark:border-white border-opacity-10 dark:border-opacity-20">
            <div
              className="w-full h-full blur-[2px] dark: dark:!bg-primaryalpha/10"
              style={{ backgroundColor: lighterColor }}
            >
              <div className=" absolute -top-20 right-4 size-[152px] rounded-full blur-[52px] flex-shrink-0 bg-primaryalpha/50"></div>
            </div>
              <button onClick={handleClose} className="absolute p-2 rounded-full top-4 right-4 sm:hidden hover:bg-white/30 trans-300">
                <PiX size={18}/>
              </button>
          </div>
          <div className="flex flex-col gap-6 top-[50px] relative z-10 pb-6">
            <div className="flex justify-between">
              <div className="rounded-full size-[126px] border-[5px] border-white overflow-hidden shadow-lg bg-white">
                <div className="w-full h-full bg-primaryalpha/15">
                  {employeeList.profilePicture ? (
                    <img
                      src={employeeList.profilePicture}
                      className="object-cover object-center w-full h-full"
                      alt="Employee Profile"
                    />
                  ) : (
                    <p className="flex items-center justify-center h-full text-2xl font-semibold text-primary">
                      {employeeList?.firstName?.charAt(0).toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-end gap-3">
                {socialdetails?.slice(0, 3).map((socialMedia, i) => {
                  const link = socialMedia?.link?.startsWith("http")
                    ? socialMedia?.link
                    : `http://${socialMedia?.link}`;

                  return (
                    <div key={i}>
                      <a
                        href={link}
                        title={socialMedia?.title}
                        target="_blank"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(link);
                        }}
                        className={`size-10 rounded-lg borderb vhcenter bg-white dark:bg-dark hover:bg-primaryalpha/20 transition-all duration-300`}
                      >
                        {socialMedia.icon
                          ? socialMedia.icon
                          : socialMedia?.title.charAt(0).toUpperCase()}
                      </a>
                    </div>
                  );
                })}

                {/* Dropdown for additional social media links */}
                {socialdetails?.length > 3 && (
                  <Dropdown
                    overlay={
                      <Menu>
                        {socialdetails.slice(3).map((socialMedia, index) => (
                          <Menu.Item key={index}>
                            <a
                              href={
                                socialMedia.link.startsWith("http")
                                  ? socialMedia.link
                                  : `http://${socialMedia.link}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(socialMedia.link);
                              }}
                            >
                              {socialMedia.icon
                                ? socialMedia.icon
                                : socialMedia?.title.charAt(0).toUpperCase()}
                              <span>{socialMedia.title}</span>
                            </a>
                          </Menu.Item>
                        ))}
                      </Menu>
                    }
                    placement="bottomRight"
                    trigger={["hover"]}
                  >
                    <div
                      className={
                        "size-10 rounded-lg borderb vhcenter bg-white dark:bg-dark hover:bg-primaryalpha/20 transition-all duration-300"
                      }
                    >
                      <span className="p-6">
                        +{socialdetails.slice(3).length}
                      </span>
                    </div>
                  </Dropdown>
                )}
              </div>
            </div>
            {/*  <Link
                  className="transition-all duration-300 bg-white rounded-lg size-10 borderb vhcenter dark:bg-dark hover:bg-primaryalpha/20"
                  to=""
                >
                  <FaWhatsapp size={20} />
                </Link>
                <Link
                  className="transition-all duration-300 bg-white rounded-lg size-10 borderb vhcenter dark:bg-dark hover:bg-primaryalpha/20"
                  to=""
                >
                  <FaInstagram size={20} />
                </Link> */}
            {/* </div> */}
            {/* </div> */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="h1">
                  {employeeList?.firstName?.charAt(0).toUpperCase() +
                    employeeList?.firstName?.slice(1) +
                    " " +
                    employeeList?.lastName}
                </h1>
                <div
                  className={`${
                    employeeList?.isActive
                      ? " bg-green-600/10 dark:bg-green-600/30 text-green-600"
                      : " bg-rose-600/10 dark:bg-rose-600/30 text-rose-600"
                  } rounded-full px-2 py-[2px] h-fit w-fit font-medium text-xs flex gap-2 vhcenter flex-nowrap`}
                >
                  <div
                    className={` size-1.5 2xl:size-2 rounded-full ${
                      employeeList?.isActive ? `bg-green-600` : `bg-rose-600`
                    }`}
                  />
                  <p className=" text-[9px] 2xl:text-xs font-medium leading-[20px]">
                    {employeeList?.isActive ? t("Active") : t("Inactive")}
                  </p>
                </div>
              </div>
              <p className="para text-primary">{employeeList?.designation}</p>
            </div>
            <div className="flex flex-col w-full borderb rounded-lg p-2.5">
              <p className="!font-medium para">{t("Profile_Completion")}</p>
              <ProgressBar
                percent={employeeList?.profileCompletion}
                status="active"
                showInfo={true}
                strokeColor={primaryColor}
              />
            </div>
            {/* CONTACT IMFORMATION  */}
            <FlexCol className={`gap-5 w-full`}>
              <h3 className="h3 !font-semibold">Contact Information</h3>
              <FlexCol className={"w-full justify-center gap-5"}>
                <div className="flex items-center justify-between gap-2 group">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-lg borderb vhcenter bg-white dark:bg-dark hover:bg-primaryalpha/20 transition-all duration-300 group-hover:bg-primary group-hover:text-white bg-primaryalpha/5`}
                    >
                      <PiEnvelopeSimple size={20} />
                    </div>
                    <div class="flex flex-col">
                      <p class="para">{t("Email")}</p>
                      <p class="text-[10px] font-semibold text-black 2xl:text-base dark:text-white">
                        {employeeList?.email || "--"}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="text"
                    className="px-1 text-black dark:text-white dark:hover:text-blue-300"
                    onClick={() => handleCopyClick(employeeList?.email)}
                  >
                    <MdContentCopy className="text-sm 2xl:text-base" />
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-2 group">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-lg borderb vhcenter bg-white dark:bg-dark hover:bg-primaryalpha/20 transition-all duration-300 group-hover:bg-primary group-hover:text-white bg-primaryalpha/5`}
                    >
                      <PiDeviceMobileCamera size={20} />
                    </div>
                    <div class="flex flex-col">
                      <p class="para">{t("Phone")}</p>
                      <p class="text-[10px] font-semibold text-black 2xl:text-base dark:text-white">
                        {employeeList?.phone || "--"}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="text"
                    className="px-1 text-black dark:text-white dark:hover:text-primary"
                    onClick={() => handleCopyClick(employeeList?.phone)}
                  >
                    <MdContentCopy className="text-sm 2xl:text-base" />
                  </Button>
                </div>
              </FlexCol>
            </FlexCol>

            {/* WORK INFORMATION */}
            <FlexCol className={`gap-5 w-full`}>
              <h3 className="h3 !font-semibold">Work Information</h3>
              <FlexCol className={"w-full justify-center gap-5"}>
                <div className="flex items-center justify-between gap-2 group">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-lg borderb vhcenter bg-white dark:bg-dark hover:bg-primaryalpha/20 transition-all duration-300 group-hover:bg-primary group-hover:text-white bg-primaryalpha/5`}
                    >
                      <PiCode size={20} />
                    </div>
                    <div class="flex flex-col">
                      <p class="para">{t("Department")}</p>
                      <p class="text-[10px] font-semibold text-black 2xl:text-base dark:text-white">
                        {employeeList.department || "--"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-lg borderb vhcenter bg-white dark:bg-dark hover:bg-primaryalpha/20 transition-all duration-300 group-hover:bg-primary group-hover:text-white bg-primaryalpha/5`}
                    >
                      <PiClockCountdown size={20} />
                    </div>
                    <div class="flex flex-col gap-0.5">
                      <p class="para">{t("Shift_Scheme")}</p>
                      <p class="text-[10px] bg-[#ECFDF3] text-[#027A48] dark:bg-green-600/30 dark:text-green-600 rounded-full px-2 py-0.5 w-fit font-medium 2xl:text-xs vhcenter flex-nowrap">
                        <RxDotFilled className="text-lg" />
                        {employeeList?.shiftScheme || "--"}
                      </p>
                    </div>
                  </div>
                </div>
              </FlexCol>
            </FlexCol>

            <FlexCol className={`gap-5 w-full`}>
              <h3 className="h3 !font-semibold">Reports To</h3>
              <div className="flex items-center gap-4">
                <div className="borderb rounded-lg p-0.5 size-[46px] overflow-hidden">
                  <div className="w-full h-full overflow-hidden rounded-md bg-primaryalpha/15">
                    {employeeList.superiorProfilePicture ? (
                      <img
                        src={employeeList.superiorProfilePicture}
                        className="object-cover object-center w-full h-full"
                        alt="Employee Profile"
                      />
                    ) : (
                      <p className="flex items-center justify-center h-full text-lg font-semibold text-primary">
                        {employeeList?.superpiorEmployeeName
                          ?.charAt(0)
                          .toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>
                <FlexCol gap={2}>
                  <p className="pblack !font-medium">
                    {employeeList?.superpiorEmployeeName}
                  </p>
                  <p className="para !font-medium">
                    {employeeList?.superiorDesignation}
                  </p>
                </FlexCol>
              </div>
            </FlexCol>

            {/* WORK EXPERIENCE In Static Data*/}
            {/*Need to Add Dynamic Data */}
            {/* Currently hidden  */}
            <FlexCol className={`gap-5 w-full hidden`}>
              <h3 className="h3 !font-semibold">Work Experiences</h3>
              {workExpData?.map((item, index) => (
                <div className="flex gap-4" key={index}>
                  <div className="borderb rounded-lg p-0.5 size-[46px] overflow-hidden">
                    <div className="w-full h-full overflow-hidden rounded-md">
                      <img
                        src={workExp}
                        className="object-cover object-center w-full h-full"
                        alt="Employee Profile"
                      />
                    </div>
                  </div>
                  <FlexCol gap={0}>
                    <p className="pblack !font-medium">{item.position}</p>
                    <p className="para !font-medium">{item.companyName}</p>
                    <p className="para !font-medium">
                      {item.from} - {item.to}
                    </p>
                  </FlexCol>
                </div>
              ))}
            </FlexCol>
          </div>
        </div>
      </>
    </DrawerPop>
  );
}
