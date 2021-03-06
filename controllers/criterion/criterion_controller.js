const AuditResponsable = require('../../models/auditResponsable_model')
const Standard = require('../../models/standard_model')
const InstallationType = require('../../models/installationType_model')
const Criterion = require('../../models/criterion_model')
const Area = require('../../models/area_model')
const Block = require('../../models/block_model')
const Category = require('../../models/category_model')
const CriterionType = require('../../models/criterionType_model')
const ObjectId = require('mongodb').ObjectId

const createCriterion = async(request, response) => {
    try{
        const {description, number, comment, installationType, standard, auditResponsable, criterionType, isAgency,
               isException, isHmeAudit, isImgAudit, isElectricAudit, photo, saleCriterion, hmesComment, value, 
               imageUrl, imageComment, hmeCode } = request.body

        let errors = []

        if(!installationType || !Array.isArray(installationType))
            errors.push({code: 400, 
                        msg: 'invalid installationType',
                        detail: `installationType should be an array type, and is required`
                        })      

        if(installationType && Array.isArray(installationType)){
            for(let i = 0; i<installationType.length; i++){
                if(!ObjectId.isValid(installationType[i])){
                    errors.push({code: 400, 
                        msg: 'invalid installationType',
                        detail: `format should be a ObjectId`
                        })  
                }
                else{                
                    const existInstallationType = await InstallationType.exists({_id: installationType[i]})
                    if(!existInstallationType)
                        errors.push({code: 400, 
                                    msg: 'invalid installationType',
                                    detail: `installationType not found`
                                    })        
                }
            }
        }

        if(!standard)
            errors.push({code: 400, 
                        msg: 'invalid standard',
                        detail: `standard is required`
                        })      

        if(standard){
            if(!ObjectId.isValid(standard)){
                errors.push({code: 400, 
                    msg: 'invalid standard',
                    detail: `format should be a ObjectId`
                    })  
            }
            else{                
                const existStandard = await Standard.exists({_id: standard})
                if(!existStandard)
                    errors.push({code: 400, 
                                msg: 'invalid standard',
                                detail: `standard not found`
                                })        
            }
        }

        if(!auditResponsable)
            errors.push({code: 400, 
                        msg: 'invalid auditResponsable',
                        detail: `auditResponsable is required`
                        })      

        if(auditResponsable){
            if(!ObjectId.isValid(auditResponsable)){
                errors.push({code: 400, 
                    msg: 'invalid auditResponsable',
                    detail: `format should be a ObjectId`
                    })  
            }
            else{                
                const existAudit = await AuditResponsable.exists({_id: auditResponsable})
                if(!existAudit)
                    errors.push({code: 400, 
                                msg: 'invalid auditResponsable',
                                detail: `auditResponsable not found`
                                })        
            }
        }

        if(!criterionType)
            errors.push({code: 400, 
                        msg: 'invalid criterionType',
                        detail: `criterionType is required`
                        })      

        if(criterionType){
            if(!ObjectId.isValid(criterionType)){
                errors.push({code: 400, 
                    msg: 'invalid criterionType',
                    detail: `format should be a ObjectId`
                    })  
            }
            else{                
                const existResponsable = await CriterionType.exists({_id: criterionType})
                if(!existResponsable)
                    errors.push({code: 400, 
                                msg: 'invalid criterionType',
                                detail: `criterionType not found`
                                })        
            }
        }

        if(!description || description.length < 1)
            errors.push({code: 400, 
                        msg: 'invalid description',
                        detail: `description is required`
        })

        if(!number || typeof number !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid number',
                            detail: `number should be a number type, and number is required`
                        })

        if(!value || typeof value !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid value',
                            detail: `value should be a number type, and value is required`
                        })

        if(isAgency!==null && isAgency!==undefined && typeof isAgency !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid isAgency',
                        detail: `isAgency should be a boolean type`
                        })   

        if(isHmeAudit!==null && isHmeAudit!==undefined && typeof isHmeAudit !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid isHmeAudit',
                        detail: `isHmeAudit should be a boolean type`
                        }) 

        if(isException!==null && isException!==undefined && typeof isException !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid isException',
                        detail: `isException should be a boolean type`
                        })   

        if(isImgAudit!==null && isImgAudit!==undefined && typeof isImgAudit !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid isImgAudit',
                        detail: `isImgAudit should be a boolean type`
                        }) 

        if(isElectricAudit!==null && isElectricAudit!==undefined && typeof isElectricAudit !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid isElectricAudit',
                        detail: `isElectricAudit should be a boolean type`
                        }) 

        if(photo!==null && photo!==undefined && typeof photo !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid photo',
                        detail: `photo should be a boolean type`
                        }) 
                        
        if(saleCriterion!==null && saleCriterion!==undefined && typeof saleCriterion !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid saleCriterion',
                        detail: `saleCriterion should be a boolean type`
                        }) 

        if(comment && comment.length < 1)
            errors.push({code: 400, 
                        msg: 'invalid comment',
                        detail: `comment should be a boolean type`
                        })   

        if(hmesComment && hmesComment.length < 1)
            errors.push({code: 400, 
                        msg: 'invalid hmesComment',
                        detail: `hmesComment should be a boolean type`
                        })  

        if(hmeCode && hmeCode.length < 1)
            errors.push({code: 400, 
                msg: 'invalid hmeCode',
                detail: `hmeCode should be a string type`
            })

        if(imageUrl && imageUrl.length < 1)
            errors.push({code: 400, 
                msg: 'invalid imageUrl',
                detail: `imageUrl should be a string type`
            })

        if(imageComment && imageComment.length < 1)
            errors.push({code: 400, 
                msg: 'invalid imageComment',
                detail: `imageComment should be a string type`
            })

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const standardById = await Standard.findById(standard)

        const newCriterion = new Criterion({
            description: description,
            number: number,
            value: value,
            comment: comment? comment: null,
            installationType: installationType,
            standard: standard,
            block: standardById.block,
            area: standardById.area,
            category: standardById.category,
            auditResponsable: auditResponsable, 
            criterionType: criterionType,
            isAgency: (!isAgency || isAgency === false)? false : true,
            isException: (isException && isException === true)? true : false,
            isHmeAudit: (isHmeAudit && isHmeAudit === true)? true : false,
            isImgAudit: (isImgAudit && isImgAudit === true)? true : false,
            isElectricAudit: (isElectricAudit && isElectricAudit === true)? true : false,
            photo: (photo && photo === true)? true : false,
            saleCriterion: (saleCriterion && saleCriterion === true)? true : false,
            hmesComment: hmesComment? hmesComment: null,
            imageUrl: imageUrl? imageUrl: null, 
            imageComment: imageComment? imageComment: null, 
            hmeCode: hmeCode? hmeCode: null
        })

        await newCriterion.save()
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })

        const standardBy = await Standard.findByIdAndUpdate(standard, {$push: { criterions: newCriterion._id }, $inc: {value: value}})
                            .catch(error => {        
                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                            })
        const areaById = await Area.findByIdAndUpdate(standardBy.area, {$inc: {value: value}})
                            .catch(error => {        
                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                            })
        const blockById = await Block.findByIdAndUpdate(areaById.block, {$inc: {value: value}})
                            .catch(error => {        
                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                            })
        await Category.findByIdAndUpdate(blockById.category, {$inc: {value: value}})
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })

        response.status(201).json({code: 201,
                                    msg: 'the criterion has been created successfully',
                                    data: newCriterion })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateCriterion = async(request, response) => {
    try{
        const {id} = request.params
        const {description, number, value, comment, installationType, standard, auditResponsable, criterionType,
               isException, isHmeAudit, isImgAudit, isElectricAudit, photo, saleCriterion, hmesComment,
               imageUrl, imageComment, hmeCode } = request.body

        let errors = []

        if(id && ObjectId.isValid(id)){
            const existId = await Criterion.exists({_id: id})
                                       .catch(error => {return response.status(400).json({code: 500, 
                                                                                          msg: 'error id',
                                                                                          detail: error.message
                                                                                        })} )  
            if(!existId)
                return response.status(400).json({code: 400, 
                                                  msg: 'invalid id',
                                                  detail: 'id not found'
                                                })
        }
        else{
            return response.status(400).json({code: 400, 
                                              msg: 'invalid id',
                                              detail: `id not found`
                                            })   
        }
         
        if(standard){
            if(standard.length < 1){
                errors.push({code: 400, 
                            msg: 'invalid standard',
                            detail: `standard is required`
                            })     
            }
            else{
                const existStandard = await Standard.findOne({_id: standard})
                .catch(error => {        
                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                })
                if(!existStandard)
                    errors.push({code: 400, 
                                msg: 'invalid existStandard',
                                detail: `${standard} not found`
                                })
            }
        }

        if(installationType && !Array.isArray(installationType)){
                errors.push({code: 400, 
                            msg: 'invalid installationType',
                            detail: `installationType is invalid format`
                            })     
        }
        else if(installationType && Array.isArray(installationType)){
            for(let i = 0; i<installationType.length; i++){
                if(!ObjectId.isValid(installationType[i])){
                    errors.push({code: 400, 
                        msg: 'invalid installationType',
                        detail: `format should be a ObjectId`
                        })  
                }
                else{                
                    const existInstallationType = await InstallationType.exists({_id: installationType[i]})
                    if(!existInstallationType)
                        errors.push({code: 400, 
                                    msg: 'invalid installationType',
                                    detail: `installationType not found`
                                    })        
                }
            }
        }

        if(auditResponsable){
            if(auditResponsable.length < 1){
                errors.push({code: 400, 
                            msg: 'invalid auditResponsable',
                            detail: `auditResponsable is required`
                            })     
            }
            else{
                const existAudit = await AuditResponsable.findOne({_id: auditResponsable})
                .catch(error => {        
                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                })
                if(!existAudit)
                    errors.push({code: 400, 
                                msg: 'invalid auditResponsable',
                                detail: `${auditResponsable} not found`
                                })
            }
        }

        if(criterionType){
            if(criterionType.length < 1){
                errors.push({code: 400, 
                            msg: 'invalid criterionType',
                            detail: `criterionType is required`
                            })     
            }
            else{
                const existCriterion = await CriterionType.findOne({_id: criterionType})
                .catch(error => {        
                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                })
                if(!existCriterion)
                    errors.push({code: 400, 
                                msg: 'invalid criterionType',
                                detail: `${criterionType} not found`
                                })
            }
        }

        if(number !== null && number !== undefined && typeof number !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid number',
                            detail: `number should be a number type, and number is required`
                        })

        const criterion = await Criterion.findById(id)

        let diff = 0

        if(value !== null && value !== undefined && typeof value === 'number'){
            console.log(criterion.value)
            diff = value - criterion.value
        }

        if(description && description.length < 1){
            errors.push({code: 400, 
                        msg: 'invalid description',
                        detail: `description is required`
                        })     
        }

        if((isException !== undefined && isException !== null) && (isException !== true && isException !== false))
            errors.push({code: 400, 
                msg: 'invalid isException',
                detail: `isException should be a boolean type`
            })

        if((isHmeAudit !== undefined && isHmeAudit !== null) && (isHmeAudit !== true && isHmeAudit !== false))
            errors.push({code: 400, 
                msg: 'invalid isHmeAudit',
                detail: `isHmeAudit should be a boolean type`
            })

        if((isImgAudit !== undefined && isImgAudit !== null) && (isImgAudit !== true && isImgAudit !== false))
            errors.push({code: 400, 
                msg: 'invalid isImgAudit',
                detail: `isImgAudit should be a boolean type`
            })

        if((isElectricAudit !== undefined && isElectricAudit !== null) && (isElectricAudit !== true && isElectricAudit !== false))
            errors.push({code: 400, 
                msg: 'invalid isElectricAudit',
                detail: `isElectricAudit should be a boolean type`
            })

        if((photo !== undefined && photo !== null) && (photo !== true && photo !== false))
            errors.push({code: 400, 
                msg: 'invalid photo',
                detail: `photo should be a boolean type`
            })

        if((saleCriterion !== undefined && saleCriterion !== null) && (saleCriterion !== true && saleCriterion !== false))
            errors.push({code: 400, 
                msg: 'invalid saleCriterion',
                detail: `saleCriterion should be a boolean type`
            })

        if(comment && comment.length < 1)
            errors.push({code: 400, 
                msg: 'invalid comment',
                detail: `comment should be a string type`
            })

        if(hmesComment && hmesComment.length < 1)
            errors.push({code: 400, 
                msg: 'invalid hmesComment',
                detail: `hmesComment should be a string type`
            })

        if(hmeCode && hmeCode.length < 1)
            errors.push({code: 400, 
                msg: 'invalid hmeCode',
                detail: `hmeCode should be a string type`
            })

        if(imageUrl && imageUrl.length < 1)
            errors.push({code: 400, 
                msg: 'invalid imageUrl',
                detail: `imageUrl should be a string type`
            })

        if(imageComment && imageComment.length < 1)
            errors.push({code: 400, 
                msg: 'invalid imageComment',
                detail: `imageComment should be a string type`
            })

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const updatedFields = {}
        if(number !== null && number !== undefined)
            updatedFields['number'] = number
        if(value !== null && value !== undefined){
            updatedFields['value'] = value}
        if(comment)
            updatedFields['comment'] = comment
        if(installationType)
            updatedFields['installationType'] = installationType
        if(standard)
            updatedFields['standard'] = standard
        if(auditResponsable)
            updatedFields['auditResponsable'] = auditResponsable
        if(criterionType)
            updatedFields['criterionType'] = criterionType
        if(description)
            updatedFields['description'] = description
        if(isException !== null && isException !== undefined)
            updatedFields['isException'] = isException
        if(isImgAudit !== null && isImgAudit !== undefined)
            updatedFields['isImgAudit'] = isImgAudit
        if(isHmeAudit !== null && isHmeAudit !== undefined)
            updatedFields['isHmeAudit'] = isHmeAudit
        if(imageUrl !== null && imageUrl !== undefined)
            updatedFields['imageUrl'] = imageUrl
        if(imageComment !== null && imageComment !== undefined)
            updatedFields['imageComment'] = imageComment
        if(hmeCode !== null && hmeCode !== undefined)
            updatedFields['hmeCode'] = hmeCode
        if(isElectricAudit !== null && isElectricAudit !== undefined)
            updatedFields['isElectricAudit'] = isElectricAudit
        if(photo !== null && photo !== undefined)
            updatedFields['photo'] = photo
        if(saleCriterion !== null && saleCriterion !== undefined)
            updatedFields['saleCriterion'] = saleCriterion
        if(hmesComment)
            updatedFields['hmesComment'] = hmesComment
        updatedFields['updatedAt'] = Date.now()

        const updatedCriterion = await Criterion.findByIdAndUpdate(id, updatedFields, {new: true})
                                              .catch(error => {        
                                                  return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })
        const standardBy = await Standard.findByIdAndUpdate(updatedCriterion.standard, {$inc: {value: diff}})
                            .catch(error => {        
                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                            })
        const areaById = await Area.findByIdAndUpdate(standardBy.area, {$inc: {value: diff}})
                            .catch(error => {        
                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                            })
        const blockById = await Block.findByIdAndUpdate(areaById.block, {$inc: {value: diff}})
                            .catch(error => {        
                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                            })
        await Category.findByIdAndUpdate(blockById.category, {$inc: {value: diff}})
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })

        response.status(200).json({code: 200,
                                    msg: 'the Criterion has been updated successfully',
                                    data: updatedCriterion })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const deleteCriterion = async(request, response) => {
    try{
        const {id} = request.params

        if(id && ObjectId.isValid(id)){
            const existId = await Criterion.exists({_id: id})
                                          .catch(error => {return response.status(400).json({code: 500, 
                                                                                            msg: 'error id',
                                                                                            detail: error.message
                                                                                            })} )  
            if(!existId)
                return response.status(400).json({code: 400, 
                                                  msg: 'invalid id',
                                                  detail: 'id not found'
                                                })
        }
        else{
            return response.status(400).json({code: 400, 
                                              msg: 'invalid id',
                                              detail: `id not found`
                                            })   
        }

        const deletedCriterion = await Criterion.findByIdAndDelete(id)
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })
         
        const standardBy =await Standard.findByIdAndUpdate(deletedCriterion.standard, {$pull: { criterions: id }, $inc: {value: -deletedCriterion.value}})
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })
                       
        const areaById = await Area.findByIdAndUpdate(standardBy.area, {$inc: {value: -deletedCriterion.value}})
                .catch(error => {        
                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                })
        const blockById = await Block.findByIdAndUpdate(areaById.block, {$inc: {value: -deletedCriterion.value}})
                .catch(error => {        
                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                })
        const categoryById = await Category.findByIdAndUpdate(blockById.category, {$inc: {value: -deletedCriterion.value}})
                .catch(error => {        
                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                })

        response.status(201).json({code: 201,
                                    msg: 'the criterion has been deleted successfully',
                                    data: deletedCriterion })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getAllCriterion = async(request, response) => {
    try{
        const {description, number, installationType, standard, auditResponsable, criterionType, isAgency,
               isException, isHmeAudit, isImgAudit, isElectricAudit, photo, saleCriterion, pageReq} = request.body

        const page = !pageReq ? 0 : pageReq

        let skip = (page - 1) * 10

        const filter = {}

        if(installationType && !ObjectId.isValid(installationType)){
            return response.status(400).json({code: 400, 
                msg: 'invalid installationType',
                detail: `format should be a ObjectId`
                })  
        }

        if(standard && !ObjectId.isValid(standard)){
            return response.status(400).json({code: 400, 
                msg: 'invalid standard',
                detail: `format should be a ObjectId`
                })  
        }

        if(auditResponsable && !ObjectId.isValid(auditResponsable)){
            return response.status(400).json({code: 400, 
                msg: 'invalid auditResponsable',
                detail: `format should be a ObjectId`
                })  
        }

        if(criterionType && !ObjectId.isValid(criterionType)){
            return response.status(400).json({code: 400, 
                msg: 'invalid criterionType',
                detail: `format should be a ObjectId`
                })  
        }

        if(description)
            filter['description'] = { $regex : new RegExp(description, "i") }

        if(number)
            filter['number'] = number

        if(installationType)
            filter['installationType'] = installationType

        if(standard)
            filter['standard'] = standard

        if(auditResponsable)
            filter['auditResponsable'] = auditResponsable

        if(criterionType)
            filter['criterionType'] = criterionType

        if(isAgency!== null && isAgency !== undefined && (isAgency === true || isAgency === false))
            filter['isAgency'] = isAgency

        if(isException!== null && isException !== undefined && (isException === true || isException === false))
            filter['isException'] = isException

        if(isHmeAudit!== null && isHmeAudit !== undefined && (isHmeAudit === true || isHmeAudit === false))
            filter['isHmeAudit'] = isHmeAudit
            
        if(isImgAudit!== null && isImgAudit !== undefined && (isImgAudit === true || isImgAudit === false))
            filter['isImgAudit'] = isImgAudit
            
        if(isElectricAudit!== null && isElectricAudit !== undefined && (isElectricAudit === true || isElectricAudit === false))
            filter['isElectricAudit'] = isElectricAudit
            
        if(photo!== null && photo !== undefined && (photo === true || photo === false))
            filter['photo'] = photo

        if(saleCriterion!== null && saleCriterion !== undefined && (saleCriterion === true || saleCriterion === false))
            filter['saleCriterion'] = saleCriterion

        if(page === 0){
            const criterions = await Criterion.find(filter).populate({path: 'installationType standard block area auditResponsable criterionType category'})
                                             .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                             })
            const data = {criterions: criterions, 
                          totalPages: 1}

            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }
            
        let countDocs = await Criterion.countDocuments(filter)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

        if((countPage < page) && page !== 1)
            return response.status(400).json({code: 400, 
                                              msg: 'invalid page', 
                                              detail: `totalPages: ${countPage}`})

        const criterions = await Criterion.find(filter).skip(skip).limit(10).populate({path: 'installationType standard block area auditResponsable criterionType category'})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        const data = {criterions: criterions, 
                      totalPages: countPage}

        response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

const getCriterion = async(request, response) => {

    try{

        const {id} = request.params

        //Validations
        if(!id)
            return response.status(400).json({code: 400,
                                                msg: 'invalid id',
                                                detail: 'id is a obligatory field'})
    
        if(id && !ObjectId.isValid(id))
            return response.status(400).json({code: 400,
                                              msg: 'invalid id',
                                              detail: 'id should be an objectId'})
    
        const criterion = await Criterion.findById(id).populate({path: 'installationType standard block area auditResponsable criterionType'})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
    
        if(criterion){
            response.status(200).json({code: 200,
                                       msg: 'success',
                                       data: criterion})
        }
        else{
            response.status(200).json({code: 204,
                                        msg: 'not found',
                                        data: null})}
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    } 
}

module.exports = {createCriterion, updateCriterion, deleteCriterion, getAllCriterion, getCriterion}
