import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
<<<<<<< HEAD
import core from 'cors';
=======
import cors from 'cors';
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
 // Use correct path





>>>>>>> b7be0ff (Initial commit)


dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
<<<<<<< HEAD
  .then(() => {
    console.log('Connected to db');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(core());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true},
  password: String,
});

userSchema.pre('save',async function(next){
  if(!this.isModified('password')){
  return next();
}
try{
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
}catch(error){
  next(error);
}
});

const User = mongoose.model('User', userSchema);

const jwtSecretKey = process.env.JWT_SECRET || 'defaultSecretKey';
app.get('/e-hori',(req,res)=>{
  res.send("E:\E-HORIZON\E_Horizon\WEB DEVELOP EVENT 2\frontend\index.html");
})

app.post('/login', async(req, res)=>{
  const { email, password} = req.body;
  try{
    const user = await User.findOne({email});
    console.log(user);
        if(!user){
      return res.status(401).json({ message: 'Invalid email or passowrd'});

    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({message: 'Invalid email or password'});

    }

    
    const token = jwt.sign({email: user.email,  userId: user._id}, jwtSecretKey);  


  
    res.status(200).json({token});
  }
  catch(error){
    console.error('Login error:', error);
    res.status(500).json({message: 'Internal server error'});

  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
=======
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));  // Increases JSON payload limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));



const jwtSecretKey = process.env.JWT_SECRET;
const ADMIN_SECRET_KEY = process.env.MY_SECRET_KEY;

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true }
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false } 
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model("Admin", adminSchema);

export { Admin, User };


// Admin Signup Route
// Define Admin model

app.post("/admin/signup", async (req, res) => {
  console.log(req.body); // Debugging
  console.log("📥 Received signup request:", req.body);

  const { email, password, adminKey } = req.body;

  if (adminKey !== ADMIN_SECRET_KEY) {
    return res.status(403).json({ message: "Invalid admin key!" });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword, isAdmin: true });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    console.error("❌ Admin Signup Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Admin Login Route
app.post('/admin/login', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // ✅ Ensure `isAdmin` exists in MongoDB and send it in response
    const token = jwt.sign(
      { email: admin.email, userId: admin._id, isAdmin: admin.isAdmin },
      jwtSecretKey,
      { expiresIn: '1h' }
    );

    res.status(200).json({ success: true, token, isAdmin: admin.isAdmin });

  } catch (error) {
    console.error('❌ Admin Login Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});





// Login Route
// app.post('/login', [
//   body('email').isEmail().withMessage('Invalid email format'),
//   body('password').notEmpty().withMessage('Password is required')
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ success: false, errors: errors.array() });
//   }

//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) return res.status(401).json({ success: false, message: 'Invalid email or password' });

//     const token = jwt.sign({ email: user.email, userId: user._id }, jwtSecretKey);
//     res.status(200).json({ success: true, token });
//   } catch (error) {
//     console.error('❌ Login Error:', error.message);
//     res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
//   }
// });



//Middleware for authentication
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    console.log("Decoded Token:", decoded);
    if (!decoded.isAdmin) return res.status(403).json({ success: false, message: 'Forbidden' });
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per 15 minutes
  message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

// Login Route

app.post('/login', loginLimiter, [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = jwt.sign({ email: user.email, userId: user._id, isAdmin: user.isAdmin }, jwtSecretKey);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




// Booking Schema
const bookingSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  eventName: String,
  eventDate: String,
  startTime: String,
  endTime: String,
  phone: String,
  department: String,
  guests: Number,
  purpose: String,
  duration: String,
  status: { type: String, default: 'Pending' } // Pending, Accepted, Rejected
});

const Booking = mongoose.model('Booking', bookingSchema);

// Hall Schema - NEW CODE
const hallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  description: { type: String, required: true },
  Status:{type: String},
  image: { type: String, required: true } // Assuming you want to store the image as a Base64 string
  
});

const Hall = mongoose.model('Hall', hallSchema); // NEW CODE

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

//User Signup Route

