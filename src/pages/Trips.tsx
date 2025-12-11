import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TripCard from "@/components/TripCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getActiveTrips } from "@/data/trips";

const Trips = () => {
  const allTrips = getActiveTrips();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

  const durations = ["2D/1N", "3D/2N", "3N/2D", "4D/3N", "5D/4N"];

  const filteredTrips = allTrips.filter((trip) => {
    const matchesSearch = trip.tripName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.locations?.some(loc => loc.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDuration = !selectedDuration || trip.duration === selectedDuration;
    
    return matchesSearch && matchesDuration;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDuration(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 gradient-ocean">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Explore Konkan Trips
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Discover our curated collection of adventures along the stunning Konkan coast
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-card border-b border-border sticky top-16 md:top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search destinations, trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Duration Filter */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground hidden md:block" />
              {durations.map((duration) => (
                <Badge
                  key={duration}
                  variant={selectedDuration === duration ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setSelectedDuration(selectedDuration === duration ? null : duration)}
                >
                  {duration}
                </Badge>
              ))}
              {(searchQuery || selectedDuration) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {filteredTrips.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">No trips found matching your criteria</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.map((trip) => (
                  <TripCard key={trip.tripId} trip={trip} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Trips;
