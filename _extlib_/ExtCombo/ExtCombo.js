if (!nexacro.ExtCombo) 
{
    // ==============================================================================
    // nexacro.ExtCombo
    // ==============================================================================
    nexacro.ExtCombo = function(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay)
    {
		this.usetype = "popup";
		this.popupurl = "Base::pExtCombo.xfdl";
		nexacro.Combo.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay);
    };
  
    var _pExtCombo = nexacro._createPrototype(nexacro.Combo);
    nexacro.ExtCombo.prototype = _pExtCombo;
    _pExtCombo._type = "Combo";
    _pExtCombo._type_name = "Combo";

	
//	_pExtCombo.on_notify_ondropdown = function (obj, e)
	_pExtCombo.on_drop_mobile_onclick = function (obj, e)
	{
		if (this.readonly)
			return false;

		if(this.usetype == "default") 
		{
			var ds = this._selectDataset(true);
			var idx = this.index;

			if (this._isPopupVisible()) {
				this._closePopup();
				this._setEditValue(this._getItemText(idx));
			}
			else {
				var comboedit = this.comboedit;
				if (comboedit) {
					comboedit.setSelect(0, 0);
				}

				if (this.type == "filter" || this.type == "filterlike") {
					this._clearFilteredDataset();
				}

				this._showPopup(ds, idx);
			}
		}
		else
		{
			if (this.on_fire_ondropdown(this) == false)
			{
				return;
			}
			// popup일경우 this.type에 상관없이 팝업으로 처리한다.
			this.showPopupList(obj,e);
		}

		return false;
	};
	
	_pExtCombo.on_edit_mobile_oneditclick = function (obj, e)
	{
		if (this.readonly)
			return false;

		if(this.usetype == "default") 
		{
			if (this._isPopupVisible())
			{
				this.popupwindow._closePopup();
			}
			else
			{
				if (this.type == "dropdown")
				{
					this._showPopup(this._innerdataset, this.index);
				}
			}
		}
		else
		{
			if (this.on_fire_ondropdown(this) == false)
			{
				return;
			}
			// popup일경우 this.type에 상관없이 팝업으로 처리한다.
			this.showPopupList(obj,e);

			if (this.oneditclick && this.oneditclick._has_handlers)
			{
				e.fromobject = this;
				var ret = this.oneditclick._fireEvent(this, e);
				return nexacro._toBoolean(ret);
			}
		}

		return false;
	};

//	_pExtCombo.on_notify_drop_mobile_onclick = function (obj, e) {
	_pExtCombo._on_drop_mobile_onclick = function (obj, e) {
		this.on_drop_mobile_onclick(obj, e);
	};
	
	_pExtCombo._on_edit_mobile_oneditclick = function (obj, e) {
		this.on_edit_mobile_oneditclick(obj, e);
	};
	
	_pExtCombo.showPopupList = function(obj,e)
	{
		// this.displayrowcount 는 무시한다. 모바일 화면에서 표현할수 있는 만큼 포현한다.
		// 화면 회전시 mainframe_onsize에서 _pExtCbo_폼으로 resize함수 호출하여 전환시 처리함

		// 기본 아이템 높이px
		var nUnitItemHeight = 70;
		
		var nLeft, nTop;
		var nWidth, nHeight;  
		var npHeight,npWidth;
		var nFullDispCount = -1;
		//if(sTitle == "" || sTitle == undefined) sTitle = "";

		if(!this.innerdataset) return;
		var ds = this._innerdataset;		
		if(!ds)
		{
			ds = application[this.innerdataset];
			if(!ds) return false;
		}

		if(ds.rowcount == 0) return false;
		
		npWidth = nexacro.getApplication().mainframe.getOffsetWidth();
		npHeight = nexacro.getApplication().mainframe.getOffsetHeight();

		
		// 버튼(60) + 20 + List + 20 + = 100
		nFullDispCount = parseInt((npHeight-100)/nUnitItemHeight);
		nHeight = nUnitItemHeight*(ds.rowcount>nFullDispCount?nFullDispCount:ds.rowcount)+100+4 ;
		nWidth = npWidth-100 ;
		
		nLeft = 50;
		nTop = (npHeight - nHeight)/2;

		if(this.popupurl == undefined) return false;
		if(this.combotitle == undefined) this.combotitle = "";
		var objOpener = this.parent;
		var sCallback = this.gfnViewComboListCallback; // 사용 안함 set_item()으로 기능추가
		var sUrl = this.popupurl;
		var objArgs = {data:ds, cdCol:this.codecolumn , nmCol:this.datacolumn , objcombo:this , sText:this.combotitle , nUnitItemHeight:nUnitItemHeight , nFullDispCount:nFullDispCount };
		var pid = "_pExtCbo_"+this.name;

		var cf = new ChildFrame;
	//	cf.init(pid, "absolute", nLeft, nTop, nWidth, nHeight, null, null, sUrl);
		cf.init(pid, nLeft, nTop, nWidth, nHeight, null, null, sUrl);
		cf.set_showtitlebar(false);
		cf.set_showstatusbar(false);
		//cf.style.set_titlebarheight(10);
		//cf.style.set_statusbarheight(10);
		cf.set_titletext("") ;
		cf.set_statustext(""); 
		cf.set_border("1 solid blue"); 
		cf.set_autosize(false);
		//cf.set_openalign("center middle");
		cf.set_dragmovetype("none");
		cf.set_background("white");
		cf.set_overlaycolor("rgba(0, 0, 0, 0.5)");
		
		cf._modaltype = "extcombo";	//milpaso adl의 onsize 처리를 위해 추가.

		cf.showModal(pid, nexacro.getApplication().mainframe, objArgs, objOpener);
	};
	// 팝업에서 combo.set_item()
	_pExtCombo.set_item = function(v)
	{
		var pre_index = this.index;
		var pre_value = this.value;
		var pre_text = this.text;
		var post_index = v.index;
		var post_value = v.value;
		var post_text = v.text;

		//                        (obj, preindex  , pretext  , prevalue  , postindex, posttext  , postvalue)
		if(pre_index != post_index && pre_value != post_value)
		{
			var rtn = this.on_fire_canitemchange(this, pre_index  , pre_text  , pre_value, post_index  , post_text, post_value);

			if(rtn) 
			{
				this._accessibility_index = this.index = post_index;
				this.text = post_text;
				
				this.set_value(post_value);			
				
				this.applyto_bindSource("value", post_value);
				this.on_fire_onitemchanged(this, pre_index  , pre_text  , pre_value, post_index  , post_text, post_value);
			}
		}

		nexacro.getPopupFrames()[v.frame].form.close();
	};


	//setter
    _pExtCombo.set_usetype = function(v)
	{
		if (v != this.usetype)
		{
			this.usetype = v;
		}		
	};
	
	_pExtCombo.set_popupurl = function(v)
	{
		if (v != this.popupurl)
		{
			this.popupurl = v;
		}		
	};
	
	_pExtCombo.set_combotitle = function(v)
	{
		if (v != this.combotitle)
		{
			this.combotitle = v;
		}		
	};
	
	_pExtCombo.set_itemopacity = function(v)
	{
		
	};


    delete _pExtCombo;
    
	_pExtCombo = null;
	
}
