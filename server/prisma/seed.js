import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const PASSWORD = 'password123';

async function main() {
  console.log('Seeding...');
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  await prisma.notification.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.roundResult.deleteMany();
  await prisma.round.deleteMany();
  await prisma.eligibilityCriteria.deleteMany();
  await prisma.application.deleteMany();
  await prisma.drive.deleteMany();
  await prisma.recruiterProfile.deleteMany();
  await prisma.company.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: { name: 'Placement Officer', email: 'tpo@college.edu', passwordHash, role: 'TPO' },
  });

  const companies = [
    { name: 'Infosys', industry: 'IT Services' },
    { name: 'TCS', industry: 'IT Services' },
    { name: 'Wipro', industry: 'IT Services' },
    { name: 'Accenture', industry: 'Consulting' },
    { name: 'Amazon', industry: 'E-Commerce' },
  ];
  for (const c of companies) {
    await prisma.user.create({
      data: {
        name: 'HR ' + c.name,
        email: 'hr@' + c.name.toLowerCase() + '.com',
        passwordHash,
        role: 'RECRUITER',
        recruiterProfile: { create: { company: { create: c }, designation: 'HR Manager' } },
      },
    });
  }

  const branches = ['CSE', 'IT', 'ECE', 'MECH'];
  for (let i = 1; i <= 20; i++) {
    await prisma.user.create({
      data: {
        name: 'Student ' + i,
        email: 'student' + i + '@college.edu',
        passwordHash,
        role: 'STUDENT',
        studentProfile: {
          create: {
            rollNo: '22' + branches[i % 4] + String(i).padStart(3, '0'),
            branch: branches[i % 4],
            gradYear: 2026,
            cgpa: Math.round((6 + Math.random() * 4) * 10) / 10,
            activeBacklogs: i % 5 === 0 ? 1 : 0,
          },
        },
      },
    });
  }

  console.log('Seeded: 1 TPO, 5 recruiters, 20 students');
  console.log('Password for ALL accounts: ' + PASSWORD);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
