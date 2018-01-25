const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
name:{
    type:String
},
id:{
    type:String
}
,
city:{
    type:String
}
});

const User=mongoose.model('User',UserSchema);

UserSchema.pre('save',function(){
console.log('Estamos por guardar');
})
UserSchema.post('save',function(){
    console.log('Ya guardamos');
    })
module.exports=User;