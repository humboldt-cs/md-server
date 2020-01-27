import React, { Component } from 'react';
import MdIcon from './MdIcon';


class FileBrowser extends Component {
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
                        <div className="md_cover">
                        <MdIcon
                          className="md_file_icon"
                          stroke_width='5' 
                        />
                        </div>
                        <br />
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
  
  export default FileBrowser;
  