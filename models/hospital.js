const { Schema, model } = require ('mongoose')

const HostipalSchema = Schema ({
    
    nombre: {
        type: String,
        required: true
    },
  
    img: {
        type: String,
        
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

}, {collection: 'hospitales'})


HostipalSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model ('Hospital', HostipalSchema);

