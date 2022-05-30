/* eslint-disable import/no-anonymous-default-export */
import User from '../../../models/User';
import { setCookies } from 'cookies-next';
import jwt from 'jsonwebtoken';

const url = require('url');
const { google } = require('googleapis');

const APP_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://thunderous-panda-a976d7.netlify.app/';

const YOUR_REDIRECT_URL = `${APP_URL}/api/google/callback`;

var jwtToken = null;

export default async function (req, res, next) {
  let q = url.parse(req.url, true).query;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    YOUR_REDIRECT_URL
  );

  // setCookies('client', oauth2Client, {
  //   req,
  //   res,
  // });

  const { tokens } = await oauth2Client.getToken(q.code);

  oauth2Client.setCredentials(tokens);

  const { access_token: accessToken, refresh_token: refreshToken } = tokens;

  var oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  });

  await oauth2.userinfo.get(async function (err, authRes) {
    if (err) {
      console.log(err);
    } else {
      const profile = authRes?.data;
      try {
        let userFound = await User.findOne({ email: profile.email });
        if (!userFound) {
          // create new user
          const newUser = new User({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
            isAdmin: false,
            accessToken,
            refreshToken,
          });
          const token = await jwt.sign(
            {
              id: newUser._id,
              created: Date.now().toString(),
            },
            process.env.JWT_SECRET
          );
          newUser.jwtToken = token;
          jwtToken = token;

          await newUser.save();
          console.log('User Created');
        } else {
          const token = await jwt.sign(
            {
              id: userFound._id,
            },
            process.env.JWT_SECRET
          );
          jwtToken = token;

          await User.findOneAndUpdate(
            { email: profile.email },
            { accessToken, jwtToken }
          );
          console.log('User Alreday Exists');
        }
      } catch (error) {
        console.log('error in savig to mongo', error);
      }
    }
    setCookies('token', jwtToken, {
      req,
      res,
    });
    setCookies('tokens', tokens, {
      req,
      res,
    });

    return res.redirect(`${APP_URL}/dashboard`);
  });
}
