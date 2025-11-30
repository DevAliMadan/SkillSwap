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
module.exports = {
    createSkill,
    allSkills,
    ShowSkill,
    deleteSkill,
    updateSill,
}