import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import MarkdownConverter from './MarkdownConverter';


class App extends Component {
  state = { myFile: '', fileNames: [] }

  componentDidMount() {
    fetch('/fetchNames')
      .then(res => res.json())
      .then(fileNames => this.setState({ fileNames }));
  }

  redirectToFile(value) {
    // For some reason the below links change the URL
    // but don't load it, so this is a temporary workaround.

    window.location.href = "http://localhost:3000/" + value;
  }

  render() {
    return (
      <Router>
        <div className="ui secondary  menu" style={{ margin: 15 }} >
          {this.state.fileNames.map((file, i) => {
            return (
              <Link
                className="item"
                key={i}
                to={__dirname + file.slice(0, -3)}>
                {file.slice(0, -3)}
              </Link>
            )
          })}
          <Link 
            className="item right" 
            to={__dirname}>
              New Document
          </Link>
        </div>
        <hr />

        <Route path="/:filename" component={MarkdownConverter} />

      </Router >
    );
  }
}

export default App;
