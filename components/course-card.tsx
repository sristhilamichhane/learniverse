import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "./course-progress";
import StarRatingValue from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/star-rating-value";

interface CourseCardProps {
  id: string;
  title: string;
  totalReview: number;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
}
const CourseCard = ({
  id,
  title,
  totalReview,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill src={imageUrl} alt={title} className="object-cover" />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs to-muted-foreground">{category}</p>
          <div className="pt-3 text-sm text-sky-950  font-black flex justify-start items-center gap-x-3 content-center">
            {totalReview}
            {/* <StarRatingValue starSize={"text-2xl"} value={totalReview} /> */}
          </div>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 to-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700">
              {formatPrice(price)}
            </p>
          )}
          <StarRatingValue value={totalReview} />
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
