import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../common/DrawerPop";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { useFormik } from "formik";
import * as yup from "yup";
import FlexCol from "../common/FlexCol";
import { Flex } from "antd";
import Stepper from "../common/Stepper";
import Heading from "../common/Heading";
import FormInput from "../common/FormInput";
import CheckBoxInput from "../common/CheckBoxInput";
import Accordion from "../common/Accordion";
import API, { action } from "../Api";
import EmployeeCheck from "../common/EmployeeCheck";
import { useNotification } from "../../Context/Notifications/Notification";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function CreateNewRole({
  open = "",
  close = () => {},
  refresh = () => {},
  ConfigurationAction,
  updateId,
}) {
  const [show, setShow] = useState(open);
  const [isUpdate, setIsUpdate] = useState(updateId ? true : false);
  const [activeBtn, setActiveBtn] = useState(0);
  const [presentage, setPresentage] = useState(0);
  const [activeBtnValue, setActiveBtnValue] = useState("Roles");
  const [nextStep, setNextStep] = useState(0);

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeCheckList, setEmployeeCheckList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleTypeId, setRoleTypeId] = useState(null);
  const [parent, setParent] = useState([]);
  const [subFunctionCheckboxes, setSubFunctionCheckboxes] = useState({});
  const [mainFunctionCheckboxes, setMainFunctionCheckboxes] = useState({});
  const { t } = useTranslation();
  const [empId, setEmployeeIdFromlocalStorage] = useState(
    localStorageData.employeeId
  );

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
      roleName: "",
      isActive: "",
      createdBy: empId,
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      roleName: yup.string().required("Role Name is required"),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Initialize an array to collect selected function IDs

        let selectedFunctionIds = [];

        // Iterate over each parent function

        parent.forEach((item) => {
          // Check if the main function or any of its sub-functions are selected

          if (
            subFunctionCheckboxes[item.functionId] ||
            mainFunctionCheckboxes[item.functionId]
          ) {
            // Add the ID of the main function to the selectedFunctionIds array

            selectedFunctionIds.push(item.functionId);
          }

          // Check if any sub-function of this main function is selected

          item.subFunctions.forEach((subItem) => {
            if (subFunctionCheckboxes[subItem.functionId]) {
              // Add the ID of the sub-function to the selectedFunctionIds array

              selectedFunctionIds.push(subItem.functionId);
            }
          });
        });

        // Remove duplicate IDs (if any)

        selectedFunctionIds = [...new Set(selectedFunctionIds)];

        // Log the selected function IDs

        const payload = {
          companyId: companyId,
          roleName: values.roleName,
          isActive: values.isActive,
          createdBy: empId,

          // selectedFunctionIds: selectedFunctionIds,

          // functionId: selectedSubFunctionIds,

          functionId: [...selectedFunctionIds],
          isReportingManagerRole: 0,
        };

        const result = await action(API.SAVE_USERPRIVILIGES_ROLE, payload);

        if (result.status === 200) {
          setRoleTypeId(result.result.insertedId);

          openNotification("success", "Successful", result.message);
          setPresentage(1);
          setNextStep(nextStep + 1);
          setLoading(false);
        } else {
          openNotification("error", "Info", result.message);
          setLoading(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error.message);
        setLoading(false);
      }
    },
  });

  const initialValues = {
    roleName: "",
  };

  const Formik2 = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object({}),

    onSubmit: async (e) => {
      setLoading(true);

      try {
        const result = await action(API.ASSIGN_EMPLOYEE_FOR_ROLES, {
          roleId: roleTypeId,
          companyId: companyId,
          employeeId: employeeCheckList
            .map((each) => each.assign && each.id)
            .filter((data) => data),
        });

        if (result.status === 200) {
          openNotification("success", "Success", result.message, () => {});
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 1000);
        } else {
          openNotification("error", "Failed...", result.message);
          setLoading(false);
        }

        console.log(result);
      } catch (error) {
        openNotification("error", "Failed...", error.code);
        setLoading(false);

        console.log(error);
      }
    },
  });

  const CreateRoleteps = [
    {
      id: 0,
      value: 0,
      title: "Roles",
      data: "Roles",
    },

    {
      id: 1,
      value: 1,
      title: "Assign Roles",
      data: "assign",
    },
  ];

  useEffect(() => {
    if (activeBtn < 1 && activeBtn !== nextStep) {
      setActiveBtn(1 + activeBtn);
      setActiveBtnValue(CreateRoleteps?.[activeBtn + 1].data);
    }
  }, [nextStep]);

  const navigateBtn = [{ id: 1, value: "Employees", title: "Employees" }];

  const getAllFunctionbyParent = async (callback) => {
    try {
      const result = await action(API.GET_DATA, {});
      setParent(result?.result);

      // Execute the callback function if provided
      if (callback) {
        callback();
      }
    } catch (error) {
      console.error("Error fetching leave types:", error);
    }
  };

  useEffect(() => {
    getAllFunctionbyParent();
  }, []);

  const handleSubFunctionCheckboxChange = (subFunctionId, mainFunctionId) => {
    // Update the state of the subfunction checkbox
    setSubFunctionCheckboxes((prevCheckboxes) => {
      // Calculate the new state for the subfunction
      const newSubFunctionCheckboxState = !prevCheckboxes[subFunctionId];
      // Update the state for the specific subfunction
      const updatedSubFunctionCheckboxes = {
        ...prevCheckboxes,
        [subFunctionId]: newSubFunctionCheckboxState,
      };
      // Determine the main function the subfunction belongs to
      const mainFunction = parent.find(
        (item) => item.functionId === mainFunctionId
      );

      if (mainFunction) {
        // Check if any subfunction under the main function is checked
        const anySubFunctionChecked = mainFunction.subFunctions.some(
          (subItem) => updatedSubFunctionCheckboxes[subItem.functionId]
        );
        // Update the state of the main function checkbox based on the above check
        setMainFunctionCheckboxes((prevCheckboxes) => ({
          ...prevCheckboxes,
          [mainFunctionId]: anySubFunctionChecked,
        }));
      }

      return updatedSubFunctionCheckboxes;
    });
  };

  const handleMainFunctionCheckboxChange = (mainFunction) => {
    const mainFunctionId = mainFunction.functionId;
    const isChecked = !mainFunctionCheckboxes[mainFunctionId];
    // Update the state to reflect the checked state of the main function
    setMainFunctionCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [mainFunctionId]: isChecked,
    }));

    if (mainFunction.subFunctions.length > 0) {
      const updatedSubFunctionCheckboxes = {};
      mainFunction.subFunctions.forEach((subItem) => {
        updatedSubFunctionCheckboxes[subItem.functionId] = isChecked;
      });
      // Update the state with the new checkbox values for subfunctions
      setSubFunctionCheckboxes((prevCheckboxes) => ({
        ...prevCheckboxes,

        ...updatedSubFunctionCheckboxes,
      }));
    }
  };

  const getIdBasedRoleRecords = async (e) => {
    try {
      const result = await action(API.UPDATE_ROLE, {
        id: updateId,
        companyId: companyId,
      });

      if (result.status === 200) {
        formik.setFieldValue("roleName", result.result[0].roleName);
        const updatedSubFunctionCheckboxes = {};
        result.result[0].functions.forEach((func) => {
          updatedSubFunctionCheckboxes[func.functionId] = true;
        });
        setSubFunctionCheckboxes(updatedSubFunctionCheckboxes);
        const mainFunctionIds = result.result[0].functions
          .filter((func) => func.parentFunctionId === "0")
          .map((func) => func.functionId);
        const updatedMainFunctionCheckboxes = {};

        mainFunctionIds.forEach((id) => {
          updatedMainFunctionCheckboxes[id] = true;
        });
        setMainFunctionCheckboxes(updatedMainFunctionCheckboxes);

        const employeeId = result.result[0].employee.map(
          (emp) => emp.employeeId
        );
        setEmployeeList(employeeId);

        setIsUpdate(true);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const UpdateRoleById = async (values) => {
    try {
      let selectedFunctionIds = [];
      parent.forEach((item) => {
        if (
          subFunctionCheckboxes[item.functionId] ||
          mainFunctionCheckboxes[item.functionId]
        ) {
          selectedFunctionIds.push(item.functionId);
        }
        item.subFunctions.forEach((subItem) => {
          if (subFunctionCheckboxes[subItem.functionId]) {
            selectedFunctionIds.push(subItem.functionId);
          }
        });
      });

      // Remove duplicate IDs (if any)
      selectedFunctionIds = [...new Set(selectedFunctionIds)];
      const selectedSubFunctionIds = selectedFunctionIds.filter((id) => {
        // Filter out main function IDs, leaving only sub-function IDs
        return !parent.find((item) => item.functionId === id);
      });

      const payload = {
        roleId: updateId || roleTypeId,
        roleName: formik.values.roleName,
        functionId: [...selectedFunctionIds, ...selectedSubFunctionIds],
      };
      const result = await action(API.UPDATE_USERPRIVILIGES_ROLE, payload);
      if (result.status === 200) {
        openNotification("success", "Successful", result.message);
        setPresentage(1);
        setNextStep(nextStep + 1);
      } else {
        openNotification("error", "Info", result.message);
        setLoading(false);
      }
    } catch (error) {
      openNotification("error", "Failed", error.message);
    }
  };

  useEffect(() => {
    if (updateId) getIdBasedRoleRecords();
  }, [updateId]);

  const updateUserRoleById = async () => {
    try {
      const result = await action(API.UPDATE_USERPRIVILIGES_EMPLOYEES, {
        roleId: updateId || roleTypeId,
        companyId: companyId,
        employeeId: employeeCheckList
          .map((each) => each.assign && each.id)
          .filter((data) => data),
      });

      if (result.status === 200) {
        openNotification("success", "Successful", result.message, () => {});

        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        openNotification("error", "Info", result.message);
      }
    } catch (error) {
      openNotification("error", "Failed", error.code);
    }
  };

  return (
    <div>
      {show && (
        <DrawerPop
          placement="bottom"
          contentWrapperStyle={{
            position: "absolute",
            height: "100%",
            top: 0,
            bottom: 0,
            right: 0,
            width: "100%",
            borderRadius: 0,
            borderTopLeftRadius: "0px !important",
            borderBottomLeftRadius: 0,
          }}
          background="#F8FAFC"
          open={show}
          close={(e) => {
            handleClose();
            setIsUpdate(!isUpdate);
            if (!e) {
              formik.setFieldValue("roleName", "");
            }
          }}
          header={[
            !updateId ? t("Create New Role") : t("Update Role"),

            t("Manage your companies roles here"),
          ]}
          headerRight={
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2.5">
                <p className="text-sm font-medium text-gray-400">{t("Help")}</p>

                <RxQuestionMarkCircled className="text-2xl font-medium text-gray-400 " />
              </div>
            </div>
          }
          footerBtn={[
            t("Cancel"),

            !isUpdate ? t("Save&Continue") : t("Update  Company"),
          ]}
          footerBtnDisabled={loading}
          className="widthFull"
          stepsData={CreateRoleteps}
          buttonClick={(e) => {
            if (activeBtnValue === "Roles") {
              if (!updateId && !roleTypeId) {
                formik.handleSubmit();
              } else {
                UpdateRoleById();
              }
            } else if (activeBtnValue === "assign") {
              if (!updateId) {
                Formik2.handleSubmit();
              } else {
                updateUserRoleById();
              }
            }
          }}
          buttonClickCancel={(e) => {
            if (activeBtn > 0) {
              setActiveBtn(activeBtn - 1);
              setNextStep(nextStep - 1);
              setActiveBtnValue(CreateRoleteps?.[activeBtn - 1].data);
            }
          }}
          nextStep={nextStep}
          activeBtn={activeBtn}
          saveAndContinue={true}
        >
          <FlexCol className={"w-2/4 mx-auto"}>
            {CreateRoleteps && (
              <Flex justify="center">
                <div className="sticky -top-6 z-50 w-full pb-6 ">
                  <Stepper
                    steps={CreateRoleteps}
                    currentStepNumber={activeBtn}
                    presentage={presentage}
                  />
                </div>
              </Flex>
            )}

            {activeBtnValue === "Roles" ? (
              <>
                <Flex justify="center" align="center" className="w-full">
                  <FlexCol
                    className={
                      "flex flex-col gap-0 w-full p-0 borderb border-gray-200 rounded-[10px] dark:border-opacity-10 bg-white dark:bg-dark"
                    }
                  >
                    <Heading
                      className={"p-3 borderbot"}
                      title={
                        !updateId ? t("Create New Role") : t("Update Role")
                      }
                      description={t(
                        "Configure the company access based on the role"
                      )}
                    />

                    <div className="flex gap-2 items-center pb-3 pl-3 ">
                      <FormInput
                        title={t("Role Name")}
                        placeholder={t("Role Name")}
                        change={(e) => {
                          formik.setFieldValue("roleName", e);
                        }}
                        required={true}
                        value={formik.values.roleName}
                        error={
                          formik.values.roleName ? "" : formik.errors.roleName
                        }
                      />
                    </div>
                  </FlexCol>
                </Flex>
                <Flex justify="center" align="center" className="w-full">
                  <FlexCol
                    className={
                      "flex flex-col gap-2 w-full py-4 rounded-2xl dark:border-opacity-10 "
                    }
                  >
                    <div className="">
                      <Heading
                        title="Privileges"
                        description="Configure the company role"
                      />
                    </div>

                    <FlexCol>
                      {parent.map((item) => (
                        <Accordion
                          className={"bg-white dark:bg-dark"}
                          title={
                            <div className="flex items-center gap-2">
                              {item.functionName}
                            </div>
                          }
                          key={item.functionId}
                        >
                          <div className="flex gap-2 items-center dark:text-white">
                            {item.subFunctions.length > 0 && (
                              <CheckBoxInput
                                titleRight="Enable All"
                                value={item.subFunctions.every(
                                  (subItem) =>
                                    subFunctionCheckboxes[subItem.functionId]
                                )}
                                change={() =>
                                  handleMainFunctionCheckboxChange(item)
                                }
                                style={{ display: "none" }}
                              />
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 ">
                            {item.subFunctions.map((subItem, index) => (
                              <div
                                key={subItem.functionId}
                                className={`flex gap-2 items-center ${
                                  subFunctionCheckboxes[subItem.functionId]
                                    ? "bg-primaryalpha/5 dark:bg-primaryalpha/10 rounded-md"
                                    : (index % 2 === 0 &&
                                        (index ===
                                          item.subFunctions.length - 1 ||
                                          index ===
                                            item.subFunctions.length - 2)) ||
                                      index === item.subFunctions.length - 1
                                    ? ""
                                    : "borderbot border-opacity-70"
                                } w-full h-11 pl-2 dark:text-white`}
                                style={{
                                  marginBottom: index % 2 === 0 ? "10px" : 0,
                                }}
                              >
                                <CheckBoxInput
                                  titleRight={subItem.functionName}
                                  value={
                                    subFunctionCheckboxes[subItem.functionId]
                                  }
                                  change={() =>
                                    handleSubFunctionCheckboxChange(
                                      subItem.functionId,

                                      item.functionId
                                    )
                                  }
                                  style={{ display: "none" }}
                                />
                              </div>
                            ))}
                          </div>
                        </Accordion>
                      ))}
                    </FlexCol>
                  </FlexCol>
                </Flex>
              </>
            ) : (
              <div className="flex justify-center w-full">
                <EmployeeCheck
                  title={t("Assign")}
                  description={t("Assign Employees here")}
                  employee={employeeList}
                  navigateBtn={navigateBtn}
                  assignData={(employee, department, location) => {
                    console.log(employee, department, location, "hhhhhh");
                    setEmployeeCheckList(employee);
                  }}
                />
              </div>
            )}
          </FlexCol>
        </DrawerPop>
      )}
    </div>
  );
}
