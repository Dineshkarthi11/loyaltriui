import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";
import API, { action } from "../Api";
import Button from "../common/Button";
import Breadcrumbs from "../common/BreadCrumbs";
import Tabs from "../common/Tabs";

import AddDesignation from "./Master/AddDesignation";
import AddDocumentTypes from "./Master/AddDocumentTypes";
import AddAssetTypes from "./Master/AddAssetTypes";
import AddCountry from "./Master/AddCountry";
import AddState from "./Master/AddState";
import Heading from "../common/Heading";
export default function Master() {
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const [openPop, setOpenPop] = useState("");

  const handleShow = () => setShow(true);

  const [navigationPath, setNavigationPath] = useState("designation");
  const [navigationValue, setNavigationValue] = useState(t("Designation"));
  const [active, setactive] = useState();
  const [updateId, setUpdateId] = useState("");
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));

  // List Data
  const [designation, setDesignation] = useState([]);
  const [documentsList, setDocumentsList] = useState();
  const [assetsList, setAssetsList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);

  // Id based Data

  const breadcrumbItems = [
    // { label: t("Settings"), url: "" },
    // { label: t("Organisation"), url: "" },
    { label: t("Masters"), url: "" },
    { label: navigationValue, url: "" },
  ];

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);
  const tabs = [
    {
      id: 1,
      title: t("Designation"),
      value: "designation",
      navValue: "Designation",
    },
    {
      id: 2,
      title: t("Document_Type"),
      value: "document_Type",
      navValue: "Document Type",
    },
    {
      id: 3,
      title: t("Asset_type"),
      value: "asset_Type",
      navValue: "Asset Type",
    },
    {
      id: 4,
      title: t("Country"),
      value: "country",
      navValue: "Country",
    },

    {
      id: 5,
      title: t("State"),
      value: "State",
      navValue: "State",
    },
  ];

  const header = [
    {
      designation: [
        {
          id: 1,
          title: t("Designation"),
          value: "designation",
          bold: true,
        },
        {
          id: 2,
          title: t("Description"),
          value: "description",
          width: 500,
        },
        {
          id: 3,
          title: t("Status"),
          value: "isActive",
          actionToggle: true,
          alterValue: "",
        },
        {
          id: 4,
          title: t("Created_On"),
          value: "createdOn",
          // alterValue: "isActive",
          dataIndex: "createdOn",
          sorter: (a, b) => {
            const dateA = new Date(a.createdOn);
            const dateB = new Date(b.createdOn);
            return dateA.getTime() - dateB.getTime();
          },
          sortOrder: "ascent",
        },
        {
          id: 5,
          title: t("Action"),
          value: "",
          action: true,
        },
      ],
      document_Type: [
        {
          id: 1,
          title: t("Document_Type"),
          value: "documentType",
          bold: true,
        },
        {
          id: 2,
          title: t("Description"),
          value: "description",
          width: 500,
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
          title: t("Action"),
          value: "",
          action: true,
        },
      ],
      asset_Type: [
        {
          id: 1,
          title: t("Asset_type"),
          value: "assetType",
          bold: true,
        },
        {
          id: 2,
          title: t("Description"),
          value: "description",
          width: 500,
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
          title: t("Action"),
          value: "",
          action: true,
        },
      ],
      country: [
        {
          id: 1,
          title: t("Country"),
          value: "countryName",
          bold: true,
        },
        {
          id: 2,
          title: t("Country Code"),
          value: "countryCode",
        },
        {
          id: 3,
          title: t("Description"),
          value: "description",
          width: 500,
        },
        {
          id: 4,
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
          id: 5,
          title: t("Status"),
          value: "isActive",
          actionToggle: true,
          alterValue: "",
        },
        {
          id: 6,
          title: t("Action"),
          value: "",
          action: true,
        },
      ],
      State: [
        {
          id: 1,
          title: t("State"),
          value: "stateName",
          bold: true,
        },
        {
          id: 2,
          title: t("Description"),
          value: "description",
          width: 500,
        },
        {
          id: 3,
          title: "Created On",
          value: "createdOn",
          // dataIndex: "createdOn",
          // sorter: (a, b) => {
          //   const dateA = new Date(a.createdOn);
          //   const dateB = new Date(b.createdOn);
          //   return dateA.getTime() - dateB.getTime();
          // },
          // sortOrder: "ascent",
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
          title: t("Action"),
          value: "",
          action: true,
        },
      ],
    },
  ];
  const deleteApi = [
    {
      designation: { id: 1, api: API.DELETE_DESIGNATION_RECORD },
      document_Type: { id: 2, api: API.DELETE_DOCUMENT_TYPES_RECORDS },
      asset_Type: { id: 3, api: API.DELETE_ASSETS_TYPES_RECORDS },
      country: { id: 4, api: API.DELETE_COUNTRY },
      State: { id: 5, api: API.DELETE_STATE },
    },
  ];

  const updateApi = [
    {
      designation: { id: 1, api: API.UPDATE_DESIGNATION_STATUS },
      document_Type: { id: 2, api: API.UPDATE_DOCUMENT_STATUS },
      asset_Type: { id: 3, api: API.UPDATE_ASSETS_STATUS },
      country: { id: 4, api: API.UPDATE_COUNTRY_STATUS },
      State: { id: 5, api: API.UPDATE_STATE_STATUS },
    },
  ];
  const actionId = [
    {
      designation: { id: "designationId" },
      document_Type: { id: "documentTypeId" },
      asset_Type: { id: "assetTypeId" },
      country: { id: "countryId" },
      State: { id: "stateId" },
    },
  ];
  const actionData = [
    {
      designation: { id: 1, data: designation },
      document_Type: { id: 2, data: documentsList },
      asset_Type: { id: 3, data: assetsList },
      country: { id: 4, data: countryList },
      State: { id: 5, data: stateList },
    },
  ];

  const getDesignationList = async () => {
    // console.log(API.HOST + API.GET_DESIGNATION_RECORDS + "/" + companyId);
    const result = await action(API.GET_DESIGNATION_RECORDS, {
      companyId: companyId,
    });
    // console.log(result);
    setDesignation(result.result);
  };

  const getDocumentsList = async () => {
    // console.log(API.HOST + API.GET_DOCUMENT_TYPES_RECORDS + "/" + companyId);
    const result = await action(API.GET_DOCUMENT_TYPES_RECORDS, {
      companyId: companyId,
    });
    // console.log(result);
    setDocumentsList(result.result);
  };

  const getAssetsList = async () => {
    // console.log(API.HOST + API.GET_ASSETS_TYPES_RECORDS + "/" + companyId);
    const result = await action(API.GET_ASSETS_TYPES_RECORDS, {
      companyId: companyId,
    });
    // console.log(result);
    setAssetsList(result.result);
  };

  const getCountryList = async () => {
    const result = await action(API.GET_COUNTRY_ALL_LIST);
    // console.log(result);
    setCountryList(result.result);
  };

  const getStateList = async () => {
    // console.log(API.HOST + API.GET_STATE_LISTS);
    const result = await action(API.GET_STATE_LISTS);
    // console.log(result, "stateList");
    setStateList(result.result);
  };
  useEffect(() => {
    switch (navigationPath) {
      default:
        getDesignationList();
        break;
      case "document_Type":
        getDocumentsList();
        break;
      case "asset_Type":
        getAssetsList();
        break;
      case "country":
        getCountryList();
        break;
      case "State":
        getStateList();
        break;
    }
  }, [navigationPath, companyId]);
  useEffect(() => {
    // updateCompany()
  }, [navigationPath]);

  return (
    <div className={`  w-full flex flex-col gap-6 `}>
      {/* {companyId ? (
        <> */}
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        <div>
          <Heading
            title="Masters"
            description={t("Master_Main_Desc")}
          />
        </div>
        <div className="flex flex-col gap-6 sm:flex-row">
          <Button
            handleSubmit={
              () => {
                handleShow();
                // if (e === navigationPath) {
                // setShow(true);

                // setCompanyId(company);
                setOpenPop(navigationPath);
                setUpdateId(false);
                // } else {
                // setOpenPop(navigationPath);

                setShow(true);
                // console.log(company, "companyparentId");
                // if (company === "edit") {
                // setUpdateId(e);
                // }
              }
              // buttonClick(btnName, companyData.companyId);
            }
            // updateFun=""
            // updateBtn={true} // Set to true if it's an update button
            buttonName={`Create ${navigationValue}`} // Set the button name
            className="your-custom-styles" // Add any additional class names for styling
            BtnType="Add" // Specify the button type (Add or Update)
          />
        </div>
      </div>
      <Tabs
        tabs={tabs}
        // data={companyList}
        header={header}
        tabClick={(e) => {
          setNavigationPath(e);
        }}
        tabChange={(e) => {
          setNavigationValue(e);
        }}
        data={
          Object.keys(actionData[0]).includes(navigationPath)
            ? actionData[0]?.[navigationPath].data
            : null
        }
        // actionToggle={true}
        actionID={
          Object.keys(actionId[0]).includes(navigationPath)
            ? actionId[0]?.[navigationPath].id
            : null
        }
        path={navigationPath}
        // companyList={false}
        buttonClick={(e, company) => {
          // console.log(company, "company", e);
          if (e === true) {
            // setShow(e);
          } else if (e === navigationPath) {
            // setShow(true);
            // setCompanyId(company);
            setOpenPop(e);
            setUpdateId(false);
          } else {
            setOpenPop(navigationPath);

            setShow(true);
            // console.log(company, "companyparentId");
            // if (company === "edit") {
            setUpdateId(e);
            // }
          }
        }}
        clickDrawer={(e) => {
          handleShow();
          // console.log(e);
          // setShow(e);
        }}
        navigationClick={(e) => {
          // console.log(e);
          setNavigationPath(e);
          // handleClose();
        }}
        activeOrNot={(e) => {
          // console.log(e, "active check");
          // updateCompany();

          setactive(e);
        }}
        updateApi={
          Object.keys(updateApi[0]).includes(navigationPath)
            ? updateApi[0]?.[navigationPath].api
            : null
        }
        deleteApi={
          Object.keys(deleteApi[0]).includes(navigationPath)
            ? deleteApi[0]?.[navigationPath].api
            : null
        }
        referesh={() => {
          switch (navigationPath) {
            default:
              getDesignationList();
              break;
            case "document_Type":
              getDocumentsList();
              break;
            case "asset_Type":
              getAssetsList();
              break;
            case "country":
              getCountryList();
              break;
            case "State":
              getStateList();
              break;
          }
        }}
      />

      {navigationPath === "document_Type" && show && (
        <AddDocumentTypes
          open={show}
          // country={countryList}
          close={(e) => {
            // console.log(e);
            setUpdateId(false);
            setShow(e);
          }}
          companyDataId={companyId}
          updateId={updateId}
          refresh={() => {
            getDocumentsList();
          }}
          // closeShow={handleClose}
        />
      )}
      {openPop === "designation" && show && (
        <AddDesignation
          open={show}
          close={(e) => {
            getDesignationList();
            setUpdateId(false);
            setShow(e);
          }}
          updateId={updateId}
          companyDataId={companyId}
          refresh={() => {
            getDesignationList();
          }}
        />
      )}
      {openPop === "asset_Type" && show && (
        <AddAssetTypes
          open={show}
          close={(e) => {
            setUpdateId(false);
            setShow(e);
          }}
          updateId={updateId}
          companyDataId={companyId}
          refresh={() => {
            getAssetsList();
          }}
        />
      )}
      {openPop === "country" && show && (
        <AddCountry
          open={show}
          close={(e) => {
            setUpdateId(false);
            setShow(e);
          }}
          updateId={updateId}
          companyDataId={companyId}
          refresh={() => {
            getCountryList();
          }}
        />
      )}
      {openPop === "State" && show && (
        <AddState
          open={show}
          close={(e) => {
            setUpdateId(false);
            setShow(e);
          }}
          updateId={updateId}
          companyDataId={companyId}
          refresh={() => {
            getStateList();
          }}
        />
      )}
    </div>
  );
}
