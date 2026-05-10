const PICSUM_MIN_ID = 10;
const PICSUM_MAX_ID = 1084;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hashSeed(seed = '') {
  let hash = 0;
  const text = String(seed);
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function picsumBySeed(seed, width = 1200, height = 800) {
  const hash = hashSeed(seed || 'traveloop');
  const range = PICSUM_MAX_ID - PICSUM_MIN_ID + 1;
  const id = PICSUM_MIN_ID + (hash % range);
  const safeWidth = clamp(width, 320, 2400);
  const safeHeight = clamp(height, 240, 1800);
  return `https://picsum.photos/id/${id}/${safeWidth}/${safeHeight}`;
}

export function getTripImage(trip) {
  if (trip?.coverImageUrl) return trip.coverImageUrl;
  return picsumBySeed(`${trip?.id ?? ''}-${trip?.title ?? 'trip'}`, 1200, 800);
}

export function getDestinationImage(destination) {
  if (destination?.imageUrl) return destination.imageUrl;
  return picsumBySeed(`${destination?.slug ?? ''}-${destination?.city ?? destination?.name ?? 'destination'}`, 800, 600);
}

export function getAvatarImage(nameOrEmail) {
  const seed = encodeURIComponent(nameOrEmail || 'traveler');
  return `https://api.dicebear.com/9.x/initials/png?seed=${seed}&backgroundType=gradientLinear&size=256`;
}
