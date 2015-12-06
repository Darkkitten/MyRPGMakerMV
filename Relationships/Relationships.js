/*:
 * @plugindesc v0.0.1 This script creates a Relationship system / Bio window based on V's Relationship / Bio window for RPG Maker VX Ace.
 * @author Darkkitten
 *
 * @help
 
 * Thanks:
 * V for creating the Ruby version of the Relationship / bio window script.
 * Vlue for putting out good scripts to learn from.
 * Gameus for his Quest System
 * =============================================================================
 * @param Use custom Background
 * @desc Use a Custom Background Image.
 * Default false
 * @default false
 *
 * @param Relationship Background Image
 * @desc The file path for the Background image
 * Default Fountain.png
 * @default Fountain.png
 *
 * @param Window Title
 * @desc The title of the relationship window
 * Default Relationships
 * @default Relationships
 *
 * @param Terms Of Feelings
 * @desc Name of the feelings if Text is used.
 * Default Hated, Disliked, None, Liked, Loved
 * @default Hated, Disliked, None, Liked, Loved
 *
 * @param Term Of Mastered
 * @desc Name of the Mastered TExt if Lveling System is used
 * Default Mastered
 * @default Mastered
 *
 * @param Use Polarities
 * @desc Use Polarities. If true will display a gague with Love/hate Polarities, if it is False a normal gague will be used.
 * Default true
 * @default true
 *
 * @param Use Liked and Disliked Items
 * @desc Hide Liked and Disliked Items or Not, true = hide, false = show
 * Default false
 * @default false
 *
 * @param Hidden Text
 * @desc Text to use to hide like dislike if you have that setup?
 * Default ???????????
 * @default ???????????
 *
 * @param Use Event Graphics
 * @desc Use the Character Graphic from the Event you used as a NPC?
 * Default true
 * @default true
 *
*/

var Imported = Imported || {};
Imported.Relationships = true;

var Darkkitten = Darkkitten || {};
Darkkitten.Parameters = PluginManager.parameters('Relationships');
Darkkitten.Param = Darkkitten.Param || {};

var Use_Custom_Background = Darkkitten.Parameters['Use_custom_Background'];
var Background = Darkkitten.Parameters['Relationship Background Image'];
var Window_Title = Darkkitten.Parameters['Window Title'];
var Use_Leveling_System = Darkkitten.Parameters['Use Leveling System']
var Terms_Of_Feelings[] = Darkkitten.Parameters['Terms Of Feelings'];
var Term_Of_Mastered = Darkkitten.Parameters['Term Of Mastered'];
//var Use_Polarities = Darkkitten.Parameters['Use Polarities'];
var Use_Title = Darkkitten.Parameters['Use Title'];
var Use_Liked_and_Disliked_Items = Darkkitten.Parameters['Use Liked and Disliked Items'];
var Hidden = Darkkitten.Parameters['Hidden Text'];

var $Relationship_info = null;
var $Relationship_data = null;

