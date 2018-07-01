import React from "react";

import './imageshaker.css';
import currentConfig from '../../config';

export default class ImageShaker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            payload: {}
        };
        this.fetchPayload(this.getDataUrl()).then(body => {
            this.setState({
                maxComics: body.num
            })
        });
    }

    componentDidMount = () => {
        this.updateImage();
    };

    getDataUrl = (range) => {
        let url = currentConfig.dataUrl;
        if (range) {
            url += Math.floor((Math.random() * (range - 1)) + 1);
        }

        return url;
    };

    updateImage = () => {
        const url = this.getDataUrl(this.state.maxComics);

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
            <div id={"comicContainer"}>
                <div id={"imageContainer"}>
                    <img className={"comic"} src={this.state.payload.img} alt={this.state.payload.alt}/>
                    <div id={"comicName"}>
                        <span>#{this.state.payload.num} | {this.state.payload.title}</span>
                    </div>
                </div>
                <button id={"shuffleBtn"} onClick={this.updateImage}>Get me another one!</button>
            </div>
        )
    };
}