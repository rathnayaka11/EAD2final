import { Link } from 'react-router-dom';
import { Calendar, Clock, Shield, Smartphone, Users, Award } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Appointment Booking',
      description: 'Book appointments with top doctors in just a few clicks',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access healthcare services anytime, anywhere',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and completely secure',
    },
    {
      icon: Smartphone,
      title: 'Online Consultations',
      description: 'Connect with doctors via video calls from home',
    },
    {
      icon: Users,
      title: 'Expert Doctors',
      description: 'Access to a network of verified healthcare professionals',
    },
    {
      icon: Award,
      title: 'Quality Care',
      description: 'Receive the best medical care and treatment',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">eChannel</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Health, Our Priority
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Book appointments with verified doctors, get online consultations, and manage your healthcare journey seamlessly.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">500+</p>
            <p className="text-gray-600 mt-2">Expert Doctors</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">10,000+</p>
            <p className="text-gray-600 mt-2">Happy Patients</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">50+</p>
            <p className="text-gray-600 mt-2">Specializations</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose eChannel?
            </h2>
            <p className="text-xl text-gray-600">
              Experience healthcare like never before
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:border-primary-500 border-2 border-transparent">
                <feature.icon className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of patients who trust eChannel for their healthcare needs
          </p>
          <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors inline-block">
            Create Account Now
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 eChannel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}