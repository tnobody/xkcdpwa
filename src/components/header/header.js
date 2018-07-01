import React from "react";
import './header.css';

export default class Header extends React.Component {
    render() {
        return (
            <header>
                <div id={"headerContainer"}>
                    <img src={process.env.PUBLIC_URL + "/img/logo.png"} alt={"Logo"}/>
                    <span className={"title"}>pwa</span>
                </div>
            </header>
        )
    }
}
