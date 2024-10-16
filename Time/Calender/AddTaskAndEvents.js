import React, { useState } from "react";
import DrawerPop from "../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import FlexCol from "../../common/FlexCol";
import TabsNew from "../../common/TabsNew";
import FormInput from "../../common/FormInput";

export default function AddTaskAndEvents({
  open,
  close = () => { },
  updateId,
  companyDataId,
  refresh,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [tabValue, setTabValue] = useState("event");

  const handleClose = () => {
    close(false);
  };
  const tabData = [
    {
      id: 1,
      title: t("Event"),
      value: "event",
      //   content: <CardPersonal data={employeeInfo} />,
    },
    {
      id: 2,
      title: t("Tasks"),
      value: "tasks",
    },
  ];
  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        handleClose();
        close(e);
      }}
      contentWrapperStyle={{
        maxWidth: "540px",
      }}
      handleSubmit={(e) => {
        // console.log(e);
        //   formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        //   UpdateIdBasedCountry();
      }}
      header={[
        !UpdateBtn ? t("Add_Event") : t("Update_Event"),
        !UpdateBtn ? t("Add_a_New_Event") : t("Update_Selected_Event"),
      ]}
      footerBtn={[
        t("Cancel"),
        t("Save"),
      ]}
    >
      <FlexCol>
        <TabsNew
          tabs={tabData}
          tabClick={(e) => {
            setTabValue(e);
            console.log(e);
          }}
        />

        {tabValue === "event" ? (
          <FlexCol className={"grid grid-cols-2"}>
            <FormInput title="Title" grid=" col-span-2" />
            <FormInput title="Date" grid=" col-span-2" />
            <FormInput title="From" />
            <FormInput title="To" />
            <FormInput title="Participants" grid=" col-span-2" />
            <FormInput title="Platform" />
            <FormInput title="Link" />
            <FormInput title="Location" grid=" col-span-2" />
          </FlexCol>
        ) : (
          <FlexCol>
            <FormInput title="Title" />
          </FlexCol>
        )}
      </FlexCol>
    </DrawerPop>
  );
}
