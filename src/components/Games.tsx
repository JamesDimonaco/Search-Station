import {
  useIonViewDidEnter,
  IonImg,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonModal,
  IonButton,
  IonToolbar,
  IonContent,
  IonSearchbar,
  IonItem,
  IonList,
  IonFooter,
  IonRange,
  IonLabel,
} from "@ionic/react";
import "./Games.css";
import React, { useState } from "react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";

interface IGame {
  platforms: string;
  id: number;
  description: string;
  name: string;
  covers: { service_url: string };
}
let des = `<b>To play this game on PS5, your system may need to be updated to the latest system software. Although this game is playable on PS5, some features available on PS4 may be absent. See PlayStation.com/bc for more details.</b><br>Buy the digital PS4™ version of BALAN WONDERWORLD from PlayStation™Store and download the PS5™ version at no extra cost when it launches on 26 March 2021.<br/><br/>Pre-order BALAN WONDERWORLD today! Every moment is an adventure in the all-new wondrous 3D action-platformer!<br/><br/>■Welcome to a wondrous all-action show, the likes of which has never been seen before!<br/>BALAN WONDERWORLD is a wondrous action platformer game themed around the Balan Theatre. Led by the enigmatic maestro named Balan, the stars of the show Emma and Leo will use special abilities from a multitude of characterful costumes as they adventure in the bizarre and imaginary land of Wonderworld. Here memories and vistas from the real world mix with the things that people hold dear.<br/>Twelve different tales await our stars in the Wonderworld, each with their own unique quirks. They will explore all corners of these labyrinthine stages, filled with a myriad of tricks and traps, to get to the heart of each story.<br/><br/>■Wonderworld exists in people's hearts and imagination<br/>The setting for this tale is the fantastic, bizarre land of Wonderworld; a place where people's happy and positive memories mix with their restless worries and negativity.<br/>Leo and Emma are led into Wonderworld by the mysterious clown Balan and set off on a journey to find what is important to them.<br/>Before they can return to the real world, they must first restore the lost balance in their hearts...<br/><br/>■Over 80 different costumes open up all the action you could want!<br/>The stars of the show can use powers from the inhabitants of Wonderworld by wearing their colourful costumes, with over 80 different ones to try on!<br/>Bash your enemies, walk in the air, freeze time or manipulate all kinds of objects... the possibilities are endless when you pick up a new costume.<br/><br/>■Two Legendary Creators Reunite!<br/>Come one, come all and enjoy the pinnacle of Square Enix storytelling in an all-action world of wonder created by the legendary Naka Yuji. For the first time in 20 years Naka Yuji and Oshima Naoto join forces forming the BALAN COMPANY team; founded around, bringing together action game development, video and music production professionals from both inside and outside of the company.<br/><br/><br/><br/>Offline multiplayer (2 players)<br/>Uses DUALSHOCK 4 vibration function<br/>Offline play enabled<br/><br><br>Download of this product is subject to the PlayStation Network Terms of Service and our Software Usage Terms plus any specific additional conditions applying to this product. If you do not wish to accept these terms, do not download this product. See Terms of Service for more important information.<br><br>One-time licence fee to download to multiple PS4 systems. Sign in to PlayStation Network is not required to use this on your primary PS4, but is required for use on other PS4 systems.<br><br>See Health Warnings for important health information before using this product.<br><br>Library programs ©Sony Interactive Entertainment Inc. exclusively licensed to Sony Interactive Entertainment Europe. Software Usage Terms apply, See eu.playstation.com/legal for full usage rights.<br>`;

export const Games: React.FC = () => {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState("1");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<IGame | undefined>(
    undefined
  );

  const [searchText, setSearchText] = useState("");

  useIonViewDidEnter(() => {
    getGames();
  });

  const getGames = () => {
    const url = `https://games.directory/api/v1/play_station/games?&page=${page}`;

    axios({
      url: url,
      method: "GET",
    })
      .then((response) => {
        return setGames(
          response.data.games.map((game: IGame) => (
            <IonItem className="item">
              <IonCard key={game.id}>
                <IonImg className="img" src={game.covers.service_url} />
                <IonCardHeader>
                  <IonCardTitle>{game.name}</IonCardTitle>
                  <IonCardTitle> platform: {game.platforms}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton color="dark" onClick={() => openModal(game)}>
                    READ MORE
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonItem>
          ))
        );
      })
      .catch(() => {
        alert("error ");
      });
  };

  const openModal = (game: IGame) => {
    setModalContent({
      name: game.name,
      description: game.description,
      platforms: game.platforms,
      id: game.id,
      covers: game.covers,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const nextPage = () => {
    let changePage = parseInt(page);
    let newPage = ++changePage;
    let newPageToString = newPage.toString();
    setPage(newPageToString);
    getGames();
  };

  const backPage = () => {
    if (page === "1") {
      alert("this is the first page");
    } else {
      let changePage = parseInt(page);
      let newPage = --changePage;
      let newPageToString = newPage.toString();
      setPage(newPageToString);
      getGames();
    }
  };

  return (
    <div className="ion-padding">
      <IonToolbar>
        <IonButton color="dark" slot="start" onClick={() => backPage()}>
          Back
        </IonButton>
        <IonButton color="dark" slot="end" onClick={() => nextPage()}>
          Next
        </IonButton>
        <IonSearchbar
          placeholder="Search PS4 Games"
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value!)}
          showCancelButton="focus"
        ></IonSearchbar>
        <IonItem>
          <IonRange
            min={1}
            max={5}
            snaps={true}
            pin={true}
            value={parseInt(page)}
            onIonChange={(e) => {
              setPage(e.detail.value.toString());
              getGames();
            }}
          />
        </IonItem>
        <IonItem>
          <IonLabel>Page: {page}</IonLabel>
        </IonItem>
      </IonToolbar>
      <IonList className="grid">{games}</IonList>
      <IonList>
        <IonModal
          isOpen={showModal}
          swipeToClose={true}
          onDidDismiss={() => closeModal()}
        >
          <IonContent className="ion-padding">
            <h1>{modalContent?.name}</h1>

            <IonImg src={modalContent?.covers.service_url} />
            {ReactHtmlParser(modalContent ? modalContent.description : "")}

            <IonButton color="dark" onClick={() => closeModal()}>
              READ LESS
            </IonButton>
          </IonContent>
        </IonModal>
      </IonList>
      <IonToolbar>
        <IonButton color="dark" slot="start" onClick={() => backPage()}>
          Back
        </IonButton>
        <IonButton color="dark" slot="end" onClick={() => nextPage()}>
          Next
        </IonButton>
      </IonToolbar>
      <IonFooter>
        <IonToolbar>Search Text: {searchText ?? "(none)"}</IonToolbar>
      </IonFooter>
    </div>
  );
};

export default Games;
