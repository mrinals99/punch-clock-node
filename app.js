var static = require('node-static');
var nforce = require('nforce');
var express = require('express');
var app = express();
var auth = require('basic-auth')



var sfuser    = process.env.SFUSER || process.env.NPM_PACKAGE_CONFIG_SFUSER;
var sfpass    = process.env.SFPASS || process.env.NPM_PACKAGE_CONFIG_SFPASS;
var adminuser = process.env.ADMIN || process.env.NPM_PACKAGE_CONFIG_ADMIN;
var amdinpass = process.env.PASS || process.env.NPM_PACKAGE_CONFIG_PASS;

var fieldName = process.env.FIELD_API_NAME || process.env.NPM_PACKAGE_CONFIG_FIELD_API_NAME;


var clientId = process.env.CLIENT_ID || process.env.NPM_PACKAGE_CONFIG_CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET || process.env.NPM_PACKAGE_CONFIG_CLIENT_SECRET;
var redirectUri = process.env.REDIRECT_URI || process.env.NPM_PACKAGE_CONFIG_REDIRECT_URI;

app.use(isAuthenticated)

app.use(express.static('public'));



app.get('/availableActions', function (req, res) {
    org.apexRest( {uri: 'punchclock', method: 'get',
        urlParams: {findByField: fieldName, fieldValue: req.query.pin}})
            .then( function( availableActions ){
                console.log('AvailableActions : ' + availableActions );
                res.end( availableActions );
            }).error(function(err){
                console.log('No Resource Found Or server error');
                res.end('NO');
            }).lastly(function(){
                res.end();
            });
});

app.get('/do',function(req,res){
    org.apexRest({uri: 'punchclock',method: 'post',
        body: JSON.stringify( {action: req.query.action, findByField:fieldName, fieldValue: req.query.pin})})
        .then(function(res){
            console.log('Done Action: ' + req.query.action);
            console.log('For: ' + req.query.pin);
        })
        .error(function(err){
            console.log('Server Error when ' + req.query.action);
            console.log(err);
            res.end('NO');
        })
        .lastly(function(){
            res.end();
        });
});

var org = nforce.createConnection({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: redirectUri,
  mode:'single'
});


org.authenticate({ username: sfuser, password: sfpass}, function(err, oauth) {
  if(err) {
    console.error('unable to authenticate to sfdc');
  } else {
    console.log('Cached Token: ' + org.oauth.access_token);
    var server = app.listen( process.env.PORT || 3000);
  }
});

function isAuthenticated(req, res, next) {
    var cred = auth(req);
    if (!cred || cred.name != adminuser || cred.pass != amdinpass){
        res.writeHead(401, {
            'WWW-Authenticate': 'Basic realm="kiosk"'
        })
        res.end()
    }else{
        next();
    }
}