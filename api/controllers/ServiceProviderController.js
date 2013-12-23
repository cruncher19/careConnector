/**
 * ServiceProviderController
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
        var serviceRadius = req.param('serviceRadius');
        var email = req.param('email');
        var password = req.param('password');
        //initializing id
        var id = 0;

        //setting id equal to 1 more than the current maximum
        //id in the database
        ServiceProvider.find().exec(function(err, serviceProviders){
            if(err){
                res.send(500,{error: "Client table not in DB"});
            } else {
                console.log(serviceProviders.length);
                id = serviceProviders.length + 1;
            }
        });

        //checking of the email address has already
        //been registered
        ServiceProvider.findByEmail(email,function(err,client){
            if(err){
                res.send(500,{error: "DB Error",err: err});
            //send out an error message if the email has already
            //been registered
            } else if(client.length !== 0){
                res.send(400,{error: "Email already used"});
            } else {
                //hashing the password so it isn't
                //stored in plaintext in the database
                var hasher = require('password-hash');
                password = hasher.generate(password);

                //creating the service provider
                ServiceProvider.create({
                    id: id,
                    isServiceProvider: true,
                    firstName: firstName,
                    lastName: lastName,
                    address: address,
                    email: email,
                    password: password,
                    serviceRadius: serviceRadius
                }).done(function(err, serviceProvider){
                    if(err){
                        res.send(500,{error: "DB Error", err: err});
                    } else {
                        //if creation was sucessful set the current
                        //session user equal to the newly created
                        //serviceProvider
                        req.session.user = serviceProvider;
                        res.send(serviceProvider);
                        //redirect the serviceProvider to the service
                        //list configuration page
                        res.redirect('/servicelist/configuration');
                    }
                });
            }
        });
    },

    //methods to serve pages
    registrationPage: function(req, res) {
        res.view('ServiceProviderController/registrationPage');
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ServiceProviderController)
   */
  _config: {}

  
};
