// import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Form } from '../../global/Form';
import { colors } from '../../colors';

export function AcademySelection() {
  // const navigate = useNavigate();

  return (
    <Container>
      <FormGroup>
        <SelectForm
          style={{
            float: 'left',
          }}
        >
          <Title>Student Management</Title>
        </SelectForm>
        <SelectForm
          style={{
            float: 'right',
          }}
        >
          <Title>Room Reservation</Title>
        </SelectForm>
      </FormGroup>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 100px);
`;

const FormGroup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 1100px;
  height: 350px;

  background-color: red;
`;

const Title = styled.p`
  font-size: 26px;
  font-weight: 600;
`;

const SelectForm = styled(Form)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid ${colors.black};

  width: 500px;
  height: 100%;
  background-color: blue;
`;
