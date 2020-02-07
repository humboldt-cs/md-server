import React, { Component } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import axios from 'axios';

class MarkdownViewer extends Component {
    constructor(props) {
        super(props);

        this.getMdContents = this.getMdContents.bind(this);
        this.changeEditing = this.changeEditing.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    state = {
        mdFile: "",
        htmlFile: "",
        fileName: "",
        editing: false,
        updatedFile: ""
    }

    componentDidMount() {
        var filename = window.location.href.split('/').pop().replace('%20', ' ');
        if (filename.substring(filename.length - 3, filename.length) === '.md') {
            this.setState({ fileName: filename });
            this.getMdContents(filename);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.fileName !== prevState.fileName) {
            this.getMdContents(this.state.fileName);
        }
    }

    getMdContents(filename) {
        fetch('/files/fetchFiles/' + window.location.pathname)
            .then((res) => res.text())
            .then((text) => {
                var fileContents = text;
                var showdown = require('showdown');
                var converter = new showdown.Converter();
                var markdown = fileContents;
                var html = converter.makeHtml(markdown);

                this.setState(
                    {
                        mdFile: fileContents,
                        fileName: filename,
                        htmlFile: html
                    }
                );
            })
            .catch(err => {
                console.log(err);
            });
    }

    changeEditing() {
        if (this.state.editing) {
            this.setState({ editing: false })

            axios.post('/files/' + this.state.fileName, { updatedFile: this.state.updatedFile, pathname: window.location.pathname.replace(/%20/g, ' ') })
                .then(res => console.log(res))
                .catch(err => console.log(err));

            window.location.reload();
        } else {
            this.setState({ editing: true })
        }
    }

    deleteFile() {
        var filename = this.state.fileName;

        if (window.confirm("Delete file? This cannot be undone.")) {
            console.log("5 realz? " + window.location.pathname);
            axios.delete('/files' + window.location.pathname)
                .then(res => console.log(res))
                .catch(err => console.log(err));

            // Removes filename from URL and reloads at directory it was in
            window.location.href = window.location.href.replace(filename.replace(/ /g, '%20'), '');
        }
    }

    handleChange = value => {
        this.setState({ updatedFile: value })
    }

    render() {
        if (this.state.editing) {
            return (
                <div className='editing_panel'>
                    <button
                        className="ui button"
                        onClick={this.changeEditing.bind(this)}
                        style={{ marginLeft: "1%", marginBottom: "1%" }}>
                        Save
                    </button>
                    <button
                        className="delete ui button"
                        onClick={this.deleteFile}>
                        Delete
                    </button>
                    <div style={{ marginLeft: "1%", marginRight: "1%" }}>
                        <div className="container container-narrow">
                            <div className="page-header">
                                <SimpleMDE
                                    value={this.state.mdFile}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <button
                        className="ui button"
                        onClick={this.changeEditing.bind(this)}
                        style={{ margin: "1%" }}>
                        Edit Markdown
                    </button>
                    <div
                        dangerouslySetInnerHTML={{ __html: this.state.htmlFile }}
                        style={{ margin: 20, marginTop: 0, marginBottom: 0 }}
                    />
                </div>
            )
        }
    }
}

export default MarkdownViewer;