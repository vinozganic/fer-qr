import express from 'express';
import path from 'path';
import session from 'express-session';
import { auth } from 'express-openid-connect';
import helmet from 'helmet';
import routes from './routes/index';
import FileStore from 'session-file-store';
import * as dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Initialize session file store
const fileStore = FileStore(session);

const app = express();

// Security headers
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
    session({
        store: new fileStore({
            path: './sessions',
        }),
        secret: process.env.SESSION_SECRET ?? 'default-secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: !!process.env.ENV_NAME },
    })
);

// Auth0 middleware
const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    authorizationParams: {
        response_type: 'code',
        audience: 'qr-api-example.com',
        scope: 'openid profile email',
        prompt: 'consent',
    },
};
app.use(auth(authConfig));
app.use((req, res, next) => {
    res.locals.user = req.oidc.user;
    next();
});

// Cache control headers
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', routes);

// Default error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

export default app;
