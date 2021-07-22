"use strict";
import { model, Schema } from 'mongoose';

const schema = new Schema({
fileName: { type: String, default: null },
createdAt: {type: Date, default: Date.now() }
},{
  collection: 'files'
});

module.exports = model('Files', schema);