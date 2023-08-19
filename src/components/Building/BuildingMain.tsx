import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, Card, Group, Image, Text } from '@mantine/core';
import api from '../../api/api.ts';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { IconPlus } from '@tabler/icons-react';

interface Building {
  id: number;
  name: string;
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
      .catch(() => toast.error('An error occurred while fetching data.'));
  }, []);
  return (
    <div>
      <BuildingArea>
        <div>
          <Button onClick={() => navigate('/building/new')}>
            <IconPlus size={20} />
            New
          </Button>
        </div>
        {data ? (
          data.map(building => (
            <BuildingCard key={building.id}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src={building.image_url}
                    height={300}
                    alt={`building-${building.id}`}
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
                  onClick={() => navigate(`/building/detail/${building.id}`)}
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
