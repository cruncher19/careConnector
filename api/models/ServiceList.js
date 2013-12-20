/**
 * ServiceList
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    serviceProviderId: {
        type: 'integer',
        required: true
    },
    nurse: 'boolean'
  }
};
