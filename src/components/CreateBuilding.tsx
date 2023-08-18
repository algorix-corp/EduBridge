import { useState } from 'react';
import { Alert, Button, FileInput, TextInput } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import api from '../api/api.ts';
import { useNavigate } from 'react-router-dom';

export function CreateBuilding() {
  const [name, setName] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null); // [1
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!name || !address || !image) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      console.log(reader.result);
      setImageDataUrl(reader.result as string);
    };
    api
      .post('/building', {
        name: name,
        address: address,
        image_dataurl: imageDataUrl,
      })
      .then(() => {
        navigate('/building', {
          state: { newBuilding: true },
        });
      })
      .catch(() => setError(true));
  };

  return (
    <div>
      {error ? (
        <Alert icon={<IconAlertCircle size="1rem" />} color="red">
          An error occurred while creating your building.
        </Alert>
      ) : (
        <div></div>
      )}
      <TextInput
        label="Building Name"
        onChange={e => setName(e.currentTarget.value)}
        withAsterisk
      />
      <TextInput
        label="Building Address"
        onChange={e => setAddress(e.currentTarget.value)}
        withAsterisk
      />
      <FileInput
        placeholder="Pick Building Image"
        label="Building Image"
        onChange={setImage}
        withAsterisk
        accept="image/png,image/jpeg"
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
