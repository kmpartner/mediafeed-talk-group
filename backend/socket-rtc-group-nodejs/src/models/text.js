// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const textSchema = Schema({
//     text: {
//       type: String,
//       required: true
//     },
//     from: {
//       type: String,
//       required: true
//     },
//     to: {
//       type: String,
//       required: true
//     },
//     fromUserId: {
//       type: String,
//       required: true
//     },
//     toUserId: {
//       type: String,
//       required: true
//     },
//     fromName: {
//       type: String,
//       // required: true
//     },
//     toName: {
//       type: String,
//       // required: true
//     },
//     sendAt: {
//       type: Number,
//       required: true
//     },
//     language: {
//       type: String,
//       // required: true
//     },
//     geolocation: {
//       type: Object
//     },
//     // geolocation: {
//     //     type: String,
//     //     // required: true
//     // },
//     // comments: [{
//     //     type: Schema.Types.ObjectId,
//     //     ref: 'Comment'
//     // }],
// }, 
// { timestamps: true }
// );

// module.exports = mongoose.model('Text', textSchema);