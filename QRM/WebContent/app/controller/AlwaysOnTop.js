Ext.define('QRM.controller.AlwaysOnTop', {
	extend: 'Ext.app.Controller',

	alwaysOnTopManager: null,

	init: function() {
		this.control({
			'component{isFloating()}': {
				'render': function (component, options) {
					this.onComponentRender(component, options);
				}
			}
		});
		/* Uncommenting the code below makes sure that all Ext.window.MessageBoxes stay on top. */
		/*
		Ext.override(Ext.window.MessageBox, {
			alwaysOnTop: true
		});
		*/
		/* Uncommenting the code below makes sure that all form errormessages stay on top.
		   Necessary if you have a form inside a alwaysOnTop window. */
		/*
		Ext.override(Ext.tip.ToolTip, {
			alwaysOnTop: true
		});
		*/
	},

	onComponentRender: function (component, options) {
		if (component.alwaysOnTop) {
			if (!this.alwaysOnTopManager) {
				this.alwaysOnTopManager = Ext.create('Ext.ZIndexManager');
			}
			this.alwaysOnTopManager.register(component);
		}
		if (this.alwaysOnTopManager) {
			/* Making sure the alwaysOnTopManager always has the highest zseed */
			if (Ext.ZIndexManager.zBase > this.alwaysOnTopManager.zseed) {
				this.alwaysOnTopManager.zseed = this.alwaysOnTopManager.getNextZSeed();
			}
		}
	}

});

