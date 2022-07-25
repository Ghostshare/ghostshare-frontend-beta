export const getXmtpEnv = () => {
    return process.env.NEXT_PUBLIC_XMTP_ENVIRONMENT === "production"
    ? "production"
    // temporal hardcoded to get production in place, not access to envs vars in vercel ATM
    : "production"
    // : "dev"
}
