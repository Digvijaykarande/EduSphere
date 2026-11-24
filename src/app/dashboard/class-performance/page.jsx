import TeacherOnly from "@/components/pages/dashboard/class-performance/TeacherOnly";
import ClassPerformancePage from "@/components/pages/dashboard/class-performance/ClassPerformancePage";

export const metadata = {
  title: "Class Performance — EduSphere",
};

export default function Page() {
  return (
    <TeacherOnly>
      <ClassPerformancePage />
    </TeacherOnly>
  );
}