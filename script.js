// GLOBAL VARIABLES
var competitionName = "";

var numTeams;
var teamsIds = []; // array of teamId's

var numGroups;
var groupsIds = []; // array of groupId's
var groups = []; // array of group's

var numGames;
var games = []; // array of game's

//----------------------------------------------------------------------

// CLASSES
function teamId(id, name)
{
	this.id = id;
	this.name = name;	
}

function team(id, name)
{
	this.id = id;
	this.name = name;
	this.played = 0;
	this.won = 0;
	this.draw = 0;
	this.lost = 0;
	this.goalsFor = 0;
	this.goalsAgainst = 0;
	this.goalDifference = this.goalsFor - this.goalsAgainst;
	this.points = 0;
}

function groupId(id, numTeams)
{
	this.id = id;
	this.numTeams = numTeams;
	this.numGames = (this.numTeams - 1) * 2;
}

function group(id, teams)
{
	this.id = id;
	this.teams = teams; // array of team's
}

function game(gameId, groupId, home, homeGoals, away, awayGoals)
{
	this.gameId = gameId;
	this.groupId = groupId;
	this.home = home;
	this.homeGoals = homeGoals;
	this.away = away;
	this.awayGoals = awayGoals;
}

//----------------------------------------------------------------------

// FUNCTIONS
function start(data)
{
	var obj = JSON.parse(data);

	// fill competitionName variable
	competitionName = obj["competition"];

	// fill numTeams variable
	numTeams = obj["teams"].length;

	// fill teamsIds array variable
	for(var i = 0; i < numTeams; i++)
	{
		var id = obj["teams"][i]["id"];
		var name = obj["teams"][i]["name"];
		
		teamsIds.push(new teamId(id, name));
	}

	// fill numGroups variable
	numGroups = obj["stages"]["groupStage"]["numGroups"];
	
	// fill groupsIds array variable
	for(var i = 0; i < numGroups; i++)
	{	
		var id = obj["stages"]["groupStage"]["groups"][i]["groupId"];
		var numTeamsGroup = obj["stages"]["groupStage"]["groups"][i]["numTeams"];
		
		groupsIds.push(new groupId(id, numTeamsGroup));
		
		// fill groups array variable
		var teamsGroup = []; 

		for(var j = 0; j < numTeamsGroup; j++)
		{
			var teamGroup = obj["stages"]["groupStage"]["groups"][i]["teamsNames"][j];

			for(var k = 0; k < numTeams; k++)
			{
				if(teamGroup === teamsIds[k].name)
				{
					teamsGroup.push(new team(teamsIds[k].id, teamsIds[k].name));

					break;
				}
			}
		}

		groups.push(new group(id, teamsGroup));
	}
	
	// fill games array variable
	// fill numGames variable
	numGames = 0;
	
	for(var i = 0; i < numGroups; i++)
	{					
		for(var j = 0; j < groupsIds[i].numGames; j++)
		{
			var gameTmp = obj["stages"]["groupStage"]["groups"][i]["games"][j];
			
			var id = gameTmp["id"];
			
			var home = gameTmp["teams"][0]; 
			var away = gameTmp["teams"][1]; 
			
			var homeGoals = gameTmp["goals"][0]; 
			var awayGoals = gameTmp["goals"][1]; 

			games.push(new game(id, groups[i].id, home, homeGoals, away, awayGoals));
			
			numGames++;
		}
	}	
		
	sortGamesByGameId();
	//sortGamesByGroupId();
	
	writePage(obj);
}

// sort array of games by gameId
function sortGamesByGameId()
{
	games.sort(function(a, b) {
		return a.gameId - b.gameId;
	});	
}

// sort array of games by groupId
function sortGamesByGroupId()
{
	function compare(a, b)
	{
		if(a.groupId < b.groupId)
		{
			return -1;
		}
		
		if(a.groupId > b.groupId)
		{
			return 1;
		}
	  
		return 0;
	}	
	
	games.sort(compare);	
}

function writePage(obj)
{
	// write title
	$("#competition").html("<h1>" + competitionName + "</h1>");

	// write tables of games
	writeTables();	
	
	$("#saveButton").click(function() {
		var confirmation = "";

		confirmation = "<p>Are you sure?</p>";
		confirmation += "<button id='yesButton'>Yes</button>";
		confirmation += "<button id='noButton'>No</button>";

		$("#saveContent").html(confirmation); 

		$("#yesButton").css("margin-right", "20px");
		
		$("#yesButton").click(function() {
			save(obj);
			
			var feedback = "";

			var date = new Date($.now());
			var time = date.getHours() + "h" + date.getMinutes() + "m" + date.getSeconds() + "s";

			feedback = "<p>Your work was saved at " + time + "!</p>";

			$("#saveContent").html(feedback);
		});		

		$("#noButton").click(function() {
			var feedback = "";

			feedback = "<p>Your work wasn't saved!</p>";

			$("#saveContent").html(feedback); 
		});	
	});	
}

