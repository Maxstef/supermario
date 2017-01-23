var canvasElem = document.getElementById("game");
var backOffset = 0;
canvasElem.style.backgroundImage = 'url("assets/sky.jpg")';
canvasElem.style.backgroundSize = '80% 100%';
canvasElem.style.backgroundRepeat = 'repeat-x';

var world = boxbox.createWorld(canvasElem,{
	scale: 30,
	gravity: {x:0, y:30}
});
var score = 0;
document.getElementById('score').innerHTML = score;




function gameOver(){
	alert('game over. score: ' + score);
	location.reload();
}



/*-----------------------------------------------
player
---------------------------------------------*/

world.createEntity({
	name: 'player',
	shape: 'square',
	fixedRotation : true,
	width: 1,
	height: 1.5,
	image: 'assets/marioRight.png',
	imageStretchToFit: true,
	x: 7,
	y:13,
	init: function(){
		this.impuls = false;
		this.jump = false;
	},
	onKeyDown: function(e){

		var currCamera = world.camera().x;
		var currX = this.position().x;
		var currY = this.position().y;

		
		if(e.code == 'ArrowRight' && !this.jump){
			backOffset = backOffset - 2;
			if(backOffset == -400){
				backOffset = 0;
			}
			canvasElem.style.backgroundPosition = backOffset + '%';
			this.image('assets/marioRight.png');
			this.position({x:currX + 0.1, y: currY});
			this.applyImpulse(0,90);
			world.camera({x: currCamera + 0.1, y: 0});
		}
		if(e.code == 'ArrowLeft' && !this.jump){
			backOffset = backOffset + 2;
			if(backOffset == 400){
				backOffset = 0;
			}
			canvasElem.style.backgroundPosition = backOffset + '%';
			this.image('assets/marioLeft.png');
			this.position({x:currX - 0.1, y: currY});
			this.applyImpulse(0,270);
			world.camera({x: currCamera - 0.1, y: 0});
		}
		if(e.code == 'Space' && !this.jump){
			this.applyImpulse(50,0);
			this.jump = true;		
		}
		if(e.code == 'ArrowRight' && this.jump && !this.impuls){
			this.image('assets/marioRight.png');
			this.impuls = true;
			this.applyImpulse(15,90);
		}
		if(e.code == 'ArrowLeft' && this.jump && !this.impuls){
			this.image('assets/marioLeft.png');
			this.impuls = true;
			this.applyImpulse(15,270);
		}
	},
	onImpact: function(entity, force){
		if((entity.name() == 'ground' || entity.name() == 'pipe' || entity.name() == 'block' || entity.name() == 'blockToHit' || entity.name() == 'box') && this.jump){
			if(force > 0){
				this.jump = false;
				this.impuls = false;
				var player = this;
				
				var alignCamera = setInterval(function(){
						var currCamera = world.camera().x;
						var currX = player.position().x;
						var diff = currX - currCamera;
						
						if(diff > 7.1){
							world.camera({x: currCamera + 0.05, y: 0});
							backOffset = backOffset - 1;
							if(backOffset == -400){
								backOffset = 0;
							}
							canvasElem.style.backgroundPosition = backOffset + '%';
						} else if(diff < 6.9){
							world.camera({x: currCamera - 0.05, y: 0});
							backOffset = backOffset + 1;
							if(backOffset == -400){
								backOffset = 0;
							}
							canvasElem.style.backgroundPosition = backOffset + '%';
						} else {
							world.camera({x: currX - 7, y: 0});
							clearInterval(alignCamera);
						}
						
					}, 10);
				
			}
			
		}
	}

});
/*-----------------------------------------------
unvisible ground
---------------------------------------------*/
world.createEntity({
	name: 'ground',
	type: 'static',
	color: 'transparent',
	borderWidth: 0,
	y: 14,
	shape: 'square',
	width: 10000,
	height: 0.1
});
/*-----------------------------------------------
elements pipe block monster lava coint
---------------------------------------------*/
var pipe = {
	name: 'pipe',
	image: 'assets/pipe.png',
	type: 'static',
	imageStretchToFit: true,
	width: 1.3,
	height: 2.6,
	y: 12.6,
	imageOffsetY: -0.3
};

