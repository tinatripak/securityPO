const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;
const SECRET = 'secret';
const EXPIRATION_TIME = '10s'
const SESSION_KEY = 'Authorization';
const users = [
  {
    login: 'Login',
    password: 'Password',
    username: 'Username',
  },
  {
    login: 'tinatripak',
    password: '123456',
    username: 'Kristina Tripak',
  }
];
function validateVerifyAndFindUser(sessionId){
  if (!sessionId) {
    return null;
  }
  const userByJwt = jwt.verify(sessionId, SECRET);
  if (userByJwt == null) {
    return null;
  }
  const user = users.find(x => x.login == userByJwt.login);
  if (user == null) {
    return null;
  }

  return user.username;
}

app.use((req, res, next) => {
  const sessionId = req.get(SESSION_KEY);
  req.username = validateVerifyAndFindUser(sessionId);
  
  req.sessionId = sessionId;

  next();
});

app.get('/', (req, res) => {
  if (req.username) {
    return res.json({
      username: req.username,
      logout: 'http://localhost:3000/logout',
    });
  }
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/api/login', (req, res) => {
  const { login, password } = req.body;

  const user = users.find(user => {
    if (user.login == login && user.password == password) {
      return true;
    }

    return false;
  });

  if (user) {
    const token = jwt.sign(
      {
        login: user.login
      },
      SECRET,
      {
        expiresIn : EXPIRATION_TIME
      }
    );
    console.log(token)
    res.json({ token });
    return;
  }
 
  res.status(401).send();
});

app.get('/logout', (req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});