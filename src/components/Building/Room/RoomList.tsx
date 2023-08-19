import styled from 'styled-components';
import { Button } from '../../../global/Button.tsx';
import { useEffect, useState } from 'react';
import api from '../../../api/api.ts';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface RoomProps {
  capacity: number;
  id: number;
  floor: number;
  description: string;
  grid_x: number;
  grid_y: number;
  is_active: boolean;
  building_id: number;
  unit_name: string;
  image_url: string | null;
  daily_price: number;
}

function RoomLine({ room }: { room: RoomProps }) {
  return <div>{room.unit_name}</div>;
}

export function RoomList({ id }: { id: number }) {
  const navigate = useNavigate();
  const [data, setData] = useState<RoomProps[]>([]);
  useEffect(() => {
    api
      .get('/room', {
        params: {
          building_id: id,
        },
      })
      .then(r => setData(r.data))
      .catch(() => {
        toast.error('An error occurred while fetching data.');
      });
  }, [id]);

  return (
    <Container>
      <div>
        {data.map(rooms => (
          <RoomLine room={rooms} />
        ))}
      </div>
      <div>
        <Button onClick={() => navigate(`/building/detail/${id}/new`)}>
          Add Room
        </Button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid black;
  padding: 30px;
  display: flex;
  flex-direction: row;
`;
