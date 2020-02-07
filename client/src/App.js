import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
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
          {/* New doc link includes previous path information so that a user
              can make a new file at the last location they were browsing in */}
          <a href={window.location.origin + '/new_document' + window.location.pathname}>
            <img className='new_icon' src={newIcon} alt='new document' />
          </a>
        </div>

        <div className='pageContent'>
          <Router>
            <Route path={'/'} component={FileBrowser} />

            <Switch>
                <Route path='/new_document*' component={NewDocument} />
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
