import styled from 'styled-components';
import { colors } from '../../colors';

export function ProgressHeader({ steps }: { steps: number }) {
  const Container = styled.div`
    height: 30px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  `;

  const Step = styled.div<{ $active: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 700;
    background-color: ${({ $active }) =>
      $active ? colors.black : colors.vampgray};
    color: ${({ $active }) => ($active ? colors.white : colors.black)};
  `;

  return (
    <Container>
      <Step $active={steps === 1}>Step 1</Step>
      <Step $active={steps === 2}>Step 2</Step>
      <Step $active={steps === 3}>Step 3</Step>
    </Container>
  );
}