var block = {
	name: 'block',
	image: 'assets/block.png',
	type: 'static',
	imageStretchToFit: true,
	width: 1,
	height: 1

};
var box = {
	name: 'box',
	image: 'assets/box.jpg',
	imageStretchToFit: true,
	width: 1.2,
	height: 1.2,
	density: 1
};
var blockToHit = {
	name: 'blockToHit',
	image: 'assets/blockToHit.png',
	type: 'static',
	imageStretchToFit: true,
	width: 1,
	height: 1,
	init: function(){
		this.done = false;
	},
	onImpact: function(entity,force){
		//console.log(entity.name());
		if(entity.name() == 'player' && !this.done){
			if(force > 50){
				this.done =  true;
				this.image('assets/block.png');
				var currX = this.position().x;
				var currY = this.position().y;
				var n = Math.round(2 + Math.random() * 3);
				for(var i = 1; i < n; i++){
					world.createEntity(coint, {
						x: currX,
						y: currY - i
					});
				}
				
			}
			
		}
	}
};
var coint = {
	name: 'coint',
	image: 'assets/coint.png',
	type: 'static',
	imageStretchToFit: true,
	density: 0.05,
	width: 1,
	height: 1,
	onImpact: function(entity, force){
		if(entity.name() == 'player'){
			this.destroy();
			score++;
			document.getElementById('score').innerHTML = score;
		}
		if(entity.name() == 'monster'){
			this.destroy();
		}
	}

};
var lava = {
	name: 'lava',
	image: 'assets/lava.jpg',
	type: 'static',
	imageOffsetX : -0.5,
	imageStretchToFit: true,
	width: 2.5,
	height: 2,
	y: 14.5,
	onImpact: function(entity, force){
		if(entity.name() == 'player'){
			gameOver();
		}
	}
};
var monster = {
	name: 'monster',
	shape: 'square',
	fixedRotation : true,
	width: 1,
	height: 1.5,
	image: 'assets/monster2.png',
	imageStretchToFit: true,
	y:13,
	init: function(){
		this.direction = 'right';
		this.notCheck = false;
	},
	onImpact: function(entity,force){
		
		if(entity.name() == 'ground' || entity.name() == 'block' || entity.name() == 'blockToHit'){
			
			
			if(this.direction == 'right'){
				var currX = this.position().x;
				var currY = this.position().y;
				this.position({x:currX + 0.05, y: currY});
				this.applyImpulse(0,90);
			} 
			if(this.direction == 'left') {
				var currX = this.position().x;
				var currY = this.position().y;
				this.position({x:currX - 0.05, y: currY});
				this.applyImpulse(0,270);
			}
		}
		if((entity.name() == 'pipe' || entity.name() == 'lava') && !this.notCheck){
			if(this.direction == 'left'){
				this.direction = 'right';
			} else {
				this.direction = 'left'
			}
			this.notCheck = true;
			p = this;
			setTimeout(function(){
				p.notCheck = false;
			}, 00);

		}
		if(entity.name() == 'player'){
			if(force > 40){
				this.destroy();
				score = score + 10;
				document.getElementById('score').innerHTML = score;
			} else {
				gameOver();
			}
			
		}
	}

}

/*-----------------------------------------------
start huge pipe
---------------------------------------------*/
world.createEntity(pipe, {
	y: 10,
	x: 2,
	width: 3,
	height: 6
});



/*-----------------------------------------------
random part generator from x=n
---------------------------------------------*/
function createRandomPartFrom(n){
	var q = Math.round(Math.random() * 3);
	parts[q](n);
}


/*-----------------------------------------------
for diff parts
---------------------------------------------*/
var parts = [];



