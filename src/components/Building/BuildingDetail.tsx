import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/api.ts';
import toast from 'react-hot-toast';
import { Image } from '@mantine/core';
import styled from 'styled-components';

export function BuildingDetail() {
  const { id } = useParams();
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    api
      .get(`/building/${id}`)
      .then(r => {
        console.log(r.data);
        setName(r.data.name);
        setAddress(r.data.address);
        setDescription(r.data.description);
        setImage(r.data.image_url);
      })
      .catch(() => {
        toast.error('An error occurred while fetching data.');
      });
    api
      .get(`/building/${id}/room`)
      .then(r => console.log(r.data))
      .catch(() => {
        toast.error('An error occurred while fetching data.');
      });
  });
  return (
    <BuildingDetailPage>
      <div>
        <h1>{name}</h1>
        <h3>{description}</h3>
        <h3>{address}</h3>
      </div>
      <div>
        <Image src={image} height={300} alt={`building-${id}`} />
      </div>
    </BuildingDetailPage>
  );
}

const BuildingDetailPage = styled.div`
  margin: 30px 200px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