var getInformation_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    getInformation_pluginCommand.call(this, command, args);
   	if (command === 'Relationships'){
		switch (args[0].toLowerCase()){
			case 'open':
			SceneManager.push(Scene_Relationships);
			break;
			case 'add':
			$gameParty.addRelationship(Number(args[1]));
			break;
			case 'status_liked':
			//$gameSystem.change_status(args[1], args[2]);	
			break;
			case 'status_loved':
			$relationshipData.get(Number(args[1])).liked();
			break;
			case 'status_none':
			$relationshipData.get(Number(args[1])).none(;
			break;
			case 'status_hated':
			$relationshipData.get(Number(args[1)).hated();
			break;
			case 'status_disliked':
			$relationshipData.get(Number(args[1])).disliked();
			break;
			case 'status_mastered':
			$relationshipData.get(Number(args[1])).mastered();
			break;
			case 'liked_item':
			//Add Change Liked Items here..
			break;
			case 'diskliked_item':
			//Add Change Disliked Litems here..
			break;
		}
	}
};
   
//Load Relationship_info	
DataManager._databaseFiles.push(
	{name: "$Relationship_info", src: "Relationships.json"}
);
	
Darkkitten.Param.Data_Initialize = DataManager.createGameObjects;
Darkkitten.Param.Save_Data = DataManager.makeSaveContents;
Darkkitten.Param.Lad_Data = DataManager.extractSaveContents;
Darkkitten.Param.Party_Initalize = Game_Party.prototype.initialize;
	
//DataManager	
DataManager.makeSaveContents = function(){
	contents = Darkkitten.Param.Save_Data.call(this);
	//Include the Relationship_info in the save file
	contents.relationships = $Relationship_info;
	return contents;
};
	
DataManager.extractSaveContents = function(contents){
	Darkkitten.Param.Lad_Data.call(this, contents);
	//load them in 
	$Relationship_info = contents.relationship_info;
};
	
DataManager.createGameObjects = function(){
	Darkkitten.Param.Data_Initialize.call(this);
	//create Global Relationship_info
	$Relationship_info = new Game_Relationship();
};
	
//Game_Party
Game_Party.prototype.initialize = function(){
	Darkkitten.Param.Party_Initalize.call(this);
	// Inititalize Relationship Data
	this.relationships = [];
};
	
Game_Party.prototype.addRelationship = function(relationshipID){
	//Do you already have this Relationship?
	if (this.relationships.indexOf(realationshipID) < 0) {
		//if not, give that crap to them. They don't have a choice now.
		this.relationships.push(relationshipID);
	}
};

//REturns the total number of Relationships you have.
Game_Party.prototype.totalRelationships = function(){
	//Cycle through all Relationships
	var count = 0;
	for (var i = 0; i < this.relationships.length; i++){
		var r = $Relationship_info.get(this.relationships[i]);
		count++;
	}
	return count;
};
	
// Get Alll Relationship Id's
Game_Party.prototype.getRelationships = function(){
	//Time to cycle through Relationships
	var data = [];
	for (var i = 0; i < this.relationships.length; i++ ){
		var r = $Relationship_info.get(this.relationships[i]);
		//data.push(q.relationshipId);
	}
	return data;
};
	
Game_Party.prototype.getRelationship = function(index){
	return $Relationship_info.get(this.relationships[index]);
};
	
//Useless...
Game_Party.prototype.hasRelationship = function(relationshipID){
	//returns weather or not they have relationship
	return this.relationships.indexOf(relationshipID) > -1;
};
	
//This checks a list of Relationships 
Game_Party.prototype.hasRelationships = function(relationships){
	flag = true;
	for var i = 0; relationships.length; i++) {
		if (!this.hasRelationship(relationships[i]))
		flag = false;
	}
	return flag;
}
	
//Relationship_Info
function Game_Relationship() {
	this.initialize.apply(this, arguments);
};
	
Game_Relationship.prototype.initialize = function(relationshipID){
	var relationshipData = $Relationship_data[relationshipID];
	this.relationshipId = relationshipID;
	this.rawData = relationshipData;
	this.name = relationshipData.name; //Name of the Person your in relationship with.
	this.current_status = relationshipData.current_status; //Current Status of your Relationship
	this.desc = relationshipData.desc; //NPC Description, Etc
	this.face = relationshipData.face; //FaceSet to use
	this.relationshpLevel = $gameVariables.value(relationshipData.level); //Game Viarable from Database
	this.likes = relationshipData.likes; //Item Variable from Database
	this.dislikes = relationshipData.dislikes; //Item Variable from Database
	this.location = $gameMap.event(relationshipData.location);
	//this.location = relationshipData.location; //Event Location from Database
	//Todo: App Polarities
};

//ToDo: All Relationship Level Rewards
Game_RelationShip.prototype.giveRewards= function() {
	for (var i = 0; i < this.rewards.length; i++){
			
	}
};
	
//Status Information.
//Hated, Disliked, None, Liked, Loved
Game_Relationship.prototype.mastered = function(){
	return this.current_status == Term_Of_Mastered;
}
	
Game_Relationship.prototype.liked = function(){
	return this.current_status == Terms_Of_Feelings[3];
}
	
Game_Relationship.prototype.hated = function(){
	return this.current_status == Terms_Of_Feelings[0];
}
	
Game_Relationship.prototype.disliked = function(){
	return this.current_status == Terms_Of_Feelings[1];
}
	
Game_Relationship.prototype.none = function() {
	return this.current_status == Terms_Of_Feelings[2];
};
	
Game_Relationship.prototype.loved = function(){
	return this.current_status == Terms_Of_Feelings[4];
};
	
//Game_Relationships
function Game_Relationships() {
	this.initalize.apply(this, arguments);
};
	
Game_Relationships.prototype.initialize = function(){
	this.data[];	
};
	
