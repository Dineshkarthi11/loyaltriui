import React, { useEffect, useMemo, useState } from "react";
import DrawerPop from "../common/DrawerPop";
import { useTranslation } from "react-i18next";
import Heading2 from "../common/Heading2";
import {
  PiCalendarBlank,
  PiCheckCircle,
  PiCheckCircleFill,
  PiCheckCircleLight,
  PiXCircle,
  PiXCircleFill,
} from "react-icons/pi";
import API, { action } from "../Api";
import { Alert, Button } from "antd";
import noimageavailable from "../../assets/images/noimageavailable.jpg";
import ButtonClick from "../common/Button";
import { IoCloudUploadOutline } from "react-icons/io5";
import CheckBoxInput from "../common/CheckBoxInput";
import FormInput from "../common/FormInput";
import { GiConsoleController } from "react-icons/gi";
import { useNotification } from "../../Context/Notifications/Notification";

export default function AssetRecoveringModal({
  open,
  close = () => {},
  updateId,
  offboardingId,
  refresh = () => {},
}) {
  // console.log("updteId", updateId);
  // console.log("offboardingId", offboardingId);
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const primaryColor = localStorage.getItem("mainColor");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  const [recoverdCount, setRecoverdCount] = useState("");
  const [notRecoverdCount, setNotrecoverdCount] = useState("");
  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  const [employeeList, setemployeeList] = useState([]);
  const [employeeasset, setEmployeeAsset] = useState([]);
  const [searchFilter, setSearchFilter] = useState(
    employeeList.map((each) => ({
      key: each.username,
      ...each,
    }))
  );

  const [saveAsset, setSaveAsset] = useState([]);

  const [searchValue, setSearchValue] = useState("");

  const handleClose = () => {
    setShow(false);
  };
  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  // const [selectedAsset, setSelectedAsset] = useState([]);
  const [files, setFiles] = useState([]);

  const [dataRecovered, setDataRecovered] = useState([]);
  const [Images, setImages] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [isDamaged, setIsDamaged] = useState(0);

  const [base64Images, setBase64Images] = useState([]);
  const [damageAmount, setDamageAmount] = useState(""); // New state
  const [damageNote, setDamageNote] = useState(""); // New state

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setImages((prevImages) => [...prevImages, ...files]);
  //   console.log(images,"images");
  // };
  const handleImageChange = async (e, assetIndex) => {
    const files = Array.from(e.target.files);
    const base64ImagesArray = await Promise.all(
      files.map((file) => fileToBase64(file))
    );
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles]; // Use array instead of object
      updatedFiles[assetIndex] = [
        ...(updatedFiles[assetIndex] || []),
        ...files,
      ];
      // console.log(updatedFiles, "qwerty");
      return updatedFiles;
    });
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[assetIndex] = [
        ...(updatedImages[assetIndex] || []),
        ...base64ImagesArray.map((base64, index) => ({
          name: files[index].name,
          base64,
        })),
      ];
      // console.log(updatedImages, "updatedImages");
      return updatedImages;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await action(
        API.SAVE_OFFBOARDING_EMPLOYEEASSETS,
        saveAsset
      );
      // console.log(response);
      if (response.status === 200) {
        openNotification("success", "Successful", response?.message);
        setTimeout(() => {
          handleClose();
        }, 1000);
        refresh(true);
        setLoading(false);
      } else {
        openNotification("error", "Failed", response?.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  // Function to handle changes in damage amount for each asset
  const handleDamageAmountChange = (e, assetTypeId) => {
    const value = e;
    // Update the damage amount state for the corresponding asset type ID
    setDamageAmount((prevState) => ({
      ...prevState,
      [assetTypeId]: value,
    }));
  };

  // Function to handle changes in damage note for each asset
  const handleDamageNoteChange = (e, assetTypeId) => {
    const value = e;
    // Update the damage note state for the corresponding asset type ID
    setDamageNote((prevState) => ({
      ...prevState,
      [assetTypeId]: value,
    }));
  };

  const handleMarkAsRecovered = (id, index) => {
    const assetToRecover = employeeasset.find(
      (asset) => asset.assetTypeId === id
    );
    const updatedData = employeeasset.filter(
      (asset) => asset.assetTypeId !== id
    );

    const assetDamageAmount = damageAmount[id] || null;
    const assetDamageNote = damageNote[id] || null;
    const assetFiles = files[index] || [];
    const assetImages = Images[index] || [];
    // console.log(assetFiles, "qwerty");
    // console.log(assetImages, "qwerty");

    // Clear images for the recovered asset
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index] = [];
      return updatedImages;
    });
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index] = [];
      return updatedFiles;
    });

    setEmployeeAsset(updatedData);
    // console.log("qwerty", updatedData);

    const newRecoveredAsset = {
      employeeId: updateId,
      offboardingId: offboardingId,
      assetId: assetToRecover.employeeAssetId,
      images: assetImages.map((img) => img.base64),
      damageStatus: isDamaged[id] ? 1 : 0,
      damageAmount: assetDamageAmount,
      damageNote: assetDamageNote,
      recoveryStatus: 1,
    };

    setDataRecovered((prevState) => [
      ...prevState,
      {
        ...assetToRecover,
        isDamaged: isDamaged[id],
        images: assetFiles, // Use files instead of assetImages
        damageAmount: assetDamageAmount,
        damageNote: assetDamageNote,
      },
    ]);

    setSaveAsset((prevState) => [...prevState, newRecoveredAsset]);
  };

  useEffect(() => {
    // console.log("qwerty:", dataRecovered);
  }, [dataRecovered]);

  useEffect(() => {
    // console.log("ASSETS", saveAsset);
  }, [saveAsset]);

  const handleRemoveImage = (index) => {
    setImages(Images.filter((_, i) => i !== index));
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleDamageChange = (value, assetTypeId) => {
    // console.log(value, "CheckBox");
    setIsDamaged((prevState) => ({
      ...prevState,
      [assetTypeId]: value,
    }));
  };

  useEffect(() => {
    if (searchValue) {
      setemployeeList([...searchFilter]);
    } else {
      getEmployee();
    }
  }, [searchFilter]);

  const getEmployee = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_ID_BASED_RECORDS, {
        id: updateId,
      });
      // console.log(result);
      const ArrayofEmployeelist = [result.result];
      setemployeeList(
        ArrayofEmployeelist.map((items) => ({
          id: items.employeeId,
          profile: items.profilePicture,
          name: `${items.firstName} ${items.lastName}`,
          joiningdate: items.joiningDate,
          designation: items.designation,
          empid: items.employeeId,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [data, setData] = useState([
    {
      id: 1345,
      product: "Apple Macbook Pro",
      productImage: "",
      modelNo: "278547",
      serialNo: "S2721QS",
      assignedDate: "05/01/2024",
      isDamaged: false,
      damageCost: "", // Placeholder for the cost, if available
      damageNote: "", // Placeholder for the note, if available
    },
    {
      id: 1326,
      product: "I Phone 14",
      productImage: "",
      modelNo: "27867",
      serialNo: "S2761PR",
      assignedDate: "05/01/2024",
      isDamaged: false,
      damageCost: "", // Placeholder for the cost, if available
      damageNote: "", // Placeholder for the note, if available
    },
  ]);
  const getOffboardingAsset = async () => {
    try {
      const result = await action(API.GET_OFFBOARDING_ASSET_OFFBOARDINGID, {
        offboardingId: offboardingId,
      });
      // console.log(result);
      // console.log(
      //   result.result.map((items) => ({
      //     employeeAssetId: items.assetTypeId,
      //     assetName: items.assetName,
      //     assetTypeId: items.assetTypeId,
      //     description: items.description,
      //     serialNo: items.serialNo,
      //     modifiedOn: items.modifiedOn,
      //     images: items.assetImages,
      //     isDamaged: items.damageStatus,
      //     damageAmount: items.damageAmount,
      //     damageNote: items.damageNote,
      //   })),
      //   "qwerty"
      // );
      setDataRecovered(
        result.result.map((items) => ({
          employeeAssetId: items.assetTypeId,
          assetName: `${items.assetName} ${items.assetTypeName}`,
          assetTypeId: items.assetTypeId,
          description: items.description,
          serialNo: items.serialNo,
          modifiedOn: items.modifiedOn,
          images: items.assetImages,
          isDamaged: items.damageStatus,
          damageAmount: items.damageAmount,
          damageNote: items.damageNote,
        }))
      );
      setNotrecoverdCount(result.result.length);
      // console.log(result.result.length, "length");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOffboardingAsset();
  }, [offboardingId]);
  const getEmployeeAssets = async () => {
    try {
      const result = await action(
        API.GET_EMPLOYEE_ASSETS_LIST,
        {
          employeeId: updateId,
        },
        // 
        
      );
      // console.log(result, "assets");

      const filteredAssets = result.result.filter(
        (asset) => asset.assetRecoveryCount === 0
      );

      const formattedAssets = filteredAssets.map((asset) => ({
        employeeAssetId: asset.employeeAssetId,
        assetTypeId: asset.assetTypeId,
        assetName: `${asset.assetName} ${asset.assetTypeName}`,
        description: asset.description,
        serialNo: asset.serialNo,
        modifiedOn: asset.modifiedOn,
      }));
      setRecoverdCount(formattedAssets.length);
      // console.log(formattedAssets.length, "length");

      setEmployeeAsset(formattedAssets);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEmployee();
    getEmployeeAssets();
  }, []);

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
      placement="bottom"
      contentWrapperStyle={{
        position: "absolute",
        height: "100%",
        top: 0,

        // left: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        borderRadius: 0,
        borderTopLeftRadius: "0px !important",
        borderBottomLeftRadius: 0,
        // background:"#F8FAFC"
      }}
      background="#F8FAFC"
      // handleSubmit={(e) => {
      //   console.log("gggggg")
      //   handleSubmit()
      // }}
      buttonClick={handleSubmit}
      bodyPadding={0}
      header={[
        t("Offboarding - Asset Recovery"),
        t("Manage you company assets recovery here"),
      ]}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
      saveAndContinue={true}
    >
      <div className="flex flex-col gap-6">
        {employeeList?.map((employee) => (
          <div className="lg:h-[93px] h-full bg-white/50 dark:bg-[#242424] border-b border-gray-300 dark:border-gray-300/20 p-4">
            <div className="max-w-[890px] mx-auto flex items-center flex-wrap justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="size-[52px] rounded-full overflow-hidden bg-primaryalpha/10 vhcenter">
                  {employee.profile ? (
                    <img
                      // src={record.logo}
                      src={employee.profile}
                      className="object-cover object-center w-full h-full"
                      alt="userimage"
                    />
                  ) : (
                    <p className="font-semibold  text-primary">
                      {employee.name?.charAt(0).toUpperCase()}
                    </p>
                  )}
                </div>
                <div>
                  <p>
                    {" "}
                    <span className="text-sm 2xl:text-base font-semibold dark:text-white">
                      {employee.name}
                    </span>
                    <span className="ml-4 text-primary px-2.5 py-0.5 bg-primaryalpha/10 dark:bg-primaryalpha/30 rounded-full text-xs 2xl:text-sm font-medium">
                      EMP ID: #{employee.empid || "--"}
                    </span>
                  </p>
                  <p className="text-grey text-xs 2xl:text-sm">
                    {employee.designation}
                  </p>
                </div>
              </div>

              {/* Recovered  */}
              <div className="p-[5px] pr-4 bg-[#E4F7DC] rounded-lg flex items-center gap-2">
                <div className="bg-[#D5F8C7] vhcenter rounded-[4px] size-[42px]">
                  <PiCheckCircle className="text-2xl text-[#006D32]" />
                </div>
                <div>
                  <p className="text-[10px] 2xl:text-xs opacity-70">
                    Recovered
                  </p>
                  <p className="text-sm 2xl:text-base font-semibold">
                    {employeeasset.length || "0"}
                  </p>
                </div>
              </div>
              {/* Not recovered  */}
              <div className="p-[5px] pr-4 bg-[#FCE9E9] rounded-lg flex items-center gap-2">
                <div className="bg-[#F8D8D8] vhcenter rounded-[4px] size-[42px]">
                  <PiXCircle className="text-2xl text-[#C10000]" />
                </div>
                <div>
                  <p className="text-[10px] 2xl:text-xs opacity-70">
                    Not Recovered
                  </p>
                  <p className="text-sm 2xl:text-base font-semibold">
                    {dataRecovered.length || "0"}
                  </p>
                </div>
              </div>
              <div className="p-[5px] pr-4 rounded-lg flex items-center gap-2">
                <div className="bg-white borderb vhcenter rounded-md size-[42px]">
                  <PiCalendarBlank className="text-2xl" />
                </div>
                <div className="dark:text-white">
                  <p className="text-[10px] 2xl:text-xs opacity-70">
                    Joining Date
                  </p>
                  <p className="text-sm 2xl:text-base font-semibold">
                    {new Date(employee.joiningdate).toLocaleDateString(
                      "en-GB"
                    ) || "--"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="max-w-[890px] px-4 lg:p-0 w-full mx-auto flex flex-col gap-6 mb-6">
          <Alert
            message="Warning Message:"
            description="Attention: After submission, please refrain from causing any further damage to the assets. Any additional damage could affect the full and final settlement process."
            type="warning"
            showIcon
            closable
          />
          <div className="bg-white dark:bg-dark p-4 rounded-[10px] borderb flex flex-col gap-6">
            <Heading2
              title="Asset to be recovered"
              description="Review and manage assets to be returned by the departing employee."
              count={employeeasset.length}
              countClassname="text-[#C10000] bg-[#FCE9E9] text-xs px-2 py-1.5 rounded-md"
            />
            <div className="flex flex-col gap-6">
              {employeeasset?.map((item, index) => (
                <div
                  className="borderb rounded-2xl p-2 flex flex-col gap-4"
                  key={index}
                >
                  <div className="p-1 flex items-center flex-col md:flex-row gap-3 md:gap-0 justify-between bg-primaryalpha/[0.02] rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-[102px] h-[82px] rounded overflow-hidden">
                        <img
                          src={
                            item.productImage
                              ? item.productImage
                              : noimageavailable
                          }
                          alt=""
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="flex items-center flex-wrap gap-2">
                          <span className="text-sm 2xl:text-base font-semibold dark:text-white">
                            {item.assetName}
                          </span>
                          <span className="text-[10px] 2xl:text-xs px-2 py-0.5 leading-[18px] text-primary font-medium bg-primaryalpha/5 dark:bg-primaryalpha/10 rounded-full">
                            ID: #{item.assetTypeId}
                          </span>
                        </p>
                        <div className="grid grid-cols-3">
                          <div>
                            <p className="text-[10px] 2xl:text-xs opacity-70 dark:text-white">
                              Model no
                            </p>
                            <p className="text-[10px] 2xl:text-xs font-medium dark:text-white">
                              {item.description || "--"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] 2xl:text-xs opacity-70 dark:text-white">
                              Serial no
                            </p>
                            <p className="text-[10px] 2xl:text-xs font-medium dark:text-white">
                              {item.serialNo || "--"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] 2xl:text-xs opacity-70 dark:text-white">
                              Assigned Date
                            </p>
                            <p className="text-[10px] 2xl:text-xs font-medium dark:text-white">
                              {item.modifiedOn || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col gap-1 items-end">
                          <div className="flex gap-4">
                            {Images[index]
                              ?.slice(0, 2)
                              .map((image, imageIndex) => (
                                <div
                                  key={imageIndex}
                                  className="relative p-1 w-[86px] rounded-[4px] bg-white borderb flex items-center gap-1"
                                >
                                  <div className=" size-6 rounded-[2px] overflow-hidden shrink-0">
                                    <img
                                      src={image.base64}
                                      alt={`preview-${imageIndex}`}
                                      className="w-full h-full object-cover object-center"
                                    />
                                  </div>
                                  <span className="text-grey text-[10px] 2xl:text-xs truncate">
                                    {image.name}
                                  </span>
                                  <button
                                    className="absolute -top-1 -right-1 text-primary"
                                    onClick={() =>
                                      handleRemoveImage(index, imageIndex)
                                    }
                                  >
                                    <PiXCircleFill size={16} />
                                  </button>
                                </div>
                              ))}
                            {showMore &&
                              Images[index]
                                ?.slice(2)
                                .map((image, imageIndex) => (
                                  <div
                                    key={imageIndex + 2}
                                    className="relative p-1 w-[86px] rounded-[4px] bg-white borderb flex items-center gap-1"
                                  >
                                    <div className=" size-6 rounded-[2px] overflow-hidden shrink-0">
                                      <img
                                        src={image.base64}
                                        alt={`preview-${imageIndex + 2}`}
                                        className="w-full h-full object-cover object-center"
                                      />
                                    </div>
                                    <span className="text-grey text-[10px] 2xltext-xs truncate">
                                      {image.name}
                                    </span>
                                    <button
                                      className="absolute -top-1 -right-1 text-primary"
                                      onClick={() =>
                                        handleRemoveImage(index, imageIndex + 2)
                                      }
                                    >
                                      <PiXCircleFill size={16} />
                                    </button>
                                  </div>
                                ))}
                          </div>
                          {Images[index]?.length > 2 && (
                            <button
                              onClick={toggleShowMore}
                              className="text-primary font-medium text-[10px] 2xl:text-xs underline"
                            >
                              {showMore
                                ? "Show less"
                                : `${Images[index].length - 2} more image${
                                    Images[index].length - 2 > 1 ? "s" : ""
                                  }`}
                            </button>
                          )}
                        </div>
                        {Images?.length < 4 && (
                          <div className="relative inline-block">
                            <Button className="relative">
                              <IoCloudUploadOutline />
                              <span className="ml-2">Upload Image</span>{" "}
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => handleImageChange(e, index)}
                              />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between gap-[8px] py-2">
                    <div className="flex flex-col items-baseline shrink-0">
                      <CheckBoxInput
                        value={isDamaged[item.assetTypeId]}
                        titleRight="Is it Damaged?"
                        change={(e) => handleDamageChange(e, item.assetTypeId)}
                      />
                      <p className="text-[10px] 2xl:text-xs text-grey font-medium">
                        Enter cost and note
                      </p>
                    </div>

                    {isDamaged[item.assetTypeId] ? (
                      <div className="flex flex-col md:flex-row items-baseline gap-4">
                        <div className="flex flex-col md:flex-row items-baseline gap-4">
                          <FormInput
                            placeholder="Amount.."
                            change={(e) =>
                              handleDamageAmountChange(e, item.assetTypeId)
                            }
                            value={damageAmount[item.assetTypeId] || ""} // Ensure this defaults to an empty string
                          />
                          <FormInput
                            placeholder="Note here.."
                            change={(e) =>
                              handleDamageNoteChange(e, item.assetTypeId)
                            }
                            value={damageNote[item.assetTypeId] || ""} // Ensure this defaults to an empty string
                          />
                        </div>
                      </div>
                    ) : null}

                    <ButtonClick
                      buttonName={"Mark as recovered"}
                      icon={<PiCheckCircle />}
                      handleSubmit={() =>
                        handleMarkAsRecovered(item.assetTypeId, index)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-dark p-4 rounded-[10px] borderb flex flex-col gap-6">
            <Heading2
              title="Recovered Asset"
              description="Track assets successfully returned and inspected for condition"
              count={dataRecovered.length}
              countClassname="text-[#006D32] bg-[#E4F7DC] text-xs px-2 py-1.5 rounded-md"
            />
            <div className="flex flex-col gap-6">
              {dataRecovered?.map((item, index) => (
                <div
                  className="borderb rounded-2xl p-2 flex flex-col gap-4"
                  key={index}
                >
                  <div className="p-1 flex items-center flex-col md:flex-row gap-3 md:gap-0 justify-between bg-primaryalpha/[0.02] rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-[102px] h-[82px] rounded overflow-hidden">
                        <img
                          src={
                            item.productImage
                              ? item.productImage
                              : noimageavailable
                          }
                          alt=""
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="flex items-center flex-wrap gap-2">
                          <span className="text-sm 2xl:text-base font-semibold dark:text-white">
                            {item.assetName}
                          </span>
                          <span className="text-[10px] 2xl:text-xs px-2 py-0.5 leading-[18px] text-primary font-medium bg-primaryalpha/5 dark:bg-primaryalpha/10 rounded-full">
                            ID: #{item.assetTypeId}
                          </span>
                        </p>
                        <div className="grid grid-cols-3">
                          <div>
                            <p className="text-[10px] 2xl:text-xs opacity-70 dark:text-white">
                              Model no
                            </p>
                            <p className="text-[10px] 2xl:text-xs font-medium dark:text-white">
                              {item.description}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] 2xl:text-xs opacity-70 dark:text-white">
                              Serial no
                            </p>
                            <p className="text-[10px] 2xl:text-xs font-medium dark:text-white">
                              {item.serialNo}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] 2xl:text-xs opacity-70 dark:text-white">
                              Assigned Date
                            </p>
                            <p className="text-[10px] 2xl:text-xs font-medium dark:text-white">
                              {item.modifiedOn}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col gap-1 items-end">
                          <div className="flex gap-4">
                            {(item.images || [])
                              .slice(0, 2)
                              .map((image, imageIndex) => (
                                <div
                                  key={imageIndex}
                                  className="relative p-1 w-[86px] rounded-[4px] bg-white borderb flex items-center gap-1"
                                >
                                  <div className="size-6 rounded-[2px] overflow-hidden shrink-0">
                                    <img
                                      src={
                                        typeof image === "string"
                                          ? image
                                          : URL.createObjectURL(image)
                                      }
                                      alt={`preview-${imageIndex}`}
                                      className="w-full h-full object-cover object-center"
                                    />
                                  </div>
                                  <span className="text-grey text-[10px] 2xl:text-xs truncate">{`Image ${
                                    imageIndex + 1
                                  }`}</span>
                                  <button className="absolute -top-1 -right-1 text-primary">
                                    <PiCheckCircleFill size={16} />
                                  </button>
                                </div>
                              ))}
                            {showMore &&
                              (item.images || [])
                                .slice(2)
                                .map((image, imageIndex) => (
                                  <div
                                    key={imageIndex + 2}
                                    className="relative p-1 w-[86px] rounded-[4px] bg-white borderb flex items-center gap-1"
                                  >
                                    <div className="size-6 rounded-[2px] overflow-hidden shrink-0">
                                      <img
                                        src={
                                          typeof image === "string"
                                            ? image
                                            : URL.createObjectURL(image)
                                        }
                                        alt={`preview-${imageIndex + 2}`}
                                        className="w-full h-full object-cover object-center"
                                      />
                                    </div>
                                    <span className="text-grey text-[10px] 2xl:text-xs truncate">{`Image ${
                                      imageIndex + 3
                                    }`}</span>
                                    <button className="absolute -top-1 -right-1 text-primary">
                                      <PiCheckCircleFill size={16} />
                                    </button>
                                  </div>
                                ))}
                          </div>
                          {(item.images || []).length > 2 && (
                            <button
                              onClick={toggleShowMore}
                              className="text-primary font-medium text-[10px] 2xl:text-xs underline"
                            >
                              {showMore
                                ? "Show less"
                                : `${item.images.length - 2} more image${
                                    item.images.length - 2 > 1 ? "s" : ""
                                  }`}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between gap-[8px] py-2">
                    <div className="flex flex-col items-baseline">
                      <CheckBoxInput
                        value={parseInt(item.isDamaged) === 1}
                        titleRight="Is it Damaged?"
                      />
                      <p className="text-[10px] 2xl:text-xs text-grey font-medium">
                        Enter cost and note
                      </p>
                    </div>
                    {parseInt(item.isDamaged) === 1 && (
                      <div className="flex flex-col items-baseline md:flex-row gap-4">
                        <FormInput
                          placeholder="Amount.."
                          value={item.damageAmount || ""}
                          onChange={(e) =>
                            handleDamageAmountChange(e, item.assetTypeId)
                          }
                        />
                        <FormInput
                          placeholder="Note here.."
                          value={item.damageNote || ""}
                          onChange={(e) =>
                            handleDamageNoteChange(e, item.assetTypeId)
                          }
                        />
                      </div>
                    )}

                    <p className="text-[10px] 2xl:text-xs text-[#329C00] font-medium flex items-center gap-1">
                      <PiCheckCircleLight size={20} />
                      Successfully Recovered
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DrawerPop>
  );
}
