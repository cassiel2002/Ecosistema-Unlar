export interface UserActivity {
  isVerified: boolean;
  activeListings: number;
  closedListings: number;
  forumPosts: number;
  acceptedAnswers: number;
  upvotesReceived: number;
  downvotesReceived: number;
  commentsGiven: number;
  eventsAttended: number;
  guidesWritten: number;
  reportsReceived: number;
  removedListings: number;
}

/**
 * Calculates a user's reputation score based on their activity.
 *
 * Category caps:
 * - Listings: ≤ 200 points
 * - Forum: ≤ 300 points
 * - Community: ≤ 100 points
 *
 * Verified bonus: +50
 * Penalties: -10 per report, -25 per removal
 * Bounds: [0, 1000]
 */
export function calculateReputation(userActivity: UserActivity): number {
  let score = 0;

  // Base points for verified account
  if (userActivity.isVerified) score += 50;

  // Listing contributions (capped at 200 points)
  const listingPoints = Math.min(
    userActivity.activeListings * 5 + userActivity.closedListings * 3,
    200
  );
  score += listingPoints;

  // Forum contributions (capped at 300 points)
  const forumPoints = Math.min(
    userActivity.forumPosts * 3 +
      userActivity.acceptedAnswers * 15 +
      userActivity.upvotesReceived * 2 -
      userActivity.downvotesReceived * 1,
    300
  );
  score += Math.max(forumPoints, 0); // Floor at 0

  // Community engagement (capped at 100 points)
  const communityPoints = Math.min(
    userActivity.commentsGiven * 1 +
      userActivity.eventsAttended * 10 +
      userActivity.guidesWritten * 20,
    100
  );
  score += communityPoints;

  // Penalties
  score -= userActivity.reportsReceived * 10;
  score -= userActivity.removedListings * 25;

  // Floor at 0, cap at 1000
  return Math.max(0, Math.min(score, 1000));
}
