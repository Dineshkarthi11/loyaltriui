import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FlexCol from "../../common/FlexCol";
import { Flex } from "antd";
import Heading from "../../common/Heading";
import ButtonClick from "../../common/Button";
import TableAnt from "../../common/TableAnt";
import frame from "../../../assets/images/Frame 427319636.png";
import { RxDotFilled } from "react-icons/rx";
import TabsNew from "../../common/TabsNew";
import { employeeDocumentHeader } from "../../data";
import API, { action } from "../../Api";
import AddDocument from "./AddDocument";
import Breadcrumbs from "../../common/BreadCrumbs";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function EmployeeDocument() {
  const { t } = useTranslation();
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [employeeAssetsList, setemployeeAssetsList] = useState([]);
  const [employeeDocument, setEmployeeDocument] = useState([]);
  const [show, setShow] = useState(false);

  const [navigationValue, setNavigationValue] = useState(
    t("Employee_Documents")
  );

  const breadcrumbItems = [
    // { label: t("Company"), url: "" },
    // { label: t("Document_Management"), url: "" },
    { label: navigationValue, url: "" },
  ];

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);
  const tabs = [
    {
      id: 1,
      title: t("Uploded"),
      value: "uploded",
    },
    {
      id: 2,
      title: t("Missing"),
      value: "missing",
    },
  ];

  const getEmployeeDocument = async () => {
    try {
      const result = await action(API.GET_COMPANY_DOCUMENT_LIST, {
        superiorEmployeeId: employeeId,
        companyId: companyId,
      });
      // console.log(result,"Employee");
      if (result.status === 200) {
        setEmployeeDocument(result.result);
      } else {
        // console.log(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployeeDocument();
  }, []);

  const docData = [
    {
      title: t("Expired_Documents"),
      description: "Last 30 Days .",
      count: 0,
    },
    {
      title: t("Expired_Documents"),
      description: "Last 30 Days .",
      count: 0,
    },
  ];

  return (
    <FlexCol>
      <Flex justify="space-between">
        {/* <div>
          <Breadcrumbs
            items={breadcrumbItems}
            description={t(
              "Comprise all essential records and forms related to an employee's employment, including contracts, identification, and performance evaluations."
            )}
          />
        </div> */}
        <Heading
          title="Employee Document"
          description="A centralized repository for storing, organizing, and managing all important employee documents."
        />
        {/* <Flex gap={12}>
          <ButtonClick buttonName={"Drafts"} />
          <ButtonClick
            className={" bg-primary text-white"}
            buttonName={t("Upload_New_Document")}
            handleSubmit={() => {
              setShow(true);
            }}
          />
        </Flex> */}
      </Flex>
      {/* <Flex gap={24}>
        {docData.map((item, index) => (
          <Flex key={index} className="relative p-3 border rounded-xl" gap={10}>
            <img src={frame} alt="" className="w-20 h-20 " />
            <div className="flex flex-col gap-2">
              <div className="h2">{item.title}</div>
              <p className="para">{item.description}</p>
              <div
                className={`${" bg-[#ECFDF3] text-emerald-600"} rounded-full pr-2 py-[2px] w-fit font-medium text-xs vhcenter flex-nowrap`}
              >
                <RxDotFilled className="text-2xl" />
                <p className=" text-xs">{item.count} Docs</p>
              </div>
            </div>
          </Flex>
        ))}
      </Flex> */}
      {/* <TabsNew tabs={tabs} onTabChange={(e) => {}} /> */}

      <TableAnt
        data={employeeDocument}
        header={employeeDocumentHeader}
        path="Employee_Document"
      />

      {show && (
        <AddDocument
          open={show}
          close={() => {
            setShow(false);
          }}
        />
      )}
    </FlexCol>
  );
}
