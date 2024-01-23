"use client";

import "./PhaserGame";

import Image from "next/image";
import MainEnterRoomPage from "./_components/main_enter_room_page";
import { Provider } from "react-redux";
import store from "./_stores";
import styled from "styled-components";
import { useEffect, useRef } from "react";
import phaserGame from "./PhaserGame";

const Container = styled.div`
  canvas {
    display: block;
  }
`;

export default function Home() {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameContainerRef.current)
      gameContainerRef.current.appendChild(phaserGame.canvas);
  }, []);

  return (
    <Provider store={store}>
      <Container ref={gameContainerRef} id="phaser-container"></Container>
      <MainEnterRoomPage />
    </Provider>
  );
}
