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


class App extends Component {
  state = { myFile: '', fileNames: [] }

  componentDidMount() {
    fetch('/files/fetchNames')
      .then(res => res.json())
      .then(fileNames => this.setState({ fileNames }));
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
                to={file.slice(0, -3)}>
                {file.slice(0, -3)}
              </Link>
            )
          })}
          <Link
            className="item right"
            to={"/new_document"}>
            New Document
          </Link>
        </div>
        <hr />

        <Switch>
          <Route path="/new_document" component={NewDocument} />
          <Route path="/:filename" component={MarkdownConverter} />
        </Switch>
      </Router>
    );
  }
}

export default App;
