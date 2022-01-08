
var backgroundImage = new Image();
var virusImage = new Image();
var sound = document.createElement("Audio");
var virusSize;

var gameTimer;
var gameCanvas = document.getElementById('gameCanvas');
var gameContext = gameCanvas.getContext('2d');

var loadCounter = 0;
var loadComplete = false;

var canvasWidth;
var canvasHeight;

var virusesArray = new Array();

var virusCounter = 0;
var startTime;
var currentTime;

// Redessiner le fond
function drawBackground()
{
	try
	{
		gameContext.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
	}
	catch(error)
	{
		console.error(error);
	}
}

// Afficher les informations du jeu
function drawInformations()
{
	try
	{
		gameContext.globalAlpha=0.5;
		gameContext.fillStyle = '#000';
		gameContext.fillRect(0,0,canvasWidth,Math.floor(canvasHeight/10));
		gameContext.globalAlpha=1;	

		gameContext.fillStyle = "yellow";
		
		var fontSize = Math.floor(canvasHeight/25);
		
		gameContext.font = "bold " + fontSize +"px Verdana";
		gameContext.fillText("Virus éliminés : " + virusCounter, 10, fontSize);
		
		var minutes = Math.floor(currentTime / 60);
		var seconds = currentTime - minutes * 60;

		var displayedTime = ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);

		gameContext.fillText("Temps : " + displayedTime, 10, (fontSize*2));
	}
	catch(error)
	{
		console.eror(error);
	}
}

// Dessine les virus à l'écran
function drawViruses()
{
	try
	{
		for(i=0;i<virusesArray.length;i++)
			if(virusesArray[i].visible) gameContext.drawImage(virusesArray[i].image, virusesArray[i].x, virusesArray[i].y, virusesArray[i].w, virusesArray[i].h);	
	}
	catch(error)
	{
		console.error(error);
	}
}

// Fonction qui est exécutée quand la fenêtre est redimensionnée
function gameResize()
{
	try
	{
		// Redimensionner le canevas à la taille de la fenêtre.
		canvasWidth = window.innerWidth;
		canvasHeight = window.innerHeight;
		virusSize = Math.floor(canvasWidth/10);
			
		gameCanvas.width=canvasWidth;
		gameCanvas.height=canvasHeight;
	}
	catch(error)
	{
		console.error(error);
	}
}

// Mise à jour des informations du jeu
function gameUpdate()
{
	try
	{
		var i
		for(i=virusesArray.length-1;i>=0;i--)
		{
			virusesArray[i].x += virusesArray[i].speed*Math.cos(virusesArray[i].direction * Math.PI / 180);
			virusesArray[i].y += virusesArray[i].speed*Math.sin(virusesArray[i].direction * Math.PI / 180);

			if(virusesArray[i].x<0 || virusesArray[i].x+virusesArray[i].w>canvasWidth || virusesArray[i].y < 0 || virusesArray[i].y+virusesArray[i].h > canvasHeight)
			{
				virusesArray[i].visible = false;
				virusesArray.splice(i,1);
				newVirus();
			} 
		}
		
		currentTime = Math.floor( (Date.now()-startTime)/1000);

		if(currentTime==60)
			gameEnd();
	}
	catch(error)
	{
		console.error(error);
	}
}	

// Fonction de rendu du jeu
function gameRender()
{
	drawBackground();
	drawViruses();
	drawInformations();
}

// Fin du jeu
function gameEnd()
{
	try
	{
		var i;
		
		clearInterval(gameTimer);
		
		// Supprimer tous les virus restants
		virusesArray = [];

		gameRender();
		
		gameCanvas.style.display='none';
		var gameLinkDiv = document.getElementById('gameLinkDiv');
		gameLinkDiv.style.display='block';
		gameLinkDiv.innerHTML = '<h1>Fin du jeu</h1>\r\n<img src="data/favicon.png"/><br/>\r\nVous avez éliminé ' + virusCounter + ' virus<br/>\r\n<a href="javascript:playGame()" class="gameButton">Rejouer</a>';
	}
	catch(error)
	{
		console.error(error);
	}
}

