/**
 * Client
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {    
    id: {
        type: 'integer',
        required: true
    },
    isServiceProvider: {
        type: 'boolean',
        required: true
    },
    firstName: {
        type: 'string',
        required: true
    },
    lastName: {
        type: 'string',
        required: true
    },
    address: {
        type: 'json',
        required: true
    },
    email: {
        type: 'email',
        required:true
    },
    password: {
        type: 'string',
        required: true
    }
  }

};