Game_Relationships.prototype.get = function(relationshipID){
		if ($relationshipData[relationshipID]){
		if (!this.data[relationshipID]){	
			this.data[relationshipID] = new Game_Relationship(relationshipID);
		}
		return this.data[relationshipID];
	}
	return null;
};
	
Game_Relationships.prototype.totalRelationships = function(){
	//returns a list of All relationships
	for (var i = 0;i < $relationshipData.length; i++){
		var r = this.get(this.relationships[i]);
	}
	return data;
};
	
//Window_Base
Window_Base.prototype.sliceText = function(){
	var words = text.split(" ");
	if (words.length === 1)
	return words;
	var result = [];
	var currenttext = words.shift();
	for (var i = 0; words.legnth; i++){
			
		var word = words[i];
		var textW = this.contents.measureTextWidth(current_text + " "+ word);
		if (TextW > wdith){
			retult.push(current_text);
			current_text = word;
		} else {
			current_text += " " + word;
		}
	if (i >= words.length - 1)
		resault.push(current_text)
	}
	return result;
}
	
//Window_RelationshipInfo
function Window_RelationshipInfo() {
	this.initialize.apply(this, arguments);	
}
	
Window_RelationshipInfo.prototype = Object.create(Window_Selectable.prototype);
Window_RelationshipInfo.prototype.constructor = Window_RelationshipInfo;
    
Window_RelationshipInfo.prototype.initialize = function(){
    var FaceImage = Face;
    //var FaceID = Number(Face[1]);
    this.Face = ImageManager.loadFace(FaceImage);
	this.relationship = 0;
	this.offY = 0;
	this.lineY = 0;
	this.resizeFlag = false;
	Window_Selectable.prototype.initialize.call(this, 0 : 320, 0, Graphics.boxWidth -320, Graphics.boxHeight);
	this.relationshipBitmap = new Bitmap(this.contentsWidth(), this.contentsHeight());
	this.refresh();
};
	
Window_RelationshipInfo.prototype.setRelationship = function(relationshipID){
	this.relationship = relationshipID;
	this.offY = 0;
	this.resizeFlag = false;
	this.createRelationshipBitmap();
	this.refresh();
};
	
Window_RelationshipInfo.prototype.refresh = function(){
	this.contents.clear();
	if (this.relationship > 0) {
		this.contents.blt(this.relationshipBitmap, 0, this.offY, this.contentsWidth(), this.contentsHeight(), 0, 0, this.contentsWidth(), this.contentsHeight());
	}
}
	
//this function is used to keep track of the height of the bitmap.
Window_RelationshipInfo.prototype.write = function(){
	if(this.lineY > this.relationship.Bitmap.height) {
		this.relationshipBitmap.resize(this.relationshipBitmap.width, this.lineY);
		this.resizeFlag = true;
	}
}
	
Window_RelationshipInfo.prototype.createRelationshipBitmap = function(){
	this.relationshipBipmap.clear();
	this.relationshipBitmap.paintOpacity = 128;
	this.relationshipBitmap.blt(this.Face, 0, 0 this.Face.width, this.Face.height, this.contentsWidth() / 2 - this.Face.width, this.contentsHeight() / 2- this.Face.height / 2);
	if (this.relationship > 0){
		this.relationshipBitmap.paintOpacity = 255;
		var q = $RelationshipData.get(this.relationship);
		this.drawRelationshipInfo(q);
		this.drawRelationhipLikesDislikes(q);
	}
	//Check for resize, then redraw
	if (this.resizeFlag){	
		this.resizeFlag = false;
		this.createRelationshipBitmap();
	}
};
	
Window_RelationshipInfo.prototype.drawRelationshipInfo = function(q){
	var headerX = 0;
	this.relationshipBitmap.paintOpacity = 255;
	this.lineY = 0;
	this.relationshipBitmap.textColor = this.systemColor();
	this.relationshipBitmap.drawText(r.name, headerX, this.lineY, this.contentsWidth(), this.contentsHeight());
	this.write();
	this.relationshipBitmap.textColor = this.normalColor();
	var lines = this.sliceText(r.desc, this.contentsWidth());
	for (var i = 0; i < lines.length; i++){
		this.relationshipBitmap.drawText(lines[i], 0, this.lineY, this.contentsWidth(), this.lineHeight());
		this.write();
	}
	this.drawHorzLine(this.lineY);
	this.write();
}
	
