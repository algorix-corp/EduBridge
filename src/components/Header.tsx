import styled, { css } from 'styled-components';
import { ReactComponent as WhiteLogoSVG } from '../assets/logo_white.svg';
import { ReactComponent as BlackLogoSVG } from '../assets/logo_black.svg';
import { ReactComponent as UserSVG } from '../assets/user.svg';
import { Button } from '../global/Button';
import { colors } from '../colors';
import { useRecoilState } from 'recoil';
import { scrollYState } from '../states';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/api.ts';
import toast from 'react-hot-toast';

interface HeaderProps {
  type: 'white' | 'transparent';
}

export function Header({ type }: HeaderProps) {
  const token = localStorage.getItem('token');

  const [scroll] = useRecoilState(scrollYState);
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedin, setloggedin] = useState<boolean | null>(null);
  const [showbuilding, setshowbuilding] = useState<boolean>(false);
  const [showacademy, setshowacademy] = useState<boolean>(false);
  const [iswhite, setiswhite] = useState<boolean>(false);
  useEffect(() => {
    if (type === 'white') setiswhite(true);
    else setiswhite(false);
  }, [type]);
  useEffect(() => {
    if (!token) {
      setshowacademy(true);
      setshowbuilding(true);
      setloggedin(false);
      return;
    }
    api
      .get('/user')
      .then(r => {
        if (r.data.role == 'admin') {
          setshowacademy(true);
          setshowbuilding(true);
        } else if (r.data.role == 'building') {
          setshowbuilding(true);
          setshowacademy(false);
        } else if (r.data.role == 'academy') {
          setshowacademy(true);
          setshowbuilding(false);
        }
      })
      .catch(() => {
        toast.error('An error occurred while fetching data.');
      })
      .finally(() => {
        setloggedin(true);
      });
  }, [token, loggedin]);

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
      <ButtonGroup>
        {showbuilding ? (
          <Button
            onClick={() => navigate(signInLink)}
            backgroundColor={iswhite ? colors.black : colors.white}
            color={iswhite ? colors.black : colors.white}
            isBordered
          >
            {loggedin ? 'Building Owner' : 'Sign In'}
          </Button>
        ) : undefined}
        {showacademy ? (
          <Button
            onClick={() => navigate(signUpLink)}
            backgroundColor={iswhite ? colors.black : colors.white}
            color={iswhite ? colors.black : colors.white}
            isBordered
          >
            {loggedin ? 'Academy Owner' : 'Sign Up'}
          </Button>
        ) : undefined}
        {loggedin ? (
          <Button
            color={iswhite ? colors.white : undefined}
            backgroundColor={iswhite ? colors.black : undefined}
            onClick={() => navigate('/user')}
            emoji
          >
            <UserSVG />
          </Button>
        ) : undefined}
      </ButtonGroup>
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
