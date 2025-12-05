export const USER_BASE_URL = 'https://6srb7av9o8.execute-api.us-west-2.amazonaws.com/Prod';
export const AUTH_BASE_URL = 'https://8mbqgjlv81.execute-api.us-west-2.amazonaws.com/Prod';
export const SUBSCRIPTION_BASE_URL = 'https://cwcsbr8ypf.execute-api.us-west-2.amazonaws.com/Prod';
export const VIDEOS_BASE_URL = 'https://j2ddh84hp9.execute-api.us-west-2.amazonaws.com/Prod/videos';
export const PLAN_BASE_URL = 'https://pb29uw617i.execute-api.us-west-2.amazonaws.com/Prod';
export const PAYMENT_BASE_URL = 'https://qvr8omd0lb.execute-api.us-west-2.amazonaws.com/Prod';

export const AUTH_ENDPOINTS = {
    LOGIN: `${AUTH_BASE_URL}/auth/login`,
    REGISTER: `${AUTH_BASE_URL}/auth/register`,
};

export const USER_ENDPOINTS = {
    GET_PROFILE: `${USER_BASE_URL}/user/profile`,
    UPDATE_PROFILE: `${USER_BASE_URL}/user/update`,
};

export const VIDEO_ENDPOINTS = {
    SAVE_VIDEO: `${VIDEOS_BASE_URL}/saveVideo`,
    GET_ALL: `${VIDEOS_BASE_URL}/getVideos`,
    GET_BY_ID: (id) => `${VIDEOS_BASE_URL}/findById/${id}`,
    GENERATE_PRESIGNED_URL: `${VIDEOS_BASE_URL}/generatePresignedUrl`,
    GET_VIDEO_URL: (path) => `${VIDEOS_BASE_URL}/getVideoUrl?path=${path}`,
};

export const PLAN_ENDPOINTS = {
    GET_ALL: `${PLAN_BASE_URL}/plan/get-all`,
};

export const SUBSCRIPTION_ENDPOINTS = {
    SUBSCRIBE: `${SUBSCRIPTION_BASE_URL}/subscription/subscribe`,
};

export const PAYMENT_ENDPOINTS = {
    PAY_SUBSCRIPTION: `${PAYMENT_BASE_URL}/payment/pay-subscription`,
};

// Endpoints que NO requieren token
export const PUBLIC_ENDPOINTS = [
    `${AUTH_BASE_URL}/auth/login`,
    `${AUTH_BASE_URL}/auth/register`,
];
