/*:
 * @plugindesc v0.0.2 This script creates a Relationship system / Bio window based on V's Relationship / Bio window for RPG Maker VX Ace.
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
 * @param Graphics
 * @desc Which face Graphics to use?.
 * Default Package1_1
 * @default Package1_1
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
 
// Import 'Relationship System' 
var Darkkitten = Darkkitten || {};
Darkkitten.Parameters = PluginManager.parameters('Relationships');

var Imported = Imported || {};
Imported.Relationships = true;


// Initialize global Relationship variables
var $dataRelationships = null;
var $gameRelationships = null;

// Load Relationship data
DataManager._databaseFiles.push(
    {name: "$dataRelationships", src: "Relationships.json"}
);

//---------------------------------------------------------------------------------------------
// Alias methods
//---------------------------------------------------------------------------------------------
    Darkkitten_Relationship_Initialize = Game_Plaer.prototype.initialize;
    Darkkitten_Data_Initialize  = DataManager.createGameObjects;
    Darkkitten_Save_Data        = DataManager.makeSaveContents;
    Darkkitten_Load_Data        = DataManager.extractSaveContents;
    Darkkitten_Plugin_Commands  = Game_Interpreter.prototype.pluginCommand;

//---------------------------------------------------------------------------------------------
// Plugin Commands
//---------------------------------------------------------------------------------------------
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        Darkkitten_Plugin_Commands.call(this, command, args);
        if (command.toLowerCase() === "r_data") {
            switch (args[0].toLowerCase()) {
            case 'open':
                SceneManager.push(Scene_Relationship);
                break;
            case 'add':
                $gamePlayer.addRelationship(Number(args[1]));
                break;
                //TODO: Add Change Status code.
           case 'addlvl':
				//First Number is The ID of the Relationship, the Second is the Level Value.
           		//$gameRelationships.addRelationshipLevel(Number(args[1]), Number(args[2]));
           break;
          }
       }
    };
//---------------------------------------------------------------------------------------------
// DataManager
//---------------------------------------------------------------------------------------------
	

    DataManager.makeSaveContents = function() {
        contents = Darkkitten_Save_Data.call(this);
        // Include the Relationships in the save file
        contents.relationships = $gameRelationships;
        console.log(contents.relationships);
        return contents;
    };
    
    DataManager.extractSaveContents = function(contents) {
        Darkkitten_Load_Data.call(this, contents);
        // Then take them back because we really don't trust banks
        $gameRelationships = contents.relationships;
                console.log(contents.relationships);
    };
    
    DataManager.createGameObjects = function() {
        Darkkitten_Data_Initialize.call(this);
        // Create global Relationships
        $gameRelationships = new Game_Relationships();
    };


    
//---------------------------------------------------------------------------------------------
// Game_Player
//---------------------------------------------------------------------------------------------

	Game_Player.prototype.initialize = function() {
		Darkkitten_Relationship_Initialize.call(this);
		//Init Relationship Data
		this.relationships = [];	
	};
	
	Game_Player.prototype.addRelationship = function(relationship_id){
		//Does Player already have Relationship?
		if (this.relationships.indexOf(relationship_id) <0){
			this.relationships.push(relationship_id);
		}	
	};
	
	//Calculated the total number of Relationships player Has.
	Game_Player.prototype.totalRelationships = function(filter) {
		//Returns a list of ALL Relationships
		if (filter === undefined || filter === "all")
		return this.relationships.length;
		
		var count 0;
		for (i = 0; i < this.relationships.legnth; i += 1) {
			var r = $gameRelationships.get(this.relationships[i]);
			if (r.status === filter.toLowerCase())
			count += 1;
		}
		return count;
	};
	//Get's all Relationships Ids
	Game_Player.prototype.getRelationships =function(filter){
		if (filter === undefined || filter === "all")
			return this.relationships;
		var data = [];
		for (i = 0; i < this.relationships.legnth; i += 1){
			var r = $gameRelationships.get(this.relationships[i]);
			if (r.current_status === filter.toLowerCase())
				data.push(r.Relationshipid);
		}
		return data;
	};

	Game_Player.prototype.hasRelationships = function(relationships, filter){
		flag = true;
		for (i = 0; i < relationships.length; i += 1) {
			if (!this.hasRelationship(relationships[i]))
			flag = false;
			if ($gameRelationships.get(relationships[i]).current_status !== filter)
			flag = false;
		}
		return flag;
	}


//---------------------------------------------------------------------------------------------
// Game_Relationship
//---------------------------------------------------------------------------------------------
    function Game_Relationship() {
        this.initialize.apply(this, arguments);
    }
    
    Game_Relationship.prototype.initialize = function(relationshipId) {
        var relationshipsData = $dataRelationships[relationshipId];
        this.relationshipsId = relationshipId;
        this.rawData = relationshipsData;
        
        this._image = relatshionshipData.image;
        this.cat = relationshipData.cat;
        this._name = relationshipData.name;
        this._desc = relationshipData.desc;
        this._defaultMaxLevel = relationshipData.DefaultMaxLevel;
        this._defaultMaxExp = relationshipData.DefaultMaxExp;
        this._relationship_LevelVariable = relationshipData.Relationship_LevelVariable;
        this._eventID = relationshipData.eventid;
        this._likes = relationshipData.likes;
        this._dislikes = relationshipData.dislikes;
        this.current_status = "progress";
    };
    


//---------------------------------------------------------------------------------------------
// Game_Relationships
//---------------------------------------------------------------------------------------------
    function Game_Relationships() {
        this.initialize.apply(this, arguments);
    }
    
    Game_Relationships.prototype.initialize = function() {
        this.data = [];
    };
    
    Game_Relationships.prototype.get = function(relationship_id) {
        if ($dataRelationships[relationship_id]) {
            if (!this.data[relationship_id]) {
                this.data[relationship_id] = new Game_Relationship(relationship_id);
            }
            return this.data[relationship_id];
        }
        return null;
    };
    
    Game_Relationships.prototype.categories = function() {
        if ($dataRelationships[0])
            return $dataRelationships[0];
        return null;
    };
    
    Game_Relationships.prototype.totalRelationships = function(filter) {
        // Returns a list of ALL Relationships
        if (filter === undefined || filter === "all")
            return $dataRelationships.length;
        // Time to cycle through Relationships....(dammit, I did this exact thing in the Relationships list window)
        var count = 0;
        for (i = 0; i < $dataRelationships.length; i++) {
            var q = this.get(this.relationships[i]);
            if (q.current_status === filter.toLowerCase())
                count++;
        }
        return data;
    };
    
    Game_Relationships.prototype.changeRelationshipCat = function(relationship_id, catagoryid) {
    	//Todo: Write the code to change the Relationship Catagory.
	};