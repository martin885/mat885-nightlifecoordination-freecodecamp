const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const barSchema=new Schema({
city:{
    type:String,
    required:true
},


name:{
    type:String,
    required:true
},




image_url:{
type:String,
required:true
},
users:{
    type:Array
}
});

const Bars=mongoose.model('Bar',barSchema);
module.exports=Bars;