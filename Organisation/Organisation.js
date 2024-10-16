import { message, Modal, Tooltip } from "antd";
import React, { useEffect, useState, useRef } from "react";
import copy from "clipboard-copy";
import API, { action, fileAction } from "../Api";
import { useTranslation } from "react-i18next";
import AddCompany from "./Company/AddCompany";
import Button from "../common/Button";
import TableAnt from "../common/TableAnt";
import ButtonClick from "../common/Button";
import EditOrganisation from "./EditOrganisation";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

// ICONS
import { RiEdit2Fill } from "react-icons/ri";
import { FaCamera } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { RiPhoneFill } from "react-icons/ri";
import { FiMail } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";

// IMAGES
import PopImg from "../../assets/images/EmpLeaveRequest.svg";
import NoImagePlaceholder from "../../assets/images/NoImagePlaceholder.png";
import Doc from "../../assets/images/uploader/doc.png";
import Docx from "../../assets/images/uploader/docx.png";
import Pdf from "../../assets/images/uploader/pdf.png";
import png from "../../assets/images/uploader/png.png";
import jpg from "../../assets/images/uploader/jpg.png";
import jpeg from "../../assets/images/uploader/jpeg.png";
import svg from "../../assets/images/uploader/svg.png";
import webp from "../../assets/images/uploader/webp.png";
import blankFile from "../../assets/images/uploader/blankFile.png";
import companyimg from "../../assets/images/clogo.jpeg";

import AddDocuments from "./AddDocuments";
import { PiCoins, PiFlag, PiMapPin } from "react-icons/pi";
import Loader from "../common/Loader";
import AddMasterAdmin from "./Company/AddMasterAdmin";
import { NoData } from "../common/SVGFiles";
import ModalAnt from "../common/ModalAnt";
import Avatar from "../common/Avatar";
import localStorageData from "../common/Functions/localStorageKeyValues";

