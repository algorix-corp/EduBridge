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
import { Form } from '../../global/Form.tsx';
import { checkEmail, checkExistence } from '../../global/function';
import { TextInput } from '../../global/TextInput.tsx';
import { PasswordInput } from '../../global/PasswordInput.tsx';
import { SelectInput } from '../../global/SelectInput.tsx';

export function SignUp() {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      role: 'admin',
    },

    validate: {
      email: value => checkEmail(value),
      password: value => checkExistence(value),
      name: value => checkExistence(value),
      phone: value => checkExistence(value),
      role: value => checkExistence(value),
    },
  });

  interface logindata {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: string;
  }
  const login = (values: logindata) => {
    console.log(values);

    const randomstr = Math.random().toString(36).substring(7);
    toast.loading('Signing up..', { id: randomstr });
    setDisabled(true);
    const body = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      role: values.role,
    };
    api
      .post('/user', body)
      .then(r => {
        localStorage.setItem('token', r.data.token);
        toast.success('Successfully signed up!', { id: randomstr });
        navigate('/');
      })
      .catch(() => {
        toast.error('An error occurred while signing up', { id: randomstr });
        form.reset();
        setDisabled(false);
      });
  };
  return (
    <Container>
      <Form
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <FormGroup onSubmit={form.onSubmit(values => login(values))}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Write your full name down"
            {...form.getInputProps('name')}
            disabled={disabled}
          />
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
            placeholder="Create the password to use"
            {...form.getInputProps('password')}
            disabled={disabled}
          />
          <TextInput
            withAsterisk
            label="Phone Number"
            placeholder="010-XXXX-XXXX"
            {...form.getInputProps('phone')}
            disabled={disabled}
          />
          <SelectInput
            withAsterisk
            label="Role"
            placeholder="Choose your role"
            defaultValue={'academy'}
            data={[
              { value: 'admin', label: 'Admin' },
              { value: 'building', label: 'Building Owner' },
              { value: 'academy', label: 'Academy' },
            ]}
            {...form.getInputProps('role')}
          />
          <Group position="right" mt={50}>
            <Button
              type="submit"
              disabled={disabled}
              backgroundColor={colors.blue}
              color={colors.white}
            >
              Sign Up
            </Button>
          </Group>
        </FormGroup>
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

const FormGroup = styled.form`
  & div:not(:last-child) {
    margin-bottom: 15px;
  }
`;
