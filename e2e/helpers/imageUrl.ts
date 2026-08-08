/**
 * An image served by whichever server the suite is pointed at.
 *
 * These specs used to hardcode `http://localhost:5173`, which silently became
 * wrong when the suite moved to a production build on another port: the URL
 * still loaded nothing, and the assertions failed looking for an `img` whose
 * `src` no longer matched anything on the page.
 */
export const IMAGE_URL = `${process.env.E2E_DEV ? 'http://localhost:5173' : 'http://localhost:4173'}/favicon.png`
