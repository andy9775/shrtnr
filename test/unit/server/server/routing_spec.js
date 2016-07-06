/**
 * Test routing logic functions
 */
// es2015 magic
require('babel-core/register')();
require('babel-polyfill');

var fs = require('fs');
var path = require('path');
var sinion = require('sinon');
var ResolveShortUrl = require('../../../../src/server/controllers/frontend/ResolveShortUrl');
var chai = require('chai');
var sinon = require('sinon');
var {handleUrlResolution, handleHomePage} = require('../../../../src/server/controllers/frontend');
var config = require('../../../../config');

var expect = chai.expect;

describe('Test express URL routing functions', function () {
  var mockRenderedHtml = fs.readFileSync(path.join(__dirname, './mockRenderedHtml.html')).toString();

  it('Should return the homepage', function () {
    // variables
    var req = { url: '/' };
    var res = {
      render: function (page, data) {
        expect(page).to.equal('index');
        expect(data.body).to.equal(mockRenderedHtml);
        expect(data.title).to.equal(config.title);
      }
    };

    // invoke
    handleHomePage(req, res);
  });

  it('Should redirect to a long URL', function () {
    // variables
    var hash = '19f2k';
    var expectedUrl = 'http://www.example.com';

    // mock
    var req = { body: {}, query: {}, params: { 0: hash } };
    sinon.stub(ResolveShortUrl, 'resolveShortUrl', (options, data) => {
      expect(options['0']).to.equal(hash);
      return new Promise((resolve, reject) => {
        resolve({ longUrl: expectedUrl });
      });
    });
    var res = {
      redirect: function (code, longUrl) {
        // assert / verify
        expect(code).to.equal(config.redirectCode);
        expect(longUrl).to.equal(expectedUrl);
      }
    };

    // invoke
    handleUrlResolution(req, res);

    sinon.restore(ResolveShortUrl);
  });

  it('Should redirect home when no entry is found', function () {
    // variables
    var hash = '19f2k';
    var expectedUrl = '/';
    // mock
    var req = { body: {}, query: {}, params: { 0: hash } };
    sinon.stub(ResolveShortUrl, 'resolveShortUrl', (options, data) => {
      expect(options['0']).to.equal(hash);
      return new Promise((resolve, reject) => {
        reject(new Error());
      });
    });
    var res = {
      redirect: function (code, longUrl) {
        // assert / verify
        expect(code).to.equal(config.redirectCode);
        expect(longUrl).to.equal(expectedUrl);
      }
    };

    // invoke
    handleUrlResolution(req, res);
    sinon.restore(ResolveShortUrl);
  });

});
