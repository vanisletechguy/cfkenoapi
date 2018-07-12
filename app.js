const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 

app.listen(port);
app.get('/api/newround', function(req, res) {
	const user_id = req.param('id');
	const wager = req.param('wager');
	const userPicks = req.param('picks');
	const result = processRound(user_id, userPicks, wager);
	if(result.error){
		res.send('input error');
	} else {
		res.send(result);
	}
});
function processRound(user_id, userPicks, wager) {
	const userSet = new Set(processInput(userPicks));
	if (userSet.size < 5 || userSet.size > 10 || !(wager>0) || !(user_id>0)) {
		return {error: true};
	}
	let drawNumbers = new Set([]);
	while(drawNumbers.size < 20){
		drawNumbers.add(Math.floor((Math.random() * 80) + 1)); 
	}
	const matches = new Set([...userSet].filter(i => drawNumbers.has(i)));
	return {
		drawID: (new Date().valueOf()) + user_id,
		user_id: user_id,
		winner: (matches.size > 0),
		wager: wager,
		winnings: (matches.size ) * wager,
		drawPicks: [...drawNumbers],
		userPicks: [...userSet],
		matches: [...matches],
		time: Date.now()
	};
}
function processInput(userPicks){
	userPicks  = userPicks.split(',').map(Number);
	return userPicks.filter((obj) => obj)
		.filter((x) => {return x<=80 && x>=1;});
}
