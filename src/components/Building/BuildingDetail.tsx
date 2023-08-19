import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/api.ts';
import toast from 'react-hot-toast';
import { FileButton, Image, LoadingOverlay } from '@mantine/core';
import styled from 'styled-components';
import { Button } from '../../global/Button.tsx';
import { colors } from '../../colors';
import { modals } from '@mantine/modals';
import { RoomList } from './Room/RoomList.tsx';

interface BuildingProps {
  description: string;
  owner_id: number;
  name: string;
  craeted_at: string;
  id: number;
  address: string;
  image_url: string;
}

const BuildingInit: BuildingProps = {
  description: '',
  owner_id: 0,
  name: '',
  craeted_at: '',
  id: 0,
  address: '',
  image_url: '',
};

export function BuildingDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<BuildingProps>(BuildingInit);

  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    api
      .get(`/building/${id}`)
      .then(r => {
        console.log(r.data);
        setName(r.data.name);
        setAddress(r.data.address);
        setDescription(r.data.description);
        setData(r.data);
      })
      .catch(() => {
        toast.error('An error occurred while fetching data.');
      });
    api
      .get(`/room/`, {
        params: {
          building_id: id,
        },
      })
      .then(r => console.log(r.data))
      .catch(() => {
        toast.error('An error occurred while fetching data.');
      });
  }, [id]);

  const change_image = (value: File) => {
    const randomstr = Math.random().toString(36).substring(7);
    toast.loading('Updating image..', { id: randomstr });
    const reader = new FileReader();
    reader.readAsDataURL(value);
    reader.onloadend = () => {
      const imageDataUrl = reader.result as string;
      const body = {
        image_dataurl: imageDataUrl,
      };
      api
        .put(`/building/${id}/image`, body)
        .then(() => {
          toast.success('Successfully updated image!', { id: randomstr });
        })
        .catch(() => {
          toast.error('An error occurred while updating image.', {
            id: randomstr,
          });
        })
        .finally(() => {
          navigate('/building');
        });
    };
  };
  const update_building = () => {
    const randomstr = Math.random().toString(36).substring(7);
    toast.loading('Updating building..', { id: randomstr });
    const body = {
      name: name,
      address: address,
      description: description,
    };
    api
      .put(`/building/${id}`, body)
      .then(() => {
        toast.success('Successfully updated building!', { id: randomstr });
      })
      .catch(() => {
        toast.error('An error occurred while updating building.', {
          id: randomstr,
        });
      })
      .finally(() => {
        navigate('/building');
      });
  };
  return (
    <BuildingDetailPage>
      <LoadingOverlay visible={data === BuildingInit} />
      <div>
        <h1>
          {editing ? (
            <TitleInput
              id="name"
              defaultValue={data.name}
              onChange={e => setName(e.target.value)}
            />
          ) : (
            data.name
          )}
        </h1>
        <h3>
          {editing ? (
            <DescriptionInput
              id="description"
              defaultValue={data.description}
              onChange={e => setDescription(e.target.value)}
            />
          ) : (
            data.description
          )}
        </h3>
        <h3>
          {editing ? (
            <DescriptionInput
              id="address"
              defaultValue={data.address}
              onChange={e => setAddress(e.target.value)}
            />
          ) : (
            data.address
          )}
        </h3>
      </div>
      <div>
        {editing ? (
          <Button
            onClick={() =>
              modals.openConfirmModal({
                title: 'Change Image',
                labels: { confirm: 'Confirm', cancel: 'Cancel' },
                children: (
                  <>
                    <FileButton
                      onChange={value => {
                        if (!value) return;
                        change_image(value);
                      }}
                      accept="image/png,image/jpeg"
                    >
                      {props => (
                        <Button {...props}>Pick Building Picture</Button>
                      )}
                    </FileButton>
                  </>
                ),
              })
            }
          >
            Change Image
          </Button>
        ) : (
          <Image src={data.image_url} height={300} alt={`building-${id}`} />
        )}
        {editing ? (
          <>
            <Button onClick={() => setEditing(false)}>Cancel</Button>
            <Button onClick={() => update_building()}>Save</Button>
          </>
        ) : (
          <Button onClick={() => setEditing(true)}>Edit</Button>
        )}
        <RoomList id={Number(id)} />
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

const TitleInput = styled.input`
  width: 300px;
  border-left: 0;
  border-right: 0;
  border-top: 0;
  border-bottom: 2px solid ${colors.gray};
  outline: none;
  font-family: inherit;

  &:focus {
    border-left: 0;
    border-right: 0;
    border-top: 0;
    border-bottom: 2px solid ${colors.blue};
    outline: none;
  }
`;

const DescriptionInput = styled.input`
  width: 700px;
  border-left: 0;
  border-right: 0;
  border-top: 0;
  border-bottom: 2px solid ${colors.gray};
  outline: none;
  font-family: inherit;

  &:focus {
    border-left: 0;
    border-right: 0;
    border-top: 0;
    border-bottom: 2px solid ${colors.blue};
    outline: none;
  }
`;
