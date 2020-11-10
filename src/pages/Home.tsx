import { IonPage } from "@ionic/react";
import React from "react";
import Games from "../components/Games";

import "./Home.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <Games />
    </IonPage>
  );
};

export default Home;
