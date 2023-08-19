import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api.ts';
import styled from 'styled-components';
import { Group, LoadingOverlay } from '@mantine/core';
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

const ProfileInit: UserProps = {
  created_at: '',
  email: '',
  id: 0,
  image_url: '',
  password: '',
  role: '',
  name: '',
  phone: '',
};

export function User() {
  const navigate = useNavigate();
  const [data, setData] = useState<UserProps>(ProfileInit);
  const [editing, setEditing] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [disable, setDisable] = useState<boolean>(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      toast.error('You are not logged in.');
      navigate('/auth/signin');
    }
    api
      .post('/auth')
      .then(r => {
        setData(r.data);
        setName(r.data.name);
        setPhone(r.data.phone);
      })
      .catch(() => {
        toast.error('An error occurred while fetching data.');
        navigate('/');
      });
  }, [navigate]);

  const edit = () => {
    setDisable(true);
    const randomstr = Math.random().toString(36).substring(7);
    toast.loading('Please Wait..', { id: randomstr });
    api
      .put('/user', { name: name, phone: phone })
      .then(() => {
        if (data) {
          setData({
            created_at: data.created_at,
            email: data.email,
            id: data.id,
            image_url: data.image_url,
            password: data.password,
            role: data.role,
            name: name,
            phone: phone,
          });
        } else {
          toast.error(
            'An error occurred while editing profile. However, editing has succeeded.\nPlease reload the page.',
            {
              id: randomstr,
            },
          );
          setData(ProfileInit);
        }
        toast.success('Successfully edited profile.', { id: randomstr });
      })
      .catch(() => {
        toast.error('An error occurred while editing profile.', {
          id: randomstr,
        });
      })
      .finally(() => {
        setEditing(false);
        setDisable(false);
      });
  };
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

  return (
    <Container>
      <LoadingOverlay visible={data === ProfileInit} />
      <Form
        style={{
          border: 'none',
        }}
      >
        <InfoGroup>
          <Title>
            Hello,{' '}
            {editing ? (
              <ProfileEdit
                key="name"
                onChange={e => setName(e.target.value)}
                defaultValue={data.name}
                disabled={disable}
              />
            ) : (
              data.name
            )}{' '}
            👋
          </Title>
          <Info>
            <Block>Role</Block>
            {data.role}
          </Info>
          <Info>
            <Block>Phone</Block>
            {editing ? (
              <ProfileEdit
                key="phone"
                onChange={e => setPhone(e.target.value)}
                defaultValue={data.phone}
                disabled={disable}
              />
            ) : (
              data.phone
            )}
          </Info>
          <Info>
            <Block>Email</Block>
            {data.email}
          </Info>
          <ButtonGroup>
            {editing ? (
              <>
                <Button
                  backgroundColor={colors.black}
                  color={colors.black}
                  onClick={() => setEditing(false)}
                  isBordered
                  disabled={disable}
                >
                  Cancel
                </Button>
                <Button
                  backgroundColor={colors.blue}
                  color={colors.white}
                  onClick={() => edit()}
                  disabled={disable}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  backgroundColor={colors.black}
                  color={colors.black}
                  onClick={() => setEditing(true)}
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
              </>
            )}
          </ButtonGroup>
        </InfoGroup>
      </Form>
    </Container>
  );
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

const ProfileEdit = styled.input`
  width: 200px;
  border-left: 0;
  border-right: 0;
  border-top: 0;
  border-bottom: 2px solid ${colors.gray};
  outline: none;
  font-family: inherit;

  &:focus {
    border-left: 0;
    border-right: 0;
    border-top: 0;
    border-bottom: 2px solid ${colors.black};
    outline: none;
  }
`;
