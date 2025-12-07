import CategoryFilter from "@/components/shared/Categoryfilter/Categoryfilter";
import GreetingCardsGrid from "@/components/shared/GreetingCardsGrid/GreetingCardsGrid";
import One from "@/components/shared/Home/One";
import PricingCards from "@/components/shared/PricingCards/PricingCards";

export default function Home() {
  return (
    <div>
      {/* <One /> */}
      <PricingCards />
      {/* <CategoryFilter mainCategoryCodename="bd" />
      <CategoryFilter mainCategoryCodename="weddinganniversary" />
      <CategoryFilter mainCategoryCodename="calendar" /> */}
    </div>
  );
}
