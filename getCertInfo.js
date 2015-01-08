var spawn = require('child_process').spawn,
    readline = require('readline'),
    stream = require('stream'),
    x509 = require('x509.js');

function   getCertInfo(domain, _callback){
        var openssl_args = [
            's_client',
            '-showcerts',
            '-connect',
            domain.concat(':443'),
            '-servername',
            domain
        ],
        echo = spawn('echo', ['\'x\'']),
        openssl = spawn('openssl', openssl_args),
        certChain = [],
        writeToggle = 0,
        certString = '',
        outstream = new stream.Writable(),
        rl = readline.createInterface({
            input: openssl.stdout,
            output: outstream
        });

        var openssl_timeout = setTimeout(function(){
            openssl.kill();
            console.log('Killed openssl');
        }, 15000);

        rl.on('line', function(line){
            if(line.match(/--BEGIN/i)){
            writeToggle = 1;
            }
            if(writeToggle){
                outstream.write(line);
            }
            if(line.match(/--END/i)){
                writeToggle = 0;
            }
        });

        rl.on('close', function(){
            _callback(certChain);
        });

        outstream._write = function(chunk, encoding, done){
            certString += chunk + '\n';
            if(chunk.toString().match(/--END/i)){
                certChain.push(x509.parseCert(certString));
                certString = '';
            }
            done();
        };

        echo.stderr.on('data', function (data) { });

        echo.on('close', function (code) {
            if (code !== 0) {
                console.log('echo process exited with code ' + code);
            }
            openssl.stdin.end();
        });
        openssl.stdout.on('data', function (data) { });
        openssl.stderr.on('data', function (data) {
        //    console.log('openssl stderr: ' + data);
        });
        openssl.on('close', function (code) {
            if (code !== 0) {
                console.log('openssl process exited with code ' + code);
            } else {
                console.log('openssl exited succesfully with code: ' + code);
                clearTimeout(openssl_timeout);
            }
        });

    }

module.exports = getCertInfo;
