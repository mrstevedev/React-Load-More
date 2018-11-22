
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import { CSSTransition } from 'react-transition-group';
import Moment from 'react-moment';

import { Link } from "react-router-dom";

class MusicList extends Component {

    constructor(props){
        super(props);
        this.state = {
            releases: [],
            start_index: 0,
            page: 1,
            visible: 10,
            loadMore: "Load More",
            per_page: 50            
        }
    }

    componentDidMount() {
        this.mounted = true;
        fetch(`https://api.discogs.com/users/eckosneekz/collection/folders/0/releases?sort=added&sort_order=desc&per_page=${this.state.per_page}&token=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
                .then(data => {
                    this.setState({                        
                        page: data.pagination.page,
                        per_page: data.pagination.per_page,
                        releases: data.releases,
                        id: data.releases.map(release => release.basic_information.id) //Why did this work on one line and not within curly braces?
                    }, () => console.log(this.state));
                }).catch(error => console.error(error))
    }

    componentWillUnmount(){
        console.log('unmount async request');
        this.mounted = false;
    }

    handleLoad = (event) => {
        this.setState({
            loadMore: 'Loading...'
        });
       setTimeout(() => {
            this.setState((prev) => {
                return {
                    visible: prev.visible + 10,                                                         
                }
            }, () => {
                console.log(this.state);
                this.handleUpdate();
            });
       }, 900);
    }

    handleUpdate() {

        const { start_index, page, visible, per_page, releases } = this.state;

        if(visible >= per_page){
            console.log('exceeded more than 50 per page, go to next page. Request new data and push the new data into the releases array');
            fetch(`https://api.discogs.com/users/eckosneekz/collection/folders/0/releases?sort=added&sort_order=desc&per_page=${this.state.per_page + 50}&token=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
                .then(data => {
                    this.setState({
                        page: page + 1,
                        per_page: per_page + 50,
                        releases: data.releases                        
                    });
                }).catch(error => console.error(error))            
        }
        this.setState({
            loadMore: 'Load More'
        });
    }

    render(){
        let releasesContent;
        const { id, start_index, visible, releases } = this.state;

        if(releases === undefined || releases.length === 0){

            return (
                <div className="loading-container">
                    <h1>Loading...</h1>
                </div>
            );
        } else {

        releasesContent = (
            <div>
                <header>
                   <p>Latest Records Purchased</p>
                </header>
                 <div className="main">
                {releases.slice(start_index, visible).map((release, index) => (
                    <Link to={{
                        pathname: `/release/`+release.id, state:{release}
                    }} className="release-link" key={index}>
                        <div className="release">
                            <h3 className="overflow"><strong>{release.basic_information.artists[0].name}</strong> -
                                &nbsp;{release.basic_information.title}</h3> <br/>
                            <span className="date-added">Added to my collection on <Moment format="dddd MMMM D, Y" title={ release.date_added }>{ release.date_added }</Moment></span>
                        </div>
                    </Link>
                ))}
                </div>
            </div>
        );
    }

        return(
            <div className="container">
                <div className="list">
                    {releasesContent}
                    <div className="load-more-container">
                        <button className="load-more-btn" onClick={this.handleLoad}>{this.state.loadMore}</button>
                    </div>
                </div>
            </div>
        );
    }
}

MusicList.propTypes = {
    recordReleases: PropTypes.array
};

export default MusicList;