import React, { Component } from 'react';
import folderIcon from '../resources/folder.png';
import markdownIcon from '../resources/markdown.png';
import MarkdownViewer from './MarkdownViewer';


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
          console.log("Test: " + window.location.pathname);
          pathname = window.location.pathname;
        }
        console.log(pathname + " : " + window.location.pathname);
        fetch('/files/fetchFiles/' + pathname)
          .then(res => res.json())
          .then(fileData => this.setState({ fileData }));
      }
    }
  
    render() {
      if (this.state.isFile === true) {
        return(
          <MarkdownViewer />
        )
      }else{
        var fullpath = window.location.origin + window.location.pathname + '/';
        fullpath = fullpath.replace(/\/\//g, '/'); // Messy, but these 3 lines get rid of extra forward slashes
        fullpath = fullpath.replace('http:/', 'http://');
        fullpath = fullpath.replace('https:/', 'https://');
        console.log("path: " + fullpath);

        return (
          <div className="file-grid">
            {this.state.fileData.map((file, i) => {
              return (
                <a 
                  key={i}
                  href={fullpath + file.name}
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
                    <div className='table'>
                      <div className='file-name'>
                        {file.isDirectory ?
                          file.name
                          :
                          file.name.slice(0, -3)
                        }
                      </div>
                      <div className='modifiedDate'>
                        {file.modifiedDate}
                      </div>
                      <div className='creationDate'>
                        {file.creationDate}
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        );
      }
    }
  }
  
  export default FileBrowser;
  