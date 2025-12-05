import { AudienceType, InstitutionStatus, PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  const departments = [
    // Engineering & Technology
    {
      name: "Computer Science",
      short_name: "CSE",
      full_name: "Department of Computer Science and Engineering",
      desc: "Focuses on software development, programming, and computing systems",
    },
    {
      name: "Information Technology",
      short_name: "IT",
      full_name: "Department of Information Technology",
      desc: "Focuses on IT systems, networks, and applications",
    },
    {
      name: "Electronics & Communication",
      short_name: "ECE",
      full_name: "Department of Electronics and Communication Engineering",
      desc: "Covers electronics, communication systems, and VLSI",
    },
    {
      name: "Electrical Engineering",
      short_name: "EE",
      full_name: "Department of Electrical Engineering",
      desc: "Covers circuits, power systems, and electrical machines",
    },
    {
      name: "Mechanical Engineering",
      short_name: "ME",
      full_name: "Department of Mechanical Engineering",
      desc: "Focuses on mechanical systems, manufacturing, and design",
    },
    {
      name: "Civil Engineering",
      short_name: "CE",
      full_name: "Department of Civil Engineering",
      desc: "Covers construction, structural design, and infrastructure",
    },
    {
      name: "Chemical Engineering",
      short_name: "ChE",
      full_name: "Department of Chemical Engineering",
      desc: "Covers chemical processes, production, and industrial chemistry",
    },
    {
      name: "Biomedical Engineering",
      short_name: "BME",
      full_name: "Department of Biomedical Engineering",
      desc: "Integrates engineering with medical sciences",
    },
    {
      name: "Aerospace Engineering",
      short_name: "AE",
      full_name: "Department of Aerospace Engineering",
      desc: "Focuses on aircraft, spacecraft, and aerodynamics",
    },
    {
      name: "Automobile Engineering",
      short_name: "AutoE",
      full_name: "Department of Automobile Engineering",
      desc: "Covers vehicle design, manufacturing, and mechanics",
    },
    {
      name: "Industrial Engineering",
      short_name: "IE",
      full_name: "Department of Industrial Engineering",
      desc: "Focuses on optimizing industrial processes and systems",
    },

    // Pure Science Departments
    {
      name: "Physics",
      short_name: "PHY",
      full_name: "Department of Physics",
      desc: "Covers theoretical and experimental physics",
    },
    {
      name: "Chemistry",
      short_name: "CHE",
      full_name: "Department of Chemistry",
      desc: "Focuses on organic, inorganic, and physical chemistry",
    },
    {
      name: "Mathematics",
      short_name: "MATH",
      full_name: "Department of Mathematics",
      desc: "Covers pure and applied mathematics",
    },
    {
      name: "Biology",
      short_name: "BIO",
      full_name: "Department of Biology",
      desc: "Covers botany, zoology, and molecular biology",
    },
    {
      name: "Environmental Science",
      short_name: "ENV",
      full_name: "Department of Environmental Science",
      desc: "Covers ecology, conservation, and environmental studies",
    },

    // Management & Social Sciences
    {
      name: "Management Studies",
      short_name: "MBA",
      full_name: "Department of Management Studies",
      desc: "Covers business administration, management, and HR",
    },
    {
      name: "Economics",
      short_name: "ECO",
      full_name: "Department of Economics",
      desc: "Focuses on economic theory, policy, and finance",
    },
    {
      name: "Psychology",
      short_name: "PSY",
      full_name: "Department of Psychology",
      desc: "Covers human behavior, cognition, and mental health",
    },
    {
      name: "Sociology",
      short_name: "SOC",
      full_name: "Department of Sociology",
      desc: "Studies society, culture, and human interactions",
    },

    // Liberal Arts & Others
    {
      name: "English",
      short_name: "ENG",
      full_name: "Department of English",
      desc: "Focuses on literature, writing, and linguistics",
    },
    {
      name: "History",
      short_name: "HIS",
      full_name: "Department of History",
      desc: "Covers world history, Indian history, and research methods",
    },
    {
      name: "Political Science",
      short_name: "POL",
      full_name: "Department of Political Science",
      desc: "Studies government, policy, and political systems",
    },
    {
      name: "Philosophy",
      short_name: "PHI",
      full_name: "Department of Philosophy",
      desc: "Covers ethics, logic, and metaphysics",
    },
    {
      name: "Law",
      short_name: "LAW",
      full_name: "Department of Law",
      desc: "Focuses on legal systems, corporate law, and constitutional law",
    },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { short_name: dept.short_name },
      update: {},
      create: dept,
    });
  }

  const institutions = [
    {
      name: "Tech University",
      city: "Berlin",
      state: "Berlin",
      status: InstitutionStatus.unverified,
      contact_person: "Dr. John Doe",
      contact_phone_details: "+49 123 456 789",
    },
    {
      name: "Global Institute",
      city: "Munich",
      state: "Bavaria",
      status: InstitutionStatus.verified,
      contact_person: "Ms. Jane Smith",
      contact_phone_details: "+49 987 654 321",
    },
  ];

  await prisma.institution.createMany({
    data: institutions,
    skipDuplicates: true,
  });

  const audienceTypes: AudienceType[] = [
    { name: "Public" },
    { name: "Institution" },
  ] as AudienceType[];

  await prisma.audienceType.createMany({
    data: audienceTypes,
    skipDuplicates: true,
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
