
/* --------------- CLASS SLIDER -------------- */

"use strict";
// création de la class slider
class Slider {
	constructor(container, timeout, fadeout, fadein) {
        this.slider = $(container);
        this.timeout = timeout;
        this.fadein = fadein;
		this.fadeout = fadeout;
        this.slide = this.slider.find(".slide");
		this.dot = this.slider.find(".dot");
		this.progressbar= this.slider.find(".progressbar");
		this.indexSlide = this.slide.length - 1;
		this.i = 0;
		this.activeSlide = this.slide.eq(this.i);
		this.activeDot = this.dot.eq(this.i);
		this.next = this.slider.find("#slider-next");
		this.prev = this.slider.find("#slider-prev");
        this.pause = this.slider.find("#slider-pause");
        this.initSettings();
    };

    // quand slide suivante
	nextSlide() {
        this.i++; // on incrémente l'index

        if (this.i > this.indexSlide) {
        this.i = 0; // on revient au début
        };

        this.changeSlide();
        clearTimeout(this.animation); // on annule le timeout

        if (this.pause.children().hasClass("fa-play")) {
            this.progressbar.animate({width: 0}, 0);
            return;
        }

        this.slideLoop(); // on relance le timeout à 0
        this.progressbar.stop();
        this.progressbar.css("width", 0);
        this.launchprogressbar();

    };

    // quand slide précédente
    prevSlide() {
        this.i--;
        if (this.i < 0) {
            this.i = this.indexSlide;
        };

        this.changeSlide();
        clearTimeout(this.animation);

        if (this.pause.children().hasClass("fa-play")) {
            this.progressbar.animate({width: 0}, 0);
            return;
        }

        this.slideLoop();
        this.progressbar.stop();
        this.progressbar.css("width", 0);
        this.launchprogressbar();
    };

    // animation automatique des slides
	slideLoop() {
		this.animation = setTimeout( () => {
			if (this.i < this.indexSlide) {
            	this.i++;
             }
            else {
            	this.i = 0;
            };
            this.changeSlide();
            this.slideLoop();
            this.launchprogressbar();
        },  this.timeout); // toutes les 5 secondes
    };


    // initialisation de la fonction: on change de slide
	changeSlide() {
		this.activeSlide.fadeOut(this.fadeout);
        this.activeSlide = this.slide.eq(this.i);
        this.activeSlide.fadeIn(this.fadein);
        this.dot.removeClass('dot-active');
        this.activeDot = this.dot.eq(this.i);
        this.activeDot.addClass("dot-active");
	};

    // lancement barre de progression
	launchprogressbar() {
		let percent = this.progressbar.attr("data-percent"); // récupère le data 100% de l"élément
        this.progressbar.animate( {
        	width: percent // on passe de 0% à 100%
        },this.timeout, "linear", () => {
        	this.progressbar.css("width", 0); // une fois l'animation complète, on revient à 0
        });
    };

    // lancement du slider
    initSettings() {
        this.activeSlide.css({
			display: "block"
        });

        this.activeDot.addClass("dot-active");
        this.launchprogressbar();
        this.slideLoop();

        // pour régler bug en cas de changement d'onglet chrome et safari
       $(window).blur( () => {
            clearTimeout(this.animation);
            this.pause.children(":first").removeClass("fa-pause").addClass("fa-play");
        });

		this.next.click( (event) => {
            this.nextSlide();
    	});

    	this.prev.click( (event) => {
            this.prevSlide();
    	});

        this.pause.click( (event) => {
            if (this.pause.children(":first").hasClass("fa-pause")) {
                clearTimeout(this.animation);
                this.progressbar.stop();
                this.pause.children(":first").removeClass("fa-pause").addClass("fa-play");
            } else if (this.pause.children().hasClass('fa-play')) {
                this.pause.children(":first").removeClass("fa-play").addClass("fa-pause");
                this.nextSlide();
            }
        });

        this.dot.click( (event) => {
            if (this.pause.children().hasClass("fa-play")) {
                this.pause.children(":first").removeClass("fa-play").addClass("fa-pause");
            };

    		this.i = $(event.target).index(); // prend l'index de l'élément cliqué
    		this.activeSlide.fadeOut(this.fadeout);
        	this.activeSlide = this.slide.eq(this.i);
        	this.activeSlide.fadeIn(this.fadein);
        	this.dot.removeClass('dot-active');
            $(event.target).addClass('dot-active');
            clearTimeout(this.animation);
        	this.slideLoop();
        	this.progressbar.stop();
        	this.progressbar.css("width", 0);
        	this.launchprogressbar();
		});

        // événement avec les touches du clavier
        $(document).keyup((touche) => {
            let saisie = touche.code || touche.key;
            if (saisie === "ArrowRight") {
               this.nextSlide();
            }
            else if (saisie === "ArrowLeft") {
               this.prevSlide();
            }
            else if (saisie === "Enter") {
                if (this.pause.children(":first").hasClass("fa-pause")) {
                    clearTimeout(this.animation);
                    this.progressbar.stop();
                    this.pause.children(":first").removeClass("fa-pause").addClass("fa-play");
                } else if (this.pause.children().hasClass('fa-play')) {
                    this.pause.children(":first").removeClass("fa-play").addClass("fa-pause");
                    this.nextSlide();
                }
            }
        });
    };

};