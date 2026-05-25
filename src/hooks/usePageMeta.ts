import { useEffect } from "react";

type PageMeta = {
  title: string;
  description?: string;
  canonical?: string;
};

function setOrCreateMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setOrCreateLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function usePageMeta({ title, description, canonical }: PageMeta) {
  useEffect(() => {
    if (title) {
      document.title = title;
      setOrCreateMeta("og:title", title, true);
      setOrCreateMeta("twitter:title", title);
    }
    if (description) {
      setOrCreateMeta("description", description);
      setOrCreateMeta("og:description", description, true);
      setOrCreateMeta("twitter:description", description);
    }
    if (canonical) {
      setOrCreateLink("canonical", canonical);
      setOrCreateMeta("og:url", canonical, true);
    }
  }, [title, description, canonical]);
}
