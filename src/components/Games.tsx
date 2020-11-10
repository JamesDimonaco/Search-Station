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

export const Games: React.FC = () => {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState("1");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<IGame | undefined>(
    undefined
  );

  const [searchText, setSearchText] = useState("");


  const [totalPages, setTotalPages] = useState(0);

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
        setTotalPages(response.data.meta.pagination['Total-Pages']);

        return setGames(
          response.data.games.map((game: IGame) => (
            <IonItem className="item">
              <IonCard key={game.id}>
                <IonImg className="img" src={game.covers?.service_url} />
                <IonCardHeader>
                  <IonCardTitle>{game.name}</IonCardTitle>
                  <IonCardTitle> platform: {game.platforms}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton color="dark" onClick={() => openModal(game)}>
                    SEE MORE
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonItem>
          ))
        );
      })
      .catch((e) => {
        console.log(e)
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
            max={totalPages}
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
            <IonButton color="dark" onClick={() => closeModal()}>
              SEE LESS
            </IonButton>
            <h1>{modalContent?.name}</h1>

            <IonImg className="img" src={modalContent?.covers.service_url} />
            {ReactHtmlParser(modalContent ? modalContent.description : "")}
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
