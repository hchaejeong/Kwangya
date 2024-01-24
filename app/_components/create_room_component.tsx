"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import phaserGame from "../PhaserGame";
import { IRoomData } from "@/types/Room";
import Bootstrap from "../_scenes/Bootstrap";
//import { useHistory } from "react-router-dom";
import { useAppSelector } from "../hooks";

const CreateRoomFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 320px;
  gap: 20px;
`;

interface CreateRoomProps {
  setLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateRoomForm = ({ setLoginPage }: CreateRoomProps) => {
  const [values, setValues] = useState<IRoomData>({
    name: "",
    description: "",
    password: null,
    autoDispose: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [nameFieldEmpty, setNameFieldEmpty] = useState(false);
  const [descriptionFieldEmpty, setDescriptionFieldEmpty] = useState(false);

  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined);

  const handleChange =
    (prop: keyof IRoomData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  //const history = useHistory();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidName = values.name !== "";
    const isValidDescription = values.description !== "";

    if (isValidName === nameFieldEmpty) setNameFieldEmpty(!nameFieldEmpty);
    if (isValidDescription === descriptionFieldEmpty)
      setDescriptionFieldEmpty(!descriptionFieldEmpty);

    // create custom room if name and description are not empty
    if (isValidName && isValidDescription && lobbyJoined) {
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
      bootstrap.network
        .createCustom(values)
        .then(() => bootstrap.launchGame())
        .catch((error) => console.error(error));

      setLoginPage(true);
    }
  };

  return (
    <CreateRoomFormWrapper onSubmit={handleSubmit}>
      <TextField
        label="Name"
        variant="outlined"
        autoFocus
        error={nameFieldEmpty}
        helperText={nameFieldEmpty && "Name is required"}
        onChange={handleChange("name")}
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

      <TextField
        label="Description"
        variant="outlined"
        error={descriptionFieldEmpty}
        helperText={descriptionFieldEmpty && "Description is required"}
        multiline
        rows={4}
        onChange={handleChange("description")}
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

      <TextField
        type={showPassword ? "text" : "password"}
        label="Password (optional)"
        onChange={handleChange("password")}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          style: { color: "white" },
        }}
        variant="outlined"
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
      <Button
        variant="contained"
        style={{ color: "white", backgroundColor: "#528c9e" }}
        type="submit"
      >
        Create
      </Button>
    </CreateRoomFormWrapper>
  );
};
