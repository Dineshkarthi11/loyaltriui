import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FlexCol from "../../common/FlexCol";
import { Flex } from "antd";
import Heading from "../../common/Heading";
import ButtonClick from "../../common/Button";
import TableAnt from "../../common/TableAnt";
import { employeeAssetsHeader } from "../../data";
import CreateNewAssets from "./CreateNewAssets";
import API, { action } from "../../Api";
import Breadcrumbs from "../../common/BreadCrumbs";
import Loader from "../../common/Loader";
import PopImg from "../../../assets/images/ModalAntImg.svg";
import ModalAnt from "../../common/ModalAnt";

export default function CompanyAssets() {
  const { t } = useTranslation();
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [employeeAssetsList, setemployeeAssetsList] = useState([]);
  const [show, setShow] = useState(false);
  const [companyAssetsList, setCompanyAssetsList] = useState([]);
  const [navigationValue, setNavigationValue] = useState(t("Company_Assets"));
  const [modalData, setModalData] = useState();
  const [viewModal, setViewModal] = useState(false);


  const breadcrumbItems = [
    // { label: t("Company"), url: "" },
    // { label: t("Asset_Management"), url: "" },
    { label: navigationValue, url: "" },
  ];

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);

  const getCompanyAssets = async (e) => {
    // console.log(API.GET_COMPANY_EMPLOYEE_ASSETS, {
    //   companyId: companyId, //companyId
    // });
    try {
      const result = await action(API.GET_COMPANY_EMPLOYEE_ASSETS, {
        companyId: companyId, //companyId
      });

      // console.log(result, "Request");

      setCompanyAssetsList(result?.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCompanyAssets();
  }, []);

  return (

    <FlexCol>
      <Flex justify="space-between">
        {/* <div>
          <Breadcrumbs
            items={breadcrumbItems}
            description={t(
              "Company_asset_description"
            )}
          />
        </div> */}
        <Heading
          title="Company Assets"
          description="Manage and track company's physical and digital assets efficiently."
        />
        {/* <ButtonClick
          buttonName={"Create New Asset"}
          className={"bg-primary text-white"}
          handleSubmit={(e) => {
            setShow(true);
          }}
        /> */}
      </Flex>

      <TableAnt
        data={companyAssetsList}
        header={employeeAssetsHeader}
        path="Company_Assets"
        viewOutside={true}
        viewClick={(e, text) => {
          const data = {
            Asset_Name: text.assetName,
            Asset_Type_Name: text.assetTypeName,
            Employee_Name: text.employeeName,
            Warranty_Expiry: text.warrantyExpiry,
            Description: text.description
          };
          setModalData(Object.entries(data));
          setViewModal(true);
        }}
      />

      {show && (
        <CreateNewAssets
          open={show}
          close={() => {
            setShow(false);
          }}
        />
      )}

      <ModalAnt
        isVisible={viewModal}
        onClose={() => setViewModal(false)}
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
                src={PopImg}
                alt="Img"
                className="rounded-full w-6 2xl:w-7"
              />
            </div>
            <div className="font-semibold text-[17px] 2xl:text-[19px]">
              Company Assets
            </div>
            <div className="m-auto">
              <div className="text-center text-xs 2xl:text-sm text-gray-500">
                Details of Selected Company Assets
              </div>
            </div>
          </div>
          <div className="max-h-[320px] overflow-auto mt-2">
            <div className="borderb rounded-lg p-3 bg-[#F9F9F9] dark:bg-dark">
              <div className="grid grid-cols-3 justify-evenly gap-4">
                {modalData?.map((each, index) => (
                  <React.Fragment key={index}>
                    {each[0] !== "Description" ? (
                      <div className="flex flex-col gap-1">
                        <div className="text-xs 2xl:text-sm text-grey">{each[0].replace(/_/g, ' ')}</div>
                        <div className="text-xs 2xl:text-sm">{each[1] || "--"}</div>
                      </div>
                    ) : (
                      <div className="col-span-3">
                          <div className="text-xs 2xl:text-sm text-grey">{each[0].replace(/_/g, ' ')}</div>
                          <div className="text-xs 2xl:text-sm">{each[1] || "--"}</div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ModalAnt>
    </FlexCol>

  );
}
