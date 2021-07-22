"use strict";
import { model, Schema } from 'mongoose';

const schema = new Schema({
email: { type: String, default: null },
firstName: { type: String, default: null },
lastName: { type: String, default: null },
phoneNumber: { type: String, default: null },
city: { type: String, default: null },
address: { type: String, default: null },
socialLink: { type: String, default: null }
},{
  collection: 'users'
});

module.exports = model('Users', schema);