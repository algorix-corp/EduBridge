import { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { colors } from '../colors';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  children?: ReactNode;
  onClick?: () => void;
  backgroundColor?: string;
  color?: string;
  isBordered?: boolean;
  disabled?: boolean;
}

export function Button({
  type = undefined,
  children,
  onClick,
  backgroundColor = colors.white,
  color = colors.blue,
  isBordered = false,
  disabled,
}: ButtonProps) {
  return (
    <Container
      type={type}
      $backgroundColor={backgroundColor}
      $isBordered={isBordered}
      onClick={() => onClick?.()}
      disabled={disabled}
    >
      <Text $color={color}>{children}</Text>
    </Container>
  );
}

const Container = styled.button<{
  $backgroundColor: string;
  $isBordered: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;
  width: max-content;
  height: 50px;

  padding: 0 25px 0 25px;

  scale: 1;
  cursor: pointer;
  transition: scale 150ms ease-in-out;

  outline: 0;
  border: 0;

  ${({ $isBordered, $backgroundColor }) =>
    $isBordered
      ? css`
          border: 2px solid ${$backgroundColor};
          box-sizing: border-box;
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
          background-color: ${colors.white}00;
        `
      : css`
          background-color: ${$backgroundColor};
        `}

  &:hover {
    scale: 1.04;
  }
`;

const Text = styled.p<{
  $color: string;
}>`
  display: inline-block;
  color: ${({ $color }) => $color};

  font-weight: 600;
`;
