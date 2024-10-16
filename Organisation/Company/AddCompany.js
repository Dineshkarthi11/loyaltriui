import React, { useEffect, useMemo, useState } from "react";
import FormInput from "../../common/FormInput";
import { HiOutlineMail } from "react-icons/hi";
import ToggleBtn from "../../common/ToggleBtn";
import Dropdown from "../../common/Dropdown";
import { useFormik } from "formik";
import * as yup from "yup";
import API, { action, fileAction } from "../../Api";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import DrawerPop from "../../common/DrawerPop";
import NoImagePlaceholder from "../../../assets/images/NoImagePlaceholder.png";
import { useNotification } from "../../../Context/Notifications/Notification";
import FileUpload from "../../common/FileUpload";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function AddCompany({
  open,
  country = [],
  close = () => {},
  updateId,
  // closeShow,
  refresh,
}) {
  const { t } = useTranslation();
  const storedOrganisationId = localStorageData.organisationId;
  const organisationIdFromRedux = useSelector(
    (state) => state.layout.organisationId
  );
  const organisationId = storedOrganisationId || organisationIdFromRedux;

  const [show, setShow] = useState(open);
  const [isUpdate, setIsUpdate] = useState();
  const [companyId, setCompanyId] = useState();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [file, setFile] = useState(null);

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const handleClose = () => {
    setShow(false);
    setCompanyId("");
    formik.setFieldValue("company", "");
    formik.setFieldValue("email", "");
    formik.setFieldValue("phone", "");
    formik.setFieldValue("url", "");
    formik.setFieldValue("address", "");
    formik.setFieldValue("isActive", "");
    formik.setFieldValue("country", "");
    formik.setFieldValue("zipCode", "");
    formik.setFieldValue("cin", "");
  };

  const [companyList, setCompanyList] = useState();
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const [logoname, setLogoname] = useState();
  const [baseUrl, setBaseUrl] = useState("");
  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  const phoneRegExp =
    /^(?:(?:\+|00)91[\s-]?)?(?:\d{10})$|^(?:(?:\+|00)971[\s-]?)?(?:\d{9})$/;

  const formik = useFormik({
    initialValues: {
      company: "",
      email: "",
      phone: "",
      url: "",
      address: "",
      isActive: 1,
      country_id: null,
      state_id: null,
      city_id: null,
      zipCode: "",
      cin: "",
      description: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      company: yup.string().required("Company is required"),
      address: yup.string().required("Address is required"),
      // email: yup
      //   .string()
      //   .email("Please enter company email")
      //   .required("Email is required"),
      email: yup
        .string()
        .email("Please enter company email")
        .required("Email is required")
        .test(
          "is-valid-email",
          "Please enter a valid email",
          (value) =>
            value && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(value)
        ),
      // phone: yup.number().required("Phone Number is required"),
      // url: yup.string().required("Website is required"),
      phone: yup
        .string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("Phone Number is required"),
      url: yup
        .string()
        .matches(
          /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
          "Enter correct url"
        )
        .required("Website is required"),
      // address: yup.string().required("Please enter city"),
      country_id: yup.string().required("Country is required"),
      state_id: yup.string().required("State is required"),
      city_id: yup.string().required("City is required"),
      cin: yup.string().required("CIN is required"),
      zipCode: yup
        .string()
        .matches(/^[0-9]+$/, "Zipcode must only contain numbers")
        .required("Zipcode is required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        // If there is a file to upload
        // Check if it's an update or add action
        if (updateId) {
          // Update existing company
          try {
            const result = await action(API.UPDATE_COMPANY, {
              id: companyId,
              company: formik.values.company,
              email: formik.values.email,
              phone: formik.values.phone,
              url: formik.values.url,
              address: formik.values.address,
              isActive: formik.values.isActive,
              countryId: formik.values.country_id,
              stateId: formik.values.state_id,
              cityId: formik.values.city_id,
              zipCode: formik.values.zipCode,
              cin: formik.values.cin,
              description: formik.values.description,
            });
            if (result.status === 200) {
              openNotification("success", "Successful", result.message);
              setTimeout(() => {
                handleClose();
                refresh();
                setLoading(false);
              }, 500);
            } else {
              openNotification("error", "Info", result.message);
              setLoading(false);
            }
            if (file) {
              const formData = new FormData();
              formData.append("action", "companyLogoUpload");
              formData.append("companyId", companyId);
              formData.append("file", e?.logo);
              // Upload the file
              try {
                const response = await fileAction(formData);
                refresh();
                setFile(null);
                setLoading(false);
              } catch (error) {
                openNotification("error", "File Upload Error", error.message);
                setLoading(false);
              }
            }
          } catch (error) {
            openNotification("error", "Failed", error);
            setLoading(false);
          }
        } else {
          // Add new company
          const result = await action(API.ADD_COMPANY, {
            organisationId: organisationId,
            description: e.description,
            company: e.company,
            email: e.email,
            phone: e.phone,
            url: e.url,
            address: e.address,
            isActive: e.isActive,
            countryId: e.country_id,
            stateId: e.state_id,
            cityId: e.city_id,
            zipCode: e.zipCode,
            cin: e.cin,
            createdBy: employeeId,
          });

          if (result.status === 200) {
            if (file) {
              const formData = new FormData();
              formData.append("action", "companyLogoUpload");
              formData.append("companyId", result?.result?.insertedId);
              formData.append("file", e?.logo);
              // Upload the file
              try {
                const response = await fileAction(formData);
                refresh();
                setFile(null);
                setLoading(false);
              } catch (error) {
                openNotification("error", "File Upload Error", error.message);
                setLoading(false);
              }
            }
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              refresh();
              setLoading(false);
            }, 500);
          } else {
            openNotification("error", "Failed Error", result.message);
            setLoading(false);
          }
        }
      } catch (error) {
        openNotification(
          "error",
          "Internal Error",
          "Something went wrong internally. Please try again later."
        );
        setLoading(false);
      }
    },
  });

  const getIdBasedCompany = async (e) => {
    try {
      if (e !== "" && updateId !== false) {
        const result = await action(API.GET_COMPANY_ID_BASED_RECORDS, {
          id: e,
        });

        if (result?.status === 200) {
          setCompanyId(result?.result?.companyId);
          formik.setFieldValue("company", result?.result?.company);
          formik.setFieldValue("email", result?.result?.email);
          formik.setFieldValue("phone", result?.result?.phone);
          formik.setFieldValue("logo", result?.result?.logo);
          formik.setFieldValue("url", result?.result?.url);
          formik.setFieldValue("address", result?.result?.address);
          formik.setFieldValue("isActive", result?.result?.isActive);
          formik.setFieldValue("country_id", result?.result?.countryId);
          formik.setFieldValue("state_id", result?.result?.stateId);
          formik.setFieldValue("city_id", result?.result?.cityId);
          formik.setFieldValue("zipCode", result?.result?.zipCode);
          formik.setFieldValue("cin", result?.result?.cin);
          formik.setFieldValue("description", result?.result?.description);
          setLogoname(result?.result?.logoName);
          setIsUpdate(true);
        }
        // setGetIdBasedUpdatedRecords(result.data);
      }
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    getIdBasedCompany(updateId);
  }, [updateId]);

  const getCountry = async () => {
    const result = await action(API.GET_COUNTRY_STATE_CITY_LIST);
    try {
      setCountryList(
        result.result.map((each) => ({
          label: each.countryName,
          value: each.countryId,
        }))
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getCountry();
  }, []);

  const getState = async () => {
    try {
      const result = await action(API.GET_COUNTRY_STATE_CITY_LIST);
      result.result.map(
        (each) =>
          formik.values.country_id === each.countryId &&
          setStateList(
            each.stateData.map((each) => ({
              label: each.stateName,
              value: each.stateId,
            }))
          )
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getState();
  }, [formik.values.country_id]);

  const getCity = async () => {
    try {
      const result = await action(API.GET_COUNTRY_STATE_CITY_LIST);
      result.result.map((each) =>
        each.stateData.map(
          (each) =>
            formik.values.state_id === each.stateId &&
            setCityList(
              each.cityData.map((each) => ({
                label: each.city,
                value: each.cityId,
              }))
            )
        )
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getCity();
  }, [formik.values.state_id]);
  useEffect(() => {
    if (
      formik.values?.logo &&
      typeof formik.values.logo === "string" &&
      formik.values.logo.startsWith("http")
    ) {
      try {
        const urlObject = new URL(formik.values.logo);
        const newBaseUrl = urlObject.origin + urlObject.pathname;
        setBaseUrl(newBaseUrl);
      } catch (error) {
        console.error("Invalid URL:", formik.values.logo);
        setBaseUrl("");
      }
    } else {
      // Handle case when logo is not a valid URL (e.g., File object or empty)
      setBaseUrl("");
    }
  }, [formik.values?.logo]);
  return (
    <div
      className={`${
        companyList?.length === 0 ? "flex justify-center items-center  p-2" : ""
      }   w-full `}
    >
      <>
        {show && (
          <DrawerPop
            open={show}
            close={(e) => {
              handleClose();
            }}
            contentWrapperStyle={{
              width: "590px",
            }}
            handleSubmit={(e) => {
              formik.handleSubmit();
            }}
            updateBtn={isUpdate}
            updateFun={() => {
              formik.handleSubmit();
            }}
            header={[
              !isUpdate ? t("Create_Company") : t("Update_Company"),
              !isUpdate
                ? t("Create_New_Company")
                : t("Update_Selected_Company"),
            ]}
            footerBtn={[t("Cancel"), !isUpdate ? t("Save") : t("Update")]}
            footerBtnDisabled={loading}
          >
            <div className="relative flex flex-col gap-4 dark:text-white">
              <FormInput
                title={t("Company")}
                placeholder={t("Company")}
                value={formik.values.company}
                change={(e) => {
                  formik.setFieldValue("company", e);
                }}
                error={formik.values.company ? "" : formik.errors.company}
                required={true}
                maxLength={50}
              />
              <div className="grid grid-cols-1 gap-4 2xl:gap-8 md:grid-cols-2">
                <div className="col-span-2  ">
                  <FileUpload
                    fileType="image"
                    defaultname={logoname}
                    defaulturl={baseUrl}
                    src={
                      file
                        ? file
                        : formik.values?.logo
                        ? formik.values?.logo
                        : NoImagePlaceholder
                    }
                    change={(e) => {
                      if (e) {
                        formik.setFieldValue("logo", e);
                        setFile(URL.createObjectURL(e));
                      }
                    }}
                  />
                </div>
                <div className="col-span-1 ">
                  <FormInput
                    title={t("Email")}
                    placeholder={t("Email")}
                    value={formik.values.email}
                    change={(e) => {
                      let value = e;
                      value = value.trim();
                      value = value.toLowerCase();
                      formik.setFieldValue("email", value);
                    }}
                    icon={<HiOutlineMail />}
                    className=""
                    error={formik.errors.email}
                    required={true}
                    maxLength={40}
                    type="email"
                  />
                </div>
                <div className="col-span-1 ">
                  <FormInput
                    title={t("Phone_Number")}
                    placeholder={t("Phone Number")}
                    className=""
                    // country={"in"}
                    value={formik.values.phone}
                    type="number"
                    change={(e) => {
                      formik.setFieldValue("phone", e);
                    }}
                    error={formik.errors.phone}
                    required={true}
                  />
                </div>
                <div className="col-span-2 ">
                  <FormInput
                    title={t("Address")}
                    placeholder={t("Address")}
                    className=""
                    value={formik.values.address}
                    error={formik.errors.address}
                    required={true}
                    change={(e) => {
                      formik.setFieldValue("address", e);
                    }}
                  />
                </div>
                <div className="col-span-1 ">
                  <FormInput
                    title={t("Website")}
                    placeholder={t("Website_Link")}
                    value={formik.values.url}
                    change={(e) => {
                      formik.setFieldValue("url", e);
                    }}
                    // icon={"http://"}
                    websiteLink
                    error={formik.errors.url}
                    required={true}
                    maxLength={40}
                  />
                </div>
                <div className="col-span-1 ">
                  <ToggleBtn
                    value={formik.values.isActive}
                    change={(e) => {
                      formik.setFieldValue("isActive", e);
                    }}
                    title={t("Status")}
                    className={" pt-[6px]"}
                  />
                </div>

                <div className="col-span-2 flex gap-2">
                  <Dropdown
                    title={t("Country")}
                    placeholder={t("Choose Country")}
                    value={formik.values.country_id}
                    change={(e) => {
                      formik.setFieldValue("country_id", e);
                    }}
                    options={countryList}
                    className=" text-sm w-40 "
                    error={
                      formik.values.country_id ? "" : formik.errors.country_id
                    }
                    required={true}
                  />

                  <Dropdown
                    title={t("State")}
                    value={formik.values.state_id}
                    placeholder={t("Choose State")}
                    change={(e) => {
                      formik.setFieldValue("state_id", e);
                    }}
                    options={stateList}
                    className=" text-sm w-40"
                    error={formik.values.state_id ? "" : formik.errors.state_id}
                    required={true}
                  />

                  <Dropdown
                    title={t("City")}
                    value={formik.values.city_id}
                    placeholder={t("Choose City")}
                    change={(e) => {
                      formik.setFieldValue("city_id", e);
                    }}
                    options={cityList}
                    className=" text-sm w-40"
                    error={formik.values.city_id ? "" : formik.errors.city_id}
                    required={true}
                  />
                </div>

                <div className="col-span-2 flex gap-5">
                  <FormInput
                    title={t("Zipcode")}
                    placeholder={t("Zipcode")}
                    value={formik.values.zipCode}
                    change={(e) => {
                      if (/^\d*\.?\d*$/.test(e)) {
                        formik.setFieldValue("zipCode", e);
                      }
                    }}
                    maxLength={6}
                    error={formik.values.zipCode ? "" : formik.errors.zipCode}
                    required={true}
                  />
                  <FormInput
                    title={t("Establishment ID")}
                    placeholder={t("Establishment ID")}
                    value={formik.values.cin}
                    change={(e) => {
                      formik.setFieldValue("cin", e);
                    }}
                    // className="pl-4"
                    error={formik.values.cin ? "" : formik.errors.cin}
                    required={true}
                  />
                </div>
              </div>
            </div>
          </DrawerPop>
        )}
      </>
    </div>
  );
}
