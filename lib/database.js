import mongoose from 'mongoose';

const connect = () => {
  // checking if the MongoDB is connected
  if (mongoose.connections[0].readyState) {
    console.log('Already Connected');
    return;
  } else {
    // creating connection
    mongoose.connect(
      process.env.MONGODB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) console.error('Error connecting to MongoDB');
        else console.log('Connected to MongoDB');
      }
    );
  }
};

export default connect;
