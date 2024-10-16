import React, { useEffect, useState } from "react";
import ButtonClick from "../../common/Button";
import axios from "axios";
import API from "../../Api";
import { useTranslation } from "react-i18next";
import { PiPlus } from "react-icons/pi";
import { fetchCompanyDetails } from "../../common/Functions/commonFunction";



const CardPersonal = ({
  data,
  clickDrower = () => { },
  ClickAddSocialLink = () => { }
}) => {
  const { t } = useTranslation();

  const [companyDetails, setCompanyDetails] = useState(null);


  const getCompanyIdFromLocalStorage = () => {
    return localStorage.getItem("companyId");
  };

  useEffect(() => {
    const companyId = getCompanyIdFromLocalStorage();
    if (companyId) {
      fetchCompanyDetails(companyId).then((details) => setCompanyDetails(details));
    }

    const handleStorageChange = () => {
      const companyId = getCompanyIdFromLocalStorage();
      if (companyId) {
        fetchCompanyDetails(companyId).then((details) => setCompanyDetails(details));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  const renderInfo = (label, value, title) => (
    <div className="flex flex-col gap-1">
      <p className="para !font-medium">{label}</p>
      {title === "Social Links" ? (
        <>
          {(() => {
            const link = value.startsWith("http") ? value : `http://${value}`;
            return (
              <a
                href={link}
                title={label}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(link);
                }}
              >
                <p className="para !font-medium !text-black dark:!text-white hover:underline hover:text-primary">{value}</p>
              </a>
            );
          })()}
        </>
      ) : (
        <p className="para !font-medium !text-black dark:!text-white">{value}</p>
      )}

    </div >
  );
  // const getCountry = async () => {
  //   try {
  //     const result = await axios.get(API.HOST + API.GET_COUNTRY_LIST);
  //     result.data.tbl_country.map(
  //       (each) => {
  //         if (each.countryId === address?.countryId)
  //           setCountry(each.countryName);
  //       }
  //       // ({
  //       //   label: each.countryName,
  //       //   value: each.countryId,
  //       // }))
  //     );

  //     console.log(result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getCity = async () => {
  //   try {
  //     const result = await axios.get(API.HOST + API.GET_CITY_LIST);
  //     result.data.tbl_cityLocality.map(
  //       (each) => {
  //         if (each.cityLocalityId === address?.cityId)
  //           setCity(each.cityLocalityName);
  //       }
  //       //  ({
  //       //   label: each.cityLocalityName,
  //       //   value: each.cityLocalityId,
  //       // })
  //     );

  //     console.log(result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getState = async () => {
  //   try {
  //     const result = await axios.get(API.HOST + API.GET_STATE_LIST);
  //     result.data.tbl_stateProvince.map(
  //       (each) => {
  //         if (each.stateProvinceId === address?.stateId)
  //           setState(each.stateProvinceName);
  //       }
  //       // ({
  //       //   label: each.stateProvinceName,
  //       //   value: each.stateProvinceId,
  //       // }))
  //     );

  //     console.log(result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   getCity();
  //   getCountry();
  //   getState();
  // }, [address]);

  // Employee information object
  // let employeeInfo = {
  //   firstName: "John",
  //   lastName: "Doe",
  //   dateOfBirth: "1990-01-01",
  //   gender: "Male",
  //   nationality: "American",
  //   maritalStatus: "Single",
  //   address: {
  //     [t("streetName")]: address?.address,
  //     [t("unitSuite")]: "Apt 456",
  //     [t("city")]: city,
  //     [t("postalCode")]: address?.zipCode,
  //     [t("provinceState")]: state,
  //     [t("country")]: country,
  //   },
  //   contact: {
  //     [t("Personal Mail")]: basic?.email,
  //     [t("Personal Number")]: basic?.phone,
  //     [t("city")]: city,
  //     [t("Postal/ZIP Code")]: address?.zipCode,
  //   },
  // };

  return (
    <>
      {/* <div className="flex flex-col justify-between gap-4 2xl:gap-6 box-wrapper">
        <div className="flex items-center justify-between">
          <p className="subhead">{t("Basic_Information")}</p>
          <ButtonClick buttonName={t("Edit_Details")} />
        </div>
        <div className="v-divider"></div>

        {/* Basic Information *
        {console.log(basic)}
        <div className="grid grid-cols-2 gap-4 2xl:gap-6">
          {renderInfo(t("First_Name"), basic?.firstName)}
          {renderInfo(t("Last_Name"), basic?.lastName)}
          {renderInfo(t("Date_of_Birth"), basic?.dateOfBirth)}
          {renderInfo(t("Gender"), basic?.gender)}
          {/* {renderInfo(t("Nationality"), basic?.nationality)}
          {renderInfo(t("Marital_Status"), basic?.maritalStatus)} *
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 2xl:gap-6 box-wrapper">
        <div className="flex items-center justify-between">
          <p className="subhead">{t("Address_Information")}</p>
          <ButtonClick buttonName={t("Edit_Details")} />
        </div>
        <div className="v-divider"></div>

        {/* Address Information *
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(employeeInfo.address).map(([key, value]) =>
            renderInfo(`${key}`, `${value}`)
          )}
        </div>
      </div> */}

      {data.map((each) => {
        if (
          each.title === "Employment Information" &&
          parseInt(companyDetails?.isPFESIenabled) !== 1
        ) {
          return null;
        }

        return (

          <div className="flex flex-col justify-between gap-4 2xl:gap-6 box-wrapper">
            <div className="flex items-center justify-between">
              <p className="subhead">
                {each.title?.charAt(0).toUpperCase() + each.title?.slice(1)}
              </p>
              {each.edit && (
                <ButtonClick
                  buttonName={t("Edit_Details")}
                  className={"z-0"}
                  handleSubmit={(e) => {
                    // console.log(each.emplyee);
                    clickDrower(each.emplyee, each.title);
                  }}
                />
              )}
            </div>
            <div className="divider-h"></div>

            {each?.title === "Social Links" &&
              Object.keys(each.details).length === 0 ? (
              <div
                className="flex items-center gap-1 2xl:gap-2 cursor-pointer"
                onClick={ClickAddSocialLink}
              >
                <div
                  className={`vhcenter size-8 2xl:size-10 text-grey transition-all duration-300 border rounded-full border-secondaryWhite dark:border-secondaryDark dark:text-white hover:bg-primary hover:text-white bg-primaryalpha/5 text-sm 2xl:text-lg shrink-0`}
                >
                  <PiPlus />
                </div>
                <div className="text-xs hover:text-primary">Add Social Link</div>
              </div>
            ) : (
              <div
                className={`${each.className ? each.className : "grid grid-cols-2"
                  }  gap-6`}
              >
                {Object.entries(each.details).map(([key, value]) =>
                  renderInfo(
                    `${key}`,
                    `${value}`,
                    `${each?.title}`
                  )
                )}
              </div>
            )}
          </div>
        )
      }
      )}
    </>
  );
};

export default CardPersonal;
