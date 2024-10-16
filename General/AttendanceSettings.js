import React, { useEffect, useState } from "react";
import DrawerPop from "../common/DrawerPop";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";
import Group1 from "../../assets/images/Group 1.png";
import Group2 from "../../assets/images/userPrivileges/Normal.png";
import Group3 from "../../assets/images/Group 3.png";
import SearchBox from "../common/SearchBox";
import user1 from "../../assets/images/user1.jpeg";
import CheckBoxInput from "../common/CheckBoxInput";

export default function AttendanceSettings({ open, close = () => {} }) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);

  const [customRate, setCustomRate] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    close(false);
  };

  const formik = useFormik({
    initialValues: {
      assetsType: "",
      asset: "",
      description: "",
      iswarranty: "",
      warrantyExpiry: "",
      assetRenewal: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      assetsType: yup.string().required("Assets Type is Required"),
      asset: yup.string().required("Asset Name is Required"),
    }),
  });
  const Formik3 = useFormik({
    initialValues: {
      overtimePolicyName: "",
      // isTrackOverTime: false,
      // isRequestOverTime: false,
      maximumOverTimePerMonth: "",
      hourlyRate: "",
      // offType: "",
      halfDay: "",
      fullDay: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object({
      overtimePolicyName: yup
        .string()
        .required("Overtime Policy Name is Required"),
    }),
    onSubmit: async (e) => {},
  });

  const LoanAmounts = [
    {
      id: 1,
      title: "All Staff",
      description: "All Employee can access",
      image: Group1,
      value: "Allstaff",
    },
    {
      id: 2,
      title: "None Access",
      description: "All employee access denied.",
      image: Group2,
      value: "customRate",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <DrawerPop
        open={show}
        close={() => {
          handleClose();
          close();
        }}
        contentWrapperStyle={{
          height: "100%",
          width: "590px",
        }}
        handleSubmit={(e) => {
          formik.handleSubmit();
        }}
        updateBtn={UpdateBtn}
        header={[
          !UpdateBtn ? t("Salary Detail Access") : t(""),
          !UpdateBtn
            ? t("Manage you companies here, and some lorem ipsu")
            : t(""),
        ]}
        footerBtn={[t("Cancel"), t("Save")]}
        footerBtnDisabled={loading}
      >
        <h1>Salary Detail Access</h1>

        <div className="flex flex-col gap-6">
          <div className="flex gap-3 w-full dark:text-white translate-y-3   ">
            {LoanAmounts?.map((each, i) => (
              <div
                key={i}
                className={`col-span-4 p-2 h-20 border w-full rounded-2xl cursor-pointer showDelay dark:bg-dark  ${
                  customRate === each.id && "border-primary "
                } `}
                onClick={() => {
                  setCustomRate(each.id);
                  Formik3.setFieldValue("hourlyRate", each.value);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className=" flex gap-2 h-16 items-center">
                    <div
                      className={`${
                        customRate === each.id && " text-primary  "
                      } h-12 border rounded-mdx w-fit bg-[#F8FAFC] dark:text-dark`}
                    >
                      <img src={each.image} className="h-12" />
                    </div>

                    <span className="flex flex-col gap-1">
                      <h3 className=" text-sm font-semibold ">{each.title}</h3>

                      <p className=" text-xs font-medium text-[#667085] ">
                        {each.description}
                      </p>
                    </span>
                  </div>
                  <div
                    className={`${
                      customRate === each.id && "border-primary"
                    } border  rounded-full`}
                  >
                    <div
                      className={`font-semibold text-base w-4 h-4 border-2 border-white   rounded-full ${
                        customRate === each.id && "text-primary bg-primary"
                      } `}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className=" dark:text-white  ">
            <div
              className={`col-span-4 p-2 h-20 border w-full rounded-2xl cursor-pointer showDelay dark:bg-dark  ${
                customRate && "border-primary "
              } `}
              onClick={() => {
                Formik3.setFieldValue("hourlyRate");
              }}
            >
              <div className="flex justify-between items-start">
                <div className=" flex gap-2 h-16 items-center">
                  <div
                    className={`${
                      customRate && " text-primary  "
                    } p-2 border rounded-mdx w-fit bg-[#F8FAFC] dark:text-dark items-center`}
                  >
                    <img src={Group3} className="h-12" />
                  </div>

                  <span className="flex flex-col gap-1">
                    <h3 className=" text-sm font-semibold ">
                      Only Selected Staff
                    </h3>

                    <p className=" text-xs font-medium text-[#667085] ">
                      Selected Employee can access
                    </p>
                  </span>
                </div>
                <div
                  className={`${
                    customRate && "border-primary"
                  } border  rounded-full`}
                >
                  <div
                    className={`font-semibold text-base w-4 h-4 border-2 border-white   rounded-full ${
                      customRate && "text-primary bg-primary"
                    } `}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <p>Selected Employees</p>
            <p className="text-primary">3 Selected</p>
          </div>
          <div>
            <SearchBox className="w-full" placeholder={t("Search_Employees")} />
          </div>
          <div className="flex justify-between bg-purple-50 items-center h-14 w-full">
            <div className="flex gap-3 items-center p-2">
              <img src={user1} className="rounded-full h-8 w-8" />
              <span>
                <h3 className="text-sm font-semibold text-black dark:text-white">
                  Karthik
                </h3>
                <p className="text-sm font-normal text-gray-500 md:text-base dark:text-white">
                  id
                </p>
              </span>
            </div>
            <div className="mr-3">
              <CheckBoxInput>Select All</CheckBoxInput>
            </div>
          </div>
        </div>
      </DrawerPop>
    </div>
  );
}
