import styled from 'styled-components';
import { useForm } from '@mantine/form';
import { Group, PasswordInput, TextInput } from '@mantine/core';
import { Button } from '../../global/Button';
import api from '../../api/api.ts';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { colors } from '../../colors/index.ts';
import linePNG from '../../assets/line.png';
import { useAuthContext } from './AuthContext.tsx';

export function SignIn() {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: value => {
        if (!value.includes('@')) {
          return 'Email should contain "@" symbol';
        }
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
      },
    },
  });

  const { setAuthenticated } = useAuthContext();
  interface logindata {
    email: string;
    password: string;
  }

  const login = (values: logindata) => {
    const randomstr = Math.random().toString(36).substring(7);
    toast.loading('Logging in...', { id: randomstr });
    setDisabled(true);
    const body = {
      email: values.email,
      password: values.password,
    };
    api
      .post('/login', body)
      .then(r => {
        localStorage.setItem('token', r.data.token);
        toast.success('Successfully logged in!', { id: randomstr });
        setAuthenticated(true);
        navigate('/');
      })
      .catch(() => {
        toast.error('An error occurred while logging in.', { id: randomstr });
        form.reset();
        setDisabled(false);
      });
  };
  return (
    <Container>
      <BoxContainer>
        <SignInBox>
          <form onSubmit={form.onSubmit(values => login(values))}>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@example.com"
              {...form.getInputProps('email')}
              disabled={disabled}
            />
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="Your password"
              {...form.getInputProps('password')}
              disabled={disabled}
            />

            <Group position="right" mt="md">
              <Button type="submit" disabled={disabled}>
                Sign In
              </Button>
            </Group>
          </form>
        </SignInBox>
      </BoxContainer>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;

  width: 100vw;
  height: 100vh;

  background-color: ${colors.blue};
  background-image: url('${linePNG}');
  background-attachment: fixed;
  background-position: center;

  z-index: -1;
`;

const BoxContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 500px;
  background-color: ${colors.white};

  border-radius: 20px;
  border: 2px solid ${colors.gray};
`;

const SignInBox = styled.div`
  padding: 30px;
  width: 500px;
  margin: 0 auto;
`;
