Ext.define('Ext.Editor', {
    extend:  Ext.container.Container ,
    alias: 'widget.editor',
   layout: 'editor',
    allowBlur: true,
    revertInvalid: true,
    value : '',
    alignment: 'c-c?',
    offsets: [0, 0],
    shadow : 'frame',
    constrain : false,
    swallowKeys : true,
    completeOnEnter : true,
    cancelOnEsc : true,
    updateEl : false,
    focusOnToFront: false,
    hidden: true,
    baseCls: Ext.baseCSSPrefix + 'editor',

    initComponent : function() {
        var me = this,
            field = me.field = Ext.ComponentManager.create(me.field, 'textfield');

        Ext.apply(field, {
            inEditor: true,
            msgTarget: field.msgTarget == 'title' ? 'title' :  'qtip'
        });
        me.mon(field, {
            scope: me,
            blur: me.onFieldBlur,
            specialkey: me.onSpecialKey
        });

        if (field.grow) {
            me.mon(field, 'autosize', me.onFieldAutosize,  me, {delay: 1});
        }
        me.floating = {
            constrain: me.constrain
        };
        me.items = field;

        me.callParent(arguments);

        me.addEvents(
            'beforestartedit',
            'startedit',
            'beforecomplete',
            'complete',
            'canceledit',
            'specialkey'
        );
    },

    
    onFieldAutosize: function(){
        this.updateLayout();
    },

    
    afterRender : function(ct, position) {
        var me = this,
            field = me.field,
            inputEl = field.inputEl;

        me.callParent(arguments);

        
        if (inputEl) {
            inputEl.dom.name = '';
            if (me.swallowKeys) {
                inputEl.swallowEvent([
                    'keypress', 
                    'keydown'   
                ]);
            }
        }
    },

    
    onSpecialKey : function(field, event) {
        var me = this,
            key = event.getKey(),
            complete = me.completeOnEnter && key == event.ENTER,
            cancel = me.cancelOnEsc && key == event.ESC;

        if (complete || cancel) {
            event.stopEvent();
            
            
            Ext.defer(function() {
                if (complete) {
                    me.completeEdit();
                } else {
                    me.cancelEdit();
                }
                if (field.triggerBlur) {
                    field.triggerBlur(event);
                }
            }, 10);
        }

        me.fireEvent('specialkey', me, field, event);
    },

    
    startEdit : function(el, value) {
        var me = this,
            field = me.field;

        me.completeEdit();
        me.boundEl = Ext.get(el);
        value = Ext.isDefined(value) ? value : Ext.String.trim(me.boundEl.dom.innerText || me.boundEl.dom.innerHTML);

        if (!me.rendered) {
            
            
            
            
            if (me.ownerCt) {
                me.parentEl = me.ownerCt.el;
                me.parentEl.position();
            }
            me.render(me.parentEl || document.body);
        }

        if (me.fireEvent('beforestartedit', me, me.boundEl, value) !== false) {
            me.startValue = value;
            me.show();
            
            field.suspendEvents();
            field.reset();
            field.setValue(value);
            field.resumeEvents();
            me.realign(true);
            field.focus();
            if (field.autoSize) {
                field.autoSize();
            }
            me.editing = true;
        }
    },

    
    realign : function(autoSize) {
        var me = this;
        if (autoSize === true) {
            me.updateLayout();
        }
        me.alignTo(me.boundEl, me.alignment, me.offsets);
    },

    
    completeEdit : function(remainVisible) {
        var me = this,
            field = me.field,
            value;

        if (!me.editing) {
            return;
        }

        
        if (field.assertValue) {
            field.assertValue();
        }

        value = me.getValue();
        if (!field.isValid()) {
            if (me.revertInvalid !== false) {
                me.cancelEdit(remainVisible);
            }
            return;
        }

        if (String(value) === String(me.startValue) && me.ignoreNoChange) {
            me.hideEdit(remainVisible);
            return;
        }

        if (me.fireEvent('beforecomplete', me, value, me.startValue) !== false) {
            
            value = me.getValue();
            if (me.updateEl && me.boundEl) {
                me.boundEl.update(value);
            }
            me.hideEdit(remainVisible);
            me.fireEvent('complete', me, value, me.startValue);
        }
    },

    
    onShow : function() {
        var me = this;

        me.callParent(arguments);
        if (me.hideEl !== false) {
            me.boundEl.hide();
        }
        me.fireEvent('startedit', me, me.boundEl, me.startValue);
    },

    
    cancelEdit : function(remainVisible) {
        var me = this,
            startValue = me.startValue,
            field = me.field,
            value;

        if (me.editing) {
            value = me.getValue();
            
            field.suspendEvents();
            me.setValue(startValue);
            field.resumeEvents();
            me.hideEdit(remainVisible);
            me.fireEvent('canceledit', me, value, startValue);
        }
    },

    
    hideEdit: function(remainVisible) {
        if (remainVisible !== true) {
            this.editing = false;
            this.hide();
        }
    },

    
    onFieldBlur : function(field, e) {
        var me = this,
            target = Ext.Element.getActiveElement();

        
        if(me.allowBlur === true && me.editing && me.selectSameEditor !== true) {
            me.completeEdit();
        }

        
        if (Ext.fly(target).isFocusable() || target.getAttribute('tabIndex')) {
            target.focus();
        }
    },

    
    onHide : function() {
        var me = this,
            field = me.field;

        if (me.editing) {
            me.completeEdit();
            return;
        }
        
        
        if (field.hasFocus && field.triggerBlur) {
            field.triggerBlur();
        }
        if (field.collapse) {
            field.collapse();
        }

        
        if (me.hideEl !== false) {
            me.boundEl.show();
        }
        me.callParent(arguments);
    },

    
    setValue : function(value) {
        this.field.setValue(value);
    },

    
    getValue : function() {
        return this.field.getValue();
    },

    beforeDestroy : function() {
        var me = this;

        Ext.destroy(me.field);
        delete me.field;
        delete me.parentEl;
        delete me.boundEl;

        me.callParent(arguments);
    }
});

