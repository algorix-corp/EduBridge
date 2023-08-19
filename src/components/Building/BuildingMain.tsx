import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Group, Image, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import api from '../../api/api.ts';
import styled from 'styled-components';

interface Building {
  name: string;
  address: string;
  image_url: string;
}

export function BuildingMain() {
  const navigate = useNavigate();
  const state = useLocation().state;
  const [newBuilding, setNewBuilding] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [data, setData] = useState<[Building] | null>(null);
  useEffect(() => {
    if (state && state.newBuilding) {
      setNewBuilding(true);
    }
  }, [state]);
  useEffect(() => {
    api
      .get('/building')
      .then(r => {
        setData(r.data);
      })
      .catch(() => setError(true));
  }, []);
  const closeSuccess = () => {
    setNewBuilding(false);
  };
  return (
    <div>
      {newBuilding ? (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          withCloseButton
          onClick={closeSuccess}
        >
          Successfully Created Building!
        </Alert>
      ) : (
        <div></div>
      )}
      {error ? (
        <Alert icon={<IconAlertCircle size="1rem" />} color="red">
          An error occurred while fetching buildings.
        </Alert>
      ) : (
        <div></div>
      )}
      <BuildingArea>
        {data ? (
          data.map((building, index) => (
            <BuildingCard key={index}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src={building.image_url}
                    height={300}
                    alt={`building-${index}`}
                  />
                </Card.Section>
                <Group position="apart" mt="md" mb="xs">
                  <Text weight={500}>{building.name}</Text>
                </Group>
                <Text size="sm" color="dimmed">
                  {building.address}
                </Text>
                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() => navigate(`/building/detail/${index}`)}
                >
                  View Building
                </Button>
              </Card>
            </BuildingCard>
          ))
        ) : (
          <div></div>
        )}
      </BuildingArea>
    </div>
  );
}

const BuildingCard = styled.div`
  width: 450px;
  padding: 20px;
`;

const BuildingArea = styled.div`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
