
/* ----------------- CLASS RESA ----------------- */

"use strict";
// création de la class Resa
class Resa { 
	constructor(form, timer, canvas) { 
		this.form = $(form); 
		this.timer = timer; // en millisecondes (20min = 20*60*1000)
		this.canvas = canvas; 
		this.beforeForm = $("#consigne-avant-resa"); 
		this.formName = this.form.find("#name"); 
		this.formFirstName = this.form.find("#firstname"); 
		this.intervalResa = null;
		this.stopTimer = null;
		this.regexResa = /......../;
		this.documentHeight = $(document).height();
		this.initSettings();
	}; 

	initSettings() {

		// window.addEventListener('DOMContentLoaded', function() { 
		$(document).ready(($) =>{	

			if (!localStorage.name) { 
				console.log("nom manquant"); 
			} else { 
				this.setStyles(); 
			}

			if (!sessionStorage.stoptimer) { 
				console.log("Pas de réservation en cours");
			} else { 
				console.log("Une réservation est en cours");
				this.stopTimer = sessionStorage.stoptimer;
				console.log(this.stopTimer);
				$("#message-confirmation").css("display", "block"); 
				$("#station-confirmee").html(`${sessionStorage.station}`); 
				$("#nom-confirme").html(`${localStorage.firstname} ${localStorage.name}`); 
				this.loopTimer();
				this.documentHeight = $(document).height(); 
				$("html, body").animate({
					scrollTop: this.documentHeight
				}, 1000); 
			};
		});

		// à la soumission du formulaire, on déclenche =>
		this.form.submit((event) => { 
			event.preventDefault();
			this.canvas.canvasContainer.css("display", "block"); 
			this.beforeForm = $("#consigne-avant-resa"); 
			$("#station-confirmee").html(this.beforeForm.text().replace(this.regexResa, ""));
			$("#nom-confirme").html(`${this.formFirstName.val()} ${this.formName.val()}`); 
			clearInterval(this.intervalResa);
			$("#timer").html(""); 
			this.documentHeight = $(document).height();
			$("html, body").animate({ 
				scrollTop: $("#canvas-instruction").offset().top
			}, 1000);
		});

		// on clique sur recommencer
		this.canvas.clear.click((e) => { 
			clearInterval(this.intervalResa); // on ne lance pas le timer
			$("#timer").html(""); 
			this.canvas.ctx.clearRect(0, 0, this.canvas.canvas.width(), this.canvas.canvas.height()); 
			this.canvas.canvasFilled = false;
		});

		// on valide le canvas
		this.canvas.submit.click((e) => { 
			e.preventDefault();
			// si le canvas n'est pas rempli
			if (!this.canvas.canvasFilled) { 
				alert("Vous devez signer pour confirmer votre réservation!");
			// si le canvas est rempli
			} else { 
				this.stopTimer = new Date().getTime() + this.timer;
				sessionStorage.stoptimer = this.stopTimer; 
				this.populateStorage(); 
				this.loopTimer(); 
				$("#canvas").css("display", "none"); 
				$("#form-container").css("display", "none"); 
				$("#message-confirmation").css("display", "block"); 
				this.documentHeight = $(document).height(); 
				$("html, body").animate({
					scrollTop: this.documentHeight
				}, 1000); 
				$(window).on('beforeunload', (event) => { 
					event.preventDefault();
					event.returnValue = "Si vous quittez la page, les informations seront perdues";
				});
			};
		});
	}

	// création du compte à rebours
	loopTimer() {  
		this.intervalResa = setInterval( () => { 
				let startTimer = new Date().getTime(); 
				let distance = this.stopTimer - startTimer; 
				let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); 
				let seconds = Math.floor((distance % (1000 * 60)) / 1000); 
				$("#timer").html(`${minutes}m ${seconds}s`); 
				// fin du décompte
				if (distance < 0) { 
					clearInterval(this.intervalResa); 
					$("#message-confirmation").css("display", "none"); 
					$("#resa-expiree").css("display", "block"); 
					sessionStorage.clear(); 
				};
			}, 1000);
	};

	// récupération des valeurs avec SessionStorage et LocalStorage
	setStyles() { 
	  let currentName = localStorage.name; 
	  let currentFirstname = localStorage.firstname; 
	  let currentStation = sessionStorage.station; 
	  this.formName.val(currentName); 
	  this.formFirstName.val(currentFirstname);
	  $("#station-confirmee").html(currentStation);
	};

	// enregistrement des valeurs
	populateStorage() { 
		localStorage.name = this.formName.val(); 
		localStorage.firstname = this.formFirstName.val(); 
		sessionStorage.station = $("#station-confirmee").text(); 
		this.setStyles(); 
	};
};
