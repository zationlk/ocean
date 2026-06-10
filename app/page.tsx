import HeroSection from "@/components/home/HeroSection"
import CategoriesSection from "@/components/home/CategoriesSection"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import StatsSection from "@/components/home/StatsSection"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import BrandsSection from "@/components/home/BrandsSection"
import CTASection from "@/components/home/CTASection"
import ProductMarquee from "@/components/home/ProductMarquee"
import NewArrivals from "@/components/home/NewArrivals"
import { JsonLd, generateOrganizationSchema, generateLocalBusinessSchema } from "@/components/seo/JsonLd"

export default function HomePage() {
  const organizationSchema = generateOrganizationSchema()
  const localBusinessSchema = generateLocalBusinessSchema()

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />
      <HeroSection />
      <ProductMarquee />
      <CategoriesSection />
      <WhyChooseUs />
      <FeaturedProducts />
      <NewArrivals />
      <StatsSection />
      <TestimonialsSection />
      <BrandsSection />
      <CTASection />
    </>
  )
}