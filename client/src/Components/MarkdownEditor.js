import React, { Component } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";

class MarkdownEditor extends Component {


    componentDidMount() {

    }


    handleChange = value => {
        this.setState({ myFile: value })
        console.log(this.state.myFile);
    }

    render() {
        return (
            <div className="container container-narrow">
                <div className="page-header">
                    <SimpleMDE
                        value={this.props.initialValue}
                        onChange={this.handleChange}
                    />
                </div>
            </div>
        );
    }
}

export default MarkdownEditor;