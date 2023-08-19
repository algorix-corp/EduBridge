import React, { useState } from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  margin: 0 auto;
  width: 80%;
  max-width: 1200px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  color: black;
  text-align: left;

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
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
    margin-right: 8px;
  }
`;

const AddStudentForm = styled.div`
  border: 1px solid #ddd;
  padding: 16px;
  margin-top: 16px;

  label {
    display: block;
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #ddd;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
  }
`;

export function AcademyStudentsDashboard() {
  const [studentStatuses, setStudentStatuses] = useState([
    {
      studentId: 1,
      studentName: '일론머스크',
      subject: 'Math',
      paymentStatus: 'Paid',
      description: '도지도지',
    },
    {
      studentId: 2,
      studentName: '주커버그',
      subject: 'History',
      paymentStatus: 'Pending',
      description: '메-타',
    },
    {
      studentId: 3,
      studentName: '시진핑',
      subject: 'Science',
      paymentStatus: 'Paid',
      description: '핑핑이',
    },
    {
      studentId: 1,
      studentName: '일론머스크',
      subject: 'Math',
      paymentStatus: 'Paid',
      description: '도지도지',
    },
    {
      studentId: 2,
      studentName: '주커버그',
      subject: 'History',
      paymentStatus: 'Pending',
      description: '메-타',
    },
    {
      studentId: 3,
      studentName: '시진핑',
      subject: 'Science',
      paymentStatus: 'Paid',
      description: '핑핑이',
    },
    {
      studentId: 1,
      studentName: '일론머스크',
      subject: 'Math',
      paymentStatus: 'Paid',
      description: '도지도지',
    },
    {
      studentId: 2,
      studentName: '주커버그',
      subject: 'History',
      paymentStatus: 'Pending',
      description: '메-타',
    },
    {
      studentId: 3,
      studentName: '시진핑',
      subject: 'Science',
      paymentStatus: 'Paid',
      description: '핑핑이',
    },
  ]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newStudent, setNewStudent] = useState({
    studentName: '',
    subject: '',
    paymentStatus: '',
    description: '',
  });

  const handleEditClick = index => {
    setEditingIndex(index);
  };

  const handleSaveClick = (index, updatedStatus) => {
    const updatedStudentStatuses = [...studentStatuses];
    updatedStudentStatuses[index] = updatedStatus;
    setStudentStatuses(updatedStudentStatuses);
    setEditingIndex(-1);
  };

  const handleDeleteClick = index => {
    const updatedStudentStatuses = studentStatuses.filter(
      (_, i) => i !== index,
    );
    setStudentStatuses(updatedStudentStatuses);
  };

  const handleAddClick = () => {
    setStudentStatuses([...studentStatuses, newStudent]);
    setNewStudent({
      studentName: '',
      subject: '',
      paymentStatus: '',
      description: '',
    });
  };

  const handleInputChange = (index, field, value) => {
    const updatedStudentStatuses = [...studentStatuses];
    updatedStudentStatuses[index][field] = value;
    setStudentStatuses(updatedStudentStatuses);
  };

  return (
    <DashboardContainer>
      <h2>Add Student</h2>
      <AddStudentForm>
        <label>Student Name:</label>
        <input
          type="text"
          value={newStudent.studentName}
          onChange={e =>
            setNewStudent({ ...newStudent, studentName: e.target.value })
          }
        />
        <label>Subject:</label>
        <input
          type="text"
          value={newStudent.subject}
          onChange={e =>
            setNewStudent({ ...newStudent, subject: e.target.value })
          }
        />
        <label>Payment Status:</label>
        <input
          type="text"
          value={newStudent.paymentStatus}
          onChange={e =>
            setNewStudent({ ...newStudent, paymentStatus: e.target.value })
          }
        />
        <label>Description:</label>
        <input
          type="text"
          value={newStudent.description}
          onChange={e =>
            setNewStudent({ ...newStudent, description: e.target.value })
          }
        />
        <button onClick={handleAddClick}>Add</button>
      </AddStudentForm>

      <StyledTable>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Subject</th>
            <th>Payment Status</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentStatuses.map((status, index) => (
            <tr key={index}>
              <td>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={status.studentName}
                    onChange={e =>
                      handleInputChange(index, 'studentName', e.target.value)
                    }
                  />
                ) : (
                  status.studentName
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={status.subject}
                    onChange={e =>
                      handleInputChange(index, 'subject', e.target.value)
                    }
                  />
                ) : (
                  status.subject
                )}
              </td>
              <td>{status.paymentStatus}</td>
              <td>{status.description}</td>
              <td>
                {editingIndex === index ? (
                  <>
                    <button onClick={() => handleSaveClick(index, status)}>
                      Save
                    </button>
                    <button onClick={() => setEditingIndex(-1)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(index)}>Edit</button>
                    <button onClick={() => handleDeleteClick(index)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </DashboardContainer>
  );
}
