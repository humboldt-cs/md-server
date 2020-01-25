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
        console.log(this.state.newFile);
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

        // Send new name and doc to server
        axios.post('/files/new_file', { filename: this.state.doc_name, newFile: this.state.newFile })
            .then(res => console.log(res))
            .catch(err => console.log(err));

        window.location.href = "http://localhost:3000/" + this.state.doc_name;
    }

    render() {
        var width = this.state.width;
        var height = this.state.height

        return (
            <div>
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