//=============================================================================
// Darkkitten's Relationships Script.
//-----------------------------------------------------------------------------
// Darkkitten
//=============================================================================
//-----------------------------------------------------------------------------
// // Plugin specifications (Do not modify!)
//
/*:
 @plugindesc v0.0.1 This script creates a Relationship system / Bio window based on V's Relationship / Bio window for RPG Maker VX Ace.
 @author Darkkitten

 @help
 =============================================================================
 Introduction
 =============================================================================
 Text here
 =============================================================================
 How to use
 =============================================================================
 Text here.
 =============================================================================
 Credits

 V for creating the Ruby version of the Relationship / bio window script.
 Vlue for putting out good scripts to learn from.
 =============================================================================
 @param Use custom Background
 @desc Use a Custom Background Image.
 Default false
 @default false
 
 @param Relationship Background Image
 @desc The file path for the Background image
 Default Fountain.png
 @default Fountain.png
 
 @param Window Title
 @desc The title of the relationship window
 Default Relationships
 @default Relationships
 
 @param Use Menu Command
 @desc Use Menu Command for Access. If you choose not to use window command you can stilll access the window by using <SceneManager>.<call>(Scene_Relationships)
 Default true
 @default true
 
 @parm Use Leveling System
 @desc Use a Relationship leveling system
 Default true
 @default true
 
 @param Terms Of Feelings
 @desc Name of the feelings if Text is used.
 Default Hated, Disliked, None, Liked, Loved
 @default Hated, Disliked, None, Liked, Loved
 
 @param Term Of Mastered
 @desc Name of the Mastered TExt if Lveling System is used
 Default Mastered
 @default Mastered
 
 @param Use Polarities
 @desc Use Polarities. If true will display a gague with Love/hate Polarities, if it is False a normal gague will be used.
 Default true
 @default true
 
 @param Use Level Icons
 @desc Information Displayed If Use_Leveling_System = false, Use_Level_Icons will automaticly be false
 Default true
 @default true
 
 @param Use Title
 @desc Information to be displayed.
 Default true
 @default ture
 
 @param Use Location
 @desc Information to be displayed.
 Default true
 @default true
 
 @param Use Liked and Disliked Items
 @desc Information to be displayed
 Default true
 @default true
 
 @param Use Feelings
 @desc Information to be displayed
 Default true
 @default true
 
 @param Use Current Status
 @desc Information to be displayed
 Default true
 @default true
 
 @param Use_Gauges
 @desc Information to be displayed
 Default true
 @default true
 
 @param Use Icons
 @desc Use Reward Item Icons
 Default true
 @default true
*/

var Darkkitten = Darkkitten || {};
Darkkitten.Parameters = PluginManager.parameters('Relationships');
//Darkkitten.Param = Darkkitten.Param || {};

var Imported = Imported || {};
Imported.Relationships = true;

var Use_Custom_Background = Darkkitten.Parameters['Use_custom_Background'];
var Background = Darkkitten.Parameters['Relationship Background Image'];
var Window_Title = Darkkitten.Parameters['Window Title'];
var Use_Menu_Command = Darkkitten.Parameters['Use Menu Command'];
var Use_Leveling_System = Darkkitten.Parameters['Use Leveling System']
Array Terms_Of_Feelings = Darkkitten.Parameters['Terms Of Feelings'];
var Term_Of_Mastered = Darkkitten.Parameters['Term Of Mastered'];
var Use_Polarities = Darkkitten.Parameters['Use Polarities'];

var Use_Level_Icons = Darkkitten.Parameters['Use Level Icons'];
var Use_Title = Darkkitten.Parameters['Use Title'];
var Use_Location = Darkkitten.Parameters['Use Location'];
var Use_Liked_and_Disliked_Items = Darkkitten.Parameters['Use Liked and Disliked Items'];
var Use_Feelings = Darkkitten.Parameters['Use Feelings'];
var Use_Current_Status = Darkkitten.Parameters['Use Current Status'];
var Use_Gauges = Darkkitten.Parameters['Use Gauges'];

var Use_Icons = Darkkitten.Parameters['Use Icons'];

var getInformation_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    getInformation_pluginCommand.call(this, command, args);
    if (command === 'Relationships'){
		switch (args[0].toLowercase()){
			case 'open':
			break;
			case 'add':
			break;
			case 'change_location':
			break;
			case 'change_status':
			break;
			case 'change_lvl_icons':
			break;
			case 'change_lvl4_reward':
			break;
			case 'change_lvl8_reward':
			break;
			case 'change_lvl12_reward':
			break;
		}
	}
    
    
    
    