var TOP = 1, DOWN = 2, LEFT = 3, RIGHT = 4;
function Player2048(n, width, depth) {


	this.width = width;
	this.depth = depth;

	this.boardSize = n;

	KeyboardInputManager.prototype.targetIsInput = function(event) {
		return false;
	};
}

Player2048.prototype.getCurrentState = function() {

	var currentState = [];

	for (var j = 0; j < this.boardSize; j++) {

		for (var i = 0; i < this.boardSize; i++) {

			var e = document.body.getElementsByClassName("tile-position-"
					+ (i + 1) + "-" + (j + 1))[document.body
					.getElementsByClassName("tile-position-" + (i + 1) + "-"
							+ (j + 1)).length - 1];

			/*
			 * Getting element i,j value
			 */
			var value = e != undefined ? parseInt(e
					.getElementsByClassName("tile-inner")[0].textContent) : 0;

			currentState[i + j * this.boardSize] = value;
		}
	}

	return currentState;
};

Player2048.prototype.move = function(direction) {

	switch (direction) {
	case TOP:
		this.simulateKeyEvent(38); // TOP
		break;
	case DOWN:
		this.simulateKeyEvent(40); // DOWN
		break;
	case LEFT:
		this.simulateKeyEvent(37); // LEFT
		break;
	case RIGHT:
		this.simulateKeyEvent(39); // RIGHT
		break;
	default:
		console.log("invalid move");
	}
};

Player2048.prototype.simulateKeyEvent = function(key) {

	var e = new Event("keydown");

	e.which = key;

	document.dispatchEvent(e);
};

Player2048.prototype.simulateUp = function(current, i) {

	i = i || 0;

	if (i == 3)
		return this.simulate(current.slice(), 0, this.boardSize, 1,
				this.boardSize, function(o, p) {
					return o <= p;
				}, function(o, p) {
					return o >= p;
				});

	return this.simulate(current.slice(), 0, this.boardSize, 1, this.boardSize,
			function(o, p) {
				return o <= p;
			}, function(o, p) {
				return o >= p;
			})[i];
}

Player2048.prototype.simulateDown = function(current, i) {

	i = i || 0;

	if (i == 3)
		return this.simulate(current.slice(), this.boardSize
				* (this.boardSize - 1), this.boardSize * this.boardSize, 1, -1
				* this.boardSize, function(o, p) {
			return o >= p;
		}, function(o, p) {
			return o <= p;
		});

	return this.simulate(current.slice(),
			this.boardSize * (this.boardSize - 1), this.boardSize
					* this.boardSize, 1, -1 * this.boardSize, function(o, p) {
				return o >= p;
			}, function(o, p) {
				return o <= p;
			})[i];
}

Player2048.prototype.simulateLeft = function(current, i) {

	i = i || 0;

	if (i == 3)
		return this.simulate(current.slice(), 0, this.boardSize
				* (this.boardSize - 1) + 1, this.boardSize, 1, function(o, p) {
			return o <= p;
		}, function(o, p) {
			return o >= p;
		});

	return this.simulate(current.slice(), 0, this.boardSize
			* (this.boardSize - 1) + 1, this.boardSize, 1, function(o, p) {
		return o <= p;
	}, function(o, p) {
		return o >= p;
	})[i];
}

Player2048.prototype.simulateRight = function(current, i) {

	i = i || 0;

	if (i == 3)
		return this.simulate(current.slice(), this.boardSize - 1, Math.pow(
				this.boardSize, 2), this.boardSize, -1, function(o, p) {
			return o >= p;
		}, function(o, p) {
			return o <= p;
		});
	else
		return this.simulate(current.slice(), this.boardSize - 1, Math.pow(
				this.boardSize, 2), this.boardSize, -1, function(o, p) {
			return o >= p;
		}, function(o, p) {
			return o <= p;
		})[i];
}

