
//Set the server path for the SVG->PNG conversion
Ext.draw.engine.ImageExporter.defaultUrl = "/exportSVGtoPNG";


//defined in qrm-common file

try {
   preInit();
} catch (e) {
   alert(e.message);
}

var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
var riskEditor;
var consequenceEditor;
var mitigationUpdateEditor;
var registerAuditWindow;
var  scheduleReviewWindow;
var attachmentForm;
var allUsersMap;
QRM.global.viewState = 'Detail';


Ext.define('Ext.ux.chart.Chart', {
   extend: 'Ext.chart.Chart',

   /**
    * @private Get initial insets; this method is intended to be overridden.
    */
   getInsets: function() {
      var me = this,
      insetPadding = me.insetPadding;

      return {
         top: insetPadding,
         right: insetPadding,
         bottom: insetPadding,
         left: insetPadding
      };
   },

   /**
    * @private Calculate insets.
    * This code is taken from Ext.chart.Chart.
    */
   calculateInsets: function() {
      var me = this,
      legend = me.legend,
      axes = me.axes,
      edges = ['top', 'right', 'bottom', 'left'],
      insets;

      function getAxis(edge) {
         var i = axes.findIndex('position', edge);
         return (i < 0) ? null : axes.getAt(i);
      }

      insets = me.getInsets();

      // Find the space needed by axes and legend as a positive inset from each edge
      for ( var i = 0, l = edges.length; i < l; i++ ) {
         var edge = edges[i];

         var isVertical = (edge === 'left' || edge === 'right'),
         axis = getAxis(edge),
         bbox;

         // Add legend size if it's on this edge
         if (legend !== false) {
            if (legend.position === edge) {
               bbox = legend.getBBox();
               insets[edge] += (isVertical ? bbox.width : bbox.height) + me.insetPadding;
            }
         }

         // Add axis size if there's one on this edge only if it has been
         //drawn before.
         if (axis && axis.bbox) {
            bbox = axis.bbox;
            insets[edge] += (isVertical ? bbox.width : bbox.height);
         }
      };

      return insets;
   },

   /**
    * @private Adjust the dimensions and positions of each axis and the chart body area after accounting
    * for the space taken up on each side by the axes and legend.
    * This code is taken from Ext.chart.Chart and refactored to provide better flexibility.
    */
   alignAxes: function() {
      var me = this,
      axesItems = me.axes.items,
      insets,
      chartBBox;

      insets = me.calculateInsets();

      // Build the chart bbox based on the collected inset values
      chartBBox = {
            x: insets.left,
            y: insets.top,
            width: me.curWidth - insets.left - insets.right,
            height: me.curHeight - insets.top - insets.bottom
      };
      me.chartBBox = chartBBox;

      // Go back through each axis and set its length and position based on the
      // corresponding edge of the chartBBox
      for ( var i = 0, l = axesItems.length; i < l; i++ ) {
         var axis = axesItems[i],
         pos = axis.position,
         isVertical = (pos === 'left' || pos === 'right');

         axis.x = (pos === 'right' ? chartBBox.x + chartBBox.width : chartBBox.x);
         axis.y = (pos === 'top' ? chartBBox.y : chartBBox.y + chartBBox.height);
         axis.width = (isVertical ? chartBBox.width : chartBBox.height);
         axis.length = (isVertical ? chartBBox.height : chartBBox.width);
      };
   }
});

