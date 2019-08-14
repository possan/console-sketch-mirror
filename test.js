const WebSocket = require('ws');
const imageToAscii = require('image-to-ascii');

// Find host and port using any bonjour browser like the one from http://www.tildesoft.com/, then add 1 to the port number
const HOST = '192.168.1.12'
const PORT = '50236'

const ws = new WebSocket(`ws://${HOST}:${PORT}`);

// from https://github.com/zhihu/mirror/blob/master/app/src/main/java/com/zhihu/android/app/mirror/util/MirrorUtils.java#L64
const handshake = {
    'type': 'device-info',
    'instance-id': 'A6248018-58F1-425D-86B7-476447C9C38F',
    'contents': {
        'pages': [
            {
                'id': 'p1',
                'slug': 'page1',
                'name': 'Page one',
                'artboards': [
                    {
                        'id': 'ab1',
                        'slug': 'artboard1',
                        'name': 'Artboard 1',
                    }
                ]
            }
        ]
    },
    'content': {
        'name': 'Name 1',
        'uuid': 'AA112A3C-A85A-4D8A-92E2-DA8BE5934FAD',
        'display-name': 'Asciimirror',
        'user-agent': 'Mozarella',
        'path': '/',
        'screens': [
            {
                'name': 'Screen name',
                'width': 512,
                'height': 512,
                'scale': 1.0,
            }
        ]
    }
}

ws.on('open', () => {console.log('connected.'); ws.send(JSON.stringify(handshake))});
ws.on('close', () => {console.log('disconnected.');});

var dataport = 0;
var token = '';
var artboardid = '';
var artboardurl = '';

function updateimage() {
    setTimeout(() => {
        imageToAscii(artboardurl, {colored: true}, (err, converted) => {
            if (err) {
                console.log('Conversion failed', err);
            } else {
                console.log(converted);
            }
        });
    }, 0);
}

function handleMessage(data) {
    data = JSON.parse(data);

    if (!data) {
        return;
    }

    console.log('Got message', data)

    if (data.type === 'connected') {
        const content = data.content;
        dataport = content['server-port'];
        token = content['token'];
        console.log(`Connected to ${content['display-name']} with port ${dataport} and token ${token}`);
    }
    else if (data.type === 'artboard') {
        // updated artboard
        const content = data.content;
        const id = content.identifier;
        const url = `http://${HOST}:${dataport}/artboards/${id}.png?token=${token}`;
        console.log(`Artboard ${id} updated ${url}`);
        if (id === artboardid) {
            artboardurl = url;
            updateimage();
        }
    }
    else if (data.type === 'current-artboard') {
        const content = data.content;
        artboardid = content.identifier
        artboardurl = `http://${HOST}:${dataport}/artboards/${artboardid}.png?token=${token}`;
        console.log(`Current artboard is ${artboardid} with url ${artboardurl}`);
        updateimage();
    }
    else {
        console.log('Unhandled message', data)
    }
}

ws.on('message', data => handleMessage(data));
