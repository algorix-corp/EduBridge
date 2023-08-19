import styled, { css } from 'styled-components';
import { ReactComponent as WhiteLogoSVG } from '../assets/logo_white.svg';
import { ReactComponent as BlackLogoSVG } from '../assets/logo_black.svg';
import { Button } from '../global/Button';
import { colors } from '../colors';
import { useRecoilState } from 'recoil';
import { scrollYState } from '../states';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  type: 'white' | 'transparent';
}

export function Header({ type }: HeaderProps) {
  const [scroll] = useRecoilState(scrollYState);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Container
      className="header"
      $scroll={scroll}
      $type={type}
      $path={location.pathname}
    >
      {type === 'white' ? <BlackLogo /> : <WhiteLogo />}
      {type === 'white' ? (
        <ButtonGroup>
          <Button
            onClick={() => navigate('/building')}
            backgroundColor={colors.black}
            color={colors.black}
            isBordered
          >
            Building Manager
          </Button>
          <Button
            onClick={() => navigate('/academy')}
            backgroundColor={colors.blue}
            color={colors.white}
          >
            Academy
          </Button>
        </ButtonGroup>
      ) : (
        <ButtonGroup>
          <Button
            onClick={() => navigate('/building')}
            backgroundColor={colors.white}
            color={colors.white}
            isBordered
          >
            Building Manager
          </Button>
          <Button onClick={() => navigate('/academy')}>Academy</Button>
        </ButtonGroup>
      )}
    </Container>
  );
}

const Container = styled.div<{
  $scroll: number;
  $type: 'white' | 'transparent';
  $path: string;
}>`
  // for landing page
  ${({ $path, $scroll }) =>
    $path === '/'
      ? css`
          position: ${$scroll < 12500 ? 'fixed' : 'absolute'};
        `
      : undefined}

  ${({ $type }) =>
    $type === 'white'
      ? css`
          border-bottom: 1px solid ${colors.gray};
        `
      : undefined}

  width: 100vw;
  height: 120px;

  padding: 0 200px 0 200px;

  display: flex;
  align-items: center;

  z-index: 1;
`;

const WhiteLogo = styled(WhiteLogoSVG)`
  width: 234px;
  height: 30px;

  cursor: pointer;
`;

const BlackLogo = styled(BlackLogoSVG)`
  width: 234px;
  height: 30px;

  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;

  margin-left: auto;
  height: 50px;

  font-size: 16px;
`;
