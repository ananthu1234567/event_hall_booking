import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import core from 'cors';


dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
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
});



const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});