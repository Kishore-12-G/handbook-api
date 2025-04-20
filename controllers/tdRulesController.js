const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addTdRule = async (req, res) => {
  try {
    const { ruleNumber, title, description, iconUrl } = req.body;

    const existing = await prisma.tDRules.findFirst({
      where: { ruleNumber }
    });

    if (existing) {
      return res.status(409).json({ success: false, message: 'Rule number already exists' });
    }

    const newRule = await prisma.tDRules.create({
      data: {
        ruleNumber,
        title,
        description,
        iconUrl
      }
    });

    res.status(201).json({
      success: true,
      data: newRule,
      message: 'TD Rule added successfully'
    });
  } catch (error) {
    console.error('Error adding TD Rule:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.getAllRules = async (req, res) => {
    try {
      const rules = await prisma.tDRules.findMany();
      res.status(200).json({
        success: true,
        data: rules,
        message: 'TD Rules fetched successfully'
      });
    } catch (error) {
      console.error('Error fetching TD Rules:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
  

exports.getRuleById = async (req,res) => {
    try{
        const {ruleNumber} = req.params;
        rule = await prisma.tDRules.findFirst({
            where:{ruleNumber:ruleNumber}
        });
        if (!rule){
            return res.status(404).json({success:false,message:'tdRule not found'});
        }
        res.status(200).json({success:true,data:rule,message:'td Rule fetched successfully'});
    }catch(error){
        console.error('error occurred while fetching particular td rule',error);
        res.status(400).json({success:false,message:'internal server error'});
    }
}

exports.addTdRates = async (req, res) => {
    const rateData = req.body;
  
    try {
      const newRate = await prisma.tDRates.create({
        data: rateData,
      });
  
      res.status(201).json({
        success: true,
        data: newRate,
        message: 'TD Rate added successfully',
      });
    } catch (error) {
      console.error('Error adding TD Rate:', error);
      res.status(500).json({ success: false, message: 'Internal server error' }); // ✅ Fixed typo and extra parentheses
    }
  };
  

exports.updateRule = async (req, res) => {
    try {
      const { tdRulesId } = req.params;
      const { ruleNumber, title, description, iconUrl } = req.body;
      
      if (!ruleNumber && !title && !description && !iconUrl) {
        return res.status(400).json({ message: 'At least one field to update is required' });
      }
      
      // If updating rule number, check if it already exists
      if (ruleNumber) {
        const existingRule = await prisma.travelRule.findFirst({
          where: { 
            ruleNumber: {
              equals: ruleNumber,
              mode: 'insensitive'
            },
          }
        });
        
        if (existingRule) {
          return res.status(409).json({ message: 'Rule number already exists' });
        }
      }
      
      const updatedRule = await prisma.tDRules.update({
        where: { tdRulesId:tdRulesId },
        data: {
          ...(ruleNumber && { ruleNumber }),
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(iconUrl !== undefined && { iconUrl })
        }
      });
      
      res.status(200).json(updatedRule);
    } catch (error) {
      console.error('Error updating rule:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Rule not found' });
      }
      
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
exports.deleteRule = async (req, res) => {
    try {
      const { tdRulesId } = req.params;
      
      await prisma.tDRules.delete({
        where: { tdRulesId: tdRulesId }
      });
      
      res.status(200).json({ message: 'Rule deleted successfully' });
    } catch (error) {
      console.error('Error deleting rule:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Rule not found' });
      }
      
      res.status(500).json({ message: 'Internal server error' });
    }
};
