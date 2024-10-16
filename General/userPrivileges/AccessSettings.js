import React, { useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import WorkEntry from "../../../assets/images/userPrivileges/work entry.png";
import SalaryAccess from "../../../assets/images/userPrivileges/Salary access.png";
import SalaryDetailModal from "./SalaryDetailModal";

export default function AccessSettings() {
  const [selectedCard, setSelectedCard] = useState();
  const [openModalName, setOpenModalName] = useState();
  const [openModal, setOpenModal] = useState(false);

  const SelectCard = (item) => {
    setSelectedCard(item.value);
    setOpenModalName(item.value);
    setOpenModal(true);
  };

  const data = [
    {
      id: 1,
      title: "Salary Detail Access",
      value: "salaryAccess",
      description:
        "Enables employees  to view detailed salary information securely which includes pay slips, breakdown of earnings, deductions, tax information, and other relevant financial details.",
      img: WorkEntry,
    },
    {
      id: 2,
      title: "Work Entry Access",
      value: "workEntryAccess",
      description:
        "Enables employees to record and track their work hours, project contributions, and task completions.",
      img: SalaryAccess,
    },
    {
      id: 3,
      title: "Expense Reimbursement",
      value: "expenseReimbursement",
      description:
        "Enables the employees with the process of submitting, reviewing, and approving employee expense claims.",
      img: WorkEntry,
    },
  ];

  const headers = {
    salaryAccess: ["Salary Detail Access", "Salary Detail Access"],
    workEntryAccess: ["Work Entry Access", "Work Entry Access"],
    expenseReimbursement: ["Expense Reimbursement", "Expense Reimbursement"],
  };

  return (
    <div>
      <div className="flex flex-col gap-3">
        {data.map((item, index) => (
          <div
            key={index}
            className={`borderb rounded-[10px] p-2 cursor-pointer ${
              item.value === selectedCard ? "bg-primaryalpha/10" : ""
            }`}
            onClick={() => SelectCard(item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-col md:flex-row gap-2">
                <div
                  className={`w-16 h-16 2xl:w-20 2xl:h-20 rounded-lg vhcenter ${
                    item.value === selectedCard
                      ? "bg-primaryalpha/5"
                      : "bg-slate-100"
                  }`}
                >
                  <img
                    src={item.img}
                    alt="img"
                    className={`w-12 h-12 2xl:w-14 2xl:h-14 ${
                      item.value === selectedCard ? "" : "saturate-0"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-1 md:min-w-[596px]">
                  <p className="font-semibold text-sm 2xl:text-base dark:text-white">
                    {item.title}
                  </p>
                  <p className="break-all font-medium text-grey text-[10px] 2xl:text-xs">
                    {item.description}
                  </p>
                </div>
              </div>
              <div
                className={`${
                  item.value === selectedCard ? "text-primary" : "text-grey"
                } mr-2`}
              >
                <MdOutlineArrowForwardIos />
              </div>
            </div>
          </div>
        ))}
      </div>
      {openModal && (
        <SalaryDetailModal
          open={openModal}
          close={(e) => {
            setOpenModal(e);
            setOpenModalName("");
          }}
          accessDetails={openModalName}
          header={headers[openModalName]}
        />
      )}
    </div>
  );
}
