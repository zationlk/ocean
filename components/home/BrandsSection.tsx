export default function BrandsSection() {
  const brands = [
    { name: "Philips", color: "#0B3D91" },
    { name: "Osram", color: "#E2001A" },
    { name: "Havells", color: "#E8441F" },
    { name: "Wipro", color: "#1E3D87" },
    { name: "Syska", color: "#D91E2A" },
    { name: "Crompton", color: "#E87700" },
    { name: "Bajaj", color: "#003DA5" },
    { name: "Panasonic", color: "#003087" },
  ];

  return (
    <section className="py-14 bg-white border-y border-brand-border">
      <div className="container-custom">
        <div className="text-center mb-10">
          <p className="text-brand-text text-sm font-medium uppercase tracking-wider">
            Trusted Brands We Carry
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="group flex items-center justify-center w-32 h-14 rounded-xl border border-brand-border bg-white hover:border-brand-primary hover:shadow-card transition-all duration-300 px-4"
            >
              <span
                className="font-display font-bold text-lg transition-colors duration-300 group-hover:opacity-100 opacity-50"
                style={{ color: brand.color }}
              >
                {brand.name}
              </span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-brand-text mt-8 opacity-70">
          + many more international brands available in-store
        </p>
      </div>
    </section>
  );
}
