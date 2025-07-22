import React from "react";
import Header from "../components/Header";
import EventList from "../components/EventList"; // Assuming you have an EventList component to display events
const HomePage: React.FC = () => {
    return (
        <>
            <Header />
            
            <EventList />
        </>
    );
};

export default HomePage;