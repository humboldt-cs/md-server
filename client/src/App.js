import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import MarkdownConverter from './Components/MarkdownConverter';
import NewDocument from './Components/NewDocument';
import homeIcon from './resources/home.png';


class App extends Component {
  state = {
    myFile: '',
    fileNames: [],
  }

  componentDidMount() {
    console.log(this.state.homepage)
    fetch('/files/fetchNames')
      .then(res => res.json())
      .then(fileNames => this.setState({ fileNames }));
  }

  render() {
    return (
      <div>
        <Router>
          <div className="navBar" >
            <a href={window.location.origin}>
              <img className="home_icon" src={homeIcon} />
            </a>
            <a
              className="ui button new_document"
              href={"/new_document"}>
              New Document
          </a>
          </div>
          <hr />

          <Switch>
            <Route path="/new_document" component={NewDocument} />
            <Route path="/:filename" component={MarkdownConverter} />
          </Switch>
        </Router>

        {/* Only display files if there is nothing after the origin URL */}
        {
          window.location.href.substring(0, window.location.href.length - 1) === window.location.origin ?
            <div className="file-grid">
              {this.state.fileNames.map((file, i) => {
                return (
                  <a href={window.location.origin + "/" + file.slice(0, -3)}>
                    <div
                      className="file"
                      key={i}>
                      {file.slice(0, -3)}
                    </div>
                  </a>
                )
              })}
            </div>

            : null
        }
      </div >
    );
  }
}

export default App;
