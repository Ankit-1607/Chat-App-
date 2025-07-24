import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'An email must be provided'],
      unique: [true, 'Email already in use']
    },
    fullName: {
      type: String,
      required: [true, 'A name must be provided']
    },
    password: {
      type: String,
      required: [true, 'A password must be provided'],
      minlength: [6, 'password cannot be less than 6 characters']
    },
    profilePic: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema);