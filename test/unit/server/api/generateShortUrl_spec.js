// es2015 magic
require('babel-core/register')();
require('babel-polyfill');

var Hashids = require('hashids');
var mockKnex = require('mock-knex');
var chai = require('chai');
var url = require('url');
var config = require('../../../../config');
var db = require('../../../../src/server/controllers/lib').db;
var generateShortUrl = require('../../../../src/server/controllers/api')
  .urls
  .generateShortUrl;

var ids = new Hashids(config.hashIdSalt, config.hashIdMinLength);

var tracker = mockKnex.getTracker();
tracker.install();

var expect = chai.expect;

describe('Test short URL generation', function() {
  // ensure DB is mocked only during this test suite
  before(function() {
    mockKnex.mock(db);
  });
  after(function() {
    mockKnex.unmock(db);
  });

  it('Should generate a unique url if none exist', function() {
    // variables
    var opt = {};
    var data = {longUrl: 'http://www.example.com/'};
    var idResponse = '123';
    var expected = url.resolve(config.domain, ids.encode(Number(idResponse)));

    // when
    tracker.on('query', function(query) {
      if (query.method == 'first') {
        // ensure initial query to find existing entry returns nothing
        query.response(null);
      } else {
        query.response([idResponse]);
      }
    });

    // invoke
    return generateShortUrl(opt, data)
      .then(resp => {
        expect(resp.shortUrl).to.equal(expected);
      });
  });

  it('Should return an existing URL if one exists in the database',
    function() {
      // variables
      var opt = {};
      var data = {longUrl: 'http://www.example.com'};
      var entryId = '1234';
      var expectedUrl = url.resolve(config.domain, ids.encode(Number(entryId)));

      // when
      tracker.on('query', function(query) {
        if (query.method == 'first') {
          // ensure initial query to get existing entry returns one
          query.response({
            id: entryId,
            long_url: data.longUrl,
            user_name: null
          });
        } else {
          query.response(null);
        }
      });

      // invoke
      return generateShortUrl(opt, data)
        .then(resp => {
          expect(resp.shortUrl).to.equal(expectedUrl);
        });
    });

  it('Should return an error when a unique URL cannot be generated',
    function() {
      // variables
      var opt = {};
      var data = {longUrl: 'http://www.example.com'};
      var entryId = '1234';
      var expectedUrl = url.resolve(config.domain, ids.encode(Number(entryId)));

      // when
      tracker.on('query', function(query) {
        query.response(null);
      });

      // invoke
      return generateShortUrl(opt, data)
        .then(resp => {
          expect(resp).to.be.a('null');
        })
        .catch(err => {
          expect(err).to.be.an('error');
        });
    });
});
