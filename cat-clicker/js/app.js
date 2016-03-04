var model = {
  currentCat: null,
  cats: [
      {name: "cat1", clickCount: 0, src: "./images/cat1.jpg"},
      {name: "cat2", clickCount: 0, src: "./images/cat2.jpg"},
      {name: "cat3", clickCount: 0, src: "./images/cat3.jpg"},
      {name: "cat4", clickCount: 0, src: "./images/cat4.jpg"},
      {name: "cat5", clickCount: 0, src: "./images/cat5.jpg"},
  ]
};

var octopus = {
  init: function() {
    model.currentCat = model.cats[0];

    catListView.init();
    catView.init();
    adminView.init();
  },
  setCurrentCat: function(cat) {
    model.currentCat = cat;
  },
  getCurrentCat: function() {
    return model.currentCat;
  },
  getAllCats: function() {
    return model.cats;
  },
  incrementClickCount: function() {
    model.currentCat.clickCount += 1;
    catView.render();
    adminView.render(this.getCurrentCat());
  },
  clickAdmin: function() {
    adminView.isShow = true;
    adminView.render(this.getCurrentCat());
  },
  clickSave: function() {
    var newCat = adminView.getInputValue();
    this.setCurrentCat(newCat);
    catView.render();
  },
  clickCancel: function() {
    adminView.isShow = false;
    adminView.render();
  }
};

var catView = {
  init: function() {
    this.catName = $('#cat-name')[0];
    this.clickCount = $('#click-count')[0];
    this.cat = $('#selected-cat')[0];
    this.cat.addEventListener('click', function() {
      octopus.incrementClickCount();
    });
    this.render();
  },
  render: function() {
    var currentCat = octopus.getCurrentCat();
    this.catName.textContent = currentCat.name;
    this.clickCount.textContent = currentCat.clickCount;
    this.cat.src = currentCat.src;
  }
};

var catListView = {
  init: function() {
    this.catsul = $("#cats")[0];
    this.render();
  },
  render: function() {
    var cats = octopus.getAllCats();
    this.catsul.innerHTML = '';

    for (var i = 0; i < cats.length; i++) {
      var catli = document.createElement("li");
      var catimg = document.createElement("img");
      catimg.src = cats[i].src;
      catimg.addEventListener("click", (function(copyCat) {
        return function() {
          octopus.setCurrentCat(copyCat);
          catView.render();
          adminView.render(octopus.getCurrentCat());
        };
      })(cats[i]));
      catli.appendChild(catimg);
      this.catsul.appendChild(catli);
    }
  }
};

var adminView = {
    init: function() {
      this.isShow = false;
      this.adminbtn = $('#admin-btn')[0];
      this.save = $('#save')[0];
      this.cancel = $('#cancel')[0];

      this.admin = $('#admin')[0];
      this.name = $('#name')[0];
      this.URL = $('#URL')[0];
      this.clickNum = $('#click-num')[0];

      this.adminbtn.addEventListener('click', function() {
        octopus.clickAdmin();
      });
      this.save.addEventListener('click', function() {
        octopus.clickSave();
      });
      this.cancel.addEventListener('click', function() {
        octopus.clickCancel();
      });
    },
    getInputValue: function() {
      return {
        name: this.name.value,
        src: this.URL.value,
        clickCount: parseInt(this.clickNum.value)
      };
    },
    render: function(currentCat) {
      if (this.isShow) {
        this.name.value = currentCat.name;
        this.URL.value = currentCat.src;
        this.clickNum.value = currentCat.clickCount;
        this.admin.style.display = "block";
      } else {
        this.admin.style.display = "none";
      }
    }
};

octopus.init();
