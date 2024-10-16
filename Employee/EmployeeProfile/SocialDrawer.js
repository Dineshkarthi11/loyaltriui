import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, Menu, Tooltip } from "antd";
import DrawerPop from "../../common/DrawerPop";
import FormInput from "../../common/FormInput";
import { IoMdAdd } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { RiFacebookFill } from "react-icons/ri";
import { SiIndeed } from "react-icons/si";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import API, { action } from "../../Api";
import { useFormik } from "formik";
import * as yup from "yup";
import FlexCol from "../../common/FlexCol";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function SocialDrawer({ open, data, id, close = () => {} }) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [selectedValue, setSelectedValue] = useState(data);
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [employee, setEmployee] = useState({});

  const handleClose = () => {
    setShow(false);
  };

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const handleMenuClick = (option) => {
    setSelectedValue((prevData) => [...prevData, option]);
  };

  const handleDeleteCondition = (option) => {
    setSelectedValue((prevData) => prevData.filter((item) => item !== option));
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

  const validationSchema = yup.object().shape({
    linkedInLink: yup.string(),
    instagramLink: yup.string(),
    whatsAppLink: yup.string(),
    faceBookLink: yup.string(),
    twitterLink: yup.string(),
    NaukriLink: yup.string(),
    indeedLink: yup.string(),
    gulfTalentLink: yup.string(),
  });
  // .test(
  //   "at-least-one-link",
  //   "At least one social media link is required",
  //   (values) => {
  //     return Object.values(values).some((value) => !!value);
  //   }
  // );

  const formik = useFormik({
    initialValues: {
      linkedInLink: "",
      instagramLink: "",
      whatsAppLink: "",
      faceBookLink: "",
      twitterLink: "",
      NaukriLink: "",
      indeedLink: "",
      gulfTalentLink: "",
    },

    validationSchema: validationSchema,
    onSubmit: async (e) => {
      setLoading(true);
      // if (!Object.values(e).some((value) => !!value)) {
      //   // alert('Please enter at least one social media link');
      //   openNotification(
      //     "error",
      //     "Failed",
      //     "Please enter at least one social media link"
      //   );
      //   return;
      // }
      // console.log(
      //   {
      //     linkedInLink: e.linkedin,
      //     instagramLink: e.instagram,
      //     whatsAppLink: e.whatsapp,
      //     faceBookLink: e.facebook,
      //     twitterLink: e.twitter,
      //     NaukriLink: e.naukri,
      //     indeedLink: e.indeed,
      //     gulfTalentLink: e.gulf,
      //   },
      //   "linksss"
      // );

      const links = {};
      // Build the links object with only the fields that have values
      if (e.linkedin) {
        links.linkedInLink = e.linkedin;
      }
      if (e.instagram) {
        links.instagramLink = e.instagram;
      }
      if (e.whatsapp) {
        links.whatsAppLink = e.whatsapp;
      }
      if (e.facebook) {
        links.faceBookLink = e.facebook;
      }
      if (e.twitter) {
        links.twitterLink = e.twitter;
      }
      if (e.naukri) {
        links.NaukriLink = e.naukri;
      }
      if (e.indeed) {
        links.indeedLink = e.indeed;
      }
      if (e.gulf) {
        links.gulfTalentLink = e.gulf;
      }

      try {
        const result = await action(API.SAVE_EMPLOYEE_SOCIALLINK, {
          employeeId: id,
          links: {
            linkedInLink: e.linkedin,
            instagramLink: e.instagram,
            whatsAppLink: e.whatsapp,
            faceBookLink: e.facebook,
            twitterLink: e.twitter,
            NaukriLink: e.naukri,
            indeedLink: e.indeed,
            gulfTalentLink: e.gulf,
          },
        });
        // console.log(result); // Handle the result as needed
        if (result.status === 200) {
          openNotification("success", "Success", "Social link has been added");
          setTimeout(() => {
            handleClose();
            setLoading(false);
          }, 1000);
        } else {
          const errorMessage =
            result.messages && result.messages[0] && result.messages[0].error;
          openNotification("error", errorMessage || result.message);
          setLoading(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error);
        setLoading(false);
      }
    },
  });

  // Calling the fetchapi function to start the API call

  // const result = await action(
  //     API.UPDATE_PASSWORD,
  //     {
  //       employeeId: employeeId,
  //       oldPassword: e.oldPassword,
  //       newPassword: e.newPassword,
  //       // confirmpassword: e.confirmpassword
  //     }

  //   );
  useEffect(() => {
    const fetchapi = async () => {
      try {
        const result = await action(API.GET_EMPLOYEE_ID_BASED_RECORDS, {
          id: id,
        });
        // console.log(result.result.whatsAppLink, "employee result");
        setEmployee(result.result);
        // console.log(result.result, "facebook link");
        if (result.result.status === 200) {
          formik.setFieldValue("facebook", result.result.faceBookLink);
        }
        // console.log(employee,"eeee");
      } catch (error) {
        console.error("Error fetching employee data:", error);
        // Handle error state or logging as needed
      }
    };

    fetchapi();
  }, [employeeId]);
  useEffect(() => {
    formik.setFieldValue("facebook", employee.faceBookLink);
    formik.setFieldValue("whatsapp", employee.whatsAppLink);
    formik.setFieldValue("linkedin", employee.linkedInLink);
    formik.setFieldValue("instagram", employee.instagramLink);
    formik.setFieldValue("naukri", employee.NaukriLink);
    formik.setFieldValue("gulf", employee.gulfTalentLink);
    formik.setFieldValue("indeed", employee.indeedLink);
    formik.setFieldValue("twitter", employee.twitterLink);
    // console.log(employee, "eeeee");
  }, [employee]);

  // console.log(employee.whatsAppLink, "whatsappdata");
  const options = [
    {
      title: "Facebook",
      value: employee.faceBookLink || "facebook",
      icon: <RiFacebookFill />,
    },
    {
      title: "Twitter",
      value: employee.twitterLink || "twitter",
      icon: <FaXTwitter />,
    },
    {
      title: "Naukri",
      value: employee.NaukriLink || "naukri",
      icon: null,
    },
    {
      title: "Indeed",
      value: employee.indeedLink || "indeed",
      icon: <SiIndeed />,
    },
    {
      title: "Gulf Talent",
      value: employee.gulfTalentLink || "gulf",
      icon: null,
    },
    {
      title: "LinkedIn",
      value: employee.linkedInLink || "linkedin",
      icon: <FaLinkedinIn />,
    },
    {
      title: "Instagram",
      value: employee.instagramLink || "instagram",
      icon: <FaInstagram />,
    },
    {
      title: "Whatsapp",
      value: employee.whatsAppLink || "whatsapp",
      icon: <FaWhatsapp />,
    },
  ];

  const menu = (
    <Menu className="max-w-56">
      {options.map((option) => {
        if (
          !selectedValue.some((selected) => selected.value === option.value)
        ) {
          return (
            <Menu.Item
              key={option.value}
              onClick={() => handleMenuClick(option)}
            >
              <div className="flex items-center gap-2">
                {option.icon ? (
                  <div className="vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0">
                    {option.icon}
                  </div>
                ) : (
                  <div className="font-semibold vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0">
                    {option.title.charAt(0)}
                  </div>
                )}
                <p className="font-semibold text-[10px] 2xl:text-sm">
                  {option.title}
                </p>
              </div>
            </Menu.Item>
          );
        }
        return null;
      })}
    </Menu>
  );

  return (
    //         <DrawerPop
    //             open={show}
    //             close={(e) => {
    //                 // console.log(e);
    //                 handleClose();
    //                 close(e);
    //             }}
    //             contentWrapperStyle={{
    //                 width: "540px",
    //             }}
    //             header={[
    //                 "Social Links",
    //                 "Manage your social links here.",
    //             ]}
    //             handleSubmit={() => formik.handleSubmit()}
    //             footerBtn={[t("Cancel"), t("Save")]}
    //         >
    //             <div className="flex flex-col gap-4">
    //                 {selectedValue.map((socialMedia, i) => (
    //                     <div key={i}>
    //                         <div className='flex items-center gap-2'>
    //                             {socialMedia.icon ? (
    //                                 <div className='vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0'>
    //                                     {socialMedia.icon}
    //                                 </div>
    //                             ) : (
    //                                 <div className='font-semibold vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0'>
    //                                     {socialMedia.title.charAt(0)}
    //                                 </div>
    //                             )}
    //                             <div>
    //                                 <FormInput
    //                                     placeholder={socialMedia.title + ' ' + 'Link'}
    //                                     className='w-96'
    //                                     // value={value[socialMedia.value]}
    //                                     // change={handleChange}
    //                                     value={formik.values[socialMedia.value] || ""}
    //                                     change={(e) => {
    //                                         console.log(formik.values[socialMedia.value], 'iii');
    //                                         formik.setFieldValue([socialMedia.value], e)
    //                                     }
    //                                     }
    //                                 />
    //                             </div>
    //                             <Tooltip placement="top" title="Delete">
    //                                 <RiDeleteBin5Line
    //                                     className="cursor-pointer text-grey hover:text-rose-600 hover:bg-gray-300 p-1 ml-2 text-[20px] bg-[#F4F4F4] rounded-md dark:bg-black"
    //                                     onClick={() => handleDeleteCondition(socialMedia)}
    //                                 />
    //                             </Tooltip>
    //                         </div>
    //                     </div>
    //                 ))}

    //                 <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
    //                     <div className="relative flex gap-3 items-center px-[5px] py-[10px] cursor-pointer">
    //                         <IoMdAdd className="group hover:bg-primary hover:text-white bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />
    //                         <p className="text-xs font-medium dark:text-white">
    //                             Add New
    //                         </p>

    //                     </div>
    //                 </Dropdown>

    //                 {contextHolder}
    //             </div>
    //         </DrawerPop>

    //     )
    // }
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
      contentWrapperStyle={{ width: "540px" }}
      header={["Social Links", "Manage your social links here."]}
      handleSubmit={() => formik.handleSubmit()}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
    >
      <div className="flex flex-col gap-4">
        {/* {selectedValue.map((socialMedia, i) => ( */}
        <div>
          <div className="flex items-center gap-2">
            {/* {.icon ? (
                    <div className='vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0'>
                        {socialMedia.icon}
                    </div>
                ) : (
                    <div className='font-semibold vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0'>
                        {socialMedia.title.charAt(0)}
                    </div>
                )} */}

            <div>
              <FlexCol className={"md:grid grid-cols-1"}>
                <div
                  className="flex items-center gap-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      formik.handleSubmit();
                    }
                  }}
                >
                  <div className="vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0">
                    <RiFacebookFill />
                  </div>
                  <FormInput
                    placeholder="Facebook link"
                    className="w-96"
                    value={formik.values.facebook || ""}
                    change={(e) => {
                      formik.setFieldValue("facebook", e);
                    }}
                    maxLength={50}
                  />
                </div>
                <div
                  className="flex items-center gap-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      formik.handleSubmit();
                    }
                  }}
                >
                  <div className="vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0">
                    <FaXTwitter />
                  </div>
                  <FormInput
                    placeholder="Twitter link"
                    className="w-96"
                    value={formik.values.twitter || ""}
                    change={(e) => {
                      formik.setFieldValue("twitter", e);
                    }}
                    maxLength={50}
                  />
                </div>
                <div
                  className="flex items-center gap-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      formik.handleSubmit();
                    }
                  }}
                >
                  <div className="vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0 font-semibold">
                    N
                  </div>
                  <FormInput
                    placeholder="Naukri link"
                    className="w-96"
                    value={formik.values.naukri || ""}
                    change={(e) => {
                      formik.setFieldValue("naukri", e);
                    }}
                    maxLength={50}
                  />
                </div>
                <div
                  className="flex items-center gap-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      formik.handleSubmit();
                    }
                  }}
                >
                  <div className="vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0">
                    <SiIndeed />
                  </div>
                  <FormInput
                    placeholder="Indeed link"
                    className="w-96"
                    value={formik.values.indeed || ""}
                    change={(e) => {
                      formik.setFieldValue("indeed", e);
                    }}
                    maxLength={50}
                  />
                </div>
                <div
                  className="flex items-center gap-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      formik.handleSubmit();
                    }
                  }}
                >
                  <div className="vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0">
                    <FaInstagram />
                  </div>
                  <FormInput
                    placeholder="Instagram link"
                    className="w-96"
                    value={formik.values.instagram || ""}
                    change={(e) => {
                      formik.setFieldValue("instagram", e);
                    }}
                    maxLength={50}
                  />
                </div>
                <div
                  className="flex items-center gap-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      formik.handleSubmit();
                    }
                  }}
                >
                  <div className="vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0">
                    <FaWhatsapp />
                  </div>
                  <FormInput
                    placeholder="Whatsapp link"
                    className="w-96"
                    value={formik.values.whatsapp || ""}
                    change={(e) => {
                      formik.setFieldValue("whatsapp", e);
                    }}
                    maxLength={50}
                  />
                </div>
                <div
                  className="flex items-center gap-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      formik.handleSubmit();
                    }
                  }}
                >
                  <div className="vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0 font-semibold">
                    G
                  </div>
                  <FormInput
                    placeholder="Gulf Talent link"
                    className="w-96"
                    value={formik.values.gulf || ""}
                    change={(e) => {
                      formik.setFieldValue("gulf", e);
                    }}
                    maxLength={50}
                  />
                </div>
                <div
                  className="flex items-center gap-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      formik.handleSubmit();
                    }
                  }}
                >
                  <div className="vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white text-sm 2xl:text-lg shrink-0">
                    <FaLinkedinIn />
                  </div>
                  <FormInput
                    placeholder="LinkedIn link"
                    className="w-96"
                    value={formik.values.linkedin || ""}
                    change={(e) => {
                      formik.setFieldValue("linkedin", e);
                    }}
                    maxLength={50}
                  />
                </div>
              </FlexCol>
            </div>
            {/* {Object.entries(socialMediaLinks).map(([key, value]) => (
                    <div key={key}>
                        <FormInput
                            placeholder={`${key} Link`}
                            className='w-96'
                            value={value}
                            onChange={(e) => {
                                setSocialMediaLinks({
                                    ...socialMediaLinks,
                                    [key]: e
                                });
                            }}
                        />
                        {formik.errors[socialMedia.value] && formik.touched[socialMedia.value] && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors[socialMedia.value]}</div>
                        )}
                    </div>
                ))} */}
            {/* <Tooltip placement="top" title="Delete">
                    <RiDeleteBin5Line
                        className="cursor-pointer text-grey hover:text-rose-600 hover:bg-gray-300 p-1 ml-2 text-[20px] bg-[#F4F4F4] rounded-md dark:bg-black"
                        onClick={() => handleDeleteCondition(socialMedia)}
                    />
                </Tooltip> */}
          </div>
        </div>
        {/* ))} */}

        {/* <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
        <div className="relative flex gap-3 items-center px-[5px] py-[10px] cursor-pointer">
            <IoMdAdd className="group hover:bg-primary hover:text-white bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />
            <p className="text-xs font-medium dark:text-white">Add New</p>
        </div>
    </Dropdown> */}
      </div>
    </DrawerPop>
  );
}
