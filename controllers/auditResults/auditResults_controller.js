const Audit = require('../../models/audit_model')
const Dealership = require('../../models/dealership_model')
const AuditResults = require('../../models/audit_results_model')
const Criterion = require('../../models/criterion_model')
const Installation = require('../../models/installation_schema')
const ObjectId = require('mongodb').ObjectId

const createAuditResults = async(request, response) => {
    try{
        const {audit_id, installation_id, criterions} = request.body

        let errors = []

        if(!audit_id){
            errors.push({code: 400, 
                         msg: 'invalid audit_id',
                         detail: 'audit_id is an obligatory field'
                        })
        }
        else{
            if(!ObjectId.isValid(audit_id)){
                errors.push({code: 400, 
                    msg: 'invalid audit_id',
                    detail: `${audit_id} is not an ObjectId`
                })  
            }
            else{
                const existAudit = await Audit.exists({_id: audit_id})
                if(!existAudit)
                    errors.push({code: 400, 
                                msg: 'invalid audit_id',
                                detail: `${audit_id} not found`
                                })   
            }
        }

        const auditResultsFind = await AuditResults.findOne({audit_id: audit_id, installation_id: installation_id})
        if(auditResultsFind)
            errors.push({code: 400, 
                msg: 'invalid installation_id',
                detail: 'installation_id has already been audited'
            })

        if(!installation_id){
            errors.push({code: 400, 
                         msg: 'invalid installation_id',
                         detail: 'installation_id is an obligatory field'
                        })
        }
        else{
            if(!ObjectId.isValid(installation_id)){
                errors.push({code: 400, 
                    msg: 'invalid installation_id',
                    detail: `${installation_id} is not an ObjectId`
                })  
            }
            else{
                const existInstallation = await Installation.exists({_id: installation_id})
                if(!existInstallation)
                    errors.push({code: 400, 
                                msg: 'invalid installation_id',
                                detail: `${installation_id} not found`
                                })   
            }
        }

        if(!criterions || !Array.isArray(criterions)){
            errors.push({code: 400, 
                msg: 'invalid criterions',
                detail: `criterions is an obligatory field, and should be an array type`
            })
        }
        else if(criterions){

            criterions.forEach(async(element) => {
                if(!element.hasOwnProperty("criterion_id") || !element.hasOwnProperty("pass")){
                    errors.push({code: 400, 
                        msg: 'invalid criterions',
                        detail: `criterions should be contains criterion_id and pass fields`
                    })
                }
                else if(!ObjectId.isValid(element.criterion_id)){
                    errors.push({code: 400, 
                        msg: 'invalid criterion_id',
                        detail: `${element.criterion_id} is not an ObjectId`
                    })  
                }
                else{                
                    const existCriterion = await Criterion.exists({_id: element.criterion_id})
                    if(!existCriterion)
                        errors.push({code: 400, 
                                    msg: 'invalid criterion_id',
                                    detail: `${element.criterion_id} not found`
                                    })        
                }
            })
        }

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

            const newAuditResults = new AuditResults({
            audit_id,
            installation_id,
            criterions
        })

        await newAuditResults.save()
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })

        response.status(201).json({code: 201,
                                    msg: 'the auditResults has been created successfully',
                                    data: 'newAuditResults' })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateAuditResults = async(request, response) => {
    try{
        const {audit_id, installation_id, criterions} = request.body
        const {id} = request.params

        let errors = []
        let audiResultstById = null

        if(id && ObjectId.isValid(id)){
            audiResultstById = await AuditResults.findById(id)
                                       .catch(error => {return response.status(400).json({code: 500, 
                                                                                          msg: 'error id',
                                                                                          detail: error.message
                                                                                        })} )  
            if(!audiResultstById)
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

        if(audit_id){
            if(!ObjectId.isValid(audit_id)){
                errors.push({code: 400, 
                    msg: 'invalid audit_id',
                    detail: `${audit_id} is not an ObjectId`
                })  
            }
            else{
                const existAudit = await Audit.exists({_id: audit_id})
                if(!existAudit)
                    errors.push({code: 400, 
                                msg: 'invalid audit_id',
                                detail: `${audit_id} not found`
                                })   
            }
        }

        if(installation_id){
            if(!ObjectId.isValid(installation_id)){
                errors.push({code: 400, 
                    msg: 'invalid installation_id',
                    detail: `${installation_id} is not an ObjectId`
                })  
            }
            else{
                const existInstallation = await Installation.exists({_id: installation_id})
                if(!existInstallation)
                    errors.push({code: 400, 
                                msg: 'invalid installation_id',
                                detail: `${installation_id} not found`
                                })   
            }
        }

        if(!criterions || !Array.isArray(criterions)){
            errors.push({code: 400, 
                msg: 'invalid criterions',
                detail: `criterions is an obligatory field, and should be an array type`
            })
        }
        else if(criterions){
            criterions.forEach(async(element) => {
                if(!element.hasOwnProperty("criterion_id") || !element.hasOwnProperty("pass")){
                    errors.push({code: 400, 
                        msg: 'invalid criterions',
                        detail: `criterions should be contains criterion_id and pass fields`
                    })
                }
                else if(!ObjectId.isValid(element.criterion_id)){
                    errors.push({code: 400, 
                        msg: 'invalid criterion_id',
                        detail: `${element.criterion_id} is not an ObjectId`
                    })  
                }
                else{                
                    const existCriterion = await Criterion.exists({_id: element.criterion_id})
                    if(!existCriterion)
                        errors.push({code: 400, 
                                    msg: 'invalid criterion_id',
                                    detail: `${element.criterion_id} not found`
                                    })        
                }
            })
        }
        
        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const updatedFields = {}

        if(audit_id)
            updatedFields['audit_id'] = audit_id
        if(installation_id)
            updatedFields['installation_id'] = installation_id
        if(criterions)
            updatedFields['criterions'] = criterions
        updatedFields['updatedAt'] = Date.now()

        const updatedAuditResults = await AuditResults.findByIdAndUpdate(id, updatedFields, {new: true})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        response.status(200).json({code: 200,
                                    msg: 'the AuditResults has been updated successfully',
                                    data: updatedAuditResults })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const deleteAuditResults = async(request, response) => {
    try{
        const {id} = request.params

        if(id && ObjectId.isValid(id)){
            const existId = await Audit.exists({_id: id})
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
        const deletedAudit = await Audit.findByIdAndDelete(id)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        response.status(201).json({code: 200,
                                    msg: 'the Audit has been deleted successfully',
                                    data: deletedAudit })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

/*
const getDataForTables2 = async(request, response) => {
    const {dealership_id, audit_id} = request.body
    try{
        if(!ObjectId.isValid(dealership_id)){
            return response.status(400).json(
                {errors: [{code: 400, 
                           msg: 'invalid dealership_id', 
                           detail: `${dealership_id} is not an ObjectId`}]})
        }
        const dealershipByID = await Dealership.findById(dealership_id)
        if(!dealershipByID)
            return response.status(400).json({code: 404, 
                                              msg: 'invalid dealership_id',
                                              detail: 'dealership_id not found'
                                            })
        let existAudit = null
        if(!ObjectId.isValid(audit_id)){
            return response.status(400).json(
                {errors: [{code: 400, 
                           msg: 'invalid audit_id', 
                           detail: `${audit_id} is not an ObjectId`}]})
        }
        else{
            existAudit = await Audit.findById(audit_id)
            if(!existAudit)
                return response.status(400).json(
                    {errors: [{code: 400, 
                            msg: 'invalid audit_id', 
                            detail: `${audit_id} not found`}]}) 
        }
        const auditsResults = await AuditResults.find({$and:[{installation_id: {$in: dealershipByID.installations}},{audit_id: audit_id}]})
                                                .populate({path: 'installation_id', select: '_id name code installation_type sales_weight_per_installation post_sale_weight_per_installation isSale isPostSale isHP', 
                                                           populate: {path: 'installation_type', select: '_id code'}})
                                                .populate({ path: 'criterions.criterion_id', 
                                                            populate: {
                                                                path: 'standard block area category auditResponsable criterionType installationType',
                                                                select: 'name code description isCore number abbreviation'
                                                            },
                                                        }) 
                                            
        auditsResults.forEach((element) => {
            const orderedCriterionsArray = element.criterions.sort(function (a, b) {
                if (a.criterion_id.standard._id.toString() > b.criterion_id.standard._id.toString()) {
                  return 1;
                }
                if (a.criterion_id.standard._id.toString() < b.criterion_id.standard._id.toString()) {
                  return -1;
                }
                return 0;
            })
            orderedCriterionsArray.forEach((criterion) => {
                if(criterion.criterion_id.standard.isCore && !criterion.pass){
                    orderedCriterionsArray.filter((el, index) => {
                       if(criterion.criterion_id.standard._id.toString() === el.criterion_id.standard._id.toString()){
                            orderedCriterionsArray[index].pass = false
                       }
                    })
                }
            })
        })

        let instalations_audit_details = []
        let instalation_audit_types = null

        const VENTA = "6233b3ace74b428c2dcf3068"
        const POSVENTA = "6233b450e74b428c2dcf3091"
        const HYUNDAI_PROMISE = "6233b445e74b428c2dcf3088"
        const GENERAL = "6233b39fe74b428c2dcf305f"

        auditsResults.forEach((element) => {
            let installationAuditData = {}
            installationAuditData['installation'] =  element.installation_id
            let actualCategoryID = ''
            let actualCategoryName = ''
            let accum = 0
            let totalAccum = 0
            let totalCriterionsByCat = 0
            let categories = []
            let totalCriterionsForInst = 0
            let categoriesAux = null

            let totalImgAudit = 0
            let totalPassImgAudit = 0
            let totalHmeAudit = 0
            let totalPassHmeAudit = 0
            let totalElectricAudit = 0
            let totalPassElectricAudit = 0
            
            let totalCritValid = 0
            let totalCriterionWeight = 0

            element.criterions.forEach((criterion, index) => {                
                let isValidType = false
                criterion.criterion_id.installationType.forEach((type) => {
                    if(type._id.toString() === element.installation_id.installation_type._id.toString()){
                        isValidType = true
                    }
                })
                if(criterion.criterion_id.category._id.toString() === VENTA && !element.installation_id.isSale ||
                   criterion.criterion_id.category._id.toString() === POSVENTA && !element.installation_id.isPostSale ||
                   criterion.criterion_id.category._id.toString() === HYUNDAI_PROMISE && !element.installation_id.isHP || 
                   !isValidType){
                }
                else{
                    totalCriterionWeight += criterion.criterion_id.value
                    totalCriterionsForInst += 1

                    if(criterion.criterion_id.isImgAudit){
                        totalImgAudit+= criterion.criterion_id.value
                        if(criterion.pass)
                            totalPassImgAudit+= criterion.criterion_id.value
                    }
                    else if(criterion.criterion_id.isHmeAudit){
                        totalHmeAudit+= criterion.criterion_id.value
                        if(criterion.pass)
                            totalPassHmeAudit+= criterion.criterion_id.value
                    }
                    else if(criterion.criterion_id.isElectricAudit){
                        totalElectricAudit+= criterion.criterion_id.value
                        if(criterion.pass)
                            totalPassElectricAudit+= criterion.criterion_id.value
                    }
                }
            })

            element.criterions.forEach((criterion, index) => {
                let isValidType = false
                criterion.criterion_id.installationType.forEach((type) => {
                    if(type._id.toString() === element.installation_id.installation_type._id.toString()){
                        isValidType = true
                    }
                })
                if(criterion.criterion_id.category._id.toString() === VENTA && !element.installation_id.isSale ||
                   criterion.criterion_id.category._id.toString() === POSVENTA && !element.installation_id.isPostSale ||
                   criterion.criterion_id.category._id.toString() === HYUNDAI_PROMISE && !element.installation_id.isHP || 
                   !isValidType){
                }
                else{
                    let multiplicator = 1

                    if(actualCategoryID === VENTA){
                        if(element.installation_id.sales_weight_per_installation !== null){
                            multiplicator = element.installation_id.sales_weight_per_installation/100
                        }
                        else{
                            multiplicator = 1
                        }
                    }
                    else if(actualCategoryID === POSVENTA){
                        if(element.installation_id.post_sale_weight_per_installation !== null){
                            multiplicator = element.installation_id.post_sale_weight_per_installation/100
                        }
                        else{
                            multiplicator = 1
                        }
                    }
                    else{
                        multiplicator = 1
                    }

                    totalCritValid += 1

                    if((criterion.criterion_id.category._id.toString() === actualCategoryID)){
                        totalCriterionsByCat += 1
                        if(criterion.pass){
                            accum += criterion.criterion_id.value
                        }
                        totalAccum += criterion.criterion_id.value
                        if(totalCritValid === totalCriterionsForInst){
                            const perc = ((accum * 100)/totalAccum) * multiplicator
                            const category = {
                                id: actualCategoryID.toString(),
                                name: actualCategoryName,
                                pass: accum,
                                total: totalAccum,
                                percentageByInstallation: (accum * 100)/totalAccum,
                                totalCriterionsByCat: totalCriterionsByCat,
                                percentage: perc,
                                partialPercentage: (accum * 100) / totalCriterionWeight
                            }
                            categories = [...categories, category]

                            let totalResult = 0
                            let newTotal = 0

                            if(categories.length>0){
                                categories.forEach((category) => {
                                    newTotal += category.partialPercentage
                                    totalResult += (category.pass * 100)/category.total
                                    const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                                    category["totalCriterionsPercByCat"] = percByCrit * category.percentage / 100
                                })
                            }
                            else if(totalCriterionsForInst>0){
                                totalResult = 1
                                const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
                                categoriesAux["totalCriterionsPercByCat"] = percByCrit * categoriesAux.percentage / 100
                                categories = [...categories, categoriesAux]
                            }
                            
                            auditTotalResult = newTotal //totalResult / categories.length
                            categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]

                            installationAuditData['categories'] = categories

                            instalation_audit_types = {
                                percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
                                percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
                                percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
                            }

                            installationAuditData['instalation_audit_types'] =  instalation_audit_types

                            instalations_audit_details = [...instalations_audit_details, installationAuditData]
                        }
                    }
                    else{
                        if(totalCritValid !== 1 || totalCriterionsForInst === 1){
                            const perc = ((accum * 100)/totalAccum) * multiplicator
                            const category = {
                                id: actualCategoryID.length>0? actualCategoryID: criterion.criterion_id.category._id.toString(),
                                name: actualCategoryName.length>0? actualCategoryName: criterion.criterion_id.category.name,
                                pass: accum,
                                total: totalAccum,
                                percentageByInstallation: (accum * 100)/totalAccum,
                                totalCriterionsByCat: totalCriterionsByCat,
                                percentage: perc,
                                partialPercentage: (accum * 100) / totalCriterionWeight
                            }
                            categories = [...categories, category]
                        }
                        totalCriterionsByCat = 1
                        totalAccum = criterion.criterion_id.value
                        if(criterion.pass){
                            accum = criterion.criterion_id.value
                        }
                        else{
                            accum = 0
                        }
                        actualCategoryID = criterion.criterion_id.category._id.toString()
                        actualCategoryName = criterion.criterion_id.category.name
                        if(totalCritValid === totalCriterionsForInst){

                            let totalResult = 0
                            let newTotal = 0
                            if(categories.length>0){
                                categories.forEach((category) => {
                                    newTotal += category.partialPercentage
                                    totalResult += (category.pass * 100)/category.total
                                    const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                                    category["totalCriterionsPercByCat"] = percByCrit * category.percentage / 100
                                })
                            }
                            else if(totalCriterionsForInst>0){
                                totalResult = 1
                                const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
                                categoriesAux["totalCriterionsPercByCat"] = percByCrit * categoriesAux.percentage / 100
                                categories = [...categories, categoriesAux]
                            }

                            auditTotalResult = newTotal //totalResult / categories.length
                            categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]

                            installationAuditData['categories'] = categories

                            instalation_audit_types = {
                                percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
                                percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
                                percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
                            }

                            installationAuditData['instalation_audit_types'] =  instalation_audit_types

                            instalations_audit_details = [...instalations_audit_details, installationAuditData]
                        }
                    }
                }      
            })
        })

        let accumAgency = 0

        let hp_perc = 0
        let general_perc = 0
        let v_perc = 0
        let pv_perc = 0
        let hp_perc_total = 0
        let general_perc_total = 0
        let v_perc_total = 0
        let pv_perc_total = 0
        
        let electric_total = 0
        let electric_perc = 0
        let img_total = 0
        let img_perc = 0
        let hme_total = 0
        let hme_perc = 0

        let total_values = 0

        instalations_audit_details.forEach((installation) => {

            if(installation && installation.categories){
                accumAgency += installation.categories[installation.categories.length - 1].auditTotalResult
                installation.categories.forEach((category) => {
                    if(category.id === HYUNDAI_PROMISE){
                        hp_perc_total += 1
                        hp_perc += category.pass
                        total_values += category.total
                    }
                    else if(category.id === GENERAL){
                        general_perc_total += 1
                        general_perc += category.pass
                        total_values += category.total
                    }
                    else if(category.id === VENTA){
                        v_perc += category.pass * (installation.installation.sales_weight_per_installation/100)
                        v_perc_total += 1
                        total_values += category.total * (installation.installation.sales_weight_per_installation/100)
                    }
                    else if(category.id === POSVENTA){
                        pv_perc += category.pass * (installation.installation.post_sale_weight_per_installation/100)
                        pv_perc_total += 1
                        total_values += category.total * (installation.installation.post_sale_weight_per_installation/100)
                    }
                })
            }

            if(installation && installation.instalation_audit_types){
                if(installation.instalation_audit_types.percImgAudit !== null){
                    img_perc+= installation.instalation_audit_types.percImgAudit
                    img_total+= 1
                }
                if(installation.instalation_audit_types.percElectricAudit !== null){
                    electric_perc+= installation.instalation_audit_types.percElectricAudit
                    electric_total+= 1
                }
                if(installation.instalation_audit_types.percHmeAudit !== null){
                    hme_perc+= installation.instalation_audit_types.percHmeAudit
                    hme_total+= 1
                }
            }
        })

        let agency_by_types = {
            electric_perc: (electric_total === 0)? null: electric_perc / electric_total,
            img_perc: (img_total === 0)? null: img_perc / img_total,
            hme_perc: (hme_total === 0)? null: hme_perc / hme_total,

            hp_perc: (hp_perc_total === 0)? null: hp_perc * 100 / total_values,
            v_perc: (v_perc_total === 0)? null: v_perc * 100 / total_values,
            general_perc: (general_perc_total === 0)? null: general_perc * 100 / total_values,
            pv_perc: (pv_perc_total === 0)? null: pv_perc * 100 / total_values
        }

        const total_agency = (agency_by_types.hp_perc !== null? agency_by_types.hp_perc: 0) + (agency_by_types.v_perc !== null? agency_by_types.v_perc: 0) + (agency_by_types.general_perc !== null? agency_by_types.general_perc: 0) + (agency_by_types.pv_perc !== null? agency_by_types.pv_perc: 0) 

        agency_by_types['total_agency'] = total_agency

        agency_audit_details = accumAgency / instalations_audit_details.length

        let data = {
            audit_name: existAudit.name,
            dealership_details: dealershipByID,
            audit_criterions_details: auditsResults,
            instalations_audit_details: instalations_audit_details,
            agency_audit_details: agency_audit_details,
            agency_by_types: agency_by_types
        }

        return response.status(200).json({data: data})
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}
*/

const getDataForTables = async(request, response) => {
    const {dealership_id, audit_id} = request.body
    try{
        if(!ObjectId.isValid(dealership_id)){
            return response.status(400).json(
                {errors: [{code: 400, 
                           msg: 'invalid dealership_id', 
                           detail: `${dealership_id} is not an ObjectId`}]})
        }
        const dealershipByID = await Dealership.findById(dealership_id)
        if(!dealershipByID)
            return response.status(400).json({code: 404, 
                                              msg: 'invalid dealership_id',
                                              detail: 'dealership_id not found'
                                            })
        let existAudit = null
        if(!ObjectId.isValid(audit_id)){
            return response.status(400).json(
                {errors: [{code: 400, 
                           msg: 'invalid audit_id', 
                           detail: `${audit_id} is not an ObjectId`}]})
        }
        else{
            existAudit = await Audit.findById(audit_id)
            if(!existAudit)
                return response.status(400).json(
                    {errors: [{code: 400, 
                            msg: 'invalid audit_id', 
                            detail: `${audit_id} not found`}]}) 
        }

        let auditsResults = await AuditResults.find({$and:[{installation_id: {$in: dealershipByID.installations}},{audit_id: audit_id}]})
                                                .populate({path: 'installation_id', select: '_id name code installation_type sales_weight_per_installation post_sale_weight_per_installation isSale isPostSale isHP', 
                                                           populate: {path: 'installation_type', select: '_id code'}})
                                                .populate({ path: 'criterions.criterion_id', 
                                                            populate: {
                                                                path: 'standard block area category auditResponsable criterionType installationType',
                                                                select: 'name code description isCore number abbreviation'
                                                            },
                                                        }) 
                                     
        const auditsResultsAux = auditsResults        
        let arrayStandardsFalse = []
        let arrayAreasFalse = []

        auditsResultsAux.forEach((element, indexEl) => {
            element.criterions.forEach((criterion, index) => {
                if(!criterion.pass){
                    const existStandard = arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
                    if(!existStandard){
                        arrayStandardsFalse = [...arrayStandardsFalse, criterion.criterion_id.standard._id.toString()]
                    }
                    if(criterion.criterion_id.standard.isCore){
                        const existArea = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
                        if(!existArea){
                            arrayAreasFalse = [...arrayAreasFalse, criterion.criterion_id.area._id.toString()]
                        }
                    }
                }
            })
        })

        auditsResultsAux.forEach((element, indexEl) => {
            element.criterions.forEach((criterion, index) => {
                const existSt = arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
                const existAr = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
                if(existAr || existSt){
                    auditsResultsAux[indexEl].criterions[index].pass = false
                }
            })
        })

        let instalations_audit_details = []
        let instalation_audit_types = null

        const VENTA = "6233b3ace74b428c2dcf3068"
        const POSVENTA = "6233b450e74b428c2dcf3091"
        const HYUNDAI_PROMISE = "6233b445e74b428c2dcf3088"
        const GENERAL = "6233b39fe74b428c2dcf305f"

        let totalWeightPerc = 0

        auditsResults.forEach((element) => {
            element.criterions.sort(function (a, b) {
                    if (a.criterion_id.standard._id.toString() > b.criterion_id.standard._id.toString()) {
                      return 1;
                    }
                    if (a.criterion_id.standard._id.toString() < b.criterion_id.standard._id.toString()) {
                      return -1;
                    }
                    return 0;
            })
        })

        auditsResults.forEach((element) => {
            let installationAuditData = {}
            installationAuditData['installation'] =  element.installation_id
            let actualCategoryID = ''
            let actualCategoryName = ''
            let accum = 0
            let totalAccum = 0
            let totalCriterionsByCat = 0
            let categories = []
            let totalCriterionsForInst = 0
            let categoriesAux = null

            let totalImgAudit = 0
            let totalPassImgAudit = 0
            let totalHmeAudit = 0
            let totalPassHmeAudit = 0
            let totalElectricAudit = 0
            let totalPassElectricAudit = 0
            
            let totalCritValid = 0
            let totalCriterionWeight = 0

            const sales_weight_per_installation= (element.installation_id.sales_weight_per_installation !== null)? element.installation_id.sales_weight_per_installation : 0
            const post_sale_weight_per_installation= (element.installation_id.post_sale_weight_per_installation !== null)? element.installation_id.post_sale_weight_per_installation : 0

            totalWeightPerc +=  sales_weight_per_installation + post_sale_weight_per_installation

            element.criterions.forEach((criterion, index) => {     
                let isValidType = false
                criterion.criterion_id.installationType.forEach((type) => {
                    if(type._id.toString() === element.installation_id.installation_type._id.toString()){
                        isValidType = true
                    }
                })
                if(criterion.criterion_id.category._id.toString() === VENTA && !element.installation_id.isSale ||
                   criterion.criterion_id.category._id.toString() === POSVENTA && !element.installation_id.isPostSale ||
                   criterion.criterion_id.category._id.toString() === HYUNDAI_PROMISE && !element.installation_id.isHP || 
                   !isValidType){
                }
                else{ 
                    totalCriterionWeight += criterion.criterion_id.value
                    totalCriterionsForInst += 1

                    if(criterion.criterion_id.isImgAudit){
                        totalImgAudit+= criterion.criterion_id.value
                        if(criterion.pass)
                            totalPassImgAudit+= criterion.criterion_id.value
                    }
                    else if(criterion.criterion_id.isHmeAudit){
                        totalHmeAudit+= criterion.criterion_id.value
                        if(criterion.pass)
                            totalPassHmeAudit+= criterion.criterion_id.value
                    }
                    else if(criterion.criterion_id.isElectricAudit){
                        totalElectricAudit+= criterion.criterion_id.value
                        if(criterion.pass)
                            totalPassElectricAudit+= criterion.criterion_id.value
                    }
                }
            })

            element.criterions.forEach((criterion, index) => {
                let isValidType = false
                criterion.criterion_id.installationType.forEach((type) => {
                    if(type._id.toString() === element.installation_id.installation_type._id.toString()){
                        isValidType = true
                    }
                })
                if(criterion.criterion_id.category._id.toString() === VENTA && !element.installation_id.isSale ||
                   criterion.criterion_id.category._id.toString() === POSVENTA && !element.installation_id.isPostSale ||
                   criterion.criterion_id.category._id.toString() === HYUNDAI_PROMISE && !element.installation_id.isHP || 
                   !isValidType){
                }
                else{
                    let multiplicator = 1

                    if(actualCategoryID === VENTA){
                        if(element.installation_id.sales_weight_per_installation !== null){
                            multiplicator = element.installation_id.sales_weight_per_installation/100
                        }
                        else{
                            multiplicator = 1
                        }
                    }
                    else if(actualCategoryID === POSVENTA){
                        if(element.installation_id.post_sale_weight_per_installation !== null){
                            multiplicator = element.installation_id.post_sale_weight_per_installation/100
                        }
                        else{
                            multiplicator = 1
                        }
                    }
                    else{
                        multiplicator = 1
                    }

                    totalCritValid += 1

                    if((criterion.criterion_id.category._id.toString() === actualCategoryID)){
                        totalCriterionsByCat += 1
                        if(criterion.pass){
                            accum += criterion.criterion_id.value
                        }
                        totalAccum += criterion.criterion_id.value
                        if(totalCritValid === totalCriterionsForInst){
                            const perc = ((accum * 100)/totalAccum) * multiplicator
                            const category = {
                                id: actualCategoryID.toString(),
                                name: actualCategoryName,
                                pass: accum,
                                total: totalAccum,
                                percentageByInstallation: (accum * 100)/totalAccum,
                                totalCriterionsByCat: totalCriterionsByCat,
                                percentage: perc,
                                partialPercentage: (accum * 100) / totalCriterionWeight
                            }
                            categories = [...categories, category]

                            let totalResult = 0
                            let newTotal = 0

                            if(categories.length>0){
                                categories.forEach((category) => {
                                    newTotal += category.partialPercentage
                                    totalResult += (category.pass * 100)/category.total
                                    const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                                    category["totalCriterionsPercByCat"] = percByCrit * category.percentage / 100
                                })
                            }
                            else if(totalCriterionsForInst>0){
                                totalResult = 1
                                const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
                                categoriesAux["totalCriterionsPercByCat"] = percByCrit * categoriesAux.percentage / 100
                                categories = [...categories, categoriesAux]
                            }
                            
                            auditTotalResult = newTotal //totalResult / categories.length
                            categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]

                            installationAuditData['categories'] = categories

                            instalation_audit_types = {
                                percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
                                percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
                                percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
                            }

                            installationAuditData['instalation_audit_types'] =  instalation_audit_types

                            instalations_audit_details = [...instalations_audit_details, installationAuditData]
                        }
                    }
                    else{
                        if(totalCritValid !== 1 || totalCriterionsForInst === 1){
                            const perc = ((accum * 100)/totalAccum) * multiplicator
                            const category = {
                                id: actualCategoryID.length>0? actualCategoryID: criterion.criterion_id.category._id.toString(),
                                name: actualCategoryName.length>0? actualCategoryName: criterion.criterion_id.category.name,
                                pass: accum,
                                total: totalAccum,
                                percentageByInstallation: (accum * 100)/totalAccum,
                                totalCriterionsByCat: totalCriterionsByCat,
                                percentage: perc,
                                partialPercentage: (accum * 100) / totalCriterionWeight
                            }
                            categories = [...categories, category]
                        }
                        totalCriterionsByCat = 1
                        totalAccum = criterion.criterion_id.value
                        if(criterion.pass){
                            accum = criterion.criterion_id.value
                        }
                        else{
                            accum = 0
                        }
                        actualCategoryID = criterion.criterion_id.category._id.toString()
                        actualCategoryName = criterion.criterion_id.category.name
                        if(totalCritValid === totalCriterionsForInst){

                            let totalResult = 0
                            let newTotal = 0
                            if(categories.length>0){
                                categories.forEach((category) => {
                                    newTotal += category.partialPercentage
                                    totalResult += (category.pass * 100)/category.total
                                    const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                                    category["totalCriterionsPercByCat"] = percByCrit * category.percentage / 100
                                })
                            }
                            else if(totalCriterionsForInst>0){
                                totalResult = 1
                                const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
                                categoriesAux["totalCriterionsPercByCat"] = percByCrit * categoriesAux.percentage / 100
                                categories = [...categories, categoriesAux]
                            }

                            auditTotalResult = newTotal //totalResult / categories.length
                            categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]

                            installationAuditData['categories'] = categories

                            instalation_audit_types = {
                                percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
                                percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
                                percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
                            }

                            installationAuditData['instalation_audit_types'] =  instalation_audit_types

                            instalations_audit_details = [...instalations_audit_details, installationAuditData]
                        }
                    }
                }      
            })
        })

        let accumAgency = 0

        let hp_perc = 0
        let general_perc = 0
        let v_perc = 0
        let pv_perc = 0
        let hp_perc_total = 0
        let general_perc_total = 0
        let v_perc_total = 0
        let pv_perc_total = 0
        
        let electric_total = 0
        let electric_perc = 0
        let img_total = 0
        let img_perc = 0
        let hme_total = 0
        let hme_perc = 0

        let total_values = 0

        instalations_audit_details.forEach((installation) => {
            if(installation && installation.categories){

                const sales_weight_per_installation= (installation.installation.sales_weight_per_installation !== null)? installation.installation.sales_weight_per_installation : 0
                const post_sale_weight_per_installation= (installation.installation.post_sale_weight_per_installation !== null)? installation.installation.post_sale_weight_per_installation : 0

                let accumTotalWeightPerc = sales_weight_per_installation + post_sale_weight_per_installation

                const coefficient = ((accumTotalWeightPerc * 100) / totalWeightPerc)/100

                accumAgency += installation.categories[installation.categories.length - 1].auditTotalResult
                installation.categories.forEach((category) => {
                    if(category.id === HYUNDAI_PROMISE){
                        hp_perc_total += 1
                        hp_perc += category.pass * coefficient
                        total_values += category.total * coefficient
                    }
                    else if(category.id === GENERAL){
                        general_perc_total += 1
                        general_perc += category.pass * coefficient
                        total_values += category.total * coefficient
                    }
                    else if(category.id === VENTA){
                        v_perc += category.pass * coefficient
                        v_perc_total += 1
                        total_values += category.total * coefficient
                    }
                    else if(category.id === POSVENTA){
                        pv_perc += category.pass * coefficient
                        pv_perc_total += 1
                        total_values += category.total * coefficient
                    }
                })
            }

            if(installation && installation.instalation_audit_types){
                if(installation.instalation_audit_types.percImgAudit !== null){
                    img_perc+= installation.instalation_audit_types.percImgAudit
                    img_total+= 1
                }
                if(installation.instalation_audit_types.percElectricAudit !== null){
                    electric_perc+= installation.instalation_audit_types.percElectricAudit
                    electric_total+= 1
                }
                if(installation.instalation_audit_types.percHmeAudit !== null){
                    hme_perc+= installation.instalation_audit_types.percHmeAudit
                    hme_total+= 1
                }
            }
        })

        let agency_by_types = {
            electric_perc: (electric_total === 0)? null: electric_perc / electric_total,
            img_perc: (img_total === 0)? null: img_perc / img_total,
            hme_perc: (hme_total === 0)? null: hme_perc / hme_total,

            hp_perc: (hp_perc_total === 0)? null: hp_perc * 100 / total_values,
            v_perc: (v_perc_total === 0)? null: v_perc * 100 / total_values,
            general_perc: (general_perc_total === 0)? null: general_perc * 100 / total_values,
            pv_perc: (pv_perc_total === 0)? null: pv_perc * 100 / total_values
        }

        const total_agency = (agency_by_types.hp_perc !== null? agency_by_types.hp_perc: 0) + (agency_by_types.v_perc !== null? agency_by_types.v_perc: 0) + (agency_by_types.general_perc !== null? agency_by_types.general_perc: 0) + (agency_by_types.pv_perc !== null? agency_by_types.pv_perc: 0) 

        agency_by_types['total_agency'] = total_agency

        agency_audit_details = accumAgency / instalations_audit_details.length

        let data = {
            audit_name: existAudit.name,
            dealership_details: dealershipByID,
            audit_criterions_details: auditsResults,
            instalations_audit_details: instalations_audit_details,
            agency_audit_details: agency_audit_details,
            agency_by_types: agency_by_types
        }

        return response.status(200).json({data: data})
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getDataForAudit = async(request, response) => {
    let {audit_id} = request.params
    let auditsResults = null

    try{
        let existAudit = null

        if(audit_id === "last"){
            const audit = await Audit.findOne().sort({$natural:-1}).limit(1)
            if(audit){
                audit_id = audit._id
            }
            else{
                return response.status(404).json({errors: [{code: 404, msg: 'not found', detail: "No audits in ddbb"}]})
            }
        }
        if(!ObjectId.isValid(audit_id)){
            return response.status(400).json(
                {errors: [{code: 400, 
                        msg: 'invalid audit_id', 
                        detail: `${audit_id} is not an ObjectId`}]})
        }
        else{
            existAudit = await Audit.findById(audit_id)
            if(!existAudit)
                return response.status(400).json(
                    {errors: [{code: 400, 
                            msg: 'invalid audit_id', 
                            detail: `${audit_id} not found`}]}) 
        }

        auditsResults = await AuditResults.find({audit_id: audit_id})
                                                .populate({path: 'installation_id', select: '_id name installation_type', 
                                                                                                populate: {path: 'installation_type', select: '_id code'}})
                                                .populate({ path: 'criterions.criterion_id', 
                                                    populate: {
                                                        path: 'standard category criterionType installationType',
                                                        select: 'name code description isCore'
                                                    },
                                                }) 

        const AOH = "6226310514861f56d3c64266"

        const auditsResultsAux = auditsResults        
        let arrayStandardsFalse = []
        let arrayAreasFalse = []

        auditsResultsAux.forEach((element, indexEl) => {
            element.criterions.forEach((criterion, index) => {
                if(!criterion.pass){
                    const existStandard = arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
                    if(!existStandard){
                        arrayStandardsFalse = [...arrayStandardsFalse, criterion.criterion_id.standard._id.toString()]
                    }
                    if(criterion.criterion_id.standard.isCore){
                        const existArea = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
                        if(!existArea){
                            arrayAreasFalse = [...arrayAreasFalse, criterion.criterion_id.area._id.toString()]
                        }
                    }
                }
            })
        })

        auditsResultsAux.forEach((element, indexEl) => {
            element.criterions.forEach((criterion, index) => {
                if(!criterion.pass){
                    const existStandard = arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
                    if(!existStandard){
                        arrayStandardsFalse = [...arrayStandardsFalse, criterion.criterion_id.standard._id.toString()]
                    }
                    if(criterion.criterion_id.standard.isCore){
                        const existArea = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
                        if(!existArea){
                            arrayAreasFalse = [...arrayAreasFalse, criterion.criterion_id.area._id.toString()]
                        }
                    }
                }
            })
        })

        auditsResultsAux.forEach((element, indexEl) => {
            element.criterions.forEach((criterion, index) => {
                const existSt = arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
                const existAr = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
                if(existAr || existSt){
                    auditsResultsAux[indexEl].criterions[index].pass = false
                }
            })
        })

        let hmesValuesPass = 0
        let hmesTotalValue = 0
        let imgValuesPass = 0
        let imgTotalValue = 0
        let electricValuesPass = 0
        let electricTotalValue = 0

        let hmesValuesPassDeal = 0
        let hmesTotalValueDeal = 0
        let imgValuesPassDeal = 0
        let imgTotalValueDeal = 0
        let electricValuesPassDeal = 0
        let electricTotalValueDeal = 0

        let instalations_detail = []
        let totalValueDeal_for_installation = 0
        let totalValuesPassDeal_for_installation = 0

        auditsResults.forEach((element) => {
            let isValidType = false
            element.criterions.forEach((criterion, index) => {
                criterion.criterion_id.installationType.forEach((type) => {
                    if(type._id.toString() === element.installation_id.installation_type._id.toString())
                        isValidType = true
                })
                if(isValidType){    
                    if(element.installation_id.installation_type._id.toString() === AOH){
                        if(criterion.criterion_id.isHmeAudit){
                            hmesTotalValueDeal+= criterion.criterion_id.value
                            totalValueDeal_for_installation+= criterion.criterion_id.value
                            if(criterion.pass){
                                hmesValuesPassDeal+= criterion.criterion_id.value
                                totalValuesPassDeal_for_installation+= criterion.criterion_id.value
                            }
                        }
                        if(criterion.criterion_id.isImgAudit){
                            imgTotalValueDeal+= criterion.criterion_id.value
                            totalValueDeal_for_installation+= criterion.criterion_id.value
                            if(criterion.pass){
                                imgValuesPassDeal+= criterion.criterion_id.value
                                totalValuesPassDeal_for_installation+= criterion.criterion_id.value
                            }
                        }
                        if(criterion.criterion_id.isElectricAudit){
                            electricTotalValueDeal+= criterion.criterion_id.value
                            totalValueDeal_for_installation+= criterion.criterion_id.value
                            if(criterion.pass){
                                electricValuesPassDeal+= criterion.criterion_id.value
                                totalValuesPassDeal_for_installation+= criterion.criterion_id.value
                            }
                        }
                    }
                    else{
                        if(criterion.criterion_id.isHmeAudit){
                            hmesTotalValue+= criterion.criterion_id.value
                            totalValueDeal_for_installation+= criterion.criterion_id.value
                            if(criterion.pass){
                                hmesValuesPass+= criterion.criterion_id.value
                                totalValuesPassDeal_for_installation+= criterion.criterion_id.value
                            }
                        }
                        if(criterion.criterion_id.isImgAudit){
                            imgTotalValue+= criterion.criterion_id.value
                            totalValueDeal_for_installation+= criterion.criterion_id.value
                            if(criterion.pass){
                                imgValuesPass+= criterion.criterion_id.value
                                totalValuesPassDeal_for_installation+= criterion.criterion_id.value
                            }
                        }
                        if(criterion.criterion_id.isElectricAudit){
                            electricTotalValue+= criterion.criterion_id.value
                            totalValueDeal_for_installation+= criterion.criterion_id.value
                            if(criterion.pass){
                                electricValuesPass+= criterion.criterion_id.value
                                totalValuesPassDeal_for_installation+= criterion.criterion_id.value
                            }
                        }
                    }
                }
            })
            instalations_detail = [...instalations_detail, 
                                    {installation_name: element.installation_id.name, 
                                     installation_id: element.installation_id._id,
                                     perc: (totalValuesPassDeal_for_installation * 100) / totalValueDeal_for_installation
                                    }]
            totalValueDeal_for_installation = 0
            totalValuesPassDeal_for_installation = 0
        })

        const hmes_dealership = hmesTotalValueDeal!==0? (hmesValuesPassDeal * 100)/hmesTotalValueDeal : null
        const img_dealership = imgTotalValueDeal!==0? (imgValuesPassDeal * 100)/imgTotalValueDeal : null
        const electric_dealership = electricTotalValueDeal!==0? (electricValuesPassDeal * 100)/electricTotalValueDeal : null
        const hmes_inst = hmesTotalValue!==0? (hmesValuesPass * 100)/hmesTotalValue : null
        const img_inst = imgTotalValue!==0? (imgValuesPass * 100)/imgTotalValue : null
        const electric_inst = electricTotalValue!==0? (electricValuesPass * 100)/electricTotalValue : null

        let dealerTotal = 0
        let instTotal = 0
        
        if(hmes_dealership!==null)
            dealerTotal+= 1
        if(img_dealership!==null)
            dealerTotal+= 1
        if(electric_dealership!==null)
            dealerTotal+= 1
        if(hmes_inst!==null)
            instTotal+= 1
        if(img_inst!==null)
            instTotal+= 1
        if(electric_inst!==null)
            instTotal+= 1

        const data = {
            hmes_dealership: hmes_dealership,
            img_dealership: img_dealership,
            electric_dealership: electric_dealership,
            hmes_inst: hmes_inst,
            img_inst: img_inst,
            electric_inst: electric_inst,
            total_dealership: (hmes_dealership + img_dealership + electric_dealership)/dealerTotal,
            total_inst: (hmes_inst + img_inst + electric_inst)/instTotal,
            total: (((hmes_dealership + img_dealership + electric_dealership)/dealerTotal) + ( (hmes_inst + img_inst + electric_inst)/instTotal))/2,
            instalations_detail: instalations_detail
        }

        return response.status(200).json({data: data})
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getDataForFullAudit = async(request, response) => {
    const {audit_id} = request.params
    let auditsResults = null
    let arrayDealershipsAudit = []
    try{
        let existAudit = null

        if(!ObjectId.isValid(audit_id)){
            return response.status(400).json(
                {errors: [{code: 400, 
                        msg: 'invalid audit_id', 
                        detail: `${audit_id} is not an ObjectId`}]})
        }
        else{
            existAudit = await Audit.findById(audit_id)
            if(!existAudit)
                return response.status(400).json(
                    {errors: [{code: 400, 
                            msg: 'invalid audit_id', 
                            detail: `${audit_id} not found`}]}) 
        }

        auditsResults = await AuditResults.find({audit_id: audit_id})
                                                .populate({path: 'installation_id', select: 'dealership'})

        let arrayOfDealerships = []

        auditsResults.forEach((element) => {
            if(!arrayOfDealerships.includes(element.installation_id.dealership.toString())){
                arrayOfDealerships = [...arrayOfDealerships, element.installation_id.dealership.toString()]
            }
        })

        let compliance_audit = 0

        for(let i = 0; i < arrayOfDealerships.length; i++){
            const dealership = arrayOfDealerships[i]

            const dealershipByID = await Dealership.findById(dealership)
            let auditsResults = await AuditResults.find({$and:[{installation_id: {$in: dealershipByID.installations}},{audit_id: audit_id}]})
                                                    .populate({path: 'installation_id', select: '_id name code installation_type sales_weight_per_installation post_sale_weight_per_installation isSale isPostSale isHP', 
                                                                populate: {path: 'installation_type', select: '_id code'}})
                                                    .populate({ path: 'criterions.criterion_id', 
                                                                populate: {
                                                                    path: 'standard block area category auditResponsable criterionType installationType',
                                                                    select: 'name code description isCore number abbreviation'
                                                                },
                                                            }) 
                                                            
            const auditsResultsAux = auditsResults                                            
            let arrayStandardsFalse = []
            let arrayAreasFalse = []
    
            auditsResultsAux.forEach((element, indexEl) => {
                element.criterions.forEach((criterion, index) => {
                    if(!criterion.pass){
                        const existStandard = arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
                        if(!existStandard){
                            arrayStandardsFalse = [...arrayStandardsFalse, criterion.criterion_id.standard._id.toString()]
                        }
                        if(criterion.criterion_id.standard.isCore){
                            const existArea = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
                            if(!existArea){
                                arrayAreasFalse = [...arrayAreasFalse, criterion.criterion_id.area._id.toString()]
                            }
                        }
                    }
                })
            })
            
            auditsResultsAux.forEach((element, indexEl) => {
                element.criterions.forEach((criterion, index) => {
                    if(!criterion.pass){
                        const existStandard = arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
                        if(!existStandard){
                            arrayStandardsFalse = [...arrayStandardsFalse, criterion.criterion_id.standard._id.toString()]
                        }
                        if(criterion.criterion_id.standard.isCore){
                            const existArea = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
                            if(!existArea){
                                arrayAreasFalse = [...arrayAreasFalse, criterion.criterion_id.area._id.toString()]
                            }
                        }
                    }
                })
            })
    
            auditsResultsAux.forEach((element, indexEl) => {
                element.criterions.forEach((criterion, index) => {
                    const existSt = arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
                    const existAr = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
                    if(existAr || existSt){
                        auditsResults[indexEl].criterions[index].pass = false
                    }
                })
            })
    
            let instalations_audit_details = []
            let instalation_audit_types = null
    
            const VENTA = "6233b3ace74b428c2dcf3068"
            const POSVENTA = "6233b450e74b428c2dcf3091"
            const HYUNDAI_PROMISE = "6233b445e74b428c2dcf3088"
            const GENERAL = "6233b39fe74b428c2dcf305f"

            let totalWeightPerc = 0

            auditsResults.forEach((element) => {
                let installationAuditData = {}
                installationAuditData['installation'] =  element.installation_id
                let actualCategoryID = ''
                let actualCategoryName = ''
                let accum = 0
                let totalAccum = 0
                let totalCriterionsByCat = 0
                let categories = []
                let totalCriterionsForInst = 0
                let categoriesAux = null
    
                let totalImgAudit = 0
                let totalPassImgAudit = 0
                let totalHmeAudit = 0
                let totalPassHmeAudit = 0
                let totalElectricAudit = 0
                let totalPassElectricAudit = 0
                
                let totalCritValid = 0

                const sales_weight_per_installation= (element.installation_id.sales_weight_per_installation !== null)? element.installation_id.sales_weight_per_installation : 0
                const post_sale_weight_per_installation= (element.installation_id.post_sale_weight_per_installation !== null)? element.installation_id.post_sale_weight_per_installation : 0
    
                totalWeightPerc +=  sales_weight_per_installation + post_sale_weight_per_installation

                element.criterions.forEach((criterion, index) => {                
                    let isValidType = false
                    criterion.criterion_id.installationType.forEach((type) => {
                        if(type._id.toString() === element.installation_id.installation_type._id.toString()){
                            isValidType = true
                        }
                    })
                    if(criterion.criterion_id.category._id.toString() === VENTA && !element.installation_id.isSale ||
                        criterion.criterion_id.category._id.toString() === POSVENTA && !element.installation_id.isPostSale ||
                        criterion.criterion_id.category._id.toString() === HYUNDAI_PROMISE && !element.installation_id.isHP || 
                        !isValidType){
                    }
                    else{
                        totalCriterionsForInst += 1
                        if(criterion.criterion_id.isImgAudit){
                            totalImgAudit+= criterion.criterion_id.value
                            if(criterion.pass)
                                totalPassImgAudit+= criterion.criterion_id.value
                        }
                        else if(criterion.criterion_id.isHmeAudit){
                            totalHmeAudit+= criterion.criterion_id.value
                            if(criterion.pass)
                                totalPassHmeAudit+= criterion.criterion_id.value
                        }
                        else if(criterion.criterion_id.isElectricAudit){
                            totalElectricAudit+= criterion.criterion_id.value
                            if(criterion.pass)
                                totalPassElectricAudit+= criterion.criterion_id.value
                        }
                    }
                })
    
                element.criterions.forEach((criterion, index) => {
                    let isValidType = false
                    criterion.criterion_id.installationType.forEach((type) => {
                        if(type._id.toString() === element.installation_id.installation_type._id.toString()){
                            isValidType = true
                        }
                    })
                    if(criterion.criterion_id.category._id.toString() === VENTA && !element.installation_id.isSale ||
                        criterion.criterion_id.category._id.toString() === POSVENTA && !element.installation_id.isPostSale ||
                        criterion.criterion_id.category._id.toString() === HYUNDAI_PROMISE && !element.installation_id.isHP || 
                        !isValidType){
                    }
                    else{
                        let multiplicator = 1
    
                        if(actualCategoryID === VENTA){
                            if(element.installation_id.sales_weight_per_installation !== null){
                                multiplicator = element.installation_id.sales_weight_per_installation/100
                            }
                            else{
                                multiplicator = 1
                            }
                        }
                        else if(actualCategoryID === POSVENTA){
                            if(element.installation_id.post_sale_weight_per_installation !== null){
                                multiplicator = element.installation_id.post_sale_weight_per_installation/100
                            }
                            else{
                                multiplicator = 1
                            }
                        }
                        else{
                            multiplicator = 1
                        }
    
                        totalCritValid += 1
    
                        if((criterion.criterion_id.category._id.toString() === actualCategoryID)){
                            totalCriterionsByCat += 1
                            if(criterion.pass){
                                accum += criterion.criterion_id.value
                            }
                            totalAccum += criterion.criterion_id.value
                            if(totalCritValid === totalCriterionsForInst){
                                const perc = ((accum * 100)/totalAccum) * multiplicator
                                const category = {
                                    id: actualCategoryID.toString(),
                                    name: actualCategoryName,
                                    pass: accum,
                                    total: totalAccum,
                                    percentageByInstallation: (accum * 100)/totalAccum,
                                    totalCriterionsByCat: totalCriterionsByCat,
                                    percentage: perc,
                                }
                                categories = [...categories, category]
    
                                let totalResult = 0
                                if(categories.length>0){
                                    categories.forEach((category) => {
                                        totalResult += (category.pass * 100)/category.total
                                        const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                                        category["totalCriterionsPercByCat"] = percByCrit * category.percentage / 100
                                    })
                                }
                                else if(totalCriterionsForInst>0){
                                    totalResult = 1
                                    const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
                                    categoriesAux["totalCriterionsPercByCat"] = percByCrit * categoriesAux.percentage / 100
                                    categories = [...categories, categoriesAux]
                                }
                                
                                auditTotalResult = totalResult / categories.length
                                categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]
    
                                installationAuditData['categories'] = categories
    
                                instalation_audit_types = {
                                    percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
                                    percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
                                    percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
                                }
    
                                installationAuditData['instalation_audit_types'] =  instalation_audit_types
    
                                instalations_audit_details = [...instalations_audit_details, installationAuditData]
                            }
                        }
                        else{
                            if(totalCritValid !== 1 || totalCriterionsForInst === 1){
                                const perc = ((accum * 100)/totalAccum) * multiplicator
                                const category = {
                                    id: actualCategoryID.length>0? actualCategoryID: criterion.criterion_id.category._id.toString(),
                                    name: actualCategoryName.length>0? actualCategoryName: criterion.criterion_id.category.name,
                                    pass: accum,
                                    total: totalAccum,
                                    percentageByInstallation: (accum * 100)/totalAccum,
                                    totalCriterionsByCat: totalCriterionsByCat,
                                    percentage: perc,
                                }
                                categories = [...categories, category]
                            }
                            totalCriterionsByCat = 1
                            totalAccum = criterion.criterion_id.value
                            if(criterion.pass){
                                accum = criterion.criterion_id.value
                            }
                            else{
                                accum = 0
                            }
                            actualCategoryID = criterion.criterion_id.category._id.toString()
                            actualCategoryName = criterion.criterion_id.category.name
                            if(totalCritValid === totalCriterionsForInst){
    
                                let totalResult = 0
                                if(categories.length>0){
                                    categories.forEach((category) => {
                                        totalResult += (category.pass * 100)/category.total
                                        const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                                        category["totalCriterionsPercByCat"] = percByCrit * category.percentage / 100
                                    })
                                }
                                else if(totalCriterionsForInst>0){
                                    totalResult = 1
                                    const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
                                    categoriesAux["totalCriterionsPercByCat"] = percByCrit * categoriesAux.percentage / 100
                                    categories = [...categories, categoriesAux]
                                }
    
                                auditTotalResult = totalResult / categories.length
                                categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]
    
                                installationAuditData['categories'] = categories
    
                                instalation_audit_types = {
                                    percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
                                    percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
                                    percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
                                }
    
                                installationAuditData['instalation_audit_types'] =  instalation_audit_types
    
                                instalations_audit_details = [...instalations_audit_details, installationAuditData]
                            }
                        }
                    }      
                })
            })
    
            let accumAgency = 0

            let hp_perc = 0
            let general_perc = 0
            let v_perc = 0
            let pv_perc = 0
            let hp_perc_total = 0
            let general_perc_total = 0
            let v_perc_total = 0
            let pv_perc_total = 0
            
            let electric_total = 0
            let electric_perc = 0
            let img_total = 0
            let img_perc = 0
            let hme_total = 0
            let hme_perc = 0

            let total_values = 0

            instalations_audit_details.forEach((installation) => {

                const sales_weight_per_installation= (installation.installation.sales_weight_per_installation !== null)? installation.installation.sales_weight_per_installation : 0
                const post_sale_weight_per_installation= (installation.installation.post_sale_weight_per_installation !== null)? installation.installation.post_sale_weight_per_installation : 0

                let accumTotalWeightPerc = sales_weight_per_installation + post_sale_weight_per_installation

                const coefficient = ((accumTotalWeightPerc * 100) / totalWeightPerc)/100

                if(installation && installation.categories){
                    accumAgency += installation.categories[installation.categories.length - 1].auditTotalResult
                    installation.categories.forEach((category) => {
                        if(category.id === HYUNDAI_PROMISE){
                            hp_perc_total += 1
                            hp_perc += category.pass * coefficient
                            total_values += category.total * coefficient
                        }
                        else if(category.id === GENERAL){
                            general_perc_total += 1
                            general_perc += category.pass * coefficient
                            total_values += category.total * coefficient
                        }
                        else if(category.id === VENTA){
                            v_perc += category.pass * coefficient
                            v_perc_total += 1
                            total_values += category.total * coefficient
                        }
                        else if(category.id === POSVENTA){
                            pv_perc += category.pass * coefficient
                            pv_perc_total += 1
                            total_values += category.total * coefficient
                        }
                    })
                }
                if(installation && installation.instalation_audit_types){
                    if(installation.instalation_audit_types.percImgAudit !== null){
                        img_perc+= installation.instalation_audit_types.percImgAudit
                        img_total+= 1
                    }
                    if(installation.instalation_audit_types.percElectricAudit !== null){
                        electric_perc+= installation.instalation_audit_types.percElectricAudit
                        electric_total+= 1
                    }
                    if(installation.instalation_audit_types.percHmeAudit !== null){
                        hme_perc+= installation.instalation_audit_types.percHmeAudit
                        hme_total+= 1
                    }
                }
            })

            let agency_by_types = {
                electric_perc: (electric_total === 0)? null: electric_perc / electric_total,
                img_perc: (img_total === 0)? null: img_perc / img_total,
                hme_perc: (hme_total === 0)? null: hme_perc / hme_total,

                hp_perc: (hp_perc_total === 0)? null: hp_perc * 100 / total_values,
                v_perc: (v_perc_total === 0)? null: v_perc * 100 / total_values,
                general_perc: (general_perc_total === 0)? null: general_perc * 100 / total_values,
                pv_perc: (pv_perc_total === 0)? null: pv_perc * 100 / total_values
            }

            const total_agency = (agency_by_types.hp_perc !== null? agency_by_types.hp_perc: 0) + (agency_by_types.v_perc !== null? agency_by_types.v_perc: 0) + (agency_by_types.general_perc !== null? agency_by_types.general_perc: 0) + (agency_by_types.pv_perc !== null? agency_by_types.pv_perc: 0) 

            agency_by_types['total_agency'] = total_agency
        
        let data = {
            code: dealershipByID.code,
            name: dealershipByID.name,
            ionic5_quaterly_billing: dealershipByID.ionic5_quaterly_billing,
            vn_quaterly_billing: dealershipByID.vn_quaterly_billing,
            electric_quaterly_billing: dealershipByID.electric_quaterly_billing,
            percentage_total: agency_by_types.total_agency,
            percentage_general: agency_by_types.general_perc,
            percentage_venta: agency_by_types.v_perc,
            percentage_postventa: agency_by_types.pv_perc,
            percentage_HP: agency_by_types.hp_perc,
            percentage_audit_electric: agency_by_types.electric_perc,
            percentage_audit_img: agency_by_types.img_perc,
            percentage_audit_hme: agency_by_types.hme_perc,
        }

        compliance_audit += agency_by_types.total_agency !== null? agency_by_types.total_agency : 0

        arrayDealershipsAudit = [...arrayDealershipsAudit, data]
        }

        const audit_data = {
            name: existAudit.name,
            initial_date: existAudit.initial_date,
            end_date: existAudit.end_date,
            compliance_audit: compliance_audit/arrayOfDealerships.length,
            dealership_details: arrayDealershipsAudit
        }

        return response.status(200).json({data: audit_data})
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

/*
const getDataForFullAudit = async(request, response) => {
    const {audit_id} = request.params
    let auditsResults = null
    let arrayDealershipsAudit = []
    try{
        let existAudit = null

        if(!ObjectId.isValid(audit_id)){
            return response.status(400).json(
                {errors: [{code: 400, 
                        msg: 'invalid audit_id', 
                        detail: `${audit_id} is not an ObjectId`}]})
        }
        else{
            existAudit = await Audit.findById(audit_id)
            if(!existAudit)
                return response.status(400).json(
                    {errors: [{code: 400, 
                            msg: 'invalid audit_id', 
                            detail: `${audit_id} not found`}]}) 
        }

        auditsResults = await AuditResults.find({audit_id: audit_id})
                                                .populate({path: 'installation_id', select: 'dealership'})

        let arrayOfDealerships = []

        auditsResults.forEach((element) => {
            if(!arrayOfDealerships.includes(element.installation_id.dealership.toString())){
                arrayOfDealerships = [...arrayOfDealerships, element.installation_id.dealership.toString()]
            }
        })

        let compliance_audit = 0

        for(let i = 0; i < arrayOfDealerships.length; i++){
            const dealership = arrayOfDealerships[i]

            const dealershipByID = await Dealership.findById(dealership)
            const auditsResults = await AuditResults.find({$and:[{installation_id: {$in: dealershipByID.installations}},{audit_id: audit_id}]})
                                                    .populate({path: 'installation_id', select: '_id name code installation_type sales_weight_per_installation post_sale_weight_per_installation isSale isPostSale isHP', 
                                                                populate: {path: 'installation_type', select: '_id code'}})
                                                    .populate({ path: 'criterions.criterion_id', 
                                                                populate: {
                                                                    path: 'standard block area category auditResponsable criterionType installationType',
                                                                    select: 'name code description isCore number abbreviation'
                                                                },
                                                            }) 
                                                
            auditsResults.forEach((element) => {
                const orderedCriterionsArray = element.criterions.sort(function (a, b) {
                    if (a.criterion_id.standard._id.toString() > b.criterion_id.standard._id.toString()) {
                        return 1;
                    }
                    if (a.criterion_id.standard._id.toString() < b.criterion_id.standard._id.toString()) {
                        return -1;
                    }
                    return 0;
                })
                orderedCriterionsArray.forEach((criterion) => {
                    if(criterion.criterion_id.standard.isCore && !criterion.pass){
                        orderedCriterionsArray.filter((el, index) => {
                            if(criterion.criterion_id.standard._id.toString() === el.criterion_id.standard._id.toString()){
                                orderedCriterionsArray[index].pass = false
                            }
                        })
                    }
                })
            })
    
            let instalations_audit_details = []
            let instalation_audit_types = null
    
            const VENTA = "6233b3ace74b428c2dcf3068"
            const POSVENTA = "6233b450e74b428c2dcf3091"
            const HYUNDAI_PROMISE = "6233b445e74b428c2dcf3088"
            const GENERAL = "6233b39fe74b428c2dcf305f"
    
            auditsResults.forEach((element) => {
                let installationAuditData = {}
                installationAuditData['installation'] =  element.installation_id
                let actualCategoryID = ''
                let actualCategoryName = ''
                let accum = 0
                let totalAccum = 0
                let totalCriterionsByCat = 0
                let categories = []
                let totalCriterionsForInst = 0
                let categoriesAux = null
    
                let totalImgAudit = 0
                let totalPassImgAudit = 0
                let totalHmeAudit = 0
                let totalPassHmeAudit = 0
                let totalElectricAudit = 0
                let totalPassElectricAudit = 0
                
                let totalCritValid = 0
    
                element.criterions.forEach((criterion, index) => {                
                    let isValidType = false
                    criterion.criterion_id.installationType.forEach((type) => {
                        if(type._id.toString() === element.installation_id.installation_type._id.toString()){
                            isValidType = true
                        }
                    })
                    if(criterion.criterion_id.category._id.toString() === VENTA && !element.installation_id.isSale ||
                        criterion.criterion_id.category._id.toString() === POSVENTA && !element.installation_id.isPostSale ||
                        criterion.criterion_id.category._id.toString() === HYUNDAI_PROMISE && !element.installation_id.isHP || 
                        !isValidType){
                    }
                    else{
                        totalCriterionsForInst += 1
                        if(criterion.criterion_id.isImgAudit){
                            totalImgAudit+= criterion.criterion_id.value
                            if(criterion.pass)
                                totalPassImgAudit+= criterion.criterion_id.value
                        }
                        else if(criterion.criterion_id.isHmeAudit){
                            totalHmeAudit+= criterion.criterion_id.value
                            if(criterion.pass)
                                totalPassHmeAudit+= criterion.criterion_id.value
                        }
                        else if(criterion.criterion_id.isElectricAudit){
                            totalElectricAudit+= criterion.criterion_id.value
                            if(criterion.pass)
                                totalPassElectricAudit+= criterion.criterion_id.value
                        }
                    }
                })
    
                element.criterions.forEach((criterion, index) => {
                    let isValidType = false
                    criterion.criterion_id.installationType.forEach((type) => {
                        if(type._id.toString() === element.installation_id.installation_type._id.toString()){
                            isValidType = true
                        }
                    })
                    if(criterion.criterion_id.category._id.toString() === VENTA && !element.installation_id.isSale ||
                        criterion.criterion_id.category._id.toString() === POSVENTA && !element.installation_id.isPostSale ||
                        criterion.criterion_id.category._id.toString() === HYUNDAI_PROMISE && !element.installation_id.isHP || 
                        !isValidType){
                    }
                    else{
                        let multiplicator = 1
    
                        if(actualCategoryID === VENTA){
                            if(element.installation_id.sales_weight_per_installation !== null){
                                multiplicator = element.installation_id.sales_weight_per_installation/100
                            }
                            else{
                                multiplicator = 1
                            }
                        }
                        else if(actualCategoryID === POSVENTA){
                            if(element.installation_id.post_sale_weight_per_installation !== null){
                                multiplicator = element.installation_id.post_sale_weight_per_installation/100
                            }
                            else{
                                multiplicator = 1
                            }
                        }
                        else{
                            multiplicator = 1
                        }
    
                        totalCritValid += 1
    
                        if((criterion.criterion_id.category._id.toString() === actualCategoryID)){
                            totalCriterionsByCat += 1
                            if(criterion.pass){
                                accum += criterion.criterion_id.value
                            }
                            totalAccum += criterion.criterion_id.value
                            if(totalCritValid === totalCriterionsForInst){
                                const perc = ((accum * 100)/totalAccum) * multiplicator
                                const category = {
                                    id: actualCategoryID.toString(),
                                    name: actualCategoryName,
                                    pass: accum,
                                    total: totalAccum,
                                    percentageByInstallation: (accum * 100)/totalAccum,
                                    totalCriterionsByCat: totalCriterionsByCat,
                                    percentage: perc,
                                }
                                categories = [...categories, category]
    
                                let totalResult = 0
                                if(categories.length>0){
                                    categories.forEach((category) => {
                                        totalResult += (category.pass * 100)/category.total
                                        const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                                        category["totalCriterionsPercByCat"] = percByCrit * category.percentage / 100
                                    })
                                }
                                else if(totalCriterionsForInst>0){
                                    totalResult = 1
                                    const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
                                    categoriesAux["totalCriterionsPercByCat"] = percByCrit * categoriesAux.percentage / 100
                                    categories = [...categories, categoriesAux]
                                }
                                
                                auditTotalResult = totalResult / categories.length
                                categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]
    
                                installationAuditData['categories'] = categories
    
                                instalation_audit_types = {
                                    percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
                                    percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
                                    percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
                                }
    
                                installationAuditData['instalation_audit_types'] =  instalation_audit_types
    
                                instalations_audit_details = [...instalations_audit_details, installationAuditData]
                            }
                        }
                        else{
                            if(totalCritValid !== 1 || totalCriterionsForInst === 1){
                                const perc = ((accum * 100)/totalAccum) * multiplicator
                                const category = {
                                    id: actualCategoryID.length>0? actualCategoryID: criterion.criterion_id.category._id.toString(),
                                    name: actualCategoryName.length>0? actualCategoryName: criterion.criterion_id.category.name,
                                    pass: accum,
                                    total: totalAccum,
                                    percentageByInstallation: (accum * 100)/totalAccum,
                                    totalCriterionsByCat: totalCriterionsByCat,
                                    percentage: perc,
                                }
                                categories = [...categories, category]
                            }
                            totalCriterionsByCat = 1
                            totalAccum = criterion.criterion_id.value
                            if(criterion.pass){
                                accum = criterion.criterion_id.value
                            }
                            else{
                                accum = 0
                            }
                            actualCategoryID = criterion.criterion_id.category._id.toString()
                            actualCategoryName = criterion.criterion_id.category.name
                            if(totalCritValid === totalCriterionsForInst){
    
                                let totalResult = 0
                                if(categories.length>0){
                                    categories.forEach((category) => {
                                        totalResult += (category.pass * 100)/category.total
                                        const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                                        category["totalCriterionsPercByCat"] = percByCrit * category.percentage / 100
                                    })
                                }
                                else if(totalCriterionsForInst>0){
                                    totalResult = 1
                                    const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
                                    categoriesAux["totalCriterionsPercByCat"] = percByCrit * categoriesAux.percentage / 100
                                    categories = [...categories, categoriesAux]
                                }
    
                                auditTotalResult = totalResult / categories.length
                                categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]
    
                                installationAuditData['categories'] = categories
    
                                instalation_audit_types = {
                                    percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
                                    percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
                                    percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
                                }
    
                                installationAuditData['instalation_audit_types'] =  instalation_audit_types
    
                                instalations_audit_details = [...instalations_audit_details, installationAuditData]
                            }
                        }
                    }      
                })
            })
    
            let accumAgency = 0

            let hp_perc = 0
            let general_perc = 0
            let v_perc = 0
            let pv_perc = 0
            let hp_perc_total = 0
            let general_perc_total = 0
            let v_perc_total = 0
            let pv_perc_total = 0
            
            let electric_total = 0
            let electric_perc = 0
            let img_total = 0
            let img_perc = 0
            let hme_total = 0
            let hme_perc = 0

            let total_values = 0

            instalations_audit_details.forEach((installation) => {
                if(installation && installation.categories){
                    accumAgency += installation.categories[installation.categories.length - 1].auditTotalResult
                    installation.categories.forEach((category) => {
                        if(category.id === HYUNDAI_PROMISE){
                            hp_perc_total += 1
                            hp_perc += category.pass
                            total_values += category.total
                        }
                        else if(category.id === GENERAL){
                            general_perc_total += 1
                            general_perc += category.pass
                            total_values += category.total
                        }
                        else if(category.id === VENTA){
                            v_perc += category.pass * (installation.installation.sales_weight_per_installation/100)
                            v_perc_total += 1
                            total_values += category.total * (installation.installation.sales_weight_per_installation/100)
                        }
                        else if(category.id === POSVENTA){
                            pv_perc += category.pass * (installation.installation.post_sale_weight_per_installation/100)
                            pv_perc_total += 1
                            total_values += category.total * (installation.installation.post_sale_weight_per_installation/100)
                        }
                    })
                }
                if(installation && installation.instalation_audit_types){
                    if(installation.instalation_audit_types.percImgAudit !== null){
                        img_perc+= installation.instalation_audit_types.percImgAudit
                        img_total+= 1
                    }
                    if(installation.instalation_audit_types.percElectricAudit !== null){
                        electric_perc+= installation.instalation_audit_types.percElectricAudit
                        electric_total+= 1
                    }
                    if(installation.instalation_audit_types.percHmeAudit !== null){
                        hme_perc+= installation.instalation_audit_types.percHmeAudit
                        hme_total+= 1
                    }
                }
            })

            let agency_by_types = {
                electric_perc: (electric_total === 0)? null: electric_perc / electric_total,
                img_perc: (img_total === 0)? null: img_perc / img_total,
                hme_perc: (hme_total === 0)? null: hme_perc / hme_total,

                hp_perc: (hp_perc_total === 0)? null: hp_perc * 100 / total_values,
                v_perc: (v_perc_total === 0)? null: v_perc * 100 / total_values,
                general_perc: (general_perc_total === 0)? null: general_perc * 100 / total_values,
                pv_perc: (pv_perc_total === 0)? null: pv_perc * 100 / total_values
            }

            const total_agency = (agency_by_types.hp_perc !== null? agency_by_types.hp_perc: 0) + (agency_by_types.v_perc !== null? agency_by_types.v_perc: 0) + (agency_by_types.general_perc !== null? agency_by_types.general_perc: 0) + (agency_by_types.pv_perc !== null? agency_by_types.pv_perc: 0) 

            agency_by_types['total_agency'] = total_agency
        
        let data = {
            code: dealershipByID.code,
            name: dealershipByID.name,
            ionic5_quaterly_billing: dealershipByID.ionic5_quaterly_billing,
            vn_quaterly_billing: dealershipByID.vn_quaterly_billing,
            electric_quaterly_billing: dealershipByID.electric_quaterly_billing,
            percentage_total: agency_by_types.total_agency,
            percentage_general: agency_by_types.general_perc,
            percentage_venta: agency_by_types.v_perc,
            percentage_postventa: agency_by_types.pv_perc,
            percentage_HP: agency_by_types.hp_perc,
            percentage_audit_electric: agency_by_types.electric_perc,
            percentage_audit_img: agency_by_types.img_perc,
            percentage_audit_hme: agency_by_types.hme_perc,
        }

        compliance_audit += agency_by_types.total_agency !== null? agency_by_types.total_agency : 0

        arrayDealershipsAudit = [...arrayDealershipsAudit, data]
        }

        const audit_data = {
            name: existAudit.name,
            initial_date: existAudit.initial_date,
            end_date: existAudit.end_date,
            compliance_audit: compliance_audit/arrayOfDealerships.length,
            dealership_details: arrayDealershipsAudit
        }

        return response.status(200).json({data: audit_data})
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}
*/

const getAuditResByAuditIDAndInstallationID = async(request, response) => {
    try{
        const {auditid, installationid} = request.params

        //Validations
        if(!auditid)
            return response.status(400).json({code: 400,
                                                msg: 'invalid auditid',
                                                detail: 'id is a obligatory field'})
        if(auditid && !ObjectId.isValid(auditid))
            return response.status(400).json({code: 400,
                                              msg: 'invalid auditid',
                                              detail: 'auditid should be an objectId'})

        if(!installationid)
            return response.status(400).json({code: 400,
                                                msg: 'invalid installationid',
                                                detail: 'id is a obligatory field'})
        if(installationid && !ObjectId.isValid(installationid))
            return response.status(400).json({code: 400,
                                            msg: 'invalid installationid',
                                            detail: 'installationid should be an objectId'})
    
        const auditRes = await AuditResults.findOne({audit_id: auditid, installation_id: {$in: [installationid]}})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
    
        if(auditRes){
            response.status(200).json({code: 200,
                                       msg: 'success',
                                       data: auditRes})
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

module.exports = {createAuditResults, updateAuditResults, deleteAuditResults, getDataForTables, getAuditResByAuditIDAndInstallationID, getDataForAudit, getDataForFullAudit}
