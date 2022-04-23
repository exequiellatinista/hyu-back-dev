const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const sizingTableSchema = new Schema({
        name: { 
                type: String,
                trim: true,
                required: true 
        },
        columns: [{
                name: {
                        type: String,   
                        trim: true
                },
                comment: {
                        type: String,   
                        trim: true                                
                },
                level2: [{
                        name: {
                                type: String,   
                                trim: true
                        },
                        comment: {
                                type: String,   
                                trim: true                                
                        },
                        level3: [{

                                model: {
                                        type: String,
                                        trim: true,
                                },

                                field: {
                                        type: String,
                                        trim: true,
                                },

                                name: {
                                        type: String,   
                                        trim: true
                                },

                                comment: {
                                        type: String,   
                                        trim: true                                
                                },
                        }]
                }]
        }],
        rows: [{
                name: {
                        type: String,
                        trim: true
                },
                initialValue: {
                        type: Number,
                        default: null
                },
                endValue: {
                        type: Number,
                        default: null
                },
                values: [{type: Number}]
        }],
        row: {
                model: {
                        type: String,
                        trim: true,
                },
                field: {
                        type: String,
                        trim: true,
                }
        },
        createdAt: {
                type: Date,
                default: Date.now
        },
        updatedAt: {
                type: Date,
                default: Date.now
        }
})

sizingTableSchema.plugin(uniqueValidator)

const SizingTable = model('sizingTable', sizingTableSchema)

module.exports = SizingTable
