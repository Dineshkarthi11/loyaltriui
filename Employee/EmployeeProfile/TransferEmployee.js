/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Heading from "../../common/Heading";
import ButtonClick from "../../common/Button";
import TableAnt from "../../common/TableAnt";
import InitiateTransfer from "../InitiateTransfer";
import PopImg from "../../../assets/images/EmpLeaveRequest.svg";
import ModalAnt from "../../common/ModalAnt";
import Avatar from "../../common/Avatar";
import { GoDotFill } from "react-icons/go";
import { useTranslation } from "react-i18next";
import Transfer from "../../../assets/images/transfer.png";
import { render } from "@testing-library/react";
import { WidthFull } from "@mui/icons-material";
import API, { action } from "../../Api";
import localStorageData from "../../common/Functions/localStorageKeyValues";
import moment from "moment";

const TransferEmployee = () => {
  const [show, setShow] = useState(false);

  const companyId = localStorageData.companyId;

  const { t } = useTranslation();

  const [modalData, setModalData] = useState();

  const [viewModal, setViewModal] = useState(false);

  const [approvePop, setApprovePop] = useState(false);

  const [transferList, setTransferList] = useState([]);

  const getTransferredEmployee = async () => {
    try {
      await action(API.GET_TRANSFER_LIST, {
        companyId: companyId,
      }).then((res) => {
        const response = res?.result.map((data) => {
          return {
            firstName: data.firstName,
            employeeId: data.employeeId,
            previousBranch: data.previousBranch,
            newBranch: data.newBranch,
            createdOn: moment(data.createdOn).format("YYYY-MM-DD"),
            transferDate: moment(data.transferDate).format("YYYY-MM-DD"),
            status: data.status,
            mainStatus: data.status === "Pending" && "Pending",
            requestStatusColour: "#33fb20",
            mainStatusColor: "#EBA900",
          };
        });
        setTransferList(response);
        return res;
      });
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    getTransferredEmployee();
  }, [companyId]);

  const header = [
    {
      Transfer_Employee_List: [
        {
          id: 1,
          title: t("Employee Name"),
          value: ["firstName", "employeeId"],
          flexColumn: true,
          logo: true,
          bold: true,
          fixed: "left",
        },
        {
          id: 2,
          title: t("Previous Branch"),
          value: "previousBranch",
        },
        {
          id: 3,
          title: t("New Branch"),
          value: "newBranch",
        },
        {
          id: 4,
          title: "Requested On",
          value: "createdOn",
        },
        {
          id: 5,
          title: t("Transfer Date"),
          value: "transferDate",
        },
        // {
        //   id: 5,
        //   title: "Status",
        //   value: "isActive",
        //   alterValue: "isActive",
        // },
        {
          id: 6,
          title: "Status",
          value: "status",
          status: true,
          colour: "requestStatusColour",
          mainStatus: "mainStatus",
          mainStatusColor: "mainStatusColor",
          dotsVertical: true,
          // fixed: "right",
        },
        {
          id: 7,
          title: "",
          Width: 80,
          fixed: "right",
          render: (record, text) => {
            const isStatusTrue = record.mainStatus === "Pending";
            return (
              isStatusTrue && (
                <ButtonClick
                  buttonName={"Approve"}
                  handleSubmit={() => setApprovePop(true)}
                />
              )
            );
          },
        },

        // {
        //   id: 7,
        //   title: "",
        //   value: "action",
        //   fixed: "right",
        //   dotsVertical: true,
        //   width: 50,
        //   dotsVerticalContent: [
        //     {
        //       title: "Update",
        //       value: "updateLeave",
        //       customField: "employee",
        //     },
        //     {
        //       title: "Delete",
        //       value: "delete",
        //       confirm: true,
        //     },
        //   ],
        // },
      ],
    },
  ];

  return (
    <div className={`w-full flex flex-col gap-6`}>
      <div className="flex justify-between p-2">
        <Heading
          title="Branch Transfer"
          description="Manage employee transfers between company branches, including location, role, and department changes."
        />
        <ButtonClick
          handleSubmit={() => {
            setShow(true);
          }}
          BtnType="primary"
          buttonName="Initiate Transfer"
        />
      </div>
      <TableAnt
        data={transferList}
        header={header}
        actionID="leaveTypeId"
        //updateApi={}
        //deleteApi={}
        path="Transfer_Employee_List"
        //referesh={() => {
        //}}
        viewOutside={true}
        viewClick={(e, text) => {
          setModalData(text);
          setViewModal(true);
        }}
        clickDrawer={(e, actionId, text) => {
          setApprovePop(true);
        }}
      />
      <InitiateTransfer
        open={show}
        close={() => {
          setShow(false);
        }}
      />
      <ModalAnt
        isVisible={approvePop}
        onClose={() => {
          setApprovePop(false);
        }}
        // width="435px"
        showCancelButton={true}
        cancelButtonClass="w-full"
        showTitle={false}
        centered={true}
        padding="8px"
        showOkButton={true}
        okText={"Approve Transfer"}
        // okButtonDanger
        okButtonClass="w-full"
        onOk={() => console.log("hi")} // write submit logic
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[506px] p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-14 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
              <img src={Transfer} alt="" className="rounded-full w-[28px]" />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              Approve Employee Transfer
            </p>
          </div>
          <div className="m-auto">
            <div className="text-center text-xs 2xl:text-sm text-gray-500">
              Are you sure you want to approve the transfer of{" "}
              {/* <span className="text-primary font-medium">Alexandar Paul</span>{" "}
              from{" "}
              <span className="font-medium text-black">NewYork office</span> to{" "}
              <span className="font-medium text-black">Chicago office</span>? */}
            </div>
            <span className="text-primary font-medium">
              {modalData?.fullName}
            </span>{" "}
            from{" "}
            <span className="font-medium text-black">
              {modalData?.previousBranch}
            </span>{" "}
            to{" "}
            <span className="font-medium text-black">
              {modalData?.newBranch}
            </span>
            ?
          </div>
        </div>
      </ModalAnt>
      <ModalAnt
        isVisible={viewModal}
        onClose={() => setViewModal(false)}
        // width="435px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[553px] p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-14 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
              <img src={PopImg} alt="Img" className="rounded-full w-[28px]" />
            </div>
            <div className="font-semibold text-[17px] 2xl:text-[19px]">
              Branch Transfer Details
            </div>
          </div>
          <div className="m-auto">
            <div className="text-center text-xs 2xl:text-sm text-gray-500">
              Manage employee transfers between company branches, including
              location, role and department changes.
            </div>
          </div>
          <div className="max-h-[320px] overflow-auto flex flex-col gap-3 pt-2 pr-1.5">
            <div className="flex flex-col gap-4 borderb rounded-lg p-3 bg-[#F9F9F9] dark:bg-dark">
              <div className="flex items-center gap-2">
                <Avatar
                  image={modalData?.profilePicture}
                  name={modalData?.fullName}
                  className="border-2 border-white shadow-md"
                />
                <div className="flex flex-col gap-0.5">
                  <div className="font-medium text-xs 2xl:text-sm">
                    {modalData?.fullName.charAt(0).toUpperCase() +
                      modalData?.fullName.slice(1).toLowerCase()}
                  </div>
                  <div className="text-[10px] 2xl:text-xs text-grey">
                    Emp Id : {modalData?.code}
                  </div>
                </div>
              </div>
              <div className="divider-h"></div>
              <div className="grid grid-cols-3 justify-evenly gap-4">
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs 2xl:text-sm text-grey">
                    Previous Branch
                  </div>
                  <div className="text-xs 2xl:text-sm font-semibold">
                    {modalData?.previousBranch}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs 2xl:text-sm text-grey">
                    New Branch
                  </div>
                  <div className="text-xs 2xl:text-sm font-semibold">
                    {modalData?.newBranch}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs 2xl:text-sm text-grey">
                    Requested Date
                  </div>
                  <div className="text-xs 2xl:text-sm font-semibold">
                    {modalData?.requestedDate}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs 2xl:text-sm text-grey">
                    Transfer Date
                  </div>
                  <div className="text-xs 2xl:text-sm font-semibold">
                    {modalData?.transferDate}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 col-span-2">
                  <div className="flex items-start gap-1">
                    <div className="text-xs 2xl:text-sm text-grey">
                      Transfer Timeline
                    </div>
                    <div className="text-xs text-grey italic">
                      (estimate hand over time)
                    </div>
                  </div>
                  <div className="text-xs 2xl:text-sm font-semibold">
                    {`${modalData?.days} Days`}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs 2xl:text-sm text-grey">Status</div>
                  <div
                    className={`flex items-center justify-center gap-1 w-[90px] h-[20px] 2xl:w-[98px] 2xl:h-[24px] rounded-full ${
                      modalData?.requestStatusName === "Pending"
                        ? "bg-orange-100 text-orange-600"
                        : modalData?.requestStatusName === "Rejected"
                        ? " bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <GoDotFill size={14} />
                    <div className="font-medium text-xs 2xl:text-sm">
                      {modalData?.requestStatusName}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalAnt>
    </div>
  );
};

// import React, { useState, useEffect } from "react";
// import Heading from "../../common/Heading";
// import ButtonClick from "../../common/Button";
// import TableAnt from "../../common/TableAnt";
// import InitiateTransfer from "../InitiateTransfer";
// import PopImg from "../../../assets/images/EmpLeaveRequest.svg";
// import ModalAnt from "../../common/ModalAnt";
// import Avatar from "../../common/Avatar";
// import { GoDotFill } from "react-icons/go";
// import { useTranslation } from "react-i18next";
// import Transfer from "../../../assets/images/transfer.png";

// export default function TransferEmployee() {
//   const [show, setShow] = useState(false);
//   const { t } = useTranslation();
//   const [modalData, setModalData] = useState();
//   const [viewModal, setViewModal] = useState(false);
//   const [approvePop, setApprovePop] = useState(false);
//   const [transferList, setTransferList] = useState([]);

//   // Fetching transfer data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("https://dev-api.loyaltri.com/api/main", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             action: "getAllTransferDetails",
//             method: "POST",
//             kwargs: {
//               companyId: "22",
//             },
//           }),
//         });
//         const data = await response.json();
//         if (data.status === 200) {
//           const transferData = data.result.map((item) => ({
//             fullName: item.company, // Assuming employee name is the company field here
//             code: item.cin, // Just an example, adjust it to match your data
//             profilePicture: item.logo || PopImg, // Default to PopImg if no logo
//             previousBranch: item.address, // Assuming address is previous branch
//             newBranch: "Unknown", // No new branch provided in API, use placeholder or adjust accordingly
//             requestedDate: item.createdOn.split(" ")[0], // Assuming createdOn is the request date
//             transferDate: item.modifiedOn?.split(" ")[0] || "Unknown", // Assuming modifiedOn is transfer date
//             days: "N/A", // No day info provided in API, adjust accordingly
//             requestStatusName: "Pending", // Placeholder status, adjust if the API provides status
//             requestStatusColour: "#EBA900",
//             mainStatus: "Pending",
//             mainStatusColor: "#EBA900",
//           }));
//           setTransferList(transferData);
//         }
//       } catch (error) {
//         console.error("Error fetching transfer data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const header = [
//     {
//       Transfer_Employee_List: [
//         {
//           id: 1,
//           title: t("Employee Name"),
//           value: ["fullName", "code"],
//           flexColumn: true,
//           logo: true,
//           bold: true,
//           fixed: "left",
//         },
//         {
//           id: 2,
//           title: t("Previous Branch"),
//           value: "previousBranch",
//         },
//         {
//           id: 3,
//           title: t("New Branch"),
//           value: "newBranch",
//         },
//         {
//           id: 4,
//           title: "Requested On",
//           value: "requestedDate",
//         },
//         {
//           id: 5,
//           title: t("Transfer Date"),
//           value: "transferDate",
//         },
//         {
//           id: 6,
//           title: "Status",
//           value: "requestStatusName",
//           status: true,
//           colour: "requestStatusColour",
//           mainStatus: "mainStatus",
//           mainStatusColor: "mainStatusColor",
//           dotsVertical: true,
//         },
//         {
//           id: 7,
//           title: "",
//           Width: 80,
//           fixed: "right",
//           render: (record, text) => {
//             const isStatusTrue = record.mainStatus === "Pending";
//             return (
//               isStatusTrue && (
//                 <ButtonClick
//                   buttonName={"Approve"}
//                   handleSubmit={() => setApprovePop(true)}
//                 />
//               )
//             );
//           },
//         },
//       ],
//     },
//   ];

//   return (
//     <div className="w-full flex flex-col gap-6">
//       <div className="flex justify-between p-2">
//         <Heading
//           title="Branch Transfer"
//           description="Manage employee transfers between company branches, including location, role, and department changes."
//         />
//         <ButtonClick
//           handleSubmit={() => {
//             setShow(true);
//           }}
//           BtnType="primary"
//           buttonName="Initiate Transfer"
//         />
//       </div>

//       <TableAnt
//         data={transferList}
//         header={header}
//         actionID="leaveTypeId"
//         path="Transfer_Employee_List"
//         viewOutside={true}
//         viewClick={(e, text) => {
//           setModalData(text);
//           setViewModal(true);
//         }}
//         clickDrawer={(e, actionId, text) => {
//           setApprovePop(true);
//         }}
//       />

//       <InitiateTransfer
//         open={show}
//         close={() => {
//           setShow(false);
//         }}
//       />

//       <ModalAnt
//         isVisible={approvePop}
//         onClose={() => {
//           setApprovePop(false);
//         }}
//         showCancelButton={true}
//         showTitle={false}
//         centered={true}
//         padding="8px"
//         showOkButton={true}
//         okText={"Approve Transfer"}
//         okButtonClass="w-full"
//         onOk={() => console.log("Approved Transfer")}
//       >
//         <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[506px] p-2">
//           <div className="flex flex-col gap-2.5 items-center m-auto">
//             <div className="border-2 border-[#FFFFFF] size-14 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
//               <img src={Transfer} alt="" className="rounded-full w-[28px]" />
//             </div>
//             <p className="font-semibold text-[17px] 2xl:text-[19px]">
//               Approve Employee Transfer
//             </p>
//           </div>
//           <div className="m-auto">
//             <div className="text-center text-xs 2xl:text-sm text-gray-500">
//               Are you sure you want to approve the transfer of{" "}
//               <span className="text-primary font-medium">
//                 {modalData?.fullName}
//               </span>{" "}
//               from{" "}
//               <span className="font-medium text-black">
//                 {modalData?.previousBranch}
//               </span>{" "}
//               to{" "}
//               <span className="font-medium text-black">
//                 {modalData?.newBranch}
//               </span>
//               ?
//             </div>
//           </div>
//         </div>
//       </ModalAnt>

//       <ModalAnt
//         isVisible={viewModal}
//         onClose={() => setViewModal(false)}
//         showOkButton={false}
//         showCancelButton={false}
//         showTitle={false}
//         centered={true}
//         padding="8px"
//       >
//         <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[553px] p-2">
//           <div className="flex flex-col gap-2.5 items-center m-auto">
//             <div className="border-2 border-[#FFFFFF] size-14 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
//               <img src={PopImg} alt="Img" className="rounded-full w-[28px]" />
//             </div>
//             <div className="font-semibold text-[17px] 2xl:text-[19px]">
//               Branch Transfer Details
//             </div>
//           </div>
//           <div className="m-auto">
//             <div className="text-center text-xs 2xl:text-sm text-gray-500">
//               Manage employee transfers between company branches, including
//               location, role and department changes.
//             </div>
//           </div>
//           <div className="max-h-[320px] overflow-auto flex flex-col gap-3 pt-2 pr-1.5">
//             <div className="flex flex-col gap-4 borderb rounded-lg p-3 bg-[#F9F9F9] dark:bg-dark">
//               <div className="flex items-center gap-2">
//                 <Avatar
//                   image={modalData?.profilePicture}
//                   name={modalData?.fullName}
//                   className="border-2 border-white shadow-md"
//                 />
//                 <div className="flex flex-col gap-0.5">
//                   <div className="font-medium text-xs 2xl:text-sm">
//                     {modalData?.fullName}
//                   </div>
//                   <div className="text-[10px] 2xl:text-xs text-grey">
//                     Emp Id : {modalData?.code}
//                   </div>
//                 </div>
//               </div>
//               <div className="divider-h"></div>
//               <div className="grid grid-cols-3 justify-evenly gap-4">
//                 <div className="flex flex-col gap-0.5">
//                   <div className="text-xs 2xl:text-sm text-[#000]">
//                     Transfer Date
//                   </div>
//                   <div className="font-medium text-xs 2xl:text-sm text-grey">
//                     {modalData?.transferDate}
//                   </div>
//                 </div>
//                 <div className="flex flex-col gap-0.5">
//                   <div className="text-xs 2xl:text-sm text-[#000]">
//                     Status
//                   </div>
//                   <div className="font-medium text-xs 2xl:text-sm text-grey">
//                     <GoDotFill color={modalData?.mainStatusColor} />{" "}
//                     {modalData?.mainStatus}
//                   </div>
//                 </div>
//                 <div className="flex flex-col gap-0.5">
//                   <div className="text-xs 2xl:text-sm text-[#000]">
//                     Requested On
//                   </div>
//                   <div className="font-medium text-xs 2xl:text-sm text-grey">
//                     {modalData?.requestedDate}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </ModalAnt>
//     </div>
//   );
// }

export default TransferEmployee;
