import styled from 'styled-components';
import { ReactNode } from 'react';
import { colors } from '../colors';

interface Form {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

export function Form({ children, ...props }: Form) {
  return (
    <Container {...props}>
      <Box>{children}</Box>
    </Container>
  );
}

const Container = styled.div`
  background-color: ${colors.white};

  border-radius: 20px;
`;

const Box = styled.div`
  padding: 30px 40px 30px 40px;
  width: 550px;
  margin: 0 auto;
`;
