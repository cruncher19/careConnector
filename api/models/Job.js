/**
 * Job
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    service: {
        type: 'string',
        required: true
    },
    description: {
        type: 'string'
    },
    clientId: {
        type: 'integer',
        required: true
    },
    clientName: {
        type: 'string',
        required: true
    },
    date: {
        type: 'date',
        required: true
    },
    assignedServiceProviderId: {
        type: 'integer'
    },
    address: {
        type: 'json',
        required: true
    },
    completed: {
        type: 'boolean',
        required: true
    }
  }

};
