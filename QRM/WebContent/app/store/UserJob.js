/**
 * 
 */

Ext.define('QRM.store.UserJob', {
   extend : 'Ext.data.Store',
   fields: [{
      name: 'jobID',
      type: 'int'
  }, {
      name: 'readyToExecute',
      type: 'boolean'
  }, {
      name: 'readyToCollect',
      type: 'boolean'
  }, {
      name: 'processing',
      type: 'boolean'
  }, {
      name: 'collected',
      type: 'boolean'
  }, {
      name: 'failed',
      type: 'boolean'
  }, {
      name: 'state',
      type: 'string'
  }, {
      name: 'userID',
      type: 'int'
  }, {
      name: 'projectID',
      type: 'int'
  }, {
      name: 'queuedDate',
      type: 'date'
  }, {
      name: 'executedDate',
      type: 'date'
  }, {
      name: 'collectedDate',
      type: 'date'
  }, {
      name: 'jobJdbcURL',
      type: 'string'
  }, {
      name: 'jobDescription',
      type: 'string'
  }, {
      name: 'jobType',
      type: 'string'
  }, {
      name: 'reportFormat',
      type: 'string'
  }, {
      name: 'downloadOnly',
      type: 'boolean'
  }],
   proxy: {
       type: 'ajax',
       url: '/getAllUserJobs',
       reader: {
           type: 'json'
       }
   }
});


