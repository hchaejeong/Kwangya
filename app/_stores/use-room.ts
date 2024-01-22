import { RoomAvailable } from "colyseus.js";
import { create } from "zustand";

interface RoomInterface extends RoomAvailable {
    name: string;
}

const isCustomRoom = (room: RoomInterface) => {
    return room.name === 'custom';
};

interface RoomState {
    lobbyJoined: boolean;
    roomJoined: boolean;
    roomId: string;
    roomName: string;
    roomDescription: string;
    availableRooms: RoomAvailable[];
    setLobbyJoined: (lobbyJoined: boolean) => void;
    setRoomJoined: (roomJoined: boolean) => void;
    setJoinedRoomData: (data: {id: string, name: string, description: string}) => void;
    setAvailableRooms: (rooms: RoomAvailable[]) => void;
    addAvailableRooms: (roomId: string, room: RoomAvailable) => void;
    removeAvailableRooms: (roomId: string) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    lobbyJoined: false,
    roomJoined: false,
    roomId: '',
    roomName: '',
    roomDescription: '',
    availableRooms: new Array<RoomAvailable>(),
    setLobbyJoined: (lobbyJoined: boolean) => 
        set(() => ({ 
            lobbyJoined 
        })),
    setRoomJoined: (roomJoined: boolean) => 
        set(() => ({
            roomJoined
        })),
    setJoinedRoomData: (data: {id: string, name: string, description: string}) => 
        set(() => ({
            roomId: data.id,
            roomName: data.name,
            roomDescription: data.description,
        })),
    setAvailableRooms: (rooms: RoomAvailable[]) => 
        set(() => ({
            availableRooms: rooms.filter((room) => isCustomRoom(room))
        })),
    addAvailableRooms: (roomId: string, room: RoomAvailable) => 
        set((state) => {
            if (!isCustomRoom(room)) return state;

            const roomIndex = state.availableRooms.findIndex((r) => r.roomId === roomId);
            const updatedRooms = [...state.availableRooms];

            if (roomIndex !== -1) {
                updatedRooms[roomIndex] = room;
            } else {
                updatedRooms.push(room);
            }

            return { availableRooms: updatedRooms };
        }),
    removeAvailableRooms: (roomId: string) => 
        set((state) => ({
            availableRooms: state.availableRooms.filter((room) => room.roomId !== roomId),
        })),
}));