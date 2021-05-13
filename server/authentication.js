/*
 * This represents very basic authentication for user login using Passport to
 * support a simple strategy for testing and OAuth, with Google, for production.
 *
 * NOTE, Admin and Test User data needs to be customized for your app, but the
 * rest can likely be reused as is.
 *
 * @author Dennis Quan
 * @author Robert Duvall (commenting)
 */

// check to see if server is running locally or remotely on Heroku
const localOnly = process.argv.includes('--local-only');
const localOnlyWithGoogleAuth = process.argv.includes('--local-only-with-google-auth');

// TODO: customize hard coded user data for your app
// NOTE: should be stored in actual database if users can be added or changed dynamically

// all users
const users = {};

if (localOnly) {
    users.alice = {
        displayName: 'Alice Sample',
        id: 'alice',
        emails: [{ value: 'fake_alice@cs.duke.edu' }],
        photos: [{ value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Woman_mechanic_working_on_engine_%28cropped%29.jpeg/440px-Woman_mechanic_working_on_engine_%28cropped%29.jpeg' }],
    };
    users.bob = {
        displayName: 'Bob Sample',
        id: 'bob',
        emails: [{ value: 'fake_bob@cs.duke.edu' }],
        photos: [{ value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Outdoors-man-portrait_%28cropped%29.jpg/440px-Outdoors-man-portrait_%28cropped%29.jpg' }],
    };
}

// OAuth login procedure that can be used directly in your projects
//   from https://dev.to/phyllis_yym/beginner-s-guide-to-google-oauth-with-passport-js-2gh4
// also, provides simple login credentials for testing
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { BasicStrategy } = require('passport-http');
const { COOKIE_ENCRYPTION_KEY, DEPLOYED_URLS, OAUTH } = require('./secrets.js');

if (localOnly) {
    // use simple login info for testing
    passport.use(new BasicStrategy(
        (userId, password, callback) => {
            if (users[userId] && userId === password) {
                return callback(null, users[userId]);
            }
            return callback(null, false);
        },
    ));
} else {
    // use complex OAuth protocol that requires real credentials when deployed
    passport.use(
        new GoogleStrategy({
            clientID: OAUTH.web.client_id,
            clientSecret: OAUTH.web.client_secret,
            // NOTE: must match value set in Google Credentials Console
            callbackURL: `${localOnlyWithGoogleAuth ? 'http://localhost:8080/' : DEPLOYED_URLS.SERVER}api/auth/google/redirect`,
        },
            (accessToken, refreshToken, profile, callback) => {
                console.log('profile', profile);

                // clean up to just the fields we want
                // eslint-disable-next-line no-param-reassign
                profile = {
                    displayName: profile.name.givenName,
                    id: profile.id,
                    emails: profile.emails,
                    photos: profile.photos,
                };
                users[profile.id] = profile;
                callback(null, profile);
            }),
    );
}

// get user info if it exists
passport.deserializeUser((id, callback) => {
    callback(null, users[id] || {});
});

// save given user info returned from Strategy
passport.serializeUser((user, callback) => {
    users[user.id] = user;
    callback(null, user.id);
});

// Add URL routes for login/logout
exports.setupAuthentication = (app) => {
    if (!localOnly && !localOnlyWithGoogleAuth) {
        // needed for cookies to work behind Heroku HTTPS server
        app.set('trust proxy', true)
    }
    // need to enable CORS when using credentials
    const whitelist = (localOnly || localOnlyWithGoogleAuth) ? 'http://localhost' : 'https://compsci290_2021spring.dukecs.io';
    const corsGitlab = cors({
        origin: whitelist,
        credentials: true,
    });
    app.use(corsGitlab);

    // use Cookies to send session info back and forth
    app.use(cookieSession({
        // milliseconds of a day
        maxAge: 24 * 60 * 60 * 1000,
        // WARNING: really lousy encryption key!
        keys: [COOKIE_ENCRYPTION_KEY], ...((localOnly || localOnlyWithGoogleAuth) ? {} : {
            // needed because server is on Heroku and frontend is on GitLab
            sameSite: 'none',
            secure: true,
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    if (localOnly) {
        // use simple login info for testing
        app.get('/api/auth/login', passport.authenticate('basic'), (req, res) => {
            res.redirect('/');
        });
    } else {
        // use complex OAuth protocol that requires redirection to outside login screen
        app.get('/api/auth/google/redirect', passport.authenticate('google'), (req, res) => {
            res.redirect(`${localOnlyWithGoogleAuth ? '/' : DEPLOYED_URLS.VIEW}`);
        });

        app.get('/api/auth/login', passport.authenticate('google', {
            scope: ['profile', 'email'],
        })
        );
    }

    // no matter where server is deployed, logout is the same process
    app.get('/api/auth/logout', (req, res) => {
        req.logout();
        res.redirect(`${(localOnly || localOnlyWithGoogleAuth) ? '/' : DEPLOYED_URLS.VIEW}`);
    });
};

// Exports for other files to use
exports.users = users;
