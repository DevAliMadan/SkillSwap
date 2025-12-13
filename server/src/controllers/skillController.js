const Skill = require('../models/Skill')
const User = require('../models/User')

const createSkill = async (req, res) =>{
    try {
        const createdSkill = await Skill.create(...req.body, req.user._id)
        await User.findByIdAndUpdate(req.user._id, { $push: { skills: createdSkill._id}})
        res.status(201).json(createdSkill)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:error.massage})
    }
    
}

const ShowSkill = async (req, res) => {

    try {
        const oneSkill = await oneSkill.findById(req.params.id).populate( 'user', 'username profile')
        
        if (!oneSkill) {
            res.status(200).json(oneSkill)
        } else{
            res.sendStatus(404)
        }
    } catch (error) {
        res.status(500).json({error: error.massage})
    }
    
}

const allSkills = async (req, res) => {
    try {
        const Skills = await Skills.find()
        if (Skills.length){
            res.status(200).json(Skills)
        }else{
            res.sendStatus(204)
        }
    } catch (error) {
        console.log(error)
    }
}

const deleteSkill = async (req, res) => {
    try {
        const skill = await skill.findByIdAndDelete(req.params.id)

        if (skill){
            res.status(200).json(skill)
        } else{
            res.sendStatus(404)
        }
    } catch (error) {
        res.status(500).json({error: error.massage})
    }
}

const updateSkill = async (req, res) => {
    
    try {
        const skill = await skill.findByIdAndUpdate(req.params.id)

        if (skill){
            res.status(200).json(skill)
        } else{
            res.sendStatus(404)
        }
    } catch (error) {
        res.status(500).json({error: error.massage})
    }
}

const searchSkill = async (req, res) => {
    const search = req.quary.q
    try {
        const skill = await skill.find( {name : { $regex: search, $optons: 'i'}})

        if (skill){
            res.status(200).json(skill)
        } else{
            res.sendStatus(404)
        }
    } catch (error) {
        res.status(500).json({error: error.massage})
    }
}



module.exports = {
    createSkill,
    allSkills,
    ShowSkill,
    deleteSkill,
    updateSkill,
    searchSkill
}