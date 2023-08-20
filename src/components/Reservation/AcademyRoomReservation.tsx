import { ProgressHeader } from './ProgressHeader.tsx';
import { useEffect, useState } from 'react';
import { Button } from '../../global/Button.tsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/api.ts';
import { LoadingOverlay, Table } from '@mantine/core';
import { colors } from '../../colors';
import { DatePicker } from '@mantine/dates';
import styled from 'styled-components';
import { ReactComponent as OutlinedLogoSVG } from '../../assets/outlinedLogo.svg';
import { ReactComponent as PinSVG } from '../../assets/pin.svg';
import { Form } from '../../global/Form.tsx';

interface BuildingProps {
  description: string;
  owner_id: number;
  name: string;
  craeted_at: string;
  id: number;
  address: string;
  image_url: string;
}

interface Academy {
  id: number;
  name: string;
  subject: string;
  description: string;
  image_url: string;
}

interface RoomProps {
  capacity: number;
  id: number;
  floor: number;
  description: string;
  grid_x: number;
  grid_y: number;
  is_active: boolean;
  building_id: number;
  unit_name: string;
  image_url: string | null;
  daily_price: number;
}

export function AcademyRoomReservation() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [academy, setAcademy] = useState<Academy | null>(null);

  const [building_list, setBuildingList] = useState<BuildingProps[]>([]);
  const [room_list, setRoomList] = useState<RoomProps[]>([]);
  const [floor_list, setFloorList] = useState<number[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [building, setBuilding] = useState<BuildingProps | null>(null);
  const [floor, setFloor] = useState<number>(0);
  const [room, setRoom] = useState<RoomProps | null>(null);

  const [reservationDate, setReservationDate] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const [array, setArray] = useState<boolean[][]>([]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      toast.error('You are not signed in.');
      navigate('/auth/signin');
    }
    api
      .get('/academy')
      .then(r => {
        console.log(r.data);
        setAcademy(r.data);
      })
      .catch(() =>
        toast.error('An error occurred while fetching academy data.'),
      );
  }, [navigate]);

  function formatDate(date: Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('');
  }

  const reservation_submit = () => {
    if (!reservationDate[0] || !reservationDate[1]) {
      toast.error('Please select a date.');
      return;
    }
    if (academy == null) {
      toast.error('academy ID not yet.');
      return;
    }
    const academyId = academy.map(item => item.id);
    console.log(academyId[0]);
    api
      .post('/reservation', {
        room_id: room?.id,
        start_date: formatDate(reservationDate[0]),
        end_date: formatDate(reservationDate[1]),
        academy_id: academyId[0],
      })
      .then(r => {
        toast.success('Reservation created.');
        navigate(`/reservation/${r.data.id}`);
      })
      .catch(() => {
        toast.error('Reservation Failed.');
      });
  };

  useEffect(() => {
    let maxx = 0;
    let maxy = 0;
    setLoading(true);
    if (step === 1) {
      api
        .get('/building')
        .then(r => {
          setBuildingList(r.data);
          console.log(r.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error('An error occurred while fetching data.');
        });
    } else if (step === 2) {
      api
        .get('/room', { params: { building_id: building?.id } })
        .then(r => {
          setRoomList(r.data);
          // use anything but foreach because it's async
          for (let i = 0; i < r.data.length; i++) {
            if (!floor_list.includes(r.data[i].floor)) {
              setFloorList([...floor_list, r.data[i].floor]);
            }
          }
        })
        .catch(() => {
          toast.error('An error occurred while fetching data.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (step === 3) {
      console.log(floor);
      for (let i = 0; i < room_list.length; i++) {
        const value = room_list[i];
        if (value.floor === floor) {
          if (value.grid_x > maxx) {
            maxx = value.grid_x;
          }
          if (value.grid_y > maxy) {
            maxy = value.grid_y;
          }
        }
      }
      const arr = new Array(maxx + 1);
      for (let i = 0; i < maxx + 1; i++) {
        arr[i] = new Array(maxy + 1);
        for (let j = 0; j < maxy + 1; j++) {
          arr[i][j] = 'X';
        }
      }
      for (let i = 0; i < room_list.length; i++) {
        const value = room_list[i];
        if (value.floor === floor) {
          arr[value.grid_x][
            value.grid_y
          ] = `${value.unit_name}/${value.capacity}people`;
        }
      }
      setArray(arr);
      setLoading(false);
    } else if (step === 4) {
      setLoading(false);
    }
    //eslint-disable-next-line
  }, [step]);

  if (step === 1) {
    return (
      <Container>
        <LoadingOverlay visible={loading} />
        <Title>At first, choose the building to reserve.</Title>
        <BuildingGroup>
          {building_list.map(value => (
            <BuildingForm
              key={value.id}
              style={{
                border: `2px solid ${colors.black}`,
                height: 'auto !important',
              }}
              onClick={() => {
                setBuilding(value);
                setStep(step + 1);
              }}
              backgroundColor={colors.blue}
              color={colors.white}
            >
              <BuildingImage $src={value.image_url}>
                {value.image_url === '' ? <OutlinedLogo /> : undefined}
              </BuildingImage>
              <TextArea>
                <BuildingTitle style={{ color: colors.black }}>
                  {value.name}
                </BuildingTitle>
                <BuildingAddress>
                  <Pin />
                  {value.address}
                </BuildingAddress>
                <BuildingDescription>{value.description}</BuildingDescription>
              </TextArea>
            </BuildingForm>
          ))}
        </BuildingGroup>
        <div
          style={{
            width: '100vw',
            height: 275,
          }}
        />
      </Container>
    );
  } else if (step === 2) {
    return (
      <Container>
        <LoadingOverlay visible={loading} />
        <Title>Secondly, select the floor.</Title>
        <FloorGroup>
          {floor_list.map(value => (
            <FloorForm
              key={value}
              onClick={() => {
                setFloor(value);
                setStep(step + 1);
              }}
              style={{
                backgroundColor: colors.blue,
                height: 'auto !important',
              }}
            >
              <TextArea>
                <BuildingTitle>{value}</BuildingTitle>
              </TextArea>
            </FloorForm>
          ))}
        </FloorGroup>
      </Container>
    );
  } else if (step === 3) {
    return (
      <Container>
        <LoadingOverlay visible={loading} />
        <Title>Then select the room that you'll use.</Title>
        <TableGroup>
          <Table
            style={{ textAlign: 'center', border: '1px solid black' }}
            verticalSpacing="xs"
          >
            {array.map((value, index) => {
              return (
                <tr key={index}>
                  {value.map((value2, index2) => {
                    if (value2) {
                      return (
                        <td key={index2}>
                          <Button
                            onClick={() => {
                              setRoom(
                                room_list.find(
                                  value3 =>
                                    value3.grid_x === index &&
                                    value3.grid_y === index2,
                                ) ?? null,
                              );
                              setStep(step + 1);
                            }}
                          >
                            {value2}
                          </Button>
                        </td>
                      );
                    } else {
                      return (
                        <td key={index2}>
                          <Button disabled>{value2}</Button>
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </Table>
        </TableGroup>
      </Container>
    );
  } else if (step === 4) {
    return (
      <Container>
        <ProgressHeader steps={step} />
        <LoadingOverlay visible={loading} />
        <Title>Lastly, select the date.</Title>
        <DatePicker
          type="range"
          allowSingleDateInRange
          value={reservationDate}
          onChange={setReservationDate}
        />
        <Button onClick={() => reservation_submit()}>Submit</Button>
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
  top: 50%;
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

const FloorGroup = styled.div`
  position: relative;
  width: 100%;
  top: 150px;
  gap: 30px;
  display: flex;
  justify-content: center;
`;

const TableGroup = styled.div`
  top: 150px;
  position: relative;
  overflow: scroll;
`;

const FloorForm = styled(Form)`
  height: 75px;
  overflow: hidden;
  width: 75px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  transition: scale 150ms ease-in-out;
  border-radius: 16px;

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
  position: relative;
  top: -10px;
  font-weight: 700;
  font-size: 34px;
  color: ${colors.white};
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
