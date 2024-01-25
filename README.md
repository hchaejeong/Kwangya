# 🌐 Kwangya 🧑‍💻
> ### Contributor: Chaejeong Hyun, 
> 🕰️ 2023.01.11 ~ 2024.01.17 <br />
*2023 Winter Madcamp Project* <br/>

### 👥 Developers
- 현채정: KAIST 전산학부 21학번
- 이중훈: KAIST 전산학부 19학번

## 🖥 Project Introduction
N1빌딩에서 4.5주간 밤낮 없이 매일 가열차게 열심히 코딩한 우리의 몰입캠프 생활을 담은 메타버스입니다. 우리의 주 생활공간인 실습실, 스크럼실, 휴게실과 화장실을 표현을 하였고 생성된 방에 여러 접속자들이 동시에 같이 들어와서 실제 저희처럼 다 같이 생활할 수 있습니다. 화상채팅, 일반채팅, 화이트보드 공유하고 쓰기, 컴퓨터 화면 공유 기능들을 담고 있습니다.

## ⚙️ Environment
<img src="https://img.shields.io/badge/Nest.js-339933?style=for-the-badge&logo=Nest.js&logoColor=white"/> <img src="https://img.shields.io/badge/Phaser-4479A1?style=for-the-badge&logo=Phaser&logoColor=white"/> <img src="https://img.shields.io/badge/Colyseus-800080?style=for-the-badge&logo=Colyseus&logoColor=white"/> <img src="https://img.shields.io/badge/PeerJS-BD5151?style=for-the-badge&logo=PeerJS&logoColor=white"/> <img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white"/> ![Notion](https://img.shields.io/badge/Notion-808080?style=for-the-badge&logo=Notion&logoColor=white)

### Major Features

***Kwangya Map***
<img width="1018" alt="스크린샷 2024-01-25 14 34 25" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/e37861b5-8373-47e7-8706-90d21c209a3d">

***Rooms***

<img width="231" alt="스크린샷 2024-01-25 14 31 23" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/56075d15-92b4-4c68-b410-40a09954e5b0">
<img width="225" alt="스크린샷 2024-01-25 14 20 24" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/797c06e0-7e15-43e4-a3f0-f4a4d9914361">
<img width="231" alt="스크린샷 2024-01-25 14 20 30" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/bb4fec8c-a6f3-45fd-8476-2ba6f51bb967">
<img width="231" alt="스크린샷 2024-01-25 14 19 21" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/eab18a88-b1f7-4739-ae5c-a0325c09571f">

실습실, 스크럼실, 휴게실, 화장실으로 실제 저희 3분반의 생활공간을 표현했습니다.

***Create/Join Custom Room***

첫 메인화면에서 새로운 방을 생성하거나 이미 존재하는 방에 참여할 수 있습니다. 접속자는 총 4개의 아바타 캐릭터를 선택해서 참가할 수 있습니다. 게임 화면의 백드랍은 오전 6시부터 오후 6시 사이에 접속하면 파란하늘로, 오후 6시부터 다음날 아침6시까지는 새벽하늘로 보이도록 배경을 바꿔줬습니다. 

<img width="210" alt="스크린샷 2024-01-25 14 18 27" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/bdbc35bd-3d1e-4941-b90b-6af4c7e76b11"> <img width="210" alt="스크린샷 2024-01-25 14 18 38" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/e554f2b6-a98a-48eb-8ac4-c192a9010b81"> <img width="210" alt="스크린샷 2024-01-25 14 18 55" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/70c6b228-86f9-4c68-b35d-1ba4f3717a52"> <img width="210" alt="스크린샷 2024-01-25 14 42 30" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/95c5736c-a70f-4a5e-af3e-d6d548870d29">


방에 비밀번호를 사용해서 비밀번호 입력해야 입장 가능하도록 설정도 가능합니다.

<img width="400" alt="스크린샷 2024-01-25 14 43 27" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/8d131fb5-bbb7-4350-b2e2-c61a69d01221"> <img width="400" alt="스크린샷 2024-01-25 14 46 12" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/8cdc6528-d56b-4123-8a54-aa641431f5e6">


***Multiplayer Features***

여러 유저가 같은 방에 들어오면 서로 움직임을 실시간으로 볼 수 있고 채팅창으로도 소통이 가능합니다. 접속자들의 캐릭터가 가까운 거리에 있으면 각자의 웹캠을 띄워줘서 실시간 화상통화도 가능하도록 구현했습니다.

<img width="500" alt="스크린샷 2024-01-25 14 55 10" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/d91d7595-b78b-43f8-9c43-12bf99d40501">


여러 유저가 같은 컴퓨터를 이용중이면 화면공유를 할 수 있고 이 화면이 해당 컴퓨터에 접속한 모든 유저에게 보이게 됩니다. 저희 분반에 있는 총 20명의 자리에 각각 컴퓨터를 추가해서 모든 자리에서 컴퓨터 화면공유 기능이 사용 가능합니다.

<img width="300" alt="스크린샷 2024-01-25 14 56 26" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/0ee9366e-8b91-4f26-a830-8631bb75e942"> <img width="500" alt="스크린샷 2024-01-25 14 57 00" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/33cd0f61-deaa-43b2-b2d1-b199616f691d">


실습실과 스크럼실에 있는 화이트보드에 가까이 가서 R 키를 누르면 그림판이 띄워지고 여러 접속자들이 같은 화이트보드을 이용할때 실시간으로 서로가 쓰는거를 그림판에 적용이 되도록 구현했습니다. 

<img width="300" alt="스크린샷 2024-01-25 15 01 20" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/fcdc3957-00c2-4ef2-9a59-481d05ba28b8"> <img width="500" alt="스크린샷 2024-01-25 15 02 24" src="https://github.com/hooniee0811/Madcamp-Fourth-Week/assets/113583087/991f25b0-4e93-42bd-8854-16d13e028430">


***Keyboard Controls***
- W, S, A, D로 위아래 또는 왼쪽 오른쪽으로 캐릭터를 움직일 수 있습니다.
- E로 가까운 의자에 앉을 수 있습니다.
- R로 화이트보드 또는 컴퓨터에 접속 할 수 있습니다.
- Esc로 채팅창을 닫을 수 있고 Enter로 채팅창을 다시 열 수 있습니다.