// Initialisation du jeu
function init()
{
	try
	{
		var gameLinkDiv = document.getElementById('gameLinkDiv');
		gameLinkDiv.style.display='none';
		
		window.onresize = gameResize;
		gameCanvas.style.display='block';
		
		// Initialiser les variables du jeu
		loadCounter=0;
		virusCounter=0;
		loadComplete = false;
		
		gameResize();
		
		// Chargement des ressources
		backgroundImage.src = 'data/background.jpg';
		backgroundImage.onload = function() 
		{
			backgroundImage.onload = undefined;
			loadCounter++;
		}
		
		virusImage.src = 'data/corona.png';
		virusImage.onload = function()
		{
			virusImage.onload = undefined;
			loadCounter++;
		}
		
		sound.src = 'data/splash.mp3';
		sound.oncanplaythrough  = function()
		{
			sound.oncanplaythrough = undefined;
			loadCounter++;
		}
		
		
	}
	catch(error)
	{
		console.error(error);
	}
}

// Crée un nouveau virus
function newVirus()
{
	try
	{
		var virus = {image: new Image(), x:0, y: 0, w:virusSize, h:virusSize, direction:0, speed:1, visible:true};
		virus.image = virusImage;
	
		virus.x = Math.random()*canvasWidth;
		virus.y = Math.random()*canvasHeight;
		
		virus.speed += Math.random()*2;
		virus.direction = Math.random() * 361;
		
		virusesArray.push(virus);
	}
	catch(error)
	{
		console.error(error);
	}
}

// Permet de savoir si on a touché un virus
function touchVirus(x, y)
{
	try
	{
		var i;

		for(i=virusesArray.length-1;i>=0;i--)
		{
			if(x>=virusesArray[i].x && x <= virusesArray[i].x+virusesArray[i].w && y>=virusesArray[i].y && y <=virusesArray[i].y+virusesArray[i].h)
			{
				virusesArray[i].visible = false;
				virusesArray.splice(i,1);
				sound.currentTime = 0;
				sound.play();
				
				virusCounter++;

				newVirus();
			}
		}
	}
	catch(error)
	{
		console.error(error);
	}
}

function gameCanvasOnMouseDown(e)
{
	try
	{
		var pos = {x:0,y:0};
		var rect = gameCanvas.getBoundingClientRect();

		pos.x = e.clientX - rect.left;
		pos.y = e.clientY - rect.top;
		touchVirus(pos.x, pos.y);
	}
	catch(error)
	{
		console.error(error);
	}
}

function gameCanvasOnTouchStart(e)
{
	try
	{
		var pos = {x:0, y:0};
		if(e.length>0)
		{
			 var touch = e.touches[0];
			pos.x = touch.pageX-touch.target.offsetLeft;
			pos.y = touch.pageY-touch.target.offsetTop;

			touchVirus(pos.x, pos.y);
		}
	}
	catch(error)
	{
		console.error(error);
	}
}

// Exécution du jeu
function run()
{
	try
	{
		if(loadCounter==3)
		{
			if(!loadComplete)
			{
				// Définir les événements souris et toucher (écran tactile)
				gameCanvas.onmousedown = gameCanvasOnMouseDown;
				gameCanvas.ontouchstart = gameCanvasOnTouchStart;
			
				var i;
				
				// Créer quelques virus pour commencer
				for(i=0;i<20;i++)
					newVirus();
				
				// Démarrer le chrono
				startTime = Date.now();
				
				loadComplete = true;
			}
			gameUpdate();
			gameRender();
		}
	}
	catch(error)
	{
		console.error(error);
	}
}

// Fonction principale : démarrer le jeu
function playGame()
{
	try
	{
		init();
		gameTimer = setInterval(run, 10);
	}
	catch(error)
	{
		console.error(error);
	}
}

