import CategoryFilter from "@/components/shared/Categoryfilter/Categoryfilter";
import GreetingCardsGrid from "@/components/shared/GreetingCardsGrid/GreetingCardsGrid";
import One from "@/components/shared/Home/One";

export default function Home() {
  return (
    <div>
      <One />
      <GreetingCardsGrid />
      {/* <CategoryFilter mainCategoryCodename="bd" />
      <CategoryFilter mainCategoryCodename="weddinganniversary" />
      <CategoryFilter mainCategoryCodename="calendar" /> */}
    </div>
  );
}
