export const getXmtpEnv = () => {
    return process.env.NEXT_PUBLIC_XMTP_ENVIRONMENT === "production"
    ? "production"
    : "dev"
}
