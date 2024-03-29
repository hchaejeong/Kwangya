import bcrypt from "bcrypt";
import { Dispatcher } from "@colyseus/command";
import { Client, Room, ServerError } from "colyseus";
import { IncomingMessage } from "http";
import { Computer, N1Building, Player, WhiteBoard } from "./schema/RoomState";
import { IRoomData } from "@/types/Room";
import PlayerEnterCommand from "../actions/user_enter";
import {
  ComputerAddUser,
  ComputerRemoveUser,
} from "../actions/update-computer-user";
import {
  WhiteboardAddUser,
  WhiteboardRemoveUser,
} from "../actions/update-whiteboard-user";
import UpdateChats from "../actions/update-chats";
import { Message } from "../../types/Messages";
import PlayerUpdateNameCommand from "../actions/update_user_name";

export class Office extends Room<N1Building> {
  private dispatcher = new Dispatcher(this);
  private name: string | undefined;
  private description: string | undefined;
  private password: string | null = null;

  //room이 initialize될때 사용되는 method
  async onCreate(options: IRoomData) {
    const { name, description, password, autoDispose } = options;
    //room 정보를 저장해놓기
    this.name = name;
    this.description = description;
    this.autoDispose = autoDispose;

    let passwordBeingUsed = false;
    if (password) {
      //room의 password를 salt를 추가해서 encrypt한걸로 저장하기
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(password, salt);
      console.log("password: ", this.password);
      passwordBeingUsed = true;
    }
    console.log("room password: ", passwordBeingUsed);
    this.setMetadata({ name, description, passwordBeingUsed });
    //initialize empty room state로 새로운 방 생성
    this.setState(new N1Building());

    //기본 방 세팅: 컴퓨터 20대, 화이트보드 2대
    for (let i = 0; i < 20; i++) {
      this.state.computers.set(String(i), new Computer());
    }
    for (let i = 0; i < 3; i++) {
      this.state.whiteboards.set(String(i), new WhiteBoard());
    }

    this.onMessage(
      Message.CONNECT_TO_COMPUTER,
      (client, message: { computerId: string }) => {
        this.dispatcher.dispatch(new ComputerAddUser(), {
          client,
          computerId: message.computerId,
        });
      }
    );

    this.onMessage(
      Message.DISCONNECT_FROM_COMPUTER,
      (client, message: { computerId: string }) => {
        this.dispatcher.dispatch(new ComputerRemoveUser(), {
          client,
          computerId: message.computerId,
        });
      }
    );

    this.onMessage(
      Message.STOP_SCREEN_SHARE,
      (client, message: { computerId: string }) => {
        const computer = this.state.computers.get(message.computerId);

        if (!computer) return;

        //computer에 연결된 user 중 자신을 제외하고 모든 user에게 message 전송
        computer.connectedUsers.forEach((id) => {
          this.clients.forEach((cli) => {
            if (cli.sessionId === id && cli.sessionId !== client.sessionId) {
              cli.send(Message.STOP_SCREEN_SHARE, client.sessionId);
            }
          });
        });
      }
    );

    this.onMessage(
      Message.CONNECT_TO_WHITEBOARD,
      (client, message: { whiteboardId: string }) => {
        this.dispatcher.dispatch(new WhiteboardAddUser(), {
          client,
          whiteboardId: message.whiteboardId,
        });
      }
    );

    this.onMessage(
      Message.DISCONNECT_FROM_WHITEBOARD,
      (client, message: { whiteboardId: string }) => {
        this.dispatcher.dispatch(new WhiteboardRemoveUser(), {
          client,
          whiteboardId: message.whiteboardId,
        });
      }
    );

    this.onMessage(
      Message.DISCONNECT_FROM_COMPUTER,
      (client, message: { whiteboardId: string }) => {
        this.dispatcher.dispatch(new WhiteboardRemoveUser(), {
          client,
          whiteboardId: message.whiteboardId,
        });
      }
    );

    this.onMessage(
      Message.ADD_CHAT_MESSAGE,
      (client, message: { content: string }) => {
        this.dispatcher.dispatch(new UpdateChats(), {
          client,
          content: message.content,
        });
      }
    );

    //플레이어가 위치 또는 애니메이션을 업데이트 받아와야할떄 수행하는 method를 server에서 짠 코드를 사용하도록
    this.onMessage(
      Message.UPDATE_PLAYER,
      (
        client,
        message: { x: number; y: number; name: string; anim: string }
      ) => {
        this.dispatcher.dispatch(new PlayerEnterCommand(), {
          client,
          x: message.x,
          y: message.y,
          anim: message.anim,
        });
      }
    );

    this.onMessage(
      Message.UPDATE_PLAYER_NAME,
      (client, message: { name: string }) => {
        this.dispatcher.dispatch(new PlayerUpdateNameCommand(), {
          client,
          name: message.name,
        });
      }
    );

    //플레이어가 ready하다고 하면 플레이어의 readyToConnect 속성을 true로 세팅해줘야함
    this.onMessage(Message.READY_TO_CONNECT, (client) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.readyToConnect = true;
      }
    });

    //플레이어가 웹캠에서 연결 끊기위해서는 clientID를 넘겨줘서
    this.onMessage(
      Message.DISCONNECT_STREAM,
      (client, message: { clientId: string }) => {
        this.clients.forEach((cli) => {
          if (cli.sessionId === message.clientId) {
            cli.send(Message.DISCONNECT_STREAM, client.sessionId);
          }
        });
      }
    );

    //CONNECT_TO_COMPUTER, DISCONNECT_FROM_COMPUTER, STOP_SCREEN_SHARE, CONNECT_TO_WHITEBOARD, DISCONNECT_FROM_WHITEBOARD, ADD_CHAT_MESSAGE 메세지 기능들 추가

    this.onMessage(Message.VIDEO_CONNECTED, (client) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.videoConnected = true;
      }
    });
  }

  //client가 password를 사용하는 룸에 들어오려고 할때 validate해주는 역할
  async onAuth(
    client: Client,
    options: any,
    request?: IncomingMessage | undefined
  ) {
    //password이 존재할때 encrypt한거랑 지금 client가 룸 조인할때 입력한 password랑 같은건지 비교해서 맞을때 true를 반환하고 아니면 error띄워주기
    if (this.password) {
      const validate = await bcrypt.compare(options.password!, this.password);
      if (!validate) {
        throw new ServerError(403, "Incorrect password");
      } else {
        return true;
      }
    }
    return true;
  }

  //requestJoin이랑 onAuth이 성공한 후에 실행
  //client이 성공적으로 룸에 들어올때
  onJoin(client: Client) {
    this.state.players.set(client.sessionId, new Player());

    //이건 이게 성공적으로 되었다는 용도로 메세지 보내기
    client.send(Message.SEND_ROOM_DATA, {
      id: this.roomId,
      name: this.name,
      description: this.description,
    });
  }

  //client이 룸에서 나갈때 - client가 직접 나가서 disconnect된거면 consented parameter가 true
  onLeave(client: Client, consented: boolean) {
    //플레이어의 sessionId를 지워줘서 룸에 들어가있지 않다는 걸 표시
    this.state.players.delete(client.sessionId);
    //이 플레이어가 연결되어있는 부분들도 다 초기화
    this.state.computers.forEach((computer) => {
      if (computer.connectedUsers.has(client.sessionId)) {
        computer.connectedUsers.delete(client.sessionId);
      }
    });
    this.state.whiteboards.forEach((whiteboard) => {
      if (whiteboard.connectedUsers.has(client.sessionId)) {
        whiteboard.connectedUsers.delete(client.sessionId);
      }
    });
  }

  //방에 더 이상 플레이어들이 존재하지 않는 경우 방 자체를 없애기
  onDispose() {
    //화이트보드와 연결된것들도 다 해제하기
    this.dispatcher.stop();
  }
}
