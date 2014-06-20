var results = [];
var id = 0;
var count = 0;
var sum = 0;
var isStarted = false;
var currentStatus = 'non connecté';

$(function() {
	var buf = new ArrayBuffer(1);
	var bufView = new Uint8Array(buf);
	bufView[0] = 0;

	var setup = function() {
		count = 0;
		$('#date').val(new Date().toISOString());
		$('#count').text(count);
		$('#status').val(currentStatus);
		sum = 0;
		$('#total').text(0);
		$('#sum').text(0);
		isStarted = false;
		$('#status').val(currentStatus);
	};

	var aConnectionId;
	$('#date').attr('value', new Date().toISOString());
	var onGetDevices = function(ports) {
		for (var i = 0; i < ports.length; i++) {
			$('#connect').prepend('<option>' + ports[i].path + '</option>');
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
				currentStatus = 'connecté';
				$('#status').val(currentStatus);
				$('#connect').attr('readonly', true);
			});
		}
	};

	var onReceiveCallback = function(info) {
		if (info.connectionId == aConnectionId && info.data) {
			$('#status').val('réception');
			if (isStarted) {
				var uint8View = new Uint8Array(info.data);
				if (255 == uint8View[0]) {
					isStarted = false;
					currentStatus = 'temps dépassé';
				} else {
					$('#total').text(uint8View[0] * 20);
					sum += uint8View[0] * 20;
					$('#sum').text(sum);
					count++;
					$('#count').text(count - 1);
					if (60 < count) {
						isStarted = false;
						currentStatus = 'comptage atteint';
					}
					if (1 < count)
						results[id][count] = uint8View[0];
				}
			} else {
				currentStatus = 'non démarré';
			}
			setTimeout(function() {
				$('#status').val(currentStatus);
			}, 200);
		}
	};

	chrome.serial.getDevices(onGetDevices);
	chrome.serial.onReceive.addListener(onReceiveCallback);

	$('#new').click(function() {
		$('#name').val('')
		$('#name').prop("readonly", false);
		setup();
		id++;
		$('#people').text(id);
	});

	$('#start').click(function() {
		if ($('#name').val() != '') {
			setup();
			results[id] = new Array(62);
			results[id][0] = $('#date').val();
			results[id][1] = $('#name').val();
			$('#name').prop("readonly", true);
			chrome.serial.send(aConnectionId, buf, function() {
				currentStatus = "démarré";
				$('#status').val(currentStatus);
				isStarted = true;
			});
		} else {
			currentStatus = "pas de nom !";
			$('#status').val(currentStatus);
		}
	});

	$('#save').click(function() {
		chrome.fileSystem.chooseEntry({
			type : 'saveFile',
			suggestedName : 'data' + $('#date').val() + '.csv'
		}, function(writableFileEntry) {
			writableFileEntry.createWriter(function(writer) {
				writer.onwriteend = function(e) {
					$('#status').val("données enregistrées");
				};
				var csv = '';

				results.forEach(function(row, j) {
					row.forEach(function(col, j) {
						csv += col + ';'
					});
					csv += '\n';
				});
				writer.write(new Blob([csv], {
					type : 'text/plain'
				}));
			}, function() {
				console.log("error writing");
			});
		});
	});
});

