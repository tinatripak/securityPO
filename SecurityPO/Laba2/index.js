var request = require("request");
// 1

// var options_first = { 
//     method: 'POST',
//     url: 'https://kpi.eu.auth0.com/oauth/token',
//     headers: { 'content-type': 'application/x-www-form-urlencoded' },
//     form: {
//         audience: 'https://kpi.eu.auth0.com/api/v2/',
//         grant_type: 'client_credentials',
//         client_id: 'JIvCO5c2IBHlAe2patn6l6q5H35qxti0',
//         client_secret: 'ZRF8Op0tWM36p1_hxXTU-B0K_Gq_-eAVtlrQpY24CasYiDmcXBhNS6IJMNcz1EgB'
//     } 
// };

// request(options_first, function (error, response, body) {
//     if (error) throw new Error(error);
  
//     // console.log(body[1]);
//     const information = JSON.parse(body);
//     // console.log(information)
//     post_user_first(information.access_token)
// });

// // //2

// function post_user_first(token) {
//     var user_options = {
//         method: 'POST',
//         url: 'https://kpi.eu.auth0.com/api/v2/users',
//         headers: {
//             'content-type': 'x-www-form-urlencoded',
//             'Authorization': `Bearer ${token}`
//         },
//         form: {
//             "email": "elentrip1@gmail.com",
//             "given_name": "Helen",
//             "family_name": "Tri",
//             "name": "Helen Tri",
//             "nickname": "helentrip1",
//             "connection": "Username-Password-Authentication",
//             "password": "TInsdjVCZckvR2k241dI$"
//         }
//     };
    
//     request(user_options, function (error, response, body) {
//         if (error) throw new Error(error);
//         console.log(body);
//     });
// }

// // 3
// require('dotenv').config({path: __dirname + '/.env'})

// function post_user_second(token) {
//     var user_options = {
//         method: 'POST',
//         url: `https://${process.env.DOMAIN}/api/v2/users`,
//         headers: {
//             'content-type': 'x-www-form-urlencoded',
//             'Authorization': `Bearer ${token}`
//         },
//         form: {
//             "email": "elentrip1@gmail.com",
//             "given_name": "Helen",
//             "family_name": "Tri",
//             "name": "Helen Tri",
//             "nickname": "helentrip1",
//             "connection": "Username-Password-Authentication",
//             "password": "TInsdjVCZckvR2k241dI$"
//         }
//     };
    
//     request(user_options, function (error, response, body) {
//         if (error) throw new Error(error);
//         console.log(body);
//     });
// }

// var options_second = {
//     method: 'POST',
//     url: `https://${process.env.DOMAIN}/oauth/token`,
//     headers: { 
//         'content-type': 'application/x-www-form-urlencoded' 
//     },
//     form:{
//         client_id: process.env.CLIENT_ID,
//         client_secret: process.env.CLIENT_SECRET,
//         audience: process.env.AUDIENCE,
//         grant_type: 'client_credentials'
//     }
// };

// request(options_second, function (error, response, body) {
//     if (error) throw new Error(error);
//     console.log(body);

//     const information = JSON.parse(body);
//     process.env.ACCESS_TOKEN = information.access_token;
//     post_user_second(information.access_token)
// });
