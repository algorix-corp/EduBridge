import styled, { css } from 'styled-components';
import { ReactComponent as WhiteLogoSVG } from '../assets/logo_white.svg';
import { ReactComponent as BlackLogoSVG } from '../assets/logo_black.svg';
import { Button } from '../global/Button';
import { colors } from '../colors';
import { useRecoilState } from 'recoil';
import { scrollYState } from '../states';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconUser } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  type: 'white' | 'transparent';
}

export function Header({ type }: HeaderProps) {
  const token = localStorage.getItem('token');

  const [scroll] = useRecoilState(scrollYState);
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedin, setloggedin] = useState(!!token);
  useEffect(() => {
    setloggedin(!!token);
  }, [token]);

  const signInLink = loggedin ? '/building' : '/auth/signin';
  const signUpLink = loggedin ? '/academy' : '/auth/signup';

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
            onClick={() => navigate(signInLink)}
            backgroundColor={colors.black}
            color={colors.black}
            isBordered
          >
            {loggedin ? 'Building Owner' : 'Sign In'}
          </Button>
          <Button
            onClick={() => navigate(signUpLink)}
            backgroundColor={colors.blue}
            color={colors.white}
          >
            {loggedin ? 'Academy Owner' : 'Sign Up'}
          </Button>
          {loggedin ? (
            <Button
              color={colors.white}
              backgroundColor={colors.black}
              onClick={() => navigate('/user')}
            >
              <IconUser size={20} />
            </Button>
          ) : undefined}
        </ButtonGroup>
      ) : (
        <ButtonGroup>
          <Button
            onClick={() => navigate(signInLink)}
            backgroundColor={colors.white}
            color={colors.white}
            isBordered
          >
            {loggedin ? 'Building Owner' : 'Sign In'}
          </Button>
          <Button onClick={() => navigate(signUpLink)}>
            {loggedin ? 'Academy Owner' : 'Sign Up'}
          </Button>
          {loggedin ? (
            <Button onClick={() => navigate('/user')}>
              <IconUser size={20} />
            </Button>
          ) : undefined}
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
  height: 100px;

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
