import sendToken from "../../utils/sendToken.js";
import User from "./user.model.js";
import responses from "../../../src/constants/responses.js";
import mongoose from "mongoose";

export const register = async (req, res, next) => {
  try {
    // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder:'avatars',
    //     width:150,
    //     crop:"scale"
    // });
   
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.json(
            responses.DATA_NOT_FOUND({
                success:false,
            })
          );
    }

    const user = await User.create({
      name,
      email,
      password,
      // avatar: {
      //     public_id: myCloud.public_id,
      //     url:myCloud.secure_url,
      // },
    });

    sendToken(user, 201, res);
  } catch (error) {

    if (error instanceof mongoose.Error.ValidationError) {
         return res.json(
            responses.BAD_REQUEST({
                success:false,
                message:error.message
            })
          );
      } else {
        if (error.code == 11000) {
            return res.json(
                responses.BAD_REQUEST({
                    success:false,
                    message:"Already exist this email id"
                })
              );
        }
        console.error("Error register:", error);
        return res.status(500).json(responses.SERVER_ERROR());
   }
};
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json(
        responses.BAD_REQUEST({
            success:false,
          message: "Please Enter email & password",
        })
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.json(
        responses.BAD_REQUEST({
            success:false,
          message: "Invalid email & password",
        })
      );
    }

    const ismatched = await user.comparePassword(password);

    if (!ismatched) {
      return res.json(
        responses.BAD_REQUEST({
            success:false,
          message: "Invalid email & password",
        })
      );
    }
    sendToken(user, 200, res);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
        // Handle validation error
        return res.json(
            responses.BAD_REQUEST({
                success:false,
                message:error.message
            })
          );
      } else {
        console.error("Error creating Location:", error);
        return res.status(500).json(responses.SERVER_ERROR());
      }
  }
};

export const logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return res.json(
    responses.OK({
      message: "Logout successfully",
    })
  );
};
