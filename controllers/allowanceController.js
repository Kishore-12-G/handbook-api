const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.calculateAllowance = async (req, res) => {
    try {
        const {
            jobDesignation,
            basicPay,
            marriedStatus,
            distanceTravelled,
            vehicleIncluded
        } = req.body;

        if (!basicPay || !distanceTravelled) {
            return res.status(400).json({ message: 'Basic Pay and distance are required' });
        }

        const baseAllowance = Math.floor(Number(basicPay) * 0.8);
        const distanceAllowance = Math.floor(Number(distanceTravelled) * 50);

        let vehicleAllowance = 0;
        if (vehicleIncluded && vehicleIncluded.type != 'none' && vehicleIncluded.weight) {
            vehicleAllowance = Math.floor((Number(vehicleIncluded.weight) * 50 * Number(distanceTravelled)) / 6000);
        }

        let familyAllowance = 0;
        if (!marriedStatus) {
            familyAllowance = -Math.floor(distanceAllowance * 2 / 3);
        }

        const totalAllowance = baseAllowance + distanceAllowance + vehicleAllowance + familyAllowance;

        // Generate a unique calculationId
        const calculationId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const allowance = await prisma.allowance.create({
            data: {
                calculationId: calculationId,
                userId: req.user.userId,
                jobDesignation,
                basicPay: Number(basicPay),
                marriedStatus,
                distanceTravelled: Number(distanceTravelled),
                vehicleIncluded: {
                    type: vehicleIncluded.type,
                    details: vehicleIncluded.details,
                    weight: Number(vehicleIncluded.weight)
                },
                result: {
                    breakdown: {
                        baseAllowance,
                        distanceAllowance,
                        familyAllowance,
                        vehicleAllowance
                    },
                    total: totalAllowance
                }
            }
        });
        

        res.status(201).json({
            allowance,
            message:'Allowance Calculated Successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllowanceHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [allowances, total] = await Promise.all([
            prisma.allowance.findMany({
                where: { userId: req.user.userId },
                orderBy: { calculatedAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.allowance.count({
                where: { userId: req.user.userId }
            })
        ]);

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            result: allowances,
            pagination: {
                total,
                totalPages,
                currentPage: page,
                limit
            },
            message:'Allowance History Fetched Successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllowanceCalculationById = async (req, res) => {
    try {
        const allowance = await prisma.allowance.findFirst({
            where: {
                calculationId: req.params.calculationId,
                userId: req.user.userId
            }
        });

        if (!allowance) {
            return res.status(404).json({ message: 'Calculation not found' });
        }
        res.status(200).json({
            allowance,
            message: 'Allowance Found'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};