/*-----------------------------------------------
part1
---------------------------------------------*/
parts[0] = function(n){
	world.createEntity(block, {
		x: n,
		y: 11
	});
	world.createEntity(block, {
		x: n+1,
		y: 11
	});
	world.createEntity(block, {
		x: n+2,
		y: 11
	});
	world.createEntity(blockToHit, {
		x: n + 3,
		y: 11
	});
	world.createEntity(block, {
		x: n+4,
		y: 11
	});
	world.createEntity(coint, {
		x: n,
		y: 10
	});
	world.createEntity(coint, {
		x: n + 1,
		y: 10
	});
	world.createEntity(coint, {
		x: n + 2,
		y: 10
	});
	world.createEntity(lava, {
		x: n + 7.5
	});
	world.createEntity(pipe, {
		x: n+20
	});
	world.createEntity(pipe, {
		x: n+12
	});
	world.createEntity(monster, {
		x: n +15
	});
	world.createEntity(coint, {
		x: n + 13,
		y: 10
	});
	world.createEntity(block, {
		x: n + 25,
		y: 11
	});
	world.createEntity(block, {
		x: n + 23,
		y: 11
	});
	world.createEntity(block, {
		x: n + 24,
		y: 11
	});
	world.createEntity(block, {
		x: n + 28,
		y: 11
	});
	world.createEntity(block, {
		x: n + 26,
		y: 11
	});
	world.createEntity(block, {
		x: n + 27,
		y: 11
	});
	world.createEntity(coint, {
		x: n + 23,
		y: 10
	});
	world.createEntity(coint, {
		x: n + 24,
		y: 10
	});
	world.createEntity(coint, {
		x: n + 25,
		y: 10
	});
	world.createEntity(block, {
		x: n + 27,
		y: 8
	});
	world.createEntity(blockToHit, {
		x: n + 28,
		y: 8
	});
	world.createEntity(block, {
		x: n + 29,
		y: 8
	});
	world.createEntity(coint, {
		x: n + 29,
		y: 7
	});
	world.createEntity(block, {
		x: n + 33,
		y: 11,
	});
	world.createEntity(block, {
		x: n + 34,
		y: 11,
	});
	world.createEntity(blockToHit, {
		x: n + 35,
		y: 11,
	});
	world.createEntity(blockToHit, {
		x: n + 36,
		y: 11,
	});
	world.createEntity(block, {
		x: n + 37,
		y: 11,
	});
	world.createEntity(coint, {
		x: n + 30,
		y: 13,
	});
	world.createEntity(coint, {
		x: n + 31,
		y: 13,
	});
	world.createEntity(coint, {
		x: n + 32,
		y: 13,
	});
	world.createEntity(coint, {
		x: n + 34,
		y: 10,
	});
	world.createEntity(coint, {
		x: n + 37,
		y: 10,
	});
	//
	world.createEntity(block, {
		x: n + 29,
		y: 5,
	});
	world.createEntity(block, {
		x: n + 30,
		y: 5,
	});
	world.createEntity(block, {
		x: n + 31,
		y: 5,
	});
	world.createEntity(block, {
		x: n + 32,
		y: 5,
	});

	world.createEntity(coint, {
		x: n + 30,
		y: 4,
	});
	world.createEntity(coint, {
		x: n + 31,
		y: 4,
	});
	world.createEntity(coint, {
		x: n + 32,
		y: 4,
	});
	world.createEntity(block, {
		x: n + 35,
		y: 7,
	});
	world.createEntity(block, {
		x: n + 36,
		y: 7,
	});
	world.createEntity(block, {
		x: n + 37,
		y: 7,
	});
	world.createEntity(coint, {
		x: n + 35,
		y: 6,
	});
	world.createEntity(coint, {
		x: n + 36,
		y: 6,
	});
	world.createEntity(pipe, {
		x: n + 40,
	});
	world.createEntity(lava, {
		x: n + 47,
	});
	world.createEntity(monster, {
		x: n + 43,
	});
	
}






/*-----------------------------------------------
part2
---------------------------------------------*/
parts[1] = function(n){
	world.createEntity(block, {
		x: n+1,
		y: 11
	});
	world.createEntity(blockToHit, {
		x: n+2,
		y: 11
	});
	world.createEntity(block, {
		x: n+3,
		y: 11
	});
	world.createEntity(block, {
		x: n+6,
		y: 11
	});
	world.createEntity(blockToHit, {
		x: n+7,
		y: 11
	});
	world.createEntity(block, {
		x: n+8,
		y: 11
	});
	world.createEntity(block, {
		x: n+5,
		y: 8
	});
	world.createEntity(block, {
		x: n+6,
		y: 8
	});
	world.createEntity(block, {
		x: n+7,
		y: 8
	});
	world.createEntity(coint, {
		x: n+5,
		y: 7
	});
	world.createEntity(coint, {
		x: n+6,
		y: 7
	});
	world.createEntity(coint, {
		x: n+7,
		y: 7
	});
	world.createEntity(pipe, {
		x: n+12,
	});
	world.createEntity(lava, {
		x: n+14,
	});
	world.createEntity(pipe, {
		x: n+25,
	});
	world.createEntity(block, {
		x: n+17,
		y: 10
	});
	world.createEntity(block, {
		x: n+18,
		y: 10
	});
	world.createEntity(block, {
		x: n+19,
		y: 10
	});
	world.createEntity(coint, {
		x: n+17,
		y: 9
	});
	world.createEntity(coint, {
		x: n+18,
		y: 9
	});
	world.createEntity(coint, {
		x: n+19,
		y: 9
	});
	world.createEntity(monster, {
		x: n+16,
		image: 'assets/monster3.png',
		width: 1.5
	});
	world.createEntity(lava, {
		x: n+37,
	});
	world.createEntity(monster, {
		x: n+32,
		image: 'assets/monster1.png'
	});
	world.createEntity(block, {
		x: n+31,
		y: 10
	});
	world.createEntity(block, {
		x: n+32,
		y: 10
	});
	world.createEntity(block, {
		x: n+33,
		y: 10
	});
	world.createEntity(block, {
		x: n+34,
		y: 10
	});

	world.createEntity(coint, {
		x: n+32,
		y: 9
	});
	world.createEntity(coint, {
		x: n+33,
		y: 9
	});
	world.createEntity(block, {
		x: n+42,
		y: 11
	});
	world.createEntity(blockToHit, {
		x: n+43,
		y: 11
	});
	world.createEntity(blockToHit, {
		x: n+44,
		y: 11
	});
	world.createEntity(block, {
		x: n+45,
		y: 11
	});
	world.createEntity(block, {
		x: n+46,
		y: 8
	});
	world.createEntity(block, {
		x: n+47,
		y: 8
	});
	world.createEntity(block, {
		x: n+42,
		y: 5
	});
	world.createEntity(block, {
		x: n+43,
		y: 5
	});
	world.createEntity(coint, {
		x: n+43,
		y: 4
	});
	world.createEntity(coint, {
		x: n+42,
		y: 4
	});
	world.createEntity(block, {
		x: n+48,
		y: 5
	});
	world.createEntity(block, {
		x: n+49,
		y: 5
	});
	world.createEntity(coint, {
		x: n+48,
		y: 4
	});
	world.createEntity(coint, {
		x: n+49,
		y: 4
	});
}


