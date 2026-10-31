import { Server, Socket } from 'socket.io';
import { prisma } from '../config/db.js';

interface Player {
  socketId: string;
  userId: string;
  nickname: string;
  carId: string;
  avatar: string;
  progress: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
  finishTime?: number;
  isBot?: boolean;
}

interface Room {
  id: string;
  passageText: string;
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  players: Map<string, Player>;
  countdownSeconds: number;
  startTime?: number;
  botFillTimeout?: NodeJS.Timeout;
  botInterval?: NodeJS.Timeout;
}

const rooms = new Map<string, Room>();

const BOT_PROFILES = [
  { name: 'Turbo Bot [AI]', carId: 'thunder', avatar: '🤖', baseWpm: 85 },
  { name: 'Apex AI [AI]', carId: 'golden', avatar: '⚡', baseWpm: 110 },
  { name: 'Drift Bot [AI]', carId: 'forest', avatar: '🏎️', baseWpm: 95 }
];

export const initRaceSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {

    socket.on('match.join', async ({ userId, nickname, carId, avatar, roomId }: { userId: string; nickname: string; carId: string; avatar?: string; roomId?: string }) => {
      let targetRoomId = roomId;

      // Public matchmaking: Find waiting room with space
      if (!targetRoomId) {
        for (const [rId, room] of rooms.entries()) {
          if (room.status === 'waiting' && room.players.size < 4) {
            targetRoomId = rId;
            break;
          }
        }

        // Create new room if none available
        if (!targetRoomId) {
          targetRoomId = `room_${Math.random().toString(36).substring(2, 8)}`;
          
          let passageText = "The quick brown fox jumps over the lazy dog while sports cars thunder down the championship asphalt highway at breakneck velocity.";
          try {
            const count = await prisma.passage.count({ where: { status: 'active' } });
            if (count > 0) {
              const skip = Math.floor(Math.random() * count);
              const randomPassage = await prisma.passage.findFirst({ where: { status: 'active' }, skip });
              if (randomPassage) passageText = randomPassage.text;
            }
          } catch {
            // Use fallback
          }

          rooms.set(targetRoomId, {
            id: targetRoomId,
            passageText,
            status: 'waiting',
            players: new Map(),
            countdownSeconds: 4
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
        avatar: avatar || '🏎️',
        progress: 0,
        wpm: 0,
        accuracy: 100,
        finished: false,
        isBot: false
      };

      room.players.set(socket.id, player);

      const sendRoomUpdate = () => {
        io.to(targetRoomId!).emit('room.update', {
          roomId: targetRoomId,
          status: room.status,
          passageText: room.passageText,
          players: Array.from(room.players.values())
        });
      };

      sendRoomUpdate();

      const startCountdown = () => {
        if (room.status !== 'waiting') return;
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
              passageText: room.passageText,
              roomId: targetRoomId
            });

            // If room has bots, simulate bot progress
            startBotSimulation(room, targetRoomId!);
          }
        }, 1000);
      };

      // If room reaches 4 human players, start countdown immediately
      if (room.players.size >= 4 && room.status === 'waiting') {
        if (room.botFillTimeout) clearTimeout(room.botFillTimeout);
        startCountdown();
      } else if (room.status === 'waiting' && !room.botFillTimeout) {
        // Auto-fill bots after 4s timeout if no 2nd player joins
        room.botFillTimeout = setTimeout(() => {
          if (room.status === 'waiting') {
            const neededBots = Math.max(1, 4 - room.players.size);
            for (let i = 0; i < neededBots; i++) {
              const bot = BOT_PROFILES[i % BOT_PROFILES.length];
              const botId = `bot_${bot.name.replace(/\s+/g, '_')}_${i}`;
              room.players.set(botId, {
                socketId: botId,
                userId: botId,
                nickname: bot.name,
                carId: bot.carId,
                avatar: bot.avatar,
                progress: 0,
                wpm: bot.baseWpm,
                accuracy: 98,
                finished: false,
                isBot: true
              });
            }
            sendRoomUpdate();
            startCountdown();
          }
        }, 4000);
      }
    });

    const startBotSimulation = (room: Room, targetRoomId: string) => {
      const bots = Array.from(room.players.values()).filter(p => p.isBot);
      if (bots.length === 0) return;

      room.botInterval = setInterval(() => {
        if (room.status !== 'racing') {
          if (room.botInterval) clearInterval(room.botInterval);
          return;
        }

        let allFinished = true;
        for (const player of room.players.values()) {
          if (player.isBot && !player.finished) {
            const step = (player.wpm / 60) * 0.45;
            player.progress = Math.min(100, player.progress + step);
            if (player.progress >= 100) {
              player.finished = true;
              player.finishTime = Date.now() - (room.startTime || Date.now());
            }
          }
          if (!player.finished) allFinished = false;
        }

        io.to(targetRoomId).emit('players.progress', {
          players: Array.from(room.players.values())
        });

        if (allFinished) {
          room.status = 'finished';
          if (room.botInterval) clearInterval(room.botInterval);
        }
      }, 1000);
    };

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

        // Determine current placement among finished players
        const finishedCount = Array.from(room.players.values()).filter(p => p.finished).length;

        io.to(roomId).emit('player.finished', {
          socketId: socket.id,
          userId: player.userId,
          nickname: player.nickname,
          finishTime: player.finishTime,
          wpm: player.wpm,
          accuracy: player.accuracy,
          place: finishedCount
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
            if (room.botFillTimeout) clearTimeout(room.botFillTimeout);
            if (room.botInterval) clearInterval(room.botInterval);
            rooms.delete(rId);
          }
          break;
        }
      }
    });
  });
};
