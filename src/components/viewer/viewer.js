import React from "react";
import Header from '../header/header'
import ImageShaker from '../imageshaker/imageshaker';

export default class Viewer extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div>
                <Header/>
                <ImageShaker/>
            </div>
        );
    }
}

