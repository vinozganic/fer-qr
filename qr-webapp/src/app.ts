import express from 'express';
import path from 'path';
import session from 'express-session';
import { auth } from 'express-openid-connect';
import helmet from 'helmet';
import routes from './routes/index';
import * as dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

const app = express();

// Security headers
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
    session({
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
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};
app.use(auth(authConfig));
app.use((req, res, next) => {
    res.locals.user = req.oidc.user;
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