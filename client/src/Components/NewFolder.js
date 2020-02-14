import React, { Component } from 'react';
import axios from 'axios';

class NewFolder extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.createNewFolder = this.createNewFolder.bind(this);
        this.parsePath = this.parsePath.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    createNewFolder = value => {
        // Check if name is empty
        if (this.state.folder_name === undefined) {
            alert("Please specify a document name");
            return;
        }

        var parsedPath = this.parsePath();
        var folder_name = this.state.folder_name;
        
        // Send new name, document, and path to be saved in to server
        axios.post('/files/new_folder', { 
                folderName: folder_name.trim(),
                savePath: parsedPath 
            },
            { headers: { authorization: 'Bearer ' + localStorage.token }})
            .then(res => console.log(res))
            .catch(err => console.log(err));

        var path =  parsedPath.replace(/ /g, "%20") + folder_name.trim().replace(/ /g, "%20");
        path = path.replace(/\/\//g, '/');
        if (path[0] !== '/') {
            console.log('first?', path);
            path = '/' + path;
        }
        window.location.href = window.location.origin + path;
    }

    parsePath() {
        var path = window.location.pathname;
        path = path.substring(path.indexOf('/new_folder') + 11, path.length);
        if (path.substring(path.length - 3, path.length) === '.md') {
            path = path.split('/');
            path.pop();
            path = path.join('/');
        }
        path = path.replace(/%20/g, ' ') + '/';
        // Depending on where we are, the filepath may have already had slashes
        path = path.replace(/\/\//g, '/');
        if (path === 'new_document/') {
            return '/';
        }else{
            return path;
        }
    }

    render() {
        return (
            <div className='new_document_panel'>
                <input
                    type="text"
                    className="new_document_name"
                    name="folder_name"
                    placeholder="Folder Name"
                    onChange={this.handleChange} />
                <button
                    className="ui button"
                    onClick={this.createNewFolder.bind(this)}
                    style={{ marginLeft: "1%" }}>
                    Create Folder
                </button>
            </div>
        )
    }
}

export default NewFolder;