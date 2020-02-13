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
        console.log('running')
        e.preventDefault();

        axios.post('/users/login', { email: this.state.email, password: this.state.password })
            .then(res => {
                if (res.data !== 'auth failure') {
                    localStorage.token = res.data;
                    window.location.reload();
                }else{
                    alert('Login failed');
                }
            })
            .catch(err => console.log(err));
    }
    
    submitNewUser(e) {
        e.preventDefault();

        axios.post('/users/newUser', { email: this.state.email, password: this.state.password })
            .then(res => {
                if (res.data === 'account created') {
                    this.setState({ newUser: false });
                    window.location.reload();
                }else{
                    alert('Could not create new user. An account may already be associated with the given email address.');
                }
            })
            .catch(err => console.log(err));
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
                        <button className='newUserButton' onClick={() => this.setState({ newUser: true })} type='button'>Create Account</button>
                    </form>
                </MuiThemeProvider>
                </div>
            )
        }else{
            return (
                <div className='loginFrame'>
                <MuiThemeProvider theme={theme}>
                <form className="loginForm" onSubmit={this.submitNewUser} >
                    <h2>New Account</h2>
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
                    <button className='newUserButton' onClick={() => this.setState({ newUser: false })} type='button'>Existing User</button>
                </form>
                </MuiThemeProvider>
                </div>
            )
        }
    }
}

export default Login;