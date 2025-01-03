export function GET(request: Request) {
  const url = new URL("/dms", request.url);
  return Response.redirect(url);
}
