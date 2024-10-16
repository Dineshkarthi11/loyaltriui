import React, { useState, useEffect, useRef, useMemo } from "react";
import ButtonClick from "../../../common/Button";
import { PiNoteBlankFill, PiPlus, PiRanking, PiStack, PiTrash, PiUsersThree, PiX } from "react-icons/pi";
import Dropdown from "../../../common/Dropdown";
import Userlogo from "../../../../assets/images/user.png";
import { Alert, Tooltip } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "i18next";
import SelectWithTab from "../../../common/SelectWithTab";

  export default function VerticalStepper({ step,employees,change=()=>{},templateRules }) {
    const primaryColor = localStorage.getItem("mainColor");

    const [steps, setSteps] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const [newApprovalBlockArrays, setNewApprovalBlockArrays] = useState([]);
    const [generatedArrays, setGeneratedArrays] = useState({});
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [levelSelectedInStep, setLevelSelectedInStep] = useState({});
    const [selectedData, setSelectedData] = useState({
      levels: [],
      employees: [],
    });
    const [filteredDataSources, setFilteredDataSources] = useState({
      levels: [],
      employees: [],
    });
  const dataOptions = [
    {
      id: 1,
      value: 1,
      label: "Abhishek",
      image: Userlogo,
    },
    {
      id: 2,
      value: 2,
      label: "Vignesh",
      image: Userlogo,
    },
    {
      id: 3,
      value: 3,
      label: "Prasanth",
      image: Userlogo,
    },
  ];

  const dataSources = {
    levels: [
      {
        value: "1",
        label: "Level 1",
        icon: <PiRanking />,
        subLabel: "lorem ipsum dummy text dolar sit.",
      },
      {
        value: "2",
        label: "Level 2",
        icon: <PiRanking />,
        subLabel: "lorem ipsum dummy text dolar sit.",
      },
      {
        value: "3",
        label: "Level 3",
        icon: <PiRanking />,
        subLabel: "lorem ipsum dummy text dolar sit.",
      },
      {
        value: "4",
        label: "Level 4",
        icon: <PiRanking />,
        subLabel: "lorem ipsum dummy text dolar sit.",
      },
    ],
    employees: employees,
    
  };


  
  // console.log(dataSources,"employ")
  const tabs = [
    { id: 1, 
      title: t("Levels"), 
      value: "levels", 
      icon: <PiStack size={18} /> },
    {
      id: 2,
      title: t("Employees"),
      value: "employees",
      icon: <PiUsersThree size={18} />,
    },
  ];
 
  const addStep = () => {
    setSteps((prevSteps) => {
      const newStep = {
        id: prevSteps.length,
        value: prevSteps.length,
        title: `Step ${prevSteps.length + 1}`,
        data: `step${prevSteps.length + 1}`,
        approvalBlocks: [
          {
            id: 0,
            value: 0,
            label: `ApprovalBlock 1`,
            dropdowns: [
              {
                id: 0,
                value: 0,
                label: `Default Dropdown`,
              },
            ],
          },
        ],
      };
  
      if (prevSteps.length > 0 && prevSteps[0].approvalBlocks) {
        newStep.approvalBlocks = [
          {
            id: 0,
            value: 0,
            label: `ApprovalBlock 1`,
            dropdowns: [
              {
                id: 0,
                value: 0,
                label: `Default Dropdown`,
              },
            ],
          },
        ];
      }
  
      return [...prevSteps, newStep];
    });
  };
  
  const addNewDropdown = (stepIndex, blockIndex) => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      const newDropdown = {
        id: updatedSteps[stepIndex].approvalBlocks[blockIndex].dropdowns.length,
        value: "",
        label: "",
      };
      updatedSteps[stepIndex].approvalBlocks[blockIndex].dropdowns.push(newDropdown);
      return updatedSteps;
    });
  };
  
  const deleteDropdown = (stepIndex, blockIndex, dropdownIndex, value, tabValue) => {
    
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      const approvalBlock = updatedSteps[stepIndex].approvalBlocks[blockIndex];
  
      if (approvalBlock.dropdowns.length > 1) {
        approvalBlock.dropdowns.splice(dropdownIndex, 1);
      }
  
      return updatedSteps;
    });
  
    setGeneratedArrays((prevArrays) => {
      const updatedArrays = { ...prevArrays };
      const stepKey = `step${stepIndex + 1}`;
  
      if (updatedArrays[stepKey] && updatedArrays[stepKey][blockIndex]) {
        updatedArrays[stepKey][blockIndex].splice(dropdownIndex, 1);
      }
      return updatedArrays;
    });
  
    setSelectedData((prevSelectedData) => {
      if (tabValue === "levels") {
        return {
          ...prevSelectedData,
          levels: prevSelectedData.levels.filter(level => level.value !== value),
        };
      } else {
        return {
          ...prevSelectedData,
          employees: prevSelectedData.employees.filter(employee => employee.value !== value),
        };
      }
    });
  
    if (tabValue === "levels") {
      setSelectedLevels((prevSelectedLevels) =>
        prevSelectedLevels.filter((selectedValue) => selectedValue !== value)
      );
    } else {
      setSelectedEmployees((prevSelectedEmployees) =>
        prevSelectedEmployees.filter((selectedValue) => selectedValue !== value)
      );
    }
  };
  
  
  
  const addNewApprovalBlock = (stepIndex) => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      const currentStep = updatedSteps[stepIndex];
  
      const newApprovalBlock = {
        id: currentStep.approvalBlocks.length,
        value: currentStep.approvalBlocks.length,
        label: `ApprovalBlock ${currentStep.approvalBlocks.length + 1}`,
        dropdowns: [
          {
            id: 0,
            value: "",
            label: "",
          },
        ],
      };
  
      if (!currentStep.approvalBlocks) {
        currentStep.approvalBlocks = [];
      }
  
      currentStep.approvalBlocks.push(newApprovalBlock);
  
      return updatedSteps;
    });
  };
  
  const deleteApprovalBlock = (stepIndex, blockIndex, dropdowns) => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      const currentStep = updatedSteps[stepIndex];
  
      if (currentStep.approvalBlocks.length === 1) {
        updatedSteps.splice(stepIndex, 1);
      } else {
        currentStep.approvalBlocks.splice(blockIndex, 1);
      }
  
      return updatedSteps;
    });
  
    setGeneratedArrays((prevArrays) => {
      const updatedArrays = { ...prevArrays };
      const stepKey = `step${stepIndex + 1}`;
  
      if (updatedArrays[stepKey]) {
        updatedArrays[stepKey].splice(blockIndex, 1);
  
        if (updatedArrays[stepKey].length === 0) {
          delete updatedArrays[stepKey];
        }
      }
      return updatedArrays;
    });
  
    setSelectedData((prevSelectedData) => {
      const dropdownValues = dropdowns.map(dropdown => dropdown.value);
  
      const updatedLevels = prevSelectedData.levels.filter(level =>
        !dropdownValues.includes(level.value)
      );
  
      const updatedEmployees = prevSelectedData.employees.filter(employee =>
        !dropdownValues.includes(employee.value)
      );
  
      return {
        ...prevSelectedData,
        levels: updatedLevels,
        employees: updatedEmployees,
      };
    });
  
    setSelectedLevels((prevSelectedLevels) =>
      prevSelectedLevels.filter((value) => !dropdowns.some(dropdown => dropdown.value === value))
    );
  
    setSelectedEmployees((prevSelectedEmployees) =>
      prevSelectedEmployees.filter((value) => !dropdowns.some(dropdown => dropdown.value === value))
    );
  };
  
  
  
  
  
  
 

  
  const handleSelectChange = (stepIndex, blockIndex, dropdownIndex, value, tabValue) => {
    setGeneratedArrays((prevArrays) => {
      const updatedArrays = { ...prevArrays };
  
      if (!updatedArrays[`step${stepIndex + 1}`]) {
        updatedArrays[`step${stepIndex + 1}`] = [];
      }
  
      if (!updatedArrays[`step${stepIndex + 1}`][blockIndex]) {
        updatedArrays[`step${stepIndex + 1}`][blockIndex] = [];
      }
  
      const newValue = {
        isLevel: tabValue === "levels" ? 1 : 0,
        id: value,
      };
  
      updatedArrays[`step${stepIndex + 1}`][blockIndex][dropdownIndex] = newValue;
  
      if (tabValue === "levels") {
        const selectedLevel = dataSources.levels.find(level => level.value === value);
  
        setSelectedData((prevSelectedData) => {
          const updatedLevels = prevSelectedData.levels.filter(level => level.value !== value);
          updatedLevels.push(selectedLevel);
  
          return {
            ...prevSelectedData,
            levels: updatedLevels,
          };
        });
  
        setSelectedLevels((prevSelectedLevels) => {
          const updatedSelectedLevels = prevSelectedLevels.filter(level => level !== value);
          updatedSelectedLevels.push(value);
          return updatedSelectedLevels;
        });
  
        setLevelSelectedInStep((prevLevelSelectedInStep) => {
          const newLevelSelectedInStep = { ...prevLevelSelectedInStep };
          newLevelSelectedInStep[stepIndex] = true;
          return newLevelSelectedInStep;
        });
  
        setSteps((prevSteps) => {
          const updatedSteps = [...prevSteps];
          updatedSteps[stepIndex].approvalBlocks[blockIndex].dropdowns[dropdownIndex].value = selectedLevel.value;
          updatedSteps[stepIndex].approvalBlocks[blockIndex].dropdowns[dropdownIndex].label = selectedLevel.label;
          return updatedSteps;
        });
      } else {
        const selectedEmployee = dataSources.employees.find(employee => employee.value === value);
  
        setSelectedData((prevSelectedData) => {
          const updatedEmployees = prevSelectedData.employees.filter(employee => employee.value !== value);
          updatedEmployees.push(selectedEmployee);
  
          return {
            ...prevSelectedData,
            employees: updatedEmployees,
          };
        });
  
        setSelectedEmployees((prevSelectedEmployees) => {
          const updatedSelectedEmployees = prevSelectedEmployees.filter(employee => employee !== value);
          updatedSelectedEmployees.push(value);
          return updatedSelectedEmployees;
        });
  
        setSteps((prevSteps) => {
          const updatedSteps = [...prevSteps];
          updatedSteps[stepIndex].approvalBlocks[blockIndex].dropdowns[dropdownIndex].value = selectedEmployee.value;
          updatedSteps[stepIndex].approvalBlocks[blockIndex].dropdowns[dropdownIndex].label = selectedEmployee.label;
          return updatedSteps;
        });
      }
  
      return updatedArrays;
    });
  };
  
  
  
  
  useEffect(() => {
    change(generatedArrays);
  }, [generatedArrays]);
  
 
  useEffect(() => {
    const filterData = () => {
      if (selectedData.levels.length === 0 && selectedData.employees.length === 0) {
        return { ...dataSources };
      }
  
      const filteredLevels = dataSources.levels.filter(level =>
        !selectedData.levels.some(selectedLevel => selectedLevel.value === level.value)
      );
  
      const filteredEmployees = dataSources.employees.filter(employee =>
        !selectedData.employees.some(selectedEmployee => selectedEmployee.value === employee.value)
      );
  
      return {
        levels: filteredLevels,
        employees: filteredEmployees,
      };
    };
  
    setFilteredDataSources(filterData());
  }, [selectedData,dataSources]);
  
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
          <>
           
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.8 }}
              className="ApprovalBlock p-4 border rounded-lg bg-[#F3F3F3] hover:shadow-2xl hover:bg-white transition-shadow duration-300 dark:bg-secondaryDark border-secondaryWhite dark:border-secondaryDark"
              key={blockIndex}
            >
              <div className="flex items-center gap-3.5">
                {approvalBlock.dropdowns.map((dropdown, dropdownIndex) => (
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-3.5 items-center"
                    key={dropdown.id}
                  >
                    <div className="relative dropdown">
                    
                      <SelectWithTab
                        dataSources={filteredDataSources}
                        Value={templateRules}
                        tabs={levelSelectedInStep[stepIndex] ? tabs.filter(tab => tab.value !== "levels") : tabs}
                        placeholder="Choose Employee or Level"
                        searchable={true}
                        styles={{ width: "200px" }}
                        onChange={(value, tabValue) =>
                          handleSelectChange(stepIndex, blockIndex, dropdownIndex, value, tabValue)
                        }
                      />
                      {(approvalBlock.dropdowns.length > 1 || dropdownIndex !== 0) && (
                        <div
                          className="deletedropdown bg-[#DBDBDB] cursor-pointer w-5 h-5 rounded-full vhcenter absolute -top-[9px] -right-[9px]"
                          onClick={() =>
                            deleteDropdown(stepIndex, blockIndex, dropdownIndex,dropdown.value)
                          }
                        >
                          <PiX className="text-xs text-primary" />
                        </div>
                      )}
                    </div>
                    <p className="font-semibold pblack">OR</p>
                  </motion.div>
                ))}
                <ButtonClick
                  BtnType="add"
                  buttonName="OR"
                  handleSubmit={() => addNewDropdown(stepIndex, blockIndex)}
                />
                <Tooltip title="Delete Block">
                  <div
                    className="deleteApprovalBlock bg-white p-1.5 rounded-md vhcenter cursor-pointer"
                    onClick={() =>
                      deleteApprovalBlock(stepIndex, blockIndex,approvalBlock.dropdowns)
                    }
                  >
                    <PiTrash className="text-sm text-[#D20000]" />
                  </div>
                </Tooltip>
              </div>
            </motion.div>
            <p className="font-semibold pblack">AND</p>
          </>
        ))}
        <ButtonClick
          BtnType="add"
          buttonName="AND"
          handleSubmit={() => addNewApprovalBlock(stepIndex)}
        />
      </div>
    </div>
  </motion.div>
))}



        {/* STEPS ENT HERE FOR LOOP */}

        {/* Add NEW STEP BUTTON  */}
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
                    className={`text-xs 2xl:text-base font-medium rounded-full transition duration-500 ease-in-out h-5 w-5 2xl:h-6 2xl:w-6 vhcenter bg-[#F8FAFC] text-white border-accent
           
            `}
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
}
