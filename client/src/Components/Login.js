import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newUser: false,
            email: '',
            password: '',
        }

        this.submitLogin = this.submitLogin.bind(this);
        this.submitNewUser = this.submitNewUser.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    submitLogin(e) {
        e.preventDefault();
        console.log(this.state);
    }
    
    submitNewUser(e) {
        e.preventDefault();
        console.log(this.state);
    }

    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        console.log(this.state);
    }

    render() {
        // Styles
        const theme = createMuiTheme({
            palette: {
                primary: { main: '#9B9B9B' }, // gray
                secondary: { main: '#000000' }
            },
        });

        if (this.state.newUser === false) {
            return (
                <div className='loginFrame'>
                <MuiThemeProvider theme={theme}>
                    <form className="loginForm" onSubmit={this.submitLogin} >
                        <h2>Login</h2>
                        <TextField 
                            id='email' 
                            name='email'
                            label='email' 
                            onChange={e => this.changeHandler(e)} 
                        />
                        <TextField 
                            id='password'
                            name='password'
                            label='password'
                            type='password' 
                            onChange={e => this.changeHandler(e)} 
                        />
                        <br />
                        <button className='loginButton' type='submit'>Login</button>
                        <hr />
                        <button className='newUserButton' onClick={() => this.setState({ newUser: true })}>Create Account</button>
                    </form>
                </MuiThemeProvider>
                </div>
            )
        }else{
            return (
                <div className='loginFrame'>
                <form className="loginForm" onSubmit={this.submitNewUser} >
                    <h2>Create an account</h2>
                    <TextField 
                        id='email'
                        name='email'
                        label='email'
                        onChange={e => this.changeHandler(e)} 
                    />
                    <TextField 
                        id='password'
                        name='password'
                        label='password'
                        type='password'
                        onChange={e => this.changeHandler(e)}
                    />
                    <br />
                    <button className='loginButton' type='submit'>Create Account</button>
                    <hr />
                    <button className='newUserButton' onClick={() => this.setState({ newUser: false })}>Existing User</button>
                </form>
                </div>
            )
        }
    }
}

export default Login;