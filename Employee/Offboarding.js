import React, { useState } from "react";
import {
  PiBookmarkSimpleLight,
  PiDownloadSimple,
  PiPuzzlePieceLight,
  PiThumbsUp,
} from "react-icons/pi";
import saveImg from "../../assets/images/save.svg";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import Heading from "../common/Heading";

import logo from "../../assets/images/EmpLeaveRequest.svg";

import ButtonClick from "../common/Button";
import { BsCash } from "react-icons/bs";
import InitiateOffboarding from "./InitiateOffboarding";
import API, { action, newaction } from "../Api";
import { useEffect } from "react";
import TableAnt from "../common/TableAnt";
import { Link, useNavigate } from "react-router-dom";
import DrawerPop from "../common/DrawerPop";
import ModalPayroll from "../common/ModalPayroll";
import ModalAnt from "../common/ModalAnt";
import axios from "axios";
import { useNotification } from "../../Context/Notifications/Notification";
import FileSaver from "file-saver";
import Dropdown from "../common/Dropdown";
import DownloadButton from "../common/DownloadButton";

export default function Offboarding() {
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery({ maxWidth: 1439 });
  const [openPop, setOpenPop] = useState("");
  const [show, setShow] = useState(false);
  const companyId = localStorage.getItem("companyId");
  const [bordingcounts, setBordingcounts] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const navigate = useNavigate();
  const [offBoarding, setOffboardingId] = useState("");
  const [downloadXlsx, setDownloadXlsx] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [locationlist, setLocationList] = useState([]);
  const [categorylist, setCategorylist] = useState([]);
  const [department, setDepartment] = useState(null);
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState(null);
  const [loginData, setLoginData] = useState(
    JSON.parse(localStorage.getItem("LoginData"))
  );
  const [drawerPop, setDrawerpop] = useState(false);

  const handleShow = () => {
    setShow(true);
    setOpenPop("offboarding");
  };
  const closeModal = () => {
    setDrawerpop(false);
  };
  const header = [
    {
      Employee_List: [
        {
          id: 1,
          title: t("Name"),
          value: ["firstName", "code"],

          flexColumn: true,
          logo: true,
          bold: true,
        },
        {
          id: 2,
          title: t("Designation"),
          value: "designation",
        },
        {
          id: 3,
          title: "Offboarding Status",
          value: "offBoardingStatus",
          status: true,
          colour: "colour",
        },
        {
          id: 4,
          title: t("Seperation"),
          value: "seperationMode",
        },
        {
          id: 5,
          title: "",

          displayAction: true,
          width: 50,

          dotsVerticalContent: [
            {
              title: "Update",
              value: "update",
            },
            {
              title: "Cancel",
              value: "Cancel",
              offBoardingStatusId: "7",
            },
            {
              title: "Onhold",
              value: "Onhold",
            },
          ],
        },
      ],
    },
  ];

  const [cardData, setCardData] = useState([
    {
      icon: <PiBookmarkSimpleLight className="text-primary" />,
      bgcolor: "bg-primaryalpha/5",
      title: "Initiated",
      value: 0,
      text: "employees",
    },
    {
      icon: <PiBookmarkSimpleLight className="text-[#EB7100]" />,
      bgcolor: "bg-[#ffe5cc]",
      title: "On Hold",
      value: 0,
      text: "employees",
    },
    {
      icon: <PiPuzzlePieceLight className="text-[#00BBC7]" />,
      bgcolor: "bg-[#E5FCEE]",
      title: "Asset Pending",
      value: 0,
      text: "employees",
    },
    {
      icon: <BsCash className="text-[#D3B100]" />,
      bgcolor: "bg-[#FFF7CB]",
      title: "FF Pending",
      value: 0,
      text: "employees",
    },
    {
      icon: <PiThumbsUp className="text-[#027A48]" />,
      bgcolor: "bg-[#E5FCEE]",
      title: "Relieved",
      value: 0,
      text: "employees",
    },
  ]);
  const { showNotification } = useNotification();
  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  const [loading, setLoading] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(false);
  const downloadFile = async () => {
    setLoading(true);
    try {
      setLoadingIcon(true);
      const response = await newaction(API.OFF_BOARDING_DOWNLOAD_XLSX, {
        companyId: companyId,
        filter: {
          departmentId: department,
          locationId: location,
          categoryId: category,
          isActive: 2,
        },
      });

      if (response.data.status === 200) {
        const { filename, filecontent } = response.data.result;

        // Decode base64 file content
        const byteCharacters = atob(filecontent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const file = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Save the file using FileSaver.js
        FileSaver.saveAs(file, filename);
        setDownloadXlsx(false);
      } else {
        openNotification("error", "Info", response.data.message);
      }
    } catch (error) {
      openNotification("error", "Failed", "Failed to download the file.");
    }
    setLoadingIcon(false);
    setLoading(false);
  };

  const getDepartment = async (e) => {
    try {
      const result = await action(API.GET_DEPARTMENT, { companyId: companyId });
      setDepartmentList(
        result.result.map((each) => ({
          label: each.department,
          value: each.departmentId,
        }))
      );
    } catch (error) {
      return error;
    }
  };
  const getLocation = async () => {
    const result = await action(API.GET_LOCATION, { companyId: companyId });
    setLocationList(
      result.result?.map((each) => ({
        label: each.location,
        value: each.locationId,
      }))
    );
  };
  const getCategory = async () => {
    try {
      const result = await action(API.GET_CATEGORY, { companyId: companyId });
      setCategorylist([
        ...result.result.map((each) => ({
          label: each.category,
          value: each.categoryId,
        })),
      ]);
    } catch (error) {
      return error;
    }
  };

  const getemployeeOffBoardingCounts = async () => {
    try {
      const result = await action(
        API.GET_OFFBOARDING_employeeOffBoardingCounts,
        {
          companyId: companyId,
        }
      );
      setBordingcounts(result.result);
    } catch (error) {}
  };
  useEffect(() => {
    getemployeeOffBoardingCounts();
    getDepartment();
    getCategory();
    getLocation();
  }, []);
  useEffect(() => {
    if (bordingcounts) {
      setCardData(
        cardData.map((card, index) => {
          const responseKeys = [
            "initiated",
            "onHold",
            "assetPending",
            "ffPending",
            "relieved",
          ];
          return {
            ...card,
            value: bordingcounts[responseKeys[index]],
          };
        })
      );
    }
  }, [bordingcounts]);

  const getEmployeeBoradinglist = async () => {
    try {
      const result = await action(
        API.GET_OFFBOARDING_getEmployeeOffBoardingList,
        {
          companyId: companyId,
        }
      );
      setEmployeeList(result.result);
      console.log(employeeList, "sssssss");
    } catch (error) {}
  };
  useEffect(() => {
    getEmployeeBoradinglist();
  }, []);

  const handlesubmit = async (e, ID) => {
    try {
      const response = await action(API.UPDATE_EMPLOYEE_OFF_BOARDING, {
        offboardingId: ID,
        offBoardingStatusId: e,
      });
      if (response.status === 200) {
        openNotification(
          "success",
          "Successful",
          response.message.replace("OffBoarding", "Offboarding"),
          " ",
          response.message
        );
        getEmployeeBoradinglist();
      } else {
        openNotification(
          "Info",
          "Failed",
          response.message,
          " ",
          response.message
        );
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <div className={`  w-full flex flex-col gap-6 `}>
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        <Heading
          title="Offboarding"
          description="Efficiently manage the offboarding process, ensuring smooth transitions for departing employees and compliance with company policies."
        />

        <div className="flex flex-col xss:flex-row sm:items-center gap-4">
          <DownloadButton
            loading={loading}
            // error={errorXlsx}
            buttonName="Download relieved list"
            handlingFunction={() => {
              setDownloadXlsx(true);
            }}
            icon={<PiDownloadSimple />}
          />
          {loginData.userData.permissions.includes(45) && (
            <ButtonClick
              BtnType="add"
              handleSubmit={() => {
                navigate(`/assetRecovering`);
              }}
              buttonName={t("Initiate Asset Recovery")}
            />
          )}

          <ButtonClick
            BtnType="add"
            handleSubmit={() => {
              setOpenPop("offboarding");
              setShow(true);
            }}
            buttonName="Initiate Offboarding"
          ></ButtonClick>
        </div>
      </div>

      <div className="grid  grid-cols-1 xss:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {cardData.map((item, index) => (
          <div
            key={index}
            className="borderb rounded-lg p-4 h-[119px] dark:text-white dark:bg-dark"
          >
            <div className="flex flex-col gap-2">
              <div
                className={`vhcenter size-[30px] rounded-full shrink-0 dark:bg-[#07A86D]/20 ${item.bgcolor}`}
              >
                {item.icon}
              </div>
              <div className="font-semibold text-[10px] 2xl:text-xs">
                {item.title}
              </div>
              <div className="flex items-center gap-2">
                <div className="font-semibold  text-2xl 2xl:text-3xl">
                  {item.value}
                </div>
                <div className="text-primary text-xs 2xl:text-[14px]">
                  {item.text}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* 
      <TableAnt
        header={header}
        data={employeeList}
        path="Employee_Lists"
        actionID="employeeId"
        buttonClick={(e, company) => {
          console.log(e);
          setUpdateId(e);
        }}
        clickDrawer={(e) => {
          handleShow();
        }}
      /> */}
      <TableAnt
        header={header}
        data={employeeList}
        path="Employee_List"
        actionID="offboardingId"
        buttonClick={(e, company, value, text) => {
          setUpdateId(text.employeeId);
          setOffboardingId(e);
          if (value === "Cancel") {
            handlesubmit(7, e);
          } else if (value === "Onhold") {
            handlesubmit(6, e);
          }
        }}
        clickDrawer={(e, value) => {
          if (value === "update") {
            handleShow();
          }
        }}
      />

      {openPop === "offboarding" && show && (
        <InitiateOffboarding
          open={show}
          close={(e) => {
            setShow(e);
            setOpenPop("");
            setUpdateId("");
          }}
          updateId={updateId}
          // companyDataId={companyId}
          refresh={() => {
            getEmployeeBoradinglist();
          }}
          setOpenModal={(e) => {
            setDrawerpop(e);
          }}
        />
      )}
      {loginData.userData.permissions.includes(45) &&
        loginData.userData.permissions.includes(44) && (
          <ModalAnt
            isVisible={drawerPop}
            onClose={closeModal}
            centered={true}
            okText="Go to Asset Recovery"
            onOk={() => {
              navigate(`/assetRecovering`);
            }}
            width={350}
            okButtonClass="w-full"
            cancelButtonClass="w-full"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="p-1 vhcenter overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 bg-primaryalpha/10">
                <img src={logo} alt="Img" className="rounded-full w-[28px]" />
              </div>
              <h2 className="h2">GO to asset page</h2>
              <p className="para !font-normal">
                Would you like to go to Asset recovery page
              </p>
            </div>
          </ModalAnt>
        )}

      <ModalAnt
        isVisible={downloadXlsx}
        onClose={() => setDownloadXlsx(false)}
        width="453px"
        showTitle={false}
        centered={true}
        padding="10px"
        showOkButton={true}
        showCancelButton={true}
        okText="Download"
        okButtonClass={`w-full${loadingIcon ? "cursor-not-allowed" : ""}`}
        cancelButtonClass="w-full"
        onOk={downloadFile} // # add your functionality here.
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="size-[46px] borderb rounded-full vhcenter bg-primaryalpha/10 text-primary">
              <img src={saveImg} alt=" " className="w-7 h-7" />
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <p className="font-semibold text-text-lg 2xl:text-xl">
                Download Relieved List
              </p>
              <p className="flex text-center text-xs font-medium text-gray-500 2xl:text-sm">
                Generate a detailed Relieved List for employees, with a single
                click
              </p>
            </div>
          </div>
          <div className="borderb bg-[#F9F9F9] rounded-lg p-2 flex flex-col gap-5 dark:bg-dark">
            <Dropdown
              title="Department"
              options={departmentList}
              change={(e) => {
                setDepartment(e);
              }}
              value={department}
              SelectName="All Department"
            />
            <Dropdown
              title="Location"
              options={locationlist}
              change={(e) => {
                setLocation(e);
              }}
              value={location}
              SelectName="All Location"
            />
            <Dropdown
              title="category"
              options={categorylist}
              change={(e) => {
                setCategory(e);
              }}
              value={category}
              SelectName="All Category"
            />
          </div>
        </div>
      </ModalAnt>
    </div>
  );
}
