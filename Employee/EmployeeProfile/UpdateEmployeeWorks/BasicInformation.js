import React, { useEffect, useState } from "react";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { notification } from "antd";
import API, { action } from "../../../Api";
import axios from "axios";
import DrawerPop from "../../../common/DrawerPop";
import FlexCol from "../../../common/FlexCol";
import FormInput from "../../../common/FormInput";
import Dropdown from "../../../common/Dropdown";
import DateSelect from "../../../common/DateSelect";
import { getCompanyList } from "../../../common/Functions/commonFunction";
import { useNotification } from "../../../../Context/Notifications/Notification";

export default function BasicInformation({
  open,
  close = () => {},
  updateData,
  employeeId,
  companyDataId,
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [organisationId, setOrganisationId] = useState(
    localStorage.getItem("organisationId")
  );

  const [designationList, setDesignationList] = useState([]);
  const [shiftSchemeList, setShiftSchemeList] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState([]);
  const [location, setLocation] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);
  const handleClose = () => {
    close(false);
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
  // const getEmployeeIdBased = async () => {
  //   try {
  //     console.log(
  //       API.HOST + API.GET_EMPLOYEE_ID_BASED_RECORDS + "/" + employeeId
  //     );
  //     const result = await axios.post(
  //       API.HOST + API.GET_EMPLOYEE_ID_BASED_RECORDS + "/" + employeeId
  //     );
  //     console.log(result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getCompany = async () => {
    try {
      const result = await getCompanyList(organisationId);
      setCompany(
        result.map((each) => ({
          label: each.company,
          value: each.companyId,
        }))
      );

      // console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getLocation = async (e) => {
    // console.log(e, "eeeeeeeee");
    try {
      const result = await action(API.GET_LOCATION, { companyId: e });
      setLocation(
        result.result.map((each) => ({
          label: each.location,
          value: each.locationId,
        }))
      );
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  const getDepartment = async (e) => {
    // console.log(e, "getDepartment");

    try {
      const result = await action(API.GET_DEPARTMENT, { companyId: e });
      setDepartmentList(
        result.result.map((each) => ({
          label: each.department,
          value: each.departmentId,
        }))
      );
      // console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDesignation = async (e) => {
    // console.log(e, "getDesignation");
    try {
      const result = await action(API.GET_DESIGNATION_RECORDS, {
        companyId: e,
      });
      // console.log(result);

      setDesignationList(
        result?.result?.map((each) => ({
          label: each.designation,
          value: each.designationId,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getEmployee = async (e) => {
    try {
      // console.log(e, "getEmployee");
      const result = await action(API.EMPLOYEE_REPORTING_MANAGERS, {
        companyId: e,
        employeeId: employeeId,
      });
      // console.log(result.result);

      setEmployee(
        result.result?.map((each) => ({
          label: each.firstName,
          value: each.employeeId,
          // logo: logo,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getShiftScheme = async (e) => {
    try {
      // console.log(e, "getShiftScheme");
      const result = await action(API.GET_SHIFT_SCHEME, { companyId: e });
      // console.log(result.result);

      setShiftSchemeList(
        result.result.map((each) => ({
          label: each.shiftScheme,
          value: each.shiftSchemeId,
          startTime: each.startTime,
          endTime: each.endTime,
          breakDuration: each.breakDuration,
          shiftScheme: each.shiftScheme,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    formik.setFieldValue("companyId", parseInt(updateData.companyId));
    formik.setFieldValue("designation", updateData.designationId);
    formik.setFieldValue("department", parseInt(updateData.departmentId));
    formik.setFieldValue("reportsTo", updateData.reportsTo);
    formik.setFieldValue("Location", parseInt(updateData.locationId));
    formik.setFieldValue("hiringDate", updateData.dateOfBirth);
    formik.setFieldValue("probationPeriod", updateData.probationPeriod);
    formik.setFieldValue("shiftScheme", updateData.shiftScheme);
  }, [updateData]);

  useEffect(() => {
    // getEmployeeIdBased();
    getCompany();
  }, []);

  const formik = useFormik({
    initialValues: {
      companyId: "",
      designation: "",
      department: "",
      reportsTo: "",
      Location: "",
      hiringDate: "",
      probationPeriod: "",
      shiftScheme: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      // department: yup.string().required("Department is Required"),
      // description: yup.string().required("Description is Required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      // console.log(e);
      // console.log({
      //   employeeId: updateData.employeeId,
      //   employeeCompanyModel: {
      //     companyId: e.companyId,
      //     designationId: e.designation,
      //     departmentId: e.department,
      //     reportsTo: e.reportsTo,
      //     locationId: e.Location,
      //     joiningDate: e.hiringDate,
      //     probationPeriod: e.probationPeriod,
      //     shiftSchemeId: e.shiftScheme,
      //   },
      // });
      try {
        const result = await action(API.UPDATE_EMPLOYEE_BASIC_DETAILS, {
          employeeId: updateData.employeeId,
          employeeModel: {
            firstName: updateData.firstName,
          },
          employeeAddressModel: {
            countryId: updateData.countryId,
          },
          employeeCompanyModel: {
            companyId: e.companyId,
            designationId: e.designation,
            departmentId: e.department,
            reportsTo: e.reportsTo,
            locationId: e.Location,
            joiningDate: e.hiringDate,
            probationPeriod: e.probationPeriod,
            shiftSchemeId: e.shiftScheme,
          },
        });

        // console.log(result);

        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 500);
          formik.resetForm();
        }
      } catch (error) {
        // console.log(error);
        openNotification("error", "Failed", error);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    // CompanyId
    if (formik.values.companyId) {
      getEmployee(formik.values.companyId);
      getLocation(formik.values.companyId);
      getDepartment(formik.values.companyId);
      getDesignation(formik.values.companyId);
      getShiftScheme(formik.values.companyId);
    }
  }, [formik.values.companyId]);
  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        handleClose();
        close(e);
      }}
      contentWrapperStyle={
        {
          // maxWidth: "600px",
        }
      }
      handleSubmit={(e) => {
        // console.log(e);
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        //   UpdateIdBasedCountry();
      }}
      header={[
        !UpdateBtn ? t("Basic Information") : t(""),
        !UpdateBtn
          ? t("Manage you companies here, and some lorem ipsu")
          : t(""),
      ]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Submit") : t("")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={"col-span-2"}>
        <Dropdown
          title="Company"
          value={formik.values.companyId}
          change={(e) => {
            formik.setFieldValue("companyId", e);
          }}
          options={company}
        />
        <Dropdown
          title="Designation"
          value={formik.values.designation}
          change={(e) => {
            formik.setFieldValue("designation", e);
          }}
          options={designationList}
        />
        <Dropdown
          title="Department"
          value={formik.values.department}
          change={(e) => {
            formik.setFieldValue("department", e);
          }}
          options={departmentList}
        />
        <Dropdown
          title="ReportsTo"
          value={formik.values.reportsTo}
          change={(e) => {
            formik.setFieldValue("reportsTo", e);
          }}
          options={employee}
        />
        <Dropdown
          title="Location"
          value={formik.values.Location}
          change={(e) => {
            formik.setFieldValue("Location", e);
          }}
          options={location}
        />
        <DateSelect
          title="Hiring Date"
          value={formik.values.hiringDate}
          change={(e) => {
            formik.setFieldValue("hiringDate", e);
          }}
        />
        <FormInput
          title="Probation Period"
          value={formik.values.probationPeriod}
          change={(e) => {
            formik.setFieldValue("probationPeriod", e);
          }}
          type="number"
        />
        <Dropdown
          title="Shift Scheme"
          value={formik.values.shiftScheme}
          change={(e) => {
            formik.setFieldValue("shiftScheme", e);
          }}
          options={shiftSchemeList}
        />
      </FlexCol>
    </DrawerPop>
  );
}