Ext.define('Ext.grid.CellEditor', {
   extend:  Ext.Editor ,
   constructor: function(config) {
       config = Ext.apply({}, config);
       
       if (config.field) {
           config.field.monitorTab = false;
       }
       this.callParent([config]);
   },
   
   
   onShow: function() {
       var me = this,
           innerCell = me.boundEl.first();

       if (innerCell) {
           if (me.isForTree) {
               innerCell = innerCell.child(me.treeNodeSelector);
           }
           innerCell.hide();
       }

       me.callParent(arguments);
   },

   
   onHide: function() {
       var me = this,
           innerCell = me.boundEl.first();

       if (innerCell) {
           if (me.isForTree) {
               innerCell = innerCell.child(me.treeNodeSelector);
           }
           innerCell.show();
       }
       
       me.callParent(arguments);
   },

   
   afterRender: function() {
       var me = this,
           field = me.field;

       me.callParent(arguments);
       if (field.isCheckbox) {
           field.mon(field.inputEl, {
               mousedown: me.onCheckBoxMouseDown,
               click: me.onCheckBoxClick,
               scope: me
           });
       }
   },
   
   
   onCheckBoxMouseDown: function() {
       this.completeEdit = Ext.emptyFn;
   },
   
   
   onCheckBoxClick: function() {
       delete this.completeEdit;
       this.field.focus(false, 10);
   },
   
   
   realign: function(autoSize) {
       var me = this,
           boundEl = me.boundEl,
           innerCell = boundEl.first(),
           width = boundEl.getWidth(),
           offsets = Ext.Array.clone(me.offsets),
           grid = me.grid,
           xOffset;

       if (me.isForTree) {
           
           
           xOffset = me.getTreeNodeOffset(innerCell);
           width -= Math.abs(xOffset);
           offsets[0] += xOffset;
       }

       if (grid.columnLines) {
           
           
           
           width -= boundEl.getBorderWidth('rl');
       }

       if (autoSize === true) {
           me.field.setWidth(width);
       }

       me.alignTo(innerCell, me.alignment, offsets);
   },

   
   getTreeNodeOffset: function(innerCell) {
       return innerCell.child(this.treeNodeSelector).getOffsetsTo(innerCell)[0];
   },
   
   onEditorTab: function(e){
       var field = this.field;
       if (field.onEditorTab) {
           field.onEditorTab(e);
       }
   },
   
   alignment: "l-l",
   hideEl : false,
   cls: Ext.baseCSSPrefix + 'small-editor ' +
       Ext.baseCSSPrefix + 'grid-editor ' + 
       Ext.baseCSSPrefix + 'grid-cell-editor',
   treeNodeSelector: '.' + Ext.baseCSSPrefix + 'tree-node-text',
   shim: false,
   shadow: false
});

