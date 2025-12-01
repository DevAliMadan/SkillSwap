const Skill = require('../models/Skill')

const createSkill = async (req, res) =>{
    try {
        const createdSkill = await Skill.create(req.body)
        res.status(201).json(createdSkill)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:error.massage})
    }
    
}

const ShowSkill = async (req, res) => {

    try {
        const oneSkill = await oneSkill.findById(req.params.id)
        
        if (oneSkill) {
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

const updateskill = async (req, res) => {
    
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

module.exports = {
    createSkill,
    allSkills,
    ShowSkill,
    deleteSkill,
    updateskill
}