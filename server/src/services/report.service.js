import { prisma } from '../config/db.js';

const round1 = (n) => Math.round(n * 10) / 10;
const round2 = (n) => Math.round(n * 100) / 100;

export async function summary(gradYear) {
  const studentWhere = gradYear ? { gradYear } : {};

  const students = await prisma.studentProfile.findMany({ where: studentWhere });

  const offers = await prisma.offer.findMany({
    where: { status: 'ACCEPTED', application: { student: studentWhere } },
    include: {
      application: {
        include: {
          student: { include: { user: { select: { name: true } } } },
          drive: { include: { company: true } },
        },
      },
    },
  });

  const total = students.length;
  const placedStudents = students.filter((s) => s.placedStatus === 'PLACED');
  const ctcs = offers.map((o) => o.ctc);

  // branch-wise breakdown
  const branchMap = {};
  for (const s of students) {
    branchMap[s.branch] = branchMap[s.branch] || { branch: s.branch, total: 0, placed: 0 };
    branchMap[s.branch].total++;
    if (s.placedStatus === 'PLACED') branchMap[s.branch].placed++;
  }
  const branchWise = Object.values(branchMap).map((b) => ({
    ...b,
    rate: b.total ? round1((b.placed / b.total) * 100) : 0,
  }));

  // company-wise hiring
  const companyMap = {};
  for (const o of offers) {
    const name = o.application.drive.company.name;
    companyMap[name] = companyMap[name] || { company: name, hires: 0, totalCtc: 0 };
    companyMap[name].hires++;
    companyMap[name].totalCtc += o.ctc;
  }
  const companyWise = Object.values(companyMap)
    .map((c) => ({ company: c.company, hires: c.hires, avgCtc: round2(c.totalCtc / c.hires) }))
    .sort((a, b) => b.hires - a.hires);

  return {
    gradYear: gradYear || 'ALL',
    totalStudents: total,
    placed: placedStudents.length,
    unplaced: total - placedStudents.length,
    placementRate: total ? round1((placedStudents.length / total) * 100) : 0,
    totalOffers: offers.length,
    avgCtc: ctcs.length ? round2(ctcs.reduce((a, b) => a + b, 0) / ctcs.length) : 0,
    highestCtc: ctcs.length ? Math.max(...ctcs) : 0,
    lowestCtc: ctcs.length ? Math.min(...ctcs) : 0,
    branchWise,
    companyWise,
    recentPlacements: offers.map((o) => ({
      student: o.application.student.user.name,
      rollNo: o.application.student.rollNo,
      branch: o.application.student.branch,
      company: o.application.drive.company.name,
      role: o.jobRole,
      ctc: o.ctc,
    })),
  };
}

export async function exportCsv(gradYear) {
  const students = await prisma.studentProfile.findMany({
    where: gradYear ? { gradYear } : {},
    include: {
      user: { select: { name: true } },
      applications: {
        where: { offer: { status: 'ACCEPTED' } },
        include: { drive: { include: { company: true } }, offer: true },
      },
    },
  });

  const esc = (v) => '"' + String(v ?? '').replaceAll('"', '""') + '"';
  const rows = [['RollNo', 'Name', 'Branch', 'GradYear', 'CGPA', 'Placed', 'Company', 'Role', 'CTC_LPA']];
  for (const s of students) {
    const acc = s.applications[0];
    rows.push([
      s.rollNo, s.user.name, s.branch, s.gradYear, s.cgpa, s.placedStatus,
      acc?.drive.company.name || '', acc?.offer.jobRole || '', acc?.offer.ctc ?? '',
    ]);
  }
  return rows.map((r) => r.map(esc).join(',')).join('\n');
}
