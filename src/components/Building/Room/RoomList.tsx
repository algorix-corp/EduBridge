import styled from 'styled-components';
import { Button } from '../../../global/Button.tsx';
import { useEffect, useState } from 'react';
import api from '../../../api/api.ts';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';

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
  return (
    <Link to={`/building/detail/${room.building_id}/room/${room.id}`}>
      {room.unit_name}
    </Link>
  );
}

export function RoomList() {
  const { id } = useParams();
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
          <RoomLine key={rooms.id} room={rooms} />
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
