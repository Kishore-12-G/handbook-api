const {PrismaClient} = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient();

exports.getChecklist = async (req,res) => {
    try{
        const checklist = await prisma.tDClaimChecklist.findFirst();

        if(!checklist){
            return res.status(404).json({success:false,message:'checklist Document not found'});
        }

        res.status(200).json({success:true,data:checklist,message:'Checklist Document Retrieved Successfully'});
    }catch(error){
        console.error('Error fetching checklist:',error);
        res.status(500).json({message:'Internal Server error'});
    }
}

exports.addChecklist = async (req,res) => {
    try{
        const {title,fileUrl} = req.body;
        if(!title || !fileUrl){
            return res.status(400).json({success:false,message:'title and file url are required'});
        }

        const newChecklist = await prisma.tDClaimChecklist.create({
            data: {
                title:title,
                fileUrl:fileUrl
            }     
        });
        res.status(201).json({success:true,data:newChecklist,message:'New Checklist Uploaded successfully'});
    }catch(error){
        console.error('error while creating td document',error);
        res.status(500).json({success:false,message:'Internal Server Error',error:error.message});
    }
}

exports.updateChecklist = async (req, res) => {
    const checklistId = parseInt(req.params.id);
    const checklistDetail = req.body;
  
    try {
      const existingChecklist = await prisma.tDClaimChecklist.findUnique({
        where: { id: checklistId },
      });
  
      if (!existingChecklist) {
        return res.status(404).json({ success: false, message: 'Checklist not found' });
      }
  
      const updatedChecklist = await prisma.tDClaimChecklist.update({
        where: { id: checklistId },
        data: checklistDetail,
      });
  
      res.status(200).json({
        success: true,
        data: updatedChecklist,
        message: 'Checklist updated successfully',
      });
    } catch (error) {
      console.error('Error updating checklist:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };