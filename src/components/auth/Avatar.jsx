import React from 'react';

/**
 * Reusable component to display a user's avatar image or their initials as a fallback.
 * @param {object} user - The user object containing name, email, and avatar_url.
 * @param {string} sizeClass - Tailwind class string for dimensions (e.g., 'w-20 h-20').
 * @returns {JSX.Element} The rendered avatar element.
 */
const UserAvatar = ({ user, sizeClass = 'w-10 h-10' }) => {
  // Logic to safely get the initials (First initial + Last initial)
  const getInitials = (name) => {
    if (!name) return "NN";
    const parts = name.trim().split(/\s+/);
    const firstInitial = parts[0] ? parts[0][0] : '';
    // Use the first letter of the last part for the second initial
    const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : '';
    
    // Combine initials, or use first two letters of first name if no last name exists
    const initials = (firstInitial + lastInitial).toUpperCase();
    if (initials.length >= 2) return initials;
    return parts[0].substring(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name);
  
  // Combine all shared classes
  const baseClasses = `rounded-full bg-gradient-to-r from-purple-400 to-yellow-300 flex items-center justify-center overflow-hidden flex-shrink-0`;
  
  // Determine text size based on avatar size (Tailwind utility classes)
  let textClasses = 'text-xl text-blue-800 font-medium';
  if (sizeClass.includes('w-20')) {
    textClasses = 'text-3xl text-blue-800 font-thin';
  } else if (sizeClass.includes('w-10')) {
    textClasses = 'text-lg text-blue-800 font-medium';
  }

  return (
    <div className={`${baseClasses} ${sizeClass}`}>
      {user?.avatar_url ? (
        // Render Image
        <img 
          src={user.avatar_url} 
          alt={`${user.name} avatar`} 
          className="w-full h-full object-cover"
          // Optional: Add onError to handle broken links gracefully
          onError={(e) => { e.target.style.display = 'none'; }} 
        />
      ) : (
        // Render Initials Fallback
        <span className={textClasses}>
          {initials}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
