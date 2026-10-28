/**
 * Display avatar for the header and profile. Uses optional profileImageUrl when set,
 * otherwise a deterministic image from the user's name (ui-avatars).
 */
export function getUserAvatarUrl(user) {
  if (user?.profileImageUrl) {
    return user.profileImageUrl;
  }
  const label = user?.name?.trim() || user?.email?.trim() || 'User';
  const params = new URLSearchParams({
    name: label,
    background: '0e7490',
    color: 'ffffff',
    size: '128',
    bold: 'true',
  });
  return `https://ui-avatars.com/api/?${params.toString()}`;
}
