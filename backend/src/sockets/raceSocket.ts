import { Server, Socket } from 'socket.io';
import { prisma } from '../config/db.js';

export interface Player {
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
  isHost?: boolean;
  isReady?: boolean;
}

export interface Room {
  id: string;
  code?: string;
  name?: string;
  isPrivate?: boolean;
  hostSocketId?: string;
  maxPlayers: number;
  trackId: string;
  fillWithBots: boolean;
  passageText: string;
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  players: Map<string, Player>;
  countdownSeconds: number;
  startTime?: number;
  botFillTimeout?: NodeJS.Timeout;
  botInterval?: NodeJS.Timeout;
}

const rooms = new Map<string, Room>();
let ioInstance: Server | null = null;
export const onlineUsers = new Map<string, string>(); // userId -> socketId

export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId);
};

export const sendSocketNotification = (userId: string, event: string, payload: any): boolean => {
  const socketId = onlineUsers.get(userId);
  if (socketId && ioInstance) {
    ioInstance.to(socketId).emit(event, payload);
    return true;
  }
  return false;
};

const BOT_PROFILES = [
  { name: 'Turbo Bot [AI]', carId: 'thunder', avatar: '🤖', baseWpm: 85 },
  { name: 'Apex AI [AI]', carId: 'golden', avatar: '⚡', baseWpm: 110 },
  { name: 'Drift Bot [AI]', carId: 'forest', avatar: '🏎️', baseWpm: 95 },
  { name: 'Nitro Nova [AI]', carId: 'retro', avatar: '🚀', baseWpm: 102 }
];

export const getRoomByCode = (code: string) => {
  const clean = code.trim().toUpperCase();
  for (const room of rooms.values()) {
    if (room.isPrivate && (room.code?.toUpperCase() === clean || room.id.toUpperCase() === clean)) {
      return {
        id: room.id,
        code: room.code,
        name: room.name,
        status: room.status,
        trackId: room.trackId,
        playersCount: room.players.size,
        maxPlayers: room.maxPlayers
      };
    }
  }
  return null;
};

const getRoomPayload = (room: Room) => ({
  roomId: room.id,
  code: room.code,
  name: room.name || 'KeySprint Race Room',
  isPrivate: !!room.isPrivate,
  hostSocketId: room.hostSocketId,
  maxPlayers: room.maxPlayers,
  trackId: room.trackId,
  fillWithBots: room.fillWithBots,
  status: room.status,
  passageText: room.passageText,
  players: Array.from(room.players.values())
});