/*-----------------------------------------------
part3
---------------------------------------------*/
parts[2] = function(n){
	world.createEntity(pipe, {
		x: n+1,
	});

	world.createEntity(monster, {
		x: n+5,
		image: 'assets/monster3.png',
		width: 1.5
	});
	
	world.createEntity(pipe, {
		x: n+13,
	});
	world.createEntity(block, {
		x: n+4,
		y: 10
	});
	world.createEntity(block, {
		x: n+5,
		y: 10
	});
	world.createEntity(block, {
		x: n+6,
		y: 10
	});
	world.createEntity(coint, {
		x: n+5,
		y: 9
	});
	world.createEntity(coint, {
		x: n+6,
		y: 9
	});
	world.createEntity(block, {
		x: n+8,
		y: 7
	});
	world.createEntity(block, {
		x: n+9,
		y: 7
	});
	world.createEntity(block, {
		x: n+10,
		y: 7
	});
	world.createEntity(coint, {
		x: n+9,
		y: 6
	});
	world.createEntity(coint, {
		x: n+10,
		y: 6
	});
	world.createEntity(block, {
		x: n+13,
		y: 6
	});
	world.createEntity(block, {
		x: n+14,
		y: 6
	});
	world.createEntity(block, {
		x: n+15,
		y: 6
	});
	world.createEntity(coint, {
		x: n+14,
		y: 5
	});
	world.createEntity(coint, {
		x: n+15,
		y: 5
	});
	world.createEntity(coint, {
		x: n+18,
		y: 4
	});
	world.createEntity(coint, {
		x: n+19,
		y: 5
	});
	world.createEntity(pipe, {
		x: n+23,
	});
	world.createEntity(monster, {
		x: n+20,
	});
	world.createEntity(lava, {
		x: n+27,
	});
	world.createEntity(lava, {
		x: n+33,
	});
	world.createEntity(pipe, {
		x: n+43,
	});
	world.createEntity(monster, {
		x: n+35,
		image: 'assets/monster2.png'
	});
	world.createEntity(blockToHit, {
		x: n + 46,
		y: 11
	});
	world.createEntity(blockToHit, {
		x: n + 47,
		y: 11
	});
	world.createEntity(block, {
		x: n + 49,
		y: 8
	});
	world.createEntity(block, {
		x: n + 50,
		y: 8
	});
	world.createEntity(coint, {
		x: n + 49,
		y: 7
	});
	world.createEntity(coint, {
		x: n + 50,
		y: 7
	});
	world.createEntity(block, {
		x: n + 45,
		y: 5
	});
	world.createEntity(block, {
		x: n + 46,
		y: 5
	});
	world.createEntity(coint, {
		x: n + 45,
		y: 4
	});
	world.createEntity(coint, {
		x: n + 46,
		y: 4
	});
	
	
}



