var nodemailer = require("nodemailer");

module.exports = transporter = nodemailer.createTransport({
  // host: "host",
  // port: 25,
  // secure: false,
  service: "gmail",
  auth: {
    // user: "aceintheholeapp@gmail.com",
    // pass: "Aith2020",
    XOAuth2: {
      user: "aceintheholeapp@gmail.com",
      clientId:
        "968139947176-bkquv3cs2nni3rag1bpr9pspffct4is4.apps.googleusercontent.com",
      clientSecret: "5Y0rtCEMiHUDe5DS-oxHlNSZ",
      accessToken:
        "ya29.a0AfH6SMBrC8LKZ2zNGxuomOv7e8m1n6kkdoFYlkgWVlpURLyZPSKKoVXOMN_4-hCLHid2jnL0n_7uCS3LDHNDPFmAiR19Qn9lqkTrBKBxbEJU3k2oRSm-DKNCEemSO8Y8yApx9cLrmMZV-XMwUEJnXxwjec5E2Qg3SrM",
      refreshToken:
        "1//04vE1nYuvoB7fCgYIARAAGAQSNwF-L9Ir8NhDc98maQAf92b8ngRMmKkmCWm3Al8h5dkpAmc2yrI284NteDq470SDuuDnO5jnC6Y",
    },
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});
