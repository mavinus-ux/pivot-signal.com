// Edge Function: language-aware root redirect
// Runs BEFORE any file lookup (including index.html)
// Checks Accept-Language header and redirects to /de/ for German browsers,
// /en/ for everyone else. Returns a 302 so it can be changed later without
// SEO impact.

export default async (request, context) => {
  const url = new URL(request.url);
  if (url.pathname !== "/" && url.pathname !== "") {
    return; // let it pass through to file/redirect handlers
  }

  const acceptLang = (request.headers.get("accept-language") || "").toLowerCase();
  const dest = acceptLang.startsWith("de") ? "/de/" : "/en/";

  return Response.redirect(new URL(dest, request.url), 302);
};

export const config = {
  path: "/",
};
