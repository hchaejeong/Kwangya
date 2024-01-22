import { Dispatcher } from "@colyseus/command";
import { Client, ClientArray, Room } from "colyseus";
import { IncomingMessage } from "http";
import { N1Building } from "./schema/RoomState";

export class Office extends Room<N1Building> {
    private dispatcher = new Dispatcher(this)

    onCreate(options: any): void | Promise<any> {
        this.onMessage
    }

    onAuth(client: Client<this["clients"] extends ClientArray<infer U, any> ? U : never, this["clients"] extends ClientArray<infer _, infer U> ? U : never>, options: any, request?: IncomingMessage | undefined) {
        
    }

    onJoin(client: Client<this["clients"] extends ClientArray<infer U, any> ? U : never, this["clients"] extends ClientArray<infer _, infer U> ? U : never>, options?: any, auth?: (this["clients"] extends ClientArray<infer _, infer U> ? U : never) | undefined): void | Promise<any> {
        
    }

    onLeave(client: Client<this["clients"] extends ClientArray<infer U, any> ? U : never, this["clients"] extends ClientArray<infer _, infer U> ? U : never>, consented?: boolean | undefined): void | Promise<any> {
        
    }

    onDispose(): void | Promise<any> {
        
    }
}