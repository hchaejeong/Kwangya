"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import Game from "../_scenes/Game";
import phaserGame from "../PhaserGame";

export const VideoConnectModal = () => {
  const [warning, setWarning] = useState(true);

  const connectWebcam = () => {
    const game = phaserGame.scene.keys.game as Game;
    game.network.webRTC?.getUserMedia();
  };

  return (
    <div>
      {warning && (
        <div className="fixed left-6 top-6 w-[300px] h-[120px] bg-background rounded-lg rounded-b-none opacity-80 ">
          <AlertCircle className="absolute w-8 h-8 top-4 left-3 stroke-orange-200" />
          <div className="relative flex flex-col flex-1 pt-4 h-full ml-14">
            <button
              onClick={() => {
                setWarning(false);
              }}
              className="absolute flex w-8 h-8 justify-center items-center top-2 right-2 rounded-full hover:bg-black"
            >
              <X className="w-6 h-6" />
            </button>
            <div>
              <p className="text-white text-lg mb-2">Warning!</p>
              <p className="text-white text-sm">No webcam connected</p>
              <p className="text-white text-sm">Please connect your webcam!</p>
            </div>
          </div>
          <Button
            onClick={connectWebcam}
            className="w-full rounded-t-none h-10 bg-slate-800 hover:bg-slate-900"
          >
            <p className="text-white text-lg">Connect webcam</p>
          </Button>
        </div>
      )}
    </div>
  );
};
