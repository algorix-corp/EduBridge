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
            <StyledCard shadow="sm" padding="lg" radius="md">
                <Card.Section>
                  <Image
                    src=""
                    height={300}
                    alt={'student management'}
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
              </StyledCard>
            </SelectionCard>
            <SelectionCard>
            <StyledCard shadow="sm" padding="lg" radius="md">
                <Card.Section>
                  <Image
                    src=""
                    height={300}
                    alt={'room reservation'}
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
              </StyledCard>
            </SelectionCard>
        </SelectionArea>
    </div>
  );
}

const SelectionCard = styled.div`
  width: 400px;
  padding: 20px;
`;

const SelectionArea = styled.div`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #040404;
`;

const StyledCard = styled(Card)`
  background-color: #090909;
  color: white;
  cursor: pointer;
`;