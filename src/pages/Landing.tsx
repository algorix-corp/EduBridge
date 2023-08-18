import styled from 'styled-components';
import { Section1 } from '../components/Landing/Section1';

export function Landing() {
  return (
    <Container>
      <Section1 />
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
`;
