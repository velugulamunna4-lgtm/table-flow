'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { VegIndicator } from '@/components/ui/VegIndicator';
import { SpiceLevel } from '@/components/ui/SpiceLevel';
import { restaurantConfig } from '@/config/restaurant.config';
import { MenuItem, VegType } from '@/types';
import menuRawData from '@/data/mock/menu.json';
const menuData = menuRawData as MenuItem[];
import { formatCurrency } from '@/lib/utils';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  QrCode,
  Calendar,
  Users,
  Check,
  Star,
  ArrowRight,
} from 'lucide-react';

export default function RestaurantPublicSitePage() {
  const params = useParams();
  const slug = params?.restaurantSlug as string;

  const [bookingName, setBookingName] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-11-23');
  const [bookingTime, setBookingTime] = useState('19:30');
  const [bookingGuests, setBookingGuests] = useState('4');
  const [booked, setBooked] = useState(false);

  const specials = menuData.filter((i) => i.isSpecial);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
  };

  return (
    <div className="min-h-screen bg-canvas font-sans text-content-primary">
      {/* Brand Topbar */}
      <header className="sticky top-0 z-30 bg-canvas/90 backdrop-blur-md border-b border-borderSubtle">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-black text-xl shadow-accent">
              TF
            </div>
            <div>
              <div className="font-heading font-black text-xl text-content-primary leading-tight">
                {restaurantConfig.name}
              </div>
              <div className="text-xs text-content-secondary hidden sm:block">
                {restaurantConfig.tagline}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/t/7">
              <Button
                variant="primary"
                size="md"
                leftIcon={<QrCode className="w-4 h-4" />}
                className="shadow-accent"
              >
                Scan & Order at Table
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner with Food Photography */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-canvas via-surface to-canvas border-b border-borderSubtle">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sun/25 text-content-primary text-xs font-bold uppercase tracking-wider">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span>Finest Indian Flavors in Hyderabad</span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl text-content-primary leading-tight">
              A Symphony of Spices & Royal Traditions
            </h1>

            <p className="text-content-secondary text-base sm:text-lg leading-relaxed">
              From slow-simmered Nizami dum biryanis to charcoal-grilled tandoori delicacies, experience pure culinary craftsmanship crafted for discerning palates.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/t/7">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Live Digital Menu
                </Button>
              </Link>
              <a href="#reserve">
                <Button variant="secondary" size="lg">
                  Reserve a Table
                </Button>
              </a>
            </div>

            {/* Quick badges */}
            <div className="pt-4 flex items-center gap-6 text-xs text-content-secondary">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{restaurantConfig.openingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Hitec City, Hyderabad</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1000&auto=format&fit=crop&q=80"
                alt="Hyderabadi Feast"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Chef Specials */}
      <section className="py-16 max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
            Handcrafted Delights
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-content-primary">
            Chef's Signature Creations
          </h2>
          <p className="text-sm text-content-secondary max-w-md mx-auto">
            Signature recipes passed down across generations, prepared fresh with artisanal ghee and whole ground spices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specials.map((dish) => (
            <Card key={dish.id} padding="none" className="overflow-hidden group">
              <div className="relative h-48 overflow-hidden bg-canvas">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  <VegIndicator type={dish.vegType} size="md" />
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-heading font-bold text-base text-content-primary line-clamp-1">
                  {dish.name}
                </h4>
                <p className="text-xs text-content-secondary line-clamp-2">
                  {dish.description}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-borderSubtle">
                  <span className="font-heading font-black text-lg text-content-primary">
                    {formatCurrency(dish.price)}
                  </span>
                  <Link
                    href="/t/7"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Order</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Reservation Section */}
      <section id="reserve" className="py-16 bg-surface border-t border-borderSubtle">
        <div className="max-w-xl mx-auto px-4 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
              Dine With Us
            </span>
            <h2 className="font-heading font-black text-3xl text-content-primary">
              Book Your Table
            </h2>
            <p className="text-xs sm:text-sm text-content-secondary">
              Reserve your dining spot in advance for an exquisite candlelight or family feast.
            </p>
          </div>

          <Card padding="lg">
            {booked ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-status-success/15 text-status-success flex items-center justify-center text-3xl">
                  ✓
                </div>
                <h3 className="font-heading font-black text-2xl text-content-primary">
                  Table Reserved!
                </h3>
                <p className="text-sm text-content-secondary">
                  Thank you, <strong>{bookingName || 'Guest'}</strong>. Your table for {bookingGuests} guests on {bookingDate} at {bookingTime} has been reserved!
                </p>
                <Button variant="secondary" size="sm" onClick={() => setBooked(false)}>
                  Book Another Table
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-content-secondary block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full p-3 rounded-2xl bg-canvas border border-borderSubtle text-sm focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-content-secondary block mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-canvas border border-borderSubtle text-sm focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-content-secondary block mb-1">
                      Time Slot
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-canvas border border-borderSubtle text-sm focus:ring-1 focus:ring-primary"
                    >
                      <option value="12:30">12:30 PM (Lunch)</option>
                      <option value="13:30">01:30 PM (Lunch)</option>
                      <option value="19:30">07:30 PM (Dinner)</option>
                      <option value="20:30">08:30 PM (Dinner)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-content-secondary block mb-1">
                    Number of Guests
                  </label>
                  <select
                    value={bookingGuests}
                    onChange={(e) => setBookingGuests(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-canvas border border-borderSubtle text-sm focus:ring-1 focus:ring-primary"
                  >
                    <option value="2">2 Guests (Couple Table)</option>
                    <option value="4">4 Guests (Family Table)</option>
                    <option value="6">6 Guests (Large Table)</option>
                    <option value="8">8+ Guests (Celebration Feasting)</option>
                  </select>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full font-bold shadow-accent">
                  Confirm Table Reservation
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-borderSubtle text-center text-xs text-content-secondary space-y-2">
        <p className="font-bold text-content-primary">
          {restaurantConfig.name} · {restaurantConfig.address}, {restaurantConfig.city}
        </p>
        <p>Reservations & Enquiries: {restaurantConfig.phone} · Powered by Table Flow</p>
      </footer>
    </div>
  );
}
