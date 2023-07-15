const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
  
    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    res.cookie("token", token, options).json({
      status: 200,
      message: "Operation is successfully executed",
      success: true,
      user,
      token,
    });
  };
  
 export default sendToken;