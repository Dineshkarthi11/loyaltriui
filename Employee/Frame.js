import React, { useState } from "react";
import image from "../../assets/images/webmoney.png";
import image2 from "../../assets/images/Line 81.png";
import image3 from "../../assets/images/Line 85.svg";
import image4 from "../../assets/images/Line 82.svg";
import image5 from "../../assets/images/Line 86.svg";
import image6 from "../../assets/images/Line 83.svg";
import image7 from "../../assets/images/Line 84.svg";
import image8 from "../../assets/images/Line 80.svg";
import image10 from "../../assets/images/Frame 427319200.svg";

import FormInput from "../common/FormInput";
import DrawerPop from "../common/DrawerPop";
import { notification } from "antd";
import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { HiMiniStar } from "react-icons/hi2";
import MultiSelect from "../common/MultiSelect";
import {
  FaArrowsLeftRightToLine,
  FaArrowsUpDownLeftRight,
} from "react-icons/fa6";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { useNotification } from "../../Context/Notifications/Notification";

export const Frame = () => {
  const [openPop, setOpenPop] = useState(null);
  const [show, setShow] = useState(false);

  const [UpdateBtn, setupdateBtn] = useState(false);
  const handleClose = () => setOpenPop(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [companyList, setCompanyList] = useState([]);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const handleOpenModal = () => {
    // Set the state to trigger the rendering of AddLeaveType
    setOpenPop("leaveTypes");
    setShow(true);
    // You might want to set updateId and companyId here if needed
  };

  const formik = useFormik({
    initialValues: {
      name: "", // Update the field name to match your form
      companyId: [],
      description: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      name: yup.string().required("Employee Name is required"), // Update the field name
      companyId: yup.array().required("CompanyId is required"),
      description: yup.string().required("Employee Role is required"), // Update the field name
    }),
    onSubmit: async (e) => {
      setLoading(true);
      if (!e.name || !e.companyId || !e.description) {
        // Update the field names
        openNotification(
          "error",
          "Please fill the form properly",
          "All fields are required."
        );
        setLoading(false);
        return;
      } else {
        openNotification(
          "success",
          "Saved successfully",
          "Employee profile update saved. Changes are now reflected."
        );
      }
      // const result = await axios.post(API.HOST + API.ADD_DESIGNATION, {
      //   designation: e.designation,
      //   companyId: e.companyId,
      //   description: e.description,
      // });
      formik.submitForm();
      handleClose();
      setLoading(false);
    },
  });

  return (
    <div className="frame">
      <div className="overlap">
        <img className="line" alt="Line" src={image8} />
        <img className="img" alt="Line" src={image3} />
        <img className="line-2" alt="Line" src={image5} />
        <img className="line-3" alt="Line" src={image6} />
        <img className="line-4" alt="Line" src={image7} />
        <img className="line-5" alt="Line" src={image4} />
        <img className="line-6" alt="Line" src={image2} />
        {/* <Webmoney className="webmoney-instance" /> */}
        <img className="webmoney-instance" src={image} />
        <div className="text">XYS Solutions</div>
        <div className="overlap-group-wrapper">
          <div className="overlap-group">
            <div className="div-2" />
            <div className="div-3">
              <div className="div-4" />
              <div className="div-5">
                <div className="group">
                  <div className="text-wrapper">Ryan Griffith</div>
                  <div className="job">Chief Executive Officer</div>
                </div>
              </div>
            </div>
            <div className="job-wrapper">
              <div className="job-2">
                {" "}
                <img alt="vector" src={image10} onClick={handleOpenModal}></img>
              </div>
            </div>
          </div>
        </div>

        <div className="overlap-group-wrapper1">
          <div className="overlap-group">
            <div className="div-2" />
            <div className="div-3">
              <div className="div-4" />
              <div className="div-5">
                <div className="group">
                  <div className="text-wrapper">Ryan Griffith</div>
                  <div className="job">Chief Executive Officer</div>
                </div>
              </div>
              {/* <Dropdown
                className="dropdown-instance"
                icon={<MoreVertical className="more-vertical-instance" />}
                open={false}
                type="icon"
              /> */}
              <div className="div-6">
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
              </div>
            </div>
            <div className="job-wrapper">
              <div className="job-2">
                {" "}
                <img alt="vector" src={image10} onClick={handleOpenModal}></img>
              </div>
            </div>
          </div>
        </div>
        <div className="overlap-group-wrapper2">
          <div className="overlap-group">
            <div className="div-2" />
            <div className="div-3">
              <div className="div-4" />
              <div className="div-5">
                <div className="group">
                  <div className="text-wrapper">Ryan Griffith</div>
                  <div className="job">Chief Executive Officer</div>
                </div>
              </div>
              {/* <Dropdown
                className="dropdown-instance"
                icon={<MoreVertical className="more-vertical-instance" />}
                open={false}
                type="icon"
              /> */}
              <div className="div-6">
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
              </div>
            </div>
            <div className="job-wrapper">
              <div className="job-2">
                {" "}
                <img
                  className="vector"
                  alt="vector"
                  src={image10}
                  onClick={handleOpenModal}
                ></img>
              </div>
            </div>
          </div>
        </div>
        <div className="overlap-group-wrapper3">
          <div className="overlap-group">
            <div className="div-2" />
            <div className="div-3">
              <div className="div-4" />
              <div className="div-5">
                <div className="group">
                  <div className="text-wrapper">Ryan Griffith</div>
                  <div className="job">Chief Executive Officer</div>
                </div>
              </div>
              {/* <Dropdown
                className="dropdown-instance"
                icon={<MoreVertical className="more-vertical-instance" />}
                open={false}
                type="icon"
              /> */}
              <div className="div-6">
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
              </div>
            </div>
            <div className="job-wrapper">
              <div className="job-2">
                {" "}
                <img alt="vector" src={image10} onClick={handleOpenModal}></img>
              </div>
            </div>
          </div>
        </div>
        <div className="button-base-wrapper">
          <div className="flex flex-col items-center gap-3 dark:text-dark">
            <div className="border border-3 rounded-md p-2 hover:border-primary hover:text-primary dark:border-dark">
              <FaArrowsUpDownLeftRight className="w-5 h-5" />
            </div>
            <div className="border border-3 rounded-md p-2 hover:border-primary dark:border-dark">
              <div className="flex flex-col gap-4 hover:text-primary">
                <FiZoomIn className="w-5 h-5" />
                <FiZoomOut className="w-5 h-5" />
              </div>
            </div>
            <div className="border border-3 rounded-md p-2 hover:border-primary hover:text-primary dark:border-dark">
              <FaArrowsLeftRightToLine className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="overlap-wrapper">
          <div className="overlap-2">
            <div className="div-2" />
            <div className="div-3">
              <div className="div-9" />
              <div className="div-5">
                <div className="group">
                  <div className="text-wrapper">Taylor Smith</div>
                  <div className="job">Director of Engineering</div>
                </div>
              </div>
              {/* <Dropdown
                className="dropdown-instance"
                icon={<MoreVertical className="more-vertical-instance" />}
                open={false}
                type="icon"
              /> */}
              <div className="div-6">
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
              </div>
            </div>
            <div className="job-wrapper">
              <div className="job-2">
                {" "}
                <img alt="vector" src={image10} onClick={handleOpenModal}></img>
              </div>
            </div>
          </div>
        </div>
        <div className="overlap-wrapper-2">
          <div className="overlap-3">
            <div className="div-2" />
            <div className="div-10">
              <div className="div-11" />
              <div className="div-5">
                <div className="group-2">
                  <div className="text-wrapper">Taylor Smith</div>
                  <div className="job">Software Development </div>
                </div>
              </div>
              {/* <Dropdown
                className="dropdown-instance"
                icon={<MoreVertical className="more-vertical-instance" />}
                open={false}
                type="icon"
              /> */}

              <div className="div-6">
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
              </div>
            </div>
          </div>
          <div className="job-wrapper">
            <div className="job-2">
              {" "}
              <img
                className="vector"
                alt="vector"
                src={image10}
                onClick={handleOpenModal}
              ></img>
            </div>
          </div>
          {openPop === "leaveTypes" && show && (
            // <EmploymentAdd
            //   open={show}
            //   close={setShow}

            //   // shiftList={shift}
            // />
            <DrawerPop
              open={openPop}
              close={(e) => {
                // console.log(e);
                handleClose();
              }}
              contentWrapperStyle={{
                width: "850px",
              }}
              handleSubmit={(e) => {
                // console.log(e);
                formik.handleSubmit();
              }}
              updateBtn={UpdateBtn}
              // updateFun={() => {
              //   UpdateAssetsTypes();
              // }}
              header={[
                !UpdateBtn ? t("Add Hirearchy") : t("Update  Assets"),
                t("Add peoples to your company hierarchy"),
              ]}
              footerBtn={[
                t("Cancel"),
                !UpdateBtn ? t("Add Hirearchy") : t("Update  Assets"),
              ]}
              footerBtnDisabled={loading}
            >
              <div className="relative h-full w-full">
                <FormInput
                  title="Employee Name"
                  placeholder="Enter Name"
                  change={(e) => {
                    formik.setFieldValue("name", e);
                  }}
                  value={formik.values.name}
                  error={formik.errors.name}
                />
                <div className="grid grid-cols-2 gap-4 pt-[30px]">
                  <div className=" col-span-1">
                    <FormInput
                      title="Employee Role"
                      placeholder="Enter Description"
                      change={(e) => formik.setFieldValue("description", e)}
                      value={formik.values.description}
                      error={formik.errors.description}
                    />
                  </div>
                  <div className="col-span-1 ">
                    <label className=" text-sm pb-1">Choose Company</label>
                    <MultiSelect
                      value={formik.values.companyId}
                      // defaultValue={ {value: "cordova", label: "Cordova"}}
                      change={(e) => {
                        // console.log(e);
                        formik.setFieldValue("companyId", e);
                      }}
                      onSearch={(e) => {
                        // console.log(e);
                      }}
                      options={companyList}
                      placeholder="Choose Company"
                      className=" text-sm"
                      error={formik.errors.companyId}
                    />
                    {formik.errors.companyId && (
                      <p className=" flex justify-start items-center my-1 mb-0 text-[10px] text-red-500">
                        <HiMiniStar className="text-[10px]" />
                        <span className="text-[10px] pl-1">
                          {formik.errors.companyId}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </DrawerPop>
          )}
        </div>
        <div className="overlap-wrapper-3">
          <div className="overlap-3">
            <div className="div-2" />
            <div className="div-3">
              <div className="div-12" />
              <div className="div-5">
                <div className="group-3">
                  <div className="text-wrapper">Taylor Smith</div>
                  <div className="job">Product Manager</div>
                </div>
              </div>
              {/* <Dropdown
                className="dropdown-instance"
                icon={<MoreVertical className="more-vertical-instance" />}
                open={false}
                type="icon"
              /> */}
              <div className="div-6">
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
              </div>
            </div>
            <div className="job-wrapper">
              <div className="job-2">
                {" "}
                <img
                  className="vector"
                  alt="vector"
                  src={image10}
                  onClick={handleOpenModal}
                ></img>
              </div>
            </div>
          </div>
        </div>
        <div className="overlap-wrapper-4">
          <div className="overlap-2">
            <div className="div-2" />
            <div className="div-3">
              <div className="div-13" />
              <div className="div-5">
                <div className="text-wrapper-2">Jhony Bell</div>
                <div className="group-4">
                  <div className="job-3"> Product Management</div>
                </div>
              </div>
              {/* <Dropdown
                className="dropdown-instance"
                icon={<MoreVertical className="more-vertical-instance" />}
                open={false}
                type="icon"
              /> */}
              <div className="div-6">
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
              </div>
            </div>
            <div className="job-wrapper">
              <div className="job-2">
                {" "}
                <img
                  className="vector"
                  alt="vector"
                  src={image10}
                  onClick={handleOpenModal}
                ></img>
              </div>
            </div>
          </div>
        </div>
        <div className="overlap-wrapper-5">
          <div className="overlap-2">
            <div className="div-2" />
            <div className="div-3">
              <div className="div-14" />
              <div className="div-5">
                <div className="group-5">
                  <div className="text-wrapper">Grace Bennett</div>
                  <div className="job">Director of Marketing</div>
                </div>
              </div>
              {/* <Dropdown
                className="dropdown-instance"
                icon={<MoreVertical className="more-vertical-instance" />}
                open={false}
                type="icon"
              /> */}
              <div className="div-6">
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
              </div>
            </div>
            <div className="job-wrapper">
              <div className="job-2">
                {" "}
                <img
                  className="vector"
                  alt="vector"
                  src={image10}
                  onClick={handleOpenModal}
                ></img>
              </div>
            </div>
          </div>
        </div>
        <div className="overlap-wrapper-6">
          <div className="overlap-4">
            <div className="div-15" />
            <div className="div-3">
              <div className="div-16" />
              <div className="div-5">
                <div className="group-6">
                  <div className="text-wrapper">James Dunn</div>
                  <div className="job">Financial Manager</div>
                </div>
              </div>
              {/* <Dropdown
                className="dropdown-instance"
                icon={<MoreVertical className="more-vertical-instance" />}
                open={false}
                type="icon"
              /> */}
              <div className="div-6">
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
                <div className="div-7">
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                  <div className="ellipse-2" />
                </div>
              </div>
            </div>
            <div className="job-wrapper">
              <div className="job-2">
                {" "}
                <img
                  className="vector"
                  alt="vector"
                  src={image10}
                  onClick={handleOpenModal}
                ></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
