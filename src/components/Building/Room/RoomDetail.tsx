import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../../api/api.ts';
import toast from 'react-hot-toast';

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

const RoomInit: RoomProps = {
  capacity: 0,
  id: 0,
  floor: 0,
  description: '',
  grid_x: 0,
  grid_y: 0,
  is_active: false,
  building_id: 0,
  unit_name: '',
  image_url: '',
  daily_price: 0,
};

export function RoomDetail() {
  const { room_id } = useParams();
  const [data, setData] = useState<RoomProps>(RoomInit);
  useEffect(() => {
    api
      .get(`/room/${room_id}`)
      .then(r => setData(r.data))
      .catch(() => {
        toast.error('An error occurred while fetching data.');
      });
  }, [room_id]);
  return (
    <div>
      <h1>{data.unit_name}</h1>
      <p>{data.description}</p>
      <p>{data.capacity}</p>
      <p>{data.daily_price}</p>
      <p>{data.floor}</p>
      <Link to={`/building/detail/${data.building_id}`}>Go Back</Link>
    </div>
  );
}
