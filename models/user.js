const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
	blogs: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Blog'
	}],
	username: { type: String, required: true, unique: true, minLength: 3 },
	name: String,
	passwordHash: String
})

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash // hide !
	}
})

const User = mongoose.model('User', userSchema) // added, change from lecture

module.exports = User