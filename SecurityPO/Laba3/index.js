var request = require("request");
require('dotenv').config({path: __dirname + '/.env'})

function refresh_token() {
    var refresh_token_options = {
        method: 'POST',
        url: `https://${process.env.DOMAIN}/oauth/token`,
        headers: {
            'content-type': 'x-www-form-urlencoded',
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
        },
        form: {
            grant_type: 'refresh_token',
            audience: process.env.AUDIENCE,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            refresh_token: process.env.REFRESH_TOKEN
        }
    };
    
    request(refresh_token_options, function (error, response, body) {
        if (error) throw new Error(error);
        const info = JSON.parse(body);
        console.log(`Refreshed Token: ${info.access_token}`);
        fulfill_mainToken()
    });
}

function fulfill_mainToken() {
    var options_second = {
        method: 'POST',
        url: `https://${process.env.DOMAIN}/oauth/token`,
        headers: { 
            'content-type': 'application/x-www-form-urlencoded' 
        },
        form:{
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            audience: process.env.AUDIENCE,
            grant_type: 'client_credentials'
        }
    };
    
    request(options_second, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    
        const information = JSON.parse(body);
        process.env.ACCESS_TOKEN = information.access_token;
        update_password()
    });
}

function update_password() {
    console.log('тут')
    console.log(process.env.ACCESS_TOKEN)
    console.log(process.env.USER_ID)
    var update_password_options = {
        method: 'PATCH',
        url: `https://${process.env.DOMAIN}/api/v2/users/${process.env.USER_ID}`,
        headers: {
            'content-type': 'x-www-form-urlencoded',
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
        },
        form: {
            password: 'xA22dfdf45!jp'
        }
    };
    console.log(update_password_options.url)
    
    request(update_password_options, function (error, response, body) {
        if (error) throw new Error(error);
        const info = JSON.parse(body);
        console.log(info)
        console.log('Password updated successfully');
    });
}

var options = {
    method: 'POST',
    url: `https://${process.env.DOMAIN}/oauth/token`,
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form:
    {
        audience: process.env.AUDIENCE,
        grant_type: 'password',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        username: 'elena@gmail.com',
        password: 'xA%$HunQ5xd+Zrjp',
        scope: 'offline_access'
    }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    const info = JSON.parse(body);
  
    process.env.ACCESS_TOKEN = info.access_token;
    console.log(info.access_token)
    process.env.REFRESH_TOKEN = info.refresh_token;
    refresh_token()
});
