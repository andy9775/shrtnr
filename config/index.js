//    Copyright 2016 Andy Chrzaszcz
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.


// TODO create a plugins directory and a DefaultSignupValidator

/*
  When using heroku ensure that the following environment variable is setup
      CLOUD = heroku
  this information is used to serve static files (bundle.js)
 */

module.exports = {
  // comment out top properties to disable pages
  signupForm: { // if disabled, the signup page won't be accessable
    // validates based on email domains passed in via array
    // validator: new plugins.DefaultSignupValidator([
    //                 'gmail.com',
    //                 'outlook.com'
    //             ])
  },
  /*
      The domain that the app is listening on and to be returned to the
       user with the shortened URL e.g. http://www.example.com/3hg92
  */
  domain: 'http://localhost:3000',
  allowCustomURL: true,
  title: 'Shrtnr',
  /*
      301 or 302
      reference: http://searchengineland.com/analysis-which-url-shortening-service-should-you-use-17204
  */
  redirectCode: 301,
  /*
    Code to redirect with if a resource is not found for the requested short URL
   */
  errorRedirectCode: 302,
  /*
      Redirect to this URL if an error occurs resolving a short URL (not found).
      This should normally be left alone.

      '/' - redirects to config.domain
  */
  errorRedirectUrl: '/',

  // db config
  postgresDatabase: process.env.DATABASE || 'database-name',
  postgresUsername: process.env.DB_USERNAME || 'input-username',
  postgresPass: process.env.DB_PASS || 'input-pass',
  poolMin: 3,
  poolMax: 20,
  poolTimeout: 10000,
  databaseHost: process.env.DATABASE_URL || '127.0.0.1',

  // hashid config
  hashIdSalt: process.env.HASH_ID_SALT || '<insert-custom-string-to-generate-unique-URL>',
  /*
      the characters that can be used in the shortned URL path.
      This should be left alone in order to ensure that non-offensive
      URL paths are generated.
  */
  hashIdDict: '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ',
  /*
      The minimum length of the url hash. That is, if this is set to 8 a short
      url will have a path length of at leaset 8 characters.
  */
  hashIdMinLength: 5,

}
