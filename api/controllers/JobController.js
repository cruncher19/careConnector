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
    //accepts service, description, and address(optional) as parameters
    create: function(req, res) {
        var service = req.param('service').toLowerCase();
        var description = req.param('description');
        var address = req.param('address');
        if( address === undefined )
            address = req.session.user.address;
        var clientId = req.session.user.id;
        var date = req.param('date');
        var clientName = req.session.user.firstName + " " + req.session.user.lastName;

        Job.create({
            service: service,
            description: description,
            clientId: clientId,
            clientName: clientName,
            address: address,
            date: date,
            completed: false
        }).done(function(err, job){
            if(err) {
                res.send(500,{error: "DB Error", err: err});
            } else {
                //if creation was successful redirect the user to the joblist
                res.send(job);
            }
        });
    },

    //function to assign a job to a serviceProvider
    //accepts job id as a parameter
    assign: function(req, res) {
        console.log("req received");
        if(req.session.user.isServiceProvider){
            var assignedServiceProviderId = req.session.user.id;
            var id = req.param('id');
    
            Job.find({id: id}).done(function(err, job){
                if(job.length === 0)
                    return res.send(500,{error: "Job not found in database"});
                else if(job[0].assignedServiceProviderId)
                    return res.send(500,{error: "Job is already assigned"});
            });
            
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
        }
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

    createJobPage: function(req, res) {
        res.view('JobController/createJob');
    },
    jobListPage: function(req, res) {
        Job.find().done(function(err, jobs){
            return res.view('JobController/jobList',{
                jobs: jobs
            });
        });
    },
    myJobsPage: function(req, res) {
        Job.find({assignedServiceProviderId: req.session.user.id}).done(
            function(err, jobs) {
                return res.view('JobController/myJobs',{
                    jobs: jobs
                });
            }
        );
    },

    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to JobController)
    */
    _config: {}
      
};
