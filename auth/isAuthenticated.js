/**
 * Identifies if the given request is from an authenticated source.
 * @param {Request} request
 */
export default function isAuthenticated(request) {
  return request.isAuthenticated();
}
