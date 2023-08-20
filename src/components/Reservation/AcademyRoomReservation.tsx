import { ProgressHeader } from './ProgressHeader.tsx';
import { useEffect, useState } from 'react';
import { Button } from '../../global/Button.tsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/api.ts';
import { LoadingOverlay, Table, Text, Title } from '@mantine/core';
import { colors } from '../../colors';
import { DatePicker } from '@mantine/dates';

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
      <>
        <ProgressHeader steps={step} />
        <LoadingOverlay visible={loading} />
        <Title>Let's Start Reservation</Title>
        <Text>First, Please Select a building to resreve.</Text>
        {building_list.map(value => {
          if (value.id === building?.id) {
            return (
              <Button
                key={value.id}
                onClick={() => {
                  setBuilding(value);
                }}
                backgroundColor={colors.blue}
                color={colors.white}
              >
                {value.name}
              </Button>
            );
          } else {
            return (
              <Button
                key={value.id}
                onClick={() => {
                  setBuilding(value);
                }}
              >
                {value.name}
              </Button>
            );
          }
        })}
        <Button onClick={() => setStep(step + 1)}>Next</Button>
      </>
    );
  } else if (step === 2) {
    return (
      <>
        <ProgressHeader steps={step} />
        <LoadingOverlay visible={loading} />
        <Title>Now it's time to select the rooms.</Title>
        <Text>But before, first select the floor first.</Text>
        {floor_list.map(value => {
          if (floor == value) {
            return (
              <Button
                key={value}
                onClick={() => setFloor(value)}
                backgroundColor={colors.blue}
                color={colors.white}
              >
                {value}
              </Button>
            );
          } else {
            return (
              <Button key={value} onClick={() => setFloor(value)}>
                {value}
              </Button>
            );
          }
        })}
        <Button onClick={() => setStep(step + 1)}>Next</Button>
        <Button onClick={() => setStep(step - 1)}>Prev</Button>
      </>
    );
  } else if (step === 3) {
    return (
      <>
        <ProgressHeader steps={step} />
        <LoadingOverlay visible={loading} />
        <Title>Now it's time to select the rooms.</Title>
        <Table verticalSpacing="xs">
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
        <Button onClick={() => setStep(step - 1)}>Prev</Button>
      </>
    );
  } else if (step === 4) {
    return (
      <>
        <ProgressHeader steps={step} />
        <LoadingOverlay visible={loading} />
        <Title>Finally, It's time to select the date.</Title>
        <DatePicker
          type="range"
          allowSingleDateInRange
          value={reservationDate}
          onChange={setReservationDate}
        />
        <Button onClick={() => reservation_submit()}>Submit</Button>
        <Button onClick={() => setStep(step - 1)}>Prev</Button>
      </>
    );
  }
}
