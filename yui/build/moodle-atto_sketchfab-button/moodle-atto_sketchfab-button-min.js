YUI.add("moodle-atto_sketchfab-button",function(e,t){var n="atto_sketchfab",r={URLINPUT:"atto_sketchfab_urlentry"},i={URLINPUT:"."+r.URLINPUT},s='<form class="atto_form"><label for="{{elementid}}_atto_sketchfab_urlentry">{{get_string "enterurl" component}}</label><input class="fullwidth {{COMPONENTCSS.URLINPUT}}" type="url" id="{{elementid}}_atto_sketchfab_urlentry" size="32"/><br/><div class="mdl-align"><br/><button class="submit" type="submit">{{get_string "insertmodel" component}}</button></div></form>',o="sketchfab.com",u='<a href="{{{ mdl.assethref }}}" class="atto_sketchfab-embed-thumb"><img src="{{{ thumbnail_url }}}" /></a><div class="atto_sketchfab-embed-desc">{{{get_string "modeldesc" mdl.component modelname=mdl.asset author=mdl.profile sketchfab=mdl.svc }}}</div>',a="placeholder",f="atto_sketchfab-embed-",l='<div class="atto_sketchfab-embed '+a+'" id="{{ id }}">'+"</div>",c="warning",h=3e3;e.namespace("M.atto_sketchfab").Button=e.Base.create("button",e.M.editor_atto.EditorPlugin,[],{_currentSelection:null,_content:null,initializer:function(){this.addButton({icon:"e/insert_sketchfab",iconComponent:n,callback:this._displayDialogue})},_displayDialogue:function(){this._currentSelection=this.get("host").getSelection();if(this._currentSelection===!1)return;var e=this.getDialogue({headerContent:M.util.get_string("insertmodel",n),focusAfterHide:!0,focusOnShowSelector:i.URLINPUT});e.set("bodyContent",this._getDialogueContent()).show()},_getDialogueContent:function(){var t=e.Handlebars.compile(s);return this._content=e.Node.create(t({component:n,elementid:this.get("host").get("elementid"),CSS:r})),this._content.one(".submit").on("click",this._setModel,this),this._content},_getNextAvailableId:function(){var t="",n=!1,r=0;while(!n)t=f+r++,n=e.one("#"+t)===null;return t},_setModel:function(t){t.preventDefault(),this.getDialogue({focusAfterHide:null}).hide();var r=t.currentTarget.ancestor(".atto_form"),s=r.one(i.URLINPUT).get("value"),f=this.get("host"),p=this,d=s!==""&&s.indexOf(o)>-1;if(d){var v=s.split("/"),m=v[v.length-1],g=this._getNextAvailableId(),y=e.Handlebars.compile(l),b=e.Node.create(y({id:g})).get("outerHTML");f.setSelection(p._currentSelection),f.insertContentAtFocusPoint(b);var w=e.one("#"+g);e.io(M.cfg.wwwroot+"/lib/editor/atto/plugins/sketchfab/api.php?modelid="+m,{on:{success:function(t,r){var i=e.JSON.parse(r.responseText);i.mdl={},i.mdl.component=n;var s="?utm_source=oembed&utm_medium=embed&utm_campaign="+m;i.mdl.assethref="http://www.sketchfab.com/models/"+m+s,i.mdl.asset='<a href="'+i.mdl.assethref+'" target="_blank">'+i.title+"</a>",i.mdl.profile='<a href="'+i.author_url+s+'" target="_blank">'+i.author_name+"</a>",i.mdl.svc='<a href="http://www.sketchfab.com'+s+'" target="_blank">'+i.provider_name+"</a>";var o=e.Handlebars.compile(u),f=e.Node.create(o(i));w.removeClass(a),f.appendTo(w),p.markUpdated()},failure:function(t,n){var r=e.JSON.parse(n.responseText);w.remove(!0),p.markUpdated(),f===null&&(f=p.get("host")),f.showMessage(M.util.get_string("error","webservice",r.detail.__all__[0]),c,h)}}})}}})},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});
