import { useState } from 'react';
import { FileInput, Group, TextInput } from '@mantine/core';
import api from '../../api/api.ts';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { Form } from '../../global/Form.tsx';
import { colors } from '../../colors';
import { Button } from '../../global/Button';
import toast from 'react-hot-toast';
import styled from 'styled-components';

export function CreateBuilding() {
  const [disabled, setDisabled] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: '',
      address: '',
      description: '',
      image: new File([], ''),
    },
  });

  interface buildingdata {
    name: string;
    address: string;
    description: string;
    image: File;
  }

  const new_building = (values: buildingdata) => {
    const randomstr = Math.random().toString(36).substring(7);
    toast.loading('Creating new building..', { id: randomstr });
    setDisabled(true);
    // image to dataurl
    const reader = new FileReader();
    reader.readAsDataURL(values.image);
    let imageDataUrl = '';
    reader.onloadend = () => {
      imageDataUrl = reader.result as string;
    };
    const body = {
      name: values.name,
      address: values.address,
      description: values.description,
      image_url: imageDataUrl,
    };
    api
      .post('/building', body)
      .then(() => {
        toast.success('Successfully created new building!', { id: randomstr });
        navigate('/building');
      })
      .catch(() => {
        toast.error('An error occurred while creating new building.', {
          id: randomstr,
        });
        form.reset();
        setDisabled(false);
      });
  };

  return (
    <NewBuildingArea>
      <Form>
        <form onSubmit={form.onSubmit(values => new_building(values))}>
          <TextInput
            label="Building Name"
            {...form.getInputProps('name')}
            withAsterisk
          />
          <TextInput
            label="Building Address"
            {...form.getInputProps('address')}
            withAsterisk
          />
          <TextInput
            label="Building Description"
            {...form.getInputProps('description')}
          />
          <FileInput
            placeholder="Pick Building Image"
            label="Building Image"
            {...form.getInputProps('image')}
            withAsterisk
            accept="image/png,image/jpeg"
          />
          <Group position="right" mt={50}>
            <Button
              type="submit"
              disabled={disabled}
              backgroundColor={colors.blue}
              color={colors.white}
            >
              Add Building
            </Button>
          </Group>
        </form>
      </Form>
    </NewBuildingArea>
  );
}

const NewBuildingArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
