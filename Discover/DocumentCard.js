import React, { useEffect, useState } from "react";
import Doc from "../../assets/images/uploader/doc.png";
import Pdf from "../../assets/images/uploader/pdf.png";
import DragCard from "./DragCard";
import API, { action } from "../Api";
import { useTranslation } from "react-i18next";
import documentsImg from "../../assets/images/discover/documents-3d.png";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function DocumentCard({
  employeeDeatils,
  change = () => {},
  documets,
}) {
  const { t } = useTranslation();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  const [selectedOption, setSelectedOption] = useState("Expiring Docs");
  const [expiringDoc, setExpiringDoc] = useState([]);
  const [missingDoc, setMissingDoc] = useState([]);

  const handleSegmentChange = (value) => {
    setSelectedOption(value);
    change(value);
  };
  const optionsWithCount = [
    { label: "Expiring Docs", count: expiringDoc?.length },
    { label: "Missing Docs", count: missingDoc?.length },
  ];

  const getExpiringDoc = async () => {
    const result = await action(API.DASHBOARD_EMPLOYEE_DOCUMENT, {
      id: employeeId,
      companyId: companyId,
    });
    setExpiringDoc(result.result);
  };
  const getMissingDoc = async () => {
    const result = await action(API.DASHBOARD_EMPLOYEE_MISSING_DOCUMENT, {
      id: employeeId,
      companyId: companyId,
    });
    setMissingDoc(result.result);
  };

  useEffect(() => {
    switch (selectedOption) {
      case "Expiring Docs":
        getExpiringDoc();
        break;
      case "Missing Docs":
        getMissingDoc();
        break;

      default:
        getExpiringDoc();
        break;
    }
  }, [selectedOption]);
  useEffect(() => {
    getExpiringDoc();
    getMissingDoc();
  }, []);

  return (
    <DragCard
      imageIcon={documentsImg}
      header={t("Documents")}
      segment
      segmentSelected={selectedOption}
      segmentOptions={optionsWithCount}
      segmentOnchange={handleSegmentChange}
      className="h-full"
    >
      <div className="flex flex-col gap-2 mt-1 overflow-auto documents h-44 max-h-44 2xl:max-h-44 pr-2.5">
        {selectedOption === "Expiring Docs" ? (
          <>
            {expiringDoc?.map((item, i) => (
              <div className="flex flex-col gap-2" key={i}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 ">
                    <img
                      src={item.documentType === "pdf" ? Pdf : Doc}
                      alt="imagePdfOrDoc"
                      className="w-7 2xl:w-8"
                    />
                    <p className="font-medium pblack">{item.fileName}</p>
                  </div>
                  <p className="flex items-center gap-2 px-2 py-1 mr-2 2xl:text-[10px] text-red-600 bg-red-100 dark:bg-[#171C28] rounded-full text-[8px]">
                    Expiring On{" "}
                    {new Date(item.validTo).toISOString().slice(0, 10)}
                  </p>
                  {/* Add a horizontal line after each item except for the last one */}
                </div>

                <div className="divider-h"></div>
              </div>
            ))}
          </>
        ) : selectedOption === "Missing Docs" ? (
          <>
            {missingDoc?.map((item, i) => (
              <div className="flex flex-col gap-2" key={i}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 ">
                    <img
                      src={item.documentType === "pdf" ? Pdf : Doc}
                      alt="imagePdfOrDoc"
                      className="w-7 2xl:w-8"
                    />
                    <p className="font-medium pblack">{item.documentType}</p>
                  </div>
                  <p className="flex items-center gap-2 px-2 py-1 mr-2 2xl:text-[10px] text-red-600 bg-red-100 dark:bg-[#171C28] rounded-full text-[8px]">
                    Created On{" "}
                    {new Date(item.createdOn).toISOString().slice(0, 10)}
                  </p>
                </div>

                <div className="divider-h"></div>
              </div>
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
    </DragCard>
  );
}
