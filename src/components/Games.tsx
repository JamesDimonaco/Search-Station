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
import React, { useState } from "react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";

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
              <IonItem>
                <IonCard key={e.id}>
                  <IonImg src={e.covers.service_url} />
                  <IonCardHeader>
                    <IonCardTitle>{e.name}</IonCardTitle>
                    <IonCardTitle> platform: {e.platforms}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonButton color="dark" onClick={() => setShowModal(true)}>
                      READ MORE
                    </IonButton>
                    <IonModal
                      isOpen={showModal}
                      swipeToClose={true}
                      onDidDismiss={() => setShowModal(false)}
                    >
                      <IonContent className="ion-padding">
                        <h1>{e.name}</h1>
                        <IonImg src={e.covers.service_url} />
                        {ReactHtmlParser(e.description)}
                        <IonButton
                          color="dark"
                          onClick={() => setShowModal(false)}
                        >
                          READ LESS
                        </IonButton>
                      </IonContent>
                    </IonModal>
                  </IonCardContent>
                </IonCard>
              </IonItem>
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
      <IonList>{games}</IonList>
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
