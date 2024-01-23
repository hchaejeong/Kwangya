"use client";

import React, { useState } from "react";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import styled from "styled-components";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { CustomRoomTable } from "./custom_room_table";
import { CreateRoomForm } from "./create_room_component";
import { useRoomStore } from "../_stores/use-room";
import phaserGame from "../PhaserGame";
import Bootstrap from "../_scenes/Bootstrap";
import { useAppSelector } from "../hooks";
import LoginDialog from "./login_component";
import { Chat } from "./chat";
import { VideoConnectModal } from "./video-connect-modal";

const Backdrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
`;

const Wrapper = styled.div`
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`;

const CustomRoomWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;

  .tip {
    font-size: 18px;
  }
`;

const TitleWrapper = styled.div`
  display: grid;
  width: 100%;

  .back-button {
    grid-column: 1;
    grid-row: 1;
    justify-self: start;
    align-self: center;
  }

  h1 {
    grid-column: 1;
    grid-row: 1;
    justify-self: center;
    align-self: center;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  color: #eee;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 8px;
    height: 120px;
  }
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: #33ac96;
  }
`;

const ProgressBar = styled(LinearProgress)`
  width: 360px;
`;

export default function MainEnterRoomPage() {
  const [showCustomRoom, setShowCustomRoom] = useState(false);
  const [showCreateRoomForm, setShowCreateRoomForm] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [loginPage, setLoginPage] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);

  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined);
  const videoConnected = useAppSelector((state) => state.user.videoConnected);

  if (loginPage && !loggedIn) {
    return <LoginDialog />;
  } else if (loggedIn) {
    return (
      <>
        <Chat />
        {!videoConnected && <VideoConnectModal />}
      </>
    );
  } else {
    return (
      <>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={() => {
            setShowSnackbar(false);
          }}
        >
          <Alert
            severity="error"
            variant="outlined"
            // overwrites the dark theme on render
            style={{ background: "#fdeded", color: "#7d4747" }}
          >
            Trying to connect to server, please try again!
          </Alert>
        </Snackbar>
        <Backdrop>
          <Wrapper>
            {showCreateRoomForm ? (
              <CustomRoomWrapper>
                <TitleWrapper>
                  <IconButton
                    className="back-button"
                    onClick={() => setShowCreateRoomForm(false)}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Title>Create Custom Room</Title>
                </TitleWrapper>
                <CreateRoomForm setLoginPage={setLoginPage} />
              </CustomRoomWrapper>
            ) : showCustomRoom ? (
              <CustomRoomWrapper>
                <TitleWrapper>
                  <IconButton
                    className="back-button"
                    onClick={() => setShowCustomRoom(false)}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Title>
                    Custom Rooms
                    <Tooltip
                      title="We update the results in realtime, no refresh needed!"
                      placement="top"
                    >
                      <IconButton>
                        <HelpOutlineIcon className="tip" />
                      </IconButton>
                    </Tooltip>
                  </Title>
                </TitleWrapper>
                <CustomRoomTable />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setShowCreateRoomForm(true)}
                >
                  Create new room
                </Button>
              </CustomRoomWrapper>
            ) : (
              <>
                <Title>Welcome to Madcamp</Title>
                <Content>
                  <img src={logo.src} alt="logo" />
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      lobbyJoined
                        ? setShowCustomRoom(true)
                        : setShowSnackbar(true)
                    }
                  >
                    Create/find custom rooms
                  </Button>
                </Content>
              </>
            )}
          </Wrapper>
          {!lobbyJoined && (
            <ProgressBarWrapper>
              <h3> Connecting to server...</h3>
              <ProgressBar color="secondary" />
            </ProgressBarWrapper>
          )}
        </Backdrop>
      </>
    );
  }
}
