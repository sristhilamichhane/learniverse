import { db } from "@/lib/db";
import { Attachment, Chapter, CourseRatting } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: courseId,
        },
      },
    });
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: {
        price: true,
        totalRating: true,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });
    if (!chapter || !course) {
      throw new Error("Chapter or Course not found");
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;
    // let courseRatting: CourseRatting[] = [];

    let courseRattingWithUser: (CourseRatting & {
      userName: string;
      userImage: string;
    })[] = [];

    const courseRatting = await db.courseRatting.findMany({
      where: {
        courseId: courseId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    courseRattingWithUser = await Promise.all(
      courseRatting.map(async (rating) => {
        try {
          const clerkUser = await clerkClient.users.getUser(rating.userId);
          return {
            ...rating,
            userName:
              `${clerkUser.firstName ?? ""} ${
                clerkUser.lastName ?? ""
              }`.trim() || "Unknown User",
            userImage: clerkUser.imageUrl,
          };
        } catch (err) {
          // Fallback in case user not found or error occurs
          return {
            ...rating,
            userName: "Unknown User",
            userImage:
              "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          };
        }
      })
    );

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });
    }
    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId,
        },
      });

      console.log('["COURSE', course);
      console.log('["PURCHASE', purchase);

      console.log('["MUX_DATA', muxData);
      console.log('["CHAPTER', chapter);

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
      console.log('["NEXT_CHAPTER', nextChapter);
    }
    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    console.log('["USER_PROGRESS', userProgress);

    return {
      chapter,
      course,
      muxData,
      attachments,
      courseRatting: courseRattingWithUser,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log("[GET_CHAPTERS]", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      courseRatting: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
