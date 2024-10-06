import axios from 'axios';

export const getM2MAccessToken = async (): Promise<string> => {
    const response = await axios.post(
        `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        {
            client_id: process.env.M2M_CLIENT_ID,
            client_secret: process.env.M2M_CLIENT_SECRET,
            audience: process.env.M2M_AUDIENCE,
            grant_type: 'client_credentials',
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data.access_token;
};
