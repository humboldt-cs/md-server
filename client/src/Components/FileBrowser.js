import React, { Component } from 'react';
import MarkdownViewer from './MarkdownViewer';
import FileTable from './FileTable';


class FileBrowser extends Component {
    state = {
      myFile: '',
      fileData: [],
    }
  
    componentDidMount() {
      var url = window.location.href;

      // Check if directed to a file.
      if (url.substring(url.length - 3, url.length) === '.md') {
        this.setState({ isFile: true });
      }else{
        var pathname = "root";
        if (window.location.pathname !== '/') {
          pathname = window.location.pathname;
        }
        fetch('/files/fetchFiles/' + pathname)
          .then(res => res.json())
          .then(fileData => this.setState({ fileData }));
      }
    }
  
    render() {
      if (window.location.pathname.substring(0, 13) === '/new_document') {
        return null;
      }

      if (this.state.isFile === true) {
        return(
          <MarkdownViewer />
        )
      }else{
        return (
          <div className="file-grid">
            <FileTable 
              fileData={this.state.fileData}            
            />
          </div>
        );
      }
    }
  }
  
  export default FileBrowser;
  