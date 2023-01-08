var request = require("request");
require('dotenv').config({path: __dirname + '/.env'})
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { auth } = require('express-oauth2-jwt-bearer');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;
const SESSION_KEY = 'Authorization';

const checkJWT = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: `https://${process.env.DOMAIN}`,
});

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

app.get('/', (req, res) => {
  if (req.get(SESSION_KEY)) {
    return res.json({
      username: req.username,
      logout: 'http://localhost:3000/logout',
    });
  }
  res.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname + '/account.html'));
});

app.get('/api/account', checkJWT, (req, res) => {
  res.sendFile(path.join(__dirname + '/account.html'));
});

app.post('/api/login', (req, res) => {
  const { login, password } = req.body;

  var options = {
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
      grant_type: 'password',
      scope: 'offline_access'
    }
  };

  request(options, function (error, response, body) {
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
      res.json( { token: information.access_token, expires: information.expires_in, username: options.form.username} );
      return
    }
    res.status(statusCode).send();
  });
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

app.post('/api/register', (req, res) => {
  post_user(
    res, 
    req.body.email, 
    req.body.first_name,
    req.body.last_name,
    req.body.nickname, 
    req.body.full_name,
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
  console.log(`process.env.ACCESS_TOKEN: ${process.env.ACCESS_TOKEN}`);
});

app.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname + '/logout.html'));
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});