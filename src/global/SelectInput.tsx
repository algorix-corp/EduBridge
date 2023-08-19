import { Select } from '@mantine/core';
import styled from 'styled-components';
import { colors } from '../colors';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export function SelectInput({ data, ...props }) {
  return <Container {...props} data={data} />;
}

const Container = styled(Select)`
  & .mantine-Select-label {
    margin-bottom: 5px;
    font-weight: 600;
  }

  & div {
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

  .mantine-Select-dropdown div div div div div:not(:last-child) {
    margin-bottom: 4px;
  }

  .mantine-Select-dropdown div div div div div div {
    color: ${colors.pblack} !important;
    background-color: ${colors.white} !important;
  }

  .mantine-Select-dropdown div div div div div div:hover {
    background-color: ${colors.gray} !important;
  }
`;
