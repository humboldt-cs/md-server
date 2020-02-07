import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FolderIcon from '../resources/folder.png';
import MarkdownIcon from '../resources/markdown.png';

class FileTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.headCells = [
            {
                title: 'Name',
                field: 'name',
                render: rowData => 
                        <div>
                            <img 
                                alt='file indicator'
                                src={rowData.isDirectory ? FolderIcon : MarkdownIcon} 
                                style={{height: 35, float: 'left', marginRight: '20px' }}
                            />
                            <div style={{padding: '10px'}}>{rowData.name} </div>
                        </div>,


                cellStyle: { minWidth: 250, width: '50%' },
                customSort: (a, b) => {
                    if (a.name === null) {
                        return -1;
                    } else if (b.name === null) {
                        return 1;
                    } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
                        return 1;
                    } else {
                        return -1;
                    }
                },
            },
            {
                id: 'file-modified',
                field: 'modifiedDate',
                title: 'Modified',
                render: rowData => new Date(rowData.modifiedDate).toDateString(),
                customSort: (a, b) => {
                    if (a.modifiedDate === null) {
                        return -1;
                    } else if (b.modifiedDate === null) {
                        return 1;
                    } else if (a.modifiedDate > b.modifiedDate) {
                        return 1;
                    } else {
                        return -1;
                    }
                },
            },
            {
                id: 'file-created',
                field: 'creationDate',
                title: 'Created',
                render: rowData => new Date(rowData.creationDate).toDateString(),
                customSort: (a, b) => {
                    if (a.creationDate === null) {
                        return -1;
                    } else if (b.creationDate === null) {
                        return 1;
                    } else if (a.creationDate > b.creationDate) {
                        return 1;
                    } else {
                        return -1;
                    }
                },
            },
        ];
    }

    render() {
        // Styles
        const theme = createMuiTheme({
            palette: {
                primary: { main: '#9B9B9B' }, // gray
                secondary: { main: '#000000' }
            },

        });

        return (
            <MuiThemeProvider theme={theme}>
                <MaterialTable
                    columns={this.headCells}
                    title={window.location.pathname.replace('//', '/').replace('%20', ' ')}
                    className={"table"}
                    data={this.props.fileData}
                    onRowClick={(event, rowData) => {
                        var path = window.location.pathname;
                        if (path.length === 1) {
                            path = ''; // remove extra slash
                        }
                        window.location.href = window.location.origin + path + '/' + rowData.name;
                    }}
                    
                    options={{
                        padding: 'dense',
                        pageSize: 15,
                        pageSizeOptions: [15, 25, 50, 100],
                        sorting: true,
                    }}
                />
            </MuiThemeProvider>
        );
    }
}

export default FileTable;