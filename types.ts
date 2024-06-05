import { Server, Member, Profile } from "@prisma/client";
import {Server as NetServer, Socket} from "net"
import {Server as SocketIoServer} from "socket.io"
import {NextApiResponse} from "next"

export type ServerWithMembersWithProfile = Server & {
    members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIoServer;
        };
    };
};

/*
delete server
leave server
These are partially implemented 

*/