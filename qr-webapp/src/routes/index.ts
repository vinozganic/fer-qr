import { Router } from 'express';
import { getTicketCount, generateTicket, getTicketByUuid } from '../services/apiService';
import { requiresAuth } from 'express-openid-connect';

const router = Router();

router.get('/', async (req, res) => {
    const ticketCount = await getTicketCount();
    res.render('pages/home', {
        user: req.oidc?.user,
        ticketCount,
    });
});

router.get('/generate', (req, res) => {
    const ticketQrCode = req.query.ticketQrCode;
    res.render('pages/generate', { ticketQrCode });
});

router.post('/generate', async (req, res) => {
    const { vatin, firstName, lastName } = req.body;
    const ticketQrCode = await generateTicket(vatin, firstName, lastName);
    res.redirect(`/generate?ticketQrCode=${encodeURIComponent(ticketQrCode)}`);
});

router.get('/ticket/:uuid', requiresAuth(), async (req, res) => {
    const ticketDetails = await getTicketByUuid(req.params.uuid);
    res.render('pages/ticket', { ticket: ticketDetails });
});

router.get('/callback', (req, res) => {
    res.redirect('/');
});

export default router;
