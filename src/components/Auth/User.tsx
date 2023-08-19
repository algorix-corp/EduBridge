import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api.ts';
import styled from 'styled-components';
import { Group } from '@mantine/core';
import { Button } from '../../global/Button.tsx';
import { colors } from '../../colors';
import linePNG from '../../assets/line.png';
import { Form } from '../../global/Form.tsx';

interface UserProps {
  password: string;
  id: number;
  role: string;
  created_at: string;
  phone: string;
  email: string;
  name: string;
  image_url: string;
}

export function User() {
  const navigate = useNavigate();
  const [data, setData] = useState<UserProps | null>(null);
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      toast.error('You are not logged in.');
      navigate('/auth/signin');
    }
    api
      .post('/auth')
      .then(r => {
        setData(r.data);
      })
      .catch(() => {
        toast.error('An error occurred while fetching data.');
        navigate('/');
      });
  }, [navigate]);

  const edit = () => {};
  const delacc = () => {
    api
      .delete('/user')
      .then(() => {
        toast.success(
          'Successfully deleted account. Thank you for using our service.',
        );
        localStorage.removeItem('token');
        navigate('/');
      })
      .catch(() => {
        toast.error('An error occurred while deleting account.');
      });
  };

  const signout = () => {
    localStorage.removeItem('token');
    toast.success('Successfully signed out.');
    navigate('/');
  };

  if (data) {
    return (
      <Container>
        <Form>
          <InfoGroup>
            <Title>Hello, {data.name} 👋</Title>
            <Info>
              <Block>Role</Block>
              {data.role}
            </Info>
            <Info>
              <Block>Phone</Block>
              {data.phone}
            </Info>
            <Info>
              <Block>Email</Block>
              {data.email}
            </Info>
            <ButtonGroup>
              <Button
                backgroundColor={colors.black}
                color={colors.black}
                onClick={edit}
                isBordered
              >
                Edit
              </Button>
              <Button
                backgroundColor={colors.black}
                color={colors.white}
                onClick={signout}
              >
                Sign Out
              </Button>
              <Button
                backgroundColor={colors.red}
                color={colors.white}
                onClick={delacc}
              >
                Delete
              </Button>
            </ButtonGroup>
          </InfoGroup>
        </Form>
      </Container>
    );
  } else {
    return <Container />;
  }
}

const Container = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  background-color: ${colors.blue};
  background-image: url('${linePNG}');
  background-attachment: fixed;
  background-position: center;

  z-index: -1;
`;

const InfoGroup = styled.div``;

const Title = styled.p`
  font-size: 30px;
  font-weight: 700;

  margin-bottom: 20px;
`;

const Info = styled.div`
  font-size: 16px;
  font-weight: 600;

  margin-bottom: 5px;
`;

const Block = styled.div`
  display: inline-block;

  position: relative;
  top: -1px;
  margin-right: 7px;

  background-color: ${colors.blue};
  width: 50px;

  padding: 2px 0 2px 0;
  font-size: 12px;
  color: ${colors.white};
  border-radius: 121234px;

  text-align: center;
`;

const ButtonGroup = styled(Group)`
  display: flex;
  justify-content: center;

  position: relative;
  margin-top: 75px;
  left: 50%;
  transform: translateX(-50%);
`;
