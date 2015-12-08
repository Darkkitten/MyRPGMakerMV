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
 * @param Face
 * @desc Which face Graphics to use?.
 * Default Package1
 * @default Package1
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
    Darkkitten_Party_Initialize = Game_Party.prototype.initialize;
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
                $gameParty.addRelationship(Number(args[1]));
                break;
                //TODO: Add Change Status code.
           case 'cat':
           		//args[1] = Relationship Id, args[2] = Catagory Number (0-3, I think)
           		$gameRelationships.changeRelationshipCat(Number(args[1]), Number(args[2]));
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
// Game_Party
//---------------------------------------------------------------------------------------------
    Game_Party.prototype.initialize = function() {
        Darkkitten_Party_Initialize.call(this);
        // Initialize Relationshions data
        this.relationships = [];
    };
    
    Game_Party.prototype.addRelationship = function(relationship_id) {
        // Does party already have Relationship?
        if (this.relationships.indexOf(relationship_id) < 0) {
            // If not, give that crap to them. They don't have a choice now.
            this.relationships.push(relationship_id);
        }
    };
        
    // Returns total number of Relationships the party has
    // filter can be "all", "progress" "completed" or "failed"
    Game_Party.prototype.totalRelationships = function(filter) {
        // Returns a list of ALL Relationships
        if (filter === undefined || filter === "all")
            return this.relationships.length;
        // Time to cycle through Relationships....(dammit, I did this exact thing in the Relationships list window)
        var count = 0;
        for (var i = 0; i < this.relationships.length; i++) {
            var q = $gameRelationships.get(this.relationships[i]);
            if (q.current_status === filter.toLowerCase())
                count++;
        }
        return count;
    };
    
    // Gets all Relationship id's 
    Game_Party.prototype.getRelationships = function(filter) {
        // Returns a list of ALL Relationships
        if (filter === undefined || filter === "all")
            return this.relationships;
        // Time to cycle through Relationships....(dammit, I did this exact thing in the Relationship list window)
        var data = [];
        for (i = 0; i < this.relationships.length; i++) {
            var q = $gameRelationships.get(this.relationships[i]);
            if (q.current_status === filter.toLowerCase())
                data.push(q.relationshipId);
        }
        return data;
    };
    
    // This method is actually extremely useless. Ignore it for now.
    Game_Party.prototype.getRelationship = function(index) {
        return $gameRelationships.get(this.relationships[index]);
    };
    
    Game_Party.prototype.hasRelationship = function(relationship_id){
        // Returns whether or not they have the Relationship
        return this.relationships.indexOf(relationship_id) > -1;
    };
    
    // This checks a list of relationships and its status.
    // If the party has all and they match the input filter, it returns true
    // Used to check a range of relationships completion
    Game_Party.prototype.hasRelationships = function(relationships, filter) {
        flag = true;
        for (i = 0; i < relationships.length; i++) {
            if (!this.hasRelationship(relationships[i]))
                flag = false;
            if ($gameRelationships.get(relationships[i]).status !== filter)
                flag = false;
        }
        return flag;
    };
    
