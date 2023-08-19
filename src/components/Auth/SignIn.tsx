import styled from 'styled-components';
import { useForm } from '@mantine/form';
import { Group } from '@mantine/core';
import { Button } from '../../global/Button';
import api from '../../api/api.ts';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { colors } from '../../colors';
import linePNG from '../../assets/line.png';
import { useRecoilState } from 'recoil';
import { loggedInState } from '../../states';
import { Form } from '../../global/Form.tsx';
import { checkEmail } from '../../global/function/index.ts';
import { PasswordInput } from '../../global/PasswordInput.tsx';
import { TextInput as Text } from '../../global/TextInput.tsx';

export function SignIn() {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: value => checkEmail(value),
    },
  });

  interface logindata {
    email: string;
    password: string;
  }
  const [, setLoggedin] = useRecoilState<boolean>(loggedInState);

  const login = (values: logindata) => {
    const randomstr = Math.random().toString(36).substring(7);
    toast.loading('Signing in..', { id: randomstr });
    setDisabled(true);
    const body = {
      email: values.email,
      password: values.password,
    };
    api
      .post('/login', body)
      .then(r => {
        localStorage.setItem('token', r.data.token);
        toast.success('Successfully signed in!', { id: randomstr });
        setLoggedin(true);
        navigate('/');
      })
      .catch(() => {
        toast.error('An error occurred while signing in.', { id: randomstr });
        form.reset();
        setDisabled(false);
      });
  };
  return (
    <Container>
      <Form>
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
            placeholder="Enter your password"
            {...form.getInputProps('password')}
            disabled={disabled}
          />

          <Group position="right" mt={50}>
            <Button
              type="submit"
              disabled={disabled}
              backgroundColor={colors.blue}
              color={colors.white}
            >
              Sign In
            </Button>
          </Group>
        </form>
      </Form>
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

const TextInput = styled(Text)`
  margin-bottom: 15px;
`;
