import React, { useEffect, useMemo, useRef, useState } from "react";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import FormInput from "../../common/FormInput";
import TextArea from "../../common/TextArea";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";
import API, { action } from "../../Api";
import { Tooltip } from "antd";
import Dropdown from "../../common/Dropdown";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function AddState({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
}) {
  const { t } = useTranslation();
  const [addState, setAddState] = useState(open);
  const handleClose = () => {
    close(false);
  };
  const counterRef = useRef(1);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [functionRender, setFunctionRender] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const handleDeleteCondition = (index) => {
    setEvaluation((prevEvaluation) =>
      prevEvaluation.filter((_, i) => i !== index)
    );
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
  useMemo(
    () =>
      setTimeout(() => {
        addState === false && close(false);
      }, 800),
    [addState]
  );

  const stateDynamicValue = [
    {
      id: 1,
      city: "",
      inputName: "cityName",
      cityId: "",
    },
  ];
  const [evaluation, setEvaluation] = useState(stateDynamicValue);

  useEffect(() => {
    if (!updateId) setEvaluation(stateDynamicValue);
  }, []);

  const initialEvaluationValues = stateDynamicValue.reduce((ac, each) => {
    ac[each.inputName] = "";
    return ac;
  }, {});

  const initialValuesupdate = updateId
    ? stateDynamicValue.length > 0
      ? stateDynamicValue?.reduce((ac, each) => {
          cityList?.forEach((city) => {
            ac[each.inputName] = city.city;
          });
          return ac;
        }, {})
      : {}
    : stateDynamicValue?.reduce((ac, each) => {
        ac[each.inputName] = "";
        return ac;
      }, {});
  // console.log({ ...initialEvaluationValues }, "evaluationValue");

  const initialValues = {
    country_id: null,
    stateName: "",
    stateId: "",
    description: "",
    // cityName: "",
    // ...initialValuesupdate,
    ...initialEvaluationValues,
  };
  const validationSchema = yup.object().shape({
    country_id: yup.string().required("Country is required"),
    stateName: yup.string().required("State is required"),
    description: yup.string().required("Description is required"),
    // Define validation for each city dynamically
    ...evaluation.reduce((schema, condition) => {
      schema[condition.inputName] = yup.string().required(`City is required`);
      return schema;
    }, {}),
  });
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema,
    onSubmit: async (e) => {
      setLoading(true);

      try {
        if (updateId) {
          const result = await action(API.UPDATE_STATE, {
            id: updateId,
            StateModel: {
              stateName: e.stateName,
              stateId: e.stateId,
              country_id: e.country_id,
              createdBy: "1",
              description: e.description,
            },
            CityModel: evaluation?.map((each) => ({
              city: e[each.inputName],
              cityId: e[each.cityId] || null,
            })),
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              setFunctionRender(!functionRender);
              refresh();
              setLoading(false);
            }, 1000);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await action(API.ADD_STATE, {
            StateModel: {
              stateName: e.stateName,
              country_id: e.country_id,
              createdBy: "1",
              description: e.description,
            },
            CityModel: evaluation?.map((each) => ({
              city: e[each.inputName],
            })),
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            formik.resetForm();
            setTimeout(() => {
              handleClose();
              refresh();
              setLoading(false);
            }, 1000);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        }
      } catch (error) {
        openNotification("error", "Failed", error);
        setLoading(false);
      }
    },
  });

  const getIdBasedStateRecords = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await action(API.GET_STATE_BY_ID, { id: e });
      formik.setFieldValue("country_id", parseInt(result.result.country_id));
      formik.setFieldValue("stateName", result.result.stateName);
      formik.setFieldValue("stateId", result.result.stateId);
      formik.setFieldValue("description", result.result.description);
      // console.log(typeof result.data.country_id);
      setCityList(result.result.cities);
      setupdateBtn(true);
      result.result.cities?.map((data, index) =>
        Object.keys(data).map((item, i) => {
          formik.setFieldValue(item === "city" && item + index, data[item]);
          formik.setFieldValue("cityId" + index, data["cityId"]);
        })
      );
      // result.result.cities?.map((data, index) =>
      //   Object.keys(data).map((item, i) =>
      //     console.log(item + index, data[item])
      //   )
      // );
      setEvaluation(
        result.result.cities?.map((data, index) => ({
          id: index,
          city: "",
          inputName: Object.keys(data)[1] + index,
          cityId: Object.keys(data)[0] + index,
        }))
      );
    }
  };

  useEffect(() => {
    getIdBasedStateRecords(updateId);
  }, [updateId]);

  // const UpdateIdBasedState = async () => {
  //   console.log(API.UPDATE_STATE, {
  //     id: updateId,
  //     country_id: formik.values.country_id,
  //     stateName: formik.values.stateName,
  //     description: formik.values.description,
  //   });
  //   const result = await action(API.UPDATE_STATE, {
  //     id: updateId,
  //     country_id: formik.values.country_id,
  //     stateName: formik.values.stateName,
  //     description: formik.values.description,
  //   });
  //   if (result.status === 200) {
  //     openNotification("success", "Successful", result.message);
  //     setTimeout(() => {
  //       handleClose();
  //       setFunctionRender(!functionRender);
  //       // getRecords();
  //       refresh();
  //     }, 1500);
  //   } else if (result.status !== 200) {
  //     openNotification("error", "Something went wrong ", result.message);
  //   }
  //   console.log(result);
  // };

  const getCountryList = async () => {
    // console.log(API.HOST + API.GET_COUNTRY_LIST);
    const result = await action(API.GET_COUNTRY_ALL_LIST, { isActive: 1 });

    if (result) {
      setCountryList(
        result?.result?.map((each) => ({
          value: each?.countryId,
          label: each?.countryName,
        }))
      );
    }
  };
  useEffect(() => {
    getCountryList();
  }, []);

  return (
    <DrawerPop
      open={addState}
      close={(e) => {
        // console.log(e);
        handleClose();
      }}
      contentWrapperStyle={{
        width: "540px",
      }}
      handleSubmit={(e) => {
        // console.log(e);
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        // UpdateIdBasedState();
        formik.handleSubmit();
      }}
      header={[
        !UpdateBtn ? t("Create_State") : t("Update_State"),
        !UpdateBtn ? t("Create_New_State") : t("Update_Selected_State"),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className="relative w-full h-full">
        {/* <Dropdown
          title={t("Choose_Country")}
          placeholder={t("Select")}
          change={(e) => {
            formik.setFieldValue("country_id", e);
          }}
          value={formik.values.country_id}
          error={formik.errors.country_id}
          options={country}
        /> */}
        <Dropdown
          title={t("Country")}
          placeholder={t("Choose_Country")}
          value={formik.values.country_id}
          change={(e) => {
            formik.setFieldValue("country_id", e);
          }}
          options={countryList}
          className="text-sm "
          error={formik.values.country_id ? "" : formik.errors.country_id}
          required={true}
        />
        <FormInput
          title={t("State_Name")}
          placeholder={t("State_Name")}
          change={(e) => {
            formik.setFieldValue("stateName", e);
          }}
          value={formik.values.stateName}
          error={formik.values.stateName ? "" : formik.errors.stateName}
          required={true}
        />

        {/* {evaluation && ( */}
        <FlexCol>
          {
            // !stateDynamicValue
            //   ?
            evaluation?.map((condition, index) => (
              <div
                key={index}
                className={`relative items-end grid grid-cols-12 gap-4`}
              >
                <div
                  className={`${index === 0 ? "col-span-12" : " col-span-11"}`}
                >
                  <FormInput
                    key={condition.id}
                    title={t("City") + (index + 1)}
                    placeholder={t("City") + (index + 1)}
                    change={(e) => {
                      formik.setFieldValue(condition.inputName, e);
                      formik.validateField(condition.inputName);
                    }}
                    value={formik.values[condition.inputName]}
                    error={
                      formik.values[condition.inputName]
                        ? ""
                        : formik.errors[condition.inputName]
                    }
                    required={true}
                  />
                </div>
                <div className="col-span-1">
                  {index !== 0 && (
                    <Tooltip placement="top" title="Delete">
                      <MdDelete
                        className="hover:bg-primary cursor-pointer hover:text-white text-rose-600 p-1 ml-2 text-[20px] bg-[#F4F4F4] rounded-md dark:bg-black"
                        onClick={() => handleDeleteCondition(index)}
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            ))
          }
          {/* // : stateDynamicValue?.map((condition, index) => (
            //     <div
            //       key={index}
            //       className={`relative items-end grid grid-cols-12 gap-4`}
            //     >
            //       <div
            //         className={`${
            //           index === 0 ? "col-span-12" : " col-span-11"
            //         }`}
            //       >
            //         <FormInput
            //           key={condition.id}
            //           title={t("City") + (index + 1)}
            //           placeholder={t("Enter City")}
            //           change={(e) => {
            //             formik.setFieldValue(condition.city, e);
            //             console.log(formik.values, condition.city);
            //           }}
            //           value={formik.values[condition.city]}
            //           required={true}
            //         />
            //       </div>
            //       <div className="col-span-1">
            //         {index !== 0 && (
            //           <Tooltip placement="top" title="Delete">
            //             <MdDelete
            //               className="hover:bg-primary cursor-pointer hover:text-white text-rose-600 p-1 ml-2 text-[20px] bg-[#F4F4F4] rounded-md dark:bg-black"
            //               onClick={() => handleDeleteCondition(index)}
            //             />
            //           </Tooltip>
            //         )}
            //       </div>
            //     </div>
            //   ))} */}

          <div
            className="relative flex gap-3  items-center px-[5px] py-[10px]"
            onClick={(e) => {
              const newCityName = `cityName${
                Object.keys(formik.values).filter((key) =>
                  key.startsWith("cityName")
                ).length + 1
              }`;
              setEvaluation((prevEvaluation, index) => [
                ...prevEvaluation,
                {
                  id: counterRef.current++, // Increment the counter for unique IDs
                  city: "",
                  inputName: newCityName + e.clientX, // `cityName${counterRef.current}`, // Use counter for inputName
                },
              ]);
            }}
          >
            <IoMdAdd className="group hover:bg-primary  hover:text-white  bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium cursor-pointer" />
            <p className="text-xs font-medium cursor-pointer dark:text-white">
              {t("Add City")}
            </p>
          </div>
        </FlexCol>
        {/* // )} */}

        <div className="pt-[10px]">
          <TextArea
            title={t("Description")}
            placeholder={t("Enter_Description")}
            change={(e) => {
              formik.setFieldValue("description", e);
            }}
            value={formik.values.description}
            error={formik.values.description ? "" : formik.errors.description}
            required={true}
          />
        </div>
      </FlexCol>
    </DrawerPop>
  );
}
