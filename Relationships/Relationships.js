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
 * @desc Information to be displayed
 * Default true
 * @default true
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

function() {	
	var Use_Custom_Background = Darkkitten.Parameters['Use_custom_Background'];
	var Background = Darkkitten.Parameters['Relationship Background Image'];
	var Window_Title = Darkkitten.Parameters['Window Title'];
	var Use_Leveling_System = Darkkitten.Parameters['Use Leveling System']
	var Terms_Of_Feelings[] = Darkkitten.Parameters['Terms Of Feelings'];
	var Term_Of_Mastered = Darkkitten.Parameters['Term Of Mastered'];
	//var Use_Polarities = Darkkitten.Parameters['Use Polarities'];

	var Use_Title = Darkkitten.Parameters['Use Title'];
	var Use_Liked_and_Disliked_Items = Darkkitten.Parameters['Use Liked and Disliked Items'];
	
	var $Relationship_info = null;
	var $Relationship_data = null;

	var getInformation_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
    	getInformation_pluginCommand.call(this, command, args);
   	 if (command === 'Relationships'){
		 switch (args[0].toLowerCase()){
			case 'open':
			SceneManager.push(Scene_Relationship);
			break;
			case 'add':
			$gameParty.addRelationship(Number(args[1]));
			break;
			case 'status_liked':
			//$gameSystem.change_status(args[1], args[2]);	
			break;
			case 'status_loved':
			break;
			case 'status_none':
			break;
			case 'status_hated':
			break;
			case 'status_disliked':
			break;
			case 'status_mastered':
			break;
			case 'liked_item':
			//$gameSystem.change_liked_item(arg[1], arg[2]);
			break;
			case 'diskliked_item':
			//$gameSystem.change_disliked_item(arg[1], arg[2]);
			break;
			case 'lvl4_reward':
			//$gameSystem.change_lvl4_reward(arg[1], arg[2]);
			break;
			case 'lvl8_reward':
			//$gameSystem.change_lvl8_reward(arg[1], arg[2]);
			break;
			case 'lvl12_reward':
			//$gameSystem.change_lvl12_reward(arg[1], arg[2]);
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
	Game_Party.prototype.totalRelationships = function(filter){
		
		//returns a list of all Relationships 
		if (filter === undefined || fileter === "all")
		return this.relationships.length;
		//Cycle through all Relationships
		var count = 0;
		for (var i = 0; i < this.relationships.length; i += 1){
			var q = $Relationship_info.get(this.relationships[i]);
			if q.status == filter.toLowerCase())
			count += 1;
		}
		return count;
	};
	
	// Get Alll RElationship Id's
	Game_Party.prototype.getRelationships = function(filter){
		// Returns a List of all relationships.
		if (filter === undefined || filter === "all")
		return this.relationships;
		//Time to cycle through Relationships
		var data = [];
		for (var i = 0; i < this.relationships.length; i += 1 ){
			var q = $Relationship_info.get(this.relationships[i]);
			if (q.status == filter.toLowerCase())
			data.push(q.relationshipId);
		}
		return data;
	};
	
	Game_Party.prototype.getRelationship = function(index){
		return $Relationship_info.get(this.relationships[index]);
	};
	
	Game_Party.prototype.hasRelationship = function(relationshipID){
	//returns weather or not they have relationship
		return this.relationships.indexOf(relationshipID) > -1;
	};
	
	Game_Party.prototype.hasRelationships = function(relationships, filter){
		flag = true;
		for var i = 0; relationships.length; i += 1) {
			if (!this.hasRelationship(relationships[i]))
			flag = false;
			if ($Relationship_info.get(relationships[i]).statues !== filter)
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
		this.lvl4reward = relationshipData.lvl4reward; //Item Variable from Database
		this.lvl8reward = relationshipData.lvl8reward; //Item Variable from Database
		this.lvl12reward = relationshipData.lvl12reward; //Item Variable from Database
		this.relationshpLevel = $gameVariables.value(relationshipData.level); //Game Viarable from Database
		this.likes = relationshipData.likes; //Item Variable from Database
		this.dislikes = relationshipData.dislikes; //Item Variable from Database
		this.location = $gameMap.event(relationshipData.location);
		//this.location = relationshipData.location; //Event Location from Database
		//Todo: App Polarities

	};
	//ToDo: All Relationship Level Rewards
	Game_RelationShip.prototype.giveRewards= function() {
		for (var i = 0; i < this.rewards.length; i += 1){
			
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
	}
	
	Game_Relationship.prototype.loved = function(){
		return this.current_status == Terms_Of_Feelings[4];
	}
	
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
	
	Game_Relationships.prototype.totalRelationships = function(filter){
		//returns a list of All relationships
		if (filter === undefined || filter === "all")
		return $relationshipData.legnth;
		//Cycle all Relationships
		var count = 0;
		for (var i = 0;i < $relationshipData.length; i += 1){
			var q = this.get(this.relationships[i]);
			if (q.status === filter.toLowerCase())
			count += 1;
			
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
		for (var i = 0; words.legnth; i += 1){
			
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
    	this.Face = ImageManager.loadFace(this.FaceImage, this.FaceID);
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
		if (this.relationship > 0){
			this.relationshipBitmap.paintOpacity = 255;
		var q = $RelationshipData.get(this.relationship);
		this.drawRelationshipInfo(q);
		}
		//Check for resize, then redraw
		if (this.resizeFlag){	
			this.resizeFlag = false;
			this.createRelationshipBitmap();
		}
	};
	
	
	
}();