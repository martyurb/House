import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { GithubLoginButton } from 'react-social-login-buttons';
import styled, { css } from 'styled-components'

const CLIENT_ID = 'e9513cff49b61b950053';

function App() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const codeParam = urlParams.get('code');
    console.log(codeParam);

    if (codeParam && (localStorage.getItem('accessToken') === null)) {
      async function getAccessToken() {
        await fetch('http://localhost:4000/user/accessToken?code=' + codeParam, {
          method: "GET"
        }).then((response) => {
          return response.json();
        }).then((data) => {
          console.log(data);
          if (data.access_token) {
            localStorage.setItem('accessToken', data.access_token);
            setRerender(!rerender);
          }
        })
      }
      getAccessToken();
    }
  }, [rerender]);

  async function getUserData() {
    await fetch('http://localhost:4000/user/data', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      setUserData(data);
    })
  };

  function githubLogin() {
    window.location.assign('https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID)
  }

const Container = styled.div`
  text-align: center;
`

const LoginForm = styled.div`
  max-width: 500px;
  min-width: 600px;
  max-height: 700px;
  min-height: 600px;
  width: 30%;
  height: 60%;
  margin: 300px auto;
  background-color: #FFFFFF;
  border-radius: 25px;
`
const HeaderTitle = styled.h1`
  text-align: center;
  font-family: 'open sans', sans-serif;
  padding: 4rem 0;
  margin: 0;
  font-size: 2rem;
`
const StyledAvatar = styled.img`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  display: inline-block;
`

function Avatar(props) {
  return (
    <div className="avatar">
      <StyledAvatar src={props.src} alt={props.alt} />
    </div>
  );
}

  return (
    <Container>
      <LoginForm>
        { localStorage.getItem('accessToken') ?
        <>
          <HeaderTitle>Welcome home</HeaderTitle>
          <button onClick={() => {localStorage.removeItem('accessToken'); setRerender(!rerender); }}>
            Log out
          </button>
          <button onClick={getUserData}>Get Data</button>
          {Object.keys(userData).length !== 0 ? 
          <>
           <h4>Hey there {userData.login}</h4>
           <Avatar src={userData.avatar_url} alt={userData.login} />
           <a href={userData.html_url} style={{'color': 'white'}}>Link to the Github profile</a>

            {userData.followers > 5 ? 
            
            :
            }
           {console.log(userData)}
          </>
        :
        <>
        </>
        }
        </>
        :
         <>
         <HeaderTitle>Sign In</HeaderTitle>
         <GithubLoginButton onClick={githubLogin} />
         </>
        }
      </LoginForm>
    </Container>
  );
}

export default App;
