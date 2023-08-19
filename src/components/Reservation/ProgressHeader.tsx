import styled from 'styled-components';
import { colors } from '../../colors';

export function ProgressHeader({ steps }: { steps: number }) {
  return (
    <Container>
      <StepContainer>
        <Step $active={steps} />
      </StepContainer>
    </Container>
  );
}

const Container = styled.div`
  height: 8px;
  display: grid;
  grid-template-columns: 1fr;
`;

const StepContainer = styled.div`
  height: 100%;
  width: 100vw;

  border-bottom: 2px solid ${colors.gray};
`;

const Step = styled.div<{ $active: number }>`
  background-color: ${colors.black};
  width: ${({ $active }) => $active * 25}%;
  height: 100%;

  transition: width 200ms ease;
`;
