import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  margin: 0 auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  color: black;
  text-align: left;

  th, td {
    padding: 10px;
    border-bottom: 1px solid black;
  }

  th {
    background-color: #f8f8f8;
  }

  td {
    background-color: white;
  }

  button {
    background-color: transparent;
    color: red;
    border: none;
    cursor: pointer;
  }
`;

export function AcademyStudentsDashboard() {
  const dummyStudentStatuses = [
    { studentId: 1, studentName: '일론머스크', subject: 'Math', paymentStatus: 'Paid', description: '도지도지' },
    { studentId: 2, studentName: '주커버그', subject: 'History', paymentStatus: 'Pending', description: '메-타' },
    { studentId: 3, studentName: '시진핑', subject: 'Science', paymentStatus: 'Paid', description: '핑핑이' },
    { studentId: 1, studentName: '일론머스크', subject: 'Math', paymentStatus: 'Paid', description: '도지도지' },
    { studentId: 2, studentName: '주커버그', subject: 'History', paymentStatus: 'Pending', description: '메-타' },
    { studentId: 3, studentName: '시진핑', subject: 'Science', paymentStatus: 'Paid', description: '핑핑이' },
    { studentId: 1, studentName: '일론머스크', subject: 'Math', paymentStatus: 'Paid', description: '도지도지' },
    { studentId: 2, studentName: '주커버그', subject: 'History', paymentStatus: 'Pending', description: '메-타' },
    { studentId: 3, studentName: '시진핑', subject: 'Science', paymentStatus: 'Paid', description: '핑핑이' },
  ];

  return (
    <DashboardContainer>
      <StyledTable>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Subject</th>
            <th>Payment Status</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {dummyStudentStatuses.map((status, index) => (
            <tr key={index}>
              <td>{status.studentName}</td>
              <td>{status.subject}</td>
              <td>{status.paymentStatus}</td>
              <td>{status.description}</td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </DashboardContainer>
  );
}
