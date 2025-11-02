import React from "react";
import Header from "../components/Header";
import EventList from "../components/EventList";
import Intro from "@/components/Intro";
const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <Intro />
      <EventList />
    </>
  );
};

export default HomePage;
