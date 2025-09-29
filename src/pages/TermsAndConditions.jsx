import React from 'react'
import { Link } from 'react-router-dom'

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-luxury-900 to-dark-900">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-luxury-900/90 to-gold-900/90">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Please read these terms carefully before using our services.
            </p>
            <div className="flex items-center justify-center space-x-2 text-gold-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="text-gray-400">/</span>
              <span className="text-white">Terms & Conditions</span>
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
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Agreement to Terms</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  These Terms and Conditions ("Terms") govern your use of the AMZ Properties website and services operated by AMZ Properties ("we," "our," or "us"). By accessing or using our services, you agree to be bound by these Terms.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  If you disagree with any part of these terms, then you may not access our services. These Terms apply to all visitors, users, and others who access or use our services.
                </p>
              </section>

              {/* Services Description */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Our Services</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  AMZ Properties provides luxury real estate services in Dubai, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                  <li>Property sales and purchase assistance</li>
                  <li>Real estate investment advisory</li>
                  <li>Property management services</li>
                  <li>Market analysis and consultation</li>
                  <li>Exclusive property listings and marketing</li>
                </ul>
              </section>

              {/* User Responsibilities */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">User Responsibilities</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  When using our services, you agree to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use our services only for lawful purposes</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not engage in any fraudulent or deceptive practices</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              {/* Prohibited Uses */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Prohibited Uses</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You may not use our services:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                </ul>
              </section>

              {/* Property Information */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Property Information Disclaimer</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  While we strive to provide accurate and up-to-date property information:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                  <li>Property details, prices, and availability are subject to change without notice</li>
                  <li>All information is provided for general guidance only</li>
                  <li>We recommend independent verification of all property details</li>
                  <li>Property images may not reflect current condition</li>
                  <li>Floor plans and measurements are approximate</li>
                </ul>
              </section>

              {/* Financial Disclaimer */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Financial and Investment Disclaimer</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Our services include investment advice and market analysis. Please note:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                  <li>All investments carry risk and may lose value</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>We recommend consulting with independent financial advisors</li>
                  <li>Market conditions can change rapidly</li>
                  <li>Investment decisions are ultimately your responsibility</li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Limitation of Liability</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  To the fullest extent permitted by law, AMZ Properties shall not be liable for:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6 ml-4">
                  <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Loss of profits, revenue, data, or use</li>
                  <li>Damages arising from property transactions</li>
                  <li>Third-party actions or omissions</li>
                  <li>Market fluctuations or investment losses</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Intellectual Property Rights</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The content, features, and functionality of our website and services are owned by AMZ Properties and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of our content without prior written consent.
                </p>
              </section>

              {/* Termination */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Termination</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason, including breach of these Terms.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Upon termination, your right to use our services will cease immediately. All provisions of these Terms that should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                </p>
              </section>

              {/* Governing Law */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Governing Law</h2>
                <p className="text-gray-300 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Changes to Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. Your continued use of our services after any changes constitutes acceptance of the new Terms.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Contact Information</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="bg-luxury-600/20 rounded-lg p-6 border border-luxury-500/30">
                  <div className="space-y-3 text-gray-300">
                    <p><strong className="text-gold-400">Email:</strong> legal@amzproperties.ae</p>
                    <p><strong className="text-gold-400">Phone:</strong> +971 50 123 4567</p>
                    <p><strong className="text-gold-400">Address:</strong> Dubai Marina, United Arab Emirates</p>
                  </div>
                </div>
              </section>

              {/* Acknowledgment */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Acknowledgment</h2>
                <p className="text-gray-300 leading-relaxed">
                  By using our services, you acknowledge that you have read these Terms and Conditions and agree to be bound by them. If you do not agree to these Terms, please do not use our services.
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions