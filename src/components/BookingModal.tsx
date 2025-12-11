import { useState } from "react";
import { X, User, Mail, Phone, Users, Calendar, CreditCard, CheckCircle } from "lucide-react";
import { Trip, getTripPrice, formatPrice } from "@/data/trips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ trip, isOpen, onClose }: BookingModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: "1",
    pickupPoint: "mumbai",
    date: "",
  });

  if (!isOpen) return null;

  const hasMultiplePrices = typeof trip.price === 'object' && trip.price.fromPune;
  const selectedPrice = hasMultiplePrices && typeof trip.price === 'object'
    ? (formData.pickupPoint === 'pune' ? trip.price.fromPune! : trip.price.default)
    : getTripPrice(trip);
  
  const totalPrice = selectedPrice * parseInt(formData.travelers);
  const advanceAmount = trip.booking?.advance || 2000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Here you would integrate with payment gateway
      toast({
        title: "Booking Request Submitted!",
        description: "We'll contact you shortly with payment details.",
      });
      setStep(3);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      name: "",
      email: "",
      phone: "",
      travelers: "1",
      pickupPoint: "mumbai",
      date: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-border">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          <h2 className="font-serif text-xl font-bold text-card-foreground pr-8">
            {step === 3 ? "Booking Confirmed!" : `Book: ${trip.tripName}`}
          </h2>
          <p className="text-sm text-muted-foreground">{trip.duration} • {formatPrice(selectedPrice)}/person</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 3 ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-forest/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-forest" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-card-foreground mb-2">
                Thank You, {formData.name}!
              </h3>
              <p className="text-muted-foreground mb-6">
                Your booking request has been received. We'll send payment details to {formData.email} shortly.
              </p>
              <div className="bg-muted rounded-lg p-4 text-left mb-6">
                <p className="text-sm font-medium text-card-foreground mb-2">Booking Summary</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Trip: {trip.tripName}</p>
                  <p>Travelers: {formData.travelers}</p>
                  <p>Pickup: {formData.pickupPoint === 'pune' ? 'Pune' : 'Mumbai'}</p>
                  <p className="font-medium text-card-foreground">
                    Total: {formatPrice(totalPrice)} (Advance: {formatPrice(advanceAmount * parseInt(formData.travelers))})
                  </p>
                </div>
              </div>
              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-primary" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="travelers" className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-primary" />
                        Travelers
                      </Label>
                      <Select
                        value={formData.travelers}
                        onValueChange={(value) => setFormData({ ...formData, travelers: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Person' : 'People'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {hasMultiplePrices && (
                      <div>
                        <Label htmlFor="pickup" className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Pickup Point
                        </Label>
                        <Select
                          value={formData.pickupPoint}
                          onValueChange={(value) => setFormData({ ...formData, pickupPoint: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mumbai">Mumbai ({formatPrice(typeof trip.price === 'object' ? trip.price.default : 0)})</SelectItem>
                            <SelectItem value="pune">Pune ({formatPrice(typeof trip.price === 'object' ? trip.price.fromPune! : 0)})</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium text-card-foreground mb-3">Payment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price per person</span>
                        <span className="text-card-foreground">{formatPrice(selectedPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Travelers</span>
                        <span className="text-card-foreground">× {formData.travelers}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border font-medium">
                        <span className="text-card-foreground">Total Amount</span>
                        <span className="text-primary text-lg">{formatPrice(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Advance to pay now</span>
                        <span className="text-accent font-medium">{formatPrice(advanceAmount * parseInt(formData.travelers))}</span>
                      </div>
                    </div>
                  </div>

                  {trip.booking && (
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        Payment Options
                      </h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p><strong>UPI:</strong> {trip.booking.upi}</p>
                        {trip.booking.bank && (
                          <>
                            <p><strong>Bank:</strong> {trip.booking.bank.name}</p>
                            <p><strong>A/C:</strong> {trip.booking.bank.accountNumber}</p>
                            <p><strong>IFSC:</strong> {trip.booking.bank.ifsc}</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-3 mt-6">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                )}
                <Button type="submit" className="flex-1">
                  {step === 1 ? "Continue to Payment" : "Confirm Booking"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