export const initRaceSocket = (io: Server) => {
  ioInstance = io;

  const sendRoomUpdate = (room: Room) => {
    io.to(room.id).emit('room.update', getRoomPayload(room));
  };

  const startBotSimulation = (room: Room, targetRoomId: string) => {
    const bots = Array.from(room.players.values()).filter(p => p.isBot);
    if (bots.length === 0) return;

    if (room.botInterval) clearInterval(room.botInterval);

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
        sendRoomUpdate(room);
      }
    }, 1000);
  };

  const executeCountdownAndStart = (room: Room) => {
    if (room.status !== 'waiting') return;
    room.status = 'countdown';
    let count = room.countdownSeconds || 3;
    sendRoomUpdate(room);

    const countdownInterval = setInterval(() => {
      io.to(room.id).emit('match.countdown', { count });
      count--;

      if (count < 0) {
        clearInterval(countdownInterval);
        room.status = 'racing';
        room.startTime = Date.now();
        io.to(room.id).emit('match.start', {
          startTime: room.startTime,
          passageText: room.passageText,
          roomId: room.id,
          trackId: room.trackId
        });
        sendRoomUpdate(room);

        // Simulate bots if any exist
        startBotSimulation(room, room.id);
      }
    }, 1000);
  };

  const handlePlayerLeave = (socket: Socket, targetRoomId?: string) => {
    for (const [rId, room] of rooms.entries()) {
      if (targetRoomId && rId !== targetRoomId) continue;
      if (room.players.has(socket.id)) {
        const leavingPlayer = room.players.get(socket.id);
        room.players.delete(socket.id);
        socket.leave(rId);

        const remainingHumans = Array.from(room.players.values()).filter(p => !p.isBot);

        if (remainingHumans.length === 0) {
          if (room.botFillTimeout) clearTimeout(room.botFillTimeout);
          if (room.botInterval) clearInterval(room.botInterval);
          rooms.delete(rId);
        } else {
          // If the host left in a private room, elect the next human player as host
          if (room.isPrivate && leavingPlayer?.isHost && remainingHumans.length > 0) {
            const nextHost = remainingHumans[0];
            nextHost.isHost = true;
            nextHost.isReady = true;
            room.hostSocketId = nextHost.socketId;
          }

          sendRoomUpdate(room);
          io.to(rId).emit('players.progress', {
            players: Array.from(room.players.values())
          });
        }
        break;
      }
    }
  };

  io.on('connection', (socket: Socket) => {

    socket.on('user.register', ({ userId }: { userId: string }) => {
      if (userId) onlineUsers.set(userId, socket.id);
    });

    // 1. PUBLIC MATCHMAKING JOIN
    socket.on('match.join', async ({ userId, nickname, carId, avatar, roomId }: { userId: string; nickname: string; carId: string; avatar?: string; roomId?: string }) => {
      let targetRoomId = roomId;

      // Public matchmaking: Find waiting public room with space
      if (!targetRoomId) {
        for (const [rId, room] of rooms.entries()) {
          if (!room.isPrivate && room.status === 'waiting' && room.players.size < 4) {
            targetRoomId = rId;
            break;
          }
        }

        // Create new public room if none available
        if (!targetRoomId) {
          targetRoomId = `room_pub_${Math.random().toString(36).substring(2, 8)}`;
          
          let passageText = "The quick brown fox jumps over the lazy dog while sports cars thunder down the championship asphalt highway at breakneck velocity.";
          try {
            const count = await prisma.passage.count({ where: { status: 'active' } });
            if (count > 0) {
              const skip = Math.floor(Math.random() * count);
              const randomPassage = await prisma.passage.findFirst({ where: { status: 'active' }, skip });
              if (randomPassage) passageText = randomPassage.text;
            }
          } catch {
            // fallback
          }

          rooms.set(targetRoomId, {
            id: targetRoomId,
            passageText,
            isPrivate: false,
            maxPlayers: 4,
            trackId: 'green-valley',
            fillWithBots: true,
            status: 'waiting',
            players: new Map(),
            countdownSeconds: 3
          });
        }
      }

      const room = rooms.get(targetRoomId);
      if (!room) {
        socket.emit('match.error', { message: 'Public room not found' });
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
        isBot: false,
        isReady: true
      };

      room.players.set(socket.id, player);
      sendRoomUpdate(room);

      // If public room reaches 4 human players, start countdown immediately
      if (room.players.size >= 4 && room.status === 'waiting') {
        if (room.botFillTimeout) clearTimeout(room.botFillTimeout);
        executeCountdownAndStart(room);
      } else if (room.status === 'waiting' && !room.botFillTimeout) {
        // Auto-fill bots after 4s timeout if public room hasn't filled
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
                isBot: true,
                isReady: true
              });
            }
            sendRoomUpdate(room);
            executeCountdownAndStart(room);
          }
        }, 4000);
      }
    });

    // 2. CREATE PRIVATE ROOM (Host)
    socket.on('room.create_private', async ({
      userId,
      nickname,
      carId,
      avatar,
      roomName,
      roomCode,
      maxPlayers = 4,
      trackId = 'green-valley',
      fillWithBots = true
    }: {
      userId: string;
      nickname: string;
      carId: string;
      avatar?: string;
      roomName?: string;
      roomCode: string;
      maxPlayers?: number;
      trackId?: string;
      fillWithBots?: boolean;
    }) => {
      const cleanCode = (roomCode || `SPRINT-${Math.floor(10 + Math.random() * 90)}`).trim().toUpperCase();
      const roomId = `room_priv_${cleanCode}`;

      // Clean up previous room with same id if any
      const existing = rooms.get(roomId);
      if (existing) {
        if (existing.botFillTimeout) clearTimeout(existing.botFillTimeout);
        if (existing.botInterval) clearInterval(existing.botInterval);
        rooms.delete(roomId);
      }

      let passageText = "The quick brown fox jumps over the lazy dog while sports cars thunder down the championship asphalt highway at breakneck velocity.";
      try {
        const count = await prisma.passage.count({ where: { status: 'active' } });
        if (count > 0) {
          const skip = Math.floor(Math.random() * count);
          const randomPassage = await prisma.passage.findFirst({ where: { status: 'active' }, skip });
          if (randomPassage) passageText = randomPassage.text;
        }
      } catch (err) {
        console.error('Error fetching passage for private room:', err);
      }

      const room: Room = {
        id: roomId,
        code: cleanCode,
        name: roomName || `${nickname || 'Racer'}'s Fast Lane`,
        isPrivate: true,
        hostSocketId: socket.id,
        maxPlayers: Math.max(2, Math.min(6, maxPlayers)),
        trackId,
        fillWithBots,
        passageText,
        status: 'waiting',
        players: new Map(),
        countdownSeconds: 3
      };

      const hostPlayer: Player = {
        socketId: socket.id,
        userId: userId || `host_${socket.id.substring(0, 5)}`,
        nickname: nickname || 'Host Racer',
        carId: carId || 'blaze',
        avatar: avatar || '🏎️',
        progress: 0,
        wpm: 0,
        accuracy: 100,
        finished: false,
        isBot: false,
        isHost: true,
        isReady: true
      };

      room.players.set(socket.id, hostPlayer);
      rooms.set(roomId, room);

      socket.join(roomId);
      socket.emit('room.joined', { success: true, room: getRoomPayload(room) });
      sendRoomUpdate(room);
    });

    // 3. JOIN PRIVATE ROOM BY CODE
    socket.on('room.join_private', ({
      roomCode,
      userId,
      nickname,
      carId,
      avatar
    }: {
      roomCode: string;
      userId: string;
      nickname: string;
      carId: string;
      avatar?: string;
    }) => {
      const cleanCode = (roomCode || '').trim().toUpperCase();
      const room = Array.from(rooms.values()).find(
        r => r.isPrivate && (r.code?.toUpperCase() === cleanCode || r.id.toUpperCase() === cleanCode)
      );

      if (!room) {
        socket.emit('room.error', { message: `Room "${cleanCode}" was not found or has expired.` });
        return;
      }

      if (room.status !== 'waiting') {
        socket.emit('room.error', { message: 'Race is already in progress in this room.' });
        return;
      }

      if (room.players.size >= room.maxPlayers) {
        socket.emit('room.error', { message: `Lobby is full (${room.players.size}/${room.maxPlayers} racers).` });
        return;
      }

      socket.join(room.id);

      const player: Player = {
        socketId: socket.id,
        userId: userId || `guest_${socket.id.substring(0, 5)}`,
        nickname: nickname || 'Challenger',
        carId: carId || 'blaze',
        avatar: avatar || '🏎️',
        progress: 0,
        wpm: 0,
        accuracy: 100,
        finished: false,
        isBot: false,
        isHost: false,
        isReady: false
      };

      room.players.set(socket.id, player);

      socket.emit('room.joined', { success: true, room: getRoomPayload(room) });
      sendRoomUpdate(room);
    });

    // 4. TOGGLE READY (Non-host participant)
    socket.on('room.toggle_ready', ({ roomId }: { roomId: string }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      const player = room.players.get(socket.id);
      if (player && !player.isHost) {
        player.isReady = !player.isReady;
        sendRoomUpdate(room);
      }
    });

    // 5. HOST STARTS RACE
    socket.on('room.host_start', ({ roomId }: { roomId: string }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      if (room.hostSocketId !== socket.id) {
        socket.emit('room.error', { message: 'Only the lobby host can start the race.' });
        return;
      }

      if (room.status !== 'waiting') return;

      // If fillWithBots is enabled, fill open spots with AI bots
      if (room.fillWithBots && room.players.size < room.maxPlayers) {
        const neededBots = room.maxPlayers - room.players.size;
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
            isBot: true,
            isReady: true
          });
        }
      }

      executeCountdownAndStart(room);
    });

    // 6. LEAVE ROOM
    socket.on('room.leave', ({ roomId }: { roomId?: string }) => {
      handlePlayerLeave(socket, roomId);
    });

    // 7. REAL-TIME PROGRESS UPDATE
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

        // Placement among finished players
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

    // 8. DISCONNECT
    socket.on('disconnect', () => {
      for (const [uId, sId] of onlineUsers.entries()) {
        if (sId === socket.id) {
          onlineUsers.delete(uId);
          break;
        }
      }
      handlePlayerLeave(socket);
    });
  });
};
