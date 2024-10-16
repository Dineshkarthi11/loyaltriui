import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "../../../../common/BreadCrumbs";
import TabsNew from "../../../../common/TabsNew";
import API, { action } from "../../../../Api";
import axios from "axios";

import PayrollSettingsTable from "../../../../common/PayrollSettingsTable";
import CompanyBank from "./CompanyBank";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import AddBankAccount from "./AddBankAccount";
import AddExchangeHouse from "./AddExchangeHouse";
import EmployeeBankAccount from "./EmployeeBankAccount";
import Heading from "../../../../common/Heading";

export default function BankAccountSettings() {
  const { t } = useTranslation();
  const [navigationPath, setNavigationPath] = useState("bank");
  const [bankList, setBankList] = useState([]);
  const [exchangeHouse, setexchangeHouse] = useState([]);
  const [bankDetails, setbankDetails] = useState([]);
  const [employeeBankList, setemployeeBankList] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [BankOrExchangeValue, setBankOrExchangeValue] = useState([]);
  const [show, setShow] = useState(false);
  const [openPop, setOpenPop] = useState("");
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );
  const [companyBankList, setCompanyBankList] = useState([]);

  const handleClose = () => {
    setShow(false);
    setOpenPop(""); // Clear the value in setOpenPop
    localStorage.removeItem("actionidforupdate");
  };
  const handleShow = (popupType) => {
    setShow(true);
    setOpenPop(popupType);
  };
  const getCompanyIdFromLocalStorage = () => {
    return localStorage.getItem("companyId");
  };
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const companyId = getCompanyIdFromLocalStorage();
        const result = await action(API.GET_COMPANY_ID_BASED_RECORDS, {
          id: companyId,
        });
        setCompanyDetails(parseInt(result.result?.isPFESIenabled));
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompanyDetails();
  }, []);

  const tabs = [
    {
      id: 1,
      title: t("Bank"),
      value: "bank",
    },
    {
      id: 2,
      title: t("Company  Bank"),
      value: "companyBank",
    },
    {
      id: 3,
      title: t("Employee Bank Account"),
      value: "employeeBankAccount",
    },
  ];

  const header = [
    {
      bankSettings: [
        {
          id: 1,
          title: t("Bank Name"),
          value: "bankName",
          bold: true,
        },
        {
          id: 2,
          title: companyDetails === 0 ? "Routing Code" : "IFSC Code",
          value: "routingCode",
        },
        {
          id: 3,
          title: t("Branch_Name"),
          value: "bankBranch",
        },
        {
          id: 4,
          title: t("Action"),
          value: "",
          action: true,
        },
      ],
      exchangeHouse: [
        {
          id: 1,
          title: t("Exchange House Name"),
          value: "bankName",
          bold: true,
        },
        {
          id: 2,
          title: companyDetails === 0 ? t("Routing_Code") : "IFSC Code",
          value: "routingCode",
        },
        {
          id: 3,
          title: t("Action"),
          value: "",
          action: true,
        },
      ],
      companyBank: [
        {
          id: 1,
          title: t("Account Holder Name"),
          value: "",
        },
        {
          id: 2,
          title: t("Bank Name"),
          value: "",
        },
        {
          id: 3,
          title: t("Routing Code"),
          value: "",
        },
        {
          id: 4,
          title: t("Trading License"),
          value: "",
        },
        {
          id: 5,
          title: t("IBAN"),
          value: "",
        },
        {
          id: 6,
          title: t("Action"),
          value: "",
          action: true,
        },
      ],
      employeeBankAccount: [
        {
          id: 1,
          title: t("Account Holder Name"),
          value: "employeeName",
          bold: true,
        },
        {
          id: 2,
          title: t("Salary payment method"),
          value: "salaryPaymentMethodName",
        },
        {
          id: 3,
          title: t("IBAN/ACC NO"),
          value: "iban",
        },
        {
          id: 4,
          title: t("Bank/Exchange House Name"),
          value: "bankOrExchangeName",
        },
        {
          id: 5,
          title: companyDetails === 0 ? t("Routing_Code") : "IFSC Code",
          value: "routingCode",
        },
        {
          id: 6,
          title: t("Trade License"),
          value: "tradingLicense",
        },
        {
          id: 7,
          title: t("Action"),
          value: " ",
          action: true,
          hideIcon: "delete",
        },
      ],
    },
  ];

  const getToken = async () => {
    const result = await axios.get(PAYROLLAPI.HOST + PAYROLLAPI.GET_TOKEN);

    localStorage.setItem("token", result.data.token);
  };

  const getBankList = async () => {
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_ALL_BANK_RECORDS, {
        companyId: companyId,
      });
      setBankList(result?.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getExchangeHouseList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_EXCHANGE_HOUSE_RECORDS,
        {
          companyId: companyId,
        }
      );
      setexchangeHouse(result?.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCompanyBankDetails = async () => {
    // setemployeeList(employeeDetails);

    try {
      const result = await Payrollaction(PAYROLLAPI.GET_COMPANYBANK_DETAILS, {
        companyId: companyId,
      });
      setCompanyBankList(result.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getEmployeeBankList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.EMPLOYEE_BANKACCOUNT_RECORDS,
        {
          companyId: companyId,
        }
      );
      if (result && result.result && result.result.length > 0) {
        const bankOrExchange =
          result.result[0].bankName || result.result[0].exchangeName;
        setBankOrExchangeValue(bankOrExchange);

        // Map through the result array and dynamically set the bank or exchange name for each item
        const updatedEmployeeBankList = result.result.map((item) => {
          const bankName = item.bankName || "";
          const exchangeName = item.exchangeName || "";
          const bankOrExchangeName = bankName !== "" ? bankName : exchangeName;
          return { ...item, bankOrExchangeName };
        });

        setemployeeBankList(updatedEmployeeBankList);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    switch (navigationPath) {
      default:
        getBankList();
        getExchangeHouseList();
        break;
      case "exchangeHouse":
        getExchangeHouseList();
        break;
      case "companyBank":
        getCompanyBankDetails();
        break;
      case "employeeBankAccount":
        getEmployeeBankList();
        break;
    }
  }, [navigationPath, companyId]);
  useEffect(() => {}, [navigationPath]);

  return (
    <div className={`w-full flex flex-col`}>
      <Heading
        title={"Bank Account Settings"}
        description={
          navigationPath === "bank"
            ? t(
                "Multiple company bank accounts can be added to streamline payment processes and enhance convenience."
              )
            : navigationPath === "companyBank"
            ? "Select the primary bank account from the multiple accounts added for streamlined payment processing."
            : "The bank account designated for employee salary transfers is to be selected for payment processing."
        }
      />

      <div className="pt-3">
        <TabsNew
          tabs={tabs}
          tabClick={(e) => {
            setNavigationPath(e);
          }}
        />
      </div>

      {navigationPath === "bank" && (
        <div>
          <PayrollSettingsTable
            data={bankList}
            heading={"Bank Settings"}
            buttonName={"Create Bank"}
            BtnType={"add"}
            header={header}
            payrollSettings={true}
            path="bankSettings"
            deleteApi={"deleteBankById"}
            actionID={"bankId"}
            buttonClick={(e) => {
              setUpdateId(e);
            }}
            refresh={() => {
              getBankList();
            }}
            clickDrawer={(actionID) => {
              handleShow("bank", actionID);
            }}
            cursorPointer={false}
          />
          <div className="mt-6">
            <PayrollSettingsTable
              data={exchangeHouse}
              tabs={tabs}
              heading={"Exchange House"}
              buttonName={"Create Exchange House"}
              BtnType={"add"}
              header={header}
              payrollSettings={true}
              path="exchangeHouse"
              deleteApi={"deleteExchangeById"}
              actionID={"exchangeId"}
              refresh={() => {
                getExchangeHouseList();
              }}
              buttonClick={(e) => {
                setUpdateId(e);
              }}
              clickDrawer={(actionID) => {
                handleShow("exchangeHouse", actionID);
              }}
              cursorPointer={false}
            />
          </div>
        </div>
      )}

      {navigationPath === "exchangeHouse" && (
        <PayrollSettingsTable
          heading={"Exchange House"}
          buttonName={"Create Exchange House"}
          BtnType={"add"}
          header={header}
          payrollSettings={true}
          path="exchangeHouse"
          refresh={() => {
            getExchangeHouseList();
          }}
        />
      )}

      {navigationPath === "companyBank" && (
        <CompanyBank data={companyBankList} />
      )}

      {navigationPath === "employeeBankAccount" && (
        <PayrollSettingsTable
          data={employeeBankList}
          heading={"Employee Bank Account"}
          header={header}
          payrollSettings={true}
          path="employeeBankAccount"
          actionID={"employeeId"}
          deleteApi={"deleteEmployeeBankById"}
          refresh={() => {
            getEmployeeBankList();
          }}
          buttonClick={(e) => {
            setUpdateId(e);
          }}
          clickDrawer={(actionID) => {
            handleShow("employeeBankAccount", actionID);
          }}
          cursorPointer={false}
        />
      )}

      {openPop === "bank" && (
        <AddBankAccount
          open={show}
          close={(e) => {
            setShow(e);
            setUpdateId();
            handleClose();
            setUpdateId(undefined);
          }}
          refresh={() => {
            getBankList();
          }}
          openPolicy={openPop}
          updateId={updateId}
        />
      )}

      {show && openPop === "exchangeHouse" && (
        <AddExchangeHouse
          open={show}
          close={(e) => {
            setShow(e);
            setUpdateId();
            handleClose();
            setUpdateId(undefined);
          }}
          refresh={() => {
            getExchangeHouseList();
          }}
          openPolicy={openPop}
          updateId={updateId}
        />
      )}

      {show && openPop === "employeeBankAccount" && (
        <EmployeeBankAccount
          open={show}
          close={(e) => {
            setShow(e);
            setUpdateId();
            handleClose();
            setUpdateId(undefined);
          }}
          refresh={() => {
            getEmployeeBankList();
          }}
          openPolicy={openPop}
          updateId={updateId}
        />
      )}
    </div>
  );
}