Ext.define('Ext.ux.chart.TitleChart', {
   extend: 'Ext.ux.chart.Chart',
   alias:  'widget.titlechart',

   requires: [
              'Ext.draw.Sprite'
              ],

              /*
               * @cfg {String} Title text for this Chart.
               */
              title: false,

              /*
               * @cfg {String} Title location: 'left', 'top', 'right' or 'bottom'. Default is 'top'.
               */
              titleLocation: 'top',

              /*
               * @cfg {String} Font to be used for Title, e.g. '12px Helvetica, sans-serif'
               */
              titleFont: '12px Helvetica, sans-serif',

              /*
               * @cfg {Int} Padding between Chart border and title, in pixels. Default: 5.
               */
              titlePadding: 5,

              /*
               * @cfg {Int} Margin between title and inner space available for Chart, in pixels.
               * Defaults to 0.
               */
              titleMargin: 0,

              /**
               * @private
               * Overrides Chart.getInsets() to accommodate for title sprite.
               */
              getInsets: function() {
                 var me = this,
                 insets;

                 insets = me.callParent(arguments);

                 // By the time title Sprite is created, there's already a Surface
                 if ( me.titleSprite && me.title !== false ) {
                    var edge, titleBBox, offset;

                    edge      = me.titleLocation;
                    titleBBox = me.titleSprite.getBBox();
                    offset    = Math.round( titleBBox.height / 4 );

                    insets[edge] += edge == 'left' || edge == 'right' ? titleBBox.width
                          :                                     titleBBox.height
                          ;

                    // This gap is to avoid drawing title too close to actual chart body
                    insets[edge] += me.titlePadding + me.titleMargin;
                 };

                 return insets;
              },

              /**
               * @private
               * Creates Title sprite and adjusts its dimensions and position.
               */
              afterRender: function() {
                 var me = this,
                 sprite;

                 me.callParent(arguments);

                 // Draw the title
                 me.drawTitleSprite();
              },

              /**
               * @private Draws the title Sprite.
               */
              drawTitleSprite: function() {
                 var me = this;

                 // Check if we already have the Sprite
                 if ( me.titleSprite !== undefined ) {
                    me.titleSprite.hide(true);
                    me.titleSprite.destroy();
                    me.titleSprite = undefined;
                 };

                 if ( me.title === false ) {
                    return;
                 };

                 // Create but don't show yet
                 me.titleSprite = me.createTitleSprite();

                 // Finally, show the Sprite (but don't redraw it yet)
                 me.titleSprite.show(true);
              },

              /**
               * @private Re-draws the title Sprite, if necessary.
               */
              redrawTitleSprite: function() {
                 var me = this,
                 sprite = me.titleSprite,
                 attr;

                 if ( me.title === false && sprite ) {
                    me.titleSprite.hide(true);
                    me.titleSprite.destroy();
                    me.titleSprite = undefined;

                    return;
                 };

                 if ( !sprite ) {
                    return me.drawTitleSprite();
                 };

                 attr = me.getTitleAttributes(sprite);

                 sprite.setAttributes(attr, true);
              },

              /**
               * @private
               * This method instantiates a text Sprite to display Chart title.
               */
              createTitleSprite: function() {
                 var me = this,
                 sprite;

                 sprite = new Ext.draw.Sprite({
                    type: 'text',
                    text: me.title,
                    font: me.titleFont,
                    x:    0,            // Coordinates will be adjusted after
                    y:    0             // placing Sprite on Surface
                 });

                 // Sprite is going to be created after Chart is rendered,
                 // therefore Surface should be available already
                 me.surface.add(sprite);

                 // Draw the Sprite momentarily and then hide it again quickly.
                 sprite.redraw();
                 sprite.hide(true);

                 var attr = me.getTitleAttributes(sprite);

                 // We don't need to redraw the Sprite yet
                 sprite.setAttributes(attr, false);

                 return sprite;
              },

              /**
               * @private
               * Calculate title sprite coordinates.
               */
              getTitleAttributes: function(sprite) {
                 var me = this,
                 surface = me.surface,
                 width = surface.width,
                 height = surface.height,
                 chartBBox = me.chartBBox || { x: 0, y: 0 },
                 padding = me.titlePadding,
                 uround = Ext.util.Format.round,
                 titleBBox, titleX, titleY, titleHeight, titleWidth, offset,
                 x = 0, y = 0, degrees = 0;

                 titleBBox = sprite.getBBox();
                 titleX    = titleBBox.x;
                 titleY    = titleBBox.y;

                 // Normalize dimensions
                 if ( sprite.isVertical ) {
                    titleHeight = titleBBox.width;
                    titleWidth  = titleBBox.height;
                 }
                 else {
                    titleHeight = titleBBox.height;
                    titleWidth  = titleBBox.width;
                 };

                 offset = uround( titleHeight / 2, 0 );

                 switch ( me.titleLocation ) {
                    case 'top':
                       x = uround( (width - titleWidth) / 2, 0 );
                       y = titleHeight - offset + padding;
                       break;
                    case 'left':
                       x = offset + padding;
                       // Leftmost title needs to be centered vertically -- and rotated, too
                       y = uround( ((height - titleWidth) / 2) + titleWidth, 0 );
                       degrees = 270;
                       break;
                    case 'right':
                       x = width - offset - padding;
                       // Rightmost title needs to be centered vertically
                       y = uround( (height - titleWidth) / 2, 0 );
                       degrees = 90;
                       break;
                    case 'bottom':
                       x = uround( (width - titleWidth) / 2, 0 );
                       y = height - offset - padding;
                       break;
                    default:
                       x = 0;
                    y = 0;
                    sprite.hidden = true;   // XXX Shouldn't do this
                 };

                 sprite.isVertical = me.titleLocation == 'left' || me.titleLocation == 'right';

                 return {
                    x:      x,
                    y:      y,
                    width:  titleWidth,
                    height: titleHeight,
                    rotate: {
                       x:        x,
                       y:        y,
                       degrees: degrees
                    }
                 };
              },

              /**
               * Redraws all of the Chart components.
               */
              redraw: function() {
                 var me = this;

                 // Draw the title first so other elements can adjust their positions
                 me.redrawTitleSprite();

                 me.callParent(arguments);
              }
});


