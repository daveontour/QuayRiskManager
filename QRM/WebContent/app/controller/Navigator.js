/**
 * 
 */

Ext.define('QRM.controller.Navigator', {
   extend: 'Ext.app.Controller',
   views: ['NavigatorTreePanel' ],
   stores : ['Navigator'],
   init: function() {
      this.control(
            {'qrm-navigator-tree': {
               itemclick: function(s,r) {
                  QRM.app.getMainTabsController().switchProject(r.data.projectID, $$('cbDescendants').value);
               }
            }
            });
      this.control(
            {'#cbDescendants': {
               change: function(control, newValue, oldValue) {
                  QRM.app.getMainTabsController().switchProject(QRM.global.projectID, newValue);
               }
            }
            });
      }
});