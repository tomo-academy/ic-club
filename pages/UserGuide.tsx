import React from 'react';
import { BookOpen, CheckCircle, Package, Clock, RotateCcw } from 'lucide-react';

export const UserGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-primary mb-4">User Guide</h1>
        <p className="text-secondary text-lg">Everything you need to know about using the IC Club platform.</p>
      </div>

      <div className="space-y-12">
        {/* Section 1 */}
        <div className="bg-surface p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">How to Rent Hardware</h2>
              <ol className="space-y-4 text-secondary list-decimal list-inside marker:text-primary marker:font-bold">
                <li className="pl-2"><strong className="text-primary">Browse Catalog:</strong> Navigate to the Hardware page to view available components.</li>
                <li className="pl-2"><strong className="text-primary">Select Items:</strong> Click on items to view details and check specifications.</li>
                <li className="pl-2"><strong className="text-primary">Add to Cart:</strong> Use the "Prebook" or "Add to Cart" button.</li>
                <li className="pl-2"><strong className="text-primary">Checkout:</strong> Go to your cart/booking flow, fill in your details, and confirm the order.</li>
                <li className="pl-2"><strong className="text-primary">Approval:</strong> Wait for Admin approval. You will see the status in your Dashboard.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-surface p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CheckCircle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Collection & Returns</h2>
              <ul className="space-y-4 text-secondary">
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></span>
                  <span>Once your order is <strong>Approved</strong>, visit the IC Club Lab (Main Block, 2nd Floor) to collect your items.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></span>
                  <span>Show your digital receipt (available in "My Orders") to the lab assistant.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></span>
                  <span>Inspect the component before leaving the lab.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></span>
                  <span>Return the items on or before the due date to avoid penalties.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-surface p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-purple-50 text-accent rounded-2xl flex items-center justify-center flex-shrink-0">
              <RotateCcw size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Rules & Regulations</h2>
              <div className="bg-gray-50 p-6 rounded-2xl text-sm text-secondary space-y-3">
                 <p>1. Components must be used only for academic or project purposes.</p>
                 <p>2. Any damage caused due to negligence will result in a fine equivalent to the replacement cost.</p>
                 <p>3. Do not solder directly onto development boards (Arduino, Raspberry Pi, etc.). Use headers.</p>
                 <p>4. Late returns may incur a fine of ₹50/day.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};