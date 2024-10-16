import React, { useMemo, useState } from 'react'
import DrawerPop from '../../common/DrawerPop';
import { useTranslation } from 'react-i18next';
import FlexCol from '../../common/FlexCol';
import FormInput from '../../common/FormInput';
import Heading2 from '../../common/Heading2';
import { GoDotFill } from 'react-icons/go';
import NewBadge from '../../common/NewBadge';

export default function EditTenure({
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


    const data = [
        { label: 'Remaining Balance', value: '21,000.00', value2: '21,000.00' },
        { label: 'Interest', value: '21,000.00', value2: '21,000.00' },
        { label: 'Installment Per Month', value: '21,000.00', value2: '21,000.00' },
        { label: 'Tenure', value: '21,000.00', value2: '21,000.00' },
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
                t("Edit Tenure"),
                t("Manage you companies here, and some lorem ipsu"),
            ]}
            footerBtn={[t("Cancel"), t("Save")]}
        >
            <FlexCol>
                <FormInput
                    title='Tenure(Months)'
                    placeholder='Tenure'
                />
                <div className='bg-primaryalpha/5 dark:bg-primaryalpha/15 rounded-lg p-2'>
                    <Heading2
                        title='Amount Breakups'
                        description='Allow staff to receive important notification via message'
                    />
                    <div className='mt-3 bg-white dark:bg-dark text-grey text-xs 2xl:text-sm rounded-lg px-2 py-3'>

                        <table className='w-full'>
                            <tbody className='flex flex-col'>
                                {data.map((item, index) => (
                                    <tr key={index} className='flex items-center justify-between'>
                                        <td>{item.label}</td>
                                        <td>
                                            <div className='flex items-center gap-3 justify-around min-w-[235px]'>
                                                <div>{item.value}</div>
                                                <div className='border-r text-grey !h-[30px]'></div>
                                                <div className='flex items-center gap-2'>
                                                    <div>{item.value2}</div>
                                                    <NewBadge
                                                        text='New'
                                                        mainClass="gap-1 bg-green-100 py-0.5 px-1.5 text-[8px] 2xl:text-[10px]"
                                                        subClassName1="size-1 bg-green-500 "
                                                        subClassName2="text-green-700"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </FlexCol>
        </DrawerPop>
    )
}
