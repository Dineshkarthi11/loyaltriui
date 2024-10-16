import React, { useEffect, useMemo, useState } from "react";
import DrawerPop from "../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import TableAnt from "../../common/TableAnt";
import { BiometricDeviceList } from "../../data";
import ButtonClick from "../../common/Button";
import API, { action } from "../../Api";
import CreatePunchDevice from "./CreatePunchDevice";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function BiometricSettings({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
  data,
}) {
  const { t } = useTranslation();

  const [show, setShow] = useState(open);
  const [showPunchDevice, setShowPunchDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState();
  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  const [deviceList, setDeviceList] = useState([]);

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

  const getPunchDeviceById = async () => {
    setLoading(true);
    try {
      const result = await action(API.GET_ALL_PUNCH_DEVICE, {
        // id: 1, //updateId,
        companyId: companyId,
      });
      if (result.status === 200) {
        setDeviceList(
          result.result?.map((each) => ({
            id: each.punchMethodId,
            employeeName: each.employee?.map((data) => data.firstName),
            deviceName: each.deviceName,
            serialNumber: each.serialNumber,
            name: each.employee?.map((data) => data.firstName),
            multiImage: each.employee?.map((data) => data.profilePicture),
            employeeId: each.employee?.map((data) => data.employeeId),
          }))
        );
        setLoading(false);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getPunchDeviceById();
  }, []);

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
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
      updateBtn={isUpdate}
      updateFun={() => {}}
      header={["Punch Device", "Punch Device"]}
      footerBtn={[t("Cancel")]}
      footerBtnDisabled={loading}
    >
      <div className="flex flex-col  gap-6">
        <div className="flex flex-col justify-end gap-6 sm:flex-row">
          <ButtonClick
            buttonName={t(`Create New Device`)}
            handleSubmit={() => {
              setShowPunchDevice(true);
              console.log("set", true);
            }}
            BtnType="Add"
          />
        </div>
        <TableAnt
          data={deviceList}
          header={BiometricDeviceList}
          path={"Biometric"}
        />
      </div>
      {showPunchDevice && (
        <CreatePunchDevice
          open={showPunchDevice}
          close={() => {
            getPunchDeviceById();
            setShowPunchDevice(false);
          }}
        />
      )}
    </DrawerPop>
  );
}
