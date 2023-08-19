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

  const Logo = type === 'white' ? BlackLogo : WhiteLogo;

  return (
    <Container
      className="header"
      $scroll={scroll}
      $type={type}
      $path={location.pathname}
    >
      <Logo
        onClick={() => {
          navigate('/');
        }}
      />
      {type === 'white' ? (
        <ButtonGroup>
          <Button
            onClick={() => navigate('/auth/signin')}
            backgroundColor={colors.black}
            color={colors.black}
            isBordered
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate('/auth/signup')}
            backgroundColor={colors.blue}
            color={colors.white}
          >
            Sign Up
          </Button>
        </ButtonGroup>
      ) : (
        <ButtonGroup>
          <Button
            onClick={() => navigate('/auth/signin')}
            backgroundColor={colors.white}
            color={colors.white}
            isBordered
          >
            Sign In
          </Button>
          <Button onClick={() => navigate('/auth/signup')}>Sign Up</Button>
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
          border-bottom: 2px solid ${colors.gray};
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
