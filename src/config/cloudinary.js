const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dr5cmixpw',
  api_key: '233237149469319',
  api_secret: 'e3lZsJmOd73PqSbN3y6O4OXVtkg',
});

module.exports = cloudinary;