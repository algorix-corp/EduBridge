import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/api.ts';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { colors } from '../../colors/index.ts';
import { ReactComponent as OutlinedLogoSVG } from '../../assets/outlinedLogo.svg';
import { ReactComponent as ReturnSVG } from '../../assets/return.svg';
import { ReactComponent as PinSVG } from '../../assets/pin.svg';
import { Form } from '../../global/Form.tsx';
import { FileButton, LoadingOverlay } from '@mantine/core';
import { Button } from '../../global/Button.tsx';
import { modals } from '@mantine/modals';

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
  const delete_building = () => {
    const randomstr = Math.random().toString(36).substring(7);
    toast.loading('Deleting the building..', { id: randomstr });
    api
      .delete(`/building/${id}`)
      .then(() => {
        toast.success('Successfully deleted the building!', { id: randomstr });
        navigate('/building');
      })
      .catch(() => {
        toast.error('An error occurred while deleting the building.', {
          id: randomstr,
        });
      });
  };
  return (
    <Container>
      <LoadingOverlay visible={data === null} />
      <OverlayContainer>
        <div
          style={{
            position: 'relative',
            top: 'calc(50% - 40px)',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <BuildingForm
            style={{
              border: `2px solid ${colors.black}`,
              height: 'auto !important',
            }}
          >
            {editing ? (
              <FileButton
                onChange={value => {
                  if (!value) return;
                  change_image(value);
                }}
                accept="image/png,image/jpeg"
              >
                {props => (
                  <BuildingImage
                    {...props}
                    style={{
                      cursor: editing ? 'pointer' : 'auto',
                    }}
                    $src={data.image_url}
                  >
                    {data.image_url === '' ? <OutlinedLogo /> : undefined}
                  </BuildingImage>
                )}
              </FileButton>
            ) : (
              <BuildingImage
                style={{
                  cursor: editing ? 'pointer' : 'auto',
                }}
                $src={data.image_url}
              >
                {data.image_url === '' ? <OutlinedLogo /> : undefined}
              </BuildingImage>
            )}

            <TextArea>
              <BuildingTitle>
                {editing ? (
                  <ProfileEdit
                    defaultValue={data.name}
                    onChange={e => setName(e.target.value)}
                  />
                ) : (
                  data.name
                )}
              </BuildingTitle>
              <BuildingAddress>
                <Pin />
                {editing ? (
                  <ProfileEdit
                    defaultValue={data.address}
                    onChange={e => setAddress(e.target.value)}
                  />
                ) : (
                  data.address
                )}
              </BuildingAddress>
              <BuildingDescription>
                {editing ? (
                  <ProfileEdit
                    defaultValue={data.description}
                    onChange={e => setDescription(e.target.value)}
                  />
                ) : (
                  data.description
                )}
              </BuildingDescription>
            </TextArea>
          </BuildingForm>
          {editing ? (
            <ButtonGroup>
              <Button
                backgroundColor={colors.black}
                color={colors.black}
                isBordered
                onClick={() => {
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                backgroundColor={colors.blue}
                color={colors.white}
                onClick={update_building}
              >
                Edit
              </Button>
            </ButtonGroup>
          ) : (
            <ButtonGroup>
              <Button
                backgroundColor={colors.black}
                color={colors.black}
                onClick={() => setEditing(true)}
                isBordered
              >
                Edit
              </Button>
              <Button
                backgroundColor={colors.red}
                color={colors.white}
                onClick={() => {
                  if (confirm('Are you going to really delete the building?'))
                    delete_building();
                }}
              >
                Delete
              </Button>
            </ButtonGroup>
          )}
        </div>
      </OverlayContainer>
      <PreferenceContainer>
        <Outlet />
      </PreferenceContainer>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: calc(100vh - 100px);
`;

const OverlayContainer = styled.div`
  position: relative;
  width: calc(100vw - 500px);
  height: 100%;
  float: left;
`;

const PreferenceContainer = styled.div`
  position: relative;
  width: 500px;
  height: 100%;
  float: right;

  border-left: 2px solid ${colors.gray};
`;

const BuildingForm = styled(Form)`
  position: relative;
  left: 50%;
  transform: translateX(-50%);

  width: 500px;
  height: 215px;
  overflow: hidden;

  & div {
    padding: 0;
    display: flex;
    width: auto;
  }
`;

const BuildingImage = styled.div<{
  $src: string;
}>`
  position: relative;
  top: -2px;
  left: -2px;

  width: 180px !important;
  height: 215px;

  border-right: 2px solid ${colors.black};

  background-image: ${({ $src }) => ($src === '' ? null : `url(${$src})`)};
  background-color: ${colors.black};
  background-position: center;
  background-size: cover;
`;

const OutlinedLogo = styled(OutlinedLogoSVG)`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 52px;
  height: 52px;
`;

const TextArea = styled.div`
  position: relative;
  width: calc(100% - 180px) !important;
  height: 215px;

  display: initial !important;
  padding: 20px 30px 20px 30px !important;
`;

const BuildingTitle = styled.p`
  font-weight: 700;
  font-size: 34px;
  color: ${colors.pblack};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Pin = styled(PinSVG)`
  position: relative;
  top: 3px;
  margin-right: 3px;

  width: 18px;
  height: 18px;
`;

const BuildingAddress = styled.p`
  font-weight: 600;
  font-size: 18px;

  color: ${colors.vampgray};

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BuildingDescription = styled.p`
  position: absolute;
  width: calc(100% - 60px);
  max-height: 45px;

  font-weight: 600;
  bottom: 30px;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;

  line-height: 140%;

  color: ${colors.pblack};
`;

const ButtonGroup = styled.div`
  position: relative;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  gap: 15px;
  display: inline-block;

  height: 50px;

  display: flex;
  justify-content: center;
`;

const ProfileEdit = styled.input`
  width: 200px;
  border-left: 0;
  border-right: 0;
  border-top: 0;
  border-bottom: 1px solid ${colors.vampgray};
  outline: none;
  font-family: inherit;

  &:focus {
    border-left: 0;
    border-right: 0;
    border-top: 0;
    border-bottom: 1px solid ${colors.blue};
    outline: none;
  }
`;
