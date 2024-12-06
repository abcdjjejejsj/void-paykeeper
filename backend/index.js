const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is imported

// MongoDB connection
const dbURI = 'mongodb+srv://vaibhavsalve645:FsbxDbYVNw3cB42p@cluster0.m4md1.mongodb.net/paykeeperData?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// User schema
const userSchema = new mongoose.Schema({
  userType: { type: String, required: true },
  name: { type: String, required: true },
  shopName: { type: String },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 }, // Account balance
  transactions: { type: Array, default: [] }, // Transaction history
  pendingDebt: { type: Number, default: 0 } // Pending debt
});

// Add password hashing middleware before saving user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password not modified

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

// Sign-up route
app.post('/api/users/signup', async (req, res) => {
  try {
    const { userType, shopName, name, mobile, email, password } = req.body;

    if (!userType || !name || !mobile || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new user
    const newUser = new User({
      userType,
      name,
      shopName,
      mobile,
      email,
      password // Password will be hashed automatically in the `pre` middleware
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user signup:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Sign-in route
app.post('/api/users/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({
            message: 'Sign-in successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                userType: user.userType,
                shopName: user.shopName || null,
            },
            
        });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Dashboard route (combined data)
app.get('/api/dashboard/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const dashboardData = {
      balance: user.balance || 0,
      transactions: user.transactions || [],
      pendingDebt: user.pendingDebt || 0
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Route to fetch transaction history
app.get('/api/dashboard/transactions/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ transactions: user.transactions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Route to fetch pending debt
app.get('/api/dashboard/pending-debt/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ pendingDebt: user.pendingDebt });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending debt' });
  }
});

// Contact Us schema
const contactUsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Create model from schema
const ContactUs = mongoose.model('ContactUs', contactUsSchema);

// Contact Us form submission route
app.post('/submit-contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save the contact form data in the database
    const newContact = new ContactUs({
      name,
      email,
      message
    });

    await newContact.save();
    res.status(201).json({ message: 'Your message has been sent successfully!' });

  } catch (error) {
    console.error('Error during contact form submission:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
