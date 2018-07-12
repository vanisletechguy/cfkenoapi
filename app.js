var express = require('express');
var app = express();
var port = process.env.PORT || 3000; 

app.listen(port);
app.get('/api/newround', function(req, res) {
	var user_id = req.param('id');
	var wager = req.param('wager');
	var userPicks = req.param('picks');
	var result = processRound(user_id, userPicks, wager);
	if(result.error){
		res.send('input error');
	} else {
		res.send(result);
	}
});
function processRound(user_id, userPicks, wager) {
	var drawID = (new Date().valueOf()) + user_id;
	var draw = new Set([]);
	var picks  = userPicks.split(',').map(Number);
	var newpicks = new Set(picks.filter((obj) => obj));
	if (newpicks.size < 5 || newpicks.size > 10) {return {error: true};}
	while(draw.size < 20){
		draw.add(Math.floor((Math.random() * 80) + 1)); 
	}
	const matches = new Set([...newpicks].filter(i => draw.has(i)));
	const winner = (matches.size > 0);
	return {
		drawID: drawID,
		user_id: user_id,
		winner: winner,
		wager: wager,
		winnings: (matches.size ) * wager,
		drawPicks: [...draw],
		userPicks: [...newpicks],
		matches: [...matches],
		time: Date.now()
	};
}
