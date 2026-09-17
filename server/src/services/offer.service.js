import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export async function createOffer(user, applicationId, data) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { drive: true, student: true, offer: true },
  });
  if (!application) throw new ApiError(404, 'Application not found');
  if (application.status !== 'SELECTED') {
    throw new ApiError(400, 'Offers can only be sent for SELECTED applications');
  }
  if (application.offer) throw new ApiError(409, 'An offer already exists for this application');
  if (application.student.placedStatus === 'PLACED') {
    throw new ApiError(400, 'Student is already placed');
  }

  if (user.role === 'RECRUITER') {
    const profile = await prisma.recruiterProfile.findUnique({ where: { userId: user.id } });
    if (!profile || profile.companyId !== application.drive.companyId) {
      throw new ApiError(403, 'You can only send offers for your own company drives');
    }
  }

  return prisma.offer.create({
    data: {
      applicationId,
      ctc: data.ctc,
      jobRole: data.jobRole || application.drive.jobRole,
      joiningDate: data.joiningDate,
    },
  });
}

export async function myOffers(studentUserId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) throw new ApiError(404, 'Student profile not found');

  return prisma.offer.findMany({
    where: { application: { studentId: student.id } },
    include: { application: { include: { drive: { include: { company: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function respondToOffer(studentUserId, offerId, action) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { application: { include: { student: true } } },
  });
  if (!offer) throw new ApiError(404, 'Offer not found');
  if (offer.application.student.userId !== studentUserId) {
    throw new ApiError(403, 'This is not your offer');
  }
  if (offer.status !== 'OFFERED') {
    throw new ApiError(400, 'Offer already ' + offer.status.toLowerCase());
  }

  if (action === 'ACCEPTED') {
    // ? THE one-offer moment: accept + mark PLACED in one atomic transaction
    const [updatedOffer] = await prisma.$transaction([
      prisma.offer.update({ where: { id: offerId }, data: { status: 'ACCEPTED' } }),
      prisma.studentProfile.update({
        where: { id: offer.application.studentId },
        data: { placedStatus: 'PLACED' },
      }),
    ]);
    return updatedOffer;
  }

  return prisma.offer.update({ where: { id: offerId }, data: { status: 'DECLINED' } });
}
