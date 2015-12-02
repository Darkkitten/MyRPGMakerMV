//=============================================================================
// CmdInp.js
//=============================================================================

/*:
 * @plugindesc v0.0.1d Enables a Command Input system.
 * @author Darkkitten
 *
 * @param Text Variable
 * @desc Variable that the Text is saved to.
 * Default 1
 * @default 1
 *
 * @param Max Characters
 * @desc Maximum number of Characters you can input.
 * Default 12
 * @default 12
 *
 * @param Default Text
 * @desc The Default name of the Input Window. 
   Place "" around the text.
 * default Default Text
 * @default Default Text
 *
 * @help Use Plugin Command: enter_text <VariableNumber> <MaxCharacters> <Default Text>
 * Example: enter_text 12 18 Hello World
 * or you can just use enter_text   to use the default settings.
 *
 */

var Darkkitten = Darkkitten || {};

Darkkitten.Parameters = PluginManager.parameters('CmdInp');
Darkkitten.Parm = Darkkitten.Parm || {};


		//Get Plugin Command Variables if not default.
        var getInformation_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function(command, args) {
                getInformation_pluginCommand.call(this, command, args);
                if (command === "enter_text") {
                    if(args != null){
						Darkkitten.Parm.Text_Variable = args[0];
						Darkkitten.Parm.Max_Characters = args[1];
			 			for (i = 2; i < args.length; i++){
							Darkkitten.Parm.Default_Text = args[i];
						}
						console.log("\n Variable: "+Darkkitten.Parm.Text_Variable + " Max Characters: " +Darkkitten.Parm.Max_Characters + " Menu Text: " + Darkkitten.Parm.Default_Text + " Argument  Length: " + args.length + "\n" );
						SceneManager.push(Scene_Input);
					}
					else {
						Darkkitten.Parm.Text_Variable = Darkkitten.Parameters['Text Variable'];
						Darkkitten.Parm.Max_Characters = Darkkitten.Parameters['Max Characters'];
						Darkkitten.Parm.Default_Text = Darkkitten.Parameters['Default Text'];
						console.log("\n Variable: "+Darkkitten.Parm.Text_Variable + " Max Characters: " +Darkkitten.Parm.Max_Characters + " Menu Text: " + Darkkitten.Parm.Default_Text + "\n" );
						SceneManager.push(Scene_Input);
					};
                };
        };

(function(){

  
})();

//-----------------------------------------------------------------------------
// Window_TextEdit
//
// The window for editing Text input screen.

function Window_TextEdit() {
    this.initialize.apply(this, arguments);
}

Window_TextEdit.prototype = Object.create(Window_Base.prototype);
Window_TextEdit.prototype.constructor = Window_TextEdit;

Window_TextEdit.prototype.initialize = function(defaultText, maxLength) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    var y = (Graphics.boxHeight - (height + this.fittingHeight(9) + 8)) / 2;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._varId = Darkkitten.Parm.Text_Variable;
    if (this.defaultText == null)
    {
		this._defaultText = ' ';
	}
	else {
    this._defaultText = $gameVariables[this._varId];
    }
    this._text = this._defaultText.slice(0, this.maxLength);
    this._index = this._text.length;
    this.deactivate();
    this.refresh();
};

Window_TextEdit.prototype.windowWidth = function() {
    return 480;
};

Window_TextEdit.prototype.windowHeight = function() {
    return this.fittingHeight(4);
};

Window_TextEdit.prototype.text = function() {
    return this._text;
};

Window_TextEdit.prototype.restoreDefault = function() {
    this._text = this._defaultText;
    this._index = this._text.length;
    this.refresh();
    return this._text.length > 0;
};

Window_TextEdit.prototype.add = function(ch) {
	this._maxLength = Darkkitten.Parm.Max_Characters;
    if (this._index < this._maxLength) {
        this._text += ch;
        this._index++;
        this.refresh();
        return true;
    } else {
        return false;
    }
};

Window_TextEdit.prototype.back = function() {
    if (this._index > 0) {
        this._index--;
        this._text = this._text.slice(0, this._index);
        this.refresh();
        return true;
    } else {
        return false;
    }
};

Window_TextEdit.prototype.BlahTextWidth = function(){
	return Darkkitten.Parm.Max_Characters;
}


Window_TextEdit.prototype.charWidth = function() {
    var text = $gameSystem.isJapanese() ? '\uff21' : 'A';
    return this.textWidth(text);
};

