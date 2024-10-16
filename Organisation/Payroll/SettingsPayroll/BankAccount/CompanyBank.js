import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiAccountBoxFill, RiEdit2Fill, RiFileCopy2Fill } from "react-icons/ri";
import ButtonClick from "../../../../common/Button";
import {
  PiArticleFill,
  PiBankFill,
  PiFileTextFill,
  PiFilesFill,
  PiNewspaperClippingFill,
  PiNoteBold,
  PiUserFocus,
  PiUserFocusFill,
  PiVaultFill,
} from "react-icons/pi";
import { MdAccountBalance } from "react-icons/md";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import BankDetails from "./BankDetails";
import WpsConfig from "./WpsConfig";
import ExchangeHouse from "./ExchangeHouse";
import FlexCol from "../../../../common/FlexCol";
import API, { action } from "../../../../Api";

export default function CompanyBank() {
  const [companyBankList, setCompanyBankList] = useState([]);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [companyBankDetailsPop, setCompanyBankDetailsPop] = useState(false);
  const [wpsConfigPop, setWpsConfigPop] = useState(false);
  const [exchangeHousePop, setExchangeHousePop] = useState(false);
  const { t } = useTranslation();
  const [companyDetails, setCompanyDetails] = useState(null);
  const handleOnclick = (item) => {
    if (item.id === 1) {
      setCompanyBankDetailsPop(true);
    } else if (item.id === 2) {
      setWpsConfigPop(true);
    } else if (item.id === 3) {
      setExchangeHousePop(true);
    }
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
        setCompanyDetails(result.result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompanyDetails();
  }, []);

  const CompanyBank = [
    {
      id: 1,
      title: t("Company Bank Details"),
      description: t("General_Bank_Details"),
      subdata: [
        {
          id: 1,
          icon: <PiUserFocusFill size={24} />,
          subTitle: t("Account_holder_name"),
          subTitleDescription:
            companyBankList.length > 0
              ? companyBankList[0].accountHolderName
              : "--",
        },
        {
          id: 2,
          icon: <PiArticleFill size={20} />,
          subTitle: t("IBAN/ACC NO"),
          subTitleDescription:
            companyBankList.length > 0 ? companyBankList[0].iban : "--",
        },
        {
          id: 3,
          icon: <PiBankFill size={20} />,
          subTitle: t("Bank_Name"),
          subTitleDescription:
            companyBankList.length > 0 ? companyBankList[0].bankName : "--",
        },
        {
          id: 4,
          icon: <PiFilesFill size={20} />,
          subTitle:
            parseInt(companyDetails?.isPFESIenabled) === 0
              ? t("Routing_Code")
              : "IFSC Code",
          subTitleDescription:
            companyBankList.length > 0 ? companyBankList[0].routingCode : "--",
        },
        {
          id: 5,
          icon: <PiFileTextFill size={20} />,
          subTitle: t("Trading_License"),
          subTitleDescription:
            companyBankList.length > 0
              ? companyBankList[0].tradingLicense
              : "--",
        },
      ],
    },
    {
      id: 2,
      title: t("Wps_config"),
      description: t("Wps_configuration_details"),
      subdata: [
        {
          id: 1,
          icon: <PiFilesFill size={20} />,
          subTitle: t("Establishment_id"),
          subTitleDescription:
            companyBankList.length > 0
              ? companyBankList[0].wpsEstablishementId
              : "--",
        },
        {
          id: 2,
          icon: <PiNewspaperClippingFill size={20} />,
          subTitle: t("Employer_Reference"),
          subTitleDescription:
            companyBankList.length > 0
              ? companyBankList[0].wpsEmployerReference
              : "--",
        },
        {
          id: 3,
          icon: <PiVaultFill size={20} />,
          subTitle: t("Employer_bank_code"),
          subTitleDescription:
            companyBankList.length > 0
              ? companyBankList[0].wpsEmployerBankCode
              : "--",
        },
      ],
    },
    {
      id: 3,
      title: t("Exchange_House"),
      description: t("Exchange_house_details"),
      subdata: [
        {
          id: 1,
          icon: <PiFilesFill size={20} />,
          subTitle: t("Establishment_id"),
          subTitleDescription:
            companyBankList.length > 0
              ? companyBankList[0].exchangeEstablishementId
              : "--",
        },
        {
          id: 2,
          icon: <PiNewspaperClippingFill size={20} />,
          subTitle: t("Employer_bank_code"),
          subTitleDescription:
            companyBankList.length > 0
              ? companyBankList[0].exchangeEmployerBankCode
              : "--",
        },
        {
          id: 3,
          icon: <PiVaultFill size={20} />,
          subTitle: t("Employer_Reference"),
          subTitleDescription:
            companyBankList.length > 0
              ? companyBankList[0].exchangeEmployerReference
              : "--",
        },
      ],
    },
  ];

  const getCompanyBankDetails = async () => {
    // setemployeeList(employeeDetails);

    try {
      const result = await Payrollaction(PAYROLLAPI.GET_COMPANYBANK_DETAILS, {
        companyId: companyId,
      });
      setCompanyBankList(result.result || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompanyBankDetails();
  }, []);

  return (
    <FlexCol>
      {CompanyBank.map((item) => (
        <div key={item.id} className="borderb rounded-lg dark:text-white">
          <div className="flex items-center vhcenter px-6 py-2">
            <span>
              <h1 className="font-semibold text-sm 2xl:text-base dark:!text-white">
                {item.title}
              </h1>
              <p className="para mb-1">{item.description}</p>
            </span>

            <ButtonClick
              icon={<RiEdit2Fill />}
              buttonName={t(`Edit`)}
              BtnTypeBtnType={"text"}
              className="ltr:ml-auto rtl:mr-auto"
              handleSubmit={() => {
                handleOnclick(item);
              }}
            />
          </div>
          <div className="divider-h" />

          <div className="items-center justify-between group gap-4 grid grid-cols-2 px-6 py-3">
            {item.subdata.map((subContent) => (
              <div className="flex items-center gap-4 mt-3" key={subContent.id}>
                <div className="flex items-center justify-center text-gray-400 w-8 h-8 text-sm transition-all duration-300 bg-slate-100 dark:bg-dark border rounded-md 2xl:w-10 2xl:h-10 border-secondaryWhite dark:border-secondaryDark dark:text-white 2xl:text-lg">
                  {subContent.icon}
                </div>
                <div className="flex flex-col gap-0.5 2xl:gap-1.5">
                  <p className="para">{subContent.subTitle}</p>
                  <p className="text-[10px] font-semibold text-black 2xl:text-base dark:text-white">
                    {subContent.subTitleDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {companyBankDetailsPop && (
        <BankDetails
          open={companyBankDetailsPop}
          close={() => {
            setCompanyBankDetailsPop(false);
          }}
          refresh={() => {
            getCompanyBankDetails();
          }}
          updateData={companyBankList}
        />
      )}

      {wpsConfigPop && (
        <WpsConfig
          open={wpsConfigPop}
          close={() => {
            setWpsConfigPop(false);
          }}
          refresh={() => {
            getCompanyBankDetails();
          }}
          updateData={companyBankList}
        />
      )}

      {exchangeHousePop && (
        <ExchangeHouse
          open={exchangeHousePop}
          close={() => {
            setExchangeHousePop(false);
          }}
          refresh={() => {
            getCompanyBankDetails();
          }}
          updateData={companyBankList}
        />
      )}
    </FlexCol>
  );
}
