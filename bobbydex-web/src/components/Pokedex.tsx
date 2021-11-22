import { useQuery } from 'react-query';

const Pokedex: React.FC<{ accessToken: string }> = ({ accessToken }) => {
  const { data } = useQuery('poke', async () => {
    const response = await fetch('http://localhost:3001/api/poke', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  });
  return <div>{JSON.stringify(data)}</div>;
};

export default Pokedex;
