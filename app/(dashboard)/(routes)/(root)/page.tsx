import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/courses-list";
import { currentUser, auth } from "@clerk/nextjs/server";
import InfoCard from "./_components/InfoCard";

import { CheckCircle, Clock } from "lucide-react";
import DashboardCarousel from "@/components/dashboard-carousel";
import Categories from "../search/_components/categories";
import { db } from "@/lib/db";
import { getCoursesDashboard } from "@/actions/get-courses-dashboard";
import { Separator } from "@/components/ui/separator";
import SearchInput from "@/components/search-input";
import CoursesListDashboard from "@/components/courses-list-dashboard";
import CourseCommentWithStartForm from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-comment-with-star-form";
interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}
const Dashboard = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();
  // let userId = "user_2c7WDRhRgaTXgF3G3JIaInZbQD4";
  // const user = await currentUser();
  console.log("searchParams =>", searchParams.categoryId);

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });
  const courseTotal = await db.course.count({
    where: {
      isPublished: true,
    },
  });
  console.log(courseTotal);
  const courses = await getCoursesDashboard({
    ...searchParams,
  });
  console.log(courses);
  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId!
  );

  // const { completedCourses, coursesInProgress } = await getDashboardCourses(
  // 	user?.id!
  // );

  return (
    <>
      <DashboardCarousel />

      {userId && (
        <div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <InfoCard
                icon={Clock}
                label="In Progress"
                numberOfItems={coursesInProgress.length}
              />
              <InfoCard
                icon={CheckCircle}
                label="Completed"
                numberOfItems={completedCourses.length}
                variant="success"
              />
            </div>
            <CoursesList items={[...coursesInProgress, ...completedCourses]} />
          </div>
        </div>
      )}

      <div className="flex-col py-2 p-3">
        <h2 className="text-2xl pb-2 gap-4  h3-bold text-slate-600 ">
          All the skills you need in one place
        </h2>
        <p className="text-xl p-regular-20 md:p-regular-24 text-slate-600">
          From critical workplace skills to technical topics, our catalog
          supports well-rounded professional development.
        </p>
      </div>

      <div className="flex-col py-2 p-3">
        <p className="text-slate-600 text-xl">
          A broad selection of courses Choose from over {courseTotal} online
          video courses with new additions published every month
        </p>
      </div>
      {/* <div className="px-6 space-x-4">
        <div className="p-6 md:mb-0 block">
          <SearchInput />
        </div>
        <div className="space-y-7 p-6">
          <Categories items={categories} />
        </div>
        <Separator />
        <div className="space-y-7 p-6">
          <CoursesListDashboard items={courses} />
        </div>
      </div> */}
    </>
  );
};

export default Dashboard;
