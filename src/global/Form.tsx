import styled from 'styled-components';
import { ReactNode } from 'react';
import { colors } from '../colors';

interface Form {
  children: ReactNode;
}

export function Form({ children }: Form) {
  return (
    <Container>
      <Box>{children}</Box>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background-color: ${colors.white};

  border-radius: 16px;
  border: 2px solid ${colors.gray};
`;

const Box = styled.div`
  padding: 30px;
  width: 500px;
  margin: 0 auto;
`;
