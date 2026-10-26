const mongoose = require('mongoose');

const platilloSchema = mongoose.Schema({
     category: {
        type: String,
        required: true,
        enum:[
            'Tacos', 'Quesadillas','Appetizers', 'Lunch','Dinner','Desserts'
        ],
    },
    title:{
        type: String,
        required:true
    }, 
    description: {
        type: String
    },
    price: {
        type:Number,
        min : [0, 'precio no puede ser negativo'],
        //max : [30,'La edad no parece correcta']
    },
    image :{
        type: String,
        default: 'img/tacos.jpg'
    },
}, { timestamps : true })

//model
module.exports = mongoose.model('Menu', platilloSchema, 'menu');