Player2048.prototype.simulate = function(c, initial, end, increment, shift, F1,
		F2) {

	var current = c.slice();

	var availableCells = [];

	var cellsTwo = 0;

	var totalMerged = 0;

	for (var o = 0; o < 3; o++) {

		for (var i = initial; i < end; i += increment) {

			for (var j = i + shift; F1(j, i + shift * (this.boardSize - 1)); j += shift) {

				var tmp = j;

				var summed = false;

				for (var n = j - shift; F2(n, i); n -= shift) {

					if (o % 2 == 0) {

						if (current[n] == 0 && current[tmp] != 0) {
							current[n] = current[tmp];
							current[tmp] = 0;
						}

						tmp = n;
					} else {

						if (current[j - shift] == current[j] && !summed) {
							current[j - shift] *= 2;
							totalMerged += current[j - shift]
							current[j] = 0;
							summed = true;
						}
					}
				}
			}
		}
	}

	if (!this.isEquals(current, c)) {
		for (var i = 0; i < current.length; i++)
			if (current[i] == 0)
				availableCells.push(i)

		if (availableCells.length)
			current[availableCells[Math.floor(Math.random()
					* availableCells.length)]] = this.getRandomAdversarialMove();
	}

	for (var i = 0; i < current.length; i++)
			if (current[i] == 2)

				cellsTwo += 1;

	return [current.slice(), totalMerged, (availableCells.length) - 1];
};

Player2048.prototype.getRandomAdversarialMove = function() {
	if (Math.random() <= .75)
		return 2;
	return 4;
};
Player2048.prototype.hasPossibleMoves = function(current) {

	var a = [this.simulateUp(current),   this.simulateLeft(current),
			 this.simulateDown(current), this.simulateRight(current)];

	for (var i = 0; i < a.length; i++) {

		for (var j = 0; j < a[i].length; j++)

			if (a[i][j] != current[j])
				return true;
	}

	return false;
};

Player2048.prototype.isEquals = function(a1, a2) {

	if (a1.length != a2.length)
		return false;

	for (var i = 0; i < a1.length; i++)
		if (a1[i] != a2[i])
			return false;

	return true;
};

Player2048.prototype.firstStep = function(step, current){
	var steps = ["UP","DOWN","LEFT","RIGHT"];
	var result = [];
	var voidCells = 0;
	var merged = 0; 
	var currentSimulated = current.slice();
	var stepSimulated = step;
	for (var o = 0; o < this.depth; o++){
		switch(stepSimulated){
			case "UP":
				result = (this.simulateUp(currentSimulated, 3));
			break;

			case "DOWN":
				result = (this.simulateDown(currentSimulated, 3));
			break;

			case "LEFT":
				result = (this.simulateLeft(currentSimulated, 3));
			break;

			case "RIGHT":
				result = (this.simulateRight(currentSimulated, 3));
			break;
		};

		if (o == 0 && this.isEquals(current, result[0]) || !this.hasPossibleMoves(current)){
			return -8000;
		};

		currentSimulated = result[0];
		merged += result[1];

		stepSimulated = steps[Math.floor(Math.random()*steps.length)];
	};
	voidCells = result[2];
	return merged;
};

Player2048.prototype.resultSteps = function(current){
	var resultUp = 0;
	var resultDown = 0;
	var resultLeft = 0;
	var resultRight = 0; 

	for (var o = 0; o < this.width; o++){
		resultUp += this.firstStep("UP", current);
		resultDown += this.firstStep("DOWN", current);
		resultLeft += this.firstStep("LEFT", current);
		resultRight += this.firstStep("RIGHT", current);
	};

	return [resultUp, resultDown, resultLeft, resultRight];
};

Player2048.prototype.play = function() {

	var self = this;

	setTimeout(function() {

		var values = self.resultSteps(self.getCurrentState());

		var max = Math.max.apply(Math, values);
		
		
		self.move(values.indexOf(max) + 1);
		
		if (self.hasPossibleMoves(self.getCurrentState()) && self.getCurrentState().indexOf(2048)){
			self.play();
		}
	}, 100);
};

var player = new Player2048(4, 1500, 7);

player.play();
