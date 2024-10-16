import React, { useEffect, useMemo, useState } from "react";
import FlexCol from "../../common/FlexCol";
import { t } from "i18next";
import Heading from "../../common/Heading";
import Heading2 from "../../common/Heading2";
import ButtonClick from "../../common/Button";
import approvalFlowTypes from "./SampleArray";
import SearchBox from "../../common/SearchBox";
import randomColor from "randomcolor";
import TableAnt from "../../common/TableAnt";
import {
  PiPlus,
  PiPlusBold,
  PiPlusCircleFill,
  PiRanking,
  PiStack,
  PiTreeStructure,
  PiUsersThree,
} from "react-icons/pi";
import { Tooltip } from "antd";
import NewApprovalFlow from "./NewApprovalFlow";
import SelectWithTab from "../../common/SelectWithTab";
import AssignApprovalTemplate from "./AssignApprovalTemplate";
import API, { action } from "../../Api";
import { path } from "d3";

const ApprovalTypes = () => {
  const [approvalFlowTypes, setapprovalFlowTypes] = useState([]);
  const [selectedFlowTypeId, setSelectedFlowTypeId] = useState();

  // approvalFlowTypes[0].typeId
  const [companyId, setcompanyId] = useState(localStorage.getItem("companyId"));
  const [tabledata, setTableData] = useState([]);
  const [updateId, setupdateId] = useState(null);
  const [approveltemplate, setApprovelTemplate] = useState([]);
  const [show, setShow] = useState(false);
  const [openApprove, setopenApprove] = useState(false);
  const [actionID, setActionID] = useState("");
  const [approvalTypeId, setapprovalTypeId] = useState("");
  const [approvalFlowApplicabilityId, setapprovalFlowApplicabilityId] =
    useState(null);
  const [Path, setPath] = useState("");
  const [cardColors] = useState(() =>
    approvalFlowTypes.map(() => randomColor({ luminosity: "light" }))
  );
  const header = [
    {
      [Path]: [
        {
          id: 1,
          title: "Template Name",
          value: "templateName",
          bold: true,
        },
        {
          id: 2,
          title: "Approval Type",
          value: "approvalTypeName",
          bold: true,
        },
        {
          id: 3,
          title: "Status",
          value: "isActive",
          actionToggle: true,
        },
        {
          id: 4,
          title: "Assigned",
          value: "multiImage",
          multiImage: true,
          view: true,
        },
        {
          id: 7,
          title: "",
          value: "action",
          dotsVertical: true,
          width: 50,
          dotsVerticalContent: [
            {
              title: "Update",
              value: "update",
            },
            {
              title: "Assign",
              value: "assign",
            },
            {
              title: "Delete",
              value: "delete",
              confirm: true,
              key: true,
            },
          ],
        },
      ],
    },
  ];

  const handleApprovalsTemplate = (typeId, path) => () => {
    setSelectedFlowTypeId(typeId);
    getApprovelTypesById(typeId);
    setPath(path);
    // console.log(path,"ddsdsds");
  };
  useEffect(() => {}, [path]);

  // const selectedFlowType = approvalFlowTypes.find(
  //   (flowType) => flowType.typeId === selectedFlowTypeId
  // );

  const getApprovelTypes = async (e) => {
    try {
      const result = await action(API.GET_APPROVELS_TYPE, {
        companyId: companyId,
      });
      if (result.status === 200) {
        setPath(result.result[0].approvalTypeName);
        const array = result.result.map((item) => ({
          typeId: item.approvalTypeId,
          type: item.approvalTypeName,
          approvalTemplates: item.approvalTemplates,
          color: randomColor({ luminosity: "light" }),
          templates: result.result.map((templateItem) => ({
            templateName: templateItem.approvalTypeName,
            isActive: templateItem.isActive,
            type: templateItem.moduleName,

            approvers: [],
          })),
        }));

        setapprovalFlowTypes(array);
        if (e) {
          setSelectedFlowTypeId(e);
        } else {
          setSelectedFlowTypeId(array[0].typeId);
        }
      } else {
        console.log(result.message);
      }

      // getApprovelTypesById(array[0].typeId)
    } catch (error) {
      console.error("Error fetching approval types:", error);
    }
  };
  useEffect(() => {
    getApprovelTypes();
  }, []);

  const getApprovelTypesById = async (e) => {
    try {
      const result = await action(API.GET_APPROVES_TEMPLATE, {
        approvalTypeId: e,
        companyId: companyId,
      });

      const tableData = result.result?.map((each) => {
        const employees = Array.isArray(each.employees)
          ? each.employees
          : [each.employees];

        return {
          ...each,
          employeeName: employees.map((data) => data.firstName),
          name: employees.map((data) => data.firstName),
          multiImage: employees.map((data) => data.profilePicture),
          employeeId: employees.map((data) => data.employeeId),
        };
      });
      setTableData(tableData);
      // setPath(tableData[0].approvalTypeName);
    } catch (error) {
      console.error("Error fetching approval types:", error);
    }
  };

  // useMemo(() => {

  //   getApprovelTypesById(selectedFlowTypeId);
  //   console.log("Appro", selectedFlowTypeId);
  // }, [selectedFlowTypeId]);
  // const getApprovelTemplates = async () => {
  //   try {
  //     const result = await action(API.GET_APPROVES_TEMPLATE, {}); // Assuming API.GET_APPROVELS_TYPE is your API call function
  //     console.log(result, "employee");

  //     // const array = result.result.map((item) => ({
  //     //   typeId: item.approvalTypeId,
  //     //   type: item.moduleName,
  //     //   templates:  result.result.map((templateItem) => ({
  //     //         templateName: templateItem.approvalTypeName,
  //     //         isActive: templateItem.isActive,
  //     //         type: templateItem.moduleName,
  //     //         approvers:[]
  //     //       }))

  //     // }));

  //     // console.log(array, "employee");
  //     setApprovelTemplate("")

  //   } catch (error) {
  //     console.error("Error fetching approval types:", error);

  //   }
  // };
  //  useEffect(() => {
  //   getApprovelTemplates();
  // }, []);
  return (
    <FlexCol gap={33}>
      <div className="flex flex-col items-start justify-between w-full gap-3 sm:items-center sm:flex-row">
        <Heading
          title={"Approval Types"}
          description={t(
            "Approval Types are categories of authorization, allowing different levels of permissions. They ensure compliance, streamline processes, and maintain control over various organizational activities."
          )}
        />

        <ButtonClick
          buttonName={t("Create New Approval Flow")}
          BtnType="primary"
          handleSubmit={(e) => {
            setShow(true);
          }}
        />
      </div>
      <div className="rounded-[20px] bg-primaryalpha/5 p-4 flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between w-full gap-3 sm:items-center sm:flex-row">
          <p className="text-base lg:text-sm 2xl:text-base text-grey dark:text-white font-medium">
            Approval Flow Types({approvalFlowTypes.length})
          </p>
          <SearchBox
            placeholder="Search"
            change={(e) => console.log(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 4xl:grid-cols-6 gap-4 h-[268px] overflow-y-auto pr-1.5">
          {approvalFlowTypes.map((flowType, index) => (
            <ApprovalTypeCard
              key={flowType.typeId}
              flowType={flowType}
              selectedId={selectedFlowTypeId}
              handleApprovalsTemplate={handleApprovalsTemplate}
              color={flowType.color}
              plusButtonClick={(e) => {
                setShow(true);
                setapprovalTypeId(e);
              }}
            />
          ))}
        </div>
      </div>
      <FlexCol gap={17}>
        <div className="flex flex-col gap-4">
          <TableAnt
            header={header}
            path={Path}
            actionID="approvalTemplateId"
            data={tabledata}
            clickDrawer={(e, value, actionID, text) => {
              if (value === "assign") {
                setopenApprove(true);
              } else if (value === "update") {
                setShow(true);
              }
              setActionID(actionID);
              setapprovalTypeId(text.approvalTypeId);
              setapprovalFlowApplicabilityId(text.approvalFlowApplicabilityId);
            }}
            updateApi={API.UPDATE_STATUS_TEMPLATE}
            deleteApi={API.DELETE_APPROVAL_TEMPLATE}
            viewOutside={true}
            referesh={(e, text) => {
              if (text) {
                getApprovelTypesById(text.approvalTypeId);
                getApprovelTypes(text.approvalTypeId);
              }
            }}
          />
        </div>
      </FlexCol>
      {show && (
        <NewApprovalFlow
          open={show}
          close={(e) => {
            setShow(e);
            setapprovalTypeId(null);
            setActionID(null);
          }}
          updateId={approvalTypeId}
          actionID={actionID}
          refresh={(e) => {
            getApprovelTypes(e);
            getApprovelTypesById(e);
          }}
        />
      )}
      {openApprove && (
        <AssignApprovalTemplate
          open={openApprove}
          close={(e) => {
            setopenApprove(e);
          }}
          updateId={actionID}
          companyDataId={companyId}
          approvalTypeId={approvalTypeId}
          approvalFlowApplicabilityId={approvalFlowApplicabilityId}
          refresh={() => {
            getApprovelTypesById(selectedFlowTypeId);
          }}
        />
      )}
    </FlexCol>
  );
};

const ApprovalTypeCard = ({
  flowType,
  selectedId,
  handleApprovalsTemplate = () => {},
  color,
  plusButtonClick = () => {},
}) => {
  return (
    <div
      className={`borderb rounded-[10px] h-[122px] p-1.5 bg-white dark:bg-dark transition-all duration-300 hover:shadow-lg  ${
        flowType.typeId === selectedId &&
        "!border-primaryalpha/80 shadow-xl shadow-primaryalpha/20"
      }`}
    >
      <div
        className="flex items-center justify-between h-[78px] rounded-[7px] gap-3 bg-opacity-50 p-2 cursor-pointer"
        style={{ backgroundColor: `${color}40` }}
        onClick={handleApprovalsTemplate(flowType.typeId, flowType.type)}
      >
        <h4 className="h3 font-medium pl-1.5 py-1.5">
          {flowType.type?.charAt(0).toUpperCase() + flowType.type?.slice(1)}
        </h4>
        <PiTreeStructure size={44} className="opacity-5" />
      </div>
      <div className="p-2.5 flex items-center justify-between">
        <p className="text-xs lg:text-[10px] 2xl:text-xs ">
          <span className="font-semibold">{flowType.approvalTemplates}</span>{" "}
          <span className="text-grey">templates found</span>
        </p>
        <Tooltip title="Add New">
          <button
            className=" bg-[#E3E3E3] rounded-full appearance-none vhcenter gap-1 vhcenter text-black !cursor-pointer size-5"
            onClick={() => plusButtonClick(flowType.typeId)}
          >
            <PiPlusBold size={9} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ApprovalTypes;
