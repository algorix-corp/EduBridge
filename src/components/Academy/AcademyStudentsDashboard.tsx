import { useState } from 'react';
import styled from 'styled-components';
import { Grid } from 'gridjs-react';
import 'gridjs/dist/theme/mermaid.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { RowSelection } from 'gridjs/plugins/selection';

export function AcademyStudentsDashboard() {
  const [studentStatuses] = useState([
    {
      studentName: '일론머스크',
      subject: 'Math',
      paymentStatus: 'Paid',
      description: '도지도지',
    },
    {
      studentName: '민건',
      subject: 'Dobi',
      paymentStatus: 'Paid',
      description: '미기미기',
    },
    {
      studentName: '일론머스크',
      subject: 'Math',
      paymentStatus: 'Paid',
      description: '도지도지',
    },
  ]);

  const data = studentStatuses.map(status => [
    status.studentName,
    status.subject,
    status.paymentStatus,
    status.description,
  ]);

  return (
    <Container>
      <Grid
        data={data}
        columns={[
          {
            id: 'Checkbox',
            name: 'Select',
            plugin: { component: RowSelection },
          },
          'Student Name',
          'Subject',
          'Payment Status',
          'Desciption',
        ]}
        search={true}
        sort={true}
        pagination={true}
        className="table"
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  top: 100px;
  margin: 0 auto;
  width: 100vw;
  height: calc(100vh - 100px);
  max-width: 1200px;
`;
