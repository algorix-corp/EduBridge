// import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Form } from '../../global/Form';
import { colors } from '../../colors';
import linePNG from '../../assets/line.png';

import managementJPG from '../../assets/management.jpg';
import reservationJPG from '../../assets/reservation.jpg';
import { Link } from 'react-router-dom';

import { ReactComponent as ManagementSVG } from '../../assets/management.svg';
import { ReactComponent as ReservationSVG } from '../../assets/reservation.svg';

export function AcademySelection() {
  return (
    <Container>
      <FormGroup>
        <Title>What I am looking for is.. 👀</Title>
        <Link to="/academy/students">
          <SelectForm
            style={{
              float: 'left',
              backgroundImage: `url('${managementJPG}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Management />
            <Category>Student Management</Category>
          </SelectForm>
        </Link>
        <Link to="/academy/reservation">
          <SelectForm
            style={{
              float: 'right',
              backgroundImage: `url('${reservationJPG}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Reservation />
            <Category>Room Reservation</Category>
          </SelectForm>
        </Link>
      </FormGroup>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  background-color: ${colors.blue};
  background-image: url('${linePNG}');
  background-attachment: fixed;
  background-position: center;

  z-index: -1;
`;

const FormGroup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 850px;
`;

const Title = styled.p`
  top: 500px;

  color: ${colors.white};
  font-size: 45px;
  font-weight: 900;

  text-align: center;
`;

const SelectForm = styled(Form)`
  width: 400px;
  height: 240px;
  background-color: ${colors.white};
  transition: scale 150ms ease-in-out;

  margin-top: 50px;

  &:hover {
    scale: 1.04;
  }

  & div {
    width: 100%;
    height: 100%;

    backdrop-filter: blur(3px) brightness(0.4);

    display: grid;
    align-items: center;
    justify-content: center;
    border-radius: 16px;

    cursor: pointer;
  }
`;

const Category = styled.p`
  margin-bottom: 22.5px;

  font-size: 28px;
  font-weight: 600;

  display: inline-block;
  color: ${colors.white};
`;

const Management = styled(ManagementSVG)`
  position: relative;
  top: 22.5px;
  left: 50%;
  transform: translateX(-50%);

  width: 52px;
  height: 52px;
`;

const Reservation = styled(ReservationSVG)`
  position: relative;
  top: 22.5px;
  left: 50%;
  transform: translateX(-50%);

  width: 52px;
  height: 52px;
`;
