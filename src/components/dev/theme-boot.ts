/**
 * Review-mode boot script, inlined in <head> before first paint.
 * ?theme=<id> previews a route without changing the default; ?embed=1 is used by the
 * /compare panes (no preloader, chat or smooth scroll inside them).
 */
export const themeBootScript = `try{var d=document.documentElement,q=new URLSearchParams(location.search),t=q.get("theme");if(t)d.dataset.theme=t;if(q.get("embed")){d.classList.add("pe-embed","pe-seen")}}catch(e){}`;
