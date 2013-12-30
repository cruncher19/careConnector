/**
 * ClientController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    //register is the action called when the user clicks the register button
    //javascript embedded in the page retrieves all of the values
    //and calls this register action using a post
    register: function(req, res) {

        //retrieving the input parameters from
        //the request variable
        var firstName = req.param('firstName');
        var lastName = req.param('lastName');
        var address = {
            street1: req.param('street1'),
            street2: req.param('street2'),
            city: req.param('city'),
            province: req.param('province'),
            country: req.param('country')
        };
        var email = req.param('email');
        var password = req.param('password');
        //initializing id
        var id = 0;

        //setting id equal to 1 more than the current maximum
        //id in the database
        Client.find().exec(function(err, clients){
            if(err){
                res.send(500,{error: "Client table not in DB"});
            } else {
                id = clients.length + 1;
            }
        });

        //checking of the email address has already
        //been registered
        Client.findByEmail(email,function(err,client){
            if(err){
                res.send(500,{error: "DB Error",err: err});
            //send out an error message if the email has already
            //been registered
            } else if(client.length != 0){
                res.send(400,{error: "Email already used",client: client});
            } else {
                //hashing the password so it isn't
                //stored in plaintext in the database
                var hasher = require('password-hash');
                password = hasher.generate(password);

                //creating the client
                Client.create({
                    id: id,
                    //service provider flag is necessary
                    //because client and service provider use
                    //the same session variable, need to differentiate
                    isServiceProvider: false,
                    firstName: firstName,
                    lastName: lastName,
                    address: address,
                    email: email,
                    password: password
                }).done(function(err,client){
                    if(err){
                        res.send(500,{error: "DB Error"});
                    } else {
                        //if creation was successful set the current
                        //session user equal to the newly created
                        //serviceProvider
                        req.session.user = client;
                        res.send(client);
                    }
                });
            }
        });
    },
    login: function(req, res) {
        var email = req.param('email');
        var password = req.param('password');

        Client.findByEmail(email, function(err, client) {
            console.log(client[0]);
            if( err ) {
                res.send(500,{error: "DB Error", err: err});
            } else if(client.length === 0) {
                res.send(400,{error: "Email or password incorrect"});
            } else {
                var hasher = require('password-hash');

                if(hasher.verify(password, client[0].password)) {
                    req.session.user = client[0];
                    res.send(client[0]);
                } else {
                    res.send(400,{error: "Email or password incorrect"});
                }
            }
        });
    },
    test: function(req, res) {
        res.send(req.session.user);
    },

    //methods to serve pages
    registrationPage: function(req, res) {
        res.view('ClientController/registrationPage');
    },
    loginPage: function(req, res) {
        res.view('ClientController/loginPage');
    },
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ClientController)
   */
  _config: {}

  
};
