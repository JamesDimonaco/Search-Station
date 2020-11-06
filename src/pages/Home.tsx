import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import React from "react";
import Games from "../components/Games";

import "./Home.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Welcome to Search Station</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={true} className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Games />
      </IonContent>
    </IonPage>
  );
};

export default Home;
