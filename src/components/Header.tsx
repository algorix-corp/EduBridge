import styled from 'styled-components';
import { ReactComponent as LogoSVG } from '../svgs/logo.svg';

export function Header() {
  return (
    <Container>
      <Logo />
      <ButtonGroup></ButtonGroup>
    </Container>
  );
}

const Container = styled.div`
  width: calc(100vw - 400px);
  height: 120px;

  padding: 0 200px 0 200px;

  display: flex;
  align-items: center;

  background-color: #3430ff;
`;

const Logo = styled(LogoSVG)`
  width: 234px;
  height: 30px;

  cursor: pointer;
`;

const ButtonGroup = styled.div`
  margin-left: auto;
  width: 250px;
  height: 70px;
  background-color: red;
`;
