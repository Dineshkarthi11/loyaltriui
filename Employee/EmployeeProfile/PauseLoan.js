import React, { useMemo, useState } from 'react'
import DrawerPop from '../../common/DrawerPop';
import { useTranslation } from 'react-i18next';
import FlexCol from '../../common/FlexCol';
import FormInput from '../../common/FormInput';

export default function PauseLoan({
    open,
    close = () => { },
}) {
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
            close={(e) => {
                handleClose();
            }}
            contentWrapperStyle={{
                width: "540px",
            }}
            header={[
                t("Pause Loan"),
                t("Manage you companies here, and some lorem ipsu"),
            ]}
            footerBtn={[t("Cancel"), t("Save")]}
        >
            <FlexCol>

                <FormInput
                    title='No of months to pause'
                />
                <div className='bg-primaryalpha/5 dark:bg-primaryalpha/15 rounded-lg p-2 text-xs 2xl:text-sm text-grey'>
                    Loan will be paused for the specified number of months
                </div>



            </FlexCol>

        </DrawerPop>
    )
}
