$(function() {
	var buf = new ArrayBuffer(1);
	var bufView = new Uint8Array(buf);
	bufView[0] = 0;
	var count = 0;

	var setup = function() {
		count = 0;
		$('#date').attr('value', new Date().toISOString());
		$('#count').text(count);
		$('#status').val('connexion...');
		chrome.serial.send(aConnectionId, buf, function() {
			$('#status').val('connecté');
		});
	};

	var aConnectionId;
	$('#date').attr('value', new Date().toISOString());
	var onGetDevices = function(ports) {
		for (var i = 0; i < ports.length; i++) {
			$('#connect').prepend('<option>' + ports[i].path + '</option>')
		}
		$('#connect').prepend("<option/>");
		$('#connect').change(function() {
			chrome.serial.connect($('#connect').val(), {
				bitrate : 115200
			}, onConnect);
		});
	};
	var onConnect = function(connectionInfo) {
		if (connectionInfo != undefined) {
			aConnectionId = connectionInfo.connectionId;
			$('#status').val('connexion...');
			chrome.serial.send(aConnectionId, buf, function() {
				$('#status').val('connecté');
			});
		}
	};

	var onReceiveCallback = function(info) {
		if (info.connectionId == aConnectionId && info.data) {
			$('#status').val('réception');
			setTimeout(function() {
				$('#status').val('connecté');
			}, 200);
			var uint8View = new Uint8Array(info.data);
			$('#total').text(uint8View[0] * 10);
			count++;
			$('#count').text(count);
		}
	};

	chrome.serial.getDevices(onGetDevices);
	chrome.serial.onReceive.addListener(onReceiveCallback);

	$('#new').click(function() {
		setup();
	});
	$('#cancel').click(function() {
		setup();
	});

});
