//=============================================================================
// CmdInp.js
//=============================================================================

/*:
 * @plugindesc v0.0.1b Enables a Command Input system.
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

Darkkitten.Parm.Text_Variable = Darkkitten.Parameters['Text Variable'];
Darkkitten.Parm.Max_Characters = Darkkitten.Parameters['Max Characters'];
Darkkitten.Parm.Default_Text = Darkkitten.Parameters['Default Text'];

		//Get Plugin Command Variables if not default.
        var getInformation_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function(command, args) {
                getInformation_pluginCommand.call(this, command, args);
                if (command === "enter_text") {
                    if(args[0] != null){
						Darkkitten.Parm.Text_Variable = args[0];
						Darkkitten.Parm.Max_Characters = args[1];
			 			for (i = 2; i < args.length; i++){
							Darkkitten.Parm.Default_Text = args[i];	
						}
						console.log("\n"+Darkkitten.Parm.Text_Variable + " " +Darkkitten.Parm.Max_Characters + " " + Darkkitten.Parm.Default_Text + "\n" );
						SceneManager.push(Scene_Input);
					}
                };
        };

(function(){

})();
//Modified Version of Window_NameEdit
function Window_VariableEdit() {
    this.initialize.apply(this, arguments);
}

Window_VariableEdit.prototype = Object.create(Window_Base.prototype);
Window_VariableEdit.prototype.constructor = Window_VariableEdit;

Window_VariableEdit.prototype.initialize = function(maxLength) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    var y = (Graphics.boxHeight - (height + this.fittingHeight(9) + 8)) / 2;
    this._defaultText = Darkkitten.Parm.Default_Text;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._name = this._defaultText.slice(0, this._maxLength);
    this._index = this._name.length;
    this._maxLength = maxLength;
    this._defaultName = this._name;
 //   this.activate();
	this.deactivate();
    this.refresh();
    ImageManager.loadFace($gameActors.actor(1).faceName());
};

Window_VariableEdit.prototype.windowWidth = function() {
    return 480;
};

Window_VariableEdit.prototype.windowHeight = function() {
    return this.fittingHeight(4);
};

Window_VariableEdit.prototype.name = function() {
    return this._name;
};

Window_VariableEdit.prototype.restoreDefault = function() {
    this._name = this._defaultName;
    this._index = this._name.length;
    this.refresh();
    return this._name.length > 0;
};

Window_VariableEdit.prototype.add = function(ch) {
    if (this._index < this._maxLength) {
        this._name += ch;
        this._index++;
        this.refresh();
        return true;
    } else {
        return false;
    }
};

Window_VariableEdit.prototype.back = function() {
    if (this._index > 0) {
        this._index--;
        this._name = this._name.slice(0, this._index);
        this.refresh();
        return true;
    } else {
        return false;
    }
};

Window_VariableEdit.prototype.faceWidth = function() {
    return 144;
};

Window_VariableEdit.prototype.charWidth = function() {
    var text = $gameSystem.isJapanese() ? '\uff21' : 'A';
    return this.textWidth(text);
};

Window_VariableEdit.prototype.left = function() {
    var nameCenter = (this.contentsWidth() + this.faceWidth()) / 2;
    var nameWidth = (this._maxLength + 1) * this.charWidth();
    return Math.min(nameCenter - nameWidth / 2, this.contentsWidth() - nameWidth);
};

Window_VariableEdit.prototype.itemRect = function(index) {
    return {
        x: this.left() + index * this.charWidth(),
        y: 54,
        width: this.charWidth(),
        height: this.lineHeight()
    };
};

Window_VariableEdit.prototype.underlineRect = function(index) {
    var rect = this.itemRect(index);
    rect.x++;
    rect.y += rect.height - 4;
    rect.width -= 2;
    rect.height = 2;
    return rect;
};

Window_VariableEdit.prototype.underlineColor = function() {
    return this.normalColor();
};

Window_VariableEdit.prototype.drawUnderline = function(index) {
    var rect = this.underlineRect(index);
    var color = this.underlineColor();
    this.contents.paintOpacity = 48;
    this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this.contents.paintOpacity = 255;
};

Window_VariableEdit.prototype.drawChar = function(index) {
    var rect = this.itemRect(index);
    this.resetTextColor();
    this.drawText(this._name[index] || '', rect.x, rect.y);
};

Window_VariableEdit.prototype.refresh = function() {
    this.contents.clear();
//Todo: Add Text here for why the Input is Open?
    this.drawActorFace($gameActors.actor(1), 0, 0);
    for (var i = 0; i < this._maxLength; i++) {
        this.drawUnderline(i);
    }
    for (var j = 0; j < this._name.length; j++) {
        this.drawChar(j);
    }
    var rect = this.itemRect(this._index);
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};

//Scene_Input
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
	this._maxCharacters = Darkkitten.Parm.Max_Characters;
	this._defaultText = Darkkitten.Parm.Default_Text;
	console.log("\n"+"VarID: "+_varId+" Max Chars: "+_maxCharacters+" Default Text: "+_defaultText+"\n");
};

Scene_Input.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);

    this.createEditW();
    this.createInputW();
};

Scene_Input.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._editW.refresh();
};

Scene_Input.prototype.createEditW = function() {
    this._editW = new Window_VariableEdit(this._maxCharacters, this._defaultText);
    this.addWindow(this._editW);
};

Scene_Input.prototype.createInputW = function() {
    this._inputW = new Window_NameInput(this._editW);
    this._inputW.setHandler('ok', this.onThatsJustFine.bind(this));
    this.addWindow(this._inputW);
};

Scene_Input.prototype.onThatsJustFine = function() {
	this._temp = this._editW.name();
	console.log("\n"+this._temp+"\n");
    $gameVariables.setValue(this._varId, this._temp);
    this.popScene();
};