//---------------------------------------------------------------------------------------------
// Game_Relationship
//---------------------------------------------------------------------------------------------
    function Game_Relationship() {
        this.initialize.apply(this, arguments);
    }
    
    Game_Relationship.prototype.initialize = function(relationshipId) {
        var relationshipsData = $dataRelationships[relationshipId];
        this.relationshipId = relationshipId;
        this.rawData = relationshipsData;
        this.cat = relationshipsData.cat;
        this.name = relationshipsData.name;
        this.relationshiplvl = $gameVariables[relationshipsData.levelvar];
        this.desc = relationshipsData.desc;
        this.likes = relationshipsData.likes;
        this.dislikes = relationshipsData.dislikes;
        this.location = relationshipsData.eventid;
        this.current_status = "Unknown";
        //var rlevel = relationshipData.levelvar;
    };
    
    
    Game_Relationship.prototype.mastered = function() {
        this.current_status = "Mastered";
    };
    
    Game_Relationship.prototype.isKnown = function() {
        this.current_status = "Known";
    };
    
    Game_Relationship.prototype.hated = function() {
        this.current_status = "Hated";
    };
    
    Game_Relationship.prototype.loved = function() {
        this.current_status = "Loved";
    };
    
    Game_Relationship.prototype.isUnknown = function(){
		this.current_status = "Unknown";
	};
	
	Game_Relationship.prototype.disliked = function(){
		this.current_status = "Disliked";
	};
	
    Game_Relationship.prototype.liked = function(){
    	this.current_status = "Liked";
    };
    
    Game_Relationship.prototype.reset = function(levelvari) {
        this.current_status = "none";
        this.relationshiplvl = 0;
        $gameVariable.setValue(this.rlevel, 0);
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

//---------------------------------------------------------------------------------------------
// Window_Base
//---------------------------------------------------------------------------------------------
    Window_Base.prototype.sliceText = function(text, width) {
        var words = text.split(" ");
        if (words.length === 1)
            return words;
        var result = [];
        var current_text = words.shift();
        for (i = 0; i < words.length; i++) {
            var word = words[i];
            var textW = this.contents.measureTextWidth(current_text + " " + word);
            if (textW > width) {
                result.push(current_text);
                current_text = word;
            } else {
                current_text += " " + word;
            }
            if (i >= words.length - 1)
                result.push(current_text); 
        }
        return result;
    };
//---------------------------------------------------------------------------------------------
// Window_RelationshipInfo
//---------------------------------------------------------------------------------------------
    function Window_RelationshipInfo() {
        this.initialize.apply(this, arguments);
    }
    
    Window_RelationshipInfo.prototype = Object.create(Window_Selectable.prototype);
    Window_RelationshipInfo.prototype.constructor = Window_RelationshipInfo;
    
    Window_RelationshipInfo.prototype.initialize = function() {
        var xx = 320;
        this.faceImage = Darkkitten.Parameters['Face'];
        if (this.faceImg !== '')
            this.faceImg = ImageManager.loadFace(this.faceImg, 0);
        this.relationship = 0;
        this.offY = 0;
        this.lineY = 0;
        this.resizeFlag = false;
        Window_Selectable.prototype.initialize.call(this, xx, 0, Graphics.boxWidth - 320, Graphics.boxHeight);
        this.relationshipBitmap = new Bitmap(this.contentsWidth(), this.contentsHeight());
        this.refresh();
    };
    
    Window_RelationshipInfo.prototype.setRelationship = function(relationship_id) {
        this.relationship = relationship_id;
        this.offY = 0;
        this.resizeFlag = false;
        this.createrelationshipBitmap();
        this.refresh();
    };
    
    Window_RelationshipInfo.prototype.refresh = function() {
        this.contents.clear();
        if (this.relationship > 0) {
            this.contents.blt(this.relationshipBitmap, 0, this.offY, this.contentsWidth(), this.contentsHeight(), 0, 0, this.contentsWidth(), this.contentsHeight());
        }
    };
    
    // This function is used to keep track of the height of the bitmap, has to be called after every line of text drawn
    Window_RelationshipInfo.prototype.write = function() {
        this.lineY += this.lineHeight() + this.textPadding();
        if (this.lineY > this.relationshipBitmap.height) {
            this.relationshipBitmap.resize(this.relationshipBitmap.width, this.lineY);
            this.resizeFlag = true;
        }
    };
        
    Window_RelationshipInfo.prototype.createrelationshipBitmap = function() {
        this.relationshipBitmap.clear();
        if (this.relationship > 0) {
            this.relationshipBitmap.paintOpacity = 255;
            var q = $gameRelationships.get(this.relationship);
            this.drawRelationshipInfo(q);
            this.drawRelationshipLikesDislikes(q);
            // Check for resize, then redraw
            if (this.resizeFlag) {
                this.resizeFlag = false;
                this.createrelationshipBitmap();
            }
            if (this.faceImg !== '' && q.current_status === "Known") {
                this.relationshipBitmap.paintOpacity =  128;
                this.relationshipBitmap.blt(this.faceImg, 0, 0, this.faceImg.width, this.faceImg.height, 
                    this.contentsWidth() / 2 - this.faceImg.width / 2, 
                    this.contentsHeight() / 2 - this.faceImg.height / 2);
            }
        }
    };
    
    Window_RelationshipInfo.prototype.drawRelationshipInfo = function(q) {
        var headerX = 0;
        this.relationshipBitmap.paintOpacity = 255;
        this.lineY = 0;
        this.relationshipBitmap.textColor = this.systemColor();
        this.relationshipBitmap.drawText(q.name, headerX, this.lineY, this.contentsWidth() - headerX, this.lineHeight());
        this.write();
        this.relationshipBitmap.textColor = this.normalColor();
        var lines = this.sliceText(q.desc, this.contentsWidth());
        for (i = 0; i < lines.length; i++) {
            this.relationshipBitmap.drawText(lines[i], 0, this.lineY, this.contentsWidth(), this.lineHeight());
            this.write();
        }
        this.drawHorzLine(this.lineY);
        this.write();
    };
    
       
    Window_RelationshipInfo.prototype.drawRelationshipLikesDislikes = function(q) {
        var bullet = String("-" ) + " ";
        // Draw Likes
        this.relationshipBitmap.textColor = this.systemColor(); 
        this.relationshipBitmap.drawText("Likes:", 0, this.lineY, this.contentsWidth(), this.lineHeight());
        this.write();
        this.relationshipBitmap.textColor = this.normalColor();
        for (i = 0; i < q.likes.length; i++) {
            var likes = q.likes[i];
            // If the like is hidden and girl hasn't hold you.
            if (likes[1] === true) {
                // Draw this shit as hidden
                //var hidden = bullet + (Darkkitten["Config"]["RelationshipSystem"]["Hidden Text"] || "??????");
                var hidden = Bullet + Darkkitten.Parameters['Hidden Text'];
                this.relationshipBitmap.drawText(hidden, 0, this.lineY, this.contentsWidth(), this.lineHeight());
                this.write();
                continue;
            }
            var likeditems = null;
            this.relationshipBitmap.paintOpacity = 160;
            switch (likes[0]) {
                case "item":
                    likeditems = $dataItems[likes[1]];
                    this.relationshipBitmap.drawText(bullet, 0, this.lineY, this.contentsWidth(), this.lineHeight());
                    this.drawItemName(likeditems, this.contents.measureTextWidth(bullet), this.lineY, this.contentsWidth());
                    this.write();
                    break;
            }
        }
        // Draw Dislikes
        this.relationshipBitmap.textColor = this.systemColor(); 
        this.relationshipBitmap.drawText("Dislikes:", 0, this.lineY, this.contentsWidth(), this.lineHeight());
        this.write();
        this.relationshipBitmap.textColor = this.normalColor();
        for (i = 0; i < q.dislikes.length; i++) {
            var dislikes = q.dislikes[i];
            // If the like is hidden and girl hasn't hold you.
            if (dislikes[1] === true) {
                // Draw this shit as hidden
                //var hidden = bullet + (Darkkitten["Config"]["RelationshipSystem"]["Hidden Text"] || "??????");
                //this.hidden = bullet + Darkkitten.Parameters['Hidden Text'];
                this.relationshipBitmap.drawText(hidden, 0, this.lineY, this.contentsWidth(), this.lineHeight());
                this.write();
                continue;
            }
            var dislikeditems = null; 
            this.relationshipBitmap.paintOpacity =  160 ;
            switch (dislikes[0]) {
                case "item":
                    dislikeditems = $dataItems[dislikes[1]];
                    this.relationshipBitmap.drawText(bullet, 0, this.lineY, this.contentsWidth(), this.lineHeight());
                    this.drawItemName(dislikeditems, this.contents.measureTextWidth(bullet), this.lineY, this.contentsWidth());
                    this.write();
                    break;
            }
        }
    };
    
    // Borrow some drawing methods since we're drawing to a secondary bitmap
    Window_RelationshipInfo.prototype.drawItemName = function(item, x, y, width) {
        width = width || 312;
        if (item) {
            var iconBoxWidth = Window_Base._iconWidth + 8;
            this.relationshipBitmap.textColor = this.normalColor();
            this.drawIcon(item.iconIndex, x - 2, y + 2);
            this.relationshipBitmap.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth, this.lineHeight());
        }
    };
    
    Window_RelationshipInfo.prototype.drawIcon = function(iconIndex, x, y) {
        var bitmap = ImageManager.loadSystem('IconSet');
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = iconIndex % 16 * pw;
        var sy = Math.floor(iconIndex / 16) * ph;
        this.relationshipBitmap.blt(bitmap, sx, sy, pw, ph, x, y);
    };
    
    Window_RelationshipInfo.prototype.drawHorzLine = function(y) {
        var lineY = y + this.lineHeight() / 2 - 1;
        this.relationshipBitmap.paintOpacity = 48;
        this.relationshipBitmap.fillRect(0, lineY, this.contentsWidth(), 2, this.normalColor());
        this.relationshipBitmap.paintOpacity = 255;
    };
    
    // Update the up/down arrows to indicate scrolling is available
    Window_RelationshipInfo.prototype.updateArrows = function() {
        this.downArrowVisible = (this.relationshipBitmap.height > this.contentsHeight() && this.offY < this.relationshipBitmap.height - this.contentsHeight());
        this.upArrowVisible = this.offY > 0;
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
    
//---------------------------------------------------------------------------------------------
// Window_Relationships
//---------------------------------------------------------------------------------------------
    function Window_Relationships() {
        this.initialize.apply(this, arguments);
    }

    Window_Relationships.prototype = Object.create(Window_Command.prototype);
    Window_Relationships.prototype.constructor = Window_Relationships;
    
    Window_Relationships.prototype.initialize = function() {
        var xx = Graphics.boxWidth - 320;
        var yy = this.fittingHeight(1);
        // Stores all Relationships available from $gameParty
        this.qFilters = ["all", "Unknown", "Known"];
        this.filterIndex = 0;
        this.data = [];
        this.cats = $gameRelationships.categories();
        this.expanded = [];
        for (i = 0; i < this.cats.length; i++) 
            this.expanded[i] = false;
        this.filter = "all";
        this.refreshRelationships();
        Window_Command.prototype.initialize.call(this, xx, yy);
    };
    
    Window_Relationships.prototype.windowWidth = function() {
        return 320;
    };

    Window_Relationships.prototype.numVisibleRows = function() {
        return 10;
    };
    
    Window_Relationships.prototype.windowHeight = function() {
        return Graphics.boxHeight - this.fittingHeight(1);
    };
    
    Window_Relationships.prototype.drawItem = function(index) {
        var item = this._list[index];
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        var tempX = 0;
        if (item.symbol === "relationship") {
            var q = $gameRelationships.get(Number(item.ext));
            if (q.icon > -1 && Darkkitten.Parameters['USe Icons'].toLowerCase() === "true") {
                this.drawIcon(q.icon, rect.x + 8, rect.y + 2);
                tempX = 40;
            }
        }
        this.drawText(this.commandName(index), rect.x + tempX / 2, rect.y, rect.width, align);
    };
    
    
    Window_Relationships.prototype.relationshipData = function(relationship_id) {
        return $gameRelationships.get(relationship_id);
    };
    
    Window_Relationships.prototype.refreshRelationships = function() {
        this.data = $gameParty.getRelationships();
        this.cats = $gameRelationships.categories();
        this.counter = [];
        for (i = 0; i < this.cats.length; i++) 
            this.expanded[i] = false;
        for (i = 0; i < this.cats.length; i++) {
            this.counter[i] = 0;
            for (j = 0; j < this.data.length; j++) {
                var q = $gameRelationships.get(this.data[j]);
                if (q.cat == i && (this.filter == q.current_status || this.filter == "all"))
                    this.counter[i]++;
            }
        }
    };

    Window_Relationships.prototype.setFilter = function(filter) {
        this.filter = filter;
    };

    Window_Relationships.prototype.toggle = function(cat) {
        this.expanded[cat] = !this.expanded[cat];
        this.refresh();
    };
    
    Window_Relationships.prototype.makeCommandList = function() {
        var q;
        var flag = false;
        var count = "";
        var useCats   = false;
        var catMode   = 0;
        var showCount = false;
        if (useCats === "true") {
            for (i = 0; i < this.cats.length; i++) {
                flag = true;
                if (showCount === "true")
                    count = " (" + String(this.counter[i]) + ")";
                if (catMode === 1 && this.counter[i] === 0)
                    flag = false;
                if (catMode > 0 || this.counter[i] > 0)
                    this.addCommand(this.cats[i] + count, "cat", flag, String(i));
                if (this.expanded[i]) {
                    flag = false;
                    for (j = 0; j < this.data.length; j++) {
                        q = $gameRelationships.get(this.data[j]);
                        if ((q.current_status == this.filter || this.filter == "all") && i == q.cat) {
                            flag = true;
                            this.addCommand("  " + q.name, "relationship", true, q.relationshipId);
                        }
                    }
                    if (!flag)
                        this.addCommand("  " + "No Relationships");
                }
            }
        } else {
            for (i = 0; i < this.data.length; i++) {
                q = $gameRelationships.get(this.data[i]);
                if (q.current_status == this.filter || this.filter == "all")
                    this.addCommand(q.name, "relationship", true, q.relationshipId);
            }
        }
        if (this._list.length < 1) {
            this.addCommand("No Relationships");
        }
    };
    
    Window_Relationships.prototype.cursorRight = function(wrap) {
        this.filterIndex = this.filterIndex + 1 > 3 ? 0 : this.filterIndex + 1;
        this.filter = this.qFilters[this.filterIndex];
        this.refreshRelationships();
        this.refresh();
        this.select(0);
    };

    Window_Relationships.prototype.cursorLeft = function(wrap) {
        this.filterIndex = this.filterIndex - 1 < 0 ? 3 : this.filterIndex - 1;
        this.filter = this.qFilters[this.filterIndex];
        this.refreshRelationships();
        this.refresh();
        this.select(0);
    };
//---------------------------------------------------------------------------------------------
// Window_RelationshipFilter
//---------------------------------------------------------------------------------------------
    function Window_RelationshipFilter() {
        this.initialize.apply(this, arguments);
    }

    Window_RelationshipFilter.prototype = Object.create(Window_Base.prototype);
    Window_RelationshipFilter.prototype.constructor = Window_RelationshipFilter;

    Window_RelationshipFilter.prototype.initialize = function() {
        this.qFilters = [
            "All",
            "Unknown",
            "Known"
        ];
        var xx = Graphics.boxWidth - 320;
        var yy = Graphics.boxHeight - this.windowHeight();
        this.filterIndex = 0;
        this.filter = "";
        var width = this.windowWidth();
        var height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, xx, yy, width, height);
        this.refresh();
    };

    Window_RelationshipFilter.prototype.windowWidth = function() {
        return 320;
    };

    Window_RelationshipFilter.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };

    Window_RelationshipFilter.prototype.refresh = function() {
        if (this.filter == this.qFilters[this.filterIndex])
            return;
        this.filter = this.qFilters[this.filterIndex];
        this.contents.clear();
        this.drawText(this.filter, 0, 0, this.contentsWidth(), "center");
    };
