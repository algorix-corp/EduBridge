import { TextInput } from '@mantine/core';
import { Button } from '../../../global/Button.tsx';
import { useForm } from '@mantine/form';
import { biggerThan, checkExistence } from '../../../global/function';
import api from '../../../api/api.ts';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

export function CreateRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const addRoomForm = useForm({
    initialValues: {
      capacity: 0,
      floor: 0,
      description: '',
      grid_x: 0,
      grid_y: 0,
      is_active: true,
      daily_price: 0,
      unit_name: '',
    },
    validate: {
      unit_name: value => checkExistence(value),
      capacity: value => biggerThan(value, 0),
      floor: value => biggerThan(value, 0),
      grid_x: value => biggerThan(value, -1),
      grid_y: value => biggerThan(value, -1),
      daily_price: value => biggerThan(value, 0),
    },
  });

  interface addRoomProps {
    capacity: number;
    floor: number;
    description: string;
    grid_x: number;
    grid_y: number;
    is_active: boolean;
    daily_price: number;
    unit_name: string;
  }

  const addRoomProcess = (value: addRoomProps) => {
    const body = {
      capacity: value.capacity,
      floor: value.floor,
      description: value.description,
      grid_x: value.grid_x,
      grid_y: value.grid_y,
      is_active: value.is_active,
      building_id: id,
      unit_name: value.unit_name,
      daily_price: value.daily_price,
    };
    api
      .post('/room', body)
      .then(() => {
        toast.success('Successfully created new room!');
      })
      .catch(() => {
        toast.error('An error occurred while creating new room.');
      })
      .finally(() => {
        navigate(`/building/detail/${id}`);
        addRoomForm.reset();
      });
  };
  return (
    <div>
      <form onSubmit={addRoomForm.onSubmit(value => addRoomProcess(value))}>
        <TextInput
          label="Unit Name"
          placeholder="Unit Name"
          withAsterisk
          {...addRoomForm.getInputProps('unit_name')}
        />
        <TextInput
          label="Capacity"
          placeholder="Capacity"
          type="number"
          withAsterisk
          {...addRoomForm.getInputProps('capacity')}
        />
        <TextInput
          label="Floor"
          placeholder="Floor"
          type="number"
          withAsterisk
          {...addRoomForm.getInputProps('floor')}
        />
        <TextInput
          label="Description"
          placeholder="Description"
          {...addRoomForm.getInputProps('description')}
        />
        <TextInput
          label="Grid X"
          placeholder="Grid X"
          type="number"
          withAsterisk
          {...addRoomForm.getInputProps('grid_x')}
        />
        <TextInput
          label="Grid Y"
          placeholder="Grid Y"
          type="number"
          withAsterisk
          {...addRoomForm.getInputProps('grid_y')}
        />
        <TextInput
          label="Daily Price"
          placeholder="Daily Price"
          type="number"
          withAsterisk
          {...addRoomForm.getInputProps('daily_price')}
        />
        <Button type="submit">Add Room</Button>
      </form>
    </div>
  );
}
