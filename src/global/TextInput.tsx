import { TextInput as Input } from '@mantine/core';
import styled from 'styled-components';
import { colors } from '../colors';

export function TextInput({ ...props }) {
  return <Container {...props} />;
}

const Container = styled(Input)`
  & label {
    margin-bottom: 5px;
    font-weight: 600;
  }

  & label span {
    display: none;
  }

  & div {
    height: 40px;
    overflow: visible;
  }

  & div input {
    border: 2px solid ${colors.gray};
    border-radius: 7px;

    width: 100%;
    height: 40px;
    padding: 0 15px 0 15px;
    font-size: 16px;

    &:focus {
      border-color: ${colors.gray};
    }
  }

  & div input::placeholder {
    color: ${colors.vampgray};
  }
`;
