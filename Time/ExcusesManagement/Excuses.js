import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "../../common/BreadCrumbs";
import { DatePicker, Flex } from "antd";
import FlexCol from "../../common/FlexCol";
import TableAnt from "../../common/TableAnt";
import { excuseHeader } from "../../data";
import API, { action } from "../../Api";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function Excuses() {
  const { t } = useTranslation();

  const [navigationValue, setNavigationValue] = useState(t("Excuses"));
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [monthAndyear, setMonthAndYear] = useState(null);
  const [excusesList, setExcusesList] = useState([]);
  const { MonthPicker } = DatePicker;

  const breadcrumbItems = [{ label: t("Excuses") }];

  const getExcuse = async () => {
    const result = await action(API.GET_REQULARIZE, {
      neededYearAndMonth: monthAndyear,
      employeeId: employeeId,
    });
    console.log(result);
    setExcusesList(result.result);
  };

  useEffect(() => {
    getExcuse();
  }, [monthAndyear]);

  return (
    <FlexCol>
      <Flex justify="space-between">
        <Breadcrumbs
          items={breadcrumbItems}
          description={t("main_dsc_excuses")}
        />
      </Flex>

      <TableAnt
        data={excusesList}
        header={excuseHeader}
        actionID="employeeRegularizationId"
        path="Regularizations_Details"
        navigationValue={navigationValue}
        headerTools={true}
        inputType={[
          {
            id: 1,
            type: (
              <MonthPicker
                picker="month"
                className={" w-36"}
                onChange={(e, i) => {
                  setMonthAndYear(i);
                  console.log(i);
                }}
              />
            ),
          },
        ]}
      />
    </FlexCol>
  );
}
