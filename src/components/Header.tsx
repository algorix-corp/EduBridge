import styled from 'styled-components';
import { ReactComponent as LogoSVG } from '../assets/logo.svg';
import { Button } from '../global/Button';
import { colors } from '../colors';

export function Header() {
  return (
    <Container>
      <Logo />
      <ButtonGroup>
        <Button backgroundColor={colors.white} color={colors.white} isBordered>
          Building Manager
        </Button>
        <Button>Academy</Button>
      </ButtonGroup>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;

  width: 100vw;
  height: 120px;

  padding: 0 200px 0 200px;

  display: flex;
  align-items: center;
`;

const Logo = styled(LogoSVG)`
  width: 234px;
  height: 30px;

  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;

  margin-left: auto;
  height: 50px;
`;
