import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import DrawerPop from "../../../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import FlexCol from "../../../../common/FlexCol";
import FormInput from "../../../../common/FormInput";
import Dropdown from "../../../../common/Dropdown";
import API, { action } from "../../../../Api";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import MultiSelect from "../../../../common/MultiSelect";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

const EmpProfessionalTax = ({
  open,
  close = () => {},
  updateId,
  refresh = () => {},
  statutoryConfigurationId,
}) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [organisationList, setOrganisationList] = useState([]);
  const [slabs, setSlabs] = useState([]);
  const [deductionFrequency, setDeductionFrequency] = useState("");
  const [exceptionMonth, setExceptionMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedHalfYearlyMonths, setSelectedHalfYearlyMonths] = useState([]);
  const organisationId = localStorageData.organisationId;
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
    setLoggedEmployeeId(localStorageData.employeeId);
  }, []);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const initializeSlabs = () => {
    const initialSlabs = [];
    for (let i = 0; i < 9; i++) {
      initialSlabs.push({
        startRange: i === 0 ? 0 : initialSlabs[i - 1].endRange + 1,
        endRange: i === 8 ? "MAX" : (i + 1) * 6000 - 1,
        taxAmount: "",
        exceptionMonthTaxAmount: "",
      });
    }
    setSlabs(initialSlabs);
  };

  useEffect(() => {
    initializeSlabs();
    getRecord();
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 1500),
    [show]
  );

  const getRecord = async () => {
    const result = await action(API.GET_COMPANY_ID_BASED_RECORDS, {
      id: companyId,
    });
    setOrganisationList(result.result);
  };

  const months = [
    { name: "January", value: "January", disabled: false },
    { name: "February", value: "February", disabled: false },
    { name: "March", value: "March", disabled: false },
    { name: "April", value: "April", disabled: false },
    { name: "May", value: "May", disabled: false },
    { name: "June", value: "June", disabled: false },
    { name: "July", value: "July", disabled: false },
    { name: "August", value: "August", disabled: false },
    { name: "September", value: "September", disabled: false },
    { name: "October", value: "October", disabled: false },
    { name: "November", value: "November", disabled: false },
    { name: "December", value: "December", disabled: false },
  ];

  const formik = useFormik({
    initialValues: {
      ptrcNumber: "",
      deductionFrequency: null,
      exceptionMonth: "",
      slabs: [],
    },
    validationSchema: yup.object().shape({
      ptrcNumber: yup
        .string()
        .matches(/^\d*$/, t("PTRC Number must be a number"))
        .max(11, t("PTRC Number must be at most 11 digits"))
        .required(t("PTRC Number is required")),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const config = {
        ptrcNumber: values.ptrcNumber,
        deductionFrequency: values.deductionFrequency,
        exceptionMonth: {
          startMonth: "None",
          endMonth: "None",
        },
        state: organisationId,
        taxSlabDetails: slabs.map((slab) => ({
          startRange: slab.startRange,
          endRange: slab.endRange,
          taxAmount: slab.taxAmount,
          exceptionMonthTaxAmount:
            deductionFrequency === "Monthly" && exceptionMonth === "None"
              ? null
              : slab.exceptionMonthTaxAmount || null,
        })),
      };

      if (deductionFrequency === "Monthly") {
        if (exceptionMonth !== "None") {
          config.exceptionMonth.startMonth = exceptionMonth;
          config.exceptionMonth.endMonth = exceptionMonth;
        }
      } else if (deductionFrequency === "Yearly") {
        config.exceptionMonth.startMonth = exceptionMonth;
        config.exceptionMonth.endMonth = exceptionMonth;
      } else if (deductionFrequency === "Half-Yearly") {
        config.exceptionMonth.startMonth = selectedHalfYearlyMonths[0];
        config.exceptionMonth.endMonth = selectedHalfYearlyMonths[1];
      }

      const professionalTaxPayload = {
        id: statutoryConfigurationId || null,
        companyId: companyId,
        config: config,
        isActive: 1,
        createdBy: loggedEmployeeId,
      };
      try {
        const result = await Payrollaction(
          PAYROLLAPI.SAVE_PT_IN_STATUTORY_COMFIGURATION,
          professionalTaxPayload
        );

        if (result.status === 200) {
          openNotification("success", "Successful", result.message);

          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 1000);
        } else if (result.status === 500) {
          openNotification("error", "Info", result.message);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during form submission:", error);
        openNotification(
          "error",
          "Info",
          "There was an error while saving the category. Please try again."
        );
        setLoading(false);
      }
    },
  });

  const handleFrequencyChange = (value) => {
    formik.setFieldValue("deductionFrequency", value);
    setDeductionFrequency(value);
    initializeSlabs();

    if (value === "Monthly") {
      setAvailableMonths([{ name: "None", value: "None" }, ...months]);
      setExceptionMonth("None");
      formik.setFieldValue("exceptionMonth", "None");
    } else if (value === "Yearly") {
      setAvailableMonths(months);
      setExceptionMonth("");
      formik.setFieldValue("exceptionMonth", "");
    } else if (value === "Half-Yearly") {
      setAvailableMonths(months);
      setSelectedHalfYearlyMonths([]);
      setExceptionMonth("");
      formik.setFieldValue("exceptionMonth", "");
    }
  };

  const handleExceptionMonthChange = (value) => {
    if (deductionFrequency === "Half-Yearly") {
      const selectedMonths = [...selectedHalfYearlyMonths];
      if (selectedMonths.includes(value)) {
        selectedMonths.splice(selectedMonths.indexOf(value), 1);
      } else if (selectedMonths.length < 2) {
        selectedMonths.push(value);
      } else {
        openNotification(
          "error",
          "Info",
          "Only 2 months can be selected for Half-Yearly frequency"
        );
        return;
      }
      setSelectedHalfYearlyMonths(selectedMonths);
      setExceptionMonth(selectedMonths.join(", "));
      formik.setFieldValue("exceptionMonth", selectedMonths.join(", "));
    } else {
      formik.setFieldValue("exceptionMonth", value);
      setExceptionMonth(value);
    }
    initializeSlabs();
  };

  const updateSlabs = (index, field, value) => {
    setSlabs((prevSlabs) => {
      const newSlabs = [...prevSlabs];
      newSlabs[index][field] = value;
      if (field === "endRange" && index < newSlabs.length - 1) {
        const nextStartRange = parseInt(value) + 1;
        newSlabs[index + 1].startRange = nextStartRange;
      }
      if (index === newSlabs.length - 1) {
        newSlabs[index].endRange = "MAX";
      }
      return newSlabs;
    });
  };

  const addSlab = () => {
    const lastSlab = slabs[slabs.length - 1];
    const newStartRange = parseInt(lastSlab.endRange) + 1;
    const newSlab = {
      startRange: newStartRange,
      endRange: "MAX",
      taxAmount: "",
      exceptionMonthTaxAmount: "",
    };
    setSlabs((prevSlabs) => [
      ...prevSlabs.slice(0, -1),
      { ...lastSlab, endRange: newStartRange + 5999 },
      newSlab,
    ]);
    formik.setFieldValue("slabs", [
      ...slabs.slice(0, -1),
      { ...lastSlab, endRange: newStartRange + 5999 },
      newSlab,
    ]);
  };

  const deleteSlab = (index) => {
    setSlabs((prevSlabs) => {
      const newSlabs = prevSlabs.filter((_, i) => i !== index);
      if (index < newSlabs.length) {
        newSlabs[index].startRange =
          index === 0 ? 0 : parseInt(newSlabs[index - 1].endRange) + 1;
      }
      return newSlabs;
    });
  };
  const handleHalyYearlyMonthChange = (selectedMonths) => {
    const allMonths = availableMonths.map((month) => month.value);

    if (selectedMonths.length === 1) {
      const firstMonth = selectedMonths[0];
      const pairedMonth = allMonths[(allMonths.indexOf(firstMonth) + 6) % 12];

      setSelectedHalfYearlyMonths([firstMonth, pairedMonth]);
      formik.setFieldValue(
        "exceptionMonth",
        [firstMonth, pairedMonth].join(", ")
      );

      // Disable all months except the selected pair
      setAvailableMonths(
        availableMonths.map((month) => ({
          ...month,
          disabled: ![firstMonth, pairedMonth].includes(month.value),
        }))
      );
    } else if (selectedMonths.length === 0) {
      // Clear both months if the user removes the selection
      setSelectedHalfYearlyMonths([]);
      formik.setFieldValue("exceptionMonth", "");

      // Re-enable all months
      setAvailableMonths(
        availableMonths.map((month) => ({
          ...month,
          disabled: false,
        }))
      );
    }
  };
  useEffect(() => {
    if (selectedHalfYearlyMonths.length > 0) {
      setAvailableMonths((prevMonths) =>
        prevMonths.map((month) => ({
          ...month,
          disabled: !selectedHalfYearlyMonths.includes(month.value),
        }))
      );
    }
  }, [selectedHalfYearlyMonths]);

  const getPtByIds = async () => {
    if (statutoryConfigurationId) {
      try {
        const result = await Payrollaction(PAYROLLAPI.GET_EPF_RECORDS_BY_ID, {
          id: statutoryConfigurationId,
        });

        if (result.result) {
          const config = result.result.config;
          formik.setFieldValue("ptrcNumber", config.ptrcNumber);
          formik.setFieldValue("deductionFrequency", config.deductionFrequency);

          // Call handleFrequencyChange to trigger the correct UI for Deduction Month based on the frequency
          handleFrequencyChange(config.deductionFrequency);

          // Handle the exceptionMonth for "Monthly", "Yearly", and "Half-Yearly"
          if (config.deductionFrequency === "Half-Yearly") {
            const { startMonth, endMonth } = config.exceptionMonth;
            setSelectedHalfYearlyMonths([startMonth, endMonth]);
            formik.setFieldValue(
              "exceptionMonth",
              [startMonth, endMonth].join(", ")
            );
          } else if (
            config.deductionFrequency === "Yearly" ||
            config.deductionFrequency === "Monthly"
          ) {
            const { startMonth } = config.exceptionMonth;
            setExceptionMonth(startMonth);
            formik.setFieldValue("exceptionMonth", startMonth);
          }

          // Set the slabs based on the response
          setSlabs(
            config.taxSlabDetails.map((slab) => ({
              startRange: slab.startRange,
              endRange: slab.endRange,
              taxAmount: slab.taxAmount,
              exceptionMonthTaxAmount: slab.exceptionMonthTaxAmount,
            }))
          );
        } else {
          console.log("No data found for the given ID");
        }
      } catch (error) {
        console.error("Error fetching EPF records:", error);
      }
    }
  };

  useEffect(() => {
    getPtByIds();
  }, [statutoryConfigurationId]);

  return (
    <DrawerPop
      open={show}
      close={handleClose}
      contentWrapperStyle={{ width: "540px" }}
      header={[
        !updateId ? t("Professional Tax") : t("Update Professional Tax"),
        !updateId
          ? t("Manage Professional Tax")
          : t("Update Selected Professional Tax"),
      ]}
      footerBtn={[t("Cancel"), !updateId ? t("Save") : t("Update")]}
      handleSubmit={formik.handleSubmit}
      footerBtnDisabled={loading}
    >
      <FlexCol className="relative w-full h-full">
        <FormInput
          title={t("PTRC Number")}
          placeholder={t("PTRC Number")}
          required={true}
          value={formik.values.ptrcNumber}
          change={(value) => {
            if (/^\d*$/.test(value) && value.length <= 11) {
              formik.setFieldValue("ptrcNumber", value);
            }
          }}
          name="ptrcNumber"
          error={formik.touched.ptrcNumber && formik.errors.ptrcNumber}
        />

        <Dropdown
          title={t("State")}
          placeholder={t("Choose")}
          value={organisationList.stateName}
          disabled={true}
        />

        <Dropdown
          title={t("Deduction Frequency")}
          placeholder={t("Choose Deduction Frequency")}
          options={["Monthly", "Yearly", "Half-Yearly"].map((option) => ({
            name: option,
            value: option,
          }))}
          value={formik.values.deductionFrequency}
          change={handleFrequencyChange}
          name="deductionFrequency"
          error={
            formik.touched.deductionFrequency &&
            formik.errors.deductionFrequency
          }
        />
        {deductionFrequency === "Monthly" || deductionFrequency === "Yearly" ? (
          <Dropdown
            title={
              deductionFrequency === "Monthly"
                ? t("Exception Month")
                : t("Deduction Month")
            }
            placeholder={t("Choose")}
            options={availableMonths}
            value={exceptionMonth}
            change={handleExceptionMonthChange}
            name="exceptionMonth"
            error={
              formik.touched.exceptionMonth && formik.errors.exceptionMonth
            }
          />
        ) : deductionFrequency === "Half-Yearly" ? (
          <MultiSelect
            title={t("Deduction Month")}
            placeholder={t("Select Deduction Month")}
            value={selectedHalfYearlyMonths}
            change={handleHalyYearlyMonthChange}
            options={availableMonths}
            clearSelection={() => {
              setSelectedHalfYearlyMonths([]);
              formik.setFieldValue("exceptionMonth", "");
              setAvailableMonths(
                availableMonths.map((month) => ({
                  ...month,
                  disabled: false,
                }))
              );
            }}
            name="exceptionMonth"
            className="text-sm"
            error={
              formik.touched.exceptionMonth && formik.errors.exceptionMonth
            }
          />
        ) : null}

        <div className="font-semibold text-sm 2xl:text-base mb-4">
          {t("Tax Slabs Based On Gross Salary")}
        </div>
        <div className="space-y-4">
          {slabs.map((slab, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end"
            >
              <FormInput
                title={t("Start Range")}
                placeholder={t("Start Range")}
                value={slab.startRange}
                disabled={true}
              />
              <FormInput
                title={t("End Range")}
                placeholder={t("End Range")}
                value={slab.endRange}
                change={(e) => updateSlabs(index, "endRange", e)}
                name={`slabs[${index}].endRange`}
                error={
                  formik.touched.slabs?.[index]?.endRange &&
                  formik.errors.slabs?.[index]?.endRange
                }
              />
              <FormInput
                title={
                  deductionFrequency === "Monthly" && exceptionMonth !== "None"
                    ? t("Monthly Tax Amount")
                    : deductionFrequency === "Half-Yearly"
                    ? t("Half-Yearly Tax Amount")
                    : t("Yearly Tax Amount")
                }
                placeholder={
                  deductionFrequency === "Monthly" && exceptionMonth !== "None"
                    ? t("Monthly Tax Amount")
                    : deductionFrequency === "Half-Yearly"
                    ? t("Half-Yearly Tax Amount")
                    : t("Yearly Tax Amount")
                }
                value={slab.taxAmount}
                change={(e) => {
                  const valuedata = e.replace(/[^0-9]/g, "");
                  updateSlabs(index, "taxAmount", valuedata);
                }}
                name={`slabs[${index}].taxAmount`}
                error={
                  formik.touched.slabs?.[index]?.taxAmount &&
                  formik.errors.slabs?.[index]?.taxAmount
                }
                // type="number"
              />
              {deductionFrequency === "Monthly" &&
                exceptionMonth !== "None" && (
                  <FormInput
                    title={t("Exception Month Tax Amount")}
                    placeholder={t("Exception Month Tax Amount")}
                    value={slab.exceptionMonthTaxAmount}
                    change={(e) => {
                      const valuedata = e.replace(/[^0-9]/g, "");
                      updateSlabs(index, "exceptionMonthTaxAmount", valuedata);
                    }}
                    name={`slabs[${index}].exceptionMonthTaxAmount`}
                    error={
                      formik.touched.slabs?.[index]?.exceptionMonthTaxAmount &&
                      formik.errors.slabs?.[index]?.exceptionMonthTaxAmount
                    }
                    // type="number"
                  />
                )}
              {index > 0 && (
                <IoMdTrash
                  className="cursor-pointer text-red-500 ml-2"
                  onClick={() => deleteSlab(index)}
                />
              )}
            </div>
          ))}
        </div>
        <div
          className="relative flex gap-3 items-center px-[5px] py-[10px]"
          onClick={addSlab}
        >
          <IoMdAdd className="group hover:bg-primary hover:text-white bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium cursor-pointer" />
          <p className="text-xs font-medium cursor-pointer dark:text-white">
            {t("Additional Slab")}
          </p>
        </div>
      </FlexCol>
    </DrawerPop>
  );
};

export default EmpProfessionalTax;
