import { config } from 'dotenv';
config({
  path: process.env.NODE_ENV !== 'production' ? '.env.local' : '.env',
});
import express from 'express';
import cors from 'cors';
import { MainClient } from 'pokenode-ts';
import { authMiddleware } from './middleware/authMiddleware';
import { wrapAsync } from './utils';

const app = express();

const api = new MainClient({
  logOptions: {
    level: 'info',
  },
});

if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

app.use(express.json());
app.use(authMiddleware);

app.get(
  '/api/poke',
  wrapAsync(async (req, res) => {
    const p = await api.pokemon.listPokemons(0, 100);
    return res.send(p.results);
  })
);

app.listen(3001, () => {
  console.info(`🚀 server running on port ${process.env.PORT}`);
});