Ext.define('QRM.model.Person', {
   extend: 'Ext.data.Model',
   fields: [{
      name: 'name',
      type: 'string'
   }, {
      name: 'stakeholderID',
      type: 'int'
   }]
});
Ext.define('QRM.model.CategoryLite', {
   extend: 'Ext.data.Model',
   fields: [{
      name: 'description',
      type: 'string'
   }, {
      name: 'internalID',
      type: 'int'
   }]
});

Ext.define('QRM.model.RiskVeryLite', {
   extend: 'Ext.data.Model',
   fields: [{
      name: 'riskProjectCode',
      type: 'string'
   }, {
      name: 'title',
      type: 'string'
   }, {
      name: 'riskID',
      type: 'int'
   }]
});

Ext.define('Metric', {
   extend: 'Ext.data.Model',
   fields: ['element', 'data']
});

Ext.define('StatusComment',{
   extend: 'Ext.data.Model',
   fields: [

{
   name: "type",
   type: "string"
}, {
   name: "comment",
   type: "string"
}, {
   name: "personName",
   type: "string"
}, {
   name: "dateEntered",
   type: "date"
},{
   name: "attachmentURL",
   type: "string"
},{
   name: "url",
   type: "string"
},
{name:"internalID", type:"int"},
{name:"enteredByID", type:"int"},
{name:"approval", type:"boolean"},
{name:"review", type:"boolean"},
{name:"schedReview", type:"boolean"}
]
});

Ext.define('RiskControl',{
   extend: 'Ext.data.Model',
   fields: [

{ name: "control", type: "string"},
{ name: "effectiveness", type: "int"}, 
{ name: "contribution", type: "string"},
{name:"internalID", type:"int"}
]
});

Ext.define('MitUpdateComment',{
   extend: 'Ext.data.Model',
   fields: [

{ name: "description", type: "string"},
{ name: "personID", type: "int"}, 
{ name: "dateEntered", type: "date"},
{name:"internalID", type:"int"},
{name:"hostID", type:"int"}
]
});

Ext.define('MitigationStep',{
   extend: 'Ext.data.Model',
   fields: [

{ name: "description", type: "string"},
{ name: "personID", type: "int"}, 
{name:"internalID", type:"int"},
{name:"mitstepID", type:"int"},
{name:"estCost", type:"int"},
{name:"percentComplete", type:"int"},
{name:"updates", type:"string"},
{name:"endDate", type:"date"}
]
});

Ext.define('Attachment',{
   extend: 'Ext.data.Model',
   fields: [

{ name: "description", type: "string"},
{name:"internalID", type:"int"},
{name:"url", type:"string"},
{name:"attachmentURL", type:"string"}
]
});

