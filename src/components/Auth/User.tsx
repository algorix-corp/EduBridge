import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api.ts';
import styled from 'styled-components';
import { Group } from '@mantine/core';
import { Button } from '../../global/Button.tsx';
import { colors } from '../../colors';

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
      <UserArea>
        <h1>Hello {data.name}</h1>
        <h3>Role: {data.role}</h3>
        <h3>Phone Number: {data.phone}</h3>
        <h3>Email: {data.email}</h3>
        <Group position="right">
          <Button
            backgroundColor={colors.blue}
            color={colors.white}
            onClick={edit}
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
            backgroundColor={colors.black}
            color={colors.white}
            onClick={delacc}
          >
            Delete
          </Button>
        </Group>
      </UserArea>
    );
  } else {
    return <div></div>;
  }
}

const UserArea = styled.div`
  margin: 30px 200px;
`;
