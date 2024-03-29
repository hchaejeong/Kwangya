"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import "./PhaserGame";

import { ThemeProvider } from "@/components/theme-provider";
import styled from "styled-components";
import { useEffect } from "react";
import Game from "./_scenes/Game";
import phaserGame from "./PhaserGame";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

const Container = styled.div`
  canvas {
    display: block;
  }
`;

const VideoGrid = styled.div`
  position: absolute;
  top: 35px;
  right: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-gap: 5px;
  grid-auto-rows: 160px;
`;

const VideoElement = styled.div`
  .video-grid {
    position: absolute;
    top: 35px;
    right: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 160px);
    grid-gap: 5px;
    grid-auto-rows: 160px;
  }

  .video-grid video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
    border: 1px groove rgb(229, 251, 255);
  }
`;

const ButtonContainer = styled.div`
  width: 160px;
  display: flex;
  justify-content: space-evenly;
  position: absolute;
  top: 5px;
  right: 10px;
`;

const Button = styled.div`
  background-color: #ffffff;
  color: #000000;
  margin-horizontal: 10px;
  border-width: 1px;
  border-color: #000000;
  .button-grid {
    width: 160px;
    display: flex;
    justify-content: space-evenly;
    position: absolute;
    top: 5px;
    right: 10px;
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useEffect(() => {
  //   const videoGrid = document.getElementById("video-grid");
  //   const video = document.createElement("video");
  //   videoGrid?.append(video);
  // }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          storageKey="n1-theme"
        >
          <Container id="phaser-container">{children}</Container>
          <VideoGrid>
            <VideoElement className="video-grid" />
          </VideoGrid>
          <ButtonContainer>
            <Button className="button-grid" />
          </ButtonContainer>
        </ThemeProvider>
      </body>
    </html>
  );
}
