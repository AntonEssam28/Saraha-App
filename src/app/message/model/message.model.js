// schema

import { Schema } from 'mongoose';

const messageSchema = new Schema(
	{
		content: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 200
		},
		reciever: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User' //users
		},
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'User' //users
		},
		isDelted: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps:{
            createdAt:true,
            updatedAt:true
        }
	}
);

// model

export const Message = model('Message', messageSchema);
