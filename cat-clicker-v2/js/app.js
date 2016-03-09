var initCats = [
    {
      name: "King",
      clickCount: 0,
      imgSrc: "images/cat2.jpg",
      nickNames: ["king", "daking", "cute"]
    },
    {
      name: "pepper",
      clickCount: 0,
      imgSrc: "images/cat3.jpg",
      nickNames: ["vg", "doddo", "da"]
    },
    {
      name: "tututu",
      clickCount: 0,
      imgSrc: "images/cat4.jpg",
      nickNames: ["fafa", "go", "alphago"]
    }
];

var Cat = function (data) {
  this.name = ko.observable(data.name);
  this.clickCount = ko.observable(data.clickCount);
  this.imgSrc = ko.observable(data.imgSrc);
  this.nickNames = ko.observable(data.nickNames);

  this.title = ko.computed(function () {
    var clicks = this.clickCount();
    if (clicks < 10) {
      return "newBorn";
    } else if (clicks < 20) {
      return "infant";
    } else if (clicks < 60){
      return "teen";
    }
  }, this);
};

var ViewModel = function () {
  var self = this;

  this.catList = ko.observableArray([]);
  initCats.forEach(function(catItem) {
    self.catList.push(new Cat(catItem));
  });
  this.currentCat = ko.observable(this.catList()[0]);
  this.incrementClickCount = function() {
    self.currentCat().clickCount(self.currentCat().clickCount() + 1);
  };
  self.updateCurrentCat = function(cat) {
    self.currentCat(cat);
  };
};

ko.applyBindings(new ViewModel());
