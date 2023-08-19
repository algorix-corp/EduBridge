import styled, { css } from 'styled-components';
import { ReactComponent as LogoSVG } from '../../assets/logo.svg';
import { colors } from '../../colors';
import linePNG from '../../assets/line.png';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { scrollYState } from '../../states';

export function Section1() {
  const [scroll, setScroll] = useRecoilState(scrollYState);
  const [transform, setTransform] = useState<number>(0);

  const scrollHandler = () => {
    setScroll(window.scrollY);
  };

  useEffect(() => {
    addEventListener('scroll', scrollHandler);

    return () => {
      removeEventListener('scroll', scrollHandler, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const video = document.querySelector('video');

    if (scroll > 1000 && !video?.classList.contains('playing')) {
      video?.classList.add('playing');
      // video!.playbackRate = 2.0;
      video?.play();
    }
  }, [scroll]);

  return (
    <Container>
      <Title $scroll={scroll} $startPoint={-500} $endPoint={2500}>
        ❛ 대충 사람들의 궁금점을 의문문으로 여기다가 적으세요? ❜
      </Title>
      <Video
        className="video"
        src={
          'https://ja23-edubridge.s3.ap-northeast-2.amazonaws.com/landing.mp4'
        }
        loop
        muted
        onTimeUpdate={() => {
          const video = document.querySelector('video');
          setTransform(video!.currentTime / video!.duration);
        }}
        $scroll={scroll}
        $transform={transform}
      />
      <Title $scroll={scroll} $startPoint={2500} $endPoint={7000}>
        <Logo /> is a All-in-One solution{'\n'}for small-sized academies.
      </Title>
      <Title $scroll={scroll} $startPoint={7500} $endPoint={12000}>
        Everything necessary for academy{'\n'}is in this platform, even for the
        real estate.
      </Title>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: calc(100vh + 10000px);
  background-color: ${colors.blue};

  background-image: url('${linePNG}');
  background-attachment: fixed;
  background-position: center;
`;

const Title = styled.p<{
  $scroll: number;
  $startPoint: number;
  $endPoint: number;
}>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  color: ${colors.white};
  font-weight: 700;
  font-size: 45px;
  text-align: center;
  line-height: 135%;

  white-space: pre;

  ${({ $scroll, $startPoint, $endPoint }) =>
    $scroll < $startPoint
      ? css`
          display: none;
        `
      : $scroll >= $endPoint
      ? css`
          opacity: ${Math.max(0, 1 - ($scroll - $endPoint) / 500)};
        `
      : css`
          opacity: ${Math.min(1, ($scroll - $startPoint) / 500)};
        `}
`;

const Video = styled.video<{
  $scroll: number;
  $transform: number;
}>`
  position: fixed;

  height: 100vh;

  ${({ $scroll, $transform }) =>
    $scroll < 500
      ? css`
          display: none;
        `
      : css`
          scale: ${Math.max(1.1, 1.5 - (0.5 * ($scroll - 1000)) / 1500)};
          opacity: ${Math.min(1, ($scroll - 1000) / 1500)};
          transform: rotateZ(${$transform * 0.1}deg);
        `}
`;

const Logo = styled(LogoSVG)`
  position: relative;

  width: 350.61px;
  height: 45px;

  top: 4px;
  right: 5px;
`;
