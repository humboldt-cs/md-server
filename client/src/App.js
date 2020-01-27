import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import MarkdownViewer from './Components/MarkdownViewer';
import NewDocument from './Components/NewDocument';
import FileBrowser from './Components/FileBrowser';
import homeIcon from './resources/home.png';
import newIcon from './resources/new.png';

class App extends Component {

  render() {
    return (
      <div className='app'>
        <div className="navBar" >
          <a href={window.location.origin}>
            <img className="home_icon" src={homeIcon} alt='home' />
          </a>
          <br />
          <a href={window.location.origin + '/new_document'}>
            <img className='new_icon' src={newIcon} alt='new document' />
          </a>
        </div>

        <div className='pageContent'>
          <Router>
            <Route exact path={'/'} component={FileBrowser} />

            <Switch>
                <Route path="/new_document" component={NewDocument} />
                <Route path="/:filename" component={MarkdownViewer} />
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
