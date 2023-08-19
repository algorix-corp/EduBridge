import styled from 'styled-components';
import { useForm } from '@mantine/form';
import { Button, Group, PasswordInput, TextInput } from '@mantine/core';
import api from '../../api/api.ts';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';

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

  interface logindata {
    email: string;
    password: string;
  }

  const login = (values: logindata) => {
    const randomstr = Math.random().toString(36).substring(7);
    toast.loading('Logging in...', { id: randomstr });
    setDisabled(true);
    api
      .post('/auth/login', values)
      .then(r => {
        localStorage.setItem('token', r.data.token);
        toast.success('Successfully logged in!', { id: randomstr });
        navigate('/');
      })
      .catch(() => {
        toast.error('An error occurred while logging in.', { id: randomstr });
        form.reset();
        setDisabled(false);
      });
  };
  return (
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
  );
}

const SignInArea = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
`;

const SignInBox = styled.div`
  padding: 30px;
  width: 500px;
  margin: 0 auto;
  height: auto;
`;
