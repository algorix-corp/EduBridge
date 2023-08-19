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

export function AcademySelection() {
  const navigate = useNavigate();
  return (
    <div>
        <SelectionArea>
            <SelectionCard>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src=""
                    height={300}
                    alt={'building-1'}
                  />
                </Card.Section>
                <Button
                  variant="light"
                  color="yellow"
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() => navigate(`/building/detail/${index}`)}
                >
                  Student Management
                </Button>
              </Card>
            </SelectionCard>
            <SelectionCard>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src=""
                    height={300}
                    alt={'building-2'}
                  />
                </Card.Section>
                <Button
                  variant="light"
                  color="yellow"
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() => navigate(`/building/detail/${index}`)}
                >
                  Room Reservation
                </Button>
              </Card>
            </SelectionCard>
        </SelectionArea>
    </div>
  );
}

const SelectionCard = styled.div`
  width: 450px;
  padding: 20px;
`;

const SelectionArea = styled.div`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
