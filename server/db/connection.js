const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const url = 'mongodb+srv://chat_app_admin:Salina%40123@cluster0.7gyqj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(url, {
    
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
}).then(() => console.log('Connected to DB')).catch((e) => console.log('Error',e));