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
  IonCardSubtitle,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonTitle,
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
  const [games, setGames] = useState<any[]>([]);
  const [page, setPage] = useState("1");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<IGame | undefined>(
    undefined
  );

  const [searchText, setSearchText] = useState("");

  useIonViewDidEnter(() => {
    getGames();
  });

  const getGames = (event?: any) => {
    const url = `https://games.directory/api/v1/play_station/games?&page=${page}`;

    if (event) {
      axios({
        url: url,
        method: "GET",
      })
        .then((response) => {
          setGames((games) => [
            ...games,
            response.data.games.map((game: IGame) => (
              <IonItem key={game.id} className="item">
                <IonCard>
                  <IonImg className="img" src={game.covers.service_url} />
                  <IonCardHeader>
                    <IonCardTitle>{game.name}</IonCardTitle>
                    <IonCardTitle> platform: {game.platforms}</IonCardTitle>
                    <IonCardSubtitle>
                      {ReactHtmlParser(game.description.slice(0, 500))}
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonButton color="dark" onClick={() => openModal(game)}>
                      READ MORE
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonItem>
            )),
          ]);
        })
        .catch(() => {
          alert("error ");
        });
    } else {
      axios({
        url: url,
        method: "GET",
      })
        .then((response) => {
          return setGames(
            response.data.games.map((game: IGame) => (
              <IonItem key={game.id} className="item">
                <IonCard>
                  <IonImg className="img" src={game.covers.service_url} />
                  <IonCardHeader>
                    <IonCardTitle>{game.name}</IonCardTitle>
                    <IonCardTitle> platform: {game.platforms}</IonCardTitle>
                    <IonCardSubtitle>
                      {ReactHtmlParser(game.description.slice(0, 500))}
                    </IonCardSubtitle>
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
    }
    let changePage = parseInt(page);
    let newPage = ++changePage;
    let newPageToString = newPage.toString();
    setPage(newPageToString);
  };
  console.log(games);

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

  const loadMoreGames = (event: any) => {
    let changePage = parseInt(page);
    let newPage = ++changePage;
    let newPageToString = newPage.toString();
    setPage(newPageToString);
    getGames(event);
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  };

  return (
    <div className="">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Welcome to Search Station</IonTitle>
        </IonToolbar>

        <IonToolbar>
          <IonSearchbar
            placeholder="Search PS4 Games"
            value={searchText}
            onIonChange={(e) => setSearchText(e.detail.value!)}
            showCancelButton="focus"
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent
        fullscreen
        onIonScrollStart={loadMoreGames}
        className="ion-padding"
      >
        <IonList className="grid">{games}</IonList>
        <IonList>
          <IonModal
            isOpen={showModal}
            swipeToClose={true}
            onDidDismiss={() => closeModal()}
          >
            <IonContent className="ion-padding">
              <IonButton color="dark" onClick={() => closeModal()}>
                READ LESS
              </IonButton>
              <h1>{modalContent?.name}</h1>

              <IonImg className="img" src={modalContent?.covers.service_url} />
              {ReactHtmlParser(modalContent ? modalContent.description : "")}
            </IonContent>
          </IonModal>
        </IonList>

        <IonInfiniteScroll
          onIonInfinite={(event) => loadMoreGames(event)}
          threshold="900px"
        >
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more games.."
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </div>
  );
};

export default Games;
