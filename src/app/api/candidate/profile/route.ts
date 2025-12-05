import { NextResponse } from "next/server";
import {
  CandidateService,
  DepartmentService,
  InstitutionService,
} from "@/services";
import { validateCandidateAuth } from "@/lib/auth/candidate-auth";

export async function GET() {
  try {
    const auth = await validateCandidateAuth();

    if ("error" in auth) {
      return auth.error;
    }

    const { userId } = auth;

    const profile = await CandidateService.getProfileByUserId(userId);

    if (!profile?.user || !profile?.candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    const { user, candidate } = profile;

    const [departments, institutions] = await Promise.all([
      DepartmentService.getAll(),
      InstitutionService.getAll(true),
    ]);

    const selectedInstitution = institutions.find(
      (institution: any) => institution.id === candidate?.institution_id
    );
    const selectedDepartment = departments.find(
      (department: any) => department.id === candidate?.department_id
    );

    return NextResponse.json(
      {
        user: {
          firstName: user.first_name ?? "",
          lastName: user.last_name ?? "",
          age: candidate?.age.toString(),
          gender: candidate?.gender ?? "male",
          studentId: candidate?.student_id ?? "",
          institution: {
            label: selectedInstitution?.name,
            value: selectedInstitution?.id,
          },
          department: {
            label: selectedDepartment?.name,
            value: selectedDepartment?.id,
          },
          semester: {
            value: candidate?.semester,
            label: candidate?.semester.toString(),
          },
          bio: candidate?.bio ?? "",
          cgpa: candidate?.cgpa?.toString(),
          resume: candidate?.resume,
          additionalDocuments: candidate?.additional_documents,
        },
        departments: departments.map(
          (department: { id: string | number; full_name: string }) => ({
            value: department.id,
            label: department.full_name,
          })
        ),
        institutions: institutions.map(
          (institution: { id: string | number; name: string }) => ({
            value: institution.id,
            label: institution.name,
          })
        ),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/candidate/profile error:", err);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 400 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await validateCandidateAuth();

    if ("error" in auth) {
      return auth.error;
    }

    const { userId, candidate } = auth;
    const body = await req.json();

    // Get or create institution
    const institution = await InstitutionService.getOrCreate({
      id: body.institution.value,
      name: body.institution.label,
    });

    await CandidateService.updateProfile({
      userId,
      candidateId: candidate.id,
      firstName: body.firstName,
      lastName: body.lastName,
      age: body.age,
      gender: body.gender,
      studentId: body.studentId,
      semester: body.semester.value,
      institutionId: institution.id,
      departmentId: body.department.value,
      bio: body.bio,
      cgpa: body.cgpa,
      resume: body.resume,
      additionalDocuments: body.additionalDocuments,
    });

    return NextResponse.json(
      {
        message: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/candidate/profile error:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
