import React, { Component } from 'react';
import MusicList from './components/MusicList';
import RecordRelease from './components/RecordRelease';
import Index from './components/Index';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


class App extends Component {

    render() {
        return (
            <Router>
               <Switch>
                   <Route exact path="/" component={Index} />
                   <Route exact path="/list" component={MusicList} />
                   <Route exact path="/release/:id" component={RecordRelease} />
               </Switch>
           </Router>
        )
    }
}

export default App;