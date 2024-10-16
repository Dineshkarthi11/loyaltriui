import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Tree } from "react-organizational-chart";
import FlexCol from "../../common/FlexCol";
import Dropdown from "../../common/Dropdown";
import FormInput from "../../common/FormInput";
import VerticalStepper from "../Payroll/SettingsPayroll/StepperVertical";

const DraggableStepperChart = ({ data }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  const handleDrag = (e, ui) => {
    const { x, y } = ui;
    setPosition({ x, y });
  };

  const fitToScreen = () => {
    if (chartRef.current && containerRef.current) {
      const chartRect = chartRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const scaleX = containerRect.width / chartRect.width;
      const scaleY = containerRect.height / chartRect.height;
      const newScale = Math.min(scaleX, scaleY, 1); // Limit max scale to 1

      setScale(newScale);

      // Center the content
      const newX = (containerRect.width - chartRect.width * newScale) / 2;
      const newY = (containerRect.height - chartRect.height * newScale) / 2;
      setPosition({ x: newX, y: newY });
    }
  };

  useEffect(() => {
    fitToScreen();
    window.addEventListener('resize', fitToScreen);
    return () => window.removeEventListener('resize', fitToScreen);
  }, []);

  const stepSchemeSteps = [
    {
      id: 0,
      value: 0,
      title: "Add Shift Scheme",
      data: "addShiftScheme",
    },
    {
      id: 1,
      value: 1,
      title: "Assign Shift Scheme",
      data: "assignShiftScheme",
    },
    {
      id: 2,
      value: 2,
      title: "Assign Shift Scheme 2",
      data: "assignShiftScheme 2",
    },
  ];

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%'}}>
      <TransformWrapper
        initialScale={scale}
        initialPositionX={position.x}
        initialPositionY={position.y}
        minScale={0.1}
        maxScale={2}
        onZoomStop={(ref) => setScale(ref.state.scale)}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="tools" style={{  }}>
              <button onClick={() => zoomIn()}>+</button>
              <button onClick={() => zoomOut()}>-</button>
              <button onClick={() => resetTransform()}>Reset</button>
              <button onClick={fitToScreen}>Fit</button>
            </div>
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}> 
              <div ref={chartRef} className="chart-container" style={{ display: 'inline-block' }}>
                <Tree
                  lineWidth={"2px"}
                  lineColor={"#bbb"}
                  lineBorderRadius={"10px"}
                  label={<div>Root</div>}
                >
                  <FlexCol>
                    <div className="borderb p-3 rounded-lg w-fit bg-white dark:bg-dark">
                      <div className="flex items-center gap-6">
                        <Dropdown
                          title="Choose type"
                          placeholder="Choose type"
                          className="w-44"
                        />
                        <FormInput
                          title="Template Name"
                          placeholder="Template Name"
                        />
                      </div>
                    </div>
                    <VerticalStepper
                      steps={stepSchemeSteps}
                      currentStepNumber={2}
                      presentage={1}
                    />
                  </FlexCol>
                </Tree>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default DraggableStepperChart;