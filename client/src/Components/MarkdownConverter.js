import React, { Component } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import axios from 'axios';

class MarkdownConverter extends Component {
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

    getMdContents(filename) {
        fetch('/files/' + filename)
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

    static getDerivedStateFromProps(new_props, state) {
        if (state.fileName !== new_props.match.params.filename) {
            return {
                mdFile: "",
                htmlFile: "",
                fileName: new_props.match.params.filename,
                editing: false,
                updatedFile: "",
            };
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.fileName !== prevState.fileName) {
            this.getMdContents(this.props.match.params.filename);
        }
    }

    componentDidMount() {
        this.getMdContents(this.props.match.params.filename);
    }

    changeEditing() {
        if (this.state.editing) {
            this.setState({ editing: false })

            axios.post('/files/' + this.props.match.params.filename, { updatedFile: this.state.updatedFile })
                .then(res => console.log(res))
                .catch(err => console.log(err));

            window.location.reload();
        } else {
            this.setState({ editing: true })
        }
    }

    deleteFile() {
        if (window.confirm("Delete file? This cannot be undone.")) {
            axios.delete('/files/' + this.props.match.params.filename)
                .then(res => console.log(res))
                .catch(err => console.log(err));

            window.location.href = window.location.origin;
        }
    }

    handleChange = value => {
        this.setState({ updatedFile: value })
    }

    render() {
        if (this.state.editing) {
            return (
                <div>
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

export default MarkdownConverter;