import React, { useEffect, useMemo, useState } from "react";
import DrawerPop from "../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import API, { action } from "../../Api";
import { BoxWrapper } from "../../common/BoxWrapper";
import ButtonClick from "../../common/Button";
import { PiCalendarBlank, PiDownloadSimple } from "react-icons/pi";
import { getEmployeeList } from "../../common/Functions/commonFunction";

export default function SalaryOverviewModal({ open, close = () => {} }) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const primaryColor = localStorage.getItem("mainColor");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [employeeList, setemployeeList] = useState([]);
  const [searchFilter, setSearchFilter] = useState(
    employeeList.map((each) => ({
      key: each.username,
      ...each,
    }))
  );

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([
    {
      id: 1345,
      product: "Apple Macbook Pro",
      productImage: "",
      modelNo: "278547",
      serialNo: "S2721QS",
      assignedDate: "05/01/2024",
      isDamaged: false,
      damageCost: "", // Placeholder for the cost, if available
      damageNote: "", // Placeholder for the note, if available
    },
    {
      id: 1326,
      product: "I Phone 14",
      productImage: "",
      modelNo: "27867",
      serialNo: "S2761PR",
      assignedDate: "05/01/2024",
      isDamaged: false,
      damageCost: "", // Placeholder for the cost, if available
      damageNote: "", // Placeholder for the note, if available
    },
  ]);
  const [selectedAsset, setSelectedAsset] = useState([]);

  //   useEffect(() => {
  //     if (searchValue) {
  //       setemployeeList([...searchFilter]);
  //     } else {
  //       getEmployee();
  //     }
  //   }, [searchFilter]);
  const handleClose = () => {
    close(false);
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  const getEmployee = async () => {
    try {
      const result = await getEmployeeList();
      setemployeeList(
        result.result.map((items) => ({
          id: items.employeeId,
          profile: items.profilePicture,
          name: items.firstName,
          joiningdate: items.joiningDate,
          designation: items.designation,
          empid: items.employeeId,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEmployee();
  }, []);

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        handleClose();
        close(e);
      }}
      contentWrapperStyle={{
        position: "absolute",
        height: "100%",
        top: 0,

        // left: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        borderRadius: 0,
        borderTopLeftRadius: "0px !important",
        borderBottomLeftRadius: 0,
        // background:"#F8FAFC"
      }}
      background="#F8FAFC"
      handleSubmit={(e) => {
        // saveEmployeePunchInMethod();
      }}
      bodyPadding={25}
      header={[
        t("Salary Overivew"),
        t(
          "Gain insights into your compensation package with our salary overview"
        ),
      ]}
      footer={false}
      //   footerBtn={[t("Cancel"), t("Save")]}
      //   saveAndContinue={true}
    >
      <div className="flex flex-col gap-6 max-w-[1076px] mx-auto">
        <div className="flex justify-between items-center">
          <ButtonClick
            icon={<PiCalendarBlank />}
            className="border-none text-xs 2xl:text-sm font-semibold"
            buttonName={"Duration: Jan 01 to Jan 31"}
          />
          <ButtonClick
            BtnType="primary"
            icon={<PiDownloadSimple />}
            buttonName={"Generate Salary Slip"}
          />
        </div>
        <BoxWrapper
          title="Salary Overview"
          description="By providing a thorough salary overview."
          className={"bg-white dark:bg-dark"}
          contentClassName={"p-0"}
        >
          <div className="overflow-x-auto">
            <div className="mb-5 dark:text-white">
              <table className="min-w-full border-collapse table-fixed">
                <thead>
                  <tr className="text-[10px] 2xl:text-xs font-medium text-gray-600 h-11 2xl:h-12">
                    <th className="px-4 text-left w-1/5">EARNINGS</th>
                    <th className="px-4 text-left w-1/5">FULL</th>
                    <th className="px-4 text-left w-1/5">ACTUAL</th>
                    <th className="px-4 text-left w-1/5">DEDUCTIONS</th>
                    <th className="px-4 text-left w-1/5">ACTUAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-[#F8F8F8] dark:bg-dark rounded-lg text-[10px] 2xl:text-xs h-11 2xl:h-12">
                    <td className="px-4">Special Allowance</td>
                    <td className="px-4">AED 800.00</td>
                    <td className="px-4">AED 800.00</td>
                    <td className="px-4">EPF</td>
                    <td className="px-4">--- , ---</td>
                  </tr>
                  <tr className="text-[10px] 2xl:text-xs h-11 2xl:h-12">
                    <td className="px-4">System Basic</td>
                    <td className="px-4">AED 200.00</td>
                    <td className="px-4">AED 800.00</td>
                    <td className="px-4">Professional Tax</td>
                    <td className="px-4">---,---</td>
                  </tr>
                  <tr className="bg-[#F8F8F8] dark:bg-dark rounded-lg text-[10px] 2xl:text-xs h-11 2xl:h-12">
                    <td className="px-4 font-bold">Gross Earnings</td>
                    <td className="px-4">--- , ---</td>
                    <td className="px-4 ">AED 800.00</td>
                    <td className="px-4 font-bold">Gross Earnings</td>
                    <td className="px-4 ">AED 800.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border-t dark:text-white border-gray-200 ">
              <table className="min-w-full border-collapse table-fixed mt-4">
                <tbody>
                  <tr className="text-[10px] 2xl:text-xs h-11 2xl:h-12">
                    <td className="px-4 font-bold w-1/5">Net Payable Amount</td>
                    <td className="px-4 w-1/5">--- , ---</td>
                    <td className="px-4 w-1/5">--- , ---</td>
                    <td className="px-4 w-1/5">3 Payable Days</td>
                    <td className="px-4 w-1/5">AED 800.00</td>
                  </tr>
                  <tr className="text-[10px] 2xl:text-xs h-11 2xl:h-12">
                    <td className="px-4 font-bold w-1/5">Adjustments</td>
                    <td className="px-4 w-1/5">--- , ---</td>
                    <td className="px-4 w-1/5">--- , ---</td>
                    <td className="px-4 w-1/5">--- , ---</td>
                    <td className="px-4 w-1/5">00.00</td>
                  </tr>
                  <tr className="h-11  text-[10px] 2xl:text-xs 2xl:h-12">
                    <td className="px-4 font-bold w-1/5">Payments</td>
                    <td className="px-4 w-1/5">--- , ---</td>
                    <td className="px-4 w-1/5">--- , ---</td>
                    <td className="px-4 w-1/5">--- , ---</td>
                    <td className="px-4 w-1/5">00.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-red-600 text-[15px] 2xl:text-[17px] font-bold py-2 px-4">
              Due Amount: AED 2000
            </p>
          </div>
        </BoxWrapper>
      </div>
    </DrawerPop>
  );
}
