
(function(ext) {

	//set Low and High values
	var LOW = 0,
	HIGH = 1;

	var hwList = new HWList();

	// Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    //connect an led to a pin
    ext.connectHW = function(hw, pin) {
    hwList.add(hw, pin);
};

    //Code that exectutes when the turn led on block is used
    //set the led to 0 or 1
	ext.digitalLED = function(led, val) {
    	var hw = hwList.search(led);
    	if (!hw) return;
    	if (val == 'on') {
     		digitalWrite(hw.pin, HIGH);
      		hw.val = 255;
    	} else if (val == 'off') {
      		digitalWrite(hw.pin, LOW);
     		 hw.val = 0;
    	}
	};
	

	// Block and block menu descriptions
    var descriptor = {
        blocks: [
        	//Block type, block name, function namem param1, param2
        	[' ', 'TUrn on LED', 'digitalLED', 'LED A', 'on'],
        	[' ', 'connect %m.hwOut to pin %n', 'connectHW', 'led A', 3],
        ]
    };


	//set up the device
	function HWList() {
    	this.devices = [];

    	this.add = function(dev, pin) {
      	var device = this.search(dev);
      	if (!device) {
        	device = {name: dev, pin: pin, val: 0};
        	this.devices.push(device);
      	} else {
        	device.pin = pin;
        	device.val = 0;
      		}
    	};

    	this.search = function(dev) {
      		for (var i=0; i<this.devices.length; i++) {
        		if (this.devices[i].name === dev)
         		 return this.devices[i];
      		}
      	return null;
    	};
	}

	//method for setting the LED
	ext.setLED = function(led, val) {
    	var hw = hwList.search(led);
    	if (!hw) return;
    	analogWrite(hw.pin, val);
    	hw.val = val;
  	};


	//method for changing the LED
	ext.changeLED = function(led, val) {
    var hw = hwList.search(led);
    if (!hw) return;
    var b = hw.val + val;
    if (b < 0) b = 0;
    else if (b > 100) b = 100;
    analogWrite(hw.pin, b);
    hw.val = b;
};

	

	// Register the extension
    ScratchExtensions.register('Arduino', descriptor, ext, {type:'serial'});
})({});




