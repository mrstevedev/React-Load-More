import React, { Component } from 'react';
import { Link } from "react-router-dom";
import logo from '../../public/discogs-logo.svg';

class Index extends React.Component {
    render() {
        return(
            <div className="homescreen">
                <div className="homescreen-container">
                <div>
                    <img src={logo} />
                </div>
                    <Link to="/list">
                        <button className="view-list-btn">
                            View Collection
                        </button>
                    </Link>
                <div className="intro">
                    <p>
                        Dynamic listing of vinyl records added to my discogs collection over the years. The listing pulls data from the /collections endpoint in descending order
                        set with other parameters in the fetch() request. Upon clicking <strong>Load More</strong> more data gets added to the <strong>state</strong> to display on the UI.
                    </p>
                </div>
                <div className="sub-text">
                    <p>
                        Built in Reactjs. A Front-End UI Library.
                    </p>
                </div>
                </div>
            </div>
        )
    }
}
export default Index;