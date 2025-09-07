import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/MobileMenu";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Shield, 
  Smartphone, 
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Globe,
  Package,
  UserCheck,
  Navigation
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
        <Image
                src="/doorbel-logo.png"
                alt="DoorBel Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold text-green-600">DoorBel</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-green-600 transition-colors">How it Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-green-600 transition-colors">Benefits</a>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/waitlist">Get Started</Link>
              </Button>
            </div>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  🚀 Coming Soon - Join the Waitlist
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Ghana's Next-Gen
                  <span className="text-green-600"> Delivery</span> 
                  <br />Platform is Coming
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join the waitlist for Ghana's most innovative delivery platform. Connect with trusted riders, 
                  track deliveries in real-time, and pay securely with mobile money. Be the first to experience delivery redefined.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6" asChild>
                  <Link href="/waitlist">
                    Join Waitlist
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 text-lg px-8 py-6" asChild>
                  <Link href="/waitlist">
                    Become a Rider
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Early access benefits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Mobile money payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time tracking</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
            <Image
                  src="/hero.jpg"
                  alt="Delivery rider on motorcycle"
                  width={600}
                  height={200}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600">500+</div>
              <div className="text-gray-600">Waitlist Signups</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600">50+</div>
              <div className="text-gray-600">Rider Applications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600">5</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600">Q2</div>
              <div className="text-gray-600">Launch 2024</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Makes DoorBel Special?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building the most comprehensive delivery platform in Ghana with features 
              designed specifically for our local market. Join the waitlist to be the first to experience it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Fast Delivery</CardTitle>
                <CardDescription>
                  Get your packages delivered in record time with our network of verified riders across Ghana.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>
                  Track your delivery in real-time with GPS technology. Know exactly where your package is at all times.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Secure Payments</CardTitle>
                <CardDescription>
                  Pay securely with mobile money (MTN, Vodafone, AirtelTigo) or other preferred payment methods.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>24/7 Service</CardTitle>
                <CardDescription>
                  Our platform operates around the clock. Send packages anytime, anywhere in Ghana.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Mobile App</CardTitle>
                <CardDescription>
                  Download our mobile app for iOS and Android. Manage deliveries on the go with ease.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Verified Riders</CardTitle>
                <CardDescription>
                  All our riders are background-checked and verified. Your packages are in safe hands.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How DoorBel Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with DoorBel is simple. Follow these easy steps to send your first package.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Package className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Order</h3>
              <p className="text-gray-600">
                Enter pickup and delivery locations, add package details, and choose your preferred delivery time.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <UserCheck className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rider Assigned</h3>
              <p className="text-gray-600">
                We'll match you with the nearest available rider. Get notified when your rider is on the way.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Navigation className="h-12 w-12 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track & Deliver</h3>
              <p className="text-gray-600">
                Track your package in real-time and get notified when it's delivered. Rate your experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Waitlist Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Join the Waitlist?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Be part of Ghana's delivery revolution. Join thousands of early adopters who are already excited about DoorBel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Early Access</h3>
                <p className="text-gray-600 mb-4">
                  Be among the first to experience DoorBel when we launch. Get priority access to all new features and updates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Rider Benefits</h3>
                <p className="text-gray-600 mb-4">
                  Early riders will enjoy reduced commission fees for the first month and priority order assignments.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Exclusive Updates</h3>
                <p className="text-gray-600 mb-4">
                  Get exclusive updates about our progress, new features, and launch timeline. Be part of our journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Be Part of the Revolution?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of early adopters who are already excited about DoorBel. 
            Be the first to experience Ghana's next-generation delivery platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6" asChild>
              <Link href="/waitlist">
                <Smartphone className="mr-2 h-5 w-5" />
                Join Waitlist
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-6" asChild>
              <Link href="/waitlist">
                <Zap className="mr-2 h-5 w-5" />
                Start Delivering
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
          <Image
                  src="/doorbel-logo.png"
                  alt="DoorBel Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold">DoorBel</span>
              </div>
              <p className="text-gray-400">
                Ghana's next-generation delivery platform coming soon. Join the waitlist to be the first to experience fast, secure, and reliable package delivery.
              </p>
              <div className="flex space-x-4">
                <Globe className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-400">Coming to Ghana soon</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Customers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Send Package</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Delivery</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Riders</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Become a Rider</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rider App</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Earnings</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 DoorBel. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}