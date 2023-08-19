import { useParams } from 'react-router-dom';

export function BuildingDetail() {
  const { id } = useParams();
  return (
    <div>
      <h1>Building Detail {id}</h1>
    </div>
  );
}
