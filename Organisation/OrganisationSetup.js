import React, { useEffect, useMemo, useState } from "react";
import Tabs from "../common/Tabs";
import Breadcrumbs from "../common/BreadCrumbs";
import Button from "../common/Button";
import axios from "axios";
import API, { action } from "../Api";
import AddLocation from "./Company/AddLocation";
import AddDepartment from "./Company/AddDepartment";
import AddCategory from "./Company/AddCategory";
import AddSubSubCategory from "./Company/AddSubCategory";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Heading from "../common/Heading";

const OrganisationSetup = () => {
  const { t } = useTranslation();
  const companySliceId = useSelector((state) => state.layout.companyId);
  const [show, setShow] = useState(false);
  const [openPop, setOpenPop] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [navigationPath, setNavigationPath] = useState("location");
  const [navigationValue, setNavigationValue] = useState(t("Location"));
  const [active, setactive] = useState();
  const [updateId, setUpdateId] = useState("");
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [organisationId, setOrganisationId] = useState(
    localStorage.getItem("organisationId")
  );

  // List Data

  const [locationList, setLocationList] = useState();
  const [departmentList, setDepartmentList] = useState();
  const [categoryList, setCategoryList] = useState();
  const [subCategoryList, setSubCategoryList] = useState();

  // Company
  const breadcrumbItemsCompany = [
    { label: t("Settings"), url: "" },
    { label: t("Company") },
  ];

  // Table
  const breadcrumbItems = [
    // { label: t("Settings"), url: "" },
    // { label: t("Organisation"), url: "" },
    { label: t("Organisation_Setup"), url: "" },
    { label: navigationValue, url: "" },
  ];

  const header = [
    {
      location: [
        {
          id: 1,
          title: t("Location"),
          value: "location",
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
          title: t("Created_On"),
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
      department: [
        {
          id: 1,
          title: t("Department"),
          value: "department",
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
          title: t("Created_On"),
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
      category: [
        {
          id: 1,
          title: t("Category"),
          value: "category",
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
      subcategory: [
        {
          id: 1,
          title: t("Subcategory"),
          value: "subCategory",
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
      // leaveTypes: [
      //   {
      //     id: 1,
      //     title: t("LeaveType"),
      //     value: "leaveType",
      //   },
      //   {
      //     id: 2,
      //     title: t("Description"),
      //     value: "description",
      //   },
      //   {
      //     id: 3,
      //     title: t("Action"),
      //     value: "",
      //     action: true,
      //   },
      // ],
      // shift: [
      //   {
      //     id: 1,
      //     title: t("Shift"),
      //     value: "shift",
      //   },
      //   {
      //     id: 2,
      //     title: t("Description"),
      //     value: "description",
      //   },
      //   {
      //     id: 3,
      //     title: t("Action"),
      //     value: "",
      //     action: true,
      //   },
      // ],
      // shiftScemes: [
      //   {
      //     id: 1,
      //     title: t("Shift_Scheme"),
      //     value: "shiftScheme",
      //   },
      //   {
      //     id: 2,
      //     title: t("Description"),
      //     value: "description",
      //   },
      //   {
      //     id: 3,
      //     title: t("Action"),
      //     value: "",
      //     action: true,
      //   },
      // ],
    },
  ];

  const tabs = [
    {
      id: 2,
      title: t("Location"),
      value: "location",
      navValue: "Location",
    },
    {
      id: 3,
      title: t("Departments"),
      value: "department",
      navValue: "Department",
    },
    {
      id: 4,
      title: t("Category"),
      value: "category",
      navValue: "Category",
    },
    {
      id: 5,
      title: t("Subcategory"),
      value: "subcategory",
      navValue: "Subcategory",
    },
  ];
  const deleteApi = [
    {
      company: { id: 1, api: API.DELETE_COMPANY_RECORD },
      location: { id: 2, api: API.DELETE_LOCATION },
      department: { id: 3, api: API.DELETE_DEPARTMENT },
      category: { id: 4, api: API.DELETE_CATEGORY },
      subcategory: { id: 5, api: API.DELETE_SUB_CATEGORY },
    },
  ];

  const updateApi = [
    {
      company: { id: 1, api: API.UPDATE_ONLY_ISACTIVE },
      location: { id: 2, api: API.UPDATE_LOCATION_STATUS },
      department: { id: 3, api: API.UPDATE_DEPARTMENT_STATUS },
      category: { id: 4, api: API.UPDATE_CATEGORY_STATUS },
      subcategory: { id: 5, api: API.UPDATE_SUB_CATEGORY_STATUS },
    },
  ];
  const actionId = [
    {
      location: { id: "locationId" },
      department: { id: "departmentId" },
      category: { id: "categoryId" },
      subcategory: { id: "subCategoryId" },
    },
  ];
  const actionData = [
    {
      location: { id: 1, data: locationList },
      department: { id: 2, data: departmentList },
      category: { id: 3, data: categoryList },
      subcategory: { id: 4, data: subCategoryList },
    },
  ];

  const getLocationList = async () => {
    const result = await action(API.GET_LOCATION, { companyId: companyId });
    setLocationList(result.result);
  };
  const getDepartmentList = async () => {
    // console.log(API.HOST + API.GET_DEPARTMENT + "/" + companyId);
    const result = await action(API.GET_DEPARTMENT, { companyId: companyId });
    setDepartmentList(result.result);
  };
  const getCategoryList = async () => {
    const result = await action(API.GET_CATEGORY, { companyId: companyId });
    setCategoryList(result.result);
  };
  const getSubCategoryList = async () => {
    const result = await action(API.GET_SUB_CATEGORY, { companyId: companyId });
    setSubCategoryList(result.result);
  };
  useEffect(() => {
    setCompanyId(companySliceId || localStorage.getItem("companyId"));
    // setNavigationPath(navigationPath);
    switch (navigationPath) {
      case "location":
        getLocationList();
        break;
      case "department":
        getDepartmentList();
        break;
      case "category":
        getCategoryList();
        break;
      case "subcategory":
        getSubCategoryList();
        break;
      default:
        break;
    }
  }, [companySliceId]);

  useEffect(() => {
    switch (navigationPath) {
      default:
        getLocationList();
        // getCompanyList();
        break;
      case "location":
        getLocationList();
        break;
      case "department":
        getDepartmentList();
        break;
      case "category":
        getCategoryList();
        break;
      case "subcategory":
        getSubCategoryList();
        break;
    }
  }, [navigationPath]);

  return (
    <div className="flex flex-col gap-6">
      {/* {companyId ? ( 
        <>*/}
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        <div>
          {/* <Breadcrumbs items={breadcrumbItems} /> */}
          <Heading
            title={t("Organisation_Setup")}
            description={t("Main_DEsc_Org")}
          />
          {/* <p className="para">{t("Main_DEsc_Org")}</p> */}
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
        navigationValue={navigationValue}
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
              getLocationList();
              break;
            case "location":
              getLocationList();
              break;
            case "department":
              getDepartmentList();
              break;
            case "category":
              getCategoryList();
              break;
            case "subcategory":
              getSubCategoryList();
              break;
          }
        }}
      />
      {/* </>
      // ) : (
      //   <CompanyCard
      //     CompanyID={(id) => {
      //       setCompanyId(id);
      //       console.log(id, "CompanyIdUpdates");
      //     }}
      //     path={["Setting", "Company"]}
      //   />
      // )} */}
      {/* {openPop === "company" && show && (
        <AddCompany
          open={show}
          country={countryList}
          close={(e) => {
            setShow(e);
          }}
          updateId={updateId}
          refresh={() => {
            getCompanyList();
          }}
        />
      )} */}
      {navigationPath === "location" && show && (
        <AddLocation
          open={show}
          close={(e) => {
            setUpdateId(null);
            setShow(e);
          }}
          updateId={updateId}
          companyDataId={companyId}
          refresh={() => {
            getLocationList();
          }}
        />
      )}

      {openPop === "department" && show && (
        <AddDepartment
          open={show}
          close={(e) => {
            setUpdateId(null);
            setShow(e);
          }}
          updateId={updateId}
          companyDataId={companyId}
          refresh={() => {
            getDepartmentList();
          }}
        />
      )}
      {openPop === "category" && show && (
        <AddCategory
          open={show}
          close={(e) => {
            setShow(e);
          }}
          updateId={updateId}
          companyDataId={companyId}
          refresh={() => {
            getCategoryList();
          }}
        />
      )}
      {openPop === "subcategory" && show && (
        <AddSubSubCategory
          open={show}
          close={(e) => {
            setShow(e);
          }}
          updateId={updateId}
          companyDataId={companyId}
          refresh={() => {
            getSubCategoryList();
          }}
        />
      )}
    </div>
  );
};

export default OrganisationSetup;
