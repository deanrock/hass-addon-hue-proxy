const expect = require("chai").expect;
const axios = require('axios');

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
