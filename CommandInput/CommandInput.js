//=============================================================================
// CommandInput.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v2.0.2 Command Input Enables a Window Input system for MZ
 * @author Darkkitten
 * @url https://raw.githubusercontent.com/Darkkitten/MyRPGMakerMV/master/CommandInput/CommandInput.js
 * @help CommandInput.js
 *
 * Fallow the Plugin Commands when you place this in your Events.
 *
 * @command enter_text
 * @desc Exter Text!!!
 * 
 * @arg useVariableforInput
 * @type boolean
 * @desc Choose to use a variable or PreInputed Text
 * @default false
 *
 * @arg VariableID
 * @type variable
 * @desc The variable you want to Set when your finished and use to set the Default Input Text
 * @default 1
 *
 * @arg MaxCharacters
 * @type number
 * @min 10
 * @max 36
 * @desc How big do you want the input area
 * @default 10
 *
 * @arg UseImage
 * @type boolean
 * @desc Use an Image in the Input Window
 * @default true
 *
 * @arg ImageName
 * @type file
 * @dir img/pictures
 * @default ClipComputer
 *  
 * @arg InputWindowName
 * @default Input_Window
 * 
 * @arg InputDefaultext
 * @default InputHere
 *
 */

(() => {
	
	const pluginName = "CommandInput";

	PluginManager.registerCommand(pluginName, "enter_text", args => {
		SceneManager.push(Scene_TextInput);
		SceneManager.prepareNextScene(Number(args.VariableID), Number(args.MaxCharacters), Boolean(args.UseImage), String(args.ImageName), String(args.InputWindowName), Boolean(args.useVariableforInput), String(args.InputDefaultext));
	});


	//-----------------------------------------------------------------------------
	// Scene_TextInput
	//
	// The scene class of the name input screen.

	function Scene_TextInput() {
		this.initialize(...arguments);
	}

	Scene_TextInput.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_TextInput.prototype.constructor = Scene_TextInput;

	Scene_TextInput.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_TextInput.prototype.prepare = function(VariableID, MaxCharacters, UseImage, ImageName, InputWindowName, UseVariableforInput, InputDefaultext) {
		console.log("Preparing Scene_Input");
		this._varID = VariableID;
		console.log("Checking Prepare's varid: " + this._varID);
		this._maxLength = MaxCharacters;
		console.log("Checking Prepare's maxLength: " + this._maxLength);
		this._UseImage = UseImage;
		console.log("Checking Prepare's UseImage: " + this._UseImage);
		this._ImageName = ImageName;
		console.log("Checking Prepare's Image Name: " + this._ImageName);
		this._InputWindowName = InputWindowName;
		console.log("Checking Prepare's _InputWindowName: " + this._InputWindowName);
		this._useVariableforInput = UseVariableforInput;
		console.log("Checking Prepare's _useVariableforInput: " + this._useVariableforInput);
		this._InputDefaultext = InputDefaultext;
		console.log("Checking Prepare's _InputDefaultext: " + this._InputDefaultext);
	};

	Scene_TextInput.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		if (this._useVariableforInput === true)
		{
			this._text = $gameVariables.value(this._varID);
			this.createEditWindow();
			this.createInputWindow();
		}
		else
		{
			this._text = this._InputDefaultext;
			this.createEditWindow();
			this.createInputWindow();
		}
	};

	Scene_TextInput.prototype.start = function() {
		Scene_MenuBase.prototype.start.call(this);
		this._editWindow.refresh();
	};

	Scene_TextInput.prototype.createEditWindow = function() {
		const rect = this.editWindowRect();
		this._editWindow = new Window_TextEdit(rect);
		this._editWindow.setup(this.InputDefaultext, this._maxLength, this._useVariableforInput, this._varID, this._UseImage, this._ImageName);
		this.addWindow(this._editWindow);
	};

	Scene_TextInput.prototype.editWindowRect = function() {
		const inputWindowHeight = this.calcWindowHeight(9, true);
		const padding = $gameSystem.windowPadding();
		const ww = 600;
		const wh = ImageManager.faceHeight + padding * 2;
		const wx = (Graphics.boxWidth - ww) / 2;
		const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_TextInput.prototype.createInputWindow = function() {
		const rect = this.inputWindowRect();
		this._inputWindow = new Window_TextInput(rect);
		this._inputWindow.setEditWindow(this._editWindow);
		this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
		this.addWindow(this._inputWindow);
	};

	Scene_TextInput.prototype.inputWindowRect = function() {
		const wx = this._editWindow.x;
		const wy = this._editWindow.y + this._editWindow.height + 8;
		const ww = this._editWindow.width;
		const wh = this.calcWindowHeight(9, true);
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_TextInput.prototype.onInputOk = function() {
		$gameVariables.setValue(this._varID, this._editWindow.text());
		this.popScene();
	};


	//-----------------------------------------------------------------------------
	// Window_TextEdit
	//
	// The window for editing an actor's name on the name input screen.

	function Window_TextEdit() {
		this.initialize(...arguments);
	}

	Window_TextEdit.prototype = Object.create(Window_StatusBase.prototype);
	Window_TextEdit.prototype.constructor = Window_TextEdit;

	Window_TextEdit.prototype.initialize = function(rect) {
		Window_StatusBase.prototype.initialize.call(this, rect);
		console.log("Setting up Text Editor Window.")
		this._useImage = false;
		this._imageName = "";
		this._MaxLength = 0;
		this._text = '';
		this._index = 0;
		this._defaultText = '';
		this.deactivate();
	};

	Window_TextEdit.prototype.setup = function(InputText, MaxLength, UseVariable, Variable2Use, UseImage, ImageName) {
		this._useImage = UseImage;
		this._imageName = ImageName;
		this._MaxLength = MaxLength;
		if(UseVariable === true)
		{
			if (this._useImage === true)
			{
				ImageManager.loadPicture(this._imageName);
			}
			this._text = $gameVariables.value(Variable2Use).slice(0, this._MaxLength);
			this._index = this._text.length;
			this._defaultText = this._text;
			this.activate();
			this.refresh();
		}
		else
		{
			if (this._useImage === true)
			{
				ImageManager.loadPicture(this._imageName);
			}
			this._text = InputText.slice(0, this._MaxLength);
			this._index = this._text.length;
			this._defaultText = this._text;
			this.activate();
			this.refresh();
		}
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
		if (this._index < this._MaxLength) {
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

	Window_TextEdit.prototype.faceWidth = function() {
		return 144;
	};

	Window_TextEdit.prototype.charWidth = function() {
		const text = $gameSystem.isJapanese() ? "\uff21" : "A";
		return this.DefaultTextWidth(text);
	 };
	
	Window_TextEdit.prototype.DefaultTextWidth = function(text){
			return this.contents.measureTextWidth(text);
	};

	Window_TextEdit.prototype.left = function() {
		if (this._useImage === true)
		{
			const textCenter = (this.innerWidth + this.faceWidth()) / 2;
			const textWidth = (this._MaxLength + 1) * this.charWidth();
			return Math.min(textCenter - textWidth / 2, this.innerWidth - textWidth);
		}
		else
		{
			const textCenter = (this.innerWidth + this._defaultText / 2);
			const textWidth = (this._MaxLength + 1) * this.charWidth();
			return Math.min(textCenter - textWidth / 2, this.innerWidth - textWidth);
		}
	};

	Window_TextEdit.prototype.itemRect = function(index) {
		const x = this.left() + index * this.charWidth();
		const y = 54;
		const width = this.charWidth();
		const height = this.lineHeight();
		return new Rectangle(x, y, width, height);
	};

	Window_TextEdit.prototype.underlineRect = function(index) {
		const rect = this.itemRect(index);
		rect.x++;
		rect.y += rect.height - 4;
		rect.width -= 2;
		rect.height = 2;
		return rect;
	};

	Window_TextEdit.prototype.underlineColor = function() {
		return ColorManager.normalColor();
	};

	Window_TextEdit.prototype.drawUnderline = function(index) {
		const rect = this.underlineRect(index);
		const color = this.underlineColor();
		this.contents.paintOpacity = 48;
		this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
		this.contents.paintOpacity = 255;
	};

	Window_TextEdit.prototype.drawChar = function(index) {
		const rect = this.itemRect(index);
		this.resetTextColor();
		this.drawText(this._text[index] || "", rect.x, rect.y);
	};

	Window_TextEdit.prototype.refresh = function() {
		this.contents.clear();
		if (this._useImage === true)
		{

			var bitmap = ImageManager.loadPicture(this._imageName);
			this.contents.blt(bitmap, 0, 0, Graphics._canvas.width, Graphics._canvas.height, 10, 0, 144, 144);
			//this.drawText(this._text, bitmap.width / 2, this.lineHeight());
			for (let i = 0; i < this._MaxLength; i++) {
				this.drawUnderline(i);
			}
			for (let j = 0; j < this._text.length; j++) {
				this.drawChar(j);
			}
			const rect = this.itemRect(this._index);
			this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
		}
		else
		{
			//this.drawText(this._text.slice(9), 0, this.lineHeight());
			for (let i = 0; i < this._MaxLength; i++) {
				this.drawUnderline(i);
			}
			for (let j = 0; j < this._text.length; j++) {
				this.drawChar(j);
			}
			const rect = this.itemRect(this._index);
			this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
		}
	};

	//-----------------------------------------------------------------------------
	// Window_TextInput
	//
	// The window for selecting text characters on the name input screen.

	function Window_TextInput() {
		this.initialize(...arguments);
	}

	Window_TextInput.prototype = Object.create(Window_Selectable.prototype);
	Window_TextInput.prototype.constructor = Window_TextInput;

	// prettier-ignore
	Window_TextInput.LATIN1 =
			[ "A","B","C","D","E",  "a","b","c","d","e",
			"F","G","H","I","J",  "f","g","h","i","j",
			"K","L","M","N","O",  "k","l","m","n","o",
			"P","Q","R","S","T",  "p","q","r","s","t",
			"U","V","W","X","Y",  "u","v","w","x","y",
			"Z","[","]","^","_",  "z","{","}","|","~",
			"0","1","2","3","4",  "!","#","$","%","&",
			"5","6","7","8","9",  "(",")","*","+","-",
			"/","=","@","<",">",  ":",";"," ","Page","OK" ];
	// prettier-ignore
	Window_TextInput.LATIN2 =
			[ "Á","É","Í","Ó","Ú",  "á","é","í","ó","ú",
			"À","È","Ì","Ò","Ù",  "à","è","ì","ò","ù",
			"Â","Ê","Î","Ô","Û",  "â","ê","î","ô","û",
			"Ä","Ë","Ï","Ö","Ü",  "ä","ë","ï","ö","ü",
			"Ā","Ē","Ī","Ō","Ū",  "ā","ē","ī","ō","ū",
			"Ã","Å","Æ","Ç","Ð",  "ã","å","æ","ç","ð",
			"Ñ","Õ","Ø","Š","Ŵ",  "ñ","õ","ø","š","ŵ",
			"Ý","Ŷ","Ÿ","Ž","Þ",  "ý","ÿ","ŷ","ž","þ",
			"Ĳ","Œ","ĳ","œ","ß",  "«","»"," ","Page","OK" ];
	// prettier-ignore
	Window_TextInput.RUSSIA =
			[ "А","Б","В","Г","Д",  "а","б","в","г","д",
			"Е","Ё","Ж","З","И",  "е","ё","ж","з","и",
			"Й","К","Л","М","Н",  "й","к","л","м","н",
			"О","П","Р","С","Т",  "о","п","р","с","т",
			"У","Ф","Х","Ц","Ч",  "у","ф","х","ц","ч",
			"Ш","Щ","Ъ","Ы","Ь",  "ш","щ","ъ","ы","ь",
			"Э","Ю","Я","^","_",  "э","ю","я","%","&",
			"0","1","2","3","4",  "(",")","*","+","-",
			"5","6","7","8","9",  ":",";"," ","","OK" ];
	// prettier-ignore
	Window_TextInput.JAPAN1 =
			[ "あ","い","う","え","お",  "が","ぎ","ぐ","げ","ご",
			"か","き","く","け","こ",  "ざ","じ","ず","ぜ","ぞ",
			"さ","し","す","せ","そ",  "だ","ぢ","づ","で","ど",
			"た","ち","つ","て","と",  "ば","び","ぶ","べ","ぼ",
			"な","に","ぬ","ね","の",  "ぱ","ぴ","ぷ","ぺ","ぽ",
			"は","ひ","ふ","へ","ほ",  "ぁ","ぃ","ぅ","ぇ","ぉ",
			"ま","み","む","め","も",  "っ","ゃ","ゅ","ょ","ゎ",
			"や","ゆ","よ","わ","ん",  "ー","～","・","＝","☆",
			"ら","り","る","れ","ろ",  "ゔ","を","　","カナ","決定" ];
	// prettier-ignore
	Window_TextInput.JAPAN2 =
			[ "ア","イ","ウ","エ","オ",  "ガ","ギ","グ","ゲ","ゴ",
			"カ","キ","ク","ケ","コ",  "ザ","ジ","ズ","ゼ","ゾ",
			"サ","シ","ス","セ","ソ",  "ダ","ヂ","ヅ","デ","ド",
			"タ","チ","ツ","テ","ト",  "バ","ビ","ブ","ベ","ボ",
			"ナ","ニ","ヌ","ネ","ノ",  "パ","ピ","プ","ペ","ポ",
			"ハ","ヒ","フ","ヘ","ホ",  "ァ","ィ","ゥ","ェ","ォ",
			"マ","ミ","ム","メ","モ",  "ッ","ャ","ュ","ョ","ヮ",
			"ヤ","ユ","ヨ","ワ","ン",  "ー","～","・","＝","☆",
			"ラ","リ","ル","レ","ロ",  "ヴ","ヲ","　","英数","決定" ];
	// prettier-ignore
	Window_TextInput.JAPAN3 =
			[ "Ａ","Ｂ","Ｃ","Ｄ","Ｅ",  "ａ","ｂ","ｃ","ｄ","ｅ",
			"Ｆ","Ｇ","Ｈ","Ｉ","Ｊ",  "ｆ","ｇ","ｈ","ｉ","ｊ",
			"Ｋ","Ｌ","Ｍ","Ｎ","Ｏ",  "ｋ","ｌ","ｍ","ｎ","ｏ",
			"Ｐ","Ｑ","Ｒ","Ｓ","Ｔ",  "ｐ","ｑ","ｒ","ｓ","ｔ",
			"Ｕ","Ｖ","Ｗ","Ｘ","Ｙ",  "ｕ","ｖ","ｗ","ｘ","ｙ",
			"Ｚ","［","］","＾","＿",  "ｚ","｛","｝","｜","～",
			"０","１","２","３","４",  "！","＃","＄","％","＆",
			"５","６","７","８","９",  "（","）","＊","＋","－",
			"／","＝","＠","＜","＞",  "：","；","　","かな","決定" ];

	Window_TextInput.prototype.initialize = function(rect) {
		Window_Selectable.prototype.initialize.call(this, rect);
		this._editWindow = null;
		this._page = 0;
		this._index = 0;
	};

	Window_TextInput.prototype.setEditWindow = function(editWindow) {
		this._editWindow = editWindow;
		this.refresh();
		this.updateCursor();
		this.activate();
	};

	Window_TextInput.prototype.table = function() {
		if ($gameSystem.isJapanese()) {
			return [
				Window_TextInput.JAPAN1,
				Window_TextInput.JAPAN2,
				Window_TextInput.JAPAN3
			];
		} else if ($gameSystem.isRussian()) {
			return [Window_TextInput.RUSSIA];
		} else {
			return [Window_TextInput.LATIN1, Window_TextInput.LATIN2];
		}
	};

	Window_TextInput.prototype.maxCols = function() {
		return 10;
	};

	Window_TextInput.prototype.maxItems = function() {
		return 90;
	};

	Window_TextInput.prototype.itemWidth = function() {
		return Math.floor((this.innerWidth - this.groupSpacing()) / 10);
	};

	Window_TextInput.prototype.groupSpacing = function() {
		return 24;
	};

	Window_TextInput.prototype.character = function() {
		return this._index < 88 ? this.table()[this._page][this._index] : "";
	};

	Window_TextInput.prototype.isPageChange = function() {
		return this._index === 88;
	};

	Window_TextInput.prototype.isOk = function() {
		return this._index === 89;
	};

	Window_TextInput.prototype.itemRect = function(index) {
		const itemWidth = this.itemWidth();
		const itemHeight = this.itemHeight();
		const colSpacing = this.colSpacing();
		const rowSpacing = this.rowSpacing();
		const groupSpacing = this.groupSpacing();
		const col = index % 10;
		const group = Math.floor(col / 5);
		const x = col * itemWidth + group * groupSpacing + colSpacing / 2;
		const y = Math.floor(index / 10) * itemHeight + rowSpacing / 2;
		const width = itemWidth - colSpacing;
		const height = itemHeight - rowSpacing;
		return new Rectangle(x, y, width, height);
	};

	Window_TextInput.prototype.drawItem = function(index) {
		const table = this.table();
		const character = table[this._page][index];
		const rect = this.itemLineRect(index);
		this.drawText(character, rect.x, rect.y, rect.width, "center");
	};

	Window_TextInput.prototype.updateCursor = function() {
		const rect = this.itemRect(this._index);
		this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
	};

	Window_TextInput.prototype.isCursorMovable = function() {
		return this.active;
	};

	Window_TextInput.prototype.cursorDown = function(wrap) {
		if (this._index < 80 || wrap) {
			this._index = (this._index + 10) % 90;
		}
	};

	Window_TextInput.prototype.cursorUp = function(wrap) {
		if (this._index >= 10 || wrap) {
			this._index = (this._index + 80) % 90;
		}
	};

	Window_TextInput.prototype.cursorRight = function(wrap) {
		if (this._index % 10 < 9) {
			this._index++;
		} else if (wrap) {
			this._index -= 9;
		}
	};

	Window_TextInput.prototype.cursorLeft = function(wrap) {
		if (this._index % 10 > 0) {
			this._index--;
		} else if (wrap) {
			this._index += 9;
		}
	};

	Window_TextInput.prototype.cursorPagedown = function() {
		this._page = (this._page + 1) % this.table().length;
		this.refresh();
	};

	Window_TextInput.prototype.cursorPageup = function() {
		this._page = (this._page + this.table().length - 1) % this.table().length;
		this.refresh();
	};

	Window_TextInput.prototype.processCursorMove = function() {
		const lastPage = this._page;
		Window_Selectable.prototype.processCursorMove.call(this);
		this.updateCursor();
		if (this._page !== lastPage) {
			this.playCursorSound();
		}
	};

	Window_TextInput.prototype.processHandling = function() {
		if (this.isOpen() && this.active) {
			if (Input.isTriggered("shift")) {
				this.processJump();
			}
			if (Input.isRepeated("cancel")) {
				this.processBack();
			}
			if (Input.isRepeated("ok")) {
				this.processOk();
			}
		}
	};

	Window_TextInput.prototype.isCancelEnabled = function() {
		return true;
	};

	Window_TextInput.prototype.processCancel = function() {
		this.processBack();
	};

	Window_TextInput.prototype.processJump = function() {
		if (this._index !== 89) {
			this._index = 89;
			this.playCursorSound();
		}
	};

	Window_TextInput.prototype.processBack = function() {
		if (this._editWindow.back()) {
			SoundManager.playCancel();
		}
	};

	Window_TextInput.prototype.processOk = function() {
		if (this.character()) {
			this.onNameAdd();
		} else if (this.isPageChange()) {
			this.playOkSound();
			this.cursorPagedown();
		} else if (this.isOk()) {
			this.onNameOk();
		}
	};

	Window_TextInput.prototype.onNameAdd = function() {
		if (this._editWindow.add(this.character())) {
			this.playOkSound();
		} else {
			this.playBuzzerSound();
		}
	};

	Window_TextInput.prototype.onNameOk = function() {
		if (this._editWindow.text() === "") {
			if (this._editWindow.restoreDefault()) {
				this.playOkSound();
			} else {
				this.playBuzzerSound();
			}
		} else {
			this.playOkSound();
			this.callOkHandler();
		}
	};
})();