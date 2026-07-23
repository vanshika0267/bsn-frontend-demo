import React from 'react';
import EmptyState from '../../../components/common/EmptyState';
import { FiStar } from 'react-icons/fi';

const VerifiedReviewsTab = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold font-poppins text-on-surface">Verified Sourced Reviews</h1>
        <p className="text-xs text-on-surface-variant">Read and write validated reviews for academic courses and recruiting internships. Access restricted to verified student accounts.</p>
      </div>

      <EmptyState
        icon={FiStar}
        title="No reviews yet"
        description="Verified reviews for courses and internships will appear here once students start submitting them."
      />
    </div>
  );
};

export default VerifiedReviewsTab;
