import React, { useEffect, useMemo, useRef, useState } from "react";
import DrawerPop from "../common/DrawerPop";
import { useTranslation } from "react-i18next";
import FlexCol from "../common/FlexCol";
import SearchBox from "../common/SearchBox";
import CheckBoxInput from "../common/CheckBoxInput";

export default function PayrollFilterDrawer({
    open,
    filterArray,
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
                t("Apply Filters"),
                t("Apply Filters"),
            ]}
            footerBtn={[t("Cancel"), t("Done")]}
        >
            <FlexCol>
                <div className="flex flex-col gap-1">
                    <p className="font-semibold text-xs 2xl:text-sm">Search Filters</p>
                    <SearchBox
                        placeholder='search here...'
                    />
                </div>
                <div className="flex flex-col gap-6">
                    {filterArray?.map((filter, index) => (
                        <div key={index}>
                            <div className="font-semibold text-xs 2xl:text-sm py-4">{filter?.category}</div>
                            <ul className="flex flex-col gap-3">
                                {filter?.options.map((option, idx) => (
                                    <li key={idx} className="font-medium text-[10px] 2xl:text-xs flex items-center justify-between ">
                                        <p className="flex items-center gap-1">
                                            <CheckBoxInput />
                                            <p>{option.name}</p>
                                        </p>
                                        {option.time && (
                                            < p className="flex items-center rounded-xl px-2 py-0.5 w-fit bg-slate-200 dark:bg-grey">
                                                <span>{option.time}</span>
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </FlexCol>
        </DrawerPop >
    )
}
