import { ProgressHeader } from './ProgressHeader.tsx';
import { useEffect, useState } from 'react';
import { Button } from '../../global/Button.tsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/api.ts';

interface UserProps {
  password: string;
  id: number;
  role: string;
  created_at: string;
  phone: string;
  email: string;
  name: string;
  image_url: string;
}

const ProfileInit: UserProps = {
  created_at: '',
  email: '',
  id: 0,
  image_url: '',
  password: '',
  role: '',
  name: '',
  phone: '',
};

export function AcademyRoomReservation() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<UserProps>(ProfileInit);
  const [academy, setAcademy] = useState();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      toast.error('You are not signed in.');
      navigate('/auth/signin');
    }
    api
      .post('/auth')
      .then(r => {
        setData(r.data);

        api.get('/academy').then(r => {
          setAcademy(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            r.data.map((data: any) => {
              return {
                contact: data.contact,
                created_at: data.created_at,
                description: data.description,
                id: data.id,
                image_url: data.image_url,
                name: data.name,
                owner_id: data.owner_id,
                subject: data.subject,
              };
            }),
          );
        });
      })
      .catch(() => {
        toast.error('An error occurred while fetching data.');
        navigate('/');
      });
  }, [navigate]);

  return (
    <>
      <ProgressHeader steps={step} />
      <Button onClick={() => setStep(step === 4 ? 4 : step + 1)}>Next</Button>
      <Button onClick={() => setStep(step === 1 ? 1 : step - 1)}>Prev</Button>
    </>
  );
}
