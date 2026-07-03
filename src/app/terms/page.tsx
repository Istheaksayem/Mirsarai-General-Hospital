import React from 'react';

export const metadata = {
  title: 'Terms of Service - Mirsarai General Hospital',
  description: 'Terms of Service for Mirsarai General Hospital Baby Care & Diagnostic Center.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-6">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-tertiary pl-3">1. Agreement to Terms</h2>
              <p>
                By accessing our website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-tertiary pl-3">2. Medical Disclaimer</h2>
              <p>
                The content on this website is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-tertiary pl-3">3. Appointments and Cancellations</h2>
              <p>
                When booking an appointment through our platform, you agree to provide accurate and complete information. If you need to cancel or reschedule, please do so at least 24 hours in advance. Failure to do so may result in a cancellation fee.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-tertiary pl-3">4. Intellectual Property</h2>
              <p>
                The website and its original content, features, and functionality are owned by Mirsarai General Hospital and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-tertiary pl-3">5. Limitations</h2>
              <p>
                In no event shall Mirsarai General Hospital or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-tertiary pl-3">6. Modifications</h2>
              <p>
                We may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
