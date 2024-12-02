import bcrypt from "bcrypt"
import {validationResult} from 'express-validator';
import jwt from "jsonwebtoken"
import User from "../models/userSchema.js"
const JWT_SECRET = 'Romanisagood$boy';


export const createUserController =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        fname: req.body.fname,
        Lname: req.body.Lname,
        Address: req.body.Address,
        PhoneNo: req.body.PhoneNo,
        email: req.body.email,
        password: secPass,
        City: req.body.City,
      });

      const data = { id: user.id };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.status(201).json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }

export const loginController =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      console.log("Password Comparison:", passwordCompare); // Should print true if matching

      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const data = { id: user.id };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
}

export const getuserController =  async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user); // Return the user details without the password
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
}




export const generateOtpController = async (req, res) => {
  const { aadhaar } = req.body;

  if (!aadhaar || aadhaar.length !== 12) {
    return res.status(400).json({ message: 'Invalid Aadhaar number.' });
  }

  try {
    // Simulate OTP generation (here, it is just a mock)
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit OTP
    // In a real case, you would make an API call to an Aadhaar service

    // Simulate sending OTP (mock)
    console.log(`OTP sent to Aadhaar ${aadhaar}: ${otp}`);

    // You can store the OTP in a session, database, or temporary store if needed for later verification

    return res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Failed to generate OTP. Try again.' });
  }
};

// Simulate OTP verification
export const verifyOtpController = async (req, res) => {
  const { aadhaar, otp } = req.body;

  if (!aadhaar || aadhaar.length !== 12 || !otp || otp.length !== 6) {
    return res.status(400).json({ message: 'Invalid Aadhaar number or OTP.' });
  }

  try {
    // In a real scenario, validate the OTP by checking it against the previously generated OTP
    console.log(`Verifying OTP for Aadhaar ${aadhaar}: ${otp}`);

    // If OTP matches (in this case, just a mock check)
    if (otp === "123456") {  // Replace with actual logic in a real app
      return res.status(200).json({ message: 'Aadhaar verified successfully.' });
    } else {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP. Try again.' });
  }
};

// Simulate Aadhaar number validation
export const validateAadharController = async (req, res) => {
  const { aadhaar } = req.body;

  if (!aadhaar || aadhaar.length !== 12) {
    return res.status(400).json({ message: 'Invalid Aadhaar number.' });
  }

  try {
    // Simulate validating Aadhaar (mock check)
    console.log(`Validating Aadhaar ${aadhaar}`);

    // Simulate successful validation
    return res.status(200).json({ message: 'Aadhaar is valid.', details: { aadhaar } });
  } catch (error) {
    console.error('Error validating Aadhaar:', error);
    res.status(500).json({ message: 'Failed to validate Aadhaar. Try again.' });
  }
};