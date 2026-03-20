import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing connection to:', process.env.DB_URL ? 'MongoDB (URL hidden)' : 'NO DB_URL FOUND!');
    
    if (!process.env.DB_URL) {
      console.error('❌ DB_URL not found in .env file');
      console.log('\nPlease add DB_URL to backend/.env:');
      console.log('DB_URL=mongodb://localhost:27017/talentiq');
      console.log('OR for MongoDB Atlas:');
      console.log('DB_URL=mongodb+srv://username:password@cluster.mongodb.net/talentiq');
      process.exit(1);
    }
    
    console.log('Connecting...');
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ Database connection successful!');
    console.log('   Host:', mongoose.connection.host);
    console.log('   Database:', mongoose.connection.name);
    
    // Test creating a user
    console.log('\nTesting user creation...');
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: { type: String, default: 'user' }
    }));
    
    const testEmail = `test${Date.now()}@example.com`;
    const testUser = await User.create({
      name: 'Test User',
      email: testEmail,
      password: 'test123'
    });
    
    console.log('✅ Test user created successfully!');
    console.log('   ID:', testUser._id);
    console.log('   Email:', testUser.email);
    
    // Clean up
    console.log('\nCleaning up test data...');
    await User.findByIdAndDelete(testUser._id);
    console.log('✅ Test user deleted');
    
    await mongoose.connection.close();
    console.log('\n✅ All tests passed! Database is working correctly.');
    console.log('   Registration should work now.');
  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Solution: MongoDB is not running');
      console.log('   - Start MongoDB locally, OR');
      console.log('   - Use MongoDB Atlas (cloud)');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 Solution: Check your MongoDB username/password');
    } else if (error.message.includes('Invalid connection string')) {
      console.log('\n💡 Solution: Check your DB_URL format in .env');
    }
    
    process.exit(1);
  }
}

testConnection();