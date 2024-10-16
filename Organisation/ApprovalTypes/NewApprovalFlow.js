import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next';
import DrawerPop from '../../common/DrawerPop';
import VerticalStepper from '../Payroll/SettingsPayroll/StepperVertical';
import Dropdown from '../../common/Dropdown';
import FormInput from '../../common/FormInput';
import FlexCol from '../../common/FlexCol';
import DraggableStepperChart from './DraggableChart';
import API, { action } from '../../Api';
import { notification } from 'antd';
import VerticalStepperBackup from '../Payroll/SettingsPayroll/SteppVerticalbackup';
import { useNotification } from '../../../Context/Notifications/Notification';
// import EmployeeList from '../../Employee/EmployeeList';

export default function NewApprovalFlow({
  open,
  close = () => { },
  updateId,
  companyDataId,
  refresh,
  actionID
}) {

  const { t } = useTranslation();
  const [show, setShow] = useState(open)
  const [isUpdate, setIsUpdate] = useState(false);
  const [companyId, setcompanyId] = useState(localStorage.getItem('companyId'))
  const [loginEmployeeId, setLoginEmployeeId] = useState(localStorage.getItem('employeeId'))
  const [employeeList, setEmployeelist] = useState([])
  const [chooseType, setchooseType] = useState([])
  const [rules, setRules] = useState({})
  const [approvedTypeId, setApprovedTyeId] = useState(null)
  const [templateName, setTempalName] = useState("")
  const [templateNameerror, setTempalNameerror] = useState("")
  const [templateRules, setTemplateRules] = useState(null)
  const [rulesError, setRulesError] = useState("");
  const [DropdownError, setDropdownError] = useState("")
  const [loading, setLoading] = useState(false);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  useEffect(() => {
    setApprovedTyeId(updateId);
    if (actionID) {
      setIsUpdate(true)
    }
    else {
      setIsUpdate(false)
    }
  }, [actionID]);

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

  const getList = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE, {
        companyId: companyId,
        employeeId: loginEmployeeId,
        isActive: 1
      });
      setEmployeelist(
        result?.result?.map((each) => ({
          label: `${each?.firstName} ${each?.lastName}`,
          value: each?.employeeId,
          img: each?.profilePicture,
          subLabel: each?.code,
        }))
      );

    } catch (error) {
      console.error("Error fetching employee list:", error);
    }
  };

  const getTemplateById = async (actionID) => {
    try {

      const result = await action(API.GET_APPROVED_TEMPLATEBYID, {
        approvalTemplateId: actionID,
      });


      const templateData = result.result[0];


      setApprovedTyeId(templateData.approvalTypeId);
      setTempalName(templateData.templateName);


      const parsedRules = JSON.parse(templateData.rules);


      setTemplateRules(parsedRules);


    } catch (error) {
      console.error("Error fetching template by ID:", error);
    }
  };
  useEffect(() => {
    getTemplateById(actionID)
  }, [actionID])
  useEffect(() => {
    getList();
    getApprovelTypes();
  }, [show])
  const getApprovelTypes = async () => {
    try {
      const result = await action(API.GET_APPROVELS_TYPE, {
        companyId: companyId,
      }); // Assuming API.GET_APPROVELS_TYPE is your API call function

      const options = result.result.map((item) => ({
        label: item.approvalTypeName,
        value: item.approvalTypeId,


      }));
      setchooseType(options)






    } catch (error) {
      console.error("Error fetching approval types:", error);

    }
  };


  const stepSchemeSteps = [
    {
      id: 0,
      value: 0,
      title: "Add Shift Scheme",
      data: "addShiftScheme",
    },
    {
      id: 1,
      value: 1,
      title: "Assign Shift Scheme",
      data: "assignShiftScheme",
    },
    {
      id: 2,
      value: 2,
      title: "Assign Shift Scheme 2",
      data: "assignShiftScheme 2",
    },
  ];

  const handlesubmit = async () => {
    let hasError = false;
    const newErrors = {};


    if (!templateName) {
      setTempalNameerror("Template Name is required.");

      hasError = true;
    } else {
      setTempalNameerror("");
    }


    if (!approvedTypeId) {
      setDropdownError("Approvel Type is required");

      hasError = true;
    } else {
      setDropdownError("");
    }


    Object.entries(rules).forEach(([stepKey, step], stepIndex) => {
      step.forEach((block, blockIndex) => {
        block.forEach((dropdown, dropdownIndex) => {
          if (!dropdown.id) {
            newErrors[`${stepIndex}-${blockIndex}-${dropdownIndex}`] =
              "Please Choose Employee or Level";
            hasError = true;
          }
        });
      });
    });

    setRulesError(newErrors);

    // If there is any error, stop the submission
    if (hasError) {
      return;
    }
    setLoading(true);
    try {
      const result = await action(API.CREATE_UPDATE_APPROVEL_TEMPLATE, {
        approvalTemplateId: actionID || null,
        approvalTypeId: approvedTypeId || null,
        companyId: companyId,
        templateName: templateName,
        rules: rules,
      });

      if (result.status === 200) {
        openNotification("success", "Successful", result.message);
        setTimeout(() => {
          refresh(approvedTypeId);
          handleClose();
          setLoading(false);

        }, 1000);
      } else if (result.status === 500) {
        openNotification("error", "Error", result.message);
        setLoading(false);
      }
    } catch (error) {
      openNotification("error", "Error", "An unexpected error occurred.");
      setLoading(false);
    }
  };




  return (
    <div>
      <DrawerPop
        open={show}
        close={(e) => {
          handleClose();
        }}
        background="#F8FAFC"
        placement="bottom"
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
        handleSubmit={(e) => {
          handlesubmit();
        }}
        // updateBtn={isUpdate}
        header={[
          !isUpdate
            ? t("Create New Approval Flow")
            : t("Update Approval Flow"),
          !isUpdate
            ? t("Create New Approval Flow")
            : t("Update Approval Flow"),
        ]}
        footerBtn={[t("Cancel"), t("Save")]}
        footerBtnDisabled={loading}
      >
        <FlexCol>
          <div className="borderb p-3 rounded-lg w-fit bg-white dark:bg-dark">
            <div className="grid grid-cols-2 gap-3">
              <Dropdown
                title="Choose type"
                placeholder="Choose type"
                className="w-full"
                options={chooseType}
                change={(e) => {
                  setApprovedTyeId(e);
                }}
                value={approvedTypeId}
                error={DropdownError}
                required={true}
              />

              <FormInput
                title="Template Name"
                placeholder="Template Name"
                change={(e) => {
                  setTempalName(e);
                }}
                value={templateName}
                error={templateNameerror}
                required={true}
              />

            </div>
          </div>
          <VerticalStepperBackup
            steps={stepSchemeSteps}
            currentStepNumber={2}
            presentage={1}
            employees={employeeList}
            templateRules={templateRules}
            change={(e) => {
              setRules(e);
              setRulesError("");
            }}
            error={rulesError}
          />
        </FlexCol>
        {/* <DraggableStepperChart /> */}
      </DrawerPop>
    </div>
  );
}
