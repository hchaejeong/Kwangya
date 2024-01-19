import { Dispatcher } from "@colyseus/command";
import { Room } from "colyseus";

export class N1Building extends Room<N1Building> {
    private dispatcher = new Dispatcher(this)
}