// es2015 magic
require('babel-core/register')();
require('babel-polyfill');


var testdom = require('../../testdom')('<html><body></body></html>');
var Promise = require('bluebird');
var React = require('react');
var chai = require('chai');
var sinon = require('sinon');
var axios = require('axios');
var TestUtils = require('react-addons-test-utils');
var url = require('url');
var waitFor = require('../../utils/waitfor');
var config = require('../../../config');
var HomePage = require('../../../src/shared/components/Home/Elements/URLForm').default;

var expect = chai.expect;
var assert = chai.assert;
describe('Test homepage', function() {
  var sandbox;
  beforeEach(function() {
    waitFor.clear();
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('Ensure a click triggers an api call with valid response', function(done) {
    // varibles
    var longUrl = 'http://www.example.com';
    var hash = '19dg9';
    var shortUrl = url.resolve(config.domain, hash);
    var doc = TestUtils.renderIntoDocument(<HomePage />);
    var input = doc.refs.urlInput;
    var form = TestUtils.findRenderedDOMComponentWithTag(
      doc, 'form');

    // stubs
    sandbox.stub(axios, 'post', (path, data) => {
      return new Promise((resolve, reject) => {
        resolve({data: {shortUrl: shortUrl}});
      });
    });

    // invoke
    TestUtils.Simulate.change(input, {
      target: {
        value: longUrl
      }
    });
    expect(doc.state.url).to.equal(longUrl);
    TestUtils.Simulate.submit(form);

    // assert
    waitFor(() => doc.state.shortUrl != '' && expect(input.value).to.equal(shortUrl),
      () => {
        done();
        sinon.restore(axios);
      },
      () => assert(false, 'Test timed out'));
  });

  it('Ensure a click triggers an api call with invalid response', function(done) {
    // variables
    var longUrl = 'http://www.example.com';
    var hash = '19dg9';
    var shortUrl = url.resolve(config.domain, hash);
    var doc = TestUtils.renderIntoDocument(<HomePage />);
    var input = doc.refs.urlInput;
    var form = TestUtils.findRenderedDOMComponentWithTag(
      doc, 'form');

    // stubs / spies
    sandbox.stub(axios, 'post', (path, data) => {
      return new Promise((resolve, reject) => {
        reject({
          data: JSON.stringify({errorMessage: 'Invalid URL'})
        });
      });
    });
    sandbox.spy(doc.refs.notify, 'addNotification');

    // invoke
    TestUtils.Simulate.change(input, {
      target: {
        value: longUrl
      }
    });

    expect(doc.state.url).to.equal(longUrl);
    TestUtils.Simulate.submit(form);

    // assert
    waitFor(() => doc.refs.notify.addNotification.calledOnce &&
      assert.isTrue(doc.refs.notify.addNotification.calledOnce,
        'notification should be triggered'),
      done,
      () => assert.isTrue(doc.refs.notify.addNotification.calledOnce,
        'notification should be triggered'));
  });
});

// TODO
/*
  when axios calls post, reject with an error message (New Error(...))
  Spy on NotificationSystem and ensure that addNotification is called once
  with specific arguments

  functional tests with actual db
    before test starts, ensure DB is open then on test end, close the DB? How
    does ghost do it?
 */
