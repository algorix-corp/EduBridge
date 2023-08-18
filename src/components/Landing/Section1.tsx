import styled from 'styled-components';
import { colors } from '../../colors';
import linePNG from '../../assets/line.png';

export function Section1() {
  return <Container></Container>;
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${colors.blue};

  background-image: url('${linePNG}');
  background-position: center;
`;
