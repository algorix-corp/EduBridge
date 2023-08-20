import styled from 'styled-components';
import { useEffect, useState } from 'react';
import api from '../../../api/api.ts';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { colors } from '../../../colors/index.ts';
import commaNumber from 'comma-number';

import { ReactComponent as EditSVG } from '../../../assets/edit.svg';
import { ReactComponent as BinSVG } from '../../../assets/bin.svg';
import { Button } from '../../../global/Button.tsx';

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

export function RoomList() {
  const navigate = useNavigate();
  // navigate('///new)
  //const [editing, setediting] = useState<boolean>(false);
  const { id } = useParams();
  const [data, setData] = useState<RoomProps[]>([]);
  useEffect(() => {
    api
      .get('/room', {
        params: {
          building_id: id,
        },
      })
      .then(r => setData(r.data))
      .catch(() => {
        toast.error('An error occurred while fetching data.');
      });
  }, [id]);
  const remove_room = (id: number) => {
    api
      .delete(`/room/${id}`)
      .then(() => {
        toast.success('Delete Success!');
        window.location.reload();
      })
      .catch(() => {
        toast.error('Delete Failed');
      });
  };

  return (
    <Container>
      <Category>
        <CategoryText
          style={{
            width: 200,
          }}
        >
          UNIT NAME
        </CategoryText>
        <CategoryText
          style={{
            width: 100,
          }}
        >
          FLOOR
        </CategoryText>
        <CategoryText
          style={{
            width: 100,
          }}
        >
          CAPACITY
        </CategoryText>
        <CategoryText
          style={{
            width: 100,
          }}
        >
          DAILY PRICE
        </CategoryText>
      </Category>
      {data.sort().map((room, index) => (
        <Block key={index}>
          <Title
            style={{
              width: 200,
            }}
          >
            {room.unit_name}
          </Title>
          <Title
            style={{
              width: 100,
            }}
          >
            {room.floor}F
          </Title>
          <Title
            style={{
              width: 100,
            }}
          >
            {commaNumber(room.capacity)}
          </Title>
          <Title
            style={{
              width: 100,
            }}
          >
            ₩{commaNumber(room.daily_price)}
          </Title>
          <ButtonGroup>
            <SVGButton
              onClick={() => {
                if (confirm('Really delete?')) {
                  remove_room(room.id);
                }
              }}
            >
              <Bin />
            </SVGButton>
          </ButtonGroup>
          {/* {editing ? (
            <ButtonGroup>
              <SVGButton onClick={() => setediting(false)}>
                <Edit />
              </SVGButton>
              <SVGButton onClick={() => set}>
                <Bin />
              </SVGButton>
            </ButtonGroup>
          ) : (
            <ButtonGroup>
              <SVGButton onClick={() => setediting(true)}>
                <Edit />
              </SVGButton>
              <SVGButton
                onClick={() => {
                  if (confirm('Really delete?')) {
                    remove_room(room.id);
                  }
                }}
              >
                <Bin />
              </SVGButton>
            </ButtonGroup>
          )} */}
        </Block>
      ))}
      <div>
        <Button
          backgroundColor={colors.black}
          color={colors.white}
          onClick={() => navigate(`/building/detail/${id}/new`)}
          style={{
            marginTop: 25,
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          Add Room
        </Button>
      </div>
    </Container>
  );
}

const Category = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  height: 20px;
  border-bottom: 2px solid ${colors.gray};

  padding: 0 30px 0 30px;
`;

const CategoryText = styled.p`
  position: relative;
  display: inline-block;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  margin-top: -9px;
  color: ${colors.vampgray};
`;

const Container = styled.div`
  height: 100%;
  padding: 10px 0 20px 0;
`;

const Block = styled.div`
  width: 100%;
  height: 60px;

  display: flex;
  align-items: center;
  gap: 30px;

  padding: 0 30px 0 30px;

  border-bottom: 2px solid ${colors.gray};
`;

const Title = styled.p`
  font-weight: 500;
  font-size: 16px;
  display: inline-block;
  text-align: center;
  color: ${colors.pblack};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 5px;

  width: 85px;
  height: 40px;
  float: right;
`;

const SVGButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  /* border-radius: 7px; */
  width: 40px;
  height: 40px;

  color: ${colors.vampgray};
  cursor: pointer;
`;

const Edit = styled(EditSVG)`
  width: 18px;
  height: 18px;
`;

const Bin = styled(BinSVG)`
  width: 18px;
  height: 18px;
`;