//---------------------------------------------------------------------------------------------
// Scene_Relationship
//---------------------------------------------------------------------------------------------
    function Scene_Relationship() {
        this.initialize.apply(this, arguments);
    }

    Scene_Relationship.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Relationship.prototype.constructor = Scene_Relationship;    

    Scene_Relationship.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    
    Scene_Relationship.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.qFilters = ["all", "unknown", "known"];
        this.createrelationshipWindow();
    };
    
    Scene_Relationship.prototype.createrelationshipWindow = function() {
        this.oldIndex = 0;
        this.relationshipWindow = new Window_Relationships();
        this.relationshipWindow.setHandler("cat", this.handleCategory.bind(this));
        this.relationshipWindow.setHandler("relationship", this.handleRelationship.bind(this));
        this.relationshipWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this.relationshipWindow);
        this.relationshipInfo = new Window_RelationshipInfo();
        this.relationshipInfo.setHandler("cancel", this.cancelInfo.bind(this));
        this.addWindow(this.relationshipInfo);
        this.relationshipFilter = new Window_RelationshipFilter();
        this.addWindow(this.relationshipFilter);
    };
    
    Scene_Relationship.prototype.update = function() {
        var index = this.relationshipWindow.index();
        if (this.oldIndex != index) {
            var q = this.relationshipWindow._list[index];
            if (q.symbol === "relationship")
                this.relationshipInfo.setRelationship(q.ext);
            else 
                this.relationshipInfo.setRelationship(-1);
            this.oldIndex = index;
        }
        this.relationshipFilter.filterIndex = this.relationshipWindow.filterIndex;
        this.relationshipFilter.refresh();
        Scene_Base.prototype.update.call(this);
    };
    
    Scene_Relationship.prototype.cancelInfo = function() {
        this.relationshipWindow.activate();
        this.relationshipInfo.deactivate();
    };
    
    Scene_Relationship.prototype.handleRelationship = function() {
        this.relationshipWindow.deactivate();
        this.relationshipInfo.activate();
    };
    
    Scene_Relationship.prototype.handleCategory = function() {
        var catIndex = this.relationshipWindow.currentExt();
        this.relationshipWindow.toggle(catIndex);
        this.relationshipWindow.refresh();
        this.relationshipWindow.activate();
    };

    // This is used to open up the Relationship Log from the menu
    // Used in conjunction with Yanfly's Menu plugin
    Scene_Menu.prototype.commandRelationship = function() {
        SceneManager.push(Scene_Relationship);
    };