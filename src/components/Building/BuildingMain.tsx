import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoadingOverlay } from '@mantine/core';
import api from '../../api/api.ts';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { Form } from '../../global/Form.tsx';
import { colors } from '../../colors/index.ts';
import { ReactComponent as OutlinedLogoSVG } from '../../assets/outlinedLogo.svg';
import { ReactComponent as PinSVG } from '../../assets/pin.svg';
import { Button } from '../../global/Button.tsx';

interface Building {
  id: number;
  name: string;
  description: string;
  address: string;
  image_url: string;
}

export function BuildingMain() {
  const navigate = useNavigate();
  const [data, setData] = useState<[Building] | null>(null);

  useEffect(() => {
    api
      .get('/building')
      .then(r => {
        setData(r.data);
      })
      .catch(() => {
        toast.error('An error occurred while fetching data.');
        navigate('/');
      });
  }, [navigate]);

  return (
    <Container>
      <LoadingOverlay visible={data === null} />
      <Title>Choose your Building to view.</Title>
      <BuildingGroup>
        {data
          ? data.map((building, index) => (
              <BuildingForm
                key={index}
                style={{
                  border: `2px solid ${colors.black}`,
                  height: 'auto !important',
                }}
                onClick={() => navigate(`/building/detail/${building.id}`)}
              >
                <BuildingImage $src={building.image_url}>
                  {building.image_url === '' ? <OutlinedLogo /> : undefined}
                </BuildingImage>
                <TextArea>
                  <BuildingTitle>{building.name}</BuildingTitle>
                  <BuildingAddress>
                    <Pin />
                    {building.address}
                  </BuildingAddress>
                  <BuildingDescription>
                    {building.description}
                  </BuildingDescription>
                </TextArea>
              </BuildingForm>
            ))
          : undefined}
        <div
          style={{
            width: 500,
            height: 215,
          }}
        >
          <Button
            onClick={() => navigate('/building/new')}
            backgroundColor={colors.black}
            color={colors.black}
            isBordered
            style={{
              position: 'relative',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            Create new one
          </Button>
        </div>
      </BuildingGroup>
      <div
        style={{
          width: '100vw',
          height: 325,
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  top: 50px;
  width: 100vw;
  padding: 0 200px 0 200px;
`;

const BuildingGroup = styled.div`
  position: relative;
  width: 100%;
  top: 150px;

  display: grid;
  grid-template-columns: repeat(auto-fill, 500px);
  column-gap: 50px;
  row-gap: 50px;
  justify-content: center;
`;

const BuildingForm = styled(Form)`
  height: 215px;
  overflow: hidden;

  cursor: pointer;
  transition: scale 150ms ease-in-out;

  &:hover {
    scale: 1.04;
  }

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

  display: inline-block;
`;

const BuildingDescription = styled.p`
  position: absolute;
  width: calc(100% - 60px);
  max-height: 45px;

  font-weight: 600;
  bottom: 30px;
  font-size: 16px;
  white-space: pre-wrap;
  line-height: 140%;

  color: ${colors.pblack};
`;

const Title = styled.p`
  position: relative;
  top: 100px;

  font-weight: 900;
  font-size: 45px;
  text-align: center;
  color: ${colors.pblack};
`;
