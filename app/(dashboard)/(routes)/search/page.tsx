import { db } from "@/lib/db";
import Categories from "./_components/categories";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6 space-x-4">
      <Categories items={categories} />
    </div>
  );
};

export default SearchPage;
