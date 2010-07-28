/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * Experimental virtual list widget.
 *
 * EXPERIMENTAL!
 */
qx.Class.define("qx.ui.list.List",
{
  extend : qx.ui.virtual.core.Scroller,
  include : [qx.ui.list.core.MSelectionHandling],

  construct : function(model)
  {
    this.base(arguments, 0, 1, 20, 100);

    this._init();

    if(model != null) {
      this.initModel(model);
    } else {
      this.initModel(new qx.data.Array());
    }
  },

  properties :
  {
    // overridden
    appearance :
    {
      refine : true,
      init : "list"
    },

    // overridden
    focusable :
    {
      refine : true,
      init : true
    },
    
    model :
    {
      check : "qx.data.Array",
      apply : "_applyModel",
      event: "changeModel",
      nullable : false,
      deferredInit : true
    },
    
    itemHeight :
    {
      check : "Integer",
      init : 20,
      apply : "_applyRowHeight",
      themeable : true
    },
    
    labelPath :
    {
      check: "String",
      apply: "_applyLabelPath",
      nullable: true
    },

    iconPath :
    {
      check: "String",
      apply: "_applyIconPath",
      nullable: true
    },
    
    labelOptions :
    {
      apply: "_applyLabelOptions",
      nullable: true
    },
  
    iconOptions :
    {
      apply: "_applyIconOptions",
      nullable: true
    },
    
    delegate :
    {
      apply: "_applyDelegate",
      event: "changeDelegate",
      init: null,
      nullable: true
    }
  },

  members :
  {
    _background : null,

    _widgetCellProvider : null,

    _layer : null,
    
    _getDataFromRow : function(row) {
      var data = this.getModel().getItem(row);

      if (data != null) {
        return data;
      } else {
        return null;
      }
    },
    
    _init : function()
    {
      this.addListener("resize", this._onResize, this);
      this.setScrollbarX("off");

      this._initBackground();
      this._initLayer();
    },

    _initBackground : function()
    {
      this._background = new qx.ui.virtual.layer.Row(null, null);
      this.getPane().addLayer(this._background);
    },

    _initLayer : function()
    {
      this._widgetCellProvider = new qx.ui.list.core.WidgetCellProvider(this);
      this._layer = new qx.ui.virtual.layer.WidgetCell(this._widgetCellProvider);
      this.getPane().addLayer(this._layer);
    },

    _applyModel : function(value, old)
    {
      value.addListener("change", this._onModelChange, this);

      if (old != null) {
        old.removeListener("change", this._onModelChange, this);
      }

      this._widgetCellProvider.removeBindings();
      this.__updateRowCount();
    },

    _applyRowHeight : function(value, old) {
      this.getPane().getRowConfig().setDefaultItemSize(30);
    },
    
    _applyLabelPath : function(value, old) {
      this._widgetCellProvider.setLabelPath(value);
    },

    _applyIconPath : function(value, old) {
      this._widgetCellProvider.setIconPath(value);
    },
    
    _applyLabelOptions : function(value, old) {
      this._widgetCellProvider.setLabelOptions(value);
    },
    
    _applyIconOptions : function(value, old) {
      this._widgetCellProvider.setIconOptions(value);
    },
    
    _applyDelegate : function(value, old) {
      this._widgetCellProvider.setDelegate(value);
    },
    
    _onResize : function(e) {
      this.getPane().getColumnConfig().setItemSize(0, e.getData().width);
    },

    _onModelChange : function(e) {
      this.__updateRowCount();
    },

    __updateRowCount : function()
    {
      this.getPane().getRowConfig().setItemCount(this.getModel().getLength());
      this.getPane().fullUpdate();
    }
  },

  destruct : function()
  {
    this._background.dispose();
    this._widgetCellProvider.dispose();
    this._layer.dispose();
    this._background = null;
    this._widgetCellProvider = null;
    this._layer = null;
  }
});