/*-----------------------------------------------
part4
---------------------------------------------*/
parts[3] = function(n){
	world.createEntity(block, {
		x: n+4,
		y: 9
	});
	world.createEntity(block, {
		x: n+5,
		y: 9
	});
	world.createEntity(block, {
		x: n+6,
		y: 9
	});
	world.createEntity(block, {
		x: n+7,
		y: 9
	});
	world.createEntity(block, {
		x: n+9,
		y: 6
	});
	world.createEntity(blockToHit, {
		x: n+5,
		y: 6
	});
	world.createEntity(coint, {
		x: n+5,
		y: 8
	});
	world.createEntity(coint, {
		x: n+6,
		y: 8
	});
	world.createEntity(coint, {
		x: n+4,
		y: 8
	});

	world.createEntity(block, {
		x: n+9,
		y: 6
	});
	world.createEntity(block, {
		x: n+10,
		y: 6
	});
	world.createEntity(block, {
		x: n+11,
		y: 6
	});
	world.createEntity(block, {
		x: n+12,
		y: 6
	});
	world.createEntity(block, {
		x: n+13,
		y: 6
	});
	world.createEntity(block, {
		x: n+14,
		y: 6
	});
	world.createEntity(block, {
		x: n+15,
		y: 6
	});
	world.createEntity(block, {
		x: n+16,
		y: 6
	});
	world.createEntity(coint, {
		x: n+16,
		y: 1
	});
	world.createEntity(coint, {
		x: n+17,
		y: 1
	});
	world.createEntity(block, {
		x: n+17,
		y: 6
	});
	world.createEntity(block, {
		x: n+18,
		y: 6
	});
	world.createEntity(block, {
		x: n+19,
		y: 6
	});
	world.createEntity(block, {
		x: n+29,
		y: 4
	});
	world.createEntity(block, {
		x: n+30,
		y: 4
	});
	world.createEntity(block, {
		x: n+31,
		y: 4
	});
	world.createEntity(coint, {
		x: n+30,
		y: 3
	});
	world.createEntity(coint, {
		x: n+31,
		y: 3
	});

	world.createEntity(block, {
		x: n+23,
		y: 5
	});
	world.createEntity(block, {
		x: n+24,
		y: 5
	});
	world.createEntity(block, {
		x: n+25,
		y: 5
	});
	world.createEntity(coint, {
		x: n+25,
		y: 4
	});
	world.createEntity(block, {
		x: n+26,
		y: 5
	});
	world.createEntity(block, {
		x: n+13,
		y: 3
	});
	world.createEntity(blockToHit, {
		x: n+14,
		y: 3
	});world.createEntity(block, {
		x: n+15,
		y: 3
	});
	world.createEntity(coint, {
		x: n+11,
		y: 5
	});
	world.createEntity(coint, {
		x: n+10,
		y: 5
	});
	world.createEntity(block, {
		x: n+34,
		y: 5
	});
	world.createEntity(block, {
		x: n+35,
		y: 5
	});
	world.createEntity(block, {
		x: n+36,
		y: 5
	});
	world.createEntity(block, {
		x: n+37,
		y: 5
	});
	world.createEntity(coint, {
		x: n+34,
		y: 1
	});
	world.createEntity(coint, {
		x: n+35,
		y: 1
	});
	world.createEntity(coint, {
		x: n+36,
		y: 1
	});
	world.createEntity(coint, {
		x: n+37,
		y: 1
	});
	world.createEntity(box, {
		x: n+6,
		y: 11
	});
	world.createEntity(lava, {
		x: n+18
	});
	world.createEntity(lava, {
		x: n+22
	});
	world.createEntity(lava, {
		x: n+24
	});
	world.createEntity(lava, {
		x: n+26
	});
	world.createEntity(lava, {
		x: n+28
	});
	world.createEntity(lava, {
		x: n+20
	});
	world.createEntity(lava, {
		x: n+30
	});
	world.createEntity(lava, {
		x: n+32
	});
	world.createEntity(monster, {
		x: n+35,
		image: 'assets/monster1.png'
	});
	world.createEntity(pipe, {
		x: n+42
	});
	world.createEntity(pipe, {
		width: 3,
		height: 6,
		x: n+50,
		y: 10,
		onImpact: function(entity, force){
			if(entity.name() == 'player'){
				alert('Congratulations. You win. Score: ' + score);
				location.reload();
			}
		}
	});

}





/*-----------------------------------------------
draw
---------------------------------------------*/
parts[0](10);
parts[1](60);
parts[2](110)
parts[3](170)
/*
createRandomPartFrom(15);
createRandomPartFrom(65);
createRandomPartFrom(115);
createRandomPartFrom(165);
*/