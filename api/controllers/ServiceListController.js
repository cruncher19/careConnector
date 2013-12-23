/**
 * ServiceListController
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
    //function that updates or creates the service list
    update: function(req, res) {
        var id = req.session.user.id;
        var nursing = req.param('nursing');
        console.log(typeof id + ' ' + typeof nursing);

        ServiceList.findById(id,function(err,serviceList){
            if(err){
                res.send(500,{error: "Error querying ServiceList table in DB", err: err});
            //if a list doesn't exist for the id, create one
            } else if(serviceList.length === 0){
                ServiceList.create({
                    serviceProviderId: id,
                    nursing: nursing === 'true'
                }).done(function(err, serviceList){
                    if(err) {
                        res.send(500,{error: "DB Error", err: err});
                    } else {
                        res.send(serviceList);
                    }
                });
            //if a serviceList already exists, update it
            } else if(serviceList.length === 1){
                ServiceList.update({
                    id: id
                },{
                    nursing: nursing
                },function(err, serviceList){
                    res.send(serviceList);
                });
            //throw an error if there are multiple lists for one id
            } else {
                res.send(500,{error: "Multiple serviceLists found for single id"});
            }
        });
    },
    configPage: function(req, res) {
        res.view('ServiceListController/listConfigurationPage');
    },

    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to ServiceListController)
    */
    _config: {}

  
};
