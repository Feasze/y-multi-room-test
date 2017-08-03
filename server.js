const io = require('socket.io')(8080);
const Y = require('yjs');
require('y-memory')(Y);
require('y-array')(Y);
require('y-map')(Y);
require('y-text')(Y);
require('./y-server')(Y);

let rooms = {};

let dummyData = [
    {name: 'Foo', content: 'foo bar'},
    {name: 'Foo', content: 'foo bar'},
    {name: 'Foo', content: 'foo bar'},
    {name: 'Foo', content: 'foo bar'},
    {name: 'Foo', content: 'foo bar'},
];

io.on('connection', socket => {
    socket.on('joinRoom', room => {
        getRoom(room).then(y => {
            socket.join(room);

            y.connector.userJoined(socket.id, 'slave');
        })
    });

    socket.on('yjsEvent', msg => {
        if(msg.room != null) {
            getRoom(msg.room).then(y => {
                y.connector.receiveMessage(socket.id, msg);
            })
        }
    });

    socket.on('leaveRoom', room => {
        getRoom(room).then(y => {
            y.connector.userLeft(socket.id);
            socket.leave(room);
        })
    });
});

function getRoom(roomName) {
    if(rooms[roomName] == null) {
        rooms[roomName] = new Promise((resolve) => {
            console.log('t1');
            Y({
                  db: {
                      name: 'memory',
                  },
                  connector: {
                      name: 'y-server',
                      room: roomName,
                      io: io,
                  },
                  share: {
                      data: 'Array'
                  }
              }).then(y => {
                  console.log('t2');
                let shared = y.share.data;
                for(let i = 0; i < dummyData.length; i++) {
                    shared.insert(i, [Y.Map]);
                    let yObj = shared.get(i);

                    yObj.set('name', Y.Text);
                    yObj.get('name').insert(0, dummyData[i].name);

                    yObj.set('content', Y.Text);
                    yObj.get('content').insert(0, dummyData[i].content);
                }

                resolve(y);
            });
        });
    }

    return rooms[roomName];
}