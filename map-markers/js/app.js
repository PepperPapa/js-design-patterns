var model = {
  init: function () {
    var self = this;
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: new google.maps.LatLng(28.2497179, 113.0958297),
      disableDefaultUI: true,
      scaleControl: true
    });
    this.placeService = new google.maps.places.PlacesService(self.map);
    this.infowindow = new google.maps.InfoWindow();
    this.allMarkers = [];
  },
  createMarker: function(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location
    });
    this.allMarkers.push(marker);
    
    google.maps.event.addListener(marker, 'click', function() {
      model.infowindow.setContent(place.name + '...');
        
      // load wikipedia data
      var wikiURL = "https://zh.wikipedia.org/w/api.php?" +
          "action=opensearch&format=json&formatversion=2&search=" +
          place.name + "&namespace=0&limit=10&suggest=true";
      var  wikiRequestTimeout = setTimeout(function() {
        console.log("wikipedia have no response.");
      }, 8000);
      
      $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        // jsonp: "callback",
        success: function (response) {
          // console.log(response[2].toString());
          if (response[2].toString().length > 0) {
            model.infowindow.setContent(response[2].toString());
          }
          clearTimeout(wikiRequestTimeout);
        }
      });
      
      model.infowindow.open(model.map, this);
    });
  }
};

var octopus = {
  init: function() {
    model.init();
    view.init();
  },
  searching: function(place) {
    var request = {
      location: {lat: 28.2497179, lng: 113.0958297},
      radius: '500',
      query: place
    };
    
    model.placeService.textSearch(request, function(results, status) {
      if (status ==  google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          model.createMarker(results[i]);
          view.showSearchItem(results[i]);
        }
      }
    });
  },
  clearMarkers: function() {
    model.allMarkers.forEach(function(marker) {
      marker.setMap(null);
    });
    model.allMarkers.length = 0;
  }
};

var view = {
  init: function() {
    var self = this;
    this.map_container = document.getElementById('map');    
    this.fold_search_list = document.getElementById('fold-search-list');
    
    this.search_bar = document.getElementById('search-bar');
    this.search_list_ul = document.getElementById('search-list');
    this.search_input = document.getElementById('search-input');
    this.search_input.addEventListener('keypress', function(e) {
      if (e.keyCode == 13) {
        octopus.clearMarkers();
        octopus.searching(self.search_input.value);
        
        // clear search list first
        self.search_list_ul.innerHTML = "";
        
        self.search_list_ul.className = "show";
        self.fold_search_list.className = "show";
        self.fold_search_list.innerText = "<";
        self.search_bar.className = "bg-blue";
      }
    });
    
    this.fold_search_list.addEventListener('click', function(e) {
      if (self.fold_search_list.className == 'show') {
        if (self.fold_search_list.innerText == '<') {
          self.fold_search_list.style.left = '0px';
          self.search_bar.style.left = '-420px';
          self.search_list_ul.style.left = '-420px';
          self.fold_search_list.innerText = '>';
        } else {
          self.fold_search_list.style.left = '420px';
          self.search_bar.style.left = '0px';
          self.search_list_ul.style.left = '0px';
          self.fold_search_list.innerText = '<';
        }
      }
    });
  },
  showSearchItem: function(place) {
    var liElement = document.createElement('li');
    liElement.className = "place-item";
    liElement.innerHTML = "<div class='li-name'>" + place.name + "</div>" +
              "<div class='li-addr'>" + place.formatted_address + "</div>" +
                  "<img class='li-img' src=" + place.icon + ">"  + "</img>";
    this.search_list_ul.appendChild(liElement);    
  }
};

octopus.init();































