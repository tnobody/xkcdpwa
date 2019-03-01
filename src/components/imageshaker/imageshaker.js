import React from "react";

import "./imageshaker.css";
import { Seismograph } from "./Seismograph";
import currentConfig from "../../config";

export default class ImageShaker extends React.Component {
  constructor(props) {
    super(props);
    this.seismograph = null;
    this.state = {
      history: [{}],
      currentIndex: 0
    };
    this.fetchPayload(this.getDataUrl()).then(body => {
      this.setState({
        history: [body],
        currentIndex: this.state.history.length - 1,
        maxComics: body.num
      });
    });
  }

  componentDidMount = () => {
    this.updateImage();
    if (!this.seismograph) {
      this.seismograph = new Seismograph({
        minShakes: this.props.minShakes || 3,
        onShake: this.updateImage,
        delay: this.props.delay || 1500
      });
    }
    this.seismograph.startRecording();
  };

  componentWillUnmount() {
    if (this.seismograph) {
      this.seismograph.stopRecording();
    }
  }

  getDataUrl = range => {
    let url = currentConfig.dataUrl;
    if (range) {
      url += Math.floor(Math.random() * (range - 1) + 1);
    }

    return url;
  };

  updateImage = () => {
    const url = this.getDataUrl(this.state.maxComics);
    const currentHistory = this.state.history;
    let lastIndex = this.state.history.length - 1;

    this.fetchPayload(url).then(body => {
      this.setState({
        history: currentHistory.concat([body]),
        currentIndex: ++lastIndex
      });
    });
  };

  fetchPayload = url => {
    return fetch(url)
      .then(response => response.json())
      .then(body => body)
      .catch(err => console.log(err));
  };

  prev = () => {
    let idx = this.state.currentIndex;
    this.setState({
      currentIndex: --idx
    });
  };

  next = () => {
    let idx = this.state.currentIndex;
    this.setState({
      currentIndex: ++idx
    });
  };

  render = () => {
    const currentPayload = this.state.history[this.state.currentIndex];

    console.log(this.state.currentIndex);
    console.log(this.state.history);
    return (
      <div id={"comicContainer"}>
        <div id={"imageContainer"}>
          <img
            className={"comic"}
            src={currentPayload.img}
            alt={currentPayload.alt}
          />
          <div id={"comicName"}>
            <span>
              #{currentPayload.num} | {currentPayload.title}
            </span>
          </div>
        </div>
        <div className={"buttongroup"}>
          {this.state.currentIndex > 1 && (
            <button onClick={this.prev}>&lt;</button>
          )}
          <button id={"shuffleBtn"} onClick={this.updateImage}>
            Get me another one!
          </button>
          {this.state.currentIndex < this.state.history.length - 1 && (
            <button onClick={this.next}>&gt;</button>
          )}
          <div className="clearer" />
        </div>
      </div>
    );
  };
}
