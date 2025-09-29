'use client';
import { useState } from 'react';
import { FaEye, FaTrash, FaDownload, FaSearch, FaFilter, FaStar, FaStarHalfAlt } from 'react-icons/fa';

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  
  const reviews = [
    { id: 1, customer: 'Sarah Wilson', product: 'Diamond Ring', rating: 5, comment: 'Absolutely beautiful piece! The craftsmanship is exceptional and the diamond sparkles perfectly.', date: '2024-01-15', verified: true },
    { id: 2, customer: 'David Brown', product: 'Gold Necklace', rating: 4, comment: 'Great quality and service. Fast delivery and beautiful packaging.', date: '2024-01-14', verified: true },
    { id: 3, customer: 'Emma Davis', product: 'Pearl Earrings', rating: 5, comment: 'Perfect for special occasions. Elegant and timeless design.', date: '2024-01-13', verified: false },
    { id: 4, customer: 'John Smith', product: 'Silver Bracelet', rating: 3, comment: 'Good product but took longer to deliver than expected.', date: '2024-01-12', verified: true },
    { id: 5, customer: 'Lisa Johnson', product: 'Ruby Ring', rating: 5, comment: 'Stunning ring! Exceeded my expectations in every way.', date: '2024-01-11', verified: true }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-400" />);
      }
    }
    return stars;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-400';
    if (rating >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getAverageRating = () => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  return (
      <div className="h-full flex flex-col space-y-4 overflow-hidden">
        {/* Header Section - Fixed */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
          <div>
            <h3 className="text-xl font-bold text-primary">Reviews Management</h3>
            <p className="text-secondary text-sm">Monitor customer feedback and ratings</p>
          </div>
          <button className="bg-gradient-to-r from-gold to-yellow-600 text-primary px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-sm">
            <FaDownload />
            <span>Export Reviews</span>
          </button>
        </div>

        {/* Stats Cards - Fixed */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
          <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <h4 className="text-xs font-medium text-secondary">Total Reviews</h4>
            <p className="text-lg font-bold text-gold">{reviews.length}</p>
            <p className="text-xs text-green-400">+15% this month</p>
          </div>
          <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <h4 className="text-xs font-medium text-secondary">Average Rating</h4>
            <p className="text-lg font-bold text-yellow-400">{getAverageRating()}/5</p>
            <div className="flex space-x-1 mt-1">
              {renderStars(parseFloat(getAverageRating())).slice(0, 5)}
            </div>
          </div>
          <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <h4 className="text-xs font-medium text-secondary">5-Star Reviews</h4>
            <p className="text-lg font-bold text-green-400">{reviews.filter(r => r.rating === 5).length}</p>
            <p className="text-xs text-green-400">{Math.round((reviews.filter(r => r.rating === 5).length / reviews.length) * 100)}% of total</p>
          </div>
          <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <h4 className="text-xs font-medium text-secondary">Verified Reviews</h4>
            <p className="text-lg font-bold text-blue-400">{reviews.filter(r => r.verified).length}</p>
            <p className="text-xs text-blue-400">{Math.round((reviews.filter(r => r.verified).length / reviews.length) * 100)}% verified</p>
          </div>
        </div>

        {/* Search and Filter Section - Fixed */}
        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary text-sm" />
            <input
              type="text"
              placeholder="Search reviews by customer, product, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-secondary border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-primary placeholder-secondary focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary text-sm" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="bg-secondary border border-white/10 rounded-lg pl-10 pr-8 py-2 text-sm text-primary focus:outline-none focus:border-gold transition-colors"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Reviews Table - Scrollable */}
        <div className="bg-secondary rounded-lg shadow-lg border border-white/10 flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-primary/20 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Rating</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Comment</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review, index) => (
                  <tr 
                    key={review.id} 
                    className="border-b border-white/5 hover:bg-primary/10 transition-colors duration-200"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center mr-3 shadow-md">
                          <span className="text-primary font-bold text-sm">{review.customer.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-primary text-sm">{review.customer}</p>
                          {review.verified && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-1 py-0.5 rounded">Verified</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-primary font-medium">{review.product}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-0.5">
                          {renderStars(review.rating)}
                        </div>
                        <span className={`text-sm font-semibold ${getRatingColor(review.rating)}`}>
                          {review.rating}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-secondary max-w-xs truncate" title={review.comment}>
                        {review.comment}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-secondary text-sm">{review.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.verified 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {review.verified ? 'Published' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-1">
                        <button className="text-blue-400 hover:text-blue-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-blue-500/10 rounded-md">
                          <FaEye className="text-sm" />
                        </button>
                        <button className="text-red-400 hover:text-red-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-red-500/10 rounded-md">
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaSearch className="text-lg text-gold" />
              </div>
              <h3 className="text-sm font-semibold text-primary mb-1">No reviews found</h3>
              <p className="text-xs text-secondary">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
  );
}
