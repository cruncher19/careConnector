/**
 * JobController
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

    //function to create a new job
    //accepts title, description, and address as parameters
    create: function(req, res) {
        var title = req.param('title');
        var description = req.param('description');
        var address = req.param('address');
        var clientId = req.session.user.id;

        Job.create({
            title: title,
            description: description,
            clientId: clientId,
            address: address,
            completed: false
        }).done(function(err, job){
            if(err)
                res.send(500,{error: "DB Error", err: err});
            else {
                //if creation was successful redirect the user to the joblist
                res.send(job);
            }
        });
    },

    //function to assign a job to a serviceProvider
    //accepts assignedServiceProviderId and job id as a parameter
    assign: function(req, res) {
        var assignedServiceProviderId = req.param('assignedServiceProviderId');
        var id = req.param('id');
        
        Job.update({
            id: id
        },{
            assignedServiceProviderId: assignedServiceProviderId
        }, function(err, job) {
            if(err) {
                res.send(500,{error: "Unable to find job in database", err: err});
            } else {
                //if update was successful redirect user to Job update sucessful
                res.send(job);
            }
        });
    },

    //function to mark a job as complete
    //accepts job id as a parameter
    markComplete: function(req, res) {
        var id = req.param('id');

        Job.update({
            id: id
        },{
            completed: true
        }, function(err, job) {
            if(err) {
                res.send(500,{error: "Unable to find job in database"});
            } else {
                //if update was successful notify user
                res.send(job);
            }
        });
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to JobController)
   */
  _config: {}

  
};
