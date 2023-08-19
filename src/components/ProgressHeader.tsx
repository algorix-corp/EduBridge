import React, { useState } from "react";
import styled from "styled-components";

const ProgressHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StepIndicators = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
`;

const StepIndicator = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  background-color: ${({ isActive }) => (isActive ? "#007bff" : "#f0f0f0")};
  font-size: 16px;
  color: ${({ isActive }) => (isActive ? "white" : "#999")};
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 15px;
  background-color: #f0f0f0;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background-color: #007bff;
`;



export function ProgressHeader() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleStepChange = (step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const handleBackButtonClick = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <ProgressHeaderContainer>
      <StepIndicators>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <StepIndicator
            key={index}
            isActive={index + 1 === currentStep}
            onClick={() => handleStepChange(index + 1)}
          >
            Step {index + 1}
          </StepIndicator>
        ))}
      </StepIndicators>
      <ProgressBarContainer>
        <ProgressBar progress={(currentStep - 1) / (totalSteps - 1) * 100} />
      </ProgressBarContainer>
    </ProgressHeaderContainer>
  );
}
