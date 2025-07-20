require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const candidateRoutes = require('./routes/candidateRoutes');
const employerRoutes = require('./routes/employerRoutes');
const setupSwagger = require('./swagger');

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Swagger UI
setupSwagger(app);

app.get('/', (req, res) => {
  res.send('Hello world');
});
app.get("/me",(req,res)=>{
  res.send("welcome");
})

// API Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/employer', employerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
