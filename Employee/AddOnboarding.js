import React, { useEffect, useState } from "react";
import { RxQuestionMarkCircled } from "react-icons/rx";
import DrawerPop from "../common/DrawerPop";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import Dropdown from "../common/Dropdown";
import FlexCol from "../common/FlexCol";
import Heading from "../common/Heading";
import FormInput from "../common/FormInput";
import { Button, Flex, Steps, Upload, notification } from "antd";

import { IoIosArrowForward } from "react-icons/io";
import {
  accountType,
  bloodGroup,
  maritalStatus,
  remainingTasks,
  teammates,
  upoadDocuments,
} from "../data";
import { FaUserLarge } from "react-icons/fa6";
import DateSelect from "../common/DateSelect";
import RadioButton from "../common/RadioButton";
import work from "../../assets/images/Work.png";
import bank from "../../assets/images/Frame 427319428.png";
import documents from "../../assets/images/Documents.png";
import TextArea from "../common/TextArea";
import CheckBoxInput from "../common/CheckBoxInput";
import { FiPlusCircle } from "react-icons/fi";
import { VscCloudUpload } from "react-icons/vsc";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import API from "../Api";
import { useNotification } from "../../Context/Notifications/Notification";

export default function AddOnboarding({ open, close = () => { } }) {
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery({ maxWidth: 1439 });
  const [show, setShow] = useState(open);
  const [isUpdate, setIsUpdate] = useState();
  const [activeBtnValue, setActiveBtnValue] = useState("welcome");
  const [activeBtn, setActiveBtn] = useState(0);
  const [presentage, setPresentage] = useState(0);
  const [nextStep, setNextStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);

  const [steps, setSteps] = useState([
    {
      id: 1,
      value: 0,
      title: t("Welcome"),
      data: "welcome",
    },
    {
      id: 3,
      value: 2,

      title: t("Profile_Details"),
      data: "profileDetails",
    },
    {
      id: 4,
      value: 3,
      title: t("Work_Experience"),
      data: "workExperience",
    },
    {
      id: 5,
      value: 4,
      title: t("Payroll_Onboarding"),
      data: "payrollOnboarding",
    },

    {
      id: 6,
      value: 5,
      title: t("Upload_Documents"),
      data: "upoadDocuments",
    },
  ]);
  //   Notification

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const handleClose = () => {
    // setShow(false);
    close(false);
  };
  useEffect(() => {
    console.log(nextStep, activeBtn);
    if (activeBtn < 4 && activeBtn !== nextStep) {
      /// && activeBtn !== nextStep
      setActiveBtn(1 + activeBtn);
      setNextStep(nextStep);
      console.log(1 + activeBtn);
      console.log(steps?.[activeBtn + 1].data, "data");
      setActiveBtnValue(steps?.[activeBtn + 1].data);
    }
  }, [nextStep]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      gender: "",
      dateOfBirth: "",
      maritalStatus: "",
      bloodGroup: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      firstName: yup.string().required("First Name is Required"),
      lastName: yup.string().required("Last Name is Required"),
      phone: yup.number().required("Phone Number is Required"),
      email: yup.string().required("Email is Required"),
      gender: yup.string().required("Gender is Required"),
      dateOfBirth: yup.string().required("Date Of Birth is Required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      console.log(e);
      try {
        const result = await axios.post(
          API.HOST + API.ADD_CANDIDATE_PERSIONAL,
          {
            companyId: companyId,
            firstName: e.firstName,
            lastName: e.lastName,
            phone: e.phone,
            email: e.email,
            gender: e.gender,
            dateOfBirth: e.dateOfBirth,
            maritalStatus: e.maritalStatus,
            bloodGroup: e.bloodGroup,
          }
        );
        console.log(result);
        if (result.data.status === 200) {
          setNextStep(nextStep + 1);
          setPresentage(0);
          openNotification(
            "success",
            result.data.message,
            "Candidate Personsal Information update saved. Changes are now reflected."
          );
          setLoading(false);
        } else if (result.data.status === 500) {
          openNotification("error", "Failed", result.data.message);
          setLoading(false);
        }
        console.log(result);
      } catch (error) {
        openNotification("error", "Failed", error.code);
        setLoading(false);
        console.log(error);
      }
    },
  });

  const formik2 = useFormik({
    initialValues: {
      title: "",
      website: "",
      employmentType: "wwwww",
      startDate: "",
      endDate: "",
      description: "",
      company: "",
      iscurrentlyworkingHere: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      company: yup.string().required("company is Required"),
      title: yup.string().required("Title is Required"),
      website: yup.string().required("Website is Required"),
      employmentType: yup.string().required("Employment Type is Required"),
      startDate: yup.string().required("Start Date  is Required"),
      endDate: yup.string().required("End Date  is Required"),
    }),

    onSubmit: async (e) => {
      setLoading(true)
      console.log(e);
      try {
        const result = await axios.post(
          API.HOST + API.ADD_CANDIDATE_WORK_EXPERIENCE,
          {
            companyId: companyId,
            company: e.company,
            title: e.title,
            website: e.website,
            employmentType: e.employmentType,
            startDate: e.startDate,
            endDate: e.endDate,
            description: e.description,
            iscurrentlyworkingHere: e.iscurrentlyworkingHere,
          }
        );
        console.log(result);
        if (result.data.status === 200) {
          setNextStep(nextStep + 1);
          setPresentage(0);
          openNotification(
            "success",
            result.data.message,
            "Candidate Work Experience update saved. Changes are now reflected."
          );
          setLoading(false);
        } else if (result.data.status === 500) {
          openNotification("error", "Failed", result.data.message);
          setLoading(false);
        }
        console.log(result);
      } catch (error) {
        openNotification("error", "Failed", error.code);
        setLoading(false);
        console.log(error);
      }
    },
  });
  const formik3 = useFormik({
    initialValues: {
      fullName: "",
      bankName: "",
      accountNumber: "",
      accountType: "",
      ifscCode: "",
      bankBranch: "",
      backAccountInternational: "",
      swiftId: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      fullName: yup.string().required("Full Name is Required"),
      bankName: yup.string().required("Bank Name is Required"),
      accountNumber: yup.string().required("Account Number is Required"),
      accountType: yup.string().required("Account Type is Required"),
      ifscCode: yup.string().required("IFSC Code  is Required"),
      bankBranch: yup.string().required("Bank Branch  is Required"),
      swiftId: yup.string().required("Swift  is Required"),
      backAccountInternational: yup
        .string()
        .required("Back Account International  is Required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      console.log();
      try {
        const result = await axios.post(
          API.HOST + API.ADD_CANDIDATE_WORK_EXPERIENCE,
          {
            companyId: companyId,
            fullName: e.fullName,
            bankName: e.bankBranch,
            accountNumber: e.accountNumber,
            accountType: e.accountType,
            ifscCode: e.ifscCode,
            bankBranch: e.bankBranch,
            backAccountInternational: e.backAccountInternational,
            swiftId: e.swiftId,
          }
        );
        console.log(result);
        if (result.data.status === 200) {
          setNextStep(nextStep + 1);
          setPresentage(0);
          openNotification(
            "success",
            result.data.message,
            "Candidate Bank Details update saved. Changes are now reflected."
          );
          setLoading(false);
        } else if (result.data.status === 500) {
          setLoading(false);
          openNotification("error", "Failed", result.data.message);
        }
        console.log(result);
      } catch (error) {
        openNotification("error", "Failed", error.code);
        setLoading(false);
        console.log(error);
      }
    },
  });

  return (
    <>
      {show && (
        <DrawerPop
          // style={
          //   my-drawer-content:  {
          //     background: "#000",

          //   }
          // }
          contentWrapperStyle={{
            position: "absolute",
            height: "100%",
            top: 0,
            // left: 0,
            bottom: 0,
            right: 0,
            width: "100%",
            borderRadius: 0,
            borderTopLeftRadius: "0px !important",
            borderBottomLeftRadius: 0,
          }}
          open={show}
          close={(e) => {
            // console.log(e);
            handleClose();
          }}
          // className={classNames}
          handleSubmit={(e) => {
            // console.log(e);
            // formik.handleSubmit();
          }}
          //   updateBtn={isUpdate}
          updateFun={() => {
            // updateCompany();
          }}
          header={[
            !isUpdate
              ? t("Candidate_Onboarding")
              : t("Update_Candidate_Onboarding"),
            t("Candidate_Onboarding_Description"),
          ]}
          headerRight={
            <div className="flex md:gap-10 items-center">
              <p className="xl:text-sm text-[10px] font-medium text-gray-400">
                Draft Saved 10 Seconds ago
              </p>
              <div className="flex items-center gap-2.5">
                <p className="xl:text-sm text-xs font-medium text-gray-400">
                  help
                </p>
                <RxQuestionMarkCircled className=" xl:text-2xl text-sm font-medium text-gray-400" />
              </div>
            </div>
          }
          footerBtn={[
            t("Cancel"),
            !isUpdate ? t("Save&Continue") : t("Update  Candidate"),
          ]}
          footerBtnDisabled={loading}
          className="widthFull"
          //   stepsData={steps}
          buttonClick={(e) => {
            if (activeBtnValue === "profileDetails") {
              formik.handleSubmit();
              console.log("click 1");
            } else if (activeBtnValue === "workExperience") {
              console.log("click 2");
              // setBtnName("Add Employee");
              formik2.handleSubmit();
            } else if (activeBtnValue === "payrollOnboarding") {
              console.log("click 3");
              // setBtnName("Add Employee");
              formik3.handleSubmit();
            } else if (activeBtnValue === "upoadDocuments") {
              // setBtnName("Add Employee");
              // formik4.handleSubmit();
            }
            // if (activeBtn < 4 && activeBtn !== nextStep) {
            //   /// && activeBtn !== nextStep
            //   setActiveBtn(1 + activeBtn);
            //   setNextStep(activeBtn);
            //   console.log(1 + activeBtn);
            // }
            if (activeBtn === 0) setNextStep(activeBtn + 1);
          }}
          buttonClickCancel={(e) => {
            if (activeBtn > 0) {
              setActiveBtn(activeBtn - 1);
              setNextStep(nextStep - 1);
              setActiveBtnValue(steps?.[activeBtn - 1].data);
              console.log(activeBtn - 1);
            }
            // setBtnName("");
          }}
          //   nextStep={nextStep}
          //   activeBtn={activeBtn}
          saveAndContinue={true}
        >
          <div className="flex flex-col gap-6">
            {steps && (
              <div className=" sticky -top-6 w-full z-50 px-5 bg-white dark:bg-[#1f1f1f] ">
                <Steps
                  current={activeBtn}
                  percent={presentage}
                  // direction="left"
                  labelPlacement="vertical"
                  items={steps}
                  // className=" text-sm font-medium"
                  style={{
                    fontSize: isSmallScreen ? "8px" : "10px",
                    fontWeight: 600,
                  }}
                  // className="text-[10px]"
                  size={isSmallScreen ? "default" : "large"}
                />
              </div>
            )}

            <form
              action="submit"
              // onSubmit={formik.handleSubmit}
              className=" flex  justify-center "
            >
              <div className="lg:w-3/5 w-full ">
                {activeBtnValue === "welcome" ? (
                  <FlexCol>
                    <Heading
                      title={t("Remaining_tasks_for_your_onboarding") + " (3)"}
                      font="16px"
                    />
                    {remainingTasks.map((each) => (
                      <FlexCol>
                        <Flex
                          justify="space-between"
                          align="center"
                          className="p-2 rounded-2xl border shadow-md"
                        >
                          <Flex className=" gap-4" align="center">
                            <div
                              //   className={`p-3 bg-gradient-to-b from-[${each.colorFrom}] to-[${each.colorTo}] rounded-lg`}
                              className={`p-3  rounded-lg`}
                              style={{
                                background: `linear-gradient(180deg, ${each.colorFrom} 0%, ${each.colorTo} 100%)`,
                              }}
                            >
                              <img
                                src={each.image}
                                alt=""
                                className=" w-12 h-12 "
                              />
                            </div>
                            <Heading
                              title={each.title}
                              description={each.description}
                              font="16px"
                            />
                          </Flex>
                          <Flex
                            justify="space-between"
                            align="center"
                            className=" gap-4"
                          >
                            <img
                              src={each.profile}
                              alt=""
                              className=" w-6 h-6"
                            />
                            <p
                              className="p-1 px-2 bg-[#F2F4F7] rounded-full dark:bg-dark dark:text-white"
                              // style={{ background: `var(--Gray-100, #F2F4F7)` }}
                            >
                              {each.buttonName}
                            </p>
                            <IoIosArrowForward className=" text-xl text-gray-400" />
                          </Flex>
                        </Flex>
                      </FlexCol>
                    ))}

                    <Heading
                      title={t("Lets_meet_your_teammates")}
                      description={t("Lets_meet_your_teammates_description")}
                      font="16px"
                    />
                    <FlexCol className={"md:grid grid-cols-3 gap-5"}>
                      {teammates.map((each) => (
                        <div
                          className={
                            "border rounded-lg p-[18px] flex flex-col gap-5 shadow dark:bg-dark"
                          }
                        >
                          <div className=" flex flex-col gap-[5px]">
                            <img
                              src={each.image}
                              alt=""
                              className=" w-12 h-12"
                            />
                            <Heading
                              title={each.title}
                              description={each.description}
                              font="16px"
                            />
                          </div>
                          <Flex className="gap-3">
                            {each.medias.map((image) => (
                              <img
                                src={image}
                                alt=""
                                className=" w-[17px] h-[17px]"
                              />
                            ))}
                          </Flex>
                        </div>
                      ))}
                    </FlexCol>
                  </FlexCol>
                ) : activeBtnValue === "profileDetails" ? (
                  <FlexCol>
                    <Flex align="center" className=" gap-4">
                      <FaUserLarge className="text-base text-primary" />
                      <Heading
                        title={t("Your_Personal_Informations")}
                        description={t(
                          "Your_Personal_Informations_Description"
                        )}
                        font="16px"
                      />
                    </Flex>
                    <FlexCol className={"md:grid grid-cols-2"}>
                      <FormInput
                        title={t("First_Name")}
                        placeholder={t("First_Name")}
                        value={formik.values.firstName}
                        change={(e) => {
                          formik.setFieldValue("firstName", e);
                        }}
                        error={formik.errors.firstName}
                      />
                      <FormInput
                        title={t("Last_Name")}
                        placeholder={t("Last_Name")}
                        value={formik.values.lastName}
                        change={(e) => {
                          formik.setFieldValue("lastName", e);
                        }}
                        error={formik.errors.lastName}
                      />
                      <FormInput
                        title={t("Phone_Number")}
                        placeholder={t("Phone_Number")}
                        value={formik.values.phone}
                        change={(e) => {
                          formik.setFieldValue("phone", e);
                        }}
                        error={formik.errors.phone}
                      />
                      <FormInput
                        title={t("Email")}
                        placeholder={t("Email")}
                        value={formik.values.email}
                        change={(e) => {
                          formik.setFieldValue("email", e);
                        }}
                        error={formik.errors.email}
                      />
                      <DateSelect
                        title={t("Date_Of_birth")}
                        placeholder={t("Choose_Date_of_birth")}
                        value={formik.values.dateOfBirth}
                        change={(e) => {
                          formik.setFieldValue("dateOfBirth", e);
                        }}
                        error={formik.errors.dateOfBirth}
                      />
                      <RadioButton
                        title={t("Select_Gender")}
                        placeholder=""
                        value={formik.values.gender}
                        change={(e) => {
                          formik.setFieldValue("gender", e);
                        }}
                        options={[
                          { label: t("Male"), value: "male" },
                          { label: t("Female"), value: "female" },
                          { label: t("Others"), value: "others" },
                        ]}
                        required={true}
                      />
                      <Dropdown
                        title={t("Marital_Status")}
                        placeholder={t("Select_Marital_Status")}
                        value={formik.values.maritalStatus}
                        change={(e) => {
                          formik.setFieldValue("maritalStatus", e);
                        }}
                        options={maritalStatus}
                      />
                      <Dropdown
                        title={t("Blood_Group")}
                        placeholder={t("Blood_Group_placeholder")}
                        value={formik.values.bloodGroup}
                        change={(e) => {
                          formik.setFieldValue("bloodGroup", e);
                        }}
                        options={bloodGroup}
                      />
                    </FlexCol>
                  </FlexCol>
                ) : activeBtnValue === "workExperience" ? (
                  <FlexCol>
                    <Flex align="center" className=" gap-4">
                      <img src={work} alt="" className="w-7 h-6" />
                      <Heading
                        title={t("Work_Experience")}
                        description={t(" Your_Previous_Work_Experiences")}
                      />
                    </Flex>
                    <FlexCol className={"md:grid grid-cols-2"}>
                      <FormInput
                        title={t("Title")}
                        placeholder={t(" Title")}
                        value={formik2.values.title}
                        change={(e) => {
                          formik2.setFieldValue("title", e);
                        }}
                        error={formik2.errors.title}
                      />
                      <FormInput
                        title={t("Company")}
                        placeholder={t(" Company_Name")}
                        value={formik2.values.company}
                        change={(e) => {
                          formik2.setFieldValue("company", e);
                        }}
                        error={formik2.errors.company}
                      />
                      <FormInput
                        title={t("Website")}
                        placeholder={t("Website")}
                        value={formik2.values.website}
                        change={(e) => {
                          formik2.setFieldValue("website", e);
                        }}
                        websiteLink
                        error={formik2.errors.website}
                      />
                      <Dropdown
                        title={t("Employment_Type")}
                        placeholder={t("Select_Employment_Type")}
                        value={formik2.values.employmentType}
                        change={(e) => {
                          formik2.setFieldValue("employmentType", e);
                        }}
                        error={formik2.errors.employmentType}
                      />
                      <DateSelect
                        title={t("Start_Date")}
                        placeholder="Choose Date"
                        value={formik2.values.startDate}
                        change={(e) => {
                          formik2.setFieldValue("startDate", e);
                        }}
                        error={formik2.errors.startDate}
                      />
                      <DateSelect
                        title={t("End_Date")}
                        placeholder="Choose End Date"
                        value={formik2.values.endDate}
                        change={(e) => {
                          formik2.setFieldValue("endDate", e);
                        }}
                        error={formik2.errors.endDate}
                      />
                      <TextArea
                        className="col-span-2"
                        title={t("Description")}
                        placeholder={t("a_description")}
                        value={formik2.values.description}
                        change={(e) => {
                          formik2.setFieldValue("description", e);
                        }}
                      />
                    </FlexCol>
                    <Flex justify="space-between" align="center">
                      <Flex gap={12} align="center">
                        <CheckBoxInput
                          value={formik2.values.iscurrentlyworkingHere}
                          change={(e) => {
                            formik2.setFieldValue("iscurrentlyworkingHere", e);
                          }}
                        />
                        <p className="text-xs dark:text-white">
                          {t("I_currently_working_here")}
                        </p>
                      </Flex>
                      <Flex className="text-primary" gap={4}>
                        <FiPlusCircle />
                        <p className="text-xs">{t("Add_Experience")}</p>
                      </Flex>
                    </Flex>
                  </FlexCol>
                ) : activeBtnValue === "payrollOnboarding" ? (
                  <FlexCol className={"md:grid grid-cols-2"}>
                    <Flex className="col-span-2" align="center">
                      <img src={bank} alt="" className=" w-14 h-14" />
                      <Heading
                        title={t("Bank_Details")}
                        description={t(" Your_Banking_Details")}
                        font="16px"
                      />
                    </Flex>
                    <FormInput
                      title={t("Full_Name")}
                      placeholder={t(" Full_Name")}
                      description={t(
                        "full_legal_name_as_it_appears_on_bank_records"
                      )}
                      value={formik3.values.fullName}
                      change={(e) => {
                        formik3.setFieldValue("fullName", e);
                      }}
                    />
                    <FormInput
                      title={t("Bank_Name")}
                      placeholder={t(" Bank_Name")}
                      value={formik3.values.bankName}
                      change={(e) => {
                        formik3.setFieldValue("bankName", e);
                      }}
                      error={formik3.errors.bankName}
                    />
                    <FormInput
                      title={t("Account_Number")}
                      placeholder={t(" Account_Number")}
                      value={formik3.values.accountNumber}
                      change={(e) => {
                        formik3.setFieldValue("accountNumber", e);
                      }}
                      error={formik3.errors.accountNumber}
                    />
                    <Dropdown
                      title={t("Account_Type")}
                      placeholder={""}
                      value={formik3.values.accountType}
                      change={(e) => {
                        formik3.setFieldValue("accountType", e);
                      }}
                      error={formik3.errors.accountType}
                      options={accountType}
                    />
                    <FormInput
                      title={t("IFSC_Code")}
                      placeholder={t(" IFSC_Code")}
                      value={formik3.values.ifscCode}
                      change={(e) => {
                        formik3.setFieldValue("ifscCode", e);
                      }}
                      error={formik3.errors.ifscCode}
                    />
                    <FormInput
                      title={t("Bank_Branch")}
                      placeholder={t(" Bank_Branch")}
                      value={formik3.values.bankBranch}
                      change={(e) => {
                        formik3.setFieldValue("bankBranch", e);
                      }}
                      error={formik3.errors.bankBranch}
                    />
                    <Flex gap={24} align="center" className=" col-span-2">
                      <p className="text-xs dark:text-white">
                        {t("Is_your_bank_account_international")}
                      </p>
                      <RadioButton
                        options={[
                          { label: t("Yes"), value: 1 },
                          { label: t("No"), value: 0 },
                        ]}
                      />
                    </Flex>
                    <FormInput
                      title={t("Swift_ID")}
                      placeholder={t(" Swift_ID")}
                      value={formik3.values.swiftId}
                      change={(e) => {
                        formik3.setFieldValue("swiftId", e);
                      }}
                      error={formik3.errors.swiftId}
                    />
                  </FlexCol>
                ) : (
                  activeBtnValue === "upoadDocuments" && (
                    <FlexCol>
                      <Flex className="col-span-2" align="center" gap={16}>
                        <img src={documents} alt="" className=" w-7 h-7" />
                        <Heading
                          title={t("Upload_Documents")}
                          description={t("Upload_below_mentioned_documents")}
                          font="16px"
                        />
                      </Flex>
                      <p className="text-xs font-semibold dark:text-white">
                        {t("Uploads_Pending") + "(4)"}
                      </p>
                      <Flex className=" flex flex-col">
                        {upoadDocuments.map((each) => (
                          <FlexCol
                            className={`${
                              upoadDocuments[0].title !== each.title
                                ? " border-t"
                                : ""
                            }`}
                          >
                            {console.log(each[0])}
                            <Flex
                              justify="space-between"
                              align="center"
                              className=" py-4 "
                            >
                              <Flex className=" gap-4" align="center">
                                <div
                                  //   className={`p-3 bg-gradient-to-b from-[${each.colorFrom}] to-[${each.colorTo}] rounded-lg`}
                                  className={`p-3  rounded-lg`}
                                >
                                  <img
                                    src={each.image}
                                    alt=""
                                    className=" w-10 h-10 "
                                    style={{ ...each.imageStyle }}
                                  />
                                </div>
                                <Heading
                                  title={each.title}
                                  description={each.description}
                                  font="16px"
                                />
                              </Flex>
                              <Flex
                                justify="space-between"
                                align="center"
                                className=" gap-4"
                              >
                                {/* <Upload
                                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                  directory
                                
                                > */}
                                <Button icon={<VscCloudUpload />}>
                                  {t("Upload")}
                                </Button>
                                {/* </Upload> */}
                              </Flex>
                            </Flex>
                          </FlexCol>
                        ))}
                      </Flex>
                    </FlexCol>
                  )
                )}
              </div>
            </form>
          </div>
        </DrawerPop>
      )}
    </>
  );
}
