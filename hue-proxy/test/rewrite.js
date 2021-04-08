const expect = require("chai").expect;
const axios = require('axios');
var spawn = require('child_process').spawn;

var children  = [];

let kill = function() {
    console.log('killing', children.length, 'child processes');
    children.forEach(function(child) {
        try {
            process.kill(-child.pid);
        } catch (e) { }
    });
};

process.on('exit', function() {
  kill();
});

children.push(spawn('npm', [ 'start' ], {
    detached: true,
}));

let isServerAlive = async function () {
    try {
        await axios.get('http://localhost:30000/get');
        return true;
    }catch(e) {
        return false;
    }
};

before(function (done) {
    this.timeout(30000);

    (async () => {
        while (!await isServerAlive()) {
            await new Promise(r => setTimeout(r, 100));
        }
    })().then(done);
});

after(function (done) {
    kill();
    done();
});

describe("Content should be correctly rewritten", function () {
    const assertions = [
        { method: axios.get, url: '/get', body: null, expected: undefined },
        { method: axios.post, url: '/post', body: { a: 'b', c: 'd' }, expected: { a: 'b', c: 'd' } },
        { method: axios.post, url: '/post', body: { alert: 'none', c: 'd' }, expected: { c: 'd' } },
        { method: axios.put, url: '/put', body: { a: 'b', c: 'd' }, expected: { a: 'b', c: 'd' } },
        { method: axios.put, url: '/put', body: { alert: 'none', c: 'd' }, expected: { c: 'd' } },
    ];

    assertions.forEach(({ method, url, body, expected }) => {
        describe(`${url}`, function () {
            it(`${body} should result in ${expected}`, async () => {
                const res = await method(`http://localhost:30000/${url}`, body);
                console.log(res.data)
                expect(JSON.stringify(res.data.json)).to.equal(JSON.stringify(expected));
            })
        })
    })
});