Window_TextEdit.prototype.left = function() {
	    this._maxLength = Darkkitten.Parm.Max_Characters;
		var textCenter = (this.contentsWidth() + this.BlahTextWidth()) / 2;
		var textWidth = (this._maxLength + 1) * this.charWidth();
    	return Math.min(textCenter - textWidth / 2, this.contentsWidth() - textWidth);
};

Window_TextEdit.prototype.itemRect = function(index) {
    return {
        x: this.left() + index * this.charWidth(),
        y: 36,
        width: this.charWidth(),
        height: this.lineHeight()
    };
};

Window_TextEdit.prototype.underlineRect = function(index) {
    var rect = this.itemRect(index);
    rect.x++;
    rect.y += rect.height;
    rect.width -= 2;
    rect.height = 2;
    return rect;
};

Window_TextEdit.prototype.underlineColor = function() {
    return this.normalColor();
};

Window_TextEdit.prototype.drawUnderline = function(index) {
    var rect = this.underlineRect(index);
    var color = this.underlineColor();
    this.contents.paintOpacity = 48;
    this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this.contents.paintOpacity = 255;
    //console.log("\n Underline Index: "+index);
};

Window_TextEdit.prototype.drawChar = function(index) {
    var rect = this.itemRect(index);

    this.resetTextColor();
    this.drawText(this._text[index] || '', rect.x -= 1, rect.y , rect.width +=4);
    console.log("\n drawChar: "+this._text + " Index: " + index+"\n");
};
//Window_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
//    this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
//};

Window_TextEdit.prototype.refresh = function() {
    this.contents.clear();
    
	this.WindowHeader = Darkkitten.Parm.Default_Text;
	this._maxLength = Darkkitten.Parm.Max_Characters;
	
	this.drawTextEx(this.WindowHeader, this.WindowHeader.length, this.lineHeight());
    for (var i = 0; i < this._maxLength; i++) {
    	this.drawUnderline(i);
    }
    
    for (var j = 0; j < this._text.length; j++) {
        this.drawChar(j);
    }
    
    var rect = this.itemRect(this._index);
    //this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    this.setCursorRect(this.itemRect(this._index));
    this._varId = Darkkitten.Parm.Text_Variable;
   // console.log("\n Var i: "+ i +" Var j: "+ j +" _maxLength: "+this._maxLength+" Text: "+this._text+" Index: "+this._index + " Game Variable Contents: " +$gameVariables.value(this._varId)+ "\n");
};

//------------------------------------------------------------------------
//Scene_Input
// Creates the Input Scene..
//------------------------------------------------------------------------

function Scene_Input() {
    this.initialize.apply(this, arguments);
}

Scene_Input.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Input.prototype.constructor = Scene_Input;

Scene_Input.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    
};

Scene_Input.prototype.prepare = function() {
	this._varId = Darkkitten.Parm.Text_Variable;
	this.maxLength = Darkkitten.Parm.Max_Characters;
	this._defaultText = $gameVariables[Darkkitten.Parm.Text_Variable];
	//this.WindowHeader = Darkkitten.Parm.Default_Text.replace(/"/g,"");
	this.WindowHeader = Darkkitten.Parm.Default_Text;
//  console.log("\n MAx Length: " + maxLength + "\n")
};

Scene_Input.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.CEW();
    this.CIW();
};

Scene_Input.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._editTextWindow.refresh();
};

Scene_Input.prototype.CEW = function() {
	  this._varId = Darkkitten.Parm.Text_Variable;
	  this._defaultText = $gameVariables[this._varId];
	  this._maxLength = Darkkitten.Parm.Max_Characters;
	  this._editTextWindow = new Window_TextEdit(this._defaultText, this._maxLength);
	  this._editTextWindow.Active;
	  this.addWindow(this._editTextWindow);
};

Scene_Input.prototype.CIW = function() {
	  this._inputTextWindow = new Window_NameInput(this._editTextWindow);
	  this._inputTextWindow.isEnabled = true;
	  this._inputTextWindow.setHandler('ok', this.onThatsJustFine.bind(this));
	  this.addWindow(this._inputTextWindow);

};

Scene_Input.prototype.onThatsJustFine = function() {
	this._varId = Darkkitten.Parm.Text_Variable;
	$gameVariables.setValue(this._varId, this._editTextWindow.text());
	console.log("\Final Text:" + this._editTextWindow.text());
	this.popScene();
};


