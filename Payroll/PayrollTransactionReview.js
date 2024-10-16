import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next';
import DrawerPop from '../common/DrawerPop';
import mnthoverview from "../../assets/images/mnthoverview.png";
import TabsNew from '../common/TabsNew';
import { Avatar } from 'antd';
import user from "../../assets/images/user1.jpeg"
import ApprovalReview from './PayrollTransactionApproval/ApprovalReview';
function PayrollTransactionReview({ open = "",
    close = () => { }, }) {
    const { t } = useTranslation();
    const [show, setShow] = useState(open);
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
   
    return (
        <DrawerPop
            open={show}
            background="#F8FAFC"
            avatar={true}
            src={mnthoverview}
            contentWrapperStyle={{
                position: "absolute",
                height: "100%",
                top: 0,
                bottom: 0,
                right: 0,
                width: "100%",
                borderRadius: 0,
                borderTopLeftRadius: "0px !important",
                borderBottomLeftRadius: 0,
            }}
            close={handleClose}
            header={[
                t("Payroll Transactions"),
                t("Manage pending payroll approvals for accurate payroll processing"),
            ]}
            footerBtn={[t("Cancel"), t("Save Revision")]}
        >
            <div className="flex flex-col gap-10  max-w-[1045px] mx-auto">
                <ApprovalReview />
            </div>
        </DrawerPop>
    )
}

export default PayrollTransactionReview
