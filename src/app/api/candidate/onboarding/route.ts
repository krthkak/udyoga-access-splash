import { NextResponse } from "next/server";
import {
  CandidateService,
  DepartmentService,
  InstitutionService,
  UserService,
} from "@/services";
import { validateOnboardingAuth } from "@/lib/auth/candidate-auth";

export async function GET() {
  try {
    const [departments, institutions] = await Promise.all([
      DepartmentService.getAll(),
      InstitutionService.getAll(true),
    ]);

    return NextResponse.json(
      {
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
  } catch (error) {
    console.error("Error fetching onboarding data:", error);
    return NextResponse.json(
      { error: "Failed to fetch onboarding data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await validateOnboardingAuth();

    if ("error" in auth) {
      return auth.error;
    }

    const { userId } = auth;
    const body = await req.json();

    const user = await UserService.getById(userId);
    const candidate = await CandidateService.getByStudentId(body.studentId);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle existing candidate update
    if (candidate) {
      const institution = await InstitutionService.getById(
        body.institution.value
      );

      if (!institution) {
        return NextResponse.json(
          {
            error:
              "Please select appropriate values. There is data mismatch in the data shared by institution and the data entered by you!",
          },
          { status: 400 }
        );
      }

      if (candidate.institution_id !== institution.id) {
        return NextResponse.json(
          {
            error:
              "Please select appropriate values. There is data mismatch in the data shared by institution and the data entered by you!",
          },
          { status: 400 }
        );
      }

      await CandidateService.completeOnboarding({
        userId,
        studentId: body.studentId,
        firstName: body.firstName,
        lastName: body.lastName,
        age: body.age,
        gender: body.gender,
        semester: body.semester.value,
        institutionId: institution.id,
        departmentId: body.department.value,
      });

      return NextResponse.json({ message: "success" }, { status: 200 });
    }

    // Handle new candidate creation
    const institution = await InstitutionService.getOrCreate({
      id: body.institution.value,
      name: body.institution.label,
    });

    await CandidateService.createWithOnboarding({
      userId,
      studentId: body.studentId,
      firstName: body.firstName,
      lastName: body.lastName,
      age: body.age,
      gender: body.gender,
      semester: body.semester.value,
      institutionId: institution.id,
      departmentId: body.department.value,
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Server error!" },
      {
        status: 501,
      }
    );
  }
}
