import React, { useEffect, useState } from "react";
import profileimg from "../../assets/images/Rectangle 328.png";
import API, { action, fileAction, newaction } from "../Api";
import TableAnt from "../common/TableAnt";
import AddEmployee from "./AddEmployee";
import { useTranslation } from "react-i18next";
import ButtonClick from "../common/Button";
import Heading from "../common/Heading";
import DownloadButton from "../common/DownloadButton";
import FileSaver from "file-saver";
import Button from "../common/Button";

import { Upload, message } from "antd";
import { FaUpload } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import EmployeeQuickViewModal from "./EmployeeQuickViewModal";

import { useNotification } from "../../Context/Notifications/Notification";
import { RiLoader3Fill } from "react-icons/ri";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function EmployeeList() {
  const { t } = useTranslation();
  const [employeeList, setEmployeeList] = useState([]);
  const [view, setView] = useState("Thumbnail");
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [open, setOpen] = useState(false);
  const [OpenQuickView, setOpenQuickView] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [navigationValue, setNavigationValue] = useState(t("Employee"));

  const [dataPerPage, setDataPerPage] = useState(1);

  const [moreData, setMoreData] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const disablePagination = true;

  //xlsx work
  const [loading, setLoading] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [fileList, setFileList] = useState([]);
  const downloadFile = async () => {
    setLoading(true);
    try {
      setLoadingIcon(true);
      const response = await newaction(API.DOWNLOAD_XLSX, {
        companyId: companyId,
      });

      if (response.data.status === 200) {
        const { filename, filecontent } = response.data.result;

        const byteCharacters = atob(filecontent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const file = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        FileSaver.saveAs(file, filename);
      } else {
        openNotification("error", "Info", response.data.message);
      }
    } catch (error) {
      console.error("Error during file download:", error);
      openNotification("error", "Failed", "Failed to download the file.");
    }
    setLoading(false);
    setLoadingIcon(false);
  };

  const handleUpload = async ({ file }) => {
    try {
      setLoadingUpload(true);
      // Create a FormData object
      const formData = new FormData();
      formData.append("excelFile", file);
      formData.append("employeeId", employeeId);
      formData.append("companyId", companyId);

      // Make a POST request to your API endpoint
      const response = await fileAction(
        formData,
        API.HOST + API.IMPORT_XLSX_ENDPOINT
      );
      // Handle response from the server
      if (response.status === 200) {
        message.success(response.message);
        // Additional handling if needed
        getRefreshList();
        setLoadingUpload(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Failed to upload file");
    } finally {
      setLoadingUpload(false); // Stop loading indicator
    }
  };
  const uploadProps = {
    fileList,

    beforeUpload: (file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const isAllowedFile = ["xlsx", "xls"].includes(fileExtension);
      if (!isAllowedFile) {
        message.error(`${file.name} file format is not supported.`);
        return Upload.LIST_IGNORE;
      }
      return true; // Allow the file to be uploaded
    },
    customRequest: handleUpload,
    onChange: ({ fileList }) => {
      setFileList(fileList);
    },
  };

  // end xlsx work
  //notification
  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  //end notificatioin

  const handleShow = () => setOpen(true);
  const handleQuickShow = (e, id) => {
    setOpenQuickView(true);
  };

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);

  const header = [
    {
      Employee_List: [
        {
          id: 1,
          title: t("Name"),
          value: ["fullName", "code", "designation"],
          flexColumn: true,
          logo: true,
          subvalue: "createdOn",
          bold: true,
          fixed: "left",
        },
        {
          id: 2,
          title: t("Email"),
          value: "email",
          lowerCase: true,
        },
        {
          id: 3,
          title: t("Joining Date"),
          value: "joiningDate",
        },
        {
          id: 4,
          title: "Designation",
          value: "designation",
        },
        {
          id: 5,
          title: t("Profile Completion"),
          value: "profileCompletion",
          progressBar: true,
          progressType: "circle",
          strokeColor: "#9C77F7",
          size: 50,
        },
        {
          id: 5,
          title: t("Status"),
          value: "employeeStatus",
          status: true,
          colour: "statusColour",
        },

        {
          id: 6,
          // title: t("Action"),
          width: 50,
          value: "action",
          fixed: "right",
          dotsVertical: true,
          dotsVerticalContent: [
            {
              title: "Update",
              value: "update",
            },
            {
              title: "Activate",
              value: "activate",
              confirm: true,
            },
            {
              title: "Inactivate",
              value: "Inactivate",
              confirm: true,
            },
            {
              title: "Quick View",
              value: "quickView",
            },
          ],
        },
      ],
    },
  ];
  const getDotsVerticalContent = (isActive) => [
    {
      title: "Update",
      value: "update",
    },
    {
      title: isActive ? "Inactivate" : "Activate",
      value: isActive ? "Inactivate" : "activate",
    },
  ];

  const getList = async () => {
    setMoreData(true);
    setIsLoading(true);
    try {
      await action(API.GET_EMPLOYEE, {
        companyId: companyId,
        employeeId: employeeId,
        limit: 20,
        page: dataPerPage,
      }).then((res) => {
        if (res.status === 200) {
          const updatedResult = res?.result?.map((employee) => ({
            ...employee,
            dotsVerticalContent: getDotsVerticalContent(
              parseInt(employee.isActive) === 1
            ),
          }));
          setMoreData(true);
          setEmployeeList((prevState) => [...prevState, ...updatedResult]);
          setDataPerPage((prevPage) => prevPage + 1);
        } else {
          setMoreData(false);
        }
        setIsLoading(false);
        return res;
      });
    } catch (error) {
      console.error("Error fetching employee list:", error);
    }
  };

  const getRefreshList = async () => {
    try {
      await action(API.GET_EMPLOYEE, {
        companyId: companyId,
        employeeId: employeeId,
      }).then((res) => {
        if (res.status === 200) {
          const updatedResult = res?.result?.map((employee) => ({
            ...employee,
            dotsVerticalContent: getDotsVerticalContent(
              parseInt(employee.isActive) === 1
            ),
          }));
          setEmployeeList(updatedResult);
        }
        return res;
      });
    } catch (error) {
      console.error("Error fetching employee list:", error);
    }
  };

  return (
    <div className="z-0 flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        <div>
          <Heading
            title={t("Employee")}
            description={t("Employee_Description")}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <DownloadButton
            loading={loading}
            // error={error}
            buttonName="Download XLSX File"
            handlingFunction={downloadFile}
            icon={
              loadingIcon ? (
                <RiLoader3Fill className="animate-spin" />
              ) : (
                <FaDownload />
              )
            }
          />
          {/* <Spin spinning={loadingUpload}> */}
          <Upload maxCount={1} showUploadList={false} {...uploadProps}>
            <Button
              icon={
                loadingUpload ? <div class="spinnerBtn"></div> : <FaUpload />
              }
              buttonName={"Import XLSX File"}
            />
          </Upload>
          <ButtonClick
            buttonName={t("Add_Employee_Button")}
            handleSubmit={() => {
              handleShow();
            }}
            BtnType="add"
          ></ButtonClick>
          {/* </Spin> */}
        </div>
      </div>

      {view === "Thumbnail" ? (
        <>
          <TableAnt
            disablePagination={disablePagination}
            dataPerPage={dataPerPage}
            isLoadingState={isLoading}
            moreData={moreData}
            data={employeeList}
            header={header}
            path="Employee_List"
            navigationValue={navigationValue}
            actionID="employeeId"
            pathUrl={"employeeProfile"}
            buttonClick={(e, company) => {
              setUpdateId(e);
            }}
            clickDrawer={(e, i, value, details) => {
              if (i === "quickView") {
                handleQuickShow(true, details);
              } else {
                handleShow();
              }
            }}
            referesh={() => {
              getRefreshList();
            }}
            changePagination={() => {
              getList();
            }}
            deleteApi={API.DELETE_EMPLOYEE_BY_ID}
            updateApi={API.UPDATE_EMPLOYEE_toggleEmployeeStatus}
            scrollXY={[1300, 300]}
          />
        </>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-4">
            {header.map((each, i) => (
              <div
                key={i}
                className={`col-span-2 bg-hero  w-full h-full border bg-no-repeat`}
                style={{ backgroundImage: `url(${profileimg})` }}
              >
                <h6>{each.title}</h6>
              </div>
            ))}
          </div>
        </>
      )}

      {open && (
        <AddEmployee
          open={open}
          close={(e) => {
            getList();
            setUpdateId("");
            setOpen(false);
          }}
          refresh={() => {
            getRefreshList();
          }}
          updateId={OpenQuickView !== true && updateId}
          OpenQuickView={OpenQuickView}
        />
      )}
      {OpenQuickView && (
        <EmployeeQuickViewModal
          open={OpenQuickView}
          close={() => {
            setUpdateId("");
            getList();
            setOpenQuickView(false);
          }}
          employeeId={updateId}
          refresh={() => {
            getList();
          }}
        />
      )}
    </div>
  );
}
