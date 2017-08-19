var snowList = document.querySelector('#snowList');
var scene = document.querySelector('a-scene');

 AFRAME.registerComponent('set-sky', {
   schema: {default:''},
   init: function() {
     this.timeout = setInterval(this.checkStatus.bind(this), 3000);
     this.material = this.el.getAttribute('material');
     this.el.setAttribute('material',{ src: '', color: 'black'})
     this.skyvisible = false;
   },
   remove: function() {
     clearInterval(this.timeout);
     this.el.removeObject3D(this.object3D);
   },
  updateSky: function(result) {
        console.log(result)
        if (result == "down" ) {
                    // snow.components['particle-system'].data['particleCount'] = 5000;
                    // enableSnow(snow);
                if (!this.skyvisible) { 
                  return;
                } else {
                    this.el.setAttribute('material',{ src: '', color: 'black'})
                    message.setAttribute('visible', true);
                    this.skyvisible = false;
                }
              } else {
                if (this.skyvisible) { 
                  return;
                } else {
                  var filename = '360/image' + Math.floor(Math.random()*6) + '.jpg';// + "?" + Math.random();
                  this.el.setAttribute('src',filename)
                  this.material.src = filename
                  this.el.setAttribute('material', this.material);
                  message.setAttribute('visible', false);
                  this.skyvisible = true;
                }
              }   
   },
   checkStatus: function() {
    if (hatClick.isConnected) {
        hatClick.getBodySensorLocation().then((e) => this.updateSky(e));
    }


   }
 });
