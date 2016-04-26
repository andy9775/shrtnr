// TODO create a plugins directory and a DefaultSignupValidator

module.exports = {
    // comment out top properties to disable pages
    signupForm: { // if disabled, the signup page won't be accessable
                    // validates based on email domains passed in via array
        validator: new plugins.DefaultSignupValidator([
                        'gmail.com',
                        'outlook.com'
                    ])
    } 
}
