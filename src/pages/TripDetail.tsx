import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  MapPin, Clock, Users, Calendar, Phone, Mail, 
  Check, X, ChevronRight, ArrowLeft, Share2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTrip, getTripPrice, formatPrice } from "@/data/trips";
import { useToast } from "@/hooks/use-toast";

const TripDetail = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const trip = getTrip(tripId || "");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { toast } = useToast();

  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Trip Not Found</h1>
          <p className="text-muted-foreground mb-8">The trip you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/trips">Browse All Trips</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const price = getTripPrice(trip);
  const hasMultiplePrices = typeof trip.price === 'object' && trip.price.fromPune;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: trip.tripName,
        text: trip.summary,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Trip link has been copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh]">
        <img
          src={trip.images[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"}
          alt={trip.tripName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
        
        {/* Back Button */}
        <Link 
          to="/trips"
          className="absolute top-24 md:top-28 left-4 md:left-8 flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden md:inline">Back to Trips</span>
        </Link>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary text-primary-foreground">{trip.duration}</Badge>
              {trip.locations?.slice(0, 3).map((loc) => (
                <Badge key={loc} variant="secondary" className="bg-background/20 text-primary-foreground border-0">
                  {loc}
                </Badge>
              ))}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              {trip.tripName}
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              {trip.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Highlights */}
              {trip.highlights && (
                <div className="mb-8">
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Trip Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {trip.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-card-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <Tabs defaultValue="itinerary" className="w-full">
                <TabsList className="w-full justify-start mb-6 bg-muted h-auto p-1 flex-wrap">
                  <TabsTrigger value="itinerary" className="flex-1 md:flex-none">Itinerary</TabsTrigger>
                  <TabsTrigger value="inclusions" className="flex-1 md:flex-none">What's Included</TabsTrigger>
                  <TabsTrigger value="policy" className="flex-1 md:flex-none">Policies</TabsTrigger>
                </TabsList>

                <TabsContent value="itinerary" className="space-y-6">
                  {trip.itinerary ? (
                    trip.itinerary.map((day) => (
                      <div key={day.day} className="bg-card rounded-xl border border-border overflow-hidden">
                        <div className="bg-primary/5 px-6 py-4 border-b border-border">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                              {day.day}
                            </span>
                            <h3 className="font-serif text-lg font-semibold text-card-foreground">
                              {day.title}
                            </h3>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {day.schedule.map((item, index) => (
                              <div key={index} className="flex gap-4">
                                <div className="w-16 flex-shrink-0">
                                  <span className="text-sm font-medium text-primary">{item.time}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-card-foreground">{item.activity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Detailed itinerary coming soon. Contact us for more information.</p>
                  )}
                </TabsContent>

                <TabsContent value="inclusions" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inclusions */}
                    <div className="bg-card rounded-xl border border-border p-6">
                      <h3 className="font-serif text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                        <Check className="w-5 h-5 text-forest" />
                        What's Included
                      </h3>
                      {trip.inclusions ? (
                        <ul className="space-y-3">
                          {trip.inclusions.map((item, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                              <Check className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground text-sm">Contact us for inclusion details.</p>
                      )}
                    </div>

                    {/* Exclusions */}
                    <div className="bg-card rounded-xl border border-border p-6">
                      <h3 className="font-serif text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                        <X className="w-5 h-5 text-destructive" />
                        Not Included
                      </h3>
                      {trip.exclusions ? (
                        <ul className="space-y-3">
                          {trip.exclusions.map((item, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                              <X className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground text-sm">Contact us for exclusion details.</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="policy" className="space-y-6">
                  {trip.cancellationPolicy && (
                    <div className="bg-card rounded-xl border border-border p-6">
                      <h3 className="font-serif text-lg font-semibold text-card-foreground mb-4">
                        Cancellation Policy
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(trip.cancellationPolicy).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                            <span className="text-sm text-muted-foreground">
                              {key.replace(/_/g, ' ').replace('>=', '≥ ').replace('<=', '≤ ')}
                            </span>
                            <span className="text-sm font-medium text-card-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {trip.notes && (
                    <div className="bg-accent/10 rounded-xl p-6">
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Important Note</h3>
                      <p className="text-muted-foreground">{trip.notes}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                {/* Booking Card */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
                  <div className="mb-6">
                    {hasMultiplePrices && typeof trip.price === 'object' && (
                      <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                        <span>From Pune</span>
                        <span className="font-medium">{formatPrice(trip.price.fromPune!)}</span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">{formatPrice(price)}</span>
                      <span className="text-muted-foreground">per person</span>
                    </div>
                    {hasMultiplePrices && (
                      <p className="text-xs text-muted-foreground mt-1">From Mumbai</p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-card-foreground">{trip.duration}</span>
                    </div>
                    {trip.capacity && (
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-card-foreground">Max {trip.capacity} travelers</span>
                      </div>
                    )}
                    {trip.availableDates && (
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-card-foreground">
                          Next: {new Date(trip.availableDates[0]).toLocaleDateString('en-IN', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {trip.booking && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Book with {formatPrice(trip.booking.advance)} advance
                    </p>
                  )}

                  <Button 
                    className="w-full mb-3" 
                    size="lg"
                    onClick={() => setIsBookingOpen(true)}
                  >
                    Book This Trip
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Trip
                  </Button>
                </div>

                {/* Contact Card */}
                {trip.contact && (
                  <div className="bg-secondary rounded-xl p-6">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                      Need Help?
                    </h3>
                    <div className="space-y-3">
                      <a 
                        href={`tel:${trip.contact.phone}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {trip.contact.phone}
                      </a>
                      <a 
                        href={`mailto:${trip.contact.email}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {trip.contact.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      <BookingModal 
        trip={trip}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};

export default TripDetail;
