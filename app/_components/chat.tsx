"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import phaserGame from "../PhaserGame";
import Game from "../_scenes/Game";
import { getColorByString } from "./util";
import { MessageType, setFocused, setShowChat } from "../_stores/ChatStore";
import { Hint } from "@/components/hint";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";

export const Chat = () => {
  const [inputValue, setInputValue] = useState("");
  // const [chatMessages, setChatMessages] = useState<
  //   {
  //     messageType: MessageType;
  //     chatMessage: { user: string; content: string; messageSentTime: Date };
  //   }[]
  // >([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const chatMessages = useAppSelector((state) => state.chat.chatMessages);
  const focused = useAppSelector((state) => state.chat.focused);
  const showChat = useAppSelector((state) => state.chat.showChat);
  const dispatch = useAppDispatch();

  const game = phaserGame.scene.keys.game as Game;

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus();
    }
  }, [focused]);

  const onChangeValue = (value: string) => {
    setInputValue(value);
  };

  const onPressESC = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      inputRef.current?.blur();
      dispatch(setShowChat(false));
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //prevent reloading the page when submit
    e.stopPropagation(); //prevent propagation event to parent components

    const val = inputValue.trim();
    setInputValue("");

    if (val) {
      game.network.addChatMessage(val);
      game.myPlayer.updatePlayerDialog(val);
    }

    // if (val) {
    //   const cp = [...chatMessages];

    //   cp.unshift({
    //     messageType: MessageType.NORMAL_MESSAGE,
    //     chatMessage: {
    //       user: "user",
    //       content: val,
    //       messageSentTime: new Date(),
    //     },
    //   });

    //   console.log(cp);

    //   setChatMessages(cp);
    // }
  };

  return (
    <div>
      {showChat ? (
        <div className="fixed left-6 bottom-20 w-[200px] h-[280px] lg:w-[440px] bg-background rounded-lg opacity-70 rounded-b-none">
          <div className="flex flex-1 flex-col-reverse overflow-y-auto p-3 h-full">
            {chatMessages.map(({ messageType, chatMessage }, index) => (
              <Hint
                label={format(chatMessage.messageSentTime, "yyyy/MM/dd HH:mm")}
                side="right"
                asChild
                key={index}
              >
                <div className="hover:bg-[#3a3a3a] w-full">
                  {messageType === MessageType.NORMAL_MESSAGE ? (
                    <p
                      style={{ color: getColorByString(chatMessage.user) }}
                      className="m-1"
                    >
                      {chatMessage.user}:{" "}
                      <span className="text-white size-4">
                        {chatMessage.content}
                      </span>
                    </p>
                  ) : (
                    <p className="text-gray-500">
                      {chatMessage.user} {chatMessage.content}
                    </p>
                  )}
                </div>
              </Hint>
            ))}
          </div>
          <form onSubmit={onSubmit}>
            <Input
              onChange={(e) => onChangeValue(e.target.value)}
              value={inputValue}
              placeholder="Send a message"
              className="border-white/10 w-full rounded-t-none"
              ref={inputRef}
              autoFocus={focused}
              onFocus={() => {
                if (!focused) {
                  dispatch(setFocused(true));
                }
              }}
              onBlur={() => {
                dispatch(setFocused(false));
              }}
              onKeyDown={onPressESC}
            />
          </form>
        </div>
      ) : (
        <button
          className="flex fixed left-10 bottom-10 w-14 h-14 bg-slate-900 p-2 rounded-full justify-center items-center"
          onClick={() => {
            dispatch(setShowChat(true));
            dispatch(setFocused(true));
          }}
        >
          <MessageSquare className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};