Ext.define('Ext.grid.plugin.RowEditing', {
   extend:  Ext.grid.plugin.Editing ,
   alias: 'plugin.rowediting',
   lockableScope: 'top',
   editStyle: 'row',
   autoCancel: true,
   errorSummary: true,

   constructor: function() {
       var me = this;

       me.callParent(arguments);

       if (!me.clicksToMoveEditor) {
           me.clicksToMoveEditor = me.clicksToEdit;
       }

       me.autoCancel = !!me.autoCancel;
   },

   
   destroy: function() {
       Ext.destroy(this.editor);
       this.callParent(arguments);
   },

   
   startEdit: function(record, columnHeader) {
       var me = this,
           editor = me.getEditor(),
           context;

       if (editor.beforeEdit() !== false) {
           context = me.callParent(arguments);
           if (context) {
               me.context = context;

               
               if (me.lockingPartner) {
                   me.lockingPartner.cancelEdit();
               }
               editor.startEdit(context.record, context.column, context);
               return true;
           }
       }
       return false;
   },

   
   cancelEdit: function() {
       var me = this;

       if (me.editing) {
           me.getEditor().cancelEdit();
           me.callParent(arguments);
           return;
       }
       
       return true;
   },

   
   completeEdit: function() {
       var me = this;

       if (me.editing && me.validateEdit()) {
           me.editing = false;
           me.fireEvent('edit', me, me.context);
       }
   },

   
   validateEdit: function() {
       var me             = this,
           editor         = me.editor,
           context        = me.context,
           record         = context.record,
           newValues      = {},
           originalValues = {},
           editors        = editor.query('>[isFormField]'),
           e,
           eLen           = editors.length,
           name, item;

       for (e = 0; e < eLen; e++) {
           item = editors[e];
           name = item.name;

           newValues[name]      = item.getValue();
           originalValues[name] = record.get(name);
       }

       Ext.apply(context, {
           newValues      : newValues,
           originalValues : originalValues
       });

       return me.callParent(arguments) && me.getEditor().completeEdit();
   },

   
   getEditor: function() {
       var me = this;

       if (!me.editor) {
           me.editor = me.initEditor();
       }
       return me.editor;
   },

   
   initEditor: function() {
       return new Ext.grid.RowEditor(this.initEditorConfig());
   },
   
   initEditorConfig: function(){
       var me       = this,
           grid     = me.grid,
           view     = me.view,
           headerCt = grid.headerCt,
           btns     = ['saveBtnText', 'cancelBtnText', 'errorsText', 'dirtyText'],
           b,
           bLen     = btns.length,
           cfg      = {
               autoCancel: me.autoCancel,
               errorSummary: me.errorSummary,
               fields: headerCt.getGridColumns(),
               hidden: true,
               view: view,
               
               editingPlugin: me
           },
           item;

       for (b = 0; b < bLen; b++) {
           item = btns[b];

           if (Ext.isDefined(me[item])) {
               cfg[item] = me[item];
           }
       }
       return cfg;    
   },

   
   initEditTriggers: function() {
       var me = this,
           view = me.view,
           moveEditorEvent = me.clicksToMoveEditor === 1 ? 'click' : 'dblclick';

       me.callParent(arguments);

       if (me.clicksToMoveEditor !== me.clicksToEdit) {
           me.mon(view, 'cell' + moveEditorEvent, me.moveEditorByClick, me);
       }

       view.on({
           render: function() {
               me.mon(me.grid.headerCt, {
                   scope: me,
                   columnresize: me.onColumnResize,
                   columnhide: me.onColumnHide,
                   columnshow: me.onColumnShow
               });
           },
           single: true
       });
   },

   startEditByClick: function() {
       var me = this;
       if (!me.editing || me.clicksToMoveEditor === me.clicksToEdit) {
           me.callParent(arguments);
       }
   },

   moveEditorByClick: function() {
       var me = this;
       if (me.editing) {
           me.superclass.onCellClick.apply(me, arguments);
       }
   },
   
   
   onColumnAdd: function(ct, column) {
       if (column.isHeader) {
           var me = this,
               editor;

           me.initFieldAccessors(column);

           
           
           editor = me.editor;
           if (editor && editor.onColumnAdd) {
               editor.onColumnAdd(column);
           }
       }
   },

   
   onColumnRemove: function(ct, column) {
       if (column.isHeader) {
           var me = this,
               editor = me.getEditor();

           if (editor && editor.onColumnRemove) {
               editor.onColumnRemove(ct, column);
           }
           me.removeFieldAccessors(column);
       }
   },

   
   onColumnResize: function(ct, column, width) {
       if (column.isHeader) {
           var me = this,
               editor = me.getEditor();

           if (editor && editor.onColumnResize) {
               editor.onColumnResize(column, width);
           }
       }
   },

   
   onColumnHide: function(ct, column) {
       
       var me = this,
           editor = me.getEditor();

       if (editor && editor.onColumnHide) {
           editor.onColumnHide(column);
       }
   },

   
   onColumnShow: function(ct, column) {
       
       var me = this,
           editor = me.getEditor();

       if (editor && editor.onColumnShow) {
           editor.onColumnShow(column);
       }
   },

   
   onColumnMove: function(ct, column, fromIdx, toIdx) {
       
       var me = this,
           editor = me.getEditor();

       
       
       me.initFieldAccessors(column);

       if (editor && editor.onColumnMove) {
           
           
           editor.onColumnMove(column, fromIdx, toIdx);
       }
   },

   
   setColumnField: function(column, field) {
       var me = this,
           editor = me.getEditor();
           
       editor.removeField(column);
       me.callParent(arguments);
       me.getEditor().setField(column);
   }
});

