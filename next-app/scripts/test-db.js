const mongoose = require('mongoose')

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...')
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/school-management')
    
    console.log('✅ MongoDB connected successfully!')
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`)
    console.log(`🔗 Host: ${mongoose.connection.host}:${mongoose.connection.port}`)
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log(`📁 Collections: ${collections.length}`)
    collections.forEach(col => console.log(`  - ${col.name}`))
    
    await mongoose.disconnect()
    console.log('✅ Database test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

testConnection()