import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';


class RecordRelease extends React.Component {
   constructor(props) {
       super(props);

       this.state = {
        country: '',
        genre: '',
        styles: '',
        notes: '',
        community: {},
        companies: [],
        tracklist: [],
        extraartists: [],
        videos: [],
        uri: '',
        video_id: ''
       }
   }

   handleURI(uri) {
       let regEx = "^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?\.com|youtu\.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)";
       let video_id = uri.match(regEx);       
       return `https://youtube.com/embed/${video_id[1]}`;
   }

   handleVideo(event) {
       event.preventDefault();
       let uri = event.target.href;    
       
       let regEx = "^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?\.com|youtu\.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)";
       let video_id = uri.match(regEx);     

       return document.getElementById('video-content').innerHTML = `
        <iframe 
            width="100%" 
            height="315"
            src="https://youtube.com/embed/${video_id[1]}" 
            frameBorder="0" 
            allowFullScreen></iframe>
        `;
       
   }

   componentDidMount() {
       console.log(this.props);
       const {id} = this.props.match.params;
       fetch(`https://api.discogs.com/releases/${id}`)
        .then(res => res.json())
            .then(data => {
                this.setState({
                    country: data.country,
                    released_formatted: data.released_formatted,
                    genre: data.genres,
                    styles: data.styles,
                    companies: data.companies,
                    notes: data.notes,
                    tracklist: data.tracklist,
                    extraartists: data.extraartists,
                    community: data.community,
                    videos: data.videos
                }, () => console.log(this.state));
            });
   }
    render() {
        let releasesContent;
        const {id} = this.props.match.params;
        const { release } = this.props.location.state;
        const { country, genre, styles, released_formatted, tracklist, companies, notes, extraartists, community, videos } = this.state;
    
        if(tracklist.length === 0){
            return (
                <div className="loading-container">
                    <h1>Loading...</h1>
                </div>
            );
        } else {
        releasesContent = (
            <div className="container">
                <header>                    
                    <p>{release.basic_information.artists[0].name} - {release.basic_information.title}</p>    
                </header>
                <main>
                    <div className="left">
                    <div className="top">
                    <div className="image-container">
                        <img src={release.basic_information.cover_image} />
                    </div>
                    <div className="top-release-info">

                        <div className="title"><h1>{release.basic_information.artists[0].name} - {release.basic_information.title}</h1></div>
                        <div className="label"><p>Label: {release.basic_information.labels[0].name}</p></div>
                        <div className="format"><p>Format: {release.basic_information.formats[0].name}, {release.basic_information.formats[0].descriptions[0]}, {release.basic_information.formats[0].descriptions[1]}</p></div>
                        <div className="country"><p>Country: {country}</p></div>
                        <div className="released"><p>Released: { released_formatted }</p></div>
                        <div className="genre"><p>Genre: {genre}</p></div>
                        <div className="style"><p>Style: {styles}</p></div>

                    </div>
                    </div>

                        <div className="tracklist">
                            <div className="tracklist-header">
                                <h3>Tracklist</h3>
                            </div>
                            <ul className="tracklist">
                                {tracklist.map((track, id) => (
                                  <li key={id}>{track.position} - {track.title} <span className="track-duration">{track.duration}</span></li>
                                ))}
                            </ul>
                        </div>

                        <div className="companies">
                            <div className="companies-header">
                                <h3>Companies</h3>
                            </div>
                            <div className="companies-content">
                            {companies.length > 0 ? companies.map((company, index) => (
                                <div key={index}>
                                    {company.entity_type_name} - {company.name}
                                </div>
                            )):'No companies available'}
                            </div>
                         </div>  

                         <div className="credits">
                            <div className="credits-header">
                                <h3>Credits</h3>
                            </div>
                                <ul className="credits-list">
                                    {extraartists.length > 0 ? extraartists.map((artist, id) => (
                                       <li key={id}>{artist.role} - {artist.name} {artist.tracks ? `(tracks: ${artist.tracks})` : null }</li>
                                    )) : 'No credits available'}
                                </ul>
                         </div>  

                         <div className="notes">
                            <div className="notes-header">
                                <h3>Notes</h3>                               
                            </div>
                            <div className="notes-content">
                                <p>{notes ? notes : 'No notes available'}</p>                            
                            </div>
                         </div>

                    </div>{/** ending top left */}                                   

                    <div className="right">
                        <div className="release-section">
                            <div className="release-header">
                                <h3>Release</h3>
                            </div>
                            <div className="in-collection">
                                    <div className="in-collection-header">
                                        <div className="header-left">
                                            <p>
                                                <strong>In Collection</strong>
                                               <span className="time-ago">Added <Moment fromNow>{release.date_added}</Moment></span>
                                            </p>
                                        </div>                                        
                                        <div className="header-right remove">
                                            <p>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="in-collection-content">
                                           <div>Media Condition</div>
                                           <div>Edit Sleeve Condition</div>
                                           <div>Edit Notes</div>
                                    </div>
                            </div>
                        </div>
                        <div className="statistics">
                            <div className="statistics-header">
                                <h3>Statistics</h3>
                            </div>
                            <div className="statistics-content">
                            <table>
                               <tbody>
                               <tr>
                                    <td>Have: </td>
                                    <td>{community.have}</td>
                                </tr>
                                <tr>
                                    <td>Want:</td>
                                    <td>{community.want}</td>
                                </tr>
                                <tr>
                                    <td>Avg. Rating:</td>
                                    <td>{community.rating.average}/5</td>
                                </tr>
                                <tr>
                                    <td>Ratings:</td>
                                    <td>{community.rating.count}</td>
                                </tr>
                               </tbody>
                               <tbody>
                               <tr>
                                    <td>Last Sold:</td>
                                    <td>--</td>
                                </tr>
                                <tr>
                                    <td>Lowest:</td>
                                    <td>--</td>
                                </tr>
                                <tr>
                                    <td>Median:</td>
                                    <td>--</td>
                                </tr>
                                <tr>
                                    <td>Highest:</td>
                                    <td>--</td>
                                </tr>
                               </tbody>
                            </table>                             
                            </div>
                        </div>
                        <div className="videos">
                            <div className="videos-header">
                                <h3>Videos ({videos ? videos.length : '0'})</h3>
                            </div>
                            <div id="video-content">
                            {videos ? videos.slice(0, 1).map((video, index) => (
                                    <div key={index}>
                                        <iframe 
                                            width="100%" 
                                            height="315"
                                            frameBorder="0" 
                                            allowFullScreen
                                            src={this.handleURI(video.uri)}>
                                        </iframe>
                                    </div>
                            )) : null}                                     
                            </div>
                            <div className={`youtube-tracklist ${videos === undefined || videos.length <= 1 ? null : `available`}`}>
                                {videos ? videos.map((video, index) => (
                                        <div key={index}>
                                                <iframe 
                                                    name={video.title}
                                                    width="65" 
                                                    height="50"
                                                    frameBorder="0" 
                                                    allowFullScreen
                                                    src={this.handleURI(video.uri)}>
                                                </iframe>
                                                <a href={video.uri} onClick={this.handleVideo}>
                                                    {video.title}
                                                </a>
                                        </div>
                                )) : 'There are no video available'}     
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
        return(
            <React.Fragment>
                {releasesContent}
            </React.Fragment>
        )
    }
}

export default RecordRelease;
