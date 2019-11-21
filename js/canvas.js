
/* ------------------ CLASS CANVAS ------------------ */

"use strict";

// création de la class Canvas
class Canvas {
	// constructeur de class
	constructor(canvasDiv, canvas) { 
		this.canvasDiv = $(canvasDiv);
		this.canvas = $(canvas);
		this.ctx = this.canvas[0].getContext("2d");
		this.topCanvas = this.canvas[0].getBoundingClientRect().top; 
		this.leftCanvas = this.canvas[0].getBoundingClientRect().left; 
		this.x = this.leftCanvas; 
		this.y = this.topCanvas; 
		this.x2 = 0;
		this.y2 = 0;
		this.canvasFilled = false;
		this.canvasContainer = $("#canvas-container"); 
		this.clear = $("#clear-canvas"); 
		this.submit = $("#submit-canvas"); 
		// dessin sur le canvas
		this.click = function (e) { 
					e.preventDefault(); 
					this.ctx.strokeStyle = "grey";
					this.ctx.lineWidth = 4;
					this.ctx.lineJoin = "round";
					this.ctx.lineCap = "round";
					this.ctx.beginPath();
					this.ctx.moveTo(this.x, this.y);
					this.ctx.lineTo(this.x2, this.y2);
					this.ctx.closePath();
					this.ctx.stroke();
					this.canvasFilled = true;  
		};
		this.draw = this.click.bind(this); 
		this.initSettings(); 
	}; // fin du constructeur

	//initialisation des evennements
	initSettings() {
		// avec la souris
		this.canvas.on("mousedown", (e) => { 
			this.canvas.on("mousemove", this.draw);
		});
		this.canvas.on("mouseup", (e) => {  
			this.canvas.off("mousemove", this.draw);
		});
		this.canvas.on("mouseleave", (e) => { 
			this.canvas.off("mousemove", this.draw);
		});
		this.canvas.on("mousemove", (e) => {  
			this.topCanvas = this.canvas[0].getBoundingClientRect().top;
			this.leftCanvas = this.canvas[0].getBoundingClientRect().left;
			this.x2 = this.x;
			this.y2 = this.y;
			this.x = e.clientX - this.leftCanvas; 
			this.y = e.clientY - this.topCanvas; 
		});

		// avec le doigt
		this.canvas.on("touchstart", (e) => {  
			e.preventDefault();
			this.topCanvas = this.canvas[0].getBoundingClientRect().top;
			this.leftCanvas = this.canvas[0].getBoundingClientRect().left;
			this.x = e.touches[0].clientX - this.leftCanvas; 
			this.y = e.touches[0].clientY - this.topCanvas;
			this.canvas.on("touchmove", this.draw);
		});
		this.canvas.on("touchend", (e) => { 
			e.preventDefault();
			this.canvas.off("touchmove", this.draw);
		});
		this.canvas.on("touchleave", (e) => { 
			e.preventDefault();
			this.canvas.off("touchmove", this.draw);
		});
		this.canvas.on("touchmove", (e) => { 
			e.preventDefault();
			this.x2 = this.x;
			this.y2 = this.y;
			this.x = e.touches[0].clientX - this.leftCanvas;
			this.y = e.touches[0].clientY - this.topCanvas;
		});

		// adapte taille du canvas selon taille fenêtre
		window.addEventListener("resize", (e) => {
			this.resize()
		})    
	};

	// propriétés de la fonction resize
	resize() { 
		this.canvas.prop("width", this.canvasDiv.width());
		this.canvas.prop("height", this.canvasDiv.height());
	};

}; // fin de la classe