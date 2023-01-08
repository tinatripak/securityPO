var request = require("request");
require('dotenv').config({path: __dirname + '/.env'})
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const PORT = 3000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SESSION_KEY = 'Authorization';

function post_user(res, email, first_name, last_name, full_name, nickname, password) {
  var post_user_options = {
      method: 'POST',
      url: `https://${process.env.DOMAIN}/api/v2/users`,
      headers: {
          'content-type': 'x-www-form-urlencoded',
          'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
      },
      form: {
          "email": email,
          "given_name": first_name,
          "family_name": last_name,
          "name": full_name,
          "nickname": nickname,
          "connection": "Username-Password-Authentication",
          "password": password
      }
  };
  
  request(post_user_options, function (error, response, body) {
    console.log('Статус створення юзера: '+ response.statusMessage)
    res.status(response.statusCode).send();
  });
}

app.use((req, res, next) => {
  let getToken = req.get(SESSION_KEY);
  if (getToken) {
    let token = JSON.parse(getToken)

    const date = new Date();
    date.setSeconds(date.getSeconds() + 5)

    if (token.expires < date) {
      var refresh_token_options = {
        method: 'POST',
        url: `https://${process.env.DOMAIN}/oauth/token`,
        headers: {
            'content-type': 'x-www-form-urlencoded',
            'Authorization': `Bearer ${process.env.USER_ACCESS_TOKEN}`
        },
        form: {
            audience: process.env.AUDIENCE,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            refresh_token: process.env.USER_REFRESH_TOKEN,
            grant_type: 'refresh_token'
        }
      };
      
      request(refresh_token_options, function (error, response, body) {
          if (error) throw new Error(error);
        
          const information = JSON.parse(body);
          process.env.USER_ACCESS_TOKEN = information.access_token
          console.log(`Refreshed Token: ${information.access_token}`);
          token = JSON.stringify({ token: information.access_token, expires: information.expires_in})
      });
    }
    req.token = token;
  }

  next();
});

app.get('/', (req, res) => {
  if (req.username) {
    return res.json({
      username: req.username,
      logout: 'http://localhost:3000/logout',
    });
  }
  res.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/register', (req, res) => {
  if (req.username) {
    return res.json({
      username: req.username,
      logout: 'http://localhost:3000/logout',
    });
  }
  res.sendFile(path.join(__dirname + '/register.html'));
});

app.post('/api/login', (req, res) => {
  const { login, password } = req.body;

  var login_options = {
    method: 'POST',
    url: `https://${process.env.DOMAIN}/oauth/token`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form:
    {
        audience: process.env.AUDIENCE,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        username: login,
        password: password,
        scope: 'offline_access',
        grant_type: 'password'
    }
};

  request(login_options, function (error, response, body) {
    if (error) {
      res.status(401).send();
      return
    }

    const statusCode = response.statusCode
    if (statusCode >= 200 && statusCode <= 299) {
      const information = JSON.parse(body);
      process.env.USER_ACCESS_TOKEN = information.access_token;
      process.env.USER_REFRESH_TOKEN = information.refresh_token;
      console.log(`access_token: ${information.access_token}`);
      console.log(`refresh_token: ${information.refresh_token}`);
      console.log(`expires_in: ${information.expires_in}`);
      res.json( { token: information.access_token, expires: information.expires_in} );
      return
    }

    res.status(statusCode).send();
  });

});

app.post('/api/register', (req, res) => {
  console.log(req.body)
  post_user(
    res, 
    req.body.email, 
    req.body.givenname, 
    req.body.familyname, 
    req.body.nickname, 
    req.body.name, 
    req.body.password
  )
  return;
});

var options = {
  method: 'POST',
  url: `https://${process.env.DOMAIN}/oauth/token`,
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  form:
  {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: process.env.AUDIENCE,
      grant_type: 'client_credentials'
  }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  const information = JSON.parse(body);
  console.log(information)
  process.env.ACCESS_TOKEN = information.access_token;
});

app.get('/logout', (req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});