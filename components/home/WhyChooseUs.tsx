import { Shield, Award, Truck, HeadphonesIcon, Zap, Star } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "We source only the finest LED lighting and electrical products from trusted international manufacturers.",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    icon: Shield,
    title: "Warranty Assured",
    description:
      "All our products come with manufacturer warranties, giving you complete peace of mind.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Zap,
    title: "Energy Efficient",
    description:
      "Our LED solutions save up to 70% on electricity costs compared to traditional lighting.",
    color: "bg-teal-50 text-brand-primary",
  },
  {
    icon: Truck,
    title: "Island-Wide Delivery",
    description:
      "We deliver across Sri Lanka, ensuring your lighting solutions reach you safely and on time.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Support",
    description:
      "Our knowledgeable team provides professional advice to help you choose the right lighting solutions.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Star,
    title: "Trusted Brand",
    description:
      "Years of experience serving homes, businesses, and commercial projects across Sri Lanka.",
    color: "bg-orange-50 text-orange-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-brand-bg">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover">
              <img
                src="https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=700&q=80"
                alt="Why Choose Ocean Lighting"
                className="w-full h-[500px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/40 to-transparent" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-card p-6 max-w-[220px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-gradient rounded-xl flex items-center justify-center">
                  <Award size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">10+ Years</div>
                  <div className="text-xs text-brand-text">Experience</div>
                </div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-brand-text mt-1">Trusted by 1000+ customers</p>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-teal-gradient rounded-2xl opacity-20 rotate-12" />
          </div>

          {/* Right: Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 text-brand-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Why Choose Us
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Trusted Lighting Partner in Sri Lanka
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-brand-text mb-10 leading-relaxed">
              Ocean Lighting Solutions has been transforming spaces across Sri Lanka with premium lighting products and expert service. We combine quality, affordability, and expertise to deliver exceptional results.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-brand-border hover:border-brand-primary hover:shadow-card transition-all duration-300 group"
                >
                  <div className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-brand-text leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
