/**
 * 
 */

Ext.define('QRM.controller.Messaging', {
   extend: 'Ext.app.Controller',
   init: function() {
     
      try {
         Ext.Ajax.request({
            url: "./getUserCoreRepositoryInfo",
            success: function(response){

               // Array of various sets of data
               var data = Ext.decode(response.responseText);
               
               // All the stakeholders
               allUsersMap = new Map();
               Ext.Array.each(data[0], function(user){
                  allUsersMap.put(user.stakeholderID, user);
               });

               // The logged on user
               QRM.global.loggedOnUser = data[5];
               QRM.global.userID = QRM.global.loggedOnUser.stakeholderID;
               startChatChannel();

               //All the quantifiable consequence types
               QRM.global.quantTypes = new Array();
               Ext.Array.each(data[4], function(type){
                  if (type.typeID == -1){
                     return;
                  }
                  QRM.global.quantTypes.push({"typeID":type.typeID, "description":type.description+" (" + type.units + ")" });
               });
               
         
               // The logon Message
               QRM.logonMessage = data[6];
               if (QRM.logonMessage.length > 0){
                  msg("Logon Message", QRM.logonMessage);
               }
            }

         });
      } catch (e){
         alert (e.message);
      }
   }
});