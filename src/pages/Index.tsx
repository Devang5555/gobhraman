import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Users, Headphones } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import TripCard from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { getActiveTrips } from "@/data/trips";

const Index = () => {
  const trips = getActiveTrips();
  const featuredTrip = trips[0]; // Malvan trip
  const otherTrips = trips.slice(1, 5);

  const features = [
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "All trips include first-aid support and verified accommodations"
    },
    {
      icon: Users,
      title: "Small Groups",
      description: "Maximum 40 travelers for a more intimate experience"
    },
    {
      icon: Star,
      title: "Expert Guides",
      description: "Local guides with deep knowledge of Konkan culture"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock assistance during your entire trip"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <HeroSection />

      {/* Featured Trip */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Featured Adventure</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
                Most Popular Trip
              </h2>
            </div>
          </div>
          
          <TripCard trip={featuredTrip} featured />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Why GoBhraman</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
              Travel with Confidence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 text-center shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Trips */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Explore More</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
                Upcoming Adventures
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/trips">
                View All Trips
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherTrips.map((trip) => (
              <TripCard key={trip.tripId} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready for Your Konkan Adventure?
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-xl mx-auto mb-8">
            Join our next group trip and create unforgettable memories along the beautiful Konkan coast.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/trips">
                Browse Trips
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
              What Travelers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya Sharma",
                location: "Mumbai",
                text: "The Malvan trip was incredible! The scuba diving experience and authentic Malvani food made it unforgettable.",
                rating: 5
              },
              {
                name: "Rahul Deshmukh",
                location: "Pune",
                text: "Well-organized trip with a fantastic guide. Sindhudurg Fort at sunset was magical. Highly recommend!",
                rating: 5
              },
              {
                name: "Anjali Patil",
                location: "Nashik",
                text: "Perfect weekend getaway! The team took care of everything. Already planning my next trip with GoBhraman.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 shadow-card"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-sunset text-sunset" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-medium text-card-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
