"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import Adam from "@/public/images/login/Adam_login.png";
import Ash from "@/public/images/login/Ash_login.png";
import Lucy from "@/public/images/login/Lucy_login.png";
import Nancy from "@/public/images/login/Nancy_login.png";
import { getAvatarString, getColorByString } from "./util";

import phaserGame from "../PhaserGame";
import Game1 from "../_scenes/Game";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setLoggedIn } from "../_stores/UserStore";

const Wrapper = styled.form`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`;

const Title = styled.p`
  margin: 5px;
  font-size: 20px;
  color: #c2c2c2;
  text-align: center;
`;

const RoomName = styled.div`
  max-width: 500px;
  max-height: 120px;
  overflow-wrap: anywhere;
  overflow-y: auto;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;

  h3 {
    font-size: 24px;
    color: #eee;
  }
`;

const RoomDescription = styled.div`
  max-width: 500px;
  max-height: 150px;
  overflow-wrap: anywhere;
  overflow-y: auto;
  font-size: 16px;
  color: #c2c2c2;
  display: flex;
  justify-content: center;
`;

const SubTitle = styled.h3`
  width: 160px;
  font-size: 16px;
  color: #eee;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  margin: 36px 0;
`;

const Left = styled.div`
  margin-right: 48px;

  --swiper-navigation-size: 24px;

  .swiper {
    width: 160px;
    height: 220px;
    border-radius: 8px;
    overflow: hidden;
  }

  .swiper-slide {
    width: 160px;
    height: 220px;
    background: #dbdbe0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-slide img {
    display: block;
    width: 95px;
    height: 136px;
    object-fit: contain;
  }
`;

const Right = styled.div`
  width: 300px;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Warning = styled.div`
  margin-top: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const avatars = [
  { name: "adam", img: Adam },
  { name: "ash", img: Ash },
  { name: "lucy", img: Lucy },
  { name: "nancy", img: Nancy },
];

// shuffle the avatars array
for (let i = avatars.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [avatars[i], avatars[j]] = [avatars[j], avatars[i]];
}

interface LoginDialogProps {
  setJoinedRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginDialog() {
  const [name, setName] = useState<string>("");
  const [avatarIndex, setAvatarIndex] = useState<number>(0);
  const [nameFieldEmpty, setNameFieldEmpty] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const videoConnected = useAppSelector((state) => state.user.videoConnected);
  const roomJoined = useAppSelector((state) => state.room.roomJoined);
  const roomName = useAppSelector((state) => state.room.roomName);
  const roomDescription = useAppSelector((state) => state.room.roomDescription);
  const game = phaserGame.scene.keys.game as Game1;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name === "") {
      setNameFieldEmpty(true);
    } else if (roomJoined) {
      console.log("Join! Name:", name, "Avatar:", avatars[avatarIndex].name);
      game.registerKeys();
      game.myPlayer.setPlayerName(name);
      game.myPlayer.setPlayerTexture(avatars[avatarIndex].name);
      game.network.readyToConnect();

      dispatch(setLoggedIn(true));
    }
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
      <Title>Joining</Title>
      <RoomName>
        <Avatar style={{ background: getColorByString(roomName) }}>
          {getAvatarString(roomName)}
        </Avatar>
        <h3>{roomName}</h3>
      </RoomName>
      <RoomDescription>
        <ArrowRightIcon /> {roomDescription}
      </RoomDescription>
      <Content>
        <Left>
          <SubTitle>Select an avatar</SubTitle>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={0}
            slidesPerView={1}
            style={{ background: "lightblue" }}
            onSlideChange={(swiper) => {
              setAvatarIndex(swiper.activeIndex);
            }}
          >
            {avatars.map((avatar) => (
              <SwiperSlide key={avatar.name}>
                <img src={avatar.img.src} alt={avatar.name} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Left>
        <Right>
          <TextField
            autoFocus
            fullWidth
            label="Name"
            variant="outlined"
            error={nameFieldEmpty}
            helperText={nameFieldEmpty && "Name is required"}
            onInput={(e) => {
              setName((e.target as HTMLInputElement).value);
            }}
            InputProps={{ style: { color: "white" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "lightblue",
                },
                "&:hover fieldset": {
                  borderColor: "lightblue",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "lightblue",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",
              },
            }}
          />
          {!videoConnected && (
            <Warning>
              <Alert
                variant="outlined"
                severity="warning"
                sx={{ color: "#bd6d4b" }}
              >
                <AlertTitle sx={{ color: "#db7a51" }}>Warning</AlertTitle>
                No webcam/mic connected -{" "}
                <strong>connect one for best experience!</strong>
              </Alert>
              <Button
                variant="outlined"
                style={{ color: "white", borderColor: "lightblue" }}
                onClick={() => {
                  game.network.webRTC?.getUserMedia();
                }}
              >
                Connect Webcam
              </Button>
            </Warning>
          )}

          {videoConnected && (
            <Warning>
              <Alert variant="outlined">Webcam connected!</Alert>
            </Warning>
          )}
        </Right>
      </Content>
      <Bottom>
        <Button
          variant="contained"
          style={{ color: "white", backgroundColor: "#528c9e" }}
          size="large"
          type="submit"
        >
          Join
        </Button>
      </Bottom>
    </Wrapper>
  );
}
