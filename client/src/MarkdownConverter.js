import React, { Component } from 'react';
import './App.css';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import axios from 'axios';

class MarkdownConverter extends Component {
    state = {
        mdFile: "",
        htmlFile: "",
        fileNames: [],
        editing: false,
        updatedFile: ""
    }


    componentDidMount() {
        fetch('/' + this.props.match.params.filename)
            .then((res) => res.text())
            .then((text) => {
                var fileContents = text;
                this.setState({ mdFile: fileContents });
                this.setState({ htmlFile: fileContents });

                var showdown = require('showdown'),
                    converter = new showdown.Converter(),
                    markdown = fileContents,
                    html = converter.makeHtml(markdown);

                this.setState({ htmlFile: html });
            })
            .catch(err => {
                console.log(err);
            });
    }

    changeEditing() {
        if (this.state.editing) {
            this.setState({ editing: false })

            axios.post('/' + this.props.match.params.filename, { updatedFile: this.state.updatedFile })
                .then(res => console.log(res))
                .catch(err => console.log(err));

            window.location.href = "http://localhost:3000/" + this.props.match.params.filename;
        } else {
            this.setState({ editing: true })
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
                    <div style={{ marginLeft: "1%", marginRight: "25%" }}>
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