Window_RelationshipInfo.prototype.drawRelationhipLikesDislikes == function(r){
	var bullet = String("-") + " ";
	//Liked Items.
	this.relationshipBitmap.textColor = systemColor();
	this.questBitmap.drawText("Likes"), 0 this.lineY, this.contentsWidth(), this.lineHeight());
	this.write();
	this.relationshipBitmap.textColor = this.normalColor();
	for (var i = 0; r.likes.length; i++){
		var likes = r.likes[i];
		if (like[3] === true && r.current_status !== mastered){
			this.relationshipBitmap.drawText(bullet + Hidden, 0, this.lineY, this.contentsWidth(), this.lineHeight());
			this.write();
			continue;
		}
	}
	var item = null;
	var done = (r.current_status === mastered);
	this.relationshipBitmap.paintOpacity = done ? 160 : 255
	switch(like[0]){
		case "item":
		item = $dataItems[likes[1]];
		this.drawItemName(item, this.coents.measureTextWidth(bullet), this.lineY, this.contentsWidth());
		this.write();
		break;
	}
	//Disliked Items.
	this.questBitmap.drawText("Dislikes"), 0 this.lineY, this.contentsWidth(), this.lineHeight());
	this.write();
	this.relationshipBitmap.textColor = this.normalColor();
	for (var i = 0; r.dilsikes.length; i++){
		var dislikes = r.dislikes[i];
		if (dislike[3] === true && r.current_status !== mastered){
				this.relationshipBitmap.drawText(bullet + Hidden, 0, this.lineY, this.contentsWidth(), this.lineHeight());
				this.write();
			continue;
		}
	}
		var item = null;
		var done = (q.current_status === mastered);
		this.relationshipBitmap.paintOpacity = done ? 160 : 255
		switch(dislike[0]){
		case "item":
		item = $dataItems[dislikes[1]];
		this.drawItemName(item, this.coents.measureTextWidth(bullet), this.lineY, this.contentsWidth());
		this.write();
		break;
	}
};

Window_RelationshipInfo.prototype.drawItemName = function(item, x, y, width){
	width = width || 312;
	if (item){
		var iconboxWidth = Window_Base._iconWidth + 8;
		this.relationshipBitmap.textColor = this.normalColor();
		this.drawIcon(item.iconIndex, x - 2, y + 2);
		this.relationshipBitmap.drawText(item.name, x, iconBoxWidth, y width - iconBoxWidth, this.lineHeight());
	}
};

Window_RelationshipInfo.prototype.drawIcon = function(ionIndex, x, y){
	var bitmap = ImageManager.loadSystem('IconSet');
	var pw = Window_Base._iconWidth;
	var ph = Window_Base._iconHeight;
	var sx = iconIndex % 16 * pw;
	var sy = Math.floor(iconIndex / 16) * ph;
	this.relationshipBitmap.blt(bitmap, sx, sy, pw, ph, x, y);
};
	
Window_RelationshipInfo.prototype.drawHorzLine = function(y){
	var lineY = y + this.lineHeight() / 2 - 1;
	this.relationshipBitmap.paintOpacity = 48;
	this.relationshipBitmap.fillRect(0, lineY, this.contentsWidth(), 2, this.normalColor());
	this.relationshipBitmap.paintOpacity = 255;
};
	
Window_RelationshipInfo.prototype.updateArrows = function(){	
	this.downArrowVisable = (this.relationshipBitmap.height > this.contentsHeight() && this.offY < this.relationshipBitmap.height - this.contentsHeight());
	this.upArrowVisable = this.offY > 0;
};
	
// Override the arrow key controls so we can scroll instead, let's be honest, that's way cooler
Window_RelationshipInfo.prototype.isCursorMovable = function() {
	return (this.isOpenAndActive());
};

Window_RelationshipInfo.prototype.cursorDown = function(wrap) {
    if (this.relationshipBitmap.height > this.contentsHeight() && this.offY < this.relationshipBitmap.height - this.contentsHeight()) {
        SoundManager.playCursor();
        this.offY += this.lineHeight() + this.textPadding();
		this.refresh();
	}
};

Window_RelationshipInfo.prototype.cursorUp = function(wrap) {
    if (this.offY > 0) {
    SoundManager.playCursor();
    this.offY -= this.lineHeight() + this.textPadding();
    if (this.offY < 0)
        this.offY = 0;
		this.refresh();
	}
};
    
Window_RelationshipInfo.prototype.cursorPagedown = function() {
	this.cursorDown();
};

Window_RelationshipInfo.prototype.cursorPageup = function() {
	this.cursorUp();
};

