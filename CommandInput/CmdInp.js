//=============================================================================
// CmdInp.js
//=============================================================================

/*:
 * @plugindesc v0.9.0 Enables a Command Input system.
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
 * @param Default Header
 * @desc The Default name of the Input Window. 
   Place "" around the text.
 * default This is a Imput Window
 * @default This is a Input Window
 *
 * @help Use Plugin Command: enter_text <VariableNumber> <MaxCharacters> <Default Text>
 * Example: enter_text 12 18 Hello World
 * or you can just use enter_text   to use the default settings.
 *
 */


(function(){
	var Darkkitten = Darkkitten || {};
	Darkkitten.Parameters = PluginManager.parameters('CmdInp');
	Darkkitten.Parm = Darkkitten.Parm || {};

	//Get Plugin Command Variables if not default.
    var getInformation_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        getInformation_pluginCommand.call(this, command, args);
        if (command === "enter_text") {
            if(args != null){
            	
				//Darkkitten.Parm.Text_Variable = args[0];
				Darkkitten.Parameters.varId = args[0];
				Darkkitten.Parameters.maxLength = args[1];
				for (i = 2; i <args.length; i++){
					Darkkitten.Parameters.defaultPromptText = args[i];
					}
					console.log("\n varId: "+ Darkkitten.Parameters.varId + " maxLength: "+ Darkkitten.Parameters.maxLength +" Default Prompt Text: "+Darkkitten.Parameters.defaultPromptText+"\n");
					SceneManager.push(Scene_Input);
					
			}
			else{
				Darkkitten.Parameters.varId = Darkkitten.Parm['Text Variable'];
				Darkkitten.Parameters.maxLength = Darkkitten.Parm['Max Characters'];
				Darkkitten.Parameters.defaultPromptText = Darkkitten.Parm['Default Header'];
				console.log("\n varId: "+ Darkkitten.Parameters.varId + " maxLength: "+ Darkkitten.Parameters.maxLength +" Default Prompt Text: "+Darkkitten.Parameters.defaultPromptText+"\n");
				SceneManager.push(Scene_Input);
			}
        }
	}

//------------------------------------------------------------------------
//Scene_Input
// Creates the Input Scene..
//------------------------------------------------------------------------

function Scene_Input(){
    this.initialize.apply(this, arguments);
}

//Constructors
Scene_Input.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Input.prototype.constructor = Scene_Input;

Scene_Input.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
}

Scene_Input.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.CEW();
    this.CIW();
}

Scene_Input.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._editTextWindow.refresh();
}

Scene_Input.prototype.CEW = function() {
	  this._editTextWindow = new Window_TextEdit();
	  this.addWindow(this._editTextWindow);
}

Scene_Input.prototype.CIW = function() {
	  this._inputTextWindow = new Window_NameInput(this._editTextWindow);
	  this._inputTextWindow.setHandler('ok', this.onThatsJustFine.bind(this));
	  this.addWindow(this._inputTextWindow);
}

Scene_Input.prototype.onThatsJustFine = function() {
	var varId = Darkkitten.Parameters.varId;
	$gameVariables.setValue(this.varId, this._editTextWindow.text());
	console.log("\Final Text:" + this._editTextWindow.text());
	this.popScene();
}

//-----------------------------------------------------------------------------
// Window_TextEdit
//
// The window for editing Text input screen.

function Window_TextEdit() {
    this.initialize.apply(this, arguments);
}

//Constructors
Window_TextEdit.prototype = Object.create(Window_Base.prototype);
Window_TextEdit.prototype.constructor = Window_TextEdit;

Window_TextEdit.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    var y = (Graphics.boxHeight - (height + this.fittingHeight(9) + 8)) / 2;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    var varId = Darkkitten.Parameters.varId;
    var defaultText = $gameVariables[varId];
    if (defaultText == null)
    {
		defaultText = '';
	}
	else {
    		defaultText  = $gameVariables[varId]; 
    }
    var maxLength = Darkkitten.Parameters.maxLength;
    var defaultPromptText = Darkkitten.Parameters.defaultPromptText;
    this._text = defaultText.slice(0, maxLength);
    this._index = this._text.length;
    this.activate();
    this.refresh();
}

Window_TextEdit.prototype.windowWidth = function() {
    return 480;
}

Window_TextEdit.prototype.windowHeight = function() {
    return this.fittingHeight(4);
}

Window_TextEdit.prototype.text = function() {
    return this._text;
}

Window_TextEdit.prototype.restoreDefault = function() {
	var varId = Darkkitten.Parameters.varId;
    var defaultText = $gameVariables[varId];
    this._text = defaultText;
    this._index = this._text.length;
    this.refresh();
    return this._text.length > 0;
}

Window_TextEdit.prototype.add = function(ch) {
	var maxLength = Darkkitten.Parameters.maxLength;
    if (this._index < maxLength) {
        this._text += ch;
        this._index++;
        this.refresh();
        return true;
    } else {
        return false;
    }
}

Window_TextEdit.prototype.back = function() {
    if (this._index > 0) {
        this._index--;
        this._text = this._text.slice(0, this._index);
        this.refresh();
        return true;
    } else {
        return false;
    }
}

Window_TextEdit.prototype.DefaultTextWidth = function(){
	var maxLength = Darkkitten.Parameters.maxLength;
	return maxLength;
}

Window_TextEdit.prototype.charWidth = function() {
    var text = $gameSystem.isJapanese() ? '\uff21' : 'A';
    return this.textWidth(text);
}

Window_TextEdit.prototype.left = function() {
	    var maxLength = Darkkitten.Parameters.maxLength;
		var textCenter = (this.contentsWidth() + this.DefaultTextWidth()) / 2;
		var textWidth = (maxLength + 1) * this.charWidth();
    	return Math.min(textCenter - textWidth / 2, this.contentsWidth() - textWidth);
}

Window_TextEdit.prototype.itemRect = function(index) {
    return {
        x: this.left() + index * this.charWidth(),
        y: 36,
        width: this.charWidth(),
        height: this.lineHeight()
    }
}

Window_TextEdit.prototype.underlineRect = function(index) {
    var rect = this.itemRect(index);
    rect.x++;
    rect.y += rect.height - 4;
    rect.width -= 2;
    rect.height = 2;
    return rect;
}

Window_TextEdit.prototype.underlineColor = function() {
    return this.normalColor();
}

Window_TextEdit.prototype.drawUnderline = function(index) {
    var rect = this.underlineRect(index);
    var color = this.underlineColor();
    this.contents.paintOpacity = 48;
    this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this.contents.paintOpacity = 255;
}

Window_TextEdit.prototype.drawChar = function(index) {
    var rect = this.itemRect(index);
    this.resetTextColor();
    this.drawText(this._text[index] || '', rect.x, rect.y);
    console.log("\n drawChar: "+this._text + " Index: " + index+"\n");
}

Window_TextEdit.prototype.refresh = function() {
	var maxLength = Darkkitten.Parameters.maxLength;
	var defaultPromptText = Darkkitten.Parameters.defaultPromptText;
    this.contents.clear();
	this.drawTextEx(defaultPromptText +"\n" +this._text ,0 , this.lineHeight());
    for (var i = 0; i < maxLength; i++) {
    	this.drawUnderline(i);
    }
    for (var j = 0; j < this._text.length; j++) {
        this.drawChar(j);
    }
    var rect = this.itemRect(this._index);
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
}
       
})();



