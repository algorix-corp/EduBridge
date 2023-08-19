import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { Grid } from 'gridjs-react';
import 'gridjs/dist/theme/mermaid.css';
import api from '../../api/api.ts';
import { RowSelection } from 'gridjs/plugins/selection';
import toast from 'react-hot-toast';
import { Button } from '../../global/Button';
import { colors } from '../../colors';

interface Academy {
  id: number;
  name: string;
  subject: string;
  description: string;
  image_url: string;
}

interface Student {
  academy_id: number;
  name: string;
  school: string;
  grade: number;
  phone: string;
  parent_phone: string;
  memo: string;
  image_url: string;
}

export function AcademyStudentsDashboard() {
  const [academy_data, academy_setData] = useState<Academy | null>(null);
  const [grid_data, grid_setData] = useState<[Student] | null>(null);


  useEffect(() => {
    api
      .get('/academy')
      .then(r => {
        console.log(r.data);
        academy_setData(r.data);
      })
      .catch(() =>
        toast.error('An error occurred while fetching academy data.'),
      );
  }, []);

  useEffect(() => {
    if (academy_data !== null) {
      const academyId = academy_data.map(item => item.id);
      console.log(academyId);
      api
        .get(`/academy/${academyId[0]}/students`)
        .then(response => {
          console.log(response.data);
          grid_setData(response.data);
        })
        .catch(() =>
          toast.error('An error occurred while fetching students data.'),
        );
    }
  }, [academy_data]); // academy_data가 업데이트될 때마다 재실행
  

  const data = grid_data
    ? grid_data.map(status => [
        status.name,
        status.grade,
        status.phone,
        status.memo,
      ])
    : [];

    const handleSendMessage = () => {
        const checkboxPlugin = Grid.config.plugin.get('Checkbox');

        toast.success(`Messages sent successfully!`);
      };

      

    return (
    <><ButtonContainer>
        <Button backgroundColor={colors.black}
            color={colors.black}
            isBordered>Lecture</Button>
            <Button backgroundColor={colors.black}
            color={colors.black}
            isBordered>Payment</Button>
            <Button backgroundColor={colors.black}
            color={colors.black} onClick={handleSendMessage} 
            isBordered>Send Messages</Button>
            <Button backgroundColor={colors.black}
            color={colors.black}
            isBordered>Payment</Button>
    </ButtonContainer>
        <Container>
          {grid_data !== null ? (
            <Grid
              data={data}
              columns={[
                {
                  id: 'Checkbox',
                  name: 'Select',
                  plugin: { component: RowSelection },
                },
                'Student Name',
                'Grade',
                'Phone Number',
                'Memo',
              ]}
              sort={true}
              pagination={true}
              className="table"
            />
          ) : (
            <p>Loading...</p>
          )}
        </Container></>
      );
    }

const Container = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  top: 70px;
  margin: 0 auto;
  width: 100vw;
  height: calc(100vh - 100px);
  max-width: 1200px;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between; 
  top: 60px;
  position: relative;
  margin: 0 auto;
  width: 100vw;
  max-width: 1200px;
  & > button {
    flex: 1;
    margin: 0 5px;
  }
`;
