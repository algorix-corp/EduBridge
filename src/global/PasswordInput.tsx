import { PasswordInput as Input } from '@mantine/core';
import styled from 'styled-components';
import { colors } from '../colors';

export function PasswordInput({ ...props }) {
  return <Container {...props} />;
}

const Container = styled(Input)`
  & div {
    border: 0;
  }

  & div div {
    height: 40px;
  }

  & div .mantine-Input-rightSection {
    width: 40px;

    scale: 1;
    cursor: pointer;
    transition: scale 150ms ease-in-out;

    &:hover {
      scale: 1.04;
    }
  }

  & div div input {
    border: 2px solid ${colors.gray};
    border-radius: 7px;

    width: calc(100% - 53px);
    height: 40px;
    padding: 0 15px 0 15px;
    font-size: 16px;
  }

  & div div input::placeholder {
    color: ${colors.vampgray};
  }

  & div div button {
    width: 40px;
    height: 40px;

    border: 2px solid ${colors.gray};
    border-radius: 7px;
  }
`;
