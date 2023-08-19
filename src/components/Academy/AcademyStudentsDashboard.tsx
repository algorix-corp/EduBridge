import React, { useState } from 'react';
import styled from 'styled-components';
import { Grid } from 'gridjs-react';
import 'gridjs/dist/theme/mermaid.css';

const DashboardContainer = styled.div`
  margin: 0 auto;
  width: 80%;
  max-width: 1200px;
`;

export function AcademyStudentsDashboard() {
  const [studentStatuses] = useState([
    {
      studentName: '일론머스크',
      subject: 'Math',
      paymentStatus: 'Paid',
      description: '도지도지',
    },
    {
      studentName: '주커버그',
      subject: 'History',
      paymentStatus: 'Pending',
      description: '메-타',
    },
    {
      studentName: '시진핑',
      subject: 'Science',
      paymentStatus: 'Paid',
      description: '핑핑이',
    },
    {
      studentName: '일론머스크',
      subject: 'Math',
      paymentStatus: 'Paid',
      description: '도지도지',
    },
    {
      studentName: '주커버그',
      subject: 'History',
      paymentStatus: 'Pending',
      description: '메-타',
    },
    {
      studentName: '시진핑',
      subject: 'Science',
      paymentStatus: 'Paid',
      description: '핑핑이',
    },
    {
      studentName: '일론머스크',
      subject: 'Math',
      paymentStatus: 'Paid',
      description: '도지도지',
    },
    {
      studentName: '주커버그',
      subject: 'History',
      paymentStatus: 'Pending',
      description: '메-타',
    },
    {
      studentName: '시진핑',
      subject: 'Science',
      paymentStatus: 'Paid',
      description: '핑핑이',
    },
    {
      studentName: '일론머스크',
      subject: 'Math',
      paymentStatus: 'Paid',
      description: '도지도지',
    },
    {
      studentName: '주커버그',
      subject: 'History',
      paymentStatus: 'Pending',
      description: '메-타',
    },
    {
      studentName: '시진핑',
      subject: 'Science',
      paymentStatus: 'Paid',
      description: '핑핑이',
    },
    // ... (other initial student data)
  ]);

  const columns = ['Student Name', 'Subject', 'Payment Status', 'Description'];

  const data = studentStatuses.map(status => [
    status.studentName,
    status.subject,
    status.paymentStatus,
    status.description,
  ]);

  return (
    <DashboardContainer>
      <Grid
        data={data}
        columns={columns}
        pagination={true}
        search={true}
        sort={true}
        className="table"
      />
    </DashboardContainer>
  );
}
