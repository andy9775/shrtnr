// source: http://brandonokert.com/2015/08/04/TestingInReact/#WaitFor
var waitsInProgress = [];

/**
 *  Used to wait for react re-renders.
 *  e.g. if a component calls setState({...});, the 
 * update may not occur before the test finishes and
 * thus any asertions will fail automatically.
 *
 * example usage:
 *    var input = component.refs.inputElement;
 *    var expected = 'new_value';
 *    waitFor(()=> input.value != '' && expect(input.value).to.equal(expected),
 *     done, () => assert(false, 'Test timed out'));
 * 
 * @param {Function} test - the test to run to assert the result. Should return 
 *                          a boolean value indicating if the test should   
 *                          continue or fail 
 * @param {Function} done - test callback when finished (it callback arg), or a 
 *                          function to execute upon test completion (and 
 *                          component update/re-render)
 * @param {Function} fail - function to execute if the test times-out
 * @param {Number} timeLeft - maximum time to wait for the test to finish   
 */
var waitFor = (test, done, fail, timeLeft) => {
  timeLeft = timeLeft === undefined ? 100 : timeLeft;
  waitsInProgress.push(setTimeout(() => {
    if (timeLeft <= 0) {
      fail();
      done();
    } else if (test()) {
      done();
    } else {
      waitFor(test, done, fail, timeLeft - 10);
    }
  }, 10));
};

waitFor.clear = () => waitsInProgress.map(clearTimeout); //optionally call this in the beforeEach to ensure rogue tests are not still waiting

module.exports = waitFor;