import { Router } from 'express';
import { getTicketCount, getTicketByUuid } from '../services/apiService';
import { requiresAuth } from 'express-openid-connect';
import { handleErrorRoute } from '../utils/handleErrorRoute';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const ticketCount = await getTicketCount();
        res.render('pages/home', {
            user: req.oidc?.user,
            ticketCount,
        });
    } catch (error: any) {
        handleErrorRoute(res, error);
    }
});

/*
/generate route commented out because professor said it's an excess feature
*/
// router.get('/generate', (req, res) => {
//     const ticketQrCode = req.query.ticketQrCode;
//     res.render('pages/generate', { ticketQrCode });
// });

// router.post('/generate', async (req, res) => {
//     const { vatin, firstName, lastName } = req.body;
//     try {
//         const ticketQrCode = await generateTicket(vatin, firstName, lastName);
//         res.redirect(`/generate?ticketQrCode=${encodeURIComponent(ticketQrCode)}`);
//     } catch (error: any) {
//         handleErrorRoute(res, error);
//     }
// });

router.get('/tickets/:uuid', requiresAuth(), async (req, res) => {
    try {
        const accessToken = req.oidc.accessToken?.access_token;
        const ticketDetails = await getTicketByUuid(req.params.uuid, accessToken);
        res.render('pages/ticket', { ticket: ticketDetails });
    } catch (error: any) {
        handleErrorRoute(res, error);
    }
});

router.get('/callback', (req, res) => {
    res.redirect('/');
});

router.get('/error', (req, res) => {
    res.render('pages/error', { error: { code: req.query.code, message: req.query.message } });
});

export default router;
