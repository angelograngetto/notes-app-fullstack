import React from 'react'
import Togglable from './Togglable'
import PropTypes from 'prop-types'

export default function LoginForm(props) {


    return (
        <Togglable buttonLabel='Show login'>
                <form onSubmit={props.handleSubmit}>
                <div>
                    <input 
                        type="text" 
                        name='Username'
                        value={props.username} 
                        placeholder='Username'
                        onChange={props.handleUsernameChange}
                        />
                </div>
                <div>
                    <input 
                        type="password" 
                        name='Password'
                        value={props.password} 
                        placeholder='Password'
                        onChange={props.handlePasswordChange}
                        />
                </div>
                <button>Login</button>
                </form>
      </Togglable>
    )
}

LoginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    username: PropTypes.string
}