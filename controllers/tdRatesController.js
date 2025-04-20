const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllRates = async (req,res) =>{
    try{
        const rates = await prisma.tDRates.findMany();
        res.status(200).json({success:true,message:'Td Rates fetched successfully',data:rates});
    }catch(error){
        console.error('error fetching rates',error);
        res.status(500).json({success:false,message:'Internal Server error'});
    }
};

exports.addTdRates = async (req,res) => {
    try{
        const {rankCategory,hotelAllowance,taxiAllowance,foodAllowance} = req.body;
        
        if(!rankCategory||!hotelAllowance||!taxiAllowance||!foodAllowance){
            return res.status(400).json({message:'category,HotelAllowance,taxiDetail,FoodAllowance are required'});
        }

        const newRate = await prisma.tDRates.create({
            data:{
                rankCategory:rankCategory,
                hotelAllowance:hotelAllowance,
                taxiAllowance:taxiAllowance,
                foodAllowance:foodAllowance
            }
        });
        res.status(201).json({success:true,data:newRate,message:'new rate is added successfully'});
    }catch(error){
        console.error('error while creating td rates',error);
        res.status(500).json(({success:false,message:'internal Server erro'}));
    }
}

exports.updateTdRate = async (req, res) => {
    try {
      const { tdRateId } = req.params;
      const { rankCategory, hotelAllowance, taxiAllowance, foodAllowance } = req.body;
  
      if (!rankCategory && !hotelAllowance && !taxiAllowance && !foodAllowance) {
        return res.status(400).json({ message: 'At least one field to update is required' });
      }
  
      const updatedRates = await prisma.tDRates.update({
        where: { tdRatesId: tdRateId },
        data: {
          ...(rankCategory && { rankCategory }),
          ...(hotelAllowance && { hotelAllowance: parseFloat(hotelAllowance) }),
          ...(taxiAllowance && { taxiAllowance }),
          ...(foodAllowance && { foodAllowance: parseFloat(foodAllowance) })
        }
      });
  
      res.status(200).json({
        success: true,
        data: updatedRates,
        message: 'TD rates updated successfully'
      });
  
    } catch (error) {
      console.error('Error while updating the TD rate details', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  

exports.deleteTdRates = async (req,res) =>{
    try{
        const {tdRateId} = req.params;
        const tdRate = await prisma.tDRates.findUnique({
            where:{tdRatesId:tdRateId}
        });

        if(!tdRate){
            return res.status(404).json({success:false,message:'particular td rate not found'});
        }

        await prisma.tDRates.delete({
            where: {tdRatesId:tdRateId}
        });
        res.status(200).json({success:true,message:'td rate deleted successfully'})
    }catch(error){
        console.error('Error deleting rate:', error);
        res.status(500).json({message:'internal server error'});
    }
};