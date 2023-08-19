import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api.ts';
import styled from 'styled-components';
import { Group, Modal } from '@mantine/core';
import { Button } from '../../global/Button.tsx';
import { colors } from '../../colors';
import { useDisclosure } from '@mantine/hooks';
import { TextInput } from '../../global/TextInput.tsx';
import { Form } from '../../global/Form.tsx';
import { useForm } from '@mantine/form';
import { PasswordInput } from '../../global/PasswordInput.tsx';

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

interface updateprofile {
  name: string;
  phone: string;
}

interface updatepassword {
  password: string;
}

export function User() {
  const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      name: '',
      phone: '',
    },
  });
  const form2 = useForm({
    initialValues: {
      password: '',
    },
  });
  const [modalmode, setModalMode] = useState<string>('edit');
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

  const update_profile = (values: updateprofile) => {
    const body = {
      name: values.name,
      phone: values.phone,
      image_dataurl: null,
    };
    api
      .put('/user', body)
      .then(() => {
        toast.success('Successfully updated profile.');
        close();
      })
      .catch(() => {
        toast.error('An error occurred while updating profile.');
        close();
      });
  };

  const update_password = (values: updatepassword) => {
    const body = {
      password: values.password,
    };
    api
      .put('/user/password', body)
      .then(() => {
        toast.success('Successfully updated password.');
        close();
      })
      .catch(() => {
        toast.error('An error occurred while updating password.');
        close();
      });
  };

  if (data) {
    return (
      <>
        <Modal
          opened={opened}
          onClose={close}
          title="Change your data"
          style={{ padding: '20px' }}
          centered
        >
          {modalmode === 'edit' ? (
            <ChangeDataArea>
              <Form>
                <form
                  onSubmit={form.onSubmit(values => {
                    update_profile(values);
                  })}
                >
                  <TextInput withAsterisk label="Name" placeholder="New Name" />
                  <TextInput
                    withAsterisk
                    label="Phone Number"
                    placeholder="New Phone Number"
                  />
                  <Group position="right" mt={50}>
                    <Button
                      backgroundColor={colors.blue}
                      color={colors.white}
                      onClick={() => {
                        close();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      backgroundColor={colors.blue}
                      color={colors.white}
                      type="submit"
                    >
                      Submit
                    </Button>
                  </Group>
                </form>
              </Form>
            </ChangeDataArea>
          ) : (
            <ChangeDataArea>
              <Form>
                <form
                  onSubmit={form2.onSubmit(values => {
                    update_password(values);
                  })}
                >
                  <PasswordInput
                    withAsterisk
                    label="Password"
                    placeholder="New Password"
                  />
                  <Group position="right" mt={50}>
                    <Button
                      backgroundColor={colors.blue}
                      color={colors.white}
                      onClick={() => {
                        close();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      backgroundColor={colors.blue}
                      color={colors.white}
                      type="submit"
                    >
                      Submit
                    </Button>
                  </Group>
                </form>
              </Form>
            </ChangeDataArea>
          )}
        </Modal>

        <UserArea>
          <h1>Hello {data.name}</h1>
          <h3>Role: {data.role}</h3>
          <h3>Phone Number: {data.phone}</h3>
          <h3>Email: {data.email}</h3>
          <Group position="right">
            <Button
              backgroundColor={colors.blue}
              color={colors.white}
              onClick={() => {
                setModalMode('edit');
                open();
              }}
            >
              Edit
            </Button>
            <Button
              backgroundColor={colors.blue}
              color={colors.white}
              onClick={() => {
                setModalMode('changepassword');
                open();
              }}
            >
              Change Password
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
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to delete your account?',
                  )
                ) {
                  delacc();
                }
              }}
            >
              Delete
            </Button>
          </Group>
        </UserArea>
      </>
    );
  } else {
    return <div></div>;
  }
}

const UserArea = styled.div`
  margin: 30px 200px;
`;

const ChangeDataArea = styled.div`
  width: 400px;
  height: 300px;
`;
