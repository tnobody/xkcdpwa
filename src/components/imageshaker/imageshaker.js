import React from "react";

import './imageshaker.css';
import currentConfig from '../../config';

export default class ImageShaker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            payload: {}
        };
        this.fetchPayload(currentConfig.backend).then(body => {
            this.setState({
                maxComics: body.num
            })
        });
    }

    componentDidMount = () => {
        this.updateImage();
    };

    updateImage = () => {
        let url = currentConfig.backend;

        if (this.state.maxComics) {
            url += Math.floor((Math.random() * this.state.maxComics) + 1);
        }
        this.fetchPayload(url).then(body => {
            this.setState({
                payload: body
            });
        });
    };

    fetchPayload = (url) => {
        return fetch(url)
            .then(response => response.json()
                .then(body => {
                    return body;
                })
                .catch(err => console.log(err))
            );
    };

    render = () => {
        return (
            <div className={"imageContainer"}>
                <img className={"comic"} src={this.state.payload.img} alt={"Random comic"}/>
                <div id={"comicName"}>
                    <span>{this.state.payload.title}</span>
                </div>
                <button id={"shuffleBtn"} onClick={this.updateImage}>Get me another one!</button>
            </div>
        )
    };
}