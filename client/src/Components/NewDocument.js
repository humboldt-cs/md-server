import React, { Component } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import axios from 'axios';

class NewDocument extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.saveNewDoc = this.saveNewDoc.bind(this);
        this.mdEditorChange = this.mdEditorChange.bind(this);
        this.parsePath = this.parsePath.bind(this);
    }

    state = {
        width: 500,
        height: 500,
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    mdEditorChange = value => {
        this.setState({ newFile: value })
    }

    saveNewDoc = value => {
        // Check if name or document are empty
        if (this.state.doc_name === undefined) {
            alert("Please specify a document name");
            return;
        } else if (this.state.newFile === undefined) {
            alert("Document body cannot be empty");
            return;
        }

        // Trim .md if the user typed it explicitly
        var doc_name = this.state.doc_name;
        if (doc_name.substring(doc_name.length - 3, doc_name.length) === ".md") {
            doc_name = doc_name.slice(0, doc_name.length - 3);
        }

        var parsedPath = this.parsePath();
        console.log('Parsed path: ' + parsedPath);

        // Send new name, document, and path to be saved in to server
        axios.post('/files/new_file', { 
                filename: doc_name.trim(),
                newFile: this.state.newFile,
                savePath: parsedPath 
            },
            { headers: { authorization: 'Bearer ' + localStorage.token }})
            .then(res => console.log(res))
            .catch(err => console.log(err));

            console.log(parsedPath);

        window.location.href = window.location.origin + '/' + parsedPath.replace(/ /g, "%20") + doc_name.trim().replace(/ /g, "%20") + '.md';
    }

    parsePath() {
        var path = window.location.pathname;
        path = path.substring(path.indexOf('/new_document') + 14, path.length);
        if (path.substring(path.length - 3, path.length) === '.md') {
            path = path.split('/');
            path.pop();
            path = path.join('/');
        }
        path = path.replace(/%20/g, ' ') + '/';
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
                    name="doc_name"
                    placeholder="Document Name"
                    onChange={this.handleChange} />
                <SimpleMDE
                    className="new_document_editor"
                    onChange={this.mdEditorChange}
                />
                <button
                    className="ui button"
                    onClick={this.saveNewDoc.bind(this)}
                    style={{ marginLeft: "1%" }}>
                    Save
                </button>
            </div>
        )
    }
}

export default NewDocument;