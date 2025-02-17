const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'somethingsecret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshsecret';

const generateTokens = (user, res) => {
  // Create the access token with a 1-hour expiry
  const accessToken = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  );

  // Create the refresh token with a 2-week expiry
  const refreshToken = jwt.sign(
    { _id: user._id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '2w' }
  );

  // Set cookie options for the access token
  const accessCookieOptions = {
    expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour in milliseconds
    httpOnly: true, // Helps prevent XSS attacks
  };

  // Set cookie options for the refresh token
  const refreshCookieOptions = {
    expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks in milliseconds
    httpOnly: true,
  };

  // In production, ensure cookies are only sent over HTTPS
  if (process.env.NODE_ENV === 'production') {
    accessCookieOptions.secure = true;
    refreshCookieOptions.secure = true;
  }

  // Set the tokens as cookies on the response
  res.cookie('accessToken', accessToken, accessCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  return { accessToken, refreshToken };
};


const verifyAccessToken = (req) => {
  // Extract the token from the cookies (assuming it's stored under "accessToken")
  const token = req.cookies.accessToken;
  
  // If no token is present, return null or handle it as needed
  if (!token) {
    return null;
  }

  try {
    // Verify and return the decoded token payload
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    // Handle the error as needed; here we return null
    return null;
  }
};

const verifyRefreshToken = (req) => {
  try {
    const token = req.cookies.refreshToken;
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

const refreshAccessToken = async (req, res) => {
  // Retrieve the refresh token from cookies
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }
  
  try {
    // Verify the refresh token (assumes verifyRefreshToken is implemented)
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error('Invalid refresh token');
    }
    
    // Fetch the user from the database using the _id from the decoded token
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Generate a new access token (with a 1-hour expiry)
    const newAccessToken = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    
    // Define cookie options for the new access token
    const accessCookieOptions = {
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
      httpOnly: true, // Prevents client-side JS from accessing the cookie
    };
    if (process.env.NODE_ENV === 'production') {
      accessCookieOptions.secure = true; // Ensures cookie is sent over HTTPS in production
    }
    
    // Set the new access token as a cookie
    res.cookie('accessToken', newAccessToken, accessCookieOptions);
    
    // Optionally, send a success response
    res.json({ message: 'Access token refreshed successfully' });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const isAuth = (req, res, next) => {
  // Now that cookie-parser is set up, req.cookies should be defined
  const decoded = verifyAccessToken(req);

  req.user = decoded;
  next();
};



const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

const isSeller = (req, res, next) => {
  if (req.user && req.user.isSeller) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Seller Token' });
  }
};

const isSellerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isSeller || req.user.isAdmin)) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin/Seller Token' });
  }
};

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // votre adresse email
    pass: process.env.EMAIL_PASS  // votre mot de passe d'application
  }
});

const sendOrderEmail = (order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.user.email,
    subject: `Order ${order._id}`,
    html: payOrderEmailTemplate(order)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

const payOrderEmailTemplate = (order) => {
  return `<h1>Thanks for shopping with us</h1>
  <p>Hi ${order.user.name},</p>
  <p>We have finished processing your order.</p>
  <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Product</strong></td>
  <td><strong>Quantity</strong></td>
  <td><strong align="right">Price</strong></td>
  </thead>
  <tbody>
  ${order.orderItems
    .map(
      (item) => `
    <tr>
    <td>${item.name}</td>
    <td align="center">${item.qty}</td>
    <td align="right"> $${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join('\n')}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Items Price:</td>
  <td align="right"> $${order.itemsPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Tax Price:</td>
  <td align="right"> $${order.taxPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Shipping Price:</td>
  <td align="right"> $${order.shippingPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2"><strong>Total Price:</strong></td>
  <td align="right"><strong> $${order.totalPrice.toFixed(2)}</strong></td>
  </tr>
  <tr>
  <td colspan="2">Payment Method:</td>
  <td align="right">${order.paymentMethod}</td>
  </tr>
  </table>
  <h2>Shipping address</h2>
  <p>
  ${order.shippingAddress.fullName},<br/>
  ${order.shippingAddress.address},<br/>
  ${order.shippingAddress.city},<br/>
  ${order.shippingAddress.country},<br/>
  ${order.shippingAddress.postalCode}<br/>
  </p>
  <hr/>
  <p>Thanks for shopping with us.</p>
  `;
};

module.exports = {
  generateTokens,
  verifyAccessToken,
  isAuth,
  isAdmin,
  isSeller,
  isSellerOrAdmin,
  sendOrderEmail,
  refreshAccessToken,
  payOrderEmailTemplate,
};
