import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { RoomManager } from './rooms';
import { Player } from './player';

dotenv.config();

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;
const roomManager = new RoomManager();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    let currentPlayer: Player | undefined;

    socket.on('join', (data: { username?: string }) => {
        // TODO: Verify Token here (skipped for MVP 1st pass)
        // Use provided username or fallback
        const username = data.username || `User-${socket.id.substr(0, 4)}`;
        const roomId = 'default';

        currentPlayer = new Player(socket.id, username, 'wolf', roomId);
        if (roomManager.addPlayer(roomId, currentPlayer)) {
            socket.join(roomId);

            // Send current state to new player
            socket.emit('state', { players: roomManager.getRoomState(roomId) });

            // Broadcast new player to others
            socket.to(roomId).emit('playerJoined', currentPlayer);

            console.log(`${username} joined room ${roomId}`);
        } else {
            socket.emit('error', { message: 'Room full' });
            socket.disconnect();
        }
    });

    socket.on('move', (data: { x: number, y: number }) => {
        if (currentPlayer) {
            roomManager.updatePlayer(currentPlayer.room, currentPlayer.id, data.x, data.y);
            // Optimized: Broadcast move only to others in room
            socket.to(currentPlayer.room).emit('playerMoved', { id: currentPlayer.id, x: data.x, y: data.y });
        }
    });

    socket.on('chat', (message: string) => {
        if (currentPlayer) {
            // Simple sanitization could go here
            io.to(currentPlayer.room).emit('chatMessage', { id: currentPlayer.id, username: currentPlayer.username, message });
        }
    });

    socket.on('disconnect', () => {
        if (currentPlayer) {
            roomManager.removePlayer(currentPlayer.room, currentPlayer.id);
            io.to(currentPlayer.room).emit('playerLeft', { id: currentPlayer.id });
            console.log(`${currentPlayer.username} disconnected`);
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`MMO Server running on port ${PORT}`);
});
