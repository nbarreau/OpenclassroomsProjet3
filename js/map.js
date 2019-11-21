
/* ------------------ CLASS MAP ------------------ */

"use strict";
// création de la class Map
class Map { 
    constructor(container, mapID, lat, lng, zoom, ajaxURL) { 
        this.container = $(container);
        this.mapID = mapID;
        this.latView = lat;
        this.lngView = lng;
        this.zoom = zoom;
        this.ajaxURL = ajaxURL; // JSON de JC Decaux pour récup infos
        this.map = L.map(map).setView([this.latView, this.lngView], this.zoom);  
        this.tilelayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
			    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 16,
                minZoom: 14,
			    id: "mapbox.streets",
			    accessToken: "pk.eyJ1IjoibmF0YmEiLCJhIjoiY2sxajd4aWJqMHdtcjNjcGM3dXRjZ3cyZCJ9.63TJsZC5ald4IA3rXyQiAA"
        });
        this.tilelayer.addTo(this.map);  
         // création des détails de la stations (=> reprend les infos de l"API de JCDecaux)
        this.stationDetail = {  
            init: function (name, address, positionlat, positionlng, banking, status, bikestands, availableBikeStands, availableBikes, lastUpdate) {
                this.name = name;
                this.address = address;
                this.position = {
                    lat: positionlat,
                    lng: positionlng
                };
                this.banking = banking;
                this.status = status;
                this.bike_stands = bikestands;
                this.available_bike_stands = availableBikeStands;
                this.available_bikes = availableBikes;
                this.last_update = lastUpdate;
            }
        };

        // création des icones avec l'API Leaflet 
        this.greenIcon = L.icon({
            iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            shadowSize: [41, 41],
        });
        this.orangeIcon = L.icon({
            iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            shadowSize: [41, 41],
        });
        this.redIcon = L.icon({
            iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            shadowSize: [41, 41],
        });
        this.document = $(document);
        this.regex = /......./; 
        this.name = this.container.find("#name"); 
        this.firstname = this.container.find("#firstname");
        this.initSettings();

    }; // fin du constructeur de la class


    // quand on clique sur un marker de station
    newMarkerClic(newStation) {
        document.getElementById("consigne-avant-resa").remove();
        $("#resa-container").prepend('<p id="consigne-avant-resa"></p>'); 
        $("#consigne-avant-resa").append(newStation.name.replace(this.regex, "STATION ")); 
        $("#station-infos").css("display", "block"); 
        $("#station-infos li").html(""); 
        $("#resa-container form").css("display", "none"); 
        $("#nobikes").css("display", "none"); 
        $("#station-infos li:first").append(`Adresse : ${newStation.address.toLowerCase()}`); 
        $("#station-infos li:eq(1)").append(`Nombre de places : ${newStation.bike_stands}`); 
        $("#station-infos li:last").append(`Nombre de vélos disponibles : ${newStation.available_bikes}`); 
        $("#message-confirmation").css("display", "none"); 
        $("#resa-expiree").css("display", "none"); 
        $("#canvas-container").css("display", "none"); 

        // si velos dispo
        if (newStation.available_bikes > 0) { 
            $("#resa-container form").css("display", "block"); 
			$("html, body").animate({ 
			    scrollTop: $("#consigne-avant-resa").offset().top
            }, 1000);   
        } 

        // si pas de vélos dispo
        else { 
            $("#nobikes").css("display", "block"); 
            $("html, body").animate({ 
                scrollTop: $("#consigne-avant-resa").offset().top
            }, 1000);
        }
    }

    // lancement d"ajax 
    launchAjax() {
        $.ajax({
            url: this.ajaxURL,
            type: "GET",
            dataType: "json",
            data: {param1: "value1"},
        })
        .done(function() {
            console.log("success");
        })
        .fail(function() {
            console.log("error");
        })
        .always( (response) => {
            console.log("complete");
            this.ajaxOK(response);
        });
    };

    initSettings() {
        this.launchAjax();
    }

    // fonction qui se déclenche quand lancement Ajax OK
    ajaxOK(response) { 
        let stations = response; 
        for (let station of stations) { 
            let newStation = Object.create(this.stationDetail); 
            newStation.init(station.name, station.address, station.position.lat, station.position.lng, station.banking, station.status, station.bike_stands, station.available_bike_stands, station.available_bikes, station.last_update);
            //  par défault, l'icône est verte
            let myIcon = this.greenIcon; 
            // si la station est fermée
            if (newStation.status === "CLOSED") { 
                newStation.available_bikes === 0; 
            };
            // s'il y a moins de 10 vélos dispos ou que la station est fermée (0 vélos dispos) on change l'icone de couleur
            if (newStation.available_bikes < 10) { 
                myIcon = this.orangeIcon; 
                if (newStation.available_bikes === 0) { 
                    myIcon = this.redIcon; 
                }
            }
            let newMarker = L.marker([newStation.position.lat, newStation.position.lng], {icon: myIcon}, {opacity: 1}, {bubblingMouseEvents: true}, {interactive: true});
            newMarker.bindPopup(newStation.name.replace(this.regex, "STATION ")); 
            newMarker.addTo(this.map).on("click", (e) => {
                this.newMarkerClic(newStation);
            });
        };
    };
};

