import { connectToDB } from '@utils/database';
import User from '@models/user';

export default async function handler(req, res) {
  try {
    console.log('Testing DB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    await connectToDB();
    console.log('DB connected successfully');

    const userCount = await User.countDocuments();
    console.log('User count:', userCount);

    return res.status(200).json({ 
      success: true, 
      message: 'Database connected',
      userCount 
    });
  } catch (error) {
    console.error('DB connection error:', error.message);
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.toString()
    });
  }
}
