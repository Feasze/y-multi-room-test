function extend(Y) {
    class Connector extends Y.AbstractConnector {
        constructor(y, options) {
            options.role = 'master';
            options.forwardAppliedOperations = true;
            options.generateUserId = true;

            //function to check if an connected client can read or write
            options.checkAuth = function(auth) {
                return Promise.resolve('write');
            };

            super(y, options);
            this.options = options;
            this.io = options.io;

        }

        disconnect() {
            //throw new Error('disconnected');
        }

        reconnect() {
            //throw new Error('reconnected');
        }

        send(uid, message) {
            message.room = this.options.room;
            this.io.to(uid).emit('yjsEvent', message);
        }

        broadcast(message) {
            message.room = this.options.room;
            this.io.in(this.options.room).emit('yjsEvent', message);
        }

        isDisconnected() {
            return false;
        }
    }

    Y.extend('y-server', Connector)
}

module.exports = extend;
if(typeof Y !== 'undefined') {
    extend(Y)
}