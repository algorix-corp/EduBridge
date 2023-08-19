import styled from 'styled-components';
import { ReactComponent as LogoSVG } from '../assets/logo.svg';
import { Button } from '../global/Button';
import { colors } from '../colors';
import { useRecoilState } from 'recoil';
import { scrollYState } from '../states';

export function Header() {
  const [scroll] = useRecoilState(scrollYState);

  return (
    <Container className="header" $scroll={scroll}>
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

const Container = styled.div<{
  $scroll: number;
}>`
  position: ${({ $scroll }) => ($scroll < 7000 ? 'fixed' : 'absolute')};

  width: 100vw;
  height: 120px;

  padding: 0 200px 0 200px;

  display: flex;
  align-items: center;

  z-index: 1;
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
