export interface PlayerState {
    id: string;
    x: number;
    y: number;
    username: string;
    avatar?: string;
    room: string;
}

export class Player {
    public id: string;
    public x: number;
    public y: number;
    public username: string;
    public avatar: string;
    public room: string;

    constructor(id: string, username: string, avatar: string = 'wolf', room: string = 'default') {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
        this.room = room;
        this.x = 400; // Default spawn
        this.y = 300;
    }
}
