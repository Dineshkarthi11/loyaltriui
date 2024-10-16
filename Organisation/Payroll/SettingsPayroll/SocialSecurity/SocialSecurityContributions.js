import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ButtonClick from "../../../../common/Button";
import SearchBox from "../../../../common/SearchBox";
import { CiSearch } from "react-icons/ci";
import { motion } from "framer-motion";
import CreateSocialSecurity from "./CreateSocialSecurity";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { PiFlag, PiPencilSimpleLine, PiUsers } from "react-icons/pi";
import { Tooltip, Skeleton } from "antd"; // Import Skeleton from antd
import Heading from "../../../../common/Heading";
import { NoData } from "../../../../common/SVGFiles";

export default function SocialSecurityContributions() {
  const [updateId, setUpdateId] = useState(null);
  const [show, setShow] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const [socialSecurityContribution, setSocialSecurityContribution] = useState(
    []
  );
  const [socialSecurityContributionName, setSocialSecurityContributionName] =
    useState("");
  const [originalData, setOriginalData] = useState([]);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true); // New state for loading

  const handleShow = (id) => {
    setShow(true);
    setUpdateId(id);
  };

  const handleClose = () => {
    setShow(false);
    setOpenPop(false);
    setUpdateId(null);
  };

  const { t } = useTranslation();

  useEffect(() => {
    getSocialSecurityContributions();
  }, []);

  const getSocialSecurityContributions = async () => {
    setLoading(true); // Start loading
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_SocialSecurityContributions_RECORDS,
        {
          companyId: companyId,
        }
      );
      console.log(result?.result, "data of get all getAllSSContributions list");

      setOriginalData(result?.result);
      setSocialSecurityContribution(result?.result);
      setSocialSecurityContributionName(
        result?.result[0].socialSecurityContributionName
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (searchValue === "") {
      setSocialSecurityContribution(originalData);
    } else {
      const filteredData = originalData.filter((item) =>
        item.socialSecurityContributionName
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
      setSocialSecurityContribution(filteredData);
    }
  }, [searchValue, originalData]);

  return (
    <div className="flex flex-col gap-5">
      <Heading
        title={t("Social Security Contributions")}
        description={t("Main_Desc_social")}
      />
      <div className="flex flex-col justify-between gap-5 lg:items-center sm:flex-row">
        <SearchBox
          data={socialSecurityContribution}
          placeholder={t("Search_placeholder")}
          value={searchValue}
          icon={<CiSearch className="dark:text-white" />}
          className="mt-0 w-ful md:w-auto"
          error=""
          change={(value) => setSearchValue(value)}
          onSearch={(filteredData) => {
            setSocialSecurityContribution(filteredData);
          }}
        />
        <div className="flex gap-5 sm:flex-row">
          <ButtonClick
            buttonName={"Create SSC"}
            handleSubmit={() => {
              setShow(true);
            }}
            BtnType="Add"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {loading ? (
          <Skeleton active /> // Display Skeleton while loading
        ) : socialSecurityContribution.length === 0 ? (
          // <div className="text-center text-gray-500">
          //   {t("No data available")}
          // </div>
          <div className="col-span-3 m-auto">
            <NoData />
          </div>
        ) : (
          socialSecurityContribution.map((item) => (
            <div
              key={item.socialSecurityContributionId}
              className="divide-y divide-black/10 dark:divide-white/20 rounded-lg borderb text-sm md:text-[10px] 2xl:text-sm dark:text-white transition-all duration-300 hover:border-primary"
            >
              <div className="flex items-center justify-between p-2 2xl:p-3">
                <h1 className="font-semibold text-black capitalize dark:text-white">
                  {item.socialSecurityContributionName}
                </h1>
                <Tooltip title="Edit" placement="top">
                  <button
                    className="rounded-full bg-[#EDEDED] dark:bg-slate-500 opacity-60 size-7 vhcenter 2xl:size-[30px] hover:bg-primaryalpha/10 hover:opacity-100 hover:text-primary transition duration-300"
                    onClick={() =>
                      handleShow(item.socialSecurityContributionId)
                    }
                  >
                    <PiPencilSimpleLine className="size-3.5 2xl:size-4 font-bold" />
                  </button>
                </Tooltip>
              </div>
              <div className="flex flex-col gap-3.5 p-2 2xl:p-3">
                <div className="flex items-center justify-between">
                  <p className="text-gray-500">Employee Contribution</p>
                  <p className="">{item.employeeContribution}%</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-500">Employer Contribution</p>
                  <p className="">{item.employerContribution}%</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-500">Wage Max Limit</p>
                  <p className="">{item.wageMaxLimit || " "}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-500">
                    Renewal at the start of the year
                  </p>
                  <p className="">
                    {item.yearStartRenewel === "1" ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 justify h-11">
                <div className="flex items-center gap-2 p-2 text-xs md:text-[8px] 2xl:text-xs font-semibold 2xl:p-3 dark:text-white">
                  <PiUsers className="text-sm 2xl:text-lg" />{" "}
                  <span>{`${item.employeeCount} ${
                    item.employeeCount > 1 ? "Employees" : "Employee"
                  }`}</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 text-xs md:text-[8px] 2xl:text-xs font-semibold 2xl:p-3 dark:text-white">
                  <PiFlag className="text-sm 2xl:text-lg" />
                  {`For ${item.countryName}${
                    item.countryName === "India" ? "n" : ""
                  } Citizens`}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {show && (
        <motion.div initial="hidden" animate="visible">
          <CreateSocialSecurity
            open={show}
            close={(e) => {
              setShow(e);
              setUpdateId(null);
              handleClose();
            }}
            refresh={() => {
              getSocialSecurityContributions();
            }}
            openPolicy={openPop}
            updateId={updateId}
          />
        </motion.div>
      )}
    </div>
  );
}
