import Product from '../../models/Product';
import dbconnect from '../../lib/dbConnect';
import CategoryTabs from '../../components/homepage/CategoryTab';
import HeroSection from '../../components/homepage/HeroSection';
import FeaturedProducts from '../../components/homepage/FeatureProducts';

export default async function HomePage() {
  await dbconnect();

  // Convert Mongoose documents to plain objects and stringify _id
  const products = await Product.find({}).lean();
  const plainProducts = products.map((product) => ({
    ...product,
    _id: product._id.toString(),
  }));

  return (
    <div className="min-h-screen bg-primary transition-colors duration-500">
      <main className="min-h-screen">
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* Featured Products */}
        <FeaturedProducts products={plainProducts.slice(0, 4)} />
        
        {/* Category Tabs */}
        <CategoryTabs products={plainProducts} />
        
        {/* Newsletter Section */}
        <section className="py-16 bg-gold transition-all duration-500">
          <div className="max-w-4xl mx-auto text-center px-4 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Stay Updated with Our Latest Collections
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto drop-shadow">
              Be the first to know about new arrivals, exclusive offers, and special events
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 bg-primary text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300 hover:scale-105"
              />
              <button className="px-8 py-3 bg-primary text-gold font-semibold rounded-lg hover:bg-secondary hover:scale-105 transition-all duration-300 shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-secondary transition-all duration-500">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '10K+', label: 'Happy Customers', icon: '😊' },
                { number: '500+', label: 'Premium Designs', icon: '💎' },
                { number: '99%', label: 'Satisfaction Rate', icon: '⭐' },
                { number: '24/7', label: 'Customer Support', icon: '🛟' },
              ].map((stat, i) => (
                <div key={i} className="group p-6 bg-primary rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-secondary/20 hover:border-gold/30 hover:scale-105 animate-fadeIn">
                  <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-gold mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-secondary font-medium group-hover:text-primary transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center px-4 relative z-10 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 transition-colors duration-300">
              Ready to Find Your Perfect Piece?
            </h2>
            <p className="text-secondary text-lg mb-8 max-w-2xl mx-auto transition-colors duration-300">
              Explore our complete collection and discover jewellery that tells your unique story
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/shop"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gold hover:bg-gold/90 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Shop All Products
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/about"
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300"
              >
                Our Story
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
