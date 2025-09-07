"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  CheckCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Users,
  Clock,
  Gift,
  Truck
} from "lucide-react";

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    role: "",
    agreeToTerms: false,
    agreeToMarketing: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to DoorBel!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for joining our waitlist! We'll notify you as soon as DoorBel is available in your area.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                <span>Check your email for confirmation</span>
              </div>
              <Button asChild className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/doorbel-logo.png"
                alt="DoorBel Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold text-green-600">DoorBel</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 mb-4">
              🚀 Coming Soon
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Be the First to Experience
              <span className="text-green-600"> DoorBel</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our exclusive waitlist and get early access to Ghana's most innovative delivery platform. 
              Plus, enjoy early access benefits!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Benefits Section */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-green-600" />
                    <span>Early Access Benefits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Priority Support</h4>
                      <p className="text-sm text-gray-600">Access to our dedicated early user support team</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Exclusive Features</h4>
                      <p className="text-sm text-gray-600">Be the first to try new features and provide feedback</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Early Access</h4>
                      <p className="text-sm text-gray-600">Be among the first to experience DoorBel in Ghana</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Join the Community</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Be part of Ghana's delivery revolution. Connect with other early adopters and help shape the future of logistics in our country.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>500+ people waiting</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Launching Q2 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span>Special Rider Benefits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Early riders will enjoy exclusive benefits when DoorBel launches:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Reduced Commission Fee</h4>
                        <p className="text-sm text-blue-700">Special reduced commission for your first month</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Priority Order Assignment</h4>
                        <p className="text-sm text-blue-700">Get first access to delivery requests</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Enhanced Support</h4>
                        <p className="text-sm text-blue-700">Dedicated rider support team</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Signup Form */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Join the Waitlist</CardTitle>
                <CardDescription>
                  Fill out the form below to secure your spot and get notified when DoorBel launches in your area.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="0201234567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accra">Accra</SelectItem>
                        <SelectItem value="kumasi">Kumasi</SelectItem>
                        <SelectItem value="takoradi">Takoradi</SelectItem>
                        <SelectItem value="tamale">Tamale</SelectItem>
                        <SelectItem value="cape-coast">Cape Coast</SelectItem>
                        <SelectItem value="koforidua">Koforidua</SelectItem>
                        <SelectItem value="sunyani">Sunyani</SelectItem>
                        <SelectItem value="ho">Ho</SelectItem>
                        <SelectItem value="bolgatanga">Bolgatanga</SelectItem>
                        <SelectItem value="wa">Wa</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="role">I want to *</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your interest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Send packages as a customer</SelectItem>
                        <SelectItem value="rider">Deliver packages as a rider</SelectItem>
                        <SelectItem value="both">Both - send and deliver</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                        required
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm">
                        I agree to the <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a> *
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeToMarketing"
                        checked={formData.agreeToMarketing}
                        onCheckedChange={(checked) => handleInputChange('agreeToMarketing', checked as boolean)}
                      />
                      <Label htmlFor="agreeToMarketing" className="text-sm">
                        I'd like to receive updates about DoorBel's launch and new features
                      </Label>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Joining Waitlist..." : "Join Waitlist"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
