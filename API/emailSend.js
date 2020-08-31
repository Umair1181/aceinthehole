var nodemailer = require("nodemailer");
// const xoauth2 = require("xoauth2");

module.exports = transporter = nodemailer.createTransport({
  host: "smtp.googlemail.com",
  port: 465,
  secure: true,
  // service: "gmail",
  auth: {
    user: "aceintheholeapp@gmail.com",
    pass: "Aith2020",
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

// module.exports = transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 25,
//   secure: true,
//   auth: {
//     user: "aceintheholeapp@gmail.com",
//     pass: "Aith2020",
//   },

//   // auth: {
//   //   type: "OAuth2",
//   //   user: "mhanzlanaveed@gmail.com",
//   //   clientId:
//   //     "968139947176-01jjd96o3054cm7hi5p65go7fcikcgs3.apps.googleusercontent.com",
//   //   clientSecret: "EeChxBePONowCoCo9yvmiHHs",
//   //   refreshToken:
//   //     "1//04x-lXY34kFPQCgYIARAAGAQSNwF-L9IriPm6smHtxwqMHUdhfAw7JERKWrDy2g_MX9KE8UWL56J6EL-LnV5oubygIIxCvu9SaMg",
//   //   accessToken:
//   //     "ya29.a0AfH6SMCqy8-Cn4iQ2M5EBKdZrQ_VUt7HhXRWSw3HtjLDa-DeGAV5CR4di2myRNJVIvpGJxCLtNA4__0w7RwA7sQgMtfS6uZKrenNswttYzawNjQJe-DHqbzZgxBYZHVLQJplQqP4oEenoZJfskD-d6-Ks675uuTwSb8",
//   // },
//   // auth: {
//   //   xoauth2: xoauth2.createXOAuth2Generator({
//   //     user: "aceintheholeapp@gmail.com",
//   //     clientId:
//   //       "968139947176-01jjd96o3054cm7hi5p65go7fcikcgs3.apps.googleusercontent.com",
//   //     clientSecret: "EeChxBePONowCoCo9yvmiHHs",
//   //     refreshToken:
//   //       "1//04x-lXY34kFPQCgYIARAAGAQSNwF-L9IriPm6smHtxwqMHUdhfAw7JERKWrDy2g_MX9KE8UWL56J6EL-LnV5oubygIIxCvu9SaMg",
//   //     accessToken:
//   //       "ya29.a0AfH6SMCl0vPl-D7tNnuSVI4A_vTa5fSZEJ_yC08KqRP-p_SvwTU1lBvvw1MnmIdUTvbR8jygkhMkT57jAPljJqnd2CTuHWIO4imGGtrJOsaLqULYJI9-zco2XRlfBxV0K-aZp7FbRQyYXXoCiGu_u7Bs-8fRvJHbil0",
//   //   }),
//   // },
//   // tls: {
//   //   // do not fail on invalid certs
//   //   rejectUnauthorized: true,
//   // },
// });
// module.exports = transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 25,
//   secure: true,
//   auth: {
//     type: "OAuth2",
//     user: "aceintheholeapp@gmail.com",
//     clientId:
//       "968139947176-01jjd96o3054cm7hi5p65go7fcikcgs3.apps.googleusercontent.com",
//     clientSecret: "EeChxBePONowCoCo9yvmiHHs",
//     refreshToken:
//       "1//04x-lXY34kFPQCgYIARAAGAQSNwF-L9IriPm6smHtxwqMHUdhfAw7JERKWrDy2g_MX9KE8UWL56J6EL-LnV5oubygIIxCvu9SaMg",
//     accessToken:
//       "ya29.a0AfH6SMCl0vPl-D7tNnuSVI4A_vTa5fSZEJ_yC08KqRP-p_SvwTU1lBvvw1MnmIdUTvbR8jygkhMkT57jAPljJqnd2CTuHWIO4imGGtrJOsaLqULYJI9-zco2XRlfBxV0K-aZp7FbRQyYXXoCiGu_u7Bs-8fRvJHbil0",
//   },
//   // auth: {
//   //   xoauth2: xoauth2.createXOAuth2Generator({
//   //     user: "aceintheholeapp@gmail.com",
//   //     clientId:
//   //       "968139947176-01jjd96o3054cm7hi5p65go7fcikcgs3.apps.googleusercontent.com",
//   //     clientSecret: "EeChxBePONowCoCo9yvmiHHs",
//   //     refreshToken:
//   //       "1//04x-lXY34kFPQCgYIARAAGAQSNwF-L9IriPm6smHtxwqMHUdhfAw7JERKWrDy2g_MX9KE8UWL56J6EL-LnV5oubygIIxCvu9SaMg",
//   //     accessToken:
//   //       "ya29.a0AfH6SMCl0vPl-D7tNnuSVI4A_vTa5fSZEJ_yC08KqRP-p_SvwTU1lBvvw1MnmIdUTvbR8jygkhMkT57jAPljJqnd2CTuHWIO4imGGtrJOsaLqULYJI9-zco2XRlfBxV0K-aZp7FbRQyYXXoCiGu_u7Bs-8fRvJHbil0",
//   //   }),
//   // },
//   // tls: {
//   //   // do not fail on invalid certs
//   //   rejectUnauthorized: true,
//   // },
// });

////////////////////////////////////////////

// module.exports = transporter = nodemailer.createTransport({
//   // host: "host",
//   // port: 25,
//   // secure: false,
//   service: "gmail",
//   auth: {
//     // user: "aceintheholeapp@gmail.com",
//     // pass: "Aith2020",
//     XOAuth2: {
//       user: "aceintheholeapp@gmail.com",
//       clientId:
//         "968139947176-bkquv3cs2nni3rag1bpr9pspffct4is4.apps.googleusercontent.com",
//       clientSecret: "5Y0rtCEMiHUDe5DS-oxHlNSZ",
//       accessToken:
//         "ya29.a0AfH6SMBrC8LKZ2zNGxuomOv7e8m1n6kkdoFYlkgWVlpURLyZPSKKoVXOMN_4-hCLHid2jnL0n_7uCS3LDHNDPFmAiR19Qn9lqkTrBKBxbEJU3k2oRSm-DKNCEemSO8Y8yApx9cLrmMZV-XMwUEJnXxwjec5E2Qg3SrM",
//       refreshToken:
//         "1//04vE1nYuvoB7fCgYIARAAGAQSNwF-L9Ir8NhDc98maQAf92b8ngRMmKkmCWm3Al8h5dkpAmc2yrI284NteDq470SDuuDnO5jnC6Y",
//     },
//   },
//   tls: {
//     // do not fail on invalid certs
//     rejectUnauthorized: false,
//   },
// });
