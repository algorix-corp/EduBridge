import styled, { css } from 'styled-components';
import { colors } from '../../colors';
import linePNG from '../../assets/line.png';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function Section1() {
  const [scroll, setScroll] = useState<number>(0);

  useEffect(() => {
    console.log((scroll - 500) / 500);
  }, [scroll]);

  const scrollHandler = () => {
    setScroll(window.scrollY);
  };

  useEffect(() => {
    addEventListener('scroll', scrollHandler);

    return () => {
      removeEventListener('scroll', scrollHandler, true);
    };
  }, []);

  return (
    <Container>
      <Title>❛ 대충 사람들의 궁금점을 의문문으로 여기다가 적으세요? ❜</Title>
      <Video
        src={
          'https://ja23-edubridge.s3.ap-northeast-2.amazonaws.com/landing.mp4'
        }
        autoPlay
        $scroll={scroll}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 200vh;
  background-color: ${colors.blue};

  background-image: url('${linePNG}');
  background-attachment: fixed;
  background-position: center;
`;

const Title = styled.p`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  color: ${colors.white};
  font-weight: 900;
  font-size: 50px;
  text-align: center;

  white-space: pre;
`;

const Video = styled.video<{
  $scroll: number;
}>`
  position: fixed;

  height: 100vh;

  ${({ $scroll }) =>
    $scroll < 500
      ? css`
          display: none;
        `
      : css`
          scale: ${Math.max(1, 1.5 - (0.5 * ($scroll - 500)) / 500)};
          opacity: ${Math.min(1, ($scroll - 500) / 500)};
        `}
`;
