"use client";

import Image from "next/image";
import MainEnterRoomPage from "./_components/main_enter_room_page";
import ComputerDialog from "./_components/computer-dialog";
import { Provider } from "react-redux";
import store from "./_stores";

export default function Home() {
  return (
    <Provider store={store}>
      <MainEnterRoomPage />
    </Provider>
  );
}
