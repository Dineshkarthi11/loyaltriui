import React, { useEffect, useMemo, useState } from "react";
import FlexCol from "../../common/FlexCol";
import TableAnt from "../../common/TableAnt";
import API, { action } from "../../Api";
import { myDocumentHeader } from "../../data";
import allCandidate from "../../../assets/images/Frame 427319638.png";
import { Flex } from "antd";
import ButtonClick from "../../common/Button";
import { useTranslation } from "react-i18next";
import Doc from "../../../assets/images/uploader/doc.png";
import Pdf from "../../../assets/images/uploader/pdf.png";
import AddDocument from "./AddDocument";
import ModalAnt from "../../common/ModalAnt";
import PopImg from "../../../assets/images/EmpLeaveRequest.svg";
import Heading from "../../common/Heading";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function MyDocument({
  path,
  employee = null,
  close = () => {},
}) {
  const { t } = useTranslation();
  const [employeeDocumentTypeList, setEmployeeDocumentTypeList] = useState([]);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(
    employee || localStorageData.employeeId
  );

  const [openPop, setOpenPop] = useState(false);
  const [show, setShow] = useState(false);

  const [missingDoc, setMissingDoc] = useState([]);

  useEffect(() => {
    if (employee) setEmployeeId(employee);
    setCompanyId(localStorageData.companyId);
    console.log(localStorageData, "localStorageData");
  }, [employee]);
  const getDocumentType = async (e) => {
    try {
      const result = await action(API.GET_EMPLOYEE_DOCUMENT, {
        employeeId: employeeId,
      });

      setEmployeeDocumentTypeList(result.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getMissingDoc = async () => {
    const result = await action(API.DASHBOARD_EMPLOYEE_MISSING_DOCUMENT, {
      id: employeeId,
      companyId: companyId,
    });
    setMissingDoc(
      result.result.map((each) => ({
        name: each.documentType,
        url: "download_url",
        type: each.fileName,
        date: each.validTo,
        createdon: each.createdOn,
        size: "",
        description: each.description,
      }))
    );
  };
  useMemo(() => getMissingDoc(), [employee]);

  useEffect(() => {
    getDocumentType();
  }, [employee]);
  const documentheader = [
    path === "employeeProfile"
      ? {
          Document: [
            {
              id: 1,
              title: "Document Name",
              value: "fileName",
              bold: true,
              // render: (record, text) => (
              //   <span className="font-medium">{text.fileName}</span>
              // ),
            },

            {
              id: 2,
              title: "Type",
              value: "documentType",
            },

            {
              id: 3,
              title: "Status",
              value: "isActive",
              alterValue: "isActive",
            },
            {
              id: 4,
              title: "Documents",
              value: "isActive",
              Download: true,
              width: 100,
              buttonName: "View",
              file: "documentName",
            },
          ],
        }
      : {
          My_Document: [
            {
              id: 1,
              title: "Document Name",
              value: "fileName",
              bold: true,
              // render: (record, text) => (
              //   <span className="font-medium">{text.fileName}</span>
              // ),
            },

            {
              id: 2,
              title: "Type",
              value: "documentType",
            },

            {
              id: 3,
              title: "Status",
              value: "isActive",
              alterValue: "isActive",
            },
            {
              id: 4,
              title: "Documents",
              // value: "isActive",
              Download: true,
              width: 100,
              buttonName: "View",
              file: "documentName",
            },
          ],
        },
  ];
  return (
    <FlexCol>
      {path !== "employeeProfile" ? (
        <div className="flex flex-col items-start justify-between w-full gap-3 sm:items-center sm:flex-row">
          <Heading
            title="Document Management"
            description="Manage the employee records"
          />
        </div>
      ) : (
        ""
      )}
      <Flex
        gap={14}
        justify="space-between"
        align="center"
        className=" w-full p-1.5 pr-4 borderb rounded-xl h-[75px] bg-white dark:bg-black"
      >
        {missingDoc && missingDoc.length > 0 && (
          <>
            <div className="flex items-center gap-2 ">
              <div className="rounded-md h-[3.9rem] w-[3.9rem]">
                <img
                  src={allCandidate}
                  alt=""
                  className="object-cover object-center w-full h-full"
                />
              </div>
              <div className="">
                <div className="flex items-center gap-2">
                  <h1 className="h2">{t("Missing_Documents")}</h1>
                </div>
                <p className="para">{t("Handles_the_retrieval")}</p>
              </div>
            </div>
            <ButtonClick
              buttonName={t("View_All")}
              handleSubmit={() => {
                setOpenPop(true);
              }}
            />
          </>
        )}
      </Flex>

      <TableAnt
        TblBtnView={true}
        TblBtnName={t("Upload_Documents")}
        TblBtnSubmit={(e) => {
          setShow(true);
        }}
        data={employeeDocumentTypeList}
        header={documentheader}
        path={path === "employeeProfile" ? "Document" : "My_Document"}
      />

      <ModalAnt
        isVisible={openPop}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        onClose={(e) => {
          setOpenPop(false);
        }}
        width="445px"
      >
        <div className="flex flex-col gap-2.5 p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-12 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
              <img
                src={PopImg}
                alt="Img"
                className="rounded-full w-5 2xl:w-[24px]"
              />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              Missing Document
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="para">{`Missing Documents (${missingDoc.length})`}</p>
            </div>

            <div className="flex flex-col gap-2 overflow-auto documents 2xl:max-h-48 max-h-36">
              {/* DOCUMENTS  */}
              {missingDoc
                ? missingDoc.map((docs, i) => (
                    <div
                      className="flex flex-col gap-2"
                      key={i}
                      onClick={() => {
                        // window.open(docs, "_blank");
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 ">
                          <img
                            src={docs.type === "pdf" ? Pdf : Doc}
                            alt="imageDocument"
                            className="w-7 2xl:w-10"
                          />
                          <div className="flex flex-col">
                            <p className="para !text-black dark:!text-white">
                              {docs.name}
                            </p>
                            <p className="para 2xl:!text-xs !text-[8px] flex gap-2">
                              <span>{docs.date}</span> <span>{docs.size}</span>
                            </p>
                          </div>
                        </div>
                        <div></div>
                        {/* Add a horizontal line after each item except for the last one */}
                      </div>
                      {i !== missingDoc.length - 1 && (
                        <div className="v-divider"></div>
                      )}
                    </div>
                  ))
                : ""}
            </div>
          </div>
        </div>
      </ModalAnt>
      {show && employeeId && (
        <AddDocument
          open={show}
          close={(e) => {
            getDocumentType();
            setShow(false);
            close();
          }}
          employeeId={employeeId}
        />
      )}
    </FlexCol>
  );
}
