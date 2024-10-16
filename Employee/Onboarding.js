import React, { useState } from "react";
import FlexCol from "../common/FlexCol";
import { Flex } from "antd";
import Heading from "../common/Heading";
import ButtonClick from "../common/Button";
import TableAnt from "../common/TableAnt";
import AddPolicies from "../Policies/AddPolicies";
import { policiesHeader } from "../data";
import AddOnboarding from "./AddOnboarding";
import { useTranslation } from "react-i18next";

export default function Onboarding() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  return (
    <FlexCol>
      <Flex justify="space-between">
        <Heading
          title={t("Candidate_Onboarding")}
          description={t("Candidate_Onboarding_Description")}
        />
        <ButtonClick
          buttonName={t("Add_Candidate")}
          handleSubmit={() => {
            setShow(true);
            // console.log(true);
          }}
          BtnType="Add"
        />
      </Flex>
      <TableAnt
        data={[]}
        header={policiesHeader}
        actionID="policiesId"
        // updateApi={API.UPDATE_ONLY_ISACTIVE}
        path={t("Candidate")}
      />

      {show && (
        <AddOnboarding
          open={show}
          close={(e) => {
            setShow(e);
          }}
        />
      )}
    </FlexCol>
  );
}