const Organisation = ({ companyProfile }) => {
  const { t } = useTranslation();
  const [organisationList, setOrganisationList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [NoOfDoc, setNumberOfDocuments] = useState();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [company, setCompany] = useState([]);
  const [masterAdmin, setMasterAdmin] = useState([]);
  const [companyLogo, setCompanyLogo] = useState([]);
  const [openPop, setOpenPop] = useState("");
  const [navigationPath, setNavigationPath] = useState("organisation");
  const [updateId, setUpdateId] = useState("");
  const [fileUpdateId, setFileUpdateId] = useState("");
  const [companylogo, setIdCompanylogo] = useState();
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [countryList, setCountryList] = useState([]);
  const loginData = localStorageData.LoginData;
  const [viewOpen, setViewOpen] = useState(false);
  const [supperviewOpen, setsupperViewOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(
    localStorageData.employeeId
  );
  const organisationId = localStorageData.organisationId;
  const primaryColor = localStorageData.mainColor;
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

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
          formData.append("action", "organizationLogoUpload");
          formData.append("organisationId", organisationId);
          formData.append("file", croppedImageBlob);

          const response = await fileAction(formData);
          if (response.status === 200) {
            message.success("Image added successfully.");
            getRecord();
          } else {
            message.error("Failed to upload image.");
          }
          setImageSrc(null);
        }
      } catch (error) {
        return error;
      }
    }
  };

  const handleFileChange = async (event) => {
    const allowedImageFormats = ["jpg", "png", "jpeg", "svg", "webp"];
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

      if (!allowedImageFormats.includes(fileExtension)) {
        message.error(
          `${selectedFile.name} is not a valid image format. Please upload files with extensions: jpg, png, jpeg, svg, or webp.`
        );
        return;
      }

      const objectUrl = URL.createObjectURL(selectedFile);
      setImageSrc(objectUrl);

      // Clean up the object URL after using it
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const showPOPUP = () => {
    fileInputRef.current.click();
  };
  const fileInputRef = useRef(null);

  const deleteImage = async () => {
    const formData = new FormData();
    formData.append("action", "organizationLogoDelete");
    formData.append("organisationId", organisationId);
    try {
      const response = await fileAction(formData);
      if (response.status === 200) {
        messageApi.open({
          type: "success",
          content: `Image deleted successfully`,
        });
        getRecord();
      }
    } catch (error) {
      return error;
    }
  };

  const deleteDoc = async (id) => {
    const formData = new FormData();
    formData.append("action", "organizationDocumentDelete");
    formData.append("organisationDocumentId", id);
    try {
      const response = await fileAction(formData);
      if (response.status === 200) {
        messageApi.open({
          type: "success",
          content: `Document deleted successfully`,
        });
        getDocuments();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const openDoc = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleCopyClick = (value) => {
    copy(value);

    messageApi.open({
      type: "success",
      content: `${value} is copied succesfully`,
    });
  };

  const header = [
    {
      Company: [
        {
          id: 1,
          title: t("Company"),
          value: ["company"],
          flexColumn: true,
          logo: true,
          url: true,
          subvalue: "createdOn",
        },

        {
          id: 2,
          title: t("Email"),
          value: "email",
          lowerCase: true,
        },
        {
          id: 3,
          title: "Created On",
          value: "createdOn",
          dataIndex: "createdOn",
          sorter: (a, b) => {
            const dateA = new Date(a.createdOn);
            const dateB = new Date(b.createdOn);
            return dateA.getTime() - dateB.getTime();
          },
          sortOrder: "ascent",
        },
        {
          id: 4,
          title: t("Status"),
          value: "isActive",
          actionToggle: true,
          alterValue: "",
        },
        {
          id: 5,
          title: "",
          value: "action",
          dotsVertical: true,
          width: 50,
          dotsVerticalContent: [
            {
              title: "Update",
              value: "update",
            },

            {
              title: "Delete",
              value: "delete",
              confirm: true,
              key: true,
            },
          ],
        },
      ],
    },
  ];
  const header2 = [
    {
      Super_Admin: [
        {
          id: 1,
          title: t("Name"),
          value: "firstName",
          flexColumn: false,
        },
        {
          id: 2,
          title: t("Email"),
          value: "userName",
          lowerCase: true,
        },
        {
          id: 3,
          title: "Company",
          value: "multiImage",
          multiImage: true,
          view: false,
        },
        {
          id: 4,
          title: "Status",
          value: "isActive",
          alterValue: "",
          actionToggle: true,
        },
        {
          id: 5,
          title: t("Action"),
          value: "action",
          action: true,
        },
      ],
    },
  ];

  const orgDetails = [
    {
      icon: <PiMapPin size={16} />,
      title: "Address",
      details: organisationList.address,
    },
    {
      icon: <PiFlag size={16} />,
      title: "Country",
      details: organisationList.countryName,
    },
    {
      icon: <PiMapPin size={16} />,
      title: "State / City",
      details: organisationList.stateName + " / " + organisationList.city,
    },
    {
      icon: <PiCoins size={16} />,
      title: "Currency",
      details: organisationList.currency,
    },
  ];

  const OrgInfo = [
    {
      image: organisationList?.contactInfo1profilePicture,
      name: organisationList?.contactInfo1Name,
      position: organisationList?.contactInfo1Designation,
      phone: organisationList?.contactInfo1Phone,
      email: organisationList?.contactInfo1Email,
    },
    {
      image: organisationList?.contactInfo2profilePicture,
      name: organisationList?.contactInfo2Name,
      position: organisationList?.contactInfo2Designation,
      phone: organisationList?.contactInfo2Phone,
      email: organisationList?.contactInfo2Email,
    },
  ];

  const getRecord = async () => {
    const result = await action(API.GET_ORGANISATION_BY_ID, {
      id: organisationId,
    });

    setOrganisationList(result.result);
  };
  const getDocuments = async () => {
    const response = await action(API.GET_ALL_ORGANISATION_DOCS, {
      organisationId: organisationId,
    });
    if (response && response.status === 200) {
      setNumberOfDocuments(response.result.length);
      setDocumentList(response.result);
    }
  };
  const getCompany = async () => {
    const result = await action(API.GET_COMPANY_RECORDS, {
      organisationId: organisationId,
    });
    setCompany(
      result.result?.map((each) => ({
        ...each,
        profilePicture: each?.logo,
      }))
    );
    const logos = result.result.filter((data) => data?.logo);
    if (logos.length > 0) {
      const firstFourLogos = logos.slice(0, 4);
      setCompanyLogo(
        firstFourLogos.map((data) => ({
          company: data?.company,
          logo: data?.logo,
          logo: data?.logo,
        }))
      );
    }
  };
  const getAllMasterAdmin = async () => {
    try {
      const result = await action(API.GET_ALL_MASTER_ADMIN_LIST, {
        employeeId: loggedInEmployeeId,
        organisationId: organisationId,
      });
      if (result.status === 200) {
        setMasterAdmin(
          result.result?.map((each) => ({
            ...each,
            multiImage: each?.company?.map((data) => data.logo),
            name: each?.company?.map((data) => data.company),
          }))
        );
      }
    } catch (error) {
      return error;
    }
  };
  const fetchCompanyDetails = async () => {
    try {
      const result = await action(API.GET_COMPANY_ID_BASED_RECORDS, {
        id: companyId,
      });
      setIdCompanylogo(result?.result?.logo);
      return result?.result;
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    fetchCompanyDetails();
    getRecord();
    getDocuments();
    getCompany();
    getAllMasterAdmin();
  }, []);

  const lightenColor = (color, factor) => {
    // Remove '#' from the beginning of the color string
    color = color.slice(1);

    // Parse the hex color to RGB
    let r = parseInt(color.substr(0, 2), 16);
    let g = parseInt(color.substr(2, 2), 16);
    let b = parseInt(color.substr(4, 2), 16);

    // Scale each RGB component towards 255 (white)
    r = Math.round(r + (255 - r) * factor);
    g = Math.round(g + (255 - g) * factor);
    b = Math.round(b + (255 - b) * factor);

    // Convert the RGB values back to hex
    let newColor =
      "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");

    return newColor;
  };

  const lighterColor = lightenColor(primaryColor, 0.94); // Adjust the percentage as needed

  const handleRowClick = async (companyId) => {
    try {
      const result = await action(API.GET_COMPANY_ID_BASED_RECORDS, {
        id: companyId,
      });

      // Set the fetched data to the state
      setSelectedCompany(result?.result || null);
      setViewOpen(true);
    } catch (error) {
      return error;
    }
  };
  const handlesupperrow = async (e) => {
    try {
      const response = await action(API.SHOW_MASTER_ADMIN, {
        id: e,
      });
      const resultArray = response?.result || [];
      const record = resultArray.find(
        (item) => item.employeeId === e.toString()
      );
      setSelectedAdmin(record);
      if (record) {
        setsupperViewOpen(true);
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <div className="flex flex-col">
      {contextHolder}
      {/* COVER IMAGE WITH BUTTON AND COMPONIES */}
      {organisationList.organisation ? (
        <>
          <div className="absolute top-0 left-0 w-full h-36 2xl:h-40 cover-image overflow-hidden bg-[#F9FAFC] dark:bg-white/10">
            {/* <img
          src={mode == "pink" ? CoverOrgPink : CoverOrg}
          alt=""
          className="object-center w-full h-full dark:hidden"
        /> */}
            <div
              className="w-full h-full relative blur-[2px] dark:!bg-primaryalpha/10"
              style={{ backgroundColor: lighterColor }}
            >
              <div className=" absolute -top-20 right-4 size-[152px] rounded-full blur-[52px] flex-shrink-0 bg-primaryalpha/50"></div>
            </div>

            {/* EDIT BUTTON AND COMPONIES IMAGE */}
            <div className="absolute flex flex-col items-end justify-between gap-4 xl:justify-normal xl:items-center xl:flex-row ltr:xl:right-7 rtl:xl:left-7 xl:bottom-7 xl:top-auto ltr:right-3 rtl:left-3 bottom-3 top-3 ">
              {companyProfile ? (
                ""
              ) : (
                <>
                  {companyLogo.length > 0 ? (
                    <div className="relative flex items-center gap-2">
                      <p className="para">
                        {t("Companies_under_this_Organization")}
                      </p>
                      <div className="flex -space-x-3 rtl:space-x-reverse">
                        {companyLogo?.map((data, index) => (
                          <div
                            key={index}
                            className="size-8 rounded-full overflow-hidden bg-white"
                          >
                            <img
                              className="object-cover object-center w-full h-full"
                              src={data?.logo || NoImagePlaceholder}
                              alt=""
                              title={data?.company}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {!companyProfile && (
                    <Button
                      icon={<RiEdit2Fill />}
                      buttonName={`Edit`} // Set the button name
                      className="your-custom-styles" // Add any additional class names for styling
                      BtnType="primary" // Specify the button type (Add or Update)
                      handleSubmit={() => {
                        setOpenPop(navigationPath);
                        setUpdateId(false);
                        setShow(true);
                      }}
                    />
                  )}
                </>
              )}
            </div>

            {/* <div className="relative w-full h-full image-section">
          
        </div> */}
          </div>

          <div className="relative flex flex-col gap-6 pb-6 2xl:top-7 top-11">
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="flex flex-col gap-4 image-profile">
                <div className="relative border-4 border-white rounded-full shadow-md w-28 h-28 2xl:w-36 2xl:h-36 ">
                  <div className="w-full h-full overflow-hidden rounded-full img-profile bg-[#c2c9d2]">
                    <img
                      src={
                        organisationList.logo
                          ? organisationList.logo
                          : NoImagePlaceholder
                      }
                      className="object-cover object-center w-full h-full"
                      alt="NOIMAGE FOUND"
                    />
                  </div>
                  {/* image upload component START*/}
                  {!companyProfile && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />

                      <div>
                        <ButtonClick
                          BtnType="primary"
                          handleSubmit={showPOPUP}
                          className="absolute vhcenter !w-8 h-8 !rounded-full bottom-1 right-1 p-0"
                          buttonName={<FaCamera size={16} />}
                        />
                      </div>
                    </div>
                  )}
                  {/* image upload component END*/}
                </div>
                {!companyProfile && (
                  <>
                    {organisationList?.logo && (
                      <Button
                        buttonName={t(`Remove_Image`)}
                        className="!text-xs 2xl:!text-sm hover:text-primary"
                        BtnType="Text"
                        handleSubmit={deleteImage}
                      />
                    )}
                  </>
                )}
              </div>
              <div className="flex flex-col w-full gap-14">
                <div
                  className="flex flex-col gap-1 items-cent er md:items-start"
                  title={organisationList.url}
                >
                  <a
                    href={`http://${organisationList.url}`}
                    className={`text-xs 2xl:text-sm font-medium text-primary bg-primaryalpha/10 rounded-full px-3 py-1`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {organisationList.url}
                  </a>
                  <h1 className="flex items-center gap-3 text-2xl font-bold capitalize 2xl:text-3xl dark:text-white">
                    {organisationList.organisation}
                    {/* <div className="dot-green"> </div> */}

                    <span class="relative flex h-3 w-3">
                      <span class="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </h1>
                  <p className="para">
                    {t("Active_since")} : {organisationList.createdOn}
                  </p>
                </div>
                <div className="grid justify-between grid-cols-1 gap-4 w-fu ll lg:gap-4 xl:gap-3 xs:grid-cols-2 xl:grid-cols-4">
                  {orgDetails.map((data, i) => (
                    <div
                      className={`flex items-center lg:justify-center gap-3 group  ${
                        i !== orgDetails.length - 1 ? "h-divider-xl" : ""
                      }`}
                      key={i}
                    >
                      <div className="flex items-center justify-center w-8 h-8 text-sm transition-all duration-300 border rounded-full 2xl:w-10 2xl:h-10 border-secondaryWhite dark:border-secondaryDark dark:text-white group-hover:bg-primary group-hover:text-white 2xl:text-lg shrink-0">
                        {data.icon}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <p className="para">{data.title}</p>
                        <p className="text-xs font-semibold text-black 2xl:text-sm dark:text-white">
                          {data.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="divider-h"></div>
            <div className="grid w-full grid-cols-1 lg:gap-4 2xl:gap-5 xl:grid-cols-2">
              <div className="flex flex-col w-full gap-5 lg:col-span-2 xl:col-auto">
                <div className="flex items-center gap-3">
                  <p className="h3 !font-semibold">{t("ContactInfo")}</p>
                </div>
                <div className="grid w-full grid-cols-1 gap-3 xl:grid-cols-2">
                  {/* BOX*/}
                  {OrgInfo.map((OrgInfo, index) => (
                    <div
                      className=" !p-1.5 box-wrapper !rounded-2xl"
                      key={index}
                    >
                      <div className="relative w-full !px-3 2xl:!px-6 overflow-hidden box-wrapper !rounded-xl">
                        <div className="top-0 h-[46px] w-full bg-primaryalpha/5 dark:bg-primaryalpha/30 absolute left-0 z-0">
                          {" "}
                        </div>
                        <div className="z-10 flex flex-col gap-6">
                          <div className="z-10 flex flex-col gap-2">
                            <div className="vhcenter bg-white size-8 2xl:size-10 rounded-full md:mt-3">
                              <Avatar
                                image={OrgInfo.image}
                                name={OrgInfo.name}
                                className="border border-white"
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold text-black 2xl:text-base dark:text-white">
                                {OrgInfo.name}
                              </p>
                              <p className="para">{OrgInfo.position}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 text-sm transition-all duration-300 border rounded-full 2xl:w-10 2xl:h-10 border-secondaryWhite dark:border-secondaryDark dark:text-white group-hover:bg-primary group-hover:text-white 2xl:text-lg">
                                <RiPhoneFill />
                              </div>
                              <div className="flex flex-col gap-0.5 2xl:gap-1.5">
                                <p className="para">{t("Phone")}</p>
                                <p className="text-[10px] font-semibold text-black 2xl:text-base dark:text-white">
                                  {OrgInfo.phone}
                                </p>
                              </div>
                            </div>
                            <Button
                              BtnType="text"
                              tooltip="Copy"
                              tooltipPlacement="right"
                              buttonName={<MdContentCopy size={16} />}
                              className="px-2 text-black text-opacity-30 dark:text-white dark:hover:text-primary w-fit"
                              handleSubmit={() =>
                                handleCopyClick(OrgInfo.phone)
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between gap-2 group">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm transition-all duration-300 border rounded-full 2xl:w-10 2xl:h-10 border-secondaryWhite dark:border-secondaryDark dark:text-white group-hover:bg-primary group-hover:text-white 2xl:text-lg">
                                <FiMail />
                              </div>
                              <div className="flex flex-col gap-0.5 2xl:gap-1.5">
                                <p className="para">{t("Email")}</p>
                                <p
                                  title={OrgInfo?.email}
                                  className="truncate-overflow text-[10px] font-semibold text-black 2xl:text-base dark:text-white"
                                >
                                  {OrgInfo?.email}
                                </p>
                              </div>
                            </div>

                            <Button
                              BtnType="text"
                              tooltip="Copy"
                              tooltipPlacement="right"
                              buttonName={<MdContentCopy size={16} />}
                              className="px-2 text-black text-opacity-30 dark:text-white dark:hover:text-primary w-fit"
                              handleSubmit={() =>
                                handleCopyClick(OrgInfo.email)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col w-full gap-5 lg:col-span-2 xl:col-auto">
                <div className="flex items-center gap-3">
                  <p className="h3 !font-semibold">
                    {organisationList.organisation + " " + t("Documents")}{" "}
                  </p>
                  <p
                    className={`font-medium text-primary bg-primaryalpha/10 dark:bg-primaryalpha/30 text-[10px] 2xl:text-xs rounded-full px-3 py-1`}
                  >
                    Recently updated 1 Document
                  </p>
                </div>

                {/* BOX 3 */}
                <div className="relative w-full h-full overflow-hidden box-wrapper !rounded-2xl">
                  <div className="flex flex-col gap-4">
                    {/* <UploadFile onFileChange={(files) => onFileChange(files)}/> */}
                    <div className="flex items-center justify-between">
                      <p className="para">
                        {t("Uploaded_Documents")} ({NoOfDoc})
                      </p>
                      {!companyProfile && (
                        <Tooltip placement="top" title={"Add Document"}>
                          <div className="flex items-center gap-2">
                            <p className="para">{t("Add_Document")}</p>
                            <div
                              className="border-2 p-1 rounded-full dark:text-white hover:bg-primary hover:text-white cursor-pointer"
                              onClick={() => {
                                setFileUpdateId("");
                                setOpenPop("addDocument");
                                setShow2(true);
                              }}
                            >
                              <IoAdd className="text-lg" />
                            </div>
                          </div>
                        </Tooltip>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 overflow-auto documents 2xl:max-h-52 max-h-36">
                      {/* DOCUMENTS  */}
                      {documentList.length > 0 ? (
                        documentList.map((docs, i) => (
                          <div className="flex flex-col gap-2" key={i}>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3 ">
                                <img
                                  src={(() => {
                                    switch (docs.fileType) {
                                      case "pdf":
                                        return Pdf;
                                      case "doc":
                                        return Doc;
                                      case "docx":
                                        return Docx;
                                      case "png":
                                        return png;
                                      case "jpg":
                                        return jpg;
                                      case "jpeg":
                                        return jpeg;
                                      case "svg":
                                        return svg;
                                      case "webp":
                                        return webp;
                                      default:
                                        return blankFile;
                                    }
                                  })()}
                                  alt="pdfimage"
                                  className="w-7 2xl:w-10"
                                />

                                <div className="flex flex-col">
                                  <p className="para !text-black dark:!text-white">
                                    {docs.documentName}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center text-xs text-black actions 2xl:text-base dark:text-white">
                                <Button
                                  BtnType="text"
                                  tooltip="View File"
                                  className="text-black text-opacity-70 2xl:text-base dark:text-white"
                                  handleSubmit={() =>
                                    openDoc(docs.documentFile)
                                  }
                                  buttonName={<IoEyeOutline size={16} />}
                                />
                                {!companyProfile && (
                                  <>
                                    <Button
                                      // icon={}
                                      BtnType="text"
                                      tooltip="Update"
                                      className="text-black text-opacity-70 2xl:text-base dark:text-white"
                                      handleSubmit={() => {
                                        setFileUpdateId(
                                          docs.organisationDocumentId
                                        );
                                        setOpenPop("addDocument"); // button for editing the docs
                                        setShow2(true);
                                      }}
                                      buttonName={
                                        <MdOutlineModeEditOutline size={16} />
                                      }
                                    />
                                    <Button
                                      // icon={}
                                      BtnType="text"
                                      tooltip="Delete"
                                      className="text-black text-opacity-70 2xl:text-base dark:text-white"
                                      handleSubmit={() =>
                                        deleteDoc(docs.organisationDocumentId)
                                      }
                                      buttonName={<FiTrash2 size={16} />}
                                    />
                                  </>
                                )}
                              </div>
                              {/* Add a horizontal line after each item except for the last one */}
                            </div>
                            {i !== documentList.length - 1 && (
                              <div className="divider-h"></div>
                            )}
                          </div>
                        ))
                      ) : (
                        <NoData />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-6 lg:items-center lg:flex-row">
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="flex-grow"></div>
              </div>
            </div>

            {!companyProfile && (
              <TableAnt
                data={company}
                header={header}
                actionID="companyId"
                updateApi={API.UPDATE_ONLY_ISACTIVE}
                deleteApi={API.DELETE_COMPANY_RECORD}
                path="Company"
                TblBtnView={true}
                TblBtnSubmit={() => {
                  setOpenPop("company");
                  setUpdateId(false);
                  setShow(true);
                }}
                TblBtnName={"Create Company"}
                viewOutside={true}
                buttonClick={(e, company) => {
                  setUpdateId(e);
                }}
                viewClick={(e) => {
                  handleRowClick(e);
                }}
                referesh={() => {
                  getCompany();
                }}
                clickDrawer={(e) => {
                  setShow(true);
                  setOpenPop("company");
                }}
              />
            )}
            {parseInt(loginData?.userData?.adminLevel) !== 0 && (
              <>
                <div className="flex flex-col justify-end gap-6 lg:items-center lg:flex-row">
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="flex-grow"></div>
                  </div>
                </div>
                {!companyProfile && (
                  <TableAnt
                    data={masterAdmin}
                    header={header2}
                    actionID="employeeId"
                    actionstatusID="employeeCredentialId"
                    updateApi={API.UPDATE_MASTER_ADMIN_STATUS}
                    deleteApi={API.DELETE_MASTER_ADMIN}
                    path="Super_Admin"
                    viewOutside={true}
                    TblBtnView={true}
                    TblBtnSubmit={() => {
                      setOpenPop("addMasterAdmin");
                      setUpdateId(false);
                      setShow3(true);
                    }}
                    TblBtnName={"Add Super Admin"}
                    buttonClick={(e, company) => {
                      setUpdateId(e);
                    }}
                    viewClick={(e) => {
                      console.log(e, "eeee");

                      handlesupperrow(e);
                    }}
                    clickDrawer={(e) => {
                      setOpenPop("addMasterAdmin");
                      setShow3(true);
                    }}
                    referesh={() => {
                      getAllMasterAdmin();
                    }}
                  />
                )}
              </>
            )}
            {/* <OrgTable /> */}
          </div>
        </>
      ) : (
        <Loader />
      )}

      {openPop === "organisation" && show && (
        <EditOrganisation
          open={show}
          close={(e) => {
            setShow(e);
            setOpenPop("");
          }}
          refresh={() => {
            getRecord();
          }}
        />
      )}

      {openPop === "addDocument" && show2 && (
        <AddDocuments
          open={show2}
          fileUpdateId={fileUpdateId}
          close={(e) => {
            setShow2(e);
            setOpenPop("");
          }}
          refresh={() => {
            setFileUpdateId("");
            getDocuments();
          }}
        />
      )}

      {openPop === "company" && show && (
        <AddCompany
          open={show}
          country={countryList}
          close={(e) => {
            setShow(e);
            setOpenPop("");
          }}
          updateId={updateId}
          refresh={() => {
            getCompany();
          }}
        />
      )}

      {openPop === "addMasterAdmin" && show3 && (
        <AddMasterAdmin
          open={show3}
          fileUpdateId={fileUpdateId}
          close={(e) => {
            getAllMasterAdmin();
            setShow3(e);
            setOpenPop("");
          }}
          updateId={updateId}
        />
      )}

      {/* To show the popup details of company table row */}
      <ModalAnt
        isVisible={viewOpen}
        onClose={() => setViewOpen(false)}
        // width="435px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[553px] p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-12 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
              <img
                src={selectedCompany?.logo || PopImg}
                alt="Img"
                className={
                  selectedCompany?.logo
                    ? "w-full h-full object-cover object-center rounded-full"
                    : "rounded-full w-5 2xl:w-[24px]"
                }
              />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">Company</p>
          </div>
          <div className="m-auto">
            <p className="text-center text-xs 2xl:text-sm text-gray-500">
              Details of Selected Company
            </p>
          </div>
          <div className="max-h-[320px] overflow-auto mt-2">
            <div className="borderb rounded-lg p-3 bg-[#F9F9F9] dark:bg-dark">
              <div className="grid grid-cols-3 justify-evenly gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Company</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {(selectedCompany && selectedCompany.company) || "----"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Website</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {(selectedCompany && selectedCompany.url) || "----"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Email</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {(selectedCompany && selectedCompany.email) || "----"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Phone Number</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {(selectedCompany && selectedCompany.phone) || "----"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Address</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {(selectedCompany && selectedCompany.address) || "----"}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Country</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {(selectedCompany && selectedCompany.countryName) || "----"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">State</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {(selectedCompany && selectedCompany.stateName) || "----"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">City</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {(selectedCompany && selectedCompany.cityName) || "----"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Zip Code</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {(selectedCompany && selectedCompany.zipCode) || "----"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">CIN</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {(selectedCompany && selectedCompany.cin) || "----"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Created On</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {(selectedCompany && selectedCompany.createdOn) || "----"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Status</p>
                  <p
                    className={`rounded-2xl px-2 py-0.5 w-fit text-xs 2xl:text-sm ${
                      selectedCompany && selectedCompany.isActive === 1
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {selectedCompany && selectedCompany.isActive === 1
                      ? "Active"
                      : "In Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalAnt>

      <ModalAnt
        isVisible={supperviewOpen}
        onClose={() => setsupperViewOpen(false)}
        // width="435px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[553px] p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-12 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
              <img
                src={companylogo ? companylogo : companyimg}
                alt="Img"
                className=" w-full h-full object-cover object-center rounded-full"
              />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              Super Admin
            </p>
          </div>
          <div className="m-auto">
            <p className="text-center text-xs 2xl:text-sm text-gray-500">
              Details of Selected Super Admin
            </p>
          </div>
          <div className="max-h-[320px] overflow-auto mt-2">
            <div className="borderb rounded-lg p-3 bg-[#F9F9F9] dark:bg-dark">
              <div className="grid grid-cols-3 justify-evenly gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Name</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {selectedAdmin?.firstName || "----"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Email</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {selectedAdmin?.userName || "----"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Phone Number</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {selectedAdmin?.phone || "----"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Company</p>
                  <div className="flex -space-x-3 rtl:space-x-reverse">
                    {selectedAdmin?.company?.map((item, index) => (
                      <div key={index}>
                        {item?.logo ? (
                          <div className="flex flex-col gap-1">
                            <div className="size-8 rounded-full overflow-hidden border-2 border-white bg-white">
                              <img
                                className="object-cover object-center w-full h-full"
                                src={item?.logo}
                                alt={item?.company}
                              />
                            </div>
                            <div className="text-[7px]">{item?.company}</div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <p className="flex items-center border-2 border-white justify-center size-8 font-semibold bg-primaryLight text-primary rounded-full">
                              {item?.company?.charAt(0).toUpperCase()}
                            </p>
                            <div className="text-[7px]">{item?.company}</div>
                          </div>
                        )}
                      </div>
                    )) || "----"}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-grey">Status</p>
                  <p
                    className={`rounded-2xl px-2 py-0.5 w-fit text-xs 2xl:text-sm ${
                      selectedAdmin?.isActive === "1"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {selectedAdmin?.isActive === "1" ? "Active" : "In Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalAnt>

      {imageSrc && (
        <Modal
          open={true}
          onCancel={() => setImageSrc(null)}
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
    </div>
  );
};

export default Organisation;
