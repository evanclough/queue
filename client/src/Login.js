import {useState} from 'react';

const Login = () => {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        return;
    }

    return(
          <div>
            <h1>Please Log In</h1>
            <form>
              <label>
                <p>Username</p>
                <input type="text" onChange={e => setUserName(e.target.value)} />
              </label>
              <label>
                <p>Password</p>
                <input type="password" />
              </label>
              <div>
              <input type="password" onChange={e => setPassword(e.target.value)} />
              </div>
            </form>
          </div>
        )
}

export default Login;