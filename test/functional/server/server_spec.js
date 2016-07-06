/**
 * This test uses a live database and thus ensure that the full application works together.
 */
// es2015 magic
require('babel-core/register')();
require('babel-polyfill');

var app = require('../../../');
var config = require('../../../config');
var db = require('../../../src/server/controllers/lib/db').db
var request = require('supertest');
var knexCleaner = require('knex-cleaner');
var chai = require('chai');
var fs = require('fs');
var path = require('path');
var url = require('url');

var expect = chai.expect;

describe('Full server integration test', function(con) {
  var expectedHomePage = fs.readFileSync(path.join(__dirname, './homepage.html')).toString();

  // clean the DB before running any tests
  before(function(done) {
    this.timeout(5000);
    knexCleaner.clean(db).then(function() {
      done();
    });
  });

  it('Ensures that the homepage is rendered', function(done) {
    // invoke
    request(config.domain)
      .get('/')
      // assert
      .expect('content-type', 'text/html; charset=utf-8')
      .expect(expectedHomePage)
      .expect('x-frame-options', 'SAMEORIGIN')
      .expect(200, done);
  });

  it('Ensures that post request to shorten URL is handled', function(done) {
    // change timeout for this test
    this.timeout(4000);
    // variables
    var longUrl = 'http://www.example.com/';

    // invoke
    request(config.domain)
      .post('/api/v1/urls')
      .send({longUrl: longUrl})
      // assert / expect
      .expect(200)
      .end(function(err, res) {
        var body = res.body;
        expect(body.longUrl).to.equal(longUrl);
        var domain = url.parse(config.domain).href;
        var shortUrlDomain = url.parse(body.shortUrl.substring(0,
          body.shortUrl.lastIndexOf('/'))).href;
        var shortUrlHash = body.shortUrl.substring(body.shortUrl.lastIndexOf('/') + 1);

        expect(shortUrlDomain).to.equal(domain);
        expect(shortUrlHash.length).to.be.at.least(config.hashIdMinLength);
        done();
      });
  });

  it('Ensures that a get request to a short url redirects', function(done) {
    // setup test
    this.timeout(5000);
    // variables
    var longUrl = 'http://www.example.com/';

    // ensure the original URL posted to the Database
    request(config.domain)
      .post('/api/v1/urls')
      .send({longUrl: longUrl})
      .end(function(err, res) {
        var shortUrl = res.body.shortUrl;
        var shortHash = shortUrl.substring(shortUrl.lastIndexOf('/'));
        request(config.domain)
          .get(shortHash)
          .expect('location', longUrl)
          .expect(config.redirectCode, done);
      });
  });

  it('Ensures that an invalid short url redirects home', function(done) {
    /*
      Generate a random hash for the short URL which is 10 characters longer than the
      minimum hash id length set in the configuration options.

      Assuming that a development database is set, the entry should not exist.
     */

    var shortUrlHash = '/' + Math
      .random()
      .toString(36)
      .substring(2, config.hashIdMinLength + 50);
    request(config.domain)
      .get(shortUrlHash)
      .expect('location', '/')
      .expect(config.errorRedirectCode, done);
  });
});
