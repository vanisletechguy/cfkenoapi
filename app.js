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
	const amountWon = winnings(userSet.size,matches.size,wager);
	return {
		drawID: (new Date().valueOf()) + user_id,
		user_id: user_id,
		winner: (winnings > 0),
		wager: wager,
		winnings: amountWon,
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
function winnings(numOfPicks, numOfMatches, wager){
	const payTable = {
		5: {5: 500, 4: 15, 3: 2},
		6: {6: 1500, 5: 50, 4: 5, 3: 1},
		7: {7: 5000, 6: 150, 5: 15, 4: 2, 3: 1},
		8: {8: 1500, 7: 400, 6: 50, 5: 10, 4: 2},
		9: {9: 2500, 8: 2500, 7: 200, 6: 25, 5: 4, 4: 1},
		10: {10: 200000, 9: 10000, 8: 500, 7: 50, 6: 10, 5: 3}
	};
	const winnings = payTable[numOfPicks][numOfMatches] * wager;
	return (winnings>0) ? winnings : 0;
}
