// es2015 magic
require('babel-core/register')();
require('babel-polyfill');

var db = require('../../../src/server/controllers/lib').db;
var config = require('../../../config');
var Hashids = require('hashids');
var mockKnex = require('mock-knex');
var chai = require('chai');
var url = require('url');
var {resolveShortUrl} = require('../../../src/server/controllers/frontend');

var ids = new Hashids(config.hashIdSalt, config.hashIdMinLength);

var tracker = mockKnex.getTracker();
tracker.install();

mockKnex.mock(db);

var expect = chai.expect;

describe('Test URL resolve', function(){
  it('Return a url from the database', function(){
      // variables
      var entryId = '123';
      var hash = ids.encode(Number(entryId));
      var shortUrl = url.resolve(config.domain, hash);
      var longUrl = 'http://www.example.com';
      var opt = {'0': hash};
      var data = {};

      // when
      tracker.on('query', function(query){
        expect(query.bindings[0]).to.equal(entryId);
        query.response({long_url: longUrl});
      });

      // invoke
      return resolveShortUrl(opt, data)
      .then(resp => {
        expect(resp.longUrl).to.equal(longUrl);
      });
  });

  it('Should return an error when no entry is found',function(){
    var entryId = '123';
    var hash = ids.encode(Number(entryId));
    var opt = {'0': hash};
    var data = {};
    // when
    tracker.on('query', function(query){
      query.response(null);
    });

    // invoke
    return resolveShortUrl(opt, data)
    .then(resp => {
      expect(resp).to.be.a('null');
    })
    .catch(err =>{
      expect(err).to.be.a('error');
    });
  });
});