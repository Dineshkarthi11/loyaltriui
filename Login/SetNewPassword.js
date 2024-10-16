import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo_full.svg";
import { LuMail } from "react-icons/lu";
import { LuLock } from "react-icons/lu";
import { RiCheckFill, RiKey2Line } from "react-icons/ri";
import { RiCloseFill } from "react-icons/ri";
import { FiEye, FiEyeOff } from "react-icons/fi";

import googleLogo from "../assets/images/Social/Google.png";
import appleLogo from "../assets/images/Social/apple-fill.png";
import metaLogo from "../assets/images/Social/meta-fill.png";
import { Button, Modal, Checkbox, notification } from "antd";
import ImageScroll from "../components/common/ImageScroll";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import API, { action } from "../components/Api";
import logindash from "../assets/images/logindash.png";
import { use } from "i18next";
import FormInput from "../components/common/FormInput";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";

import { motion, AnimatePresence } from "framer-motion";
import Widget1 from "../assets/images/Widget-1.png";
import Widget2 from "../assets/images/Widget-2.png";
import Widget3 from "../assets/images/Widget-3.png";
import { useTheme } from "../Context/Theme/ThemeContext";
import { useDispatch } from "react-redux";
import { PiArrowLeft } from "react-icons/pi";
import logoImage from "../assets/images/WorkInProgres.jpeg";

