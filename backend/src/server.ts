import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import { initRaceSocket } from './sockets/raceSocket.js';
import { prisma } from './config/db.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

initRaceSocket(io);

app.use(cors());
app.use(express.json());

app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.json({
    name: 'KeySprint Racing Engine Backend',
    version: '1.0.0',
    endpoints: '/api/v1'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 KeySprint Backend Server running at http://localhost:${PORT}`);
  console.log(`🔌 WebSockets listening on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
