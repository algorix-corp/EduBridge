import { useState } from 'react';
import { Group, rem } from '@mantine/core';
import api from '../../api/api.ts';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { Form } from '../../global/Form.tsx';
import { colors } from '../../colors';
import { Button } from '../../global/Button';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { TextInput } from '../../global/TextInput.tsx';
import { FileInput } from '../../global/FileInput.tsx';
import { ReactComponent as ReturnSVG } from '../../assets/return.svg';
import { IconUpload } from '@tabler/icons-react';

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
      <Form
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: `2px solid ${colors.black}`,
        }}
      >
        <form onSubmit={form.onSubmit(values => new_building(values))}>
          <Input
            label="Building Name"
            {...form.getInputProps('name')}
            withAsterisk
          />
          <Input
            label="Building Address"
            {...form.getInputProps('address')}
            withAsterisk
          />
          <Input
            label="Building Description"
            {...form.getInputProps('description')}
          />
          <FileInput
            placeholder="Pick Building Image"
            label="Building Image"
            {...form.getInputProps('image')}
            withAsterisk
            icon={<IconUpload size={rem(14)} />}
            accept="image/png,image/jpeg"
          />
          <Group mt={50}>
            <Button
              type="button"
              disabled={disabled}
              backgroundColor={colors.black}
              color={colors.black}
              isBordered
              emoji
              onClick={() => navigate('/building')}
            >
              <Return />
            </Button>
            <Button
              type="submit"
              disabled={disabled}
              backgroundColor={colors.blue}
              color={colors.white}
              style={{
                marginLeft: 'auto',
              }}
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

const Input = styled(TextInput)`
  margin-bottom: 15px;
`;

const Return = styled(ReturnSVG)`
  width: 26px;
  height: 26px;
`;
