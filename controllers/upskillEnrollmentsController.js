const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.CreateEnrollments = async (req, res) => {
    try {
        const { certificationId, name, email, phone, description, userId } = req.body;

        if (!certificationId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Certification Id and User Id are required'
            });
        }

        const certification = await prisma.upskillCertification.findUnique({
            where: { certificationId: certificationId }
        });

        if (!certification) {
            return res.status(404).json({ success: false, message: 'Certification not found' });
        }

        const user = await prisma.user.findUnique({
            where: { userId: userId }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const enrollment = await prisma.upSkillEnrollment.create({
            data: { certificationId, name, email, phone, description, userId }
        });

        res.status(201).json({ success: true, data: enrollment, message: 'Course enrollment successful' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create enrollment', error: error.message });
    }
};

exports.getEnrollmentsById = async (req, res) => {
    try {
        const { enrollmentId } = req.params;

        const enrollment = await prisma.upSkillEnrollment.findUnique({
            where: { applicationId: enrollmentId },
            include: {
                certification: true,
                user: true
            }
        });

        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'You are not enrolled in this course' });
        }

        res.status(200).json({ success: true, data: enrollment, message: 'Enrollment fetched successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve the course enrollment', error: error.message });
    }
};

exports.updateEnrollment = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const updateData = req.body;

        const updatedEnrollment = await prisma.upSkillEnrollment.update({
            where: { applicationId: enrollmentId },
            data: updateData
        });

        res.status(200).json({ success: true, data: updatedEnrollment, message: 'Enrollment updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update the enrollment', error: error.message });
    }
};

exports.getUserEnrollments = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await prisma.user.findUnique({
            where: { userId: userId }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const enrollments = await prisma.upSkillEnrollment.findMany({
            where: { userId: userId },
            include: {
                certification: true
            }
        });

        res.status(200).json({ success: true, data: enrollments });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve the courses enrolled', error: error.message });
    }
};
