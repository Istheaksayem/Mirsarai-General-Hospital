import React from 'react';

export const metadata = {
  title: 'Privacy Policy - Mirsarai General Hospital',
  description: 'Privacy Policy of Mirsarai General Hospital Baby Care & Diagnostic Center.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-6">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-secondary pl-3">1. Introduction</h2>
              <p>
                Welcome to Mirsarai General Hospital Baby Care & Diagnostic Center. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-secondary pl-3">2. Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-secondary pl-3">3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., booking an appointment).</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-secondary pl-3">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-secondary pl-3">5. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at:<br /><br />
                <strong>Email:</strong> mirsaraigeneralhospital@gmail.com<br />
                <strong>Address:</strong> Opposite the Police Station, Mirsarai Pourosodor, Chittagong.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
