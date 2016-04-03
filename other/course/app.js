#!/usr/bin/env node

var io  = require('socket.io')(8752),
    pty = require('pty.js');

var socket,terminal;
io.on('connection', function(sock) {
    socket = sock;
    if(terminal){
        terminal.socket = socket;
        terminal.wake();//if term is null, create new term.
    }else{
        terminal = new Terminal(socket);
    }
    socket.on('message',function(packet){
        console.log('docker DATA:'+JSON.stringify(packet));
        terminal.onMessage(packet.cmd,packet.data);
    });
});

function Terminal(socket){
    this.socket = socket;
    this.buff    = [];
    this.wake();
}
Terminal.prototype.wake = function(){
    if(this.term){
        this.term.write('clear\r');
        return;
    }
    this.term = pty.spawn('bash', [], {
        name: 'xterm-color',
        env : { HOME:'/home/hubwiz' },
        cwd: '/home/hubwiz',
        cols: 80,
        rows: 24,
        gid:1000,
        uid:1000
    });

    this.term.on('data', function(data) {
        return !self.socket
            ? self.buff.push(data)
            : self.socket.send({ cmd:'output',data:data });
    });
    var self = this;
    this.term.on('exit',function(code){
        console.log('term 退出:'+code);
        self.term = null;
    });

};
Terminal.prototype.input = function(data){
    if(typeof data === 'string'){
        this.term && this.term.write(data);
    }
};
Terminal.prototype.resize = function(data){
    if(data && !isNaN(data.rows) && !isNaN(data.cols)){
        this.term && this.term.resize(data.cols,data.rows);
    }
};
Terminal.prototype.onMessage = function(cmd,data){
    switch (cmd){
        case 'resize':
            this.resize(data);
            break;
        case 'input':
            this.input(data);
            break;
        default :
            break;
    }
};