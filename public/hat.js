var snowList = document.querySelector('#snowList');
var scene = document.querySelector('a-scene');
var carbonOverload = false;


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
        if (result.accel >= 1 ) {
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
                  var filename = 'assets/image' + Math.floor(Math.random()*6) + '.jpg';// + "?" + Math.random();
                  this.el.setAttribute('src',filename)
                  this.material.src = filename
                  this.el.setAttribute('material', this.material);
                  message.setAttribute('visible', false);
                  this.skyvisible = true;
                }
              }   
   },
   checkStatus: function() {
     var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "/updates");
        xhr.addEventListener('readystatechange', function(data)
		    { 
          if(xhr.readyState !== XMLHttpRequest.DONE) return;
          if(xhr.status !== 200 && xhr.status !== 304){
            console.warn('Could not fetch avatar info');
            return;
          }

          var result = JSON.parse(xhr.responseText);  
          self.updateSky(result);  
        });
        xhr.send();
   }
 });
