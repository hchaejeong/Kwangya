"use client";

import Peer, { MediaConnection } from "peerjs";

import { ElementRef, useRef } from "react";
import { useUserStore } from "../_stores/use-user";
import Network from "../_services/network";

export default class WebRTC {
  private myPeer: Peer;
  //연결된 모든 peers
  private peers = new Map<
    string,
    { call: MediaConnection; video: HTMLVideoElement }
  >();
  //호출된 peers
  private onCalledPeers = new Map<
    string,
    { call: MediaConnection; video: HTMLVideoElement }
  >();
  private myStream?: MediaStream;
  private network: Network;
  //   private videoRef = useRef<HTMLVideoElement>(null);
  //   private myVideo = document.createElement("video");
  //   private buttonRef = useRef<ElementRef<"button">>(null);
  private buttonGrid = document.querySelector(".button-grid");
  private videoGrid = document.querySelector(".video-grid");
  private myVideo = document.createElement("video");

  constructor(userId: string, network: Network) {
    const sanitizedId = this.replaceInvalidId(userId);
    this.myPeer = new Peer(sanitizedId);
    this.network = network;
    this.myPeer.on("error", (err) => {
      console.log(err.type);
      console.error(err);
    });

    this.myVideo.muted = true;

    this.initialize();
  }

  private replaceInvalidId(userId: string) {
    return userId.replace(/[^0-9a-z]/gi, "G");
  }

  initialize() {
    //myPeer 객체에서 'call' 이벤트가 발생했을 때 실행할 콜백 함수를 등록합니다. 'call' 이벤트는 다른 peer로부터 전화 수신 시 발생합니다.
    this.myPeer.on("call", (call) => {
      //이미 해당 peer에 대한 call event가 처리되었는지 확인
      if (!this.onCalledPeers.has(call.peer)) {
        //response on requested call
        call.answer(this.myStream);

        const video = document.createElement("video");

        //onCalledPeers에 새로 생성된 call, video 저장
        this.onCalledPeers.set(call.peer, { call, video });

        //수신된 call의 stream에 대한 callback
        call.on("stream", (userVideoStream) => {
          this.addVideoStream(video, userVideoStream);
        });
      }
    });
  }

  //check if permission has been granted before
  checkPreviousPermission() {
    const permissionName = "microphone" as PermissionName;
    navigator.permissions?.query({ name: permissionName }).then((result) => {
      if (result.state === "granted") this.getUserMedia(false); // if the permission is already granted
    });
  }

  getUserMedia(alertOnError = true) {
    navigator.mediaDevices
      ?.getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const { setVideoConnected } = useUserStore((state) => state);

        this.myStream = stream;
        this.addVideoStream(this.myVideo, this.myStream);
        // this.setUpButtons();
        setVideoConnected(true);
        this.network.videoConnected();
      })
      .catch((error) => {
        if (alertOnError)
          window.alert(
            "No webcam or microphone found, or permission is blocked"
          );
      });
  }

  connectToNewUser(userId: string) {
    if (this.myStream) {
      const sanitizedId = this.replaceInvalidId(userId);
      if (!this.peers.has(sanitizedId)) {
        console.log("calling", sanitizedId);

        //new user에게 mystream을 call
        const call = this.myPeer.call(sanitizedId, this.myStream);
        const video = document.createElement("video");

        //peer와 video element를 peers에 추가
        this.peers.set(sanitizedId, { call, video });

        //사용자의 stream을 받아 socket 추가
        call.on("stream", (userVideoStream) => {
          this.addVideoStream(video, userVideoStream);
        });
      }
    }
  }

  addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
    //mediastream이 video에 연결되고, video가 해당 stream을 재생할 수 있음
    video.srcObject = stream;
    video.playsInline = true; //mobile에서 video가 전체 화면이 아닌 inline으로 재생
    //video의 metadata가 loading이 완료되면 video 재생
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    if (this.videoGrid) this.videoGrid.append(video);
    // if (this.videoRef) this.videoRef.current?.append(video);
  }

  deleteVideoStream(userId: string) {
    const sanitizedId = this.replaceInvalidId(userId);
    if (this.peers.has(sanitizedId)) {
      const peer = this.peers.get(sanitizedId);

      peer?.call.close();
      peer?.video.remove();
      this.peers.delete(sanitizedId);
    }
  }

  deleteOnCalledVideoStream(userId: string) {
    const sanitizedId = this.replaceInvalidId(userId);
    if (this.onCalledPeers.has(sanitizedId)) {
      const onCalledPeer = this.onCalledPeers.get(sanitizedId);

      onCalledPeer?.call.close();
      onCalledPeer?.video.remove();
      this.onCalledPeers.delete(sanitizedId);
    }
  }
}
