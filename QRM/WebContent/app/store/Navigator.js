/**
 * 
 */

Ext.define('QRM.store.Navigator', {
    extend: 'Ext.data.TreeStore',
    fields: [{
        name: 'projectTitle',
        type: 'string'
    }, {
        name: 'displayTitle',
        type: 'string'
    }, {
        name: 'projectID',
        type: 'int'
    } ],
    proxy: {
        type: 'ajax',
        url: '/getUserProjectsJSON',
        reader: {
            type: 'json',
            root: 'projects'
        }
    },
    autoLoad:false,
    listeners: {
        load: function (store, node, records, successful) {
            QRM.app.getMainTabsController().switchProject(records[0].data.projectID, Ext.getCmp('cbDescendants').value);
            try {
                $$("qrmNavigatorID").getSelectionModel().select(records[0]);
            } catch (e) {
                alert(e.message);
            }
        }
    }, 
    findRecordByProjectID:function(projectID){
       return this.getRootNode().findChild('projectID', projectID, true);
    }
});
