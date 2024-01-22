import { Store } from "lucide-react";
import Peer from "peerjs";
import { useComputer } from "../_stores/use-computer";
import phaserGame from "../PhaserGame";
import Game from "../_scenes/Game";

export default class ShareScreenManager {
  private myPeer: Peer;
  myStream?: MediaStream;

  constructor(private userId: string) {
    const sanitizedId = this.makeId(userId);

    this.myPeer = new Peer(sanitizedId);

    this.myPeer.on("error", (err) => {
      console.log("ShareScreenWebRTC err.type", err.type);
      console.error("ShareScreenWebRTC", err);
    });

    this.myPeer.on("call", (call) => {
      call.answer();

      call.on("stream", (userVideoStream) => {
        const { addVideoStream } = useComputer((state) => state);
        addVideoStream(call.peer, call, userVideoStream);
      });
    });
  }

  private makeId(id: string) {
    return `${id.replace(/[^0-9a-z]/gi, "G")}-ss`;
  }

  onOpen() {
    if (this.myPeer.disconnected) {
      this.myPeer.reconnect();
    }
  }

  onClose() {
    this.stopScreenShare(false);
    this.myPeer.disconnect();
  }

  startScreenShare() {
    navigator.mediaDevices
      ?.getDisplayMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        //detect whether user clicks "Stop sharing" button
        const track = stream.getVideoTracks()[0];

        if (track) {
          track.onended = () => {
            this.stopScreenShare();
          };
        }

        this.myStream = stream;

        const { computerId, setMyStream } = useComputer((state) => state);

        setMyStream(stream);

        //call all existing users
        const game = phaserGame.scene.keys.game as Game;
        const computerItem = game.computerMap.get(computerId!);

        if (computerItem) {
          for (const userId of computerItem.currentUsers) {
            this.onUserJoined(userId);
          }
        }
      });
  }

  stopScreenShare(shouldDispatch = true) {
    this.myStream?.getTracks().forEach((track) => track.stop());
    this.myStream = undefined;

    const { computerId, setMyStream } = useComputer((state) => state);
    setMyStream(null);

    if (shouldDispatch) {
      //let other users know screen share is stopped
      const game = phaserGame.scene.keys.game as Game;
      game.network.onStopScreenShare(computerId!);
    }
  }

  onUserJoined(userId: string) {
    if (!this.myStream || userId === this.userId) return;

    const sanitizedId = this.makeId(userId);
    this.myPeer.call(sanitizedId, this.myStream);
  }

  onUserLeft(userId: string) {
    if (userId === this.userId) return;

    const { removeVideoStream } = useComputer((state) => state);
    const sanitizedId = this.makeId(userId);

    removeVideoStream(sanitizedId);
  }
}
