import { Link } from "react-router-dom";
import { MapPin, Clock, Users, ChevronRight } from "lucide-react";
import { Trip, getTripPrice, formatPrice } from "@/data/trips";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TripCardProps {
  trip: Trip;
  featured?: boolean;
}

const TripCard = ({ trip, featured = false }: TripCardProps) => {
  const price = getTripPrice(trip);
  const hasMultiplePrices = typeof trip.price === 'object' && trip.price.fromPune;

  return (
    <Link
      to={`/trips/${trip.tripId}`}
      className={cn(
        "group block bg-card rounded-xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all duration-300",
        featured && "lg:flex"
      )}
    >
      {/* Image */}
      <div className={cn(
        "relative overflow-hidden",
        featured ? "lg:w-1/2 h-64 lg:h-auto" : "h-52"
      )}>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent z-10" />
        <img
          src={trip.images[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"}
          alt={trip.tripName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-4 left-4 z-20 bg-primary text-primary-foreground">
          {trip.duration}
        </Badge>
        {trip.availableDates && (
          <Badge variant="secondary" className="absolute top-4 right-4 z-20">
            Next: {new Date(trip.availableDates[0]).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "p-5",
        featured && "lg:w-1/2 lg:p-8 lg:flex lg:flex-col lg:justify-center"
      )}>
        <h3 className={cn(
          "font-serif font-bold text-card-foreground group-hover:text-primary transition-colors",
          featured ? "text-2xl lg:text-3xl mb-3" : "text-xl mb-2"
        )}>
          {trip.tripName}
        </h3>
        
        <p className={cn(
          "text-muted-foreground line-clamp-2 mb-4",
          featured ? "text-base lg:text-lg" : "text-sm"
        )}>
          {trip.summary}
        </p>

        {/* Highlights for featured */}
        {featured && trip.highlights && (
          <ul className="hidden lg:block space-y-2 mb-6">
            {trip.highlights.slice(0, 4).map((highlight, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {highlight}
              </li>
            ))}
          </ul>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
          {trip.locations && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary" />
              {trip.locations.slice(0, 2).join(", ")}
              {trip.locations.length > 2 && ` +${trip.locations.length - 2}`}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-primary" />
            {trip.duration}
          </span>
          {trip.capacity && (
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-primary" />
              Max {trip.capacity}
            </span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between pt-4 border-t border-border">
          <div>
            {hasMultiplePrices && typeof trip.price === 'object' && (
              <p className="text-xs text-muted-foreground mb-1">
                From Pune: {formatPrice(trip.price.fromPune!)}
              </p>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(price)}
              </span>
              <span className="text-sm text-muted-foreground">per person</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            View Details
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