var allRiskStakeholdersStore = Ext.create('Ext.data.Store', {
   fields: [

{
   name: "name",
   type: "string"
}, {
   name: "email",
   type: "string"
}, {
   name: "stakeholderID",
   type: "string"
}, {
   name: "compoundName",
   type: "string"
}          
],
proxy: {
   type: 'rest',
   url: '/getAllRiskStakeholdersDS',
   reader : {
      type : 'xml',
      root:'response',
      record:'record'
   }
}
});
var riskCommentStore = Ext.create('Ext.data.Store', {
   model:'StatusComment',
   proxy: {
      type: 'ajax',
      url: '/getRiskComments',
      reader : {
         type : 'json'
      }
   }
});
var store1 = Ext.create('Ext.data.Store', {
   model: 'Metric'
});
var store2 = Ext.create('Ext.data.Store', {
   model: 'Metric'
});
var store3 = Ext.create('Ext.data.Store', {
   model: 'Metric'
});
var store4 = Ext.create('Ext.data.Store', {
   model: 'Metric'
});

var metricOverviewData = Ext.create('Ext.data.Store', {
   fields: ['data', 'value'],
   proxy: {
      type: 'ajax',
      url: '/getOverviewData',
      reader: {
         type: 'json'
      }
   }
});

var sigEventsStore = Ext.create('Ext.data.Store', {
   fields: [{
      name: 'id',
      type: 'int'
   }, {
      name: 'internalID',
      type: 'int'
   }, {
      name: 'element',
      type: 'string'
   }, {
      name: 'name',
      type: 'string'
   }, {
      name: 'date',
      type: 'date'
   }],
   sorters: ['date'],
   groupField: 'element',
   proxy: {
      type: 'ajax',
      url: '/getWelcomeData',
      reader: {
         type: 'json'
      }
   }
});
var analysisToolStore = Ext.create('Ext.data.JsonStore', {
   fields: [{
      name: 'name',
      type: 'string'
   }],
   proxy: {
      type: 'rest',
      url: '/getAllStats',
      reader: {
         type: 'json'
      }
   }
});

var projectCategoryStore = Ext.create('Ext.data.ArrayStore', {
   model: 'QRM.model.CategoryLite'
});
var projectSecCategoryStore = Ext.create('Ext.data.ArrayStore', {
   model: 'QRM.model.CategoryLite'
});
var projectOwnersStore = Ext.create('Ext.data.ArrayStore', {
   model: 'QRM.model.Person'
});
var projectManagersStore = Ext.create('Ext.data.ArrayStore', {
   model: 'QRM.model.Person'
});
var consequenceStore = Ext.create('Ext.data.ArrayStore', {
   fields: [
            {name: 'description', type:'string'},     
            {name: 'type',   type: 'string'},
            {name: 'costDistributionType', type:'string'},
            {name: 'riskConsequenceProb', type:'string'},        
            {name: 'treated', type:'boolean'}
            ]
});
var quantTypeStore = Ext.create('Ext.data.ArrayStore', {
   fields: [
            {name: 'description', type:'string'},     
            {name: 'typeID',   type: 'int'}
            ]
});

var relMatRiskStore = Ext.create('Ext.data.ArrayStore', {
   model: 'QRM.model.RiskVeryLite',
   sorters: [{
      property: 'riskProjectCode',
      direction: 'ASC'
   }]
});

var objectiveStore = Ext.create('Ext.data.TreeStore', {
   autoLoad:false,
   fields: [{
      name: 'objective',
      type: 'string'
   }, {
      name: 'objectiveID',
      type: 'int'
   }],
   proxy: {
      type: 'ajax',
      url: '/getObjectiveTreeJSON',
      reader: {
         type: 'json',
         root: 'objectives'
      }
   }
});