app.post('/signup', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already in use' });

    const newUser = new User({ username, email, password, isAdmin: false }); // Default to false
    await newUser.save();

    const token = jwt.sign(
      { email: newUser.email, userId: newUser._id, isAdmin: newUser.isAdmin }, 
      jwtSecretKey
    );

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error('❌ Signup Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});



// Fetch All Accepted Bookings for Admin
app.get('/api/bookings/accepted', async (req, res) => {
  try {
    const acceptedBookings = await Booking.find({ status: 'Accepted' });
    res.json(acceptedBookings);
  } catch (error) {
    console.error('❌ Fetching Accepted Bookings Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching accepted bookings' });
  }
});

// Fetch All Halls  
app.get('/api/viewhalls', async (req, res) => {
  try {
      const halls = await Hall.find({ Status:'ACTIVE' }); // Fetch only active halls
      
      if (!halls.length) {
          return res.json({ success: true, message: 'No active halls found', data: [] });
      }

      // Convert image Buffers to Base64
      const hallsWithBase64Images = halls.map(hall => ({
          ...hall.toObject(),
          image: hall.image ? hall.image.toString('base64') : null
      }));

      res.json({ success: true, data: hallsWithBase64Images });

  } catch (error) {
      console.error('❌ Fetching Active Halls Error:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Fetch All Halls for Admin
app.get('/api/viewhalls/admin', async (req, res) => {
  try {
      const halls = await Hall.find({}); 
      
      if (!halls.length) {
          return res.json({ success: true, message: 'No active halls found', data: [] });
      }

      // Convert image Buffers to Base64
      const hallsWithBase64Images = halls.map(hall => ({
          ...hall.toObject(),
          image: hall.image ? hall.image.toString('base64') : null
      }));

      res.json({ success: true, data: hallsWithBase64Images });

  } catch (error) {
      console.error('❌ Fetching Active Halls Error:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



// Fetch a single hall by ID
app.get('/api/halls/:id', async (req, res) => {
  try {
      const hall = await Hall.findById(req.params.id); // Find hall by ID
      if (!hall) {
          return res.status(404).json({ success: false, message: 'Hall not found' });
      }
      res.json(hall); // Send hall with Base64 image
  } catch (error) {
      console.error('❌ Fetching Hall by ID Error:', error);
      res.status(500).json({ success: false, message: 'Error fetching hall' });
  }
});





// User Booking Route
app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ success: true, message: 'Booking registered successfully' });
  } catch (error) {
    console.error('❌ Booking Error:', error);
    res.status(500).json({ success: false, message: 'Error creating booking' });
  }
});

//Add new hall
 // Import your Mongoose model



// Configure multer to store uploaded files in memory
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};
const upload = multer({ storage, fileFilter });

// Route to add a new hall
app.post('/api/savehalls', upload.single('image'), async (req, res) => {
  try {
    const { name, capacity, description,Status } = req.body;

    // Validate input
    if (!name || !capacity || !description || !Status || !req.file) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Convert file to Base64
    const imageBase64 = req.file.buffer.toString("base64");

    // Save to MongoDB (assuming Hall model)
    const newHall = new Hall({ name, capacity, description, Status, image: imageBase64 });
    await newHall.save();

    res.status(201).json({ success: true, message: 'Hall added successfully', hall: newHall });
  } catch (error) {
    console.error('❌ Adding Hall Error:', error);
    res.status(500).json({ success: false, message: 'Error adding hall' });
  }
});


// ... (previous code)

app.get('/api/bookings', async (req, res) => {
  try {
    const { email } = req.query; // Get email from query parameters
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const userBookings = await Booking.find({ email });
    res.json(userBookings);
  } catch (error) {
    console.error('❌ Fetching User Bookings Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching user bookings' });
  }
});

// ... (rest of your code)

// Fetch Only Pending Bookings for Admin
app.get('/api/bookings/pending', async (req, res) => {
  try {
    const pendingBookings = await Booking.find({ status: 'Pending' });
    res.json(pendingBookings);
  } catch (error) {
    console.error('❌ Fetching Pending Bookings Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching pending bookings' });
  }
});

// Fetch All Bookings for Admin
app.get('/api/admin/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    console.error('❌ Fetching Bookings Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
});

// Update a hall
app.put('/api/updatehalls/:id', upload.single('image'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.error("❌ Invalid Hall ID format:", req.params.id);
      return res.status(400).json({ success: false, message: 'Invalid Hall ID' });
    }

    // console.log("🟢 Received Update Request for Hall ID:", req.params.id);
    // console.log("📩 Request Body:", req.body);

    const { name, capacity, description, Status } = req.body;

    // Validate input
    if (!name || !capacity || !description || !Status) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Convert file to Base64 (if an image is provided)
    let imageBase64 = null;
    if (req.file?.buffer) {
      imageBase64 = req.file.buffer.toString("base64");
    }

    // Prepare update object
    const updateData = { name, capacity, description, Status };
    if (imageBase64) {
      updateData.image = imageBase64;
    }

    // Update the Hall
    const hall = await Hall.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!hall) {
      console.error("❌ Hall not found in database:", req.params.id);
      return res.status(404).json({ success: false, message: 'Hall not found' });
    }

    console.log("✅ Hall updated successfully:", hall);
    res.json({ success: true, message: 'Hall updated successfully', hall });

  } catch (error) {
    console.error('❌ Updating Hall Error:', error);
    res.status(500).json({ success: false, message: 'Error updating hall' });
  }
});



// Delete a hall
// app.delete('/api/halls/:id', authenticateAdmin, async (req, res) => {
//   try {
//     const hall = await Hall.findByIdAndDelete(req.params.id);
//     if (!hall) return res.status(404).json({ success: false, message: 'Hall not found' });
//     res.json({ success: true, message: 'Hall deleted successfully' });
//   } catch (error) {
//     console.error('❌ Deleting Hall Error:', error);
//     res.status(500).json({ success: false, message: 'Error deleting hall' });
//   }
// });


// Admin Accept/Reject Booking
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body; // Accept or Reject
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Send email to user about booking status
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: `Booking ${status}`,
      text: `Dear ${booking.fullName},\n\nYour booking for "${booking.eventName}" on ${booking.eventDate} has been ${status}.\n\nThank you!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Email Error:', error);
      } else {
        console.log(`📩 Email sent: ${info.response}`);
      }
    });

    res.json({ success: true, message: `Booking ${status} successfully` });

  } catch (error) {
    console.error('❌ Booking Update Error:', error);
    res.status(500).json({ success: false, message: 'Error updating booking status' });
  }
});


// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack // Hide stack in production
  });
>>>>>>> b7be0ff (Initial commit)
});



<<<<<<< HEAD
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
=======
// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));


>>>>>>> b7be0ff (Initial commit)