Window_RelationshipInfo.prototype.cursorRight = function(wrap) {
	// We are basically...
};

Window_RelationshipInfo.prototype.cursorLeft = function(wrap) {
	// ...screwing the system
};
	
function Window_Relationships(){
	this.initialize.apply(this, arguments);
};
	
Window_Relationships.prototype = Object.create(Window_Command.prototype);
Window_Relationships.prototype.constructor = Window_Relationships;
	
Window_Relationships.prototype.initialize = function(){
	var xx = 0;
	var yy = 0;
	//Stores all relationships from $gameParty
	this.qFilters = ["all"];
	this.filterIndex = 0;
	this.data = [];
		
	this.filter = "all";
	this.refreshRelationships();
	Window_Command.prototype.initialize.call(this, xx, yy);
				
};
	
Window_Relationships.prototype.windowWidth = function(){
	return 320;
};
	
Window_Relationships.prototype.numVisibleRows = function(){
	return 10;
};
	
Window_Relationships.prototype.windowHeight = function(){
	return Graphics.boxHeight - this.fittingHeight(1))	
}
	
Window_Relationships.prototype.drawItem = function(index){
	var item = this._list[index];
	var rect = this.itemRectForText(index);
	var align = this.itemTextAlign();
	this.resetTextColor(;
	this.changePaintOpacity(this.isCommandEnabled(index))
	var tempX = 0;
	if (item.symbol === "relationships") {
		var r = $relationshipData.get(Number(item.ext));
	}	
	this.drawText(this.commandName(index), rect.x + tempX / 2, rect.y, rect.width, align);
};
	
Window_Relationships.prototype.relationshipData = function(relationshipID){
	return $relationshipData.get(relationshipID);
};
	
Window_Relationships.prototype.refreshRelationships = function(){
	this.data = $gameparty.getRelationships();
	this.counter = [];
	for (var i = 0; i < this.data.length; i++){
		var r = $relationshipData.get(this.data[i]);
		counter[i]++;
	}
};
	
Window_Relationships.prototype.makeCommandList = function(){
	var r;
	var flag = false;
	for var i = 0; i < this.data.length; i++){
		r = $relationshipData.get(this.data[i]);
		this.addCommand(r.name, "relationship", true, r.relationshipId);
	} 
	if (this._list.length < 1){
		this.addCommand("No Relationships");
	}
};
	
Window_Relationships.prototype.cursorRight = function(wrap){
	this.refreshRelationships();
	this.refresh();
	this.select(0);
};
	
Windows_Relationships.prototype.cursorLeft = function(wrap)}{
	this.refreshRelationships();
	this.refresh();
	this.select(0);
};
	
//Scene_Relationships
function Scene_Relationships(){
	this.initialize.apply(this, arguments);
};
	
Scene_Relationships.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Relationships.prototype.constructor = Scene_Relationships;  
    
Scene_Relationships.prototype.initialize = function() {
	Scene_MenuBase.prototype.initialize.call(this);
};
    
Scene_Relationships.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
	this.createQuestWindow();
};

Scene_Relationships.prototype.createRelationshipWindow = function(){
    this.oldIndex = 0;
	this.relationshipsWindow = new Window_Relationships();
	this.relationshipsWindow.setHandler("relationship", this.handleRelationships.bind(this));
	this.relationshipsWindow.setHandler("cancel", this.popScene.bind(this));
	this.addWindow(this.relationshipsWindow);
	this.relationshipsInfoW = new Window_RelationshipInfo();
	this.relationshipsInfoW.setHandler("cancel", this.cancelInfo.bind(this));
	this.addWindow(this.relationshipInfoW);
};
	
Scene_Relationships.prototype.update = function(){
	var index = this.relationshipWindow.index();
	if (this.oldIndex != index){
		var r = this.relationshipWindow._list[index];
		if (r.symbol === "relationship")
			this.relationshipInfo.setRelationship(r.ext);
			else
			this.relationshipInfo.setRelationship(-1);
		this.oldIndex = index;
	}
	Scene_Base.prototype.update.call(this);
};
	
Scene_Relationships.prototype.cancelInfo = function(){
	this.relationshipsWindow.activate();
	this.relationshipsInfoW.deactivate();
};
	
Scene_Relationships.prototype.handleRelationships = function(){
	this.relationshipWindow.deactivate();
	this.relationshipsInfoW.activate();
};
	
Scene_Menu.prototype.commandRelationships = function(){
	SceneManager.push(Scene_Relationships);
};