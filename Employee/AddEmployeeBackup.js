import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Stepper from "../common/Stepper";
import ButtonClick from "../common/Button";
import { useTranslation } from "react-i18next";

const AddEmployee = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState([
    {
      id: 1,
      value: 0,
      title: t("Employee_Details"),
      data: "employeeDetails",
    },
    {
      id: 3,
      value: 2,

      title: t("Work_Details"),
      data: "workDetails",
    },
    {
      id: 4,
      value: 3,

      title: t("Contact_Policy"),
      data: "contact_Policy",
    },
    {
      id: 5,
      value: 4,

      title: t("Assets_Docs"),
      data: "assets_Docs",
    },
  ]);

  const handleClick = (clickType) => {
    let newStep = currentStep;
    clickType === "next" ? newStep++ : newStep--;

    // Check if steps are within the boundary
    if (newStep > 0 && newStep <= steps.length) {
      setCurrentStep(newStep);
      // Reset the form validation status for the new step
      // setFormValid(false);
    }
  };
  const renderForm = () => {
    return (
      <div className="overflow-hidden ">
        <motion.div
          key={`form-${currentStep}`}
          className="form-container"
          initial={{ opacity: 0, height: 0, overflow: "hidden" }}
          animate={{ opacity: 1, height: "auto", overflow: "visible" }}
          exit={{ opacity: 0, height: 0, overflow: "hidden" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Your Form Components */}
          {/* You can customize this part based on your form content */}
          <div>
            <h2>Step {currentStep}</h2>
            {currentStep === 1 && (
              <form>
                <label>
                  Company Details:
                  {/* <input type="text" name="companyDetails" value="" /> */}
                </label>
              </form>
            )}
            {currentStep === 2 && (
              <form>
                <label>
                  Business Hours:
                  {/* <input type="text" name="businessHours" value="" /> */}
                </label>
              </form>
            )}
            {/* Additional form content for other steps */}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <>
      <div className="container mt-5 mb-12 horizontal">
        <Stepper steps={steps} currentStepNumber={currentStep} />
      </div>

      <AnimatePresence exitBeforeEnter={false} mode="out-in">
        {renderForm()}
      </AnimatePresence>

      <div className="container flex justify-around my-8 ">
        <ButtonClick
          handleSubmit={() => handleClick("prev")}
          className=""
          buttonName="Previous"
        >
          {" "}
        </ButtonClick>
        <ButtonClick
          handleSubmit={() => handleClick("next")}
          BtnType="primary"
          className=""
          buttonName="Next"
        >
          {" "}
        </ButtonClick>
      </div>
    </>
  );
};

export default AddEmployee;