export default function SetNewPassword() {
  const [showPassword, setShowPassword] = useState(false);
  // const [loginData, setLoginData] = useState();

  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState([]);

  const id = useParams();
  const [displyScreen, setDisplyScreen] = useState();

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    // console.log(id);
    const decodedString = atob(id.id);
    // Parse the decoded string into JSON
    const json = JSON.parse(decodedString);
    // console.log(
    //   new Date(json.expireTime).getTime() > new Date().getTime(),
    //   "json"
    // );
    if (new Date(json.expireTime).getTime() > new Date().getTime()) {
      setDisplyScreen(true);
    }
  }, []);

  useEffect(() => {
    if (user.access_token) {
      user == [] ? console.log(user) : console.log("Empty user");
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          // console.log("data assigned");
        })
        .catch((err) => console.log(err));
    }
  }, [user]);
  // console.log(profile, "profile from google")

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (profile) {
        try {
          const result = await axios.post(API.HOST + API.LOGIN_USER, {
            username: profile.email,
            thirdPartyLogin: 1,
          });
          // console.log(result, "result from fetchUserProfile");
          if (result.data.status == false) {
            openNotification("error", "Failure", result.data.message);
          }
          if (result.data.status == true) {
            localStorage.setItem("LoginData", JSON.stringify(result.data));
            localStorage.setItem(
              "employeeId",
              JSON.stringify(parseInt(result?.data?.userData?.employeeId))
            );
            window.location.reload();
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchUserProfile();
  }, [profile]);

  const [visible, setVisible] = useState(false);
  const handleForgotPasswordClick = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    formik2.resetForm();
    setVisible(false);
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (type, message, description, callback) => {
    api[type]({
      message: message,
      description: description,
      placement: "top",
      onClose: callback,

      // stack: 2,
      style: {
        background: `${
          type === "success"
            ? `linear-gradient(180deg, rgba(204, 255, 233, 0.8) 0%, rgba(235, 252, 248, 0.8) 51.08%, rgba(246, 251, 253, 0.8) 100%)`
            : "linear-gradient(180deg, rgba(255, 236, 236, 0.80) 0%, rgba(253, 246, 248, 0.80) 51.13%, rgba(251, 251, 254, 0.80) 100%)"
        }`,
        boxShadow: `${
          type === "success"
            ? "0px 4.868px 11.358px rgba(62, 255, 93, 0.2)"
            : "0px 22px 60px rgba(134, 92, 144, 0.20)"
        }`,
      },
      // duration: null,
    });
  };

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      passwordComfirm: "",
      password: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      // passwordComfirm: yup.string().required("passwordComfirm is required"),
      // password: yup.string().required("Password is required"),
    }),
    onSubmit: async (e) => {
      try {
        if (e.passwordComfirm === e.password) {
          const result = await action(
            API.RESET_PASSWORD,
            {
              linkParam: id.id,
              password: e.passwordComfirm,
            }
            // {
            //   headers: {
            //     // "Access-Control-Allow-Origin":false,
            //     "API-Key": 525-777-777,
            //     // "API-Key": '525-777-777',
            //   },
            // }
          );
          // console.log(result.data, "result data");
          // console.log(result.status, "result status");

          // localStorage.setItem("organisationId", JSON.stringify(2));
          // if (result.data.status === false) {
          //   console.log("hi notification here");
          //   openNotification("error", "Failure", result.data.message);
          // }

          // if (result.data.status === true) {
          //   localStorage.setItem("LoginData", JSON.stringify(result.data));
          //   localStorage.setItem(
          //     "employeeId",
          //     JSON.stringify(parseInt(result?.data?.userData?.employeeId))
          //   );
          //   localStorage.setItem(
          //     "organisationId",
          //     JSON.stringify(parseInt(result?.data?.userData?.organisationId))
          //   );

          // window.location.reload();
          navigate("/");
          // }
          // console.log("result");
          // console.log(result);
        } else {
          openNotification(
            "error",
            "Failure",
            "Passwords do not match. Please try again"
          );
        }
      } catch (error) {
        // console.log(error);
        openNotification("error", "Failed", error.code);
      }
    },
  });

  const formik2 = useFormik({
    initialValues: {
      email: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      email: yup.string().required("Email is required"),
    }),
    onSubmit: async (e) => {
      try {
        const result = await action(API.FORGOT_PASSWORD, {
          emailId: e.email,
        });
        // console.log(result, "result for forgot pass");
        // console.log(result.result, "result.result for forgot pass");
        if (result.result.status === false) {
          openNotification(
            "error",
            "Something went wrong",
            result.result.message
          );
        }
        if (result.result.status === true) {
          openNotification("success", "Successful", result.result.message);
        }
        // console.log(e.email, "this is entered email")
        formik2.resetForm();
        setVisible(false);
      } catch (error) {
        console.log(error, "error on forgot password");
      }
    },
  });

  const [rememberMe, setRememberMe] = useState(false);
  useEffect(() => {
    // Check local storage for rememberMe value when component mounts
    const rememberMeValue = localStorage.getItem("rememberMe");
    if (rememberMeValue) {
      setRememberMe(JSON.parse(rememberMeValue));
    }
  }, []);
  const onChange = (e) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    localStorage.setItem("rememberMe", isChecked);
  };

  return (
    <div className="absolute top-0 bottom-0 flex w-full">
      {contextHolder}
      <div className="w-full lg:w-1/2">
        <div className="flex flex-col justify-between h-full p-10 py-4 mx-auto sm:w-2/3 lg:w-full md:px-20 2xl:py-20">
          {/* LOGO  */}
          <div className="flex justify-center logo lg:justify-start">
            <img src={logo} alt="logo" className="w-20 2xl:w-28" />
          </div>

          {/* FORM  */}
          {displyScreen ? (
            <div className="flex items-center justify-center form-section">
              <div className="flex flex-col w-full !gap-5 lg:w-3/4 xl:w-2/3 2xl:w-1/2">
                <div className="flex flex-col items-center !gap-5">
                  <div className="bg-primaryalpha/10 size-16 text-primary vhcenter rounded-full">
                    <RiKey2Line size={38} />
                  </div>
                  {/* Header Form  */}
                  <div className="text-center header">
                    <h1 className="text-xl font-semibold 2xl:text-3xl">
                      Set new password
                    </h1>
                    <p className="mb-0 text-sm opacity-50 2xl:text-base">
                      Your new password must be different to previously used
                      password
                    </p>
                  </div>
                </div>

                <div
                  action="submit"
                  // onSubmit={"submit"}
                  className="flex flex-col !gap-5"
                >
                  {/* Password Input Box */}
                  <div
                    className="relative input-section"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        formik.handleSubmit();
                      }
                    }}
                  >
                    <div className="flex items-center w-full !border !border-black !border-opacity-20 rounded-lg transition-all duration-300 focus-within:!border-primary hover:!border-primary focus-within:shadow-ShadowInput">
                      <div className="flex items-center !px-4">
                        <LuLock size={20} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="floating_filled_password"
                        className="w-full h-12 text-sm bg-transparent border-none outline-none appearance-none 2xl:h-16 peer"
                        value={formik.values.password}
                        onChange={(e) =>
                          formik.setFieldValue("password", e.target.value)
                        }
                        onBlur={formik.handleBlur}
                      />

                      <label
                        htmlFor="floating_filled_password"
                        className={`-z-10 absolute transition-all leading-[1] duration-200 ${
                          formik.values.password.length === 0
                            ? "left-12 text-gray-400 peer-focus-within:left-12 peer-focus-within:-translate-y-4 peer-focus-within:text-gray-700 peer-focus-within:text-[10px] peer-focus-within:text-bold"
                            : "left-12 -translate-y-4 text-gray-700 text-[10px] text-bold"
                        }`}
                      >
                        Enter Password
                      </label>

                      {/* Eye Button to Toggle Password Visibility */}
                      <div
                        className="absolute cursor-pointer right-4"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FiEyeOff
                            size={18}
                            className="text-black opacity-50"
                          />
                        ) : (
                          <FiEye size={18} className="text-black opacity-50" />
                        )}
                      </div>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                      <p className="m-0 text-[#FF3E3E] text-xs">
                        {formik.errors.password}
                      </p>
                    ) : null}
                  </div>
                  {/* Confirm password Input Box */}
                  <div
                    className="relative input-section"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        formik.handleSubmit();
                      }
                    }}
                  >
                    <div className="flex items-center w-full !border !border-black !border-opacity-20 rounded-lg transition-all duration-300 focus-within:!border-primary hover:!border-primary focus-within:shadow-ShadowInput">
                      <div className="flex items-center !px-4">
                        <LuLock size={20} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="floating_filled_password"
                        className="w-full h-12 text-sm bg-transparent border-none outline-none appearance-none 2xl:h-16 peer"
                        value={formik.values.passwordComfirm}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "passwordComfirm",
                            e.target.value
                          )
                        }
                        onBlur={formik.handleBlur}
                      />

                      <label
                        htmlFor="floating_filled_password"
                        className={`-z-10 absolute transition-all leading-[1] duration-200 ${
                          formik.values.password.length === 0
                            ? "left-12 text-gray-400 peer-focus-within:left-12 peer-focus-within:-translate-y-4 peer-focus-within:text-gray-700 peer-focus-within:text-[10px] peer-focus-within:text-bold"
                            : "left-12 -translate-y-4 text-gray-700 text-[10px] text-bold"
                        }`}
                      >
                        Confirm Password
                      </label>

                      {/* Eye Button to Toggle Password Visibility */}
                      <div
                        className="absolute cursor-pointer right-4"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FiEyeOff
                            size={18}
                            className="text-black opacity-50"
                          />
                        ) : (
                          <FiEye size={18} className="text-black opacity-50" />
                        )}
                      </div>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                      <p className="m-0 text-[#FF3E3E] text-xs">
                        {formik.errors.password}
                      </p>
                    ) : null}
                  </div>

                  {/* BUTTON  */}
                  <Button
                    type="submit"
                    className="w-full h-12 text-sm text-white transition-all duration-300 rounded-lg outline-none appearance-none !border !border-primary !bg-primary 2xl:h-16 shadow-shadowXS hover:!bg-transparent hover:!text-primary 2xl:text-lg"
                    onClick={() => {
                      formik.handleSubmit();
                    }}
                  >
                    Reset password
                  </Button>
                  <Link
                    to="/"
                    className="text-primaryalpha/70 hover:text-primaryalpha/100 flex justify-center items-center gap-2"
                  >
                    <PiArrowLeft />
                    Back to log in
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <img src={logoImage} alt="" className="w-40" />
              <p className=" text-md font-semibold opacity-45">
                Your reset password link has expired. Please request a new
                password reset link to proceed.
              </p>
            </div>
          )}

          {/* FOOTER TITLE  */}
          <div>
            <p className="text-sm text-center 2xl:text-base opacity-30">
              Loyaltri
            </p>
          </div>
        </div>
      </div>

      <div className="items-center justify-center hidden text-white lg:w-1/2 lg:flex">
        <div className="h-[calc(100%_-5%)] w-[calc(100%_-5%)] bg_linear_colort rounded-3xl px-20 py-10 2xl:!p-14 gap-4 overflow-hidden">
          <div className="h-full w-full flex flex-col justify-between">
            <div className="top flex flex-col gap-1">
              <h1 className="text-2xl leading-none 2xl:text-[52px] font-semibold">
                The simplest way to manage your organisation
              </h1>
              <p className="para !text-white !font-normal">
                Enter your credintials to access your account
              </p>
            </div>

            {/* <div className="ml-0 middle h-[200px] lg:h-[250px] xl:h-[250px] 2xl:h-[400px]"> */}
            <div className="h-ful mb-6">
              {/* <img
              src={logindash}
              alt="logindash"
              className="object-contain object-left w-full h-full ml-auto"
            /> */}
              <div className=" w-full h-full vhcenter">
                <div className="2xl:w-[500px] w-[75%] relative">
                  <motion.div
                    initial={{ opacity: 0, translateX: 30 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{
                      type: "",
                      yoyo: Infinity,
                      delay: 0.9,
                      duration: 0.6,
                    }}
                  >
                    <img src={Widget1} alt="" className="w-full" />
                  </motion.div>
                  <motion.div
                    className=" w-36 2xl:w-[250px] -left-[74px] top-[50px] absolute shadow-widget rounded-xl overflow-hidden"
                    initial={{ opacity: 0, translateX: -30 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{
                      type: "",
                      yoyo: Infinity,
                      delay: 1,
                      duration: 0.6,
                    }}
                  >
                    <img
                      src={Widget2}
                      alt=""
                      className=" w-full object-cover"
                    />
                  </motion.div>
                  <motion.div
                    className=" w-36 2xl:w-[200px] -bottom-[38px] right-[45px] absolute shadow-widget rounded-xl overflow-hidden"
                    initial={{ opacity: 0, translateY: 30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{
                      type: "",
                      yoyo: Infinity,
                      delay: 1.2,
                      duration: 0.6,
                    }}
                  >
                    <img
                      src={Widget3}
                      alt=""
                      className=" w-full object-cover"
                    />
                  </motion.div>
                </div>
              </div>

              {/* <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute bg-white"
            >
              <img src={Widget2} alt="" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute"
            >
              <img src={Widget3} alt="" />
            </motion.div> */}
            </div>

            <div className="w-full mx-auto">
              <div className="text-center">
                <ImageScroll />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
