import { FileInput as Input } from '@mantine/core';
import styled from 'styled-components';
import { colors } from '../colors';

export function FileInput({ ...props }) {
  return <Container {...props} />;
}

const Container = styled(Input)`
  & label {
    margin-bottom: 5px;
    font-weight: 600;
  }

  & div {
    overflow: visible;
  }

  & div button {
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

  & div button::placeholder {
    color: ${colors.vampgray};
  }
`;
