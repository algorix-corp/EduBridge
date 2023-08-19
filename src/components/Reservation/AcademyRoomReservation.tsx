import { ProgressHeader } from './ProgressHeader.tsx';
import { useState } from 'react';
import { Button } from '../../global/Button.tsx';

export function AcademyRoomReservation() {
  const [step, setStep] = useState<number>(1);
  return (
    <>
      <ProgressHeader steps={step} />
      <Button onClick={() => setStep(step + 1)}>Next</Button>
      <Button onClick={() => setStep(step - 1)}>Prev</Button>
    </>
  );
}
