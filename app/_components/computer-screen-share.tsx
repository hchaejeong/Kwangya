import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { closeComputerDialog } from "../_stores/ComputerStore";
import Video from "./video";

export const ComputerScreenShare = () => {
  const playerNameMap = useAppSelector((state) => state.user.playerNameMap);
  const shareScreenManager = useAppSelector(
    (state) => state.computer.shareScreenManager
  );
  const myStream = useAppSelector((state) => state.computer.myStream);
  const peerStreams = useAppSelector((state) => state.computer.peerStreams);
  const dispatch = useAppDispatch();

  const handleVideo = () => {
    if (shareScreenManager?.myStream) {
      shareScreenManager?.stopScreenShare();
    } else {
      shareScreenManager?.startScreenShare();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden py-2 px-20">
      <div className="relative w-full h-full bg-[#222639] p-4 color-[#eee] flex flex-col rounded-xl">
        <div className="flex h-12">
          <button
            className="h-8 w-auto bg-slate-500 px-3 rounded-md"
            onClick={handleVideo}
          >
            <p className="text-white">
              {shareScreenManager?.myStream ? "Stop sharing" : "Share screen"}
            </p>
          </button>
          <button
            className="absolute top-2 right-2 w-8 h-8 items-center justify-center"
            onClick={() => dispatch(closeComputerDialog())}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 grid-cols-auto-fit gap-2">
          {myStream && <VideoContainer stream={myStream} playerName="You" />}
          {[...peerStreams.entries()].map(([id, { stream }]) => {
            const playerName = playerNameMap.get(id);
            return (
              <VideoContainer
                key={id}
                playerName={playerName}
                stream={stream}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const VideoContainer = ({
  playerName,
  stream,
}: {
  playerName: string | undefined;
  stream: MediaStream;
}) => {
  return (
    <div className="relative bg-black rounded-md overflow-hidden">
      <Video srcObject={stream} autoPlay />
      {playerName && (
        <div className="absolute bottom-4 left-4 text-white overflow-hidden whitespace-nowrap">
          {playerName}
        </div>
      )}
    </div>
  );
};
