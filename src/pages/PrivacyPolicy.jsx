import React from 'react'
import { Link } from 'react-router-dom'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-luxury-900 to-dark-900">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-luxury-900/90 to-gold-900/90">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Your privacy is important to us. Learn how we protect and handle your personal information.
            </p>
            <div className="flex items-center justify-center space-x-2 text-gold-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="text-gray-400">/</span>
              <span className="text-white">Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10">
              
              {/* Last Updated */}
              <div className="mb-8 p-4 bg-gold-500/10 rounded-lg border border-gold-500/20">
                <p className="text-gold-400 font-medium">
                  <strong>Last Updated:</strong> January 2025
                </p>
              </div>

              {/* Introduction */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Introduction</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  AMZ Properties ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us in any way.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  By using our website and services, you consent to the practices described in this Privacy Policy. If you do not agree with this policy, please do not use our services.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gold-400 mb-4">Personal Information</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We may collect personal information that you voluntarily provide to us, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Property preferences and search criteria</li>
                  <li>Financial information for property transactions</li>
                  <li>Communication preferences</li>
                  <li>Any other information you choose to provide</li>
                </ul>

                <h3 className="text-xl font-semibold text-gold-400 mb-4">Automatically Collected Information</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  When you visit our website, we may automatically collect certain information, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                  <li>IP address and browser information</li>
                  <li>Device type and operating system</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website information</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">How We Use Your Information</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                  <li>Providing and improving our real estate services</li>
                  <li>Communicating with you about properties and services</li>
                  <li>Processing transactions and managing client relationships</li>
                  <li>Sending marketing communications (with your consent)</li>
                  <li>Analyzing website usage and improving user experience</li>
                  <li>Complying with legal obligations</li>
                  <li>Protecting against fraud and unauthorized access</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Information Sharing and Disclosure</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                  <li>With trusted service providers who assist in our operations</li>
                  <li>With property developers and partners for legitimate business purposes</li>
                  <li>When required by law or to protect our legal rights</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Data Security</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and employee training</li>
                  <li>Secure data storage and backup procedures</li>
                </ul>
              </section>

              {/* Your Rights */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Your Rights and Choices</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate or incomplete data</li>
                  <li>Deletion of your personal information (subject to legal requirements)</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability where applicable</li>
                </ul>
              </section>

              {/* Cookies */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Cookies and Tracking Technologies</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Contact Us</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-luxury-600/20 rounded-lg p-6 border border-luxury-500/30">
                  <div className="space-y-3 text-gray-300">
                    <p><strong className="text-gold-400">Email:</strong> privacy@amzproperties.ae</p>
                    <p><strong className="text-gold-400">Phone:</strong> +971 50 123 4567</p>
                    <p><strong className="text-gold-400">Address:</strong> Dubai Marina, United Arab Emirates</p>
                  </div>
                </div>
              </section>

              {/* Updates */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Policy Updates</h2>
                <p className="text-gray-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy