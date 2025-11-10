// server/middleware/authMiddleware.js
const {createRemoteJWKSet, jwtVerify} = require("jose");

const raw = process.env.AUTH0_ISSUER_BASE_URL; // e.g. https://dev-xxxx.auth0.com
const issuer = raw.endsWith("/") ? raw : raw + "/";
const audience = process.env.AUTH0_AUDIENCE; // https://api.vidyaiaya.com

const JWKS = createRemoteJWKSet(new URL(`${issuer}.well-known/jwks.json`));

async function checkJwt(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({message: "Missing token"});

    const {payload} = await jwtVerify(token, JWKS, {issuer, audience});

    req.auth = {payload};
    req.user = {
      id: payload.sub,
      sub: payload.sub,
      email: payload.email ?? null,
    };

    return next();
  } catch (e) {
    console.error("[JWT] verify error:", e.message);
    return res.status(401).json({message: e.message, code: "invalid_token"});
  }
}

module.exports = checkJwt; // 👈 default export is the function
