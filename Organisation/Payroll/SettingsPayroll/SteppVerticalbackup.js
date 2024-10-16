import React, { useEffect, useState } from "react";
import ButtonClick from "../../../common/Button";
import {
  PiNoteBlankFill,
  PiPlus,
  PiRanking,
  PiStack,
  PiTrash,
  PiUsersThree,
  PiX,
} from "react-icons/pi";
import { Alert, Tooltip } from "antd";
import { motion } from "framer-motion";
import SelectWithTab from "../../../common/SelectWithTab";
import { t } from "i18next";
import { FaAsterisk } from "react-icons/fa6";

const VerticalStepperBackup = ({
  employees,
  change = () => {},
  templateRules,
  error,
}) => {
  const dataSources = {
    levels: [
      {
        value: "1",
        label: "Level 1",
        icon: <PiRanking />,
      },
      {
        value: "2",
        label: "Level 2",
        icon: <PiRanking />,
      },
      {
        value: "3",
        label: "Level 3",
        icon: <PiRanking />,
      },
      {
        value: "4",
        label: "Level 4",
        icon: <PiRanking />,
      },
    ],
    employees: employees,
  };

  const tabs = [
    { id: 1, title: t("Levels"), value: "levels", icon: <PiStack size={18} /> },
    {
      id: 2,
      title: t("Employees"),
      value: "employees",
      icon: <PiUsersThree size={18} />,
    },
  ];
  const primaryColor = localStorage.getItem("mainColor");

  // Initialize state to store the steps
  const [steps, setSteps] = useState([
    {
      id: 1,
      approvalBlocks: [
        {
          dropdowns: [{ isLevel: 0, id: "" }], // Initial dropdown for the first approval block
        },
      ],
    },
  ]);

  const [remainingDataSources, setRemainingDataSources] = useState(dataSources);
  const [selectedLevels, setSelectedLevels] = useState([]);
  useEffect(() => {
    setRemainingDataSources(dataSources);
  }, [employees]);
  const filterDataSources = (stepId, blockId, data) => {
    const usedIds = steps.reduce((acc, step) => {
      step.approvalBlocks.forEach((block) => {
        block.dropdowns.forEach((dropdown) => {
          acc.push({ id: dropdown.id, isLevel: dropdown.isLevel });
        });
      });
      return acc;
    }, []);

    const filteredLevels = dataSources?.levels?.filter(
      (level) =>
        !usedIds?.some((used) => used.isLevel === 1 && used.id === level.value)
    );
    const filteredEmployees = dataSources?.employees?.filter(
      (employee) =>
        !usedIds?.some(
          (used) => used.isLevel === 0 && used.id === employee.value
        )
    );

    setRemainingDataSources({
      levels: filteredLevels,
      employees: filteredEmployees,
    });
  };
  // const filterDataSources = () => {
  //   const usedIds = steps.reduce((acc, step) => {
  //     step.approvalBlocks.forEach((block) => {
  //       block.dropdowns.forEach((dropdown) => {
  //         acc.push({
  //           id: dropdown.id,
  //           isLevel: dropdown.isLevel,
  //           stepIndex: step.stepIndex,
  //         });
  //       });
  //     });
  //     return acc;
  //   }, []);

  //   const currentStepIndex = steps.findIndex((step) =>
  //     step.approvalBlocks.some((block) =>
  //       block.dropdowns.some((dropdown) => dropdown.isLevel === 1)
  //     )
  //   );

  //   const currentStepLevel = usedIds.find(
  //     (used) => used.isLevel === 1 && used.stepIndex === currentStepIndex
  //   );

  //   const nextStepLevel = usedIds.find(
  //     (used) => used.isLevel === 1 && used.stepIndex === currentStepIndex + 1
  //   );

  //   const filteredLevels = dataSources.levels.filter((level) => {
  //     const levelValue = parseInt(level.value);

  //     if (nextStepLevel) {
  //       const nextLevel = parseInt(nextStepLevel.id);
  //       if (currentStepLevel) {
  //         const currentLevel = parseInt(currentStepLevel.id);

  //         return levelValue <= currentLevel && levelValue < nextLevel;
  //       } else {

  //         return levelValue < nextLevel;
  //       }
  //     } else {
  //       if (currentStepLevel) {
  //         const currentLevel = parseInt(currentStepLevel.id);

  //         return levelValue <= currentLevel;
  //       } else {
  //         return true;
  //       }
  //     }
  //   });

  //   const filteredEmployees = dataSources.employees.filter(
  //     (employee) =>
  //       !usedIds.some((used) => used.isLevel === 0 && used.id === employee.value)
  //   );

  //   setRemainingDataSources({
  //     levels: filteredLevels,
  //     employees: filteredEmployees,
  //   });
  //   console.log(dataSources, "employees");
  // };

  //  useEffect(()=>{
  //     filterDataSources()
  //  },[employees])
  const addNewApprovalBlock = (stepIndex) => {
    const newBlock = { dropdowns: [{ isLevel: 0, id: "" }] };
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].approvalBlocks.push(newBlock);
    setSteps(updatedSteps);
  };

  const addNewDropdown = (stepIndex, blockIndex) => {
    const newDropdown = { isLevel: 0, id: "" };
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].approvalBlocks[blockIndex].dropdowns.push(
      newDropdown
    );
    setSteps(updatedSteps);
  };

  const deleteApprovalBlock = (stepIndex, blockIndex) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].approvalBlocks.splice(blockIndex, 1);
    setSteps(updatedSteps);
    setRemainingDataSources(dataSources)
    // filterDataSources()
  };
  
  const deleteDropdown = (stepIndex, blockIndex, dropdownIndex) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].approvalBlocks[blockIndex].dropdowns.splice(
      dropdownIndex,
      1
    );
    setSteps(updatedSteps);
    setRemainingDataSources(dataSources)
    // filterDataSources()
  };

  // Function to handle dropdown selection change
  const handleSelectChange = (
    stepIndex,
    blockIndex,
    dropdownIndex,
    value,
    tabValue
  ) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].approvalBlocks[blockIndex].dropdowns[
      dropdownIndex
    ] = {
      isLevel: tabValue === "levels" ? 1 : 0,
      id: value,
    };

    if (tabValue === "levels") {
      setSelectedLevels((prevSelectedLevels) => [...prevSelectedLevels, value]);
    }

    setSteps(updatedSteps);
    filterDataSources();
  };

  const getFilteredTabs = (stepIndex, blockIndex, dropdownIndex) => {
    const currentStep = steps[stepIndex];
    const isLevelSelected = currentStep.approvalBlocks.some((block, bIndex) =>
      block.dropdowns.some(
        (dropdown, dIndex) =>
          dropdown.isLevel === 1 &&
          !(bIndex === blockIndex && dIndex === dropdownIndex)
      )
    );
    return isLevelSelected
      ? [
          {
            id: 2,
            title: "Employees",
            value: "employees",
            icon: <PiUsersThree size={18} />,
          },
        ]
      : tabs;
  };

  // Function to add a new step
  const addStep = () => {
    const newStep = {
      id: steps.length + 1,
      approvalBlocks: [{ dropdowns: [{ isLevel: 0, id: "" }] }], // Initial approval block for the new step
    };
    setSteps([...steps, newStep]);
  };

  // Log the current state of steps array
  //   const transformedData = steps.reduce((acc, step) => {
  //     const formattedBlocks = step.approvalBlocks.map(block =>
  //         block.dropdowns.map(dropdown => ({
  //             isLevel: dropdown.isLevel,
  //             id: dropdown.id
  //         }))
  //     );
  //     acc[`step${step.id}`] = formattedBlocks;
  //     return acc;
  // }, {});
  useEffect(() => {
    const transformedData = steps.reduce((acc, step) => {
      const formattedBlocks = step.approvalBlocks.map((block) =>
        block.dropdowns.map((dropdown) => ({
          isLevel: dropdown.isLevel,
          id: dropdown.id,
        }))
      );
      acc[`step${step.id}`] = formattedBlocks;
      return acc;
    }, {});
    change(transformedData);
  }, [steps]);

  useEffect(() => {
    const transformData = (input) => {
      const steps = Object.keys(input).map((stepKey, index) => {
        return {
          id: index + 1,
          approvalBlocks: input[stepKey].map((block) => ({
            dropdowns: block,
          })),
        };
      });
      return steps;
    };

    if (templateRules) {
      const transformedSteps = transformData(templateRules);
      setSteps(transformedSteps);
    }
  }, [templateRules]);
  const customMessage = (
    <p>
      <span>
        <strong>Shift + Mouse Scroll Wheel</strong>
      </span>
      <span> to scroll horizontally</span>
    </p>
  );

  return (
    <div className="flex flex-col gap-6">
      <Alert
        message={customMessage}
        type="info"
        showIcon
        className="hidden w-fit lg:flex"
      />
      <div className="pb-10 overflow-auto scrollbar-none">
        {/* Fixed Default Step */}
        <div className="flex">
          <div className="flex flex-col items-center mr-4">
            <div>
              <div className="w-8 h-8 bg-[#F8FAFC] rounded-full 2xl:h-9 2xl:w-9">
                <div
                  className={`rounded-full 2xl:h-9 2xl:w-9 h-8 w-8 shadow-stepShadowInset vhcenter bg-[${primaryColor}] bg-opacity-30 border-[0.5px] 
                `}
                  style={{ borderColor: `${primaryColor}44` }}
                >
                  <div
                    style={{
                      boxShadow: `0px 3.882px 6.211px 0px ${primaryColor}66, 0px 0.776px 1.553px 0px #ffffff66 inset`,
                    }}
                    className={`text-xs 2xl:text-base font-medium rounded-full transition duration-500 ease-in-out h-5 w-5 2xl:h-6 2xl:w-6 vhcenter bg-accent text-white border-accent
           
            `}
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className=" w-0.5 h-full"
              style={{ backgroundColor: `${primaryColor}` }}
            />
          </div>
          <div className="pt-1 pb-8">
            <div className="px-4 py-2 bg-[#F3F3F3] dark:bg-secondaryDark rounded-md vhcenter flex gap-2 dark:text-white">
              <PiNoteBlankFill size={16} />
              <span className="pblack">Requester</span>
            </div>
          </div>
        </div>

        {/* STEPS START HERE FOR LOOP */}
        {steps.map((step, stepIndex) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="flex"
          >
            <div className="flex flex-col items-center mr-4">
              <div>
                <div className="w-8 h-8 bg-[#F8FAFC] rounded-full 2xl:h-9 2xl:w-9">
                  <div
                    className={`rounded-full 2xl:h-9 2xl:w-9 h-8 w-8 shadow-stepShadowInset vhcenter bg-[${primaryColor}] bg-opacity-30 border-[0.5px] `}
                    style={{ borderColor: `${primaryColor}44` }}
                  >
                    <div
                      style={{
                        boxShadow: `0px 3.882px 6.211px 0px ${primaryColor}66, 0px 0.776px 1.553px 0px #ffffff66 inset`,
                      }}
                      className={`text-xs 2xl:text-base font-medium rounded-full transition duration-500 ease-in-out h-5 w-5 2xl:h-6 2xl:w-6 vhcenter bg-accent text-white border-accent`}
                    >
                      <span className="text-sm text-white">
                        {stepIndex + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className=" w-0.5 h-full"
                style={{ backgroundColor: `${primaryColor}` }}
              />
            </div>
            <div className="pt-1 pb-8">
              <div className="flex items-center gap-3.5">
                {step.approvalBlocks.map((approvalBlock, blockIndex) => (
                  <motion.div
                    key={blockIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.8 }}
                    className="ApprovalBlock p-[10px] border rounded-lg bg-[#F3F3F3] hover:shadow-2xl hover:bg-white transition-shadow duration-300 dark:bg-secondaryDark border-secondaryWhite dark:border-secondaryDark"
                  >
                    <div className="flex items-start gap-3.5">
                      {approvalBlock.dropdowns.map(
                        (dropdown, dropdownIndex) => (
                          <motion.div
                            key={dropdownIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="flex gap-3.5 items-center"
                          >
                            <div className="relative dropdown">
                              <SelectWithTab
                                value={dropdown.id || undefined}
                                dataSources={remainingDataSources}
                                tabs={getFilteredTabs(
                                  stepIndex,
                                  blockIndex,
                                  dropdownIndex
                                )}
                                placeholder={"Choose Employee or Level"}
                                searchable={true}
                                tabisLevel={dropdown.isLevel}
                                styles={{ width: "200px" }}
                                onChange={(value, tabValue) =>
                                  handleSelectChange(
                                    stepIndex,
                                    blockIndex,
                                    dropdownIndex,
                                    value,
                                    tabValue
                                  )
                                }
                                error={
                                  error[
                                    `${stepIndex}-${blockIndex}-${dropdownIndex}`
                                  ]
                                }
                              />
                              <div className="">
                                {error && (
                                  <p className=" flex justify-start items-center mt-2 my-1 mb-0 text-[10px] text-red-600">
                                    <span className="text-[10px] pt-2">
                                      {
                                        error[
                                          `${stepIndex}-${blockIndex}-${dropdownIndex}`
                                        ]
                                      }
                                    </span>
                                  </p>
                                )}
                              </div>

                              {(approvalBlock.dropdowns.length > 1 ||
                                dropdownIndex !== 0) && (
                                <div
                                  className="deletedropdown bg-[#DBDBDB] cursor-pointer w-5 h-5 rounded-full vhcenter absolute -top-[9px] -right-[9px]"
                                  onClick={() => {
                                    deleteDropdown(
                                      stepIndex,
                                      blockIndex,
                                      dropdownIndex
                                    );
                                  }}
                                >
                                  <Tooltip title="Delete">
                                    {" "}
                                    {/* Add Tooltip component */}
                                    <PiX className="text-xs text-primary" />
                                  </Tooltip>
                                </div>
                              )}
                            </div>
                            <p className="font-semibold pblack">OR</p>
                          </motion.div>
                        )
                      )}
                      <ButtonClick
                        BtnType="add"
                        buttonName="OR"
                        handleSubmit={() => {
                          addNewDropdown(stepIndex, blockIndex);
                          filterDataSources();
                        }}
                      />
                      <Tooltip title="Delete Block">
                        <div
                          className="deleteApprovalBlock bg-white p-1.5 rounded-md vhcenter cursor-pointer"
                          onClick={() => {
                            deleteApprovalBlock(stepIndex, blockIndex);
                          }}
                        >
                          <PiTrash className="text-sm text-[#D20000]" />
                        </div>
                      </Tooltip>
                    </div>
                  </motion.div>
                ))}
                <p className="font-semibold pblack">AND</p>
                <ButtonClick
                  BtnType="add"
                  buttonName="AND"
                  handleSubmit={() => {
                    addNewApprovalBlock(stepIndex);
                    filterDataSources();
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}

        <div className="flex">
          <div className="flex flex-col items-center mr-4">
            <div>
              <div className="w-8 h-8 bg-[#F8FAFC] rounded-full 2xl:h-9 2xl:w-9">
                <div
                  className={`rounded-full 2xl:h-9 2xl:w-9 h-8 w-8 shadow-stepShadowInset vhcenter bg-[${primaryColor}] bg-opacity-30 border-[0.5px] `}
                  style={{ borderColor: `${primaryColor}44` }}
                >
                  <div
                    style={{
                      boxShadow: `0px 3.933px 6.293px 0px rgba(165, 165, 165, 0.40)`,
                    }}
                    className={`text-xs 2xl:text-base font-medium rounded-full transition duration-500 ease-in-out h-5 w-5 2xl:h-6 2xl:w-6 vhcenter bg-[#F8FAFC] text-white border-accent`}
                  >
                    <PiPlus
                      className="text-xs text-black opacity-40"
                      onClick={addStep}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ButtonClick buttonName="Add Step" handleSubmit={addStep} />
        </div>
      </div>
    </div>
  );
};

export default VerticalStepperBackup;
