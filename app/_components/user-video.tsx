import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import phaserGame from "../PhaserGame";
import Game from "../_scenes/Game";

export const UserVideo = () => {
  const game = phaserGame.scene.keys.game as Game;
  const videoRef = useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     if(videoRef.current) {

  //         videoRef.current.
  //     }
  //   },[])

  return (
    <>
      <div className="grid grid-cols-auto-fill gap-1 grid-rows-[160px] absolute top-8 right-2 max-h-[calc(100%-100px)] overflow-y-auto">
        <video
          //   ref={videoRef}
          id="video-grid"
          className="w-full h-full object-cover rounded-sm border-sky-100 border border-1"
        />
      </div>
      <div className="w-[160px] flex justify-evenly top-1 right-2 absolute">
        <Button className="h-6" size="sm"></Button>
        <Button className="h-6" size="sm">
          Video Off
        </Button>
      </div>
    </>
  );
};
