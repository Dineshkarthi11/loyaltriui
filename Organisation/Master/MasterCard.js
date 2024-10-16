import React, { useEffect, useState } from "react";
import { CompaniesData } from "../../common/DataArrays"; //DEMO COMPANY DATA
import Breadcrumbs from "../../common/BreadCrumbs";
import FormInput from "../../common/FormInput";
import ButtonClick from "../../common/Button";

// IMAGE
import Clogo from "../../../assets/images/clogo.jpeg";
import axios from "axios";
import API from "../../Api";
import { Card, Dropdown } from "antd";
import { IoMdArrowForward } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { RxDotFilled } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { LuListFilter } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { getCompanyList } from "../../common/Functions/commonFunction";

const MasterCard = ({ CompanyID = () => {}, path = [] }) => {
  const [organisationId, setOrganisationId] = useState(
    localStorage.getItem("organisationId")
  );
  const navigate = useNavigate();

  const breadcrumbItems = [{ label: path[0], url: "" }, { label: path[1] }];
  const [companyList, setCompanyList] = useState();
  const [setSearchValue, setsetSearchValue] = useState();

  const getCompany = async () => {
    const result = await getCompanyList(organisationId);
    setCompanyList(result);
  };
  useEffect(() => {
    setOrganisationId(localStorage.getItem("organisationId"));
    getCompany();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        <div>
          <Breadcrumbs items={breadcrumbItems} />
          <p className="para">
            Coordinates the planning, execution, and completion of projects...
          </p>
        </div>
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
          {/* SEARCH BOX  */}
          <FormInput
            placeholder="Search"
            value=""
            icon={<CiSearch className=" dark:text-white" />}
            className="w-full mt-0 md:w-auto"
            error=""
            onSearch={(value) => {
              setSearchValue(value);
            }}
          />
          <div>
            {/* FILTER DROPDOW FOR SERACH  */}

            <ButtonClick
              className=""
              buttonName="Filters"
              BtnType="default"
              icon={<LuListFilter size={20} />}
            />
          </div>
          <ButtonClick className="" buttonName="Add Company" BtnType="Add" />
        </div>
      </div>
      <div className="grid gap-6 grid-col-1 sm:grid-cols-2 xl:grid-cols-3 4xl:grid-cols-4 6xl:grid-cols-5">
        {companyList?.map((company) => (
          <Card
            className="flex flex-col w-full gap-4 group"
            bodyStyle={{ padding: 12 }}
            onClick={() => {
              CompanyID(company.companyId);
              navigate(`/master/${company.companyId}`);
            }}
            hoverable
            key={company.companyId}
          >
            <div className="flex items-center justify-between">
              <div className="overflow-hidden rounded-md basis-12 companyLogo">
                <img
                  src={company?.logo ? company?.logo : Clogo}
                  alt=""
                  className="object-cover object-center w-full h-full"
                />
              </div>
              <div className="w-6 h-6 overflow-hidden transition-all duration-300 border rounded-full group-hover:bg-primary border-primary group-hover:text-white text-primary vhcenter">
                <IoMdArrowForward />
              </div>
            </div>
            <div className="mt-2 mb-2 v-divider"></div>
            <div className="flex flex-col gap-3">
              <p className="text-xl font-semibold dark:text-white">
                {company?.company ? company?.company : "Company Name"}
              </p>
              <div className="flex gap-1.5 items-center dark:text-white opacity-80">
                <CiLocationOn />
                <p className="text-xs font-medium">
                  {company.address ? company.address : "Company Address Here"}
                </p>
              </div>
              <div className="flex justify-between">
                <a
                  href={company.url}
                  target="blank"
                  className="text-sm font-normal truncate text-primary"
                >
                  {company.url ? company.url : "www.companyname.com"}
                </a>
                <div
                  className={`${
                    company.isActive === "1"
                      ? " bg-emerald-100 text-emerald-600"
                      : " bg-rose-100 text-rose-600"
                  } rounded-full px-3 py-[2px] w-fit font-medium text-sm vhcenter flex-nowrap`}
                >
                  <RxDotFilled className="text-lg" />
                  {company.isActive === "1" ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default MasterCard;
