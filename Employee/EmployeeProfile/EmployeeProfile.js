import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { Button, Dropdown, Menu, Modal, Tooltip, message } from "antd";
import copy from "clipboard-copy";
import API, { action, fileAction } from "../../Api";
import ProgressBar from "../../common/Progressbar";
import { FiMail } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TabsNew from "../../common/TabsNew";
import CardPersonal from "./CardPersonal";
import { Link, useLocation, useParams } from "react-router-dom";
import FlexCol from "../../common/FlexCol";
import MyLeaves from "../../Time/MyLeave/MyLeaves";
import MyAssets from "../../Company/AssetsManagement/MyAssets";
import MyDocument from "../../Company/DocumentManagemant/MyDocument";
import BasicInformation from "./UpdateEmployeeWorks/BasicInformation";
import BasicInDetails from "./UpdateEmployeeWorks/BasicInDetails";
import ContactInformation from "./UpdateEmployeeWorks/ContactInformation";
import WorkPolicies from "./UpdateEmployeeWorks/WorkPolicies";
import AddressInformation from "./UpdateEmployeeWorks/AddressInformation";
import ButtonClick from "../../common/Button";
import {
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import {
  PiClockCountdown,
  PiCode,
  PiDeviceMobileCamera,
  PiPlus,
} from "react-icons/pi";
import { HiChevronLeft } from "react-icons/hi2";
import MyAttendanceProfile from "../../Time/MyAttendance/MyAttendanceProfile";
import Loader from "../../common/Loader";
import WorkEntry from "../WorkEntry";
import ImgCrop from "antd-img-crop";
import PayrollSalaryOverview from "./PayrollSalaryOverview";
import SocialDrawer from "./SocialDrawer";
import Updatepassword from "./Updatepassword";
import frame from "../../../assets/images/Frame jj.png";
import Frame from "../../../assets/images/Frame 427319656.png";

import { RiFacebookFill } from "react-icons/ri";
import { SiIndeed } from "react-icons/si";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import {
  decryptFun,
  fetchCompanyDetails,
} from "../../common/Functions/commonFunction";
import NewBadge from "../../common/NewBadge";
import PageNotFound from "../../common/PageNotFound";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const decryptActionID = (encryptedActionID) => {
  try {
    return atob(encryptedActionID);
  } catch (error) {
    console.error("Failed to decrypt actionID:", error);
    return null;
  }
};
const EmployeeProfile = ({ path = "" }) => {
  const { t } = useTranslation();
  const { employeeId: encryptedEmployeeId } = useParams();
  const employeeId = decryptActionID(encryptedEmployeeId);
  const [employeeList, setemployeeList] = useState([]); //EMPLOYEE LIST
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [messageApi, contextHolder] = message.useMessage();
  const primaryColor = localStorage.getItem("mainColor"); // GET PRIMARY COLOR

  const [employeeDocumentTypeList, setEmployeeDocumentTypeList] = useState([]);

  const [workBasicPop, setWorkBasicPop] = useState();
  const [workPoliciesPop, setWorkPoliciesPop] = useState();

  const [basicPop, setBasicPop] = useState(false);
  const [workPop, setWorkPop] = useState(false);
  const [contactPop, setContactPop] = useState(false);
  const [isSocialDrawer, setSocialDrawer] = useState(false);
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");
  const [userId, setUserId] = useState();
  const [sociallink, setSociallink] = useState([{}]);
  const [employeeEmploymentInfo, setEmployeeEmploymentInfo] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);
  const profileUpdatedEvent = new Event("profileUpdated");

  const [localStorageData, setLocalStorageData] = useState(
    decryptFun(localStorage.getItem("encryptedData"))
  );

  useEffect(() => {
    const pathname = location.pathname;
    const parts = pathname.split("/"); // Split path by "/"
    if (parts.length >= 2) {
      const profile = parts[1]; // Get the second part (index 1) of the path
      setCurrentPath(profile);
      const id = parts[2];
      setUserId(employeeId);
    }
  }, [location]);

  const CustomTooltipContent = () => (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] 2xl:text-sm text-grey">Link not updated?</div>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={ModalPopUp}
      >
        <div className="w-4 h-4 vhcenter bg-white rounded-full text-black">
          <PiPlus size={10} />
        </div>
        <p className="text-[10px] 2xl:text-sm">Add Social Link</p>
      </div>
    </div>
  );

  // image upload functions START

  const [cropper, setCropper] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const getCroppedImg = async (cropperInstance) => {
    if (!cropperInstance) {
      return null;
    }

    const croppedCanvas = cropperInstance.getCroppedCanvas();
    return new Promise((resolve, reject) => {
      croppedCanvas.toBlob((blob) => {
        if (blob) {
          blob.name = "croppedImage.png";
          resolve(blob);
        } else {
          reject(new Error("Crop failed"));
        }
      }, "image/png");
    });
  };

  const handleCrop = async () => {
    if (cropper) {
      try {
        const croppedImageBlob = await getCroppedImg(cropper);
        if (croppedImageBlob) {
          const formData = new FormData();
          formData.append("file", croppedImageBlob);
          formData.append("action", "ProfilePicUpload");
          formData.append("employeeId", employeeId);

          const FileUploadimage = await fileAction(formData);

          if (FileUploadimage.status === 200) {
            messageApi.open({
              type: "success",
              content: "Image uploaded successfully",
            });
            getEmployee();
            window.dispatchEvent(profileUpdatedEvent);
          } else {
            messageApi.open({
              type: "error",
              content: "Image upload failed",
            });
          }

          setImageSrc(null);
        }
      } catch (error) {
        messageApi.open({
          type: "error",
          content: `Failed: ${error.message}`,
        });
        console.log(error);
      }
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    try {
      if (file) {
        const extension = file.name.split(".").pop()?.toLowerCase();
        const allowedExtensions = ["jpg", "png", "jpeg", "svg", "webp"];

        if (!allowedExtensions.includes(extension)) {
          messageApi.open({
            type: "error",
            content: `${file.name} is not a valid image format. Please upload files with extensions: jpg, png, jpeg, svg, or webp.`,
          });
          return;
        }

        const objectUrl = URL.createObjectURL(file);
        setImageSrc(objectUrl);

        // Clean up the object URL after using it
        return () => URL.revokeObjectURL(objectUrl);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: `Failed: ${error.message}`,
      });
      console.log(error);
    }
  };

  const fileInputRef = useRef(null);
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);

  const socialdetails = [
    sociallink?.linkedInLink && {
      id: 3,
      title: "LinkedIn",
      value: "linkedInLink",
      icon: <FaLinkedinIn />,
      link: sociallink?.linkedInLink,
    },

    sociallink?.instagramLink && {
      id: 4,
      title: "Instagram",
      value: "instagramLink",
      icon: <FaInstagram />,
      link: sociallink?.instagramLink,
    },
    sociallink?.whatsAppLink && {
      id: 5,
      title: "Whatsapp",
      value: "whatsAppLink",
      icon: <FaWhatsapp />,
      link: sociallink?.whatsAppLink,
    },
    sociallink?.faceBookLink && {
      id: 6,
      title: "Facebook",
      value: "faceBookLink",
      icon: <RiFacebookFill />,
      link: sociallink.faceBookLink,
    },
    sociallink?.twitterLink && {
      id: 7,
      title: "Twitter",
      value: "twitterLink",
      icon: <FaXTwitter />,
      link: sociallink?.twitterLink,
    },
    sociallink?.NaukriLink && {
      id: 8,
      title: "Naukri",
      value: "NaukriLink",
      icon: null,
      link: sociallink?.NaukriLink,
    },
    sociallink?.gulfTalentLink && {
      id: 9,
      title: "Gulf Talent",
      value: "gulfTalentLink",
      icon: null,
      link: sociallink?.gulfTalentLink,
    },
    sociallink?.indeedLink && {
      id: 10,
      title: "Indeed",
      value: "indeedLink",
      icon: <SiIndeed />,
      link: sociallink?.indeedLink,
    },
  ].filter((item) => item);

  const employeeInfo = [
    {
      id: 1,
      title: t("Basic_Information"),
      emplyee: employeeId,
      edit: currentPath === "myProfile" ? false : true,
      details: {
        [t("First_Name")]: employeeList.firstName || "--",
        [t("Last_Name")]: employeeList.lastName || "--",
        [t("Father_Name")]: employeeList.fatherOrHusbandName || "--",
        [t("Date_of_Birth")]: employeeList.dateOfBirth || "--",
        [t("Gender")]: employeeList.gender || "--",
        // [t("Nationality")]: employeeList?.countryName || "--",
        // [t("Marital_Status")]: employeeList.maritalStatus,
      },
    },
    {
      id: 2,
      title: "Address Information",
      emplyee: employeeId,
      edit: true,
      details: {
        // [t("streetName")]: employeeList?.address,
        // [t("unitSuite")]: "Apt 456",
        [t("Country")]: employeeList?.countryName || "--",
        [t("provinceState")]: employeeList?.stateName || "--",
        [t("City")]: employeeList?.city || "--",
        [t("Postal Code")]: employeeList?.zipCode || "--",
      },
    },
    {
      id: 3,
      title: "Contact Information",
      emplyee: employeeId,
      edit: true,
      details: {
        [t("Personal Mail")]: employeeList?.email || "--",
        [t("Personal Number")]: employeeList?.phone || "--",
        [t("Address")]: employeeList?.address || "--",
        [t("Postal/ZIP Code")]: employeeList?.zipCode || "--",
      },
    },
    {
      id: 4,
      title: "Social Links",
      employee: employeeId,
      edit: currentPath === "myProfile" ? false : true,
      details: socialdetails?.reduce((acc, data) => {
        acc[data.title] = data.link || "--";
        return acc;
      }, {}),
    },
  ];

  const getCompanyIdFromLocalStorage = () => {
    return localStorage.getItem("companyId");
  };

  useEffect(() => {
    const companyId = getCompanyIdFromLocalStorage();
    if (companyId) {
      fetchCompanyDetails(companyId).then((details) =>
        setCompanyDetails(details)
      );
    }

    const handleStorageChange = () => {
      const companyId = getCompanyIdFromLocalStorage();
      if (companyId) {
        fetchCompanyDetails(companyId).then((details) =>
          setCompanyDetails(details)
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const isPFESIenabled = companyDetails?.isPFESIenabled === 1;

  const employeeWork = [
    {
      id: 1,
      title: "Basic Information",
      className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
      emplyee: employeeId,
      details: {
        Company: employeeList.company || "--",
        Designation: employeeList?.designation || "--",
        Department: employeeList?.department || "--",
        // ReportsTo: employeeList?.superpiorEmployeeName || "--",
        [t("Reports To")]: employeeList?.superpiorEmployeeName || "--",
        Location: employeeList.location || "--",
        [t("Joining Date")]: employeeList?.joiningDate || "--",
        [t("Probation Period")]: employeeList?.probationPeriod || "--",
        [t("Shift Scheme")]: employeeList?.shiftScheme || "--",
      },
    },
    {
      id: 2,
      title: "Work Policies",
      className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
      emplyee: employeeId,
      edit: currentPath === "myProfile" ? false : true,
      details: {
        [t("Time In-Out Policy")]: employeeList?.TimeInOutPolicyName || "--",
        [t("Over Time Policy")]: employeeList?.OverTimePolicyName || "--",
        [t("Short Time Policy")]: employeeList?.ShortTimePolicyName || "--",
        [t("Miss punch Policy")]: employeeList?.MissPunchPolicyName || "--",
      },
    },
    {
      id: 3,
      title: "Employment Information",
      className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
      emplyee: employeeId,
      details: {
        [t("UAN")]: employeeEmploymentInfo?.UAN || "--",
        [t("PAN Number")]: employeeEmploymentInfo?.PANnumber || "--",
        [t("Aadhar Number")]: employeeEmploymentInfo?.adharNumber || "--",
        [t("Aadhar Enrollment Number")]:
          employeeEmploymentInfo?.adharEnrollNumber || "--",
        [t("PF Number")]: employeeEmploymentInfo?.PFnumber || "--",
        [t("PF Joining Date")]: employeeEmploymentInfo?.PFjoiningDate || "--",
        [t("PF Eligible")]:
          employeeEmploymentInfo?.PFeligible === "1" ? "Yes" : "No" || "--",
        [t("ESI Eligible")]:
          employeeEmploymentInfo?.ESIeligible === "1" ? "Yes" : "No" || "--",
        [t("ESI Number")]: employeeEmploymentInfo?.ESInumber || "--",
        [t("PT Eligible")]:
          employeeEmploymentInfo?.PTeligible === "1" ? "Yes" : "No" || "--",
        [t("LWF Eligible")]:
          employeeEmploymentInfo?.LWFeligible === "1" ? "Yes" : "No" || "--",
        [t("EPS Eligible")]:
          employeeEmploymentInfo?.EPSeligible === "1" ? "Yes" : "No" || "--",
        [t("EPS Joining Date")]: employeeEmploymentInfo?.EPSjoiningDate || "--",
        [t("EPS Exit Date")]: employeeEmploymentInfo?.EPSexitDate || "--",
        [t("HPS Eligible")]:
          employeeEmploymentInfo?.HPSeligible === "1" ? "Yes" : "No" || "--",
      },
    },
  ];

  const handleCopyClick = (value) => {
    copy(value);
    messageApi.open({
      type: "success",
      content: `${value} is copied successfully`,
    });
  };

  const getEmployee = async () => {
    // setemployeeList(employeeDetails);

    try {
      const result = await action(API.GET_EMPLOYEE_ID_BASED_RECORDS, {
        id: employeeId,
      });
      setemployeeList(result?.result);
      setSociallink(result?.result);

      // getDepartment(result.data.employeeCompanyData?.departmentId);
      // getLocation(result.data.employeeCompanyData?.locationId);
      // getShiftScheme(result.data.employeeCompanyData?.shiftSchemeId);
      // getDesignation(result.data.employeeCompanyData?.designationId);
      // getCompany(result.data.employeeCompanyData?.companyId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (employeeId) {
      getEmployee();
    }
  }, [employeeId]);
  // Get a reference to the button

  const getEmployeeEmploymentInfo = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYEE_EMPLOYMENT_INFO,
        {
          employeeId: employeeId,
        }
      );
      setEmployeeEmploymentInfo(result.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployeeEmploymentInfo();
  }, [employeeId]);

  window.addEventListener("scroll", function () {
    const stickyElement = document.getElementById("scrollToTopButton");
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 100) {
      // Adjust the scroll position threshold as needed
      stickyElement.classList.add("sticky-top-0");
    } else {
      stickyElement.classList.remove("sticky-top-10");
    }
  });

  const tabs = [
    {
      id: 1,
      title: t("Personal"),
      value: "personal",
      content: (
        <>
          {currentPath === "myProfile" && (
            <UpdatePassword employee={employeeId} />
          )}
          <CardPersonal
            data={employeeInfo}
            ClickAddSocialLink={() => {
              setSocialDrawer(true);
            }}
            clickDrower={(e, title) => {
              if (title === "Basic Information") {
                setBasicPop(true);
              } else if (title === "Address Information") {
                setWorkPop(true);
              } else if (title === "Contact Information") {
                setContactPop(true);
              } else if (title === "Social Links") {
                setSocialDrawer(true);
              }
            }}
          />
        </>
      ),
    },
    {
      id: 2,
      title: t("Work"),
      value: "work",
      // content: <CardWork />,
      content: (
        <CardPersonal
          data={employeeWork}
          clickDrower={(e, title) => {
            if (title === "Basic Information") {
              setWorkBasicPop(true);
            } else if (title === "Work Policies") {
              setWorkPoliciesPop(true);
            }
          }}
        />
      ),
    },
    {
      id: 3,
      title: t("Document"),
      value: "documents",
      content: (
        <MyDocument
          employee={employeeId}
          close={(e) => {}}
          path={currentPath}
        />
      ),
    },
    {
      id: 4,
      title: t("Leaves"),
      value: "leaves",
      content: <MyLeaves employee={employeeId} />,
    },

    {
      id: 5,
      title: t("Attendence"),
      value: "attendence",
      content: <MyAttendanceProfile employee={employeeId} path={currentPath} />,
    },
    ((currentPath === "myProfile" &&
      parseInt(employeeList.salaryAccess) === 1) ||
      (localStorageData.userData.permissions.includes(79) &&
        currentPath === "employeeProfile")) && {
      id: 6,
      title: t("Payroll"),
      value: "payroll",
      content: (
        <PayrollSalaryOverview employee={employeeId} path={currentPath} />
      ),
    },
    {
      id: 7,
      title: t("Asset"),
      value: "assets",
      content: <MyAssets employee={employeeId} path={currentPath} />,
    },

    // {
    //   id: 9,
    //   title: t("Hierarchy"),
    //   value: "hierarchy",
    //   content: (
    //     <WrapperOrgChart employee={employeeId} />

    //   ),
    // },
    {
      id: 10,
      title: t("Work Entry"),
      value: "workEntry",
      content: <WorkEntry employee={employeeId} />,
    },
  ];

  function ModalPopUp() {
    setSocialDrawer(true);

    // onClick={ModalPopUp}
  }

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      {employeeList?.firstName ? (
        <FlexCol>
          {contextHolder}
          <FlexCol gap={10} id="scrollToTopButton" className="z-50 ">
            {path === "myProfile" ? (
              ""
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/employees"
                  className="text-xl rounded-full vhcenter size-8 2xl:size-10 borderb"
                >
                  <HiChevronLeft className="text-base 2xl:text-lg" />
                </Link>
              </div>
            )}
            {/* LEFT BOX  */}
            <div className="flex flex-col w-full col-span-12 gap-4 2xl:gap-6 xl:col-span-4">
              {/* BREADCRUMBS  */}

              {/* BOX  */}
              <div className="grid grid-cols-4 gap-6 ">
                {/* PRO PIC AND NAME  */}
                <div className="flex items-center justify-between w-full col-span-4 gap-4 2xl:gap-6 xl:col-span-2">
                  <div className="flex flex-col gap-4 2xl:gap-6 image-profile">
                    {/* <div className="relative border-4 border-white rounded-full shadow-md w-[93px] h-[93px] ">
                    <div className="w-full h-full overflow-hidden rounded-full img-profile bg-slate-500">
                      {employeeList.profile ? (
                        <img
                          src={User}
                          className="object-cover object-center w-full h-full"
                          alt=""
                        />
                      ) : (
                        <p className="flex items-center justify-center h-full text-2xl text-white">
                          {employeeList?.firstName?.charAt(0).toUpperCase()}
                        </p>
                      )}
                    </div>

                    
                  </div> */}

                    <div className="relative border-4 border-white rounded-full shadow-xl w-28 h-28 2xl:w-36 2xl:h-36 bg-primaryLight text-primary">
                      <div className="w-full h-full overflow-hidden rounded-full img-profile">
                        {employeeList?.profilePicture ? (
                          <img
                            src={employeeList?.profilePicture}
                            className="object-cover object-center w-full h-full"
                            alt="Employee Profile"
                          />
                        ) : (
                          <p className="flex items-center justify-center h-full text-2xl font-semibold ">
                            {employeeList?.firstName?.charAt(0).toUpperCase()}
                          </p>
                        )}
                      </div>
                      {/* image upload component START*/}
                      <div>
                        <ImgCrop>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                        </ImgCrop>

                        <ButtonClick
                          BtnType="primary"
                          handleSubmit={handleCameraClick}
                          className="absolute vhcenter !w-8 h-8 !rounded-full bottom-1 right-1 p-0"
                          buttonName={<FaCamera size={16} />}
                        ></ButtonClick>
                      </div>
                      {/* image upload component END*/}
                    </div>
                  </div>
                  <div className="flex flex-col w-full ">
                    <div className="flex items-center gap-3">
                      <h1 className="h1">
                        {employeeList?.firstName?.charAt(0).toUpperCase() +
                          employeeList?.firstName?.slice(1) +
                          " " +
                          employeeList?.lastName}
                      </h1>
                      <NewBadge
                        text={
                          employeeList?.isActive ? t("Active") : t("Inactive")
                        }
                        mainClass={`px-2 py-[2px] font-medium gap-2 flex-nowrap 
                        ${
                          employeeList?.isActive
                            ? " bg-green-600/10 dark:bg-green-600/30 text-green-600"
                            : " bg-rose-600/10 dark:bg-rose-600/30 text-rose-600"
                        }`}
                        subClassName1={`${
                          employeeList?.isActive
                            ? `bg-green-600`
                            : `bg-rose-600`
                        }`}
                        subClassName2="text-[9px] 2xl:text-xs font-medium leading-[20px]"
                      />
                    </div>

                    {/* <p className="para">{employeeList?.workDetails?.workRole}</p> */}
                    <p className="para text-primary">
                      {employeeList?.designation}
                    </p>
                    <div className="flex flex-col w-2/3 md:w-4/5 pt-2">
                      <p className="!font-medium para">
                        {t("Profile_Completion")}
                      </p>
                      <ProgressBar
                        percent={employeeList?.profileCompletion}
                        status="active"
                        showInfo={true}
                        strokeColor={primaryColor}
                      />
                    </div>
                    <div className="w-2/3 md:w-4/5 2xl:w-4/6 pt-2">
                      <div className="flex gap-4 mb-2">
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
                                className={`vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white hover:bg-primary hover:text-white bg-primaryalpha/5 text-sm 2xl:text-lg shrink-0 font-semibold`}
                              >
                                {socialMedia.icon
                                  ? socialMedia.icon
                                  : socialMedia?.title.charAt(0).toUpperCase()}
                              </a>
                            </div>
                          );
                        })}

                        {socialdetails?.length > 3 && (
                          <Dropdown
                            overlay={
                              <Menu>
                                {socialdetails
                                  .slice(3)
                                  .map((socialMedia, index) => (
                                    <Menu.Item key={index}>
                                      <a
                                        href={
                                          socialMedia.link.startsWith("http")
                                            ? socialMedia.link
                                            : `http://${socialMedia.link}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className=" text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex gap-2 items-center"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          window.open(socialMedia.link);
                                        }}
                                      >
                                        {socialMedia.icon
                                          ? socialMedia.icon
                                          : socialMedia?.title
                                              .charAt(0)
                                              .toUpperCase()}
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
                              className={`vhcenter size-8 2xl:size-10 transition-all duration-300 rounded-full hover:bg-primary hover:text-white bg-red-100 text-red-600 text-xs 2xl:text-sm shrink-0 font-medium`}
                            >
                              <span className="p-6">
                                +{socialdetails.slice(3).length}
                              </span>
                            </div>
                          </Dropdown>
                        )}

                        <Tooltip
                          title={<CustomTooltipContent />}
                          placement="bottomLeft"
                        >
                          {socialdetails?.length > 0 ? (
                            <div
                              className={`vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white hover:bg-primary hover:text-white bg-primaryalpha/5 text-sm 2xl:text-lg shrink-0 cursor-pointer`}
                              onClick={ModalPopUp}
                            >
                              <PiPlus />
                            </div>
                          ) : (
                            <div
                              className="flex items-center gap-1 2xl:gap-2 cursor-pointer"
                              onClick={ModalPopUp}
                            >
                              <div
                                className={`vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white hover:bg-primary hover:text-white bg-primaryalpha/5 text-sm 2xl:text-lg shrink-0`}
                              >
                                <PiPlus />
                              </div>
                              <div className="text-xs hover:text-primary">
                                Add Social Link
                              </div>
                            </div>
                          )}
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  {/* divider */}
                  <div className="hidden v-divider !h-1/2 xl:block"></div>
                </div>

                {/* CONTACT IMFORMATION  */}
                <div
                  className={`flex gap-6 xl:col-span-1 col-span-2 items-center w-full`}
                >
                  <FlexCol className={"w-full justify-center"} gap={30}>
                    <div className="flex items-center gap-2 group">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white group-hover:bg-primary group-hover:text-white bg-primaryalpha/5 text-sm 2xl:text-lg`}
                        >
                          <FiMail />
                        </div>
                        {/* <div className="flex flex-col gap-1.5">
                  <p className="para !text-xs">Email</p>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {employeeList?.contactDetails.email}
                  </p>
                </div> */}
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
                    <div className="flex items-center gap-2 group">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white group-hover:bg-primary group-hover:text-white bg-primaryalpha/5 text-sm 2xl:text-lg`}
                        >
                          <PiDeviceMobileCamera />
                        </div>
                        {/* <div className="flex flex-col gap-1.5">
                  <p className="para !text-xs">Phone</p>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {employeeList?.contactDetails.phone}
                  </p>
                </div> */}
                        <div class="flex flex-col">
                          <p class="para">{t("Phone")}</p>
                          <p class="text-[10px] font-semibold text-black 2xl:text-base dark:text-white">
                            {employeeList?.phone || "--"}
                            {/* +971 50521252 */}
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
                  <div className="hidden v-divider !h-1/2 xl:block"></div>
                </div>

                {/* WORK INFORMATION */}
                <FlexCol
                  className={" w-full xl:col-span-1 col-span-2 justify-center"}
                  gap={30}
                >
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white group-hover:bg-primary group-hover:text-white bg-primaryalpha/5 text-sm 2xl:text-lg`}
                      >
                        <PiCode />
                      </div>
                      {/* <div className="flex flex-col gap-1.5">
                  <p className="para !text-xs">Department</p>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {employeeList?.workDetails.department}
                  </p>
                </div> */}
                      <div class="flex flex-col">
                        <p class="para">{t("Department")}</p>
                        <p class="text-[10px] font-semibold text-black 2xl:text-base dark:text-white">
                          {employeeList?.department || "--"}
                        </p>
                      </div>
                    </div>
                    {/* <Button
                type="text"
                className="text-black dark:text-white dark:hover:text-blue-300"
                onClick={() =>
                  handleCopyClick(employeeList?.workDetails.department)
                }
              >
                <MdContentCopy size={16} />
              </Button> */}
                  </div>
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white group-hover:bg-primary group-hover:text-white bg-primaryalpha/5 text-sm 2xl:text-lg`}
                      >
                        <PiClockCountdown />
                      </div>
                      {/* <div className="flex flex-col gap-1.5">
                  <p className="para !text-xs">Work Timimg</p>
                  <p className="text-sm bg-emerald-100 text-emerald-600 rounded-full pr-2 py-[2px] w-fit font-medium text-xs vhcenter flex-nowrap">
                    <RxDotFilled className="text-lg" />
                    {employeeList?.workDetails.workTiming}
                  </p>
                </div> */}
                      <div class="flex flex-col gap-1">
                        <p class="para">{t("Shift_Scheme")}</p>
                        <NewBadge
                          text={employeeList?.shiftScheme || "--"}
                          mainClass="bg-emerald-100"
                          subClassName1="bg-emerald-600"
                          subClassName2="font-medium text-emerald-600 text-[10px] 2xl:text-xs"
                        />
                      </div>
                    </div>
                    {/* <Button
                type="text"
                className="text-black dark:text-white dark:hover:text-blue-300"
                onClick={() =>
                  handleCopyClick(employeeList?.workDetails.workTiming)
                }
              >
                <MdContentCopy size={16} />
              </Button> */}
                  </div>
                </FlexCol>
              </div>
            </div>
          </FlexCol>
          {/* RIGHT BOX  */}
          <div className="flex flex-col w-full gap-4">
            {/* <h1 className="h1 !leading-none">{t("Employee_Profile")}</h1> */}
            {/* <Tabs
          tabs={tabs}
          tabClick={(e) => {
            console.log(e, "e");
          }}
          activeOrNot={(e) => {
            setactive(e);
          }}
        /> */}
            <TabsNew tabs={tabs.filter((data) => data)} />
          </div>
        </FlexCol>
      ) : employeeId === null ? (
        <PageNotFound />
      ) : (
        <Loader />
      )}

      {basicPop && (
        <BasicInDetails
          open={basicPop}
          close={() => {
            setBasicPop(false);
          }}
          updateData={employeeList}
          refresh={() => {
            getEmployee();
          }}
        />
      )}
      {workPop && (
        <AddressInformation
          open={workPop}
          close={() => {
            setWorkPop(false);
          }}
          updateData={employeeList}
          refresh={() => {
            getEmployee();
          }}
        />
      )}
      {contactPop && (
        <ContactInformation
          open={contactPop}
          close={() => {
            setContactPop(false);
          }}
          updateData={employeeList}
          refresh={() => {
            getEmployee();
          }}
        />
      )}
      {workBasicPop && (
        <BasicInformation
          open={workBasicPop}
          close={() => {
            setWorkBasicPop(false);
          }}
          employeeId={employeeId}
          // companyDataId={employeeList.companyId}
          updateData={employeeList}
          refresh={() => {
            getEmployee();
          }}
        />
      )}
      {workPoliciesPop && (
        <WorkPolicies
          open={workPoliciesPop}
          close={() => {
            setWorkPoliciesPop(false);
          }}
          employeeId={employeeId}
          updateData={employeeList}
          refresh={() => {
            getEmployee();
          }}
          // companyDataId={employeeList.companyId}
        />
      )}
      {isSocialDrawer && (
        <SocialDrawer
          open={isSocialDrawer}
          data={socialdetails}
          id={userId}
          close={(e) => {
            setSocialDrawer(e);
            getEmployee();
          }}
        />
      )}
      {imageSrc && (
        <Modal
          open={true}
          onCancel={() => {
            setImageSrc(null);
          }}
          onOk={handleCrop}
          okText="Crop"
          cancelText="Cancel"
        >
          <Cropper
            src={imageSrc}
            style={{ height: 400, width: "100%" }}
            initialAspectRatio={1}
            guides={false}
            cropBoxResizable={false}
            cropBoxMovable={false}
            onInitialized={(instance) => setCropper(instance)}
          />
        </Modal>
      )}
    </>
  );
};
const UpdatePassword = (employeeId) => {
  const [show, setShow] = useState(false);

  return (
    <div className="p-1 md:h-[75px] borderb rounded-lg w-full items-center relative transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-center ">
        <div className="flex gap-2.5 items-center">
          <img src={Frame} />
          <div className="flex flex-col gap-1">
            <p className="text-sm 2xl:text-base font-semibold">
              Credential Settings
            </p>
            <p className="text-xs 2xl:text-sm text-gray-500 font-medium">
              Manage and configure authentication details for logging into the
              application.
            </p>
          </div>
        </div>
        <div className="px-2">
          <ButtonClick
            handleSubmit={(e) => {
              setShow(true);
            }}
            buttonName="Update Password"
          />
        </div>
      </div>
      {show && (
        <Updatepassword
          open={show}
          close={() => {
            setShow(false);
          }}
          employee={employeeId}

          // attendanceId={attendanceId}
          // refresh={() => {
          //   getEmployeeAttendence();
          // }}
          // employeeDetails={employeeDetails}
        />
      )}
    </div>
  );
};
export default EmployeeProfile;
