import { Player, PlayerState } from './player';

export class RoomManager {
    private rooms: Map<string, Map<string, Player>> = new Map();

    constructor() {
        this.createRoom('default');
    }

    createRoom(roomId: string) {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Map());
        }
    }

    addPlayer(roomId: string, player: Player) {
        if (!this.rooms.has(roomId)) {
            this.createRoom(roomId);
        }
        const room = this.rooms.get(roomId);
        if (room && room.size < 50) {
            room.set(player.id, player);
            return true;
        }
        return false;
    }

    removePlayer(roomId: string, playerId: string) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.delete(playerId);
            if (room.size === 0 && roomId !== 'default') {
                this.rooms.delete(roomId); // Cleanup empty rooms
            }
        }
    }

    updatePlayer(roomId: string, playerId: string, x: number, y: number) {
        const room = this.rooms.get(roomId);
        const player = room?.get(playerId);
        if (player) {
            player.x = x;
            player.y = y;
        }
    }

    getRoomState(roomId: string): Record<string, PlayerState> {
        const room = this.rooms.get(roomId);
        const state: Record<string, PlayerState> = {};
        if (room) {
            room.forEach((p) => {
                state[p.id] = {
                    id: p.id,
                    x: p.x,
                    y: p.y,
                    username: p.username,
                    avatar: p.avatar,
                    room: p.room
                };
            });
        }
        return state;
    }
}
