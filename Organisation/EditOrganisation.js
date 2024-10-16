import React, { useEffect, useMemo, useState } from "react";
import DrawerPop from "../common/DrawerPop";
import FormInput from "../common/FormInput";
import { t } from "i18next";
import API, { action, fileAction } from "../Api";
import * as yup from "yup";
import { useFormik } from "formik";
import { notification } from "antd";
import Dropdown from "../common/Dropdown";
import axios from "axios";
import ImageUpload from "../common/ImageUpload";
import NoImagePlaceholder from "../../assets/images/NoImagePlaceholder.png";
import { useNotification } from "../../Context/Notifications/Notification";

const EditOrganisation = ({
  open,
  refresh,
  close = () => { }
}) => {
  const [show, setShow] = useState(open);
  const updateId = localStorage.getItem('organisationId');
  const [countryList, setCountryList] = useState([]);
  const [countryAllData, setCountryAllData] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [stateList, setStateList] = useState([]);

  const [file, setFile] = useState(null);
  const [profilePic1, setProfilePic1] = useState(null);
  const [profilePic2, setProfilePic2] = useState(null);
  const [loading, setLoading] = useState(false);

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const handleClose = () => {
    setShow(false);
  };

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const formik = useFormik({
    initialValues: {
      organisationName: "",
      organisationWebsite: "",
      address: "",
      country_id: "",
      state_id: "",
      city_id: "",
      currency: "",
      companyId: "",
      contactInfo1Name: "",
      contactInfo1Designation: "",
      contactInfo1Email: "",
      contactInfo1Phone: "",
      contactInfo2Name: "",
      contactInfo2Designation: "",
      contactInfo2Email: "",
      contactInfo2Phone: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      organisationName: yup.string().required("Organisation Name is required"),
      organisationWebsite: yup
        .string()
        .required("Organisation Website is required"),
      address: yup.string().required("Organisation Address is required"),
      country_id: yup.string().required("Country is Required"),
      state_id: yup.string().required("State is Required"),
      city_id: yup.string().required("City is required"),
      currency: yup.string().required("Currency is required"),
      contactInfo1Name: yup.string().required("Name is required"),
      contactInfo1Designation: yup.string().required("Designation is required"),
      contactInfo1Email: yup
        .string()
        .email("Please enter valid email")
        .required("Email is required")
        .test(
          "is-valid-email",
          "Please enter a valid email",
          (value) =>
            value &&
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value)
        ),
      contactInfo1Phone: yup.number().required("Phone is required"),
      contactInfo2Name: yup.string().required("Name is required"),
      contactInfo2Designation: yup.string().required("Designation is required"),
      contactInfo2Email: yup
        .string()
        .email("Please enter valid email")
        .required("Email is required")
        .test(
          "is-valid-email",
          "Please enter a valid email",
          (value) =>
            value &&
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value)
        ),
      contactInfo2Phone: yup.number().required("Phone is required"),
    }),
    onSubmit: async (e) => {
      setLoading(true)
      // console.log({
      //   organisation: e.organisationName,
      //   url: e.organisationWebsite,
      //   address: e.address,
      //   country_id: e.country_id,
      //   city_id: e.city_id,
      //   currency: e.currency,
      // });

      if (file) {
        const formData = new FormData();
        formData.append("action", "organizationLogoUpload");
        formData.append("organisationId", updateId);
        formData.append("file", e.logo);

        try {
          const response = await fileAction(formData);
          setFile(null);
        } catch (error) {
          openNotification("error", "Something went wrong", error.message);
        }
      }

      if (profilePic1) {
        const formData = new FormData();
        formData.append("action", "organizationContactInfoImegeUpload");
        formData.append("organisationId", updateId);
        formData.append("file", e.contactInfo1profilePicture);
        formData.append("imagePath", "contactInfo1Image");

        try {
          const response = await fileAction(formData);
          setProfilePic1(null);
        } catch (error) {
          openNotification("error", "Something went wrong", error.message);
        }
      }

      if (profilePic2) {
        const formData = new FormData();
        formData.append("action", "organizationContactInfoImegeUpload");
        formData.append("organisationId", updateId);
        formData.append("file", e.contactInfo2profilePicture);
        formData.append("imagePath", "contactInfo2Image");

        try {
          const response = await fileAction(formData);
          setProfilePic2(null);
        } catch (error) {
          openNotification("error", "Something went wrong", error.message);
        }
      }

      try {
        // if (updateId) {
        const result = await action(API.UPDATE_ORGANISATION, {
          id: updateId,
          companyId: e.companyId,
          organisation: e.organisationName,
          url: e.organisationWebsite,
          address: e.address,
          countryId: e.country_id,
          stateId: e.state_id,
          cityId: e.city_id,
          currency: e.currency,
          contactInfo1Name: e.contactInfo1Name,
          contactInfo1Designation: e.contactInfo1Designation,
          contactInfo1Email: e.contactInfo1Email,
          contactInfo1Phone: e.contactInfo1Phone,
          contactInfo2Name: e.contactInfo2Name,
          contactInfo2Designation: e.contactInfo2Designation,
          contactInfo2Email: e.contactInfo2Email,
          contactInfo2Phone: e.contactInfo2Phone,
        });
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            handleClose();
            // setFunctionRender(!functionRender);
            // getRecords();
            setLoading(false)
            refresh();
          }, 500);
        } else {
          openNotification("error", "Failed", result.message);
          setLoading(false)
        }
        // }
      } catch (error) {
        openNotification("error", "Failed", error);
        setLoading(false)
      }
    },
  });

  const getIdBasedOrganisation = async (e) => {
    // console.log(API.GET_ORGANISATION_BY_ID, { id: e });
    if (e !== "" && updateId !== false) {
      const result = await action(API.GET_ORGANISATION_BY_ID, { id: e });
      formik.setFieldValue("organisationName", result?.result?.organisation);
      formik.setFieldValue("organisationWebsite", result?.result?.url);
      formik.setFieldValue("address", result?.result?.address);
      formik.setFieldValue("country_id", result?.result?.countryId);
      formik.setFieldValue("state_id", result?.result?.stateId);
      formik.setFieldValue("city_id", result?.result?.cityId);
      formik.setFieldValue("currency", result?.result?.currency);
      formik.setFieldValue("logo", result?.result?.logo);
      formik.setFieldValue("contactInfo1profilePicture", result?.result?.contactInfo1profilePicture);
      formik.setFieldValue("contactInfo2profilePicture", result?.result?.contactInfo2profilePicture);
      formik.setFieldValue("companyId", result?.result?.companyId);
      formik.setFieldValue("contactInfo1Name", result?.result?.contactInfo1Name);
      formik.setFieldValue(
        "contactInfo1Designation",
        result?.result?.contactInfo1Designation
      );
      formik.setFieldValue(
        "contactInfo1Email",
        result?.result?.contactInfo1Email
      );
      formik.setFieldValue(
        "contactInfo1Phone",
        result?.result?.contactInfo1Phone
      );
      formik.setFieldValue("contactInfo2Name", result?.result?.contactInfo2Name);
      formik.setFieldValue(
        "contactInfo2Designation",
        result?.result?.contactInfo2Designation
      );
      formik.setFieldValue(
        "contactInfo2Email",
        result?.result?.contactInfo2Email
      );
      formik.setFieldValue(
        "contactInfo2Phone",
        result?.result?.contactInfo2Phone
      );
      // console.log(result, "data");
      // countryAllData?.map(
      //   (each) =>
      //     result.result.countryId === each.countryId &&
      //     setStateList(
      //       each.stateData.map((each) => ({
      //         label: each.stateName,
      //         value: each.stateId,
      //       }))
      //     )
      // );
      // countryAllData?.map((each) =>
      //   each.stateData.map(
      //     (each) =>
      //       result.result.stateId === each.stateId &&
      //       setCityList(
      //         each.cityData.map((each) => ({
      //           label: each.city,
      //           value: each.cityId,
      //         }))
      //       )
      //   )
      // );
    }
  };

  useEffect(() => {
    getIdBasedOrganisation(updateId);
  }, [updateId]);

  // const getCountryList = async () => {
  //   const result = await action(API.GET_COUNTRY_ALL_LIST);
  //   console.log(result, "country Lists");
  //   setCountryList(
  //     result.result.map((each) => ({
  //       value: each.countryId,
  //       label: each.countryName,
  //     }))
  //   );
  // };

  // const getCityList = async () => {
  //   const result = await action(API.GET_CITY_LIST);
  //   console.log(result, "city Lists");
  //   setCityList(
  //     result.result.map((each) => ({
  //       value: each.cityId,
  //       label: each.city,
  //     }))
  //   );
  // };

  // const getCountryStateCity = async () => {
  //   try {
  //     const result = await action(API.GET_COUNTRY_STATE_CITY_LIST);
  //     if (result.status === 200) {
  //       console.log(result, "country List");
  //       const countries = result.result.map((country) => {

  //         setCountryList({
  //           label: country.countryName,
  //           value: country.countryId,
  //         })
  //         // country.map((state) => {
  //         //   setStateList({
  //         //     label: state.stateName,
  //         //     value: state.stateId,
  //         //   })
  //         //   state.map((city) =>
  //         //     setCityList({
  //         //       label: city.cityName,
  //         //       value: city.cityId,
  //         //     }))
  //         // })
  //       });
  //     }
  //     console.log(result, "country List");
  //   } catch (error) {
  //     console.log(error, "country list error");
  //   }
  // };

  const getCountry = async () => {
    const result = await action(API.GET_COUNTRY_STATE_CITY_LIST);
    // console.log(result, "country List");
    try {
      setCountryAllData(result.result)
      setCountryList(
        result.result.map((each) => ({
          label: each.countryName,
          value: each.countryId,
        }))
      );

    } catch (error) {
      // console.log(error, "country list error");
    }
  };

  useEffect(() => {
    getCountry();
  }, []);

  // useEffect(() => {
  //   countryAllData?.map(
  //     (each) =>
  //       formik.values.country_id === each.countryId &&
  //       setStateList(
  //         each.stateData.map((each) => ({
  //           label: each.stateName,
  //           value: each.stateId,
  //         }))
  //       )
  //   );
  // }, [formik.values.country_id])

  // useEffect(() => {
  //   countryAllData?.map((each) =>
  //     each.stateData.map(
  //       (each) =>
  //         formik.values.state_id === each.stateId &&
  //         setCityList(
  //           each.cityData.map((each) => ({
  //             label: each.city,
  //             value: each.cityId,
  //           }))
  //         )
  //     )
  //   );
  // }, [formik.values.state_id])

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
      // console.log(error);
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
      // console.log(error);
    }
  };

  useEffect(() => {
    getCity();
  }, [formik.values.state_id]);

  return (
    <div>
      <DrawerPop
        open={show}
        close={(e) => {
          handleClose();
        }}
        handleSubmit={(e) => {
          formik.handleSubmit();
        }}
        contentWrapperStyle={{
          width: "600px",
        }}
        header={[
          t("Update Organization Profile"),
          t("Update Organization Profile from here"),
        ]}
        footerBtn={[t("Cancel"), t("Update")]}
        footerBtnDisabled={loading}
      >
        <div className="relative h-full w-full flex flex-col gap-6">
          <div className="flex justify-between gap-2">
            <FormInput
              title={t("Organization Name")}
              placeholder={t("Organization Name")}
              value={formik.values.organisationName}
              change={(e) => {
                formik.setFieldValue("organisationName", e);
              }}
              error={
                formik.values.organisationName
                  ? ""
                  : formik.errors.organisationName
              }
              required={true}
            />

            <FormInput
              title={t("Organization Website")}
              placeholder={t("Organization Website")}
              value={formik.values.organisationWebsite}
              change={(e) => {
                formik.setFieldValue("organisationWebsite", e);
              }}
              websiteLink
              error={
                formik.values.organisationWebsite
                  ? ""
                  : formik.errors.organisationWebsite
              }
              required={true}
              maxLength={40}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 2xl:gap-8 md:grid-cols-2">
            {/* <div className="flex items-center justify-start gap-4 ">
              <div className=" w-[60px] h-[60px] 2xl:w-[70px] 2xl:h-[70px] rounded-full overflow-hidden border-2 border-white shadow-md">
                <img
                  src={
                    file
                      ? file
                      : formik.values.logo
                      ? formik.values.logo
                      : NoImagePlaceholder
                  }
                  alt=""
                  className="object-cover object-center w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <h1 className="h2">{t("Organization Logo")}</h1>
                <p className="para">{t("Update your organization logo")}</p>
              </div>
            </div> */}
            <div className="col-span-2  ">
              <ImageUpload
                fileType="image"
                src={file ? file : (formik.values?.logo ? formik.values?.logo : NoImagePlaceholder)}
                change={(e) => {
                  if (e) {
                    formik.setFieldValue("logo", e);
                    setFile(URL.createObjectURL(e));
                  }
                }}
              />
            </div>
          </div>
          <div>
            <FormInput
              title={t("Organization Address")}
              placeholder={t("Organization Address")}
              value={formik.values.address}
              change={(e) => {
                formik.setFieldValue("address", e);
              }}
              error={formik.values.address ? "" : formik.errors.address}
              required={true}
            />
          </div>
          <div className="flex gap-2">
            <Dropdown
              title={t("Country")}
              value={formik.values.country_id}
              change={(e) => {
                // console.log(e);
                formik.setFieldValue("country_id", e);
              }}
              options={countryList}
              className=" text-sm w-40"
              error={formik.values.country_id ? "" : formik.errors.country_id}
              required={true}
            />

            <Dropdown
              title={t("State")}
              value={formik.values.state_id}
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
              change={(e) => {
                formik.setFieldValue("city_id", e);
              }}
              options={cityList}
              className=" text-sm w-40"
              error={formik.values.city_id ? "" : formik.errors.city_id}
              required={true}
            />
          </div>
          <div>
            <FormInput
              title={t("Currency")}
              placeholder={t("Currency")}
              value={formik.values.currency}
              change={(e) => {
                formik.setFieldValue("currency", e);
              }}
              error={formik.values.currency ? "" : formik.errors.currency}
              required={true}
            />
          </div>
          <div className="borderb rounded-lg p-3">
            <div className="font-bold">Contact Person 1</div>
            <div className="flex justify-between gap-2 mt-1">
              <FormInput
                title={t("Name")}
                placeholder={t("Name")}
                value={formik.values.contactInfo1Name}
                change={(e) => {
                  formik.setFieldValue("contactInfo1Name", e);
                }}
                error={
                  formik.values.contactInfo1Name
                    ? ""
                    : formik.errors.contactInfo1Name
                }
                required={true}
              />
              <FormInput
                title={t("Designation")}
                placeholder={t("Designation")}
                value={formik.values.contactInfo1Designation}
                change={(e) => {
                  formik.setFieldValue("contactInfo1Designation", e);
                }}
                error={
                  formik.values.contactInfo1Designation
                    ? ""
                    : formik.errors.contactInfo1Designation
                }
                required={true}
              />
            </div>
            <div className="flex justify-between gap-2 mt-1">
              <FormInput
                title={t("Phone")}
                placeholder={t("Phone")}
                value={formik.values.contactInfo1Phone}
                change={(e) => {
                  formik.setFieldValue("contactInfo1Phone", e);
                }}
                error={
                  formik.values.contactInfo1Phone
                    ? ""
                    : formik.errors.contactInfo1Phone
                }
                required={true}
              />
              <FormInput
                title={t("Email")}
                placeholder={t("Email")}
                value={formik.values.contactInfo1Email}
                change={(e) => {
                  let value = e;
                  value = value.trim();
                  value = value.toLowerCase()
                  formik.setFieldValue("contactInfo1Email", value);
                }}
                error={
                  formik.values.contactInfo1Email
                    ? ""
                    : formik.errors.contactInfo1Email
                }
                required={true}
              />
            </div>
            <div className="mt-2">
              <div className="font-medium text-xs 2xl:text-sm">Profile picture</div>
              <ImageUpload
                fileType="image"
                src={profilePic1 ? profilePic1 : (formik.values.contactInfo1profilePicture ? formik.values.contactInfo1profilePicture : NoImagePlaceholder)}
                change={(e) => {
                  if (e) {
                    formik.setFieldValue("contactInfo1profilePicture", e);
                    setProfilePic1(URL.createObjectURL(e));
                  }
                }}
              />
            </div>
          </div>

          <div className="borderb rounded-lg p-3">
            <div className="font-bold">Contact Person 2</div>
            <div className="flex justify-between gap-2 mt-1">
              <FormInput
                title={t("Name")}
                placeholder={t("Name")}
                value={formik.values.contactInfo2Name}
                change={(e) => {
                  formik.setFieldValue("contactInfo2Name", e);
                }}
                error={
                  formik.values.contactInfo2Name
                    ? ""
                    : formik.errors.contactInfo2Name
                }
                required={true}
              />
              <FormInput
                title={t("Designation")}
                placeholder={t("Designation")}
                value={formik.values.contactInfo2Designation}
                change={(e) => {
                  formik.setFieldValue("contactInfo2Designation", e);
                }}
                error={
                  formik.values.contactInfo2Designation
                    ? ""
                    : formik.errors.contactInfo2Designation
                }
                required={true}
              />
            </div>
            <div className="flex justify-between gap-2 mt-1 pb-2">
              <FormInput
                title={t("Phone")}
                placeholder={t("Phone")}
                value={formik.values.contactInfo2Phone}
                change={(e) => {
                  formik.setFieldValue("contactInfo2Phone", e);
                }}
                error={
                  formik.values.contactInfo2Phone
                    ? ""
                    : formik.errors.contactInfo2Phone
                }
                required={true}
              />
              <FormInput
                title={t("Email")}
                placeholder={t("Email")}
                value={formik.values.contactInfo2Email}
                change={(e) => {
                  let value = e;
                  value = value.trim();
                  value = value.toLowerCase()
                  formik.setFieldValue("contactInfo2Email", value);
                }}
                error={
                  formik.values.contactInfo2Email
                    ? ""
                    : formik.errors.contactInfo2Email
                }
                required={true}
              />
            </div>
            <div className="mt-1">
              <div className="font-medium text-xs 2xl:text-sm">Profile picture</div>
              <ImageUpload
                fileType="image"
                src={profilePic2 ? profilePic2 : (formik.values.contactInfo2profilePicture ? formik.values.contactInfo2profilePicture : NoImagePlaceholder)}
                change={(e) => {
                  if (e) {
                    formik.setFieldValue("contactInfo2profilePicture", e);
                    setProfilePic2(URL.createObjectURL(e));
                  }
                }}
              />
            </div>
          </div>

        
        </div>
      </DrawerPop >
    </div >
  );
};

export default EditOrganisation;