var mitigationUpdateCommentStore =  Ext.create('Ext.data.Store', {
   autoLoad:false,
   model:'MitUpdateComment',
   proxy: {
      type: 'ajax',
      url: '/getMitUpdateComment',
      reader: {
         type: 'json',
      }
   }
});
var attachmentStore = Ext.create('Ext.data.Store', {
   model:'Attachment',
   proxy : {
      type : 'rest',
      url : '/getRiskAttachments',
      reader : {
         type : 'json',
      }
   }
});

QRM.global.ignoreResize = true;

Ext.application({
   requires: ['Ext.container.Viewport'],
   name: 'QRM',
   appFolder: 'app',
   models: ['LiteRisk'],
   stores: ['Explorer', 'Rank'],
   controllers: ['Explorer',
                 'Navigator',
                 'MainTabs',
                 'Messaging',
                 'Calender',
                 'Analysis',
                 'Report',
                 'RelMatrix',
                 'Incident',
                 'Overview',
                 'Ranking',
                 'SummaryRisks',
                 'RiskEditor',
                 'Review',
                 'ConsequenceWidget',
                 'AuditTab',
                 'AlwaysOnTop'],
                 launch: function () {
                    try {
                       Ext.create('Ext.container.Viewport', {
                          id: 'qrm-viewport',
                          listeners: {
                             resize: function (vieeport, width, height, oldWidth, oldHeight, eOpts) {
                                if (QRM.global.ignoreResize) {
                                   QRM.global.ignoreResize = false;
                                   return;
                                }
                                try {
                                   QRM.app.getMainTabsController().viewportResize();
                                } catch (e) {
                                   //
                                }
                             }
                          },
                          layout: {
                             type: 'border',
                             padding: '2 2 2 2'
                          },
                          items: [{
                             id: 'qrm-app-header',
                             xtype: 'panel',
                             region: 'north',
                             height: 40,
                             layout: {
                                type: 'vbox',
                                align: 'stretch',
                                pack: 'center',
                             },
                             style: {
                                background: 'white'
                             },
                             items: [{
                                html: "<span class='qrmMajorTitle'> Quay Risk Manager</span>",
                                border: false,
                                margin: "0 0 0 5"
                             }]
                          }, {
                             id: 'qrm-app-main',
                             xtype: 'container',
                             layout: 'border',
                             region: 'center',
                             items: [{
                                id: 'qrm-navigatorPanel',
                                title: 'Project Navigator',
                                region: 'west',
                                animCollapse: true,
                                width: 300,
                                minWidth: 200,
                                maxWidth: 350,
                                split: true,
                                collapsible: true,
                                layout: {
                                   type: 'accordion',
                                   animate: true
                                },
                                items: [
                                        Ext.create('Ext.panel.Panel', {
                                           title: 'Risk Projects',
                                           autoScroll: true,
                                           border: false,
                                           layout: 'border',
                                           iconCls: 'nav',
                                           items: [{
                                              xtype: 'qrm-navigator-tree',
                                              region: 'center'
                                           },
                                           Ext.create('Ext.form.Panel', {
                                              region: 'south',
                                              margin: 0,
                                              border: false,
                                              items: [{
                                                 boxLabel: 'Descendant Projects',
                                                 checked: false,
                                                 xtype: 'checkboxfield',
                                                 id: 'cbDescendants'
                                              }]
                                           })
                                           ]
                                        }), {
                                           title: 'Quick Reference',
                                           html: 'Quick Reference HTML',
                                           border: false,
                                           autoScroll: true,
                                           iconCls: 'settings'
                                        }]
                             }, {
                                id: 'qrm-mainTabsID',
                                xtype: 'qrm-maintabs',
                                region: 'center'
                             }]
                          }]
                       });
                    } catch (e) {
                       alert(e.message);
                    }
                    
                    tooltipProb = d3.select("body")
                    .append("div")
                    .style("position", "absolute")
                    .style("background-color", "rgba(255, 255, 255, 0.5)")
                    .style("z-index", "10")
                    .style("padding", "2")
                    .style("border-style", "solid")
                    .style("border-radius", "5px")
                    .style("border-width", "1px")
                    .style("border-color", "black")
                    .style("font-size", "18px")
                    .style("font-weight", "normal")
                    .style("visibility", "hidden")
                    .text("a simple tooltip"); 
                    }
});