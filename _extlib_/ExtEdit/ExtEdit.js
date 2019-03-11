if (!nexacro.ExtEdit) 
{
    // ==============================================================================
    // nexacro.ExtEdit
    // ==============================================================================	
	nexacro.ExtEdit = function(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay) 
	{		
		
		nexacro.Edit.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay);	
	};

	var _pExtEdit = nexacro._createPrototype(nexacro.Edit);
	nexacro.ExtEdit.prototype = _pExtEdit;
    _pExtEdit._type = "Edit";	
	_pExtEdit._type_name = "Edit";

	
	_pExtEdit._label_control = null;
	
	_pExtEdit.set_label = function (v)
	{
		if (v != this.label)
		{
			this.label = v;
			this.on_apply_label(this.label);
		}
	};

	_pExtEdit.on_apply_label = function (text)
	{
		var label_control = this._label_control;
		if (label_control) {
			label_control.set_text(text);

			//this._recalcLayout();
		}
	};
	
	_pExtEdit.on_create_contents = function ()
	{
		var control = this.getElement();
		if (control) {
			var input_elem;
			if (!this._onlydisplay) {
				input_elem = this._input_element = new nexacro.InputElement(control, "input");
				input_elem.setElementAutoSkip(this.autoskip);
				input_elem.setElementAutoSelect(this.autoselect);
				input_elem.setElementUseIme(this.useime);
				input_elem.setElementImeMode(this.imemode);
				input_elem.setElementReadonly(this.readonly);
				input_elem.setElementDisplayNullText(this.displaynulltext);
				input_elem.setElementMaxLength(this.maxlength);
				input_elem.setElementInputType(this.password ? "password" : this._keypad_type, this._imedisable);
			}
			else {
				input_elem = this._input_element = new nexacro.TextBoxElement(control, "input");
				input_elem.setElementVerticalAlign("middle");
			}

			input_elem.setElementPosition(this._getClientLeft(), this._getClientTop()+5);
			input_elem.setElementSize(this._getClientWidth(), this._getClientHeight()-5);
			input_elem.setElementTextDecoration(this._textdecoration);
			input_elem.setElementTextAlign(this.textAlign);
			input_elem.setElementPadding(this.padding);			

			// for label
			var label_control = this._label_control = new nexacro._IconText("label", 0, 0, 0, 0, null, null, null, null, null, null, this);
			
			label_control._setControl();
			label_control.textAlign = "left";
			label_control.verticalAlign = "top";
			label_control.set_font("normal 10pt/normal \"Arial\""); 
			label_control.set_color("#1565c0");			
			
			label_control.createComponent(true);
			
			this._undostack = new nexacro._EditUndoStack(this);
		}
	};

	_pExtEdit.on_created_contents = function (win) 
	{
		var input_elem = this._input_element;
		if (input_elem) {
			this.on_apply_value(this.value);

			input_elem.create(win);
			this.set_usesoftkeyboard(this.usesoftkeyboard, true);

			if (nexacro._isNull(this.value)) {
				this._changeUserStatus("nulltext", true);
			}
		}
		
		// for label	
		var label_control = this._label_control;
		if (label_control) 
		{			
			label_control.on_created(win);			
			
			label_control.on_apply_text(this.label);
		}
								
		this._recalcLayout();
		
	};

	_pExtEdit.on_destroy_contents = function () {
		var input_elem = this._input_element;
		if (input_elem) {
			input_elem.destroy();
			this._input_element = null;
		}
				
		var undostack = this._undostack;
		if (undostack) {
			undostack.destroy();
			this._undostack = null;
		}

		var inputfilterobj = this._inputfilter_obj;
		if (inputfilterobj) {
			this._inputfilter_obj = null;
		}

		var inputtypeobj = this._inputtype_obj;
		if (inputtypeobj) {
			this._inputtype_obj = null;
		}
		
		// for label		
		if (this._label_control) 
		{
			this._label_control.destroy();
			this._label_control = null;
		}
		
	};

	_pExtEdit.on_attach_contents_handle = function (win) {
		var input_elem = this._input_element;
		if (input_elem) {
			input_elem.attachHandle(win);

			if (nexacro._isNull(this.value)) {
				this._changeUserStatus("nulltext", true);
			}
		}
		
		// for label
		var label_control = this._label_control;
		if (label_control) 
		{
			label_control.attachHandle(win);
		}

	};
	
	
	_pExtEdit._recalcLayout = function () 
	{
		trace("_pExtEdit._recalcLayout()");
		
		var client_left = this._getClientLeft();
		var client_top = this._getClientTop();
		var client_height = this._getClientHeight();
		var client_width = this._getClientWidth();		
		
		/*
		var input_elem = this._input_element;
		if (input_elem) 
		{
			input_elem.setElementPosition(client_left, client_top + 5);
			input_elem.setElementSize(client_width, client_height - 5);
		}
		*/
		
		var label_control = this._label_control;
		if (label_control)
		{
			label_control.move(client_left, client_top, client_width, 20, null, null);
		}
		
	};
	
	
	_pExtEdit.on_change_containerRect = function (width, height) {
		var input_elem = this._input_element;
		if (input_elem) {
			input_elem.setElementSize(width, height);
		}
		
		this._recalcLayout();
	};

	_pExtEdit.on_change_containerPos = function (left, top) {
		var input_elem = this._input_element;
		if (input_elem) {
			input_elem.setElementPosition(left, top);
		}
		
		this._recalcLayout();
	};


	_pExtEdit.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY) 
	{
		trace("_pExtEdit.on_fire_onclick()");
		
		if (this.oneditclick && this.oneditclick._has_handlers)
		{
			var caretpos = this.getCaretPos();
			var clientXY = this._getClientXY(canvasX, canvasY);

			var evt = new nexacro.EditClickEventInfo(this, "oneditclick", caretpos, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[1], this, this);
			return this.oneditclick._fireEvent(this, evt);
		}

		// for label
		/*
		this._label_control.set_visible(true);
		

		if(this.label)
		{
			this.on_apply_label(this.label);			
		}
		else if (this.displaynulltext)	// && nexacro._isNull(this.value))
		{
			this.on_apply_label(this.displaynulltext);
		}
		*/
		
		return true;
	};	
	
	// for label
	_pExtEdit.on_fire_onkillfocus = function () 
	{		
		/*
		if(nexacro._isNull(this.value) || this.value == "")
		{
			this._label_control.set_visible(false);
		}
		*/
		/*
		if(nexacro.isSpace(this.value))
		{
			this.on_apply_value(this.displaynulltext);			
			
		}
		*/

	}
	
    delete _pExtEdit;	

	_pExtEdit = null;
}