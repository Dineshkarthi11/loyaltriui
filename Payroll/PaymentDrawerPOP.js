import React, { useEffect, useMemo, useRef, useState } from "react";
import DrawerPop from "../common/DrawerPop";
import { useTranslation } from "react-i18next";
import FlexCol from "../common/FlexCol";
import SearchBox from "../common/SearchBox";
import CheckBoxInput from "../common/CheckBoxInput";
import FormInput from "../common/FormInput";
import Dropdown from "../common/Dropdown";
import DateSelect from "../common/DateSelect";
import TextArea from "../common/TextArea";

import img1 from "../../assets/images/PayrollTablePayment/Cash.png"
import img2 from "../../assets/images/PayrollTablePayment/Cheque.png"
import img3 from "../../assets/images/PayrollTablePayment/Bank.png"

export default function PaymentDrawerPOP({
    open,
    close = () => { },
}) {
    const { t } = useTranslation();
    const [show, setShow] = useState(open);
    const [method, setMethod] = useState('');


    useMemo(
        () =>
            setTimeout(() => {
                show === false && close(false);
            }, 800),
        [show]
    );

    const handleClose = () => {
        setShow(false);
    };

    const paymentMethods = [
        {
            id: 1,
            name: "Cash Payment",
            imgSrc: img1
        },
        {
            id: 2,
            name: "Cheque",
            imgSrc: img2
        },
        {
            id: 3,
            name: "Bank Payment(DBT)",
            imgSrc: img3
        }
    ];


    return (
        <DrawerPop
            open={show}
            close={(e) => {
                handleClose();
            }}
            contentWrapperStyle={{
                width: "540px",
            }}
            header={[
                t("Payment"),
                t("Payment"),
            ]}
            footerBtn={[t("Cancel"), t("Save")]}
        >
            <FlexCol>
                <Dropdown
                    title="Payment Cycle"
                    placeholder="Choose cycle"
                // options={""}
                />
                <div className="grid grid-cols-2 gap-4">
                    <DateSelect
                        title="Record Date"
                        placeholder="Choose date"
                    />
                    <FormInput
                        title="Amount"
                        placeholder="Amount"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <p className="font-medium text-xs 2xl:text-sm">Payment mode</p>
                    <div className="grid grid-cols-3 gap-3">
                        {paymentMethods.map((each, index) => (
                            <div key={index} className={`relative borderb rounded-lg px-2 py-1 ${method === each.id && "border-primary"}`}
                                onClick={() => {
                                    setMethod(each.id);
                                }}
                            >
                                <div className="flex flex-col gap-2">
                                    <img src={each.imgSrc} alt={each.name} className="w-7 h-7" />
                                    <p className="text-xs 2xl:text-sm font-medium">{each.name}</p>
                                </div>

                                <div
                                    className={`${method === each.id && "border-primary"
                                        } border-primaryalpha/30 border rounded-full w-fit right-1 top-1 absolute`}
                                >
                                    <div
                                        className={`font-semibold text-base w-3 h-3 border-2 border-white dark:border-white/10   rounded-full ${method === each.id &&
                                            "text-primary bg-primary"
                                            } `}
                                    ></div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>


                <FormInput
                    title="Reference Number"
                    placeholder="number"
                />
                <TextArea
                    title="Description"
                    placeholder="here"
                />
            </FlexCol>
        </DrawerPop >
    )
}
