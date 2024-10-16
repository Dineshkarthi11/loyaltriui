import React, { useEffect, useState } from "react";
import { Dropdown, theme, message } from "antd";

import Clogo from "../../assets/images/clogo.jpeg";
import { useDispatch } from "react-redux";
import { companyIdSet } from "../../Redux/slice";
import { PiCaretDown, PiCheck } from "react-icons/pi";
import { getCompanyList } from "../common/Functions/commonFunction";
import { useLocation } from "react-router-dom";
import Item from "antd/es/list/Item";

const SelectCompany = ({ selectCompanyData = () => {} }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [selectedItemId, setSelectedItemId] = useState(
    localStorage.getItem("companyId")
  );
  const [companyData, setCompanyData] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState();
  const [organisationId, setOrganisationId] = useState(
    localStorage.getItem("organisationId")
  );
  const selectedCompany = companyData?.find(
    (item) => parseInt(item.companyId) === parseInt(selectedItemId)
  );
  const [companyIds, setCompanyIds] = useState(
    JSON.parse(localStorage.getItem("LoginData"))
  );

  useEffect(() => {
    // Fetch data from localStorage
    const companyId = localStorage.getItem("companyId");
    const organisationId = localStorage.getItem("organisationId");

    // If companyId is available in localStorage, set it to state
    if (companyId) {
      setSelectedItemId(companyId);
    }

    // If organisationId is available in localStorage, fetch company data
    if (organisationId) {
      setOrganisationId(organisationId);
      getList(organisationId);
    }
  }, []);

  const pathname = location.pathname;

  const handleItemClick = (itemId, render) => {
    dispatch(companyIdSet(itemId));
    setSelectedItemId(itemId);
    selectCompanyData(itemId);
    localStorage.setItem("companyId", itemId);

    // Check if the pathname starts with "/employeeProfile/"
    if (pathname.startsWith("/employeeProfile/")) {
      // Navigate to the /employees page
      window.location.href = "/employees";
      // window.location.reload();
    } else if (render === "click") {
      window.location.reload();
    }
  };

  const onClick = ({ key }) => {
    const selected = companyData?.find((item) => item.companyId === key);
    // console.log(selected);
    setSelectedLabel(selected?.company || "");
    handleItemClick(key, "click");
    message.success({
      content: (
        <span>
          <span className="capitalize ">{selectedLabel}</span>
          {` Selected`}
        </span>
      ),
      duration: 2,
    });
  };
  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem("companylogo", selectedCompany?.logo);
      console.log(selectedCompany, "sss");
    }
  }, [selectedCompany]);

  // Assuming you want to set the logo of the first company in local storage

  // Function to fetch company data
  const getList = async () => {
    const result = await getCompanyList(organisationId);
    const filteredCompany = companyIds?.userData?.companyId
      ?.map(
        (each) =>
          result?.filter(
            (item) => parseInt(item.companyId) === parseInt(each)
          )[0]
      )
      .filter(Boolean);
    console.log(filteredCompany[0]?.logo, "jjj");
    if (filteredCompany && filteredCompany[0]?.logo) {
      localStorage.setItem("companylogo", filteredCompany[0]?.logo);
    }

    // localStorage.setItem("companylogo", companyIds?.userData?.companyId
    //   ?.map(
    //     (each) =>
    //       result?.filter(
    //         (item) =>
    //           parseInt(item.companyId) === parseInt(each) ? { ...item } : null // ) //   item //   // companyData, // setCompanyData(
    //       )[0]
    //   )
    //   .filter(Boolean));
    // console.log(result, "company list returned data");
    // localStorage.setItem(
    //   "companyId",
    //   companyIds?.userData?.companyId?.map(
    //     (each) =>
    //       result.filter(
    //         (item) => parseInt(item.companyId) === parseInt(each) && { ...item } // ) //   item //   // companyData, // setCompanyData(
    //       )[0]
    //   )[0]?.companyId
    // );
    // .....................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // console.log(
    //   result.map(
    //     (each) =>
    //       companyIds?.userData?.companyId?.includes(each?.companyId) && each
    //   )
    // );
    // console.log(
    //   companyIds?.userData?.companyId
    //     ?.map(
    //       (each) =>
    //         result.filter(
    //           (item) =>
    //             parseInt(item.companyId) === parseInt(each) ? { ...item } : null // ) //   item //   // companyData, // setCompanyData(
    //         )[0]
    //     )
    //     .filter(Boolean),
    //   "joiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
    // );
    // console.log(
    //   companyIds?.userData?.companyId
    //     ?.map(
    //       (each) =>
    //         result.filter((item) =>
    //           parseInt(item.companyId) === parseInt(each) ? { ...item } : null
    //         )[0]
    //       // Filter out null values
    //     )
    //     .filter(Boolean)[0].companyId
    // );
    // .....................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    setCompanyData(
      // companyIds?.userData?.companyId?.map(
      //   (each) =>
      //     result.filter(
      //       (item) => parseInt(item.companyId) === parseInt(each) && { ...item } // ) //   item //   // companyData, // setCompanyData(
      //     )[0]
      // )

      companyIds?.userData?.companyId
        ?.map(
          (each) =>
            result?.filter(
              (item) =>
                parseInt(item.companyId) === parseInt(each) ? { ...item } : null // ) //   item //   // companyData, // setCompanyData(
            )[0]
        )
        .filter(Boolean)
      //   // result.map(
      //   //   (each) =>
      //   //     companyIds?.userData?.companyId?.includes(each.companyId) && each
      //   // )
      //   companyIds?.userData?.companyId?.map((each) =>
      //     result.filter((item) => parseInt(item.companyId) === each && item)
      //   )
      //   // companyIds?.userData?.companyId.map((item) =>
      //   //   result.map((each) => each?.companyId === item && each)
      //   // )
    );
    // console.log(
    //   companyIds?.userData?.companyId?.map(
    //     (each) =>
    //       result.filter(
    //         (item) => parseInt(item.companyId) === parseInt(each) && { ...item } // ) //   item //   // companyData, // setCompanyData(
    //       )[0]
    //   )[0]?.companyId,
    //   "daa data"
    // );
    if (selectedItemId === null) {
      handleItemClick(
        // result.map(
        //   (each) =>
        //     companyIds?.userData?.companyId?.includes(each?.companyId) && each
        // )[0]?.companyId
        companyIds?.userData?.companyId
          ?.map(
            (each) =>
              result.filter(
                (item) =>
                  parseInt(item.companyId) === parseInt(each)
                    ? { ...item }
                    : null // ) //   item //   // companyData, // setCompanyData(
              )[0]
          )
          .filter(Boolean)[0]?.companyId
        // companyIds?.userData?.companyId?.map(
        //   (each) =>
        //     result.filter(
        //       (item) =>
        //         parseInt(item.companyId) === parseInt(each) && { ...item } // ) //   item //   // companyData, // setCompanyData(
        //     )[0]
        // )[0]?.companyId
      );
    }
    // console.log(companyData, "company");
  };

  const contentStyle = {
    // backgroundColor: token.colorBgElevated,
    // borderRadius: "6px",
    // boxShadow: token.boxShadowSecondary,
  };

  const menuStyle = {
    minWidth: "203px",
    maxHeight: "400px",
    overflow: "auto",
    borderRadius: "12.106px",
    boxShadow:
      "0px 29.49px 46.341px 0px rgba(6, 6, 6, 0.10), 0px 29.49px 46.341px 0px rgba(6, 6, 6, 0.10)",
  };
  // console.log(companyData, "companyData");
  const items = companyData?.map((company) => ({
    key: company.companyId.toString(),
    label: (
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="overflow-hidden rounded-full size-[28px] 2xl:size-[30px]">
            {company?.logo ? (
              <img
                src={company?.logo}
                alt={Clogo}
                className="object-cover object-center w-full h-full"
              />
            ) : (
              <img
                src={Clogo}
                alt=""
                className="object-cover object-center w-full h-full"
              />
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-[11px] font-semibold truncate capitalize 2xl:text-xs dark:text-white">
              {company.company}
            </p>
            <p className="text-[7px] 2xl:text-[10px] text-grey">
              <span>{company.url}</span>
            </p>
          </div>
        </div>
        {selectedItemId && company.companyId.toString() === selectedItemId && (
          <div className="text-primary dark:text-white">
            <PiCheck size={16} />
          </div>
        )}
      </div>
    ),
  }));

  return (
    <Dropdown
      menu={{
        items,
        onClick: onClick,
        selectable: true,
        selectedKeys: [selectedItemId?.toString() || ""],
        defaultSelectedKeys: [selectedItemId?.toString() || ""],
      }}
      trigger={["hover"]}
      dropdownRender={(menu) => (
        <div style={contentStyle}>
          {React.cloneElement(menu, {
            style: menuStyle,
          })}
        </div>
      )}
    >
      <button
        onClick={(e) => e.preventDefault()}
        title={selectedCompany?.company || ""}
        className="borderb bg-White relative dark:bg-dark2 h-8 2xl:h-10 rounded-full flex items-center p-1 2xl:p-[5px] pr-4 2xl:pr-7 sm:w-14 md:min-w-32 2xl:min-w-[188px] overflow-hidden"
      >
        {selectedCompany && (
          <div className="flex items-center justify-between overflow-hidden">
            <div className="flex items-center w-full gap-1.5 2xl:gap-2">
              <div className="2xl:size-[28px] size-[23px] rounded-full overflow-hidden shrink-0">
                {selectedCompany?.logo ? (
                  <img
                    src={selectedCompany?.logo}
                    alt={Clogo}
                    className="object-cover object-center w-full h-full"
                  />
                ) : (
                  <img
                    src={Clogo}
                    alt=""
                    className="object-cover object-center w-full h-full"
                  />
                )}
              </div>
              <p className="text-[10px] 2xl:text-sm font-semibold truncate opacity-70 dark:opacity-100 dark:text-white md:block">
                {selectedCompany?.company || ""}
              </p>
            </div>
            <div className="absolute -translate-y-1/2 right-0.5 2xl:right-2 top-1/2">
              <PiCaretDown size={16} className="opacity-50 dark:text-white" />
            </div>
          </div>
        )}
      </button>
    </Dropdown>
  );
};
export default SelectCompany;
