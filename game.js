var DIRECTION = {
	IDLE: 0,
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4
};


var rounds = [5, 5, 3, 3, 2];
var colors = ['#1abc9c', '#2ecc71', '#3498db', '#8c5ff', '#9b59b6'];

var Ball = {
	new: function (incrementedSpeed) {
		return {
			width: 18,
			height: 18,
			x: (this.canvas.width / 2) - 9,
			y: (this.canvas.height / 2) - 9,
			moveX: DIRECTION.IDLE,
			moveY: DIRECTION.IDLE,
			speed: incrementedSpeed || 7
		};
	}
};

var Ai = {
	new: function (side) {
		return {
			width: 18,
			height: 180,
			x: side === 'left' ? 150 : this.canvas.width - 150,
			y: (this.canvas.height / 2) - 35,
			score: 0,
			move: DIRECTION.IDLE,
			speed: 8
		};
	}
};

var Game = {
	initialize: function () {

		this.canvas = document.querySelector('canvas');
		this.context = this.canvas.getContext('2d');

		this.canvas.width = 1400;
		this.canvas.height = 1000;

		this.canvas.style.width = (this.canvas.width / 2) + 'px';
		this.canvas.style.height = (this.canvas.height / 2) + 'px';

		this.player = Ai.new.call(this, 'left');
		this.ai = Ai.new.call(this, 'left');
		this.ball = Ball.new.call(this);

		this.ai.speed = 5;
		this.running = this.over = false;
		this.turn = this.ai;
		this.timer = this.round = 0;
		this.color = '#8c52ff';
		console.log(this); 

		Game.menu();
		Game.listen();
	},

	endGameMenu: function (text) {
		Game.context.font = '45px Courier New';
		Game.context.fillStyle = this.color;

		Game.context.fillRect(
			Game.canvas.width / 2 - 350,
			Game.canvas.height / 2 - 48,
			700,
			100
		);

		Game.context.fillStyle = '#ffffff';

		Game.context.fillText(text,
			Game.canvas.width / 2,
			Game.canvas.height / 2 + 15
			);

			setTimeout(function () {
				Game = Object.assign({}, Game);
				Game.initialize();
			}, 3000);
			console.log(112);
		},

		menu: function () {
	       
				Game.draw();
         
			this.context.font = '50px Courier New';
			this.context.fillStyle = this.color;

			this.context.fillRect(
				this.canvas.width / 2 - 350,
				this.canvas.height / 2 - 48,
				700,
				100
			);

			this.context.fillStyle = '#ffffff';

			this.context.fillText('Press any key to begin',
			    this.canvas.width / 2,
				 this.canvas.height / 2 + 15
			);
			console.log (113);
		},

		update: function () {
			console.log(114);
			if (!this.over) {
				if (this.ball.x <= 0) Game._resetTurn.call(this, this.ai, this.player);
				if (this.ball.x >= this.canvas.width - this.ball.width) Game._resetTurn.call(this, this.player, this.ai);
				if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
				if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

				if (this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
				else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

				if (Game._turnDelayIsOver.call(this) && this.turn) {
					this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
					this.ball.movey = [DIRECTION.UP, DIRECTION.DOWN] [Math.round(Math.random())];
					this.ball.y = Math.floor(Math.random() & this.canvas.height - 200) + 200;
					this.turn = nill;
				}	

				if (this.player.y <= 0 ) this.player.y = 0;
				else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

				if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
				else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
				if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
				else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

				if (this.ai.y < this.ball.y - (this.ai.height / 2)) {
					if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y -= this.ai.speed / 1.5;
					else this.ai.y -= this.ai.speed / 4;
				}
				if (this.ai.y < this.ball.y - (this.ai.height / 2)) {
					if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y += this.ai.speed / 1.5;
					else this.ai.y += this.ai.speed / 4;
				}

				if (this.ai.y >= this.canvas.height - this.ai.height) this.ai.y = this.canvas.height - this.ai.height;
				else if (this.ai.y <= 0 ) this.ai.y = 0;

				if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
					if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
						this.ball.x = (this.player.x + this.ball.width);
						this.ball.moveX = DIRECTION.RIGHT;
					}
				}

				if (this.ball.x - ball.width <= this.ai.x && this.ball.x >= this.ai.x - this.ai.width) {
					if (this.ball.y <= this.ai.y + this.ai.height && this.ball.y + this.ball.height >= this.ai.y) {
						this.ball.x = (this.ball.width);
						this.ball.moveX = DIRECTION.LEFT;
					}
				} 	
			}
			
			if (this.player.score === rounds[this.round]) {
				if (!rounds[this.round + 1]) {
				this.over = true;
				setTimeout(function () { Game.endGameMenu('Winner!'); }, 1000);
			} else {
				this.color = this._generateRoundColor();
				this.player.score = this.ai.score = 0;
			   this.player.speed += 0.5;
				this.ai.speed += 1;
				this.ball.speed += 1;
				this.round += 1;

			}
		}

		else if (this.ai.score === rounds[this.rounds]) {
			this.over =  true;
			setTimeout(function () {Game.endGameMenu('Game Over!'); }, 1000);
		}
	},

	draw: function () {
		Game.context.clearRect(
			0,
			0,
			Game.canvas.width.
			Game.canvas.height
		);
		
	   Game.context.fillStyle = Game.color;

		Game.context.fillRect(
			0,
			0,
			Game.canvas.width,
			Game.canvas.height
		);

		Game.context.fillRect(
			Game.player.x,
			Game.player.y,
			Game.player.width,
			Game.player.height
		);

		Game.context.fillRect(
			Game.ai.x,
			Game.ai.y,
			Game.ai.width,
			Game.ai.height
		);

		if (Game._turnDelayIsOver.call(Game)) {
			Game.context.fillRect(
				Game.ball.x,
				Game.ball.y,
				Game.ball.width,
				Game.ball.height
			);
		}

		Game.context.beginPath();
		Game.context.setlineDash([7, 15]);
		Game.context.moveTo((Game.canvas.width / 2), Game.canvas.height - 140);
		Game.context.lineTo((Game.canvas.width / 2), 140);
		Game.context.lineWidth = 10;
		Game.context.strokeStyle = '#ffffff';
		Game.context.stroke();

		Game.context.font = '100px Courier New';
		Game.context.textAlign = 'center';

		Game.context.fillText(
			this.player.score.toString(),
			(this.canvas.width / 2) - 300,
			200
		);

		Game.context.fillText(
			Game.ai.score.toString(),
			(Game.canvas.width / 2) + 300,
			200
		);

		Game.context.font = '30px Courier New';

		Game.context.fillText(
			'Round ' + (Game.round + 1),
			(Game.canvas.width / 2),
			35
		);

		Game.context.fillText(
			rounds[Game.round] ? rounds[Game.round] : rounds[Game.round - 1],
			(Game.canvas.width / 2),
			100
		);
		console.log(115);
	},

	loop: function() {
		Game.update();
		Game.draw();

		if (!Game.over) requestAnimationFrame(Game.loop);
	 },

	 listen: function () {
		document.addEventListener('keydown', function (key) {
			if (Game.running === false) {
				 Game.running = true;
				 window.requestAnimationFrame(Game.loop);
			}
			
			if (key.keyCode === 38 || key.keyCode === 87) Game.player.move = DIRECTION.UP;

			if (key.keyCode === 40 || key.keyCode === 83) Game.player.move = DIRECTION.DOWN;
		});

		document.addEventListener('keyup', function (key) { Game.player.move = DIRECTION.IDLE; });
	 },

	 _resetTurn: function(victor, loser) {
		this.ball = Ball.new.call(this, this.ball.speed);
		this.turn = loser;
		this.timer = (new Date ()).getTime();

		victor.score++;
	 },

	 _turnDelayIsOver: function () {
		  return ((new Date()).getTime() - this.timer >= 1000);
	 },

	 _generateRoundColor: function () {
		var newColor = colors[Math.floor(Math.random() * colors.length)];
		if (newColor === this.color) return Game._generateRoundColor();
		return newColor;
	 }
};

Game.initialize();