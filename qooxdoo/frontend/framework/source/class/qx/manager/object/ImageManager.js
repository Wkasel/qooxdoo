/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)

************************************************************************ */

/* ************************************************************************

#module(ui_core)
#optional(qx.ui.form.Button)
#embed(qx.icontheme/16/apps/preferences-desktop-theme.png)

************************************************************************ */

/** This singleton manage the global image path (prefix) and allowes themed icons. */
qx.Class.define("qx.manager.object.ImageManager",
{
  type : "singleton",
  extend : qx.manager.object.ObjectManager,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    // Themes
    this._iconThemes = {};
    this._widgetThemes = {};

    // Contains known image sources (all of them, if loaded or not)
    // The value is a number which represents the number of image
    // instances which use this source
    this._sources = {};

    // Change event connection to AliasManager
    qx.manager.object.AliasManager.getInstance().addEventListener("change", this._onaliaschange, this);
  },




  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /*
    ---------------------------------------------------------------------------
      PROPERTIES
    ---------------------------------------------------------------------------
    */

    iconTheme :
    {
      _legacy  : true,
      type     : "object",
      instance : "qx.renderer.theme.IconTheme"
    },

    widgetTheme :
    {
      _legacy  : true,
      type     : "object",
      instance : "qx.renderer.theme.WidgetTheme"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      REGISTRATION
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @param vThemeClass {var} TODOC
     * @return {void} 
     */
    registerIconTheme : function(vThemeClass)
    {
      this._iconThemes[vThemeClass.classname] = vThemeClass;

      if (vThemeClass.classname == qx.core.Setting.get("qx.iconTheme")) {
        this.setIconTheme(vThemeClass.getInstance());
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @param vThemeClass {var} TODOC
     * @return {void} 
     */
    registerWidgetTheme : function(vThemeClass)
    {
      this._widgetThemes[vThemeClass.classname] = vThemeClass;

      if (vThemeClass.classname == qx.core.Setting.get("qx.widgetTheme")) {
        this.setWidgetTheme(vThemeClass.getInstance());
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @param vId {var} TODOC
     * @return {void} 
     */
    setIconThemeById : function(vId) {
      this.setIconTheme(this._iconThemes[vId].getInstance());
    },


    /**
     * TODOC
     *
     * @type member
     * @param vId {var} TODOC
     * @return {void} 
     */
    setWidgetThemeById : function(vId) {
      this.setWidgetTheme(this._widgetThemes[vId].getInstance());
    },




    /*
    ---------------------------------------------------------------------------
      EVENTS
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @return {void} 
     */
    _onaliaschange : function() {
      this._updateImages();
    },




    /*
    ---------------------------------------------------------------------------
      MODIFIERS
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @param propValue {var} Current value
     * @param propOldValue {var} Previous value
     * @param propData {var} Property configuration map
     * @return {Boolean} TODOC
     */
    _modifyIconTheme : function(propValue, propOldValue, propData)
    {
      propValue ? qx.manager.object.AliasManager.getInstance().add("icon", propValue.uri) : qx.manager.object.AliasManager.getInstance().remove("icon");
      return true;
    },


    /**
     * TODOC
     *
     * @type member
     * @param propValue {var} Current value
     * @param propOldValue {var} Previous value
     * @param propData {var} Property configuration map
     * @return {Boolean} TODOC
     */
    _modifyWidgetTheme : function(propValue, propOldValue, propData)
    {
      propValue ? qx.manager.object.AliasManager.getInstance().add("widget", propValue.uri) : qx.manager.object.AliasManager.getInstance().remove("widget");
      return true;
    },




    /*
    ---------------------------------------------------------------------------
      PRELOAD API
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    getPreloadImageList : function()
    {
      var vPreload = {};

      for (var vSource in this._sources)
      {
        if (this._sources[vSource]) {
          vPreload[vSource] = true;
        }
      }

      return vPreload;
    },


    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    getPostPreloadImageList : function()
    {
      var vPreload = {};

      for (var vSource in this._sources)
      {
        if (!this._sources[vSource]) {
          vPreload[vSource] = true;
        }
      }

      return vPreload;
    },




    /*
    ---------------------------------------------------------------------------
      INTERNAL HELPER
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @return {Boolean} TODOC
     */
    _updateImages : function()
    {
      var vAll = this.getAll();
      var vPreMgr = qx.manager.object.ImagePreloaderManager.getInstance();
      var vAliasMgr = qx.manager.object.AliasManager.getInstance();
      var vObject;

      // Recreate preloader of affected images
      for (var vHashCode in vAll)
      {
        vObject = vAll[vHashCode];
        vObject.setPreloader(vPreMgr.create(vAliasMgr.resolvePath(vObject.getSource())));
      }

      return true;
    },




    /*
    ---------------------------------------------------------------------------
      UTILITY
    ---------------------------------------------------------------------------
    */

    // TODO: rename to createIconThemeList
    /**
     * TODOC
     *
     * @type member
     * @param vParent {var} TODOC
     * @param xCor {var} TODOC
     * @param yCor {var} TODOC
     * @return {void} 
     */
    createThemeList : function(vParent, xCor, yCor)
    {
      var vButton;
      var vThemes = this._iconThemes;
      var vIcon = "icon/16/apps/preferences-desktop-theme.png";
      var vPrefix = "Icon Theme: ";
      var vEvent = "execute";

      for (var vId in vThemes)
      {
        var vObj = vThemes[vId].getInstance();
        var vButton = new qx.ui.form.Button(vPrefix + vObj.getTitle(), vIcon);

        vButton.setLocation(xCor, yCor);
        vButton.addEventListener(vEvent, new Function("qx.manager.object.ImageManager.getInstance().setIconThemeById('" + vId + "')"));

        vParent.add(vButton);

        yCor += 30;
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @param vPath {var} TODOC
     * @return {void} 
     */
    preload : function(vPath) {
      qx.manager.object.ImagePreloaderManager.getInstance().create(qx.manager.object.AliasManager.getInstance().resolvePath(vPath));
    },




    /*
    ---------------------------------------------------------------------------
      DISPOSER
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @return {void | var} TODOC
     */
    dispose : function()
    {
      if (this.getDisposed()) {
        return;
      }

      // Change event connection to AliasManager
      qx.manager.object.AliasManager.getInstance().removeEventListener("change", this._onaliaschange, this);

      // Delete counter field
      this._sources = null;

      // Themes
      this._iconThemes = null;
      this._widgetThemes = null;

      return this.base(arguments);
    }
  },




  /*
  *****************************************************************************
     SETTINGS
  *****************************************************************************
  */

  settings :
  {
    /*
      Make sure to select an icon theme that is compatible to the license you
      chose to receive the qooxdoo code under. For more information, please
      see the LICENSE file in the project's top-level directory.
     */

    "qx.iconTheme"   : "qx.theme.icon.Nuvola",

    "qx.widgetTheme" : "qx.theme.widget.Windows"
  }
});
