import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PayrollSettingsTable from "../../../../common/PayrollSettingsTable";
import PAYROLLAPI, {
  Payrollaction,
  payrollFileAction,
} from "../../../../PayRollApi";
import CreateSalaryTemplate from "./CreateSalaryTemplate";
import { motion } from "framer-motion";
import ButtonClick from "../../../../common/Button";
import { Upload, message } from "antd";
import { FaUpload } from "react-icons/fa";
import Heading from "../../../../common/Heading";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function SalaryTemplateBuilder() {
  const [salaryTemplateList, setSalaryTemplateList] = useState([]);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [show, setShow] = useState(false);
  const [openPop, setOpenPop] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [fileList, setFileList] = useState([]);

  const { t } = useTranslation();

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setOpenPop("");
    localStorage.removeItem("actionidforupdate");
  };

  const header = [
    {
      salaryTemplateBuilder: [
        {
          id: 1,
          title: t("Template Name"),
          value: "templateName",
          bold: true,
        },
        {
          id: 2,
          title: t("Employee Type "),
          value: "templateEmployeeType",
        },
        {
          id: 3,
          title: t("Amount Per Month "),
          value: "grossSalary",
        },
        {
          id: 4,
          title: t("Employee"),
          value: "multiImage",
          multiImage: true,
          view: true,
        },
        {
          id: 5,
          title: t("Action"),
          value: "action",
          action: true,
          download: true,
        },
      ],
    },
  ];

  const getSalaryTemplateList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_Salary_Template_Builder,
        {
          companyId: companyId,
        }
      );

      setSalaryTemplateList(
        result?.result?.map((each) => ({
          ...each,
          employeeName: each.employee?.map((data) => data.employeeName),
          name: each.employee?.map((data) => data.employeeName),
          multiImage: each.employee?.map((data) => data.profilePicture),
          employeeId: each.employee?.map((data) => data.employeeId),
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getSalaryTemplateList();
  }, []);

  const handleUpload = async ({ file }) => {
    try {
      setLoadingUpload(true);
      const formData = new FormData();
      formData.append("action", "BulkSalaryImport");
      formData.append("companyId", companyId);
      formData.append("excelFile", file);
      formData.append("withEffectfrom", "2024-06-13");
      formData.append("createdBy", employeeId);

      const response = await payrollFileAction(
        formData,
        PAYROLLAPI.IMPORT_XLSX_ENDPOINT
      );

      if (response.status === 200) {
        message.success(response.message);
        getSalaryTemplateList();
        setLoadingUpload(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      // console.error("Error uploading file:", error);
      message.error("Failed to upload file");
    } finally {
      setLoadingUpload(false);
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

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:gap-0 md:justify-between">
        <Heading
          title="Salary Template Builder"
          description={t(
            "Facilitates the creation of multiple templates to assign varying compensation structures to different types of employees within the organization."
          )}
        />
        <div className="flex  gap-3 flex-row ">
          <Upload maxCount={1} showUploadList={false} {...uploadProps}>
            <ButtonClick
              icon={
                loadingUpload ? <div class="spinnerBtn"></div> : <FaUpload />
              }
              buttonName={"Import XLSX File"}
            />
          </Upload>
        </div>
      </div>

      <div className="mt-6">
        <PayrollSettingsTable
          data={salaryTemplateList}
          heading={"Salary Templates"}
          buttonName={"Create Salary Template "}
          BtnType={"add"}
          header={header}
          payrollSettings={true}
          path="salaryTemplateBuilder"
          actionID={"salaryTemplateId"}
          deleteApi={"deleteSalaryTempById"}
          downloadApi={"BulkSalaryTemplate"}
          cursorPointer={false}
          refresh={() => {
            getSalaryTemplateList();
          }}
          buttonClick={(e) => {
            setUpdateId(e);
          }}
          clickDrawer={(actionID) => {
            handleShow("employeeBankAccount", actionID);
          }}
        />
      </div>

      {show && (
        <motion.div initial="hidden" animate="visible">
          <CreateSalaryTemplate
            open={show}
            close={(e) => {
              setShow(e);
              setUpdateId(null);
              handleClose();
              getSalaryTemplateList();
            }}
            refresh={() => {
              getSalaryTemplateList();
            }}
            openPolicy={openPop}
            updateId={updateId}
          />
        </motion.div>
      )}
    </div>
  );
}
