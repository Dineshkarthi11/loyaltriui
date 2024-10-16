import React, { useEffect, useState } from "react";
import { Button, Dropdown, message, Space, Menu } from "antd";
import { RiDraggable } from "react-icons/ri";
import Clogo from "../../assets/images/clogo.jpeg";
import { MdKeyboardArrowRight, MdUnfoldMore } from "react-icons/md";
import { PiDotOutlineFill, PiDotsSixVerticalBold } from "react-icons/pi";
import API, { action } from "../Api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { companyIdSet } from "../../Redux/slice";
import { IoIosArrowForward } from "react-icons/io";
import { getCompanyList } from "../common/Functions/commonFunction";

const onClick = ({ key }) => {
  message.info(`Click on item ${key}`);
};

const SelectCompany = () => {
  const dispatch = useDispatch();
  const [selectedItemId, setSelectedItemId] = useState(
    localStorage.getItem("companyId")
  );
  const [companyData, setCompanyData] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState();
  const [organisationId, setOrganisationId] = useState(
    localStorage.getItem("organisationId")
  );
  const [companyIds, setCompanyIds] = useState(
    JSON.parse(localStorage.getItem("LoginData"))
  );

  const selectedCompany = companyData?.find(
    (item) => parseInt(item?.companyId) === parseInt(selectedItemId)
  );

  const handleItemClick = (itemId) => {
    localStorage.setItem("companyId", itemId);
    dispatch(companyIdSet(itemId));
    setSelectedItemId(itemId);
  };

  const onClick = ({ key }) => {
    const selected = companyData?.find((item) => item.companyId === key);
    setSelectedLabel(companyData?.company || "");
    message.success({
      content: (
        <span>
          <span className="capitalize ">{selected?.company}</span>
          {` Selected`}
        </span>
      ),
      duration: 2,
    });
    // console.log(selected, "selected company name ");
  };

  const getList = async () => {
    const result = await getCompanyList(organisationId);
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
              result?.filter(
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

  useEffect(() => {
    setOrganisationId(localStorage.getItem("organisationId"));
    getList();
    // console.log(companyData, "company");
  }, []);

  return (
    <Dropdown
      trigger={["hover"]}
      overlayStyle={{ top: "20px" }}
      overlay={
        <Menu
          onClick={onClick}
          selectedKeys={[selectedItemId]}
          selectable
          defaultSelectedKeys={selectedItemId}
          className="!ml-5 max-h-96 overflow-auto dark:bg-secondaryDark"
        >
          {companyData
            ?.sort((a, b) => a.company.localeCompare(b.company))
            ?.map((item) => (
              // <Menu.Item key={item.key}>{item.label}</Menu.Item>
              <Menu.Item
                key={item?.companyId}
                onClick={() => {
                  handleItemClick(item.companyId);
                  window.location.reload();
                }}
                className=" !m-[2px] 2xl:!m-1 "
              >
                <Space>
                  <RiDraggable />
                  <div className="overflow-hidden rounded-lg w-7 2xl:w-8 h-7 2xl:h-8">
                    {item?.logo ? (
                      <img src={item?.logo} alt="" />
                    ) : (
                      <img src={Clogo} alt="" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-semibold capitalize 2xl:text-sm leading-none dark:text-white">
                      {item?.company}
                    </p>
                    <p className="flex items-center gap-1 text-[7px] 2xl:text-[10px] text-grey">
                    <span>{item?.url}</span> 
                  </p> 
                    {/* <p className="flex items-center gap-1 para !text-[9px] 2xl:!text-xs">
                    <span>Team Plan</span> <PiDotOutlineFill />{" "}
                    <span>2.5K</span> members{" "}
                  </p>  */}
                  </div>
                </Space>
              </Menu.Item>
            ))}
        </Menu>
      }
      placement="right" // Dropdown will appear on the right side
    >
      <Button
        value={selectedLabel}
        onClick={(e) => e.preventDefault()}
        className="bg-secondaryWhite h-fit dark:bg-secondaryDark rounded-[10px] py-1.5 px-1.5 2xl:px-2 2xl:py-2"
      >
        {selectedCompany && (
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 overflow-hidden rounded-full 2xl:w-9 2xl:h-9 shrink-0">
                {selectedCompany?.logo ? (
                  <img
                    src={selectedCompany?.logo}
                    alt=""
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

            <div className="flex flex-col items-start">
            <h1
                className="text-[10px] font-semibold capitalize truncate 2xl:text-sm dark:text-white"
                title={selectedCompany?.company}
              >
                {selectedCompany?.company}
                {/* {console.log(selectedCompany)} */}
              </h1>
              <p className="flex items-center gap-1 text-[7px] 2xl:text-[10px] text-grey">
                    <span>{selectedCompany?.url}</span> 
                  </p> 
            </div>
            </div>
            <MdKeyboardArrowRight size={18} className="opacity-50 " />
            {/* <MdUnfoldMore size={18} /> */}
          </div>
        )}
      </Button>
    </Dropdown>
  );
};

export default SelectCompany;
