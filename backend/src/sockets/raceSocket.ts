import { Server, Socket } from 'socket.io';

interface Player {
  socketId: string;
  userId: string;
  nickname: string;
  carId: string;
  progress: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
  finishTime?: number;
}

interface Room {
  id: string;
  passageText: string;
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  players: Map<string, Player>;
  countdownSeconds: number;
  startTime?: number;
}

const rooms = new Map<string, Room>();

const DEFAULT_PASSAGES = [
  "The quick brown fox jumps over the lazy dog while sports cars thunder down the championship asphalt highway.",
  "Precision typing demands acute muscle memory, rhythmic breathing, and steadfast finger dexterity.",
  "Under the floodlights of the night circuit, neon exhaust trails illuminate the rain-soaked asphalt."
];

export const initRaceSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    socket.on('match.join', ({ userId, nickname, carId, roomId }: { userId: string; nickname: string; carId: string; roomId?: string }) => {
      let targetRoomId = roomId;

      if (!targetRoomId) {
        for (const [rId, room] of rooms.entries()) {
          if (room.status === 'waiting' && room.players.size < 4) {
            targetRoomId = rId;
            break;
          }
        }
        if (!targetRoomId) {
          targetRoomId = `room_${Math.random().toString(36).substring(2, 8)}`;
          const randomPassage = DEFAULT_PASSAGES[Math.floor(Math.random() * DEFAULT_PASSAGES.length)];
          rooms.set(targetRoomId, {
            id: targetRoomId,
            passageText: randomPassage,
            status: 'waiting',
            players: new Map(),
            countdownSeconds: 5
          });
        }
      }

      const room = rooms.get(targetRoomId);
      if (!room) {
        socket.emit('match.error', { message: 'Room not found' });
        return;
      }

      socket.join(targetRoomId);

      const player: Player = {
        socketId: socket.id,
        userId: userId || `guest_${socket.id.substring(0, 5)}`,
        nickname: nickname || 'Racer',
        carId: carId || 'blaze',
        progress: 0,
        wpm: 0,
        accuracy: 100,
        finished: false
      };

      room.players.set(socket.id, player);

      const playerList = Array.from(room.players.values());
      io.to(targetRoomId).emit('room.update', {
        roomId: targetRoomId,
        status: room.status,
        passageText: room.passageText,
        players: playerList
      });

      if (room.players.size >= 2 && room.status === 'waiting') {
        room.status = 'countdown';
        let count = room.countdownSeconds;

        const countdownInterval = setInterval(() => {
          io.to(targetRoomId!).emit('match.countdown', { count });
          count--;

          if (count < 0) {
            clearInterval(countdownInterval);
            room.status = 'racing';
            room.startTime = Date.now();
            io.to(targetRoomId!).emit('match.start', {
              startTime: room.startTime,
              passageText: room.passageText
            });
          }
        }, 1000);
      }
    });

    socket.on('progress.update', ({ roomId, progress, wpm, accuracy }: { roomId: string; progress: number; wpm: number; accuracy: number }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      const player = room.players.get(socket.id);
      if (!player) return;

      player.progress = Math.min(100, Math.max(0, progress));
      player.wpm = wpm;
      player.accuracy = accuracy;

      if (player.progress >= 100 && !player.finished) {
        player.finished = true;
        player.finishTime = Date.now() - (room.startTime || Date.now());
        io.to(roomId).emit('player.finished', {
          socketId: socket.id,
          nickname: player.nickname,
          finishTime: player.finishTime,
          wpm: player.wpm
        });
      }

      io.to(roomId).emit('players.progress', {
        players: Array.from(room.players.values())
      });
    });

    socket.on('disconnect', () => {
      for (const [rId, room] of rooms.entries()) {
        if (room.players.has(socket.id)) {
          room.players.delete(socket.id);
          io.to(rId).emit('players.progress', {
            players: Array.from(room.players.values())
          });
          if (room.players.size === 0) {
            rooms.delete(rId);
          }
          break;
        }
      }
    });
  });
};