function writeTables()
{
	var string = "";

	string += ("GAMES" + "<br><br>");

	string += ("<table>");
	string += ("<tr>");
	string += ("<th>Id</th>");
	string += ("<th>Group</th>");
	string += ("<th>Home</th>");
	string += ("<th>Result</th>");				
	string += ("<th>Away</th>");	
	string += ("</tr>");	

	for(var i = 0; i < numGames; i++)
	{
		var gameId = games[i]["gameId"];
		var groupId = games[i]["groupId"];

		var goalsHomeId = "goalsHome_" + gameId + groupId;
		var goalsAwayId = "goalsAway_" + gameId + groupId;
		
		var goalsHome = "<input type=\"text\" id=\"" + goalsHomeId + "\" value=\"" + games[i]["homeGoals"] + "\"></input>";
		var goalsAway = "<input type=\"text\" id=\"" + goalsAwayId + "\" value=\"" + games[i]["awayGoals"] + "\"></input>";		
		
		string += ("<tr>");
		string += ("<td>" + gameId + "</td>");
		string += ("<td>" + groupId + "</td>");
		string += ("<td>" + games[i]["home"] + "</td>");
		string += ("<td><div class=\"homeScore\">" + goalsHome + "</div>");
		string += ("<div class=\"awayScore\">" + goalsAway + "</div></td>");	
		string += ("<td>" + games[i]["away"] + "</td>");				
		string += ("</tr>");
	}

	string += ("</table>");

	string += "<br>";

	$("#groupGames").html(string);

	//$("table").css("border-collapse", "collapse");
	//$("table, th, td").css("border", "1px solid black");
	
	$(".homeScore").css("float", "left");
	$(".awayScore").css("float", "right");
	$("input").css("text-align", "center");
	$("input").css("width", "40px");	
	
	// header
	$("tr:nth-child(1)").css("text-align", "center");
	
	// ID
	$("td:nth-child(1)").css("text-align", "center");
	$("td:nth-child(1)").css("width", "50px");
	// Group
	$("td:nth-child(2)").css("text-align", "center");
	$("td:nth-child(2)").css("width", "60px");
	// Home
	$("td:nth-child(3)").css("width", "130px");
	// Result
	$("td:nth-child(4)").css("width", "90px");
	// Away	
	$("td:nth-child(5)").css("padding-left", "10px");
}

function updateResults(obj)
{		
	for(var i = 0; i < numGroups; i++)
	{	
		var groupId = groupsIds[i]["id"];
		var numGamesGroup = groupsIds[i]["numGames"];
		
		for(var j = 0; j < numGamesGroup; j++)
		{
			var gameId = obj["stages"]["groupStage"]["groups"][i]["games"][j]["id"];
			
			obj["stages"]["groupStage"]["groups"][i]["games"][j]["goals"][0] = $("#goalsHome_" + gameId + groupId).val();
			obj["stages"]["groupStage"]["groups"][i]["games"][j]["goals"][1] = $("#goalsAway_" + gameId + groupId).val();			
		}
	}
		
	return obj;
}

function save(obj)
{	
	obj = updateResults(obj);
	
	var data = JSON.stringify(obj);

	$.ajax( {
		type: 'POST',
		
		url: 'save.php',
		
		cache: false,
		
		data: {'data': data},
		
		error: function() {
			console.log("error!");
		},

		success: function() {
			console.log("success!");
		},

		complete: function() {
			console.log("complete!");
		}
	});
}

//----------------------------------------------------------------------

// DEBUG
function debug()
{
/*
	console.log("Test is working!");

	console.log("Test isn't doing anything...");

	console.log(competitionName);


	for(var k = 0; k < teamsIds.length; k++)
	{
		console.log(teamsIds[k]);
	}

	for(var k = 0; k < groupsIds.length; k++)
	{
		console.log(groupsIds[k]);
	}

	for(var k = 0; k < groups.length; k++)
	{
		console.log(groups[k]);
	}

	for(var k = 0; k < games.length; k++)
	{
		console.log(games[k]);
	}
*/
}

//----------------------------------------------------------------------

// MAIN
$(document).ready(function() {	
	var data = $("<div id='data'></div>");
	
	data.load("data.json", function(responseTxt, statusTxt, xhr) {
		if(statusTxt == "success")
		{
			start(responseTxt);		
		}

		if(statusTxt == "error")
		{
			console.log("ERROR!!!");
		}
	});
});
