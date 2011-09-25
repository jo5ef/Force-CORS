function Forcecors() {
	this.enabled = false;
	this.observer = {
		observe: function(subject, topic, data) {
			if(topic == 'http-on-examine-response') {
				var httpChannel = subject.QueryInterface(Components.interfaces.nsIHttpChannel);
				var headers = Forcecors.getHeaders();
				for(var i = 0; i < headers.length; i++) {
					var keyValue = headers[i].split(':');
					httpChannel.setResponseHeader(keyValue[0], keyValue[1], false);
				}
			}
		}
	};
};

Forcecors.getHeaders = function() {
	var prefs = Components.classes['@mozilla.org/preferences-service;1']
		.getService(Components.interfaces.nsIPrefBranch);
	var headers = prefs.getCharPref('forcecors.headers');
	if(headers != null) {
		return headers.split(' ');
	}
	return [];
};

Forcecors.prototype.updateLabel = function() {
	var btn = document.getElementById('forcecors-button');
	if(this.enabled) {
		btn.label = 'CORS';
		btn.tooltipText = 'CORS is currently forced';
		btn.className += 'enabled';
	} else {
		btn.label = 'cors';
		btn.tooltipText = 'click to force CORS';
		btn.className = btn.className.replace(/\benabled\b/,'');
	}
};

Forcecors.prototype.toggle = function() {
	var os = Components.classes["@mozilla.org/observer-service;1"]
		.getService(Components.interfaces.nsIObserverService);

	if(this.enabled) {
		os.removeObserver(this.observer, "http-on-examine-response");
	} else {
		os.addObserver(this.observer, "http-on-examine-response", false);
	}
	this.enabled = !this.enabled;
	this.updateLabel();
};

var forcecors = new Forcecors();
forcecors.updateLabel();
