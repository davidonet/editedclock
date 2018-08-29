var currentStatus = 'non connecté';

var onGetDevices = function(ports) {
    console.log('onGetDevices');
    for (var i = 0; i < ports.length; i++) {
        $('#connect').prepend('<option>' + ports[i].path + '</option>');
    }
    $('#connect').prepend("<option/>");
    $('#connect').change(function() {
        chrome.serial.connect($('#connect').val(), {
            bitrate: 57600,
            name: 'arduino'
        }, onConnect);
    });
};

var onConnect = function(connectionInfo) {
    console.log('onConnect');
    chrome.serial.onReceive.addListener(onReceiveCallback);
    if (connectionInfo != undefined) {
        aConnectionId = connectionInfo.connectionId;
        console.log(connectionInfo);
        $('#status').val('connexion...');
        chrome.serial.send(aConnectionId, buf, function(data) {
            console.log(aConnectionId, 'sent', data);
            currentStatus = 'connecté';
            $('#status').val(currentStatus);
            $('#connect').attr('readonly', true);
        });

    }
};

var onReceiveCallback = function(info) {
    console.log('onReceiveCallback', info);
    if (info.connectionId == aConnectionId && info.data) {
        $('#status').val('réception');

        var uint8View = new Uint8Array(info.data);
    }
};

chrome.serial.getDevices(onGetDevices);
