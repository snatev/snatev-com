const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const express = require('express');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(compression());
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(helmet({
    hsts: {
        preload: true,
        maxAge: 31536000,
        includeSubDomains: true
    },
    contentSecurityPolicy: {
        directives: {
            mediaSrc: ["'self'"], objectSrc: ["'none'"],
            imgSrc: ["'self'", "data:", "https://snatev.com"],
            defaultSrc: ["'self'"], frameSrc: ["'none'"], connectSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://cdnjs.cloudflare.com",
                "https://static.cloudflareinsights.com"
            ],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"]
        }
    }
}));

const limiter = rateLimit({
    max: 1000,
    legacyHeaders: false,
    standardHeaders: true,
    windowMs: 15 * 60 * 1000,
    handler: (req, res, next, options) => {
        res.status(options.statusCode).send('Too Many Requests');
    }
});

app.use(limiter);
app.disable('x-powered-by');

app.get('/robots.txt', (req, res) => {
    const robotsPath = path.join(__dirname, 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) res.sendFile(robotsPath);
    else {
        res.type('text/plain');
        res.send('User-agent: *\nAllow: /\nSitemap: ' + req.protocol + '://' + req.get('host') + '/sitemap.xml');
    }
});

app.get('/sitemap.xml', (req, res) => {
    const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) res.sendFile(sitemapPath);
    else res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public'), {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
        else if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/))
            res.setHeader('Cache-Control', 'public, max-age=86400');
    }
}));

const validRoutes = [
    '/',
];

app.get('*', (req, res) => {
    const route = req.path;

    if (validRoutes.includes(route)) res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
    else res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(1337, () => { console.log('Server Started'); });

process.on('SIGTERM', () => {
    console.log('SIGTERM Received, Closing');
    server.close(() => { process.exit(0); });
});
