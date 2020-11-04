/* eslint-disable no-restricted-globals */
import {
  useIonViewDidEnter,
  IonImg,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonText,
  IonCardTitle,
  IonModal,
  IonButton,
  IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";
import axios from "axios";

export const Games: React.FC = () => {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState("1");
  const [showModal, setShowModal] = useState(false);
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
        console.log("Data: ", response.data.games);

        return setGames(
          response.data.games.map(
            (e: {
              platforms: string;
              id: number;
              description: string;
              name: string;
              covers: { service_url: string };
            }) => (
              <IonCard key={e.id}>
                <IonImg src={e.covers.service_url} />
                <IonCardHeader>
                  <IonCardTitle>{e.name}</IonCardTitle>
                  <IonCardTitle>Game platform: {e.platforms}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton color="dark" onClick={() => setShowModal(true)}>
                    READ MORE
                  </IonButton>
                </IonCardContent>
              </IonCard>
            )
          )
        );
      })
      .catch(() => {
        alert("error ");
      });
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
    <div>
      <IonToolbar>
        <IonButton color="dark" slot="start" onClick={() => backPage()}>
          Back
        </IonButton>
        <IonText className="ion-padding">
          {" "}
          You are currently on page:{page}
        </IonText>
        <IonButton color="dark" slot="end" onClick={() => nextPage()}>
          Next
        </IonButton>
      </IonToolbar>
      {games}
      <IonToolbar>
        <IonButton color="dark" slot="start" onClick={() => backPage()}>
          Back
        </IonButton>
        <IonButton color="dark" slot="end" onClick={() => nextPage()}>
          Next
        </IonButton>
      </IonToolbar>
    </div>
  );
};

export default Games;
