const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserFacebookSchema=new Schema({
name:{
    type:String
},
id:{
    type:String
},
city:{
    type:String
},
token:{type:String}
});
const UserFacebook=mongoose.model('UserFacebook',UserFacebookSchema);


UserFacebookSchema.pre('save',function(){
    console.log('Estamos por guardar');
    })
    UserFacebookSchema.post('save',function(){
        console.log('Ya guardamos');
        })

module.exports=UserFacebook;