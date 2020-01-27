import React, { Component } from 'react';
import folderIcon from '../resources/folder.png';
import markdownIcon from '../resources/markdown.png';


class FileBrowser extends Component {
    state = {
      myFile: '',
      fileData: [],
    }
  
    componentDidMount() {
      console.log(this.state.homepage)
      fetch('/files/fetchNames')
        .then(res => res.json())
        .then(fileData => this.setState({ fileData }));
    }
  
    render() {
      return (
        <div className="file-grid">
          {this.state.fileData.map((file, i) => {
            return (
              <a 
                key={i}
                href={window.location.origin + "/" + file.name.slice(0, -3)}
                className="file">
                <div key={i}>
                  <div>
                  {file.isDirectory ? 
                    <img
                      className='folder_icon' 
                      src={folderIcon} 
                      alt='folder' /> 
                  :
                    <img
                      className='markdown_icon' 
                      src={markdownIcon} 
                      alt='markdown' /> 
                  }
                  </div>
                  {file.name.slice(0, -3)}
                </div>
              </a>
            )
          })}
        </div>
      );
    }
  }
  
  export default FileBrowser;
  