import { useNavigate } from 'react-router-dom';
import { Button, Card, Image } from '@mantine/core';
import styled from 'styled-components';

export function AcademySelection() {
  const navigate = useNavigate();
  return (
    <div>
      <SelectionArea>
        <SelectionCard>
          <StyledCard shadow="sm" padding="lg" radius="md">
            <Card.Section>
              <Image src="" height={300} alt={'student management'} />
            </Card.Section>
            <Button
              variant="light"
              color="yellow"
              fullWidth
              mt="md"
              radius="md"
              onClick={() => navigate(`/academy/students`)}
            >
              Student Management
            </Button>
          </StyledCard>
        </SelectionCard>
        <SelectionCard>
          <StyledCard shadow="sm" padding="lg" radius="md">
            <Card.Section>
              <Image src="" height={300} alt={'room reservation'} />
            </Card.Section>
            <Button
              variant="light"
              color="yellow"
              fullWidth
              mt="md"
              radius="md"
              onClick={() => navigate(`/academy/reservation`)}
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
  width: 380px;
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
