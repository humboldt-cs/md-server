import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Login from './Components/Login';
import NewDocument from './Components/NewDocument';
import NewFolder from './Components/NewFolder';
import FileBrowser from './Components/FileBrowser';
import homeIcon from './resources/home.png';
import newIcon from './resources/new.png';
import newFolder from './resources/new_folder.png';
import logoutIcon from './resources/logout.png';

class App extends Component {

  render() {
    // If not logged in, send user to login
    if (localStorage.token === undefined) {
      return (<Login />)
    }else{
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
            <br />
            <a href={window.location.origin + '/new_folder' + window.location.pathname}>
              <img className='new_folder_icon' src={newFolder} alt='new folder' />
            </a>
            <br />
            <img className='logout_icon' src={logoutIcon} alt='logout' onClick={() => {
              localStorage.clear();
              window.location.reload();
            }} />
          </div>
  
          <div className='pageContent'>
            <Router>
              <Route path={'/'} component={FileBrowser} />
  
              <Switch>
                  <Route path='/new_document*' component={NewDocument} />
                  <Route path='/new_folder*' component={NewFolder} />
              </Switch>
            </Router>
          </div>
        </div>
      );
    }
  }
}

export default App;
