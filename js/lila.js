const stores = new Map(),
  components = new Map(),
  currentInstances = new Set();
function getComponents(e) {
  return components.get(e);
}
function reactive(e, t = !1) {
  let n = new Set();
  return (
    t && n.add(t),
    new Proxy(e, {
      set: (e, t, r) => (
        e[t] !== r && ((e[t] = r), n.forEach((e) => e(t, r))), !0
      ),
      get(e, t) {
        if ("subscribe" === t) return (e) => (n.add(e), () => n.delete(e));
        let r = e[t];
        return "function" == typeof r &&
          Array.isArray(e) &&
          [
            "push",
            "pop",
            "shift",
            "unshift",
            "splice",
            "sort",
            "reverse",
          ].includes(t)
          ? function (...t) {
              let a = r.apply(e, t);
              return n.forEach((t) => t("items", e)), a;
            }
          : r;
      },
    })
  );
}
function createComponent(
  e,
  { template: t, state: n, actions: r, onMount: a, onDestroy: o }
) {
  let l = "string" == typeof t ? compileTemplate(t) : t;
  components.set(e, {
    template: l,
    state: n || (() => ({})),
    actions: r || {},
    onMount: a,
    onDestroy: o,
  });
}
function evalInContext(e, t) {
  try {
    let n = Object.keys(t),
      r = Object.values(t),
      a = Function(...n, `return ${e}`)(...r);
    return a;
  } catch (o) {
    console.error(`Error evaluating expression: "${e}"`, o);
    return;
  }
}
function mountComponent(e, t, n = {}) {
  let r = document.getElementById(t);
  if (!r)
    return console.error(`Target element with id "${t}" not found.`), null;
  let a = components.get(e);
  if (!a) return console.error(`Component "${e}" not found.`), null;
  let o = reactive(a.state(n)),
    l = new Map(),
    i = new Map(),
    c = !1;
  function s(e) {
    let t =
      e.match(
        /\b(?!(?:true|false|null|undefined|this)\b)[a-zA-Z_$][a-zA-Z0-9_$]*\b/g
      ) || [];
    return t;
  }
  function d(e, t, n) {
    let r = e.getAttribute("data-repeat"),
      a = evalInContext(r, { ...t, ...n.actions }),
      o = e.parentNode,
      l = e.nextElementSibling;
    for (; l; ) {
      let i = l.nextElementSibling;
      if (l && l.hasAttribute("data-repeated-item")) o.removeChild(l);
      else break;
      l = i;
    }
    let c = document.createDocumentFragment(),
      s = e.firstElementChild;
    if (!s) {
      console.warn(
        `data-repeat element "[data-repeat="${r}"]" has no child element to use as a template.`
      ),
        (e.style.display = "none");
      return;
    }
    Array.isArray(a)
      ? a.forEach((e, r) => {
          let a = s.cloneNode(!0);
          a.setAttribute("data-repeated-item", ""),
            a.querySelectorAll("[data-repeat-bind]").forEach((a) => {
              let o = a.getAttribute("data-repeat-bind"),
                l = { ...t, ...n.actions, item: e, index: r },
                i = evalInContext(o, l);
              a.textContent = void 0 !== i ? i : "";
            }),
            a.querySelectorAll("[data-repeat-action]").forEach((a) => {
              let o = a.getAttribute("data-repeat-action");
              if (n.actions[o]) {
                let l = (a) => {
                  a.preventDefault(),
                    n.actions[o]({ state: t, event: a, item: e, index: r });
                };
                a.addEventListener("click", l), (a._actionListener = l);
              } else
                console.warn(`Action "${o}" not found for data-repeat-action`);
            }),
            c.appendChild(a);
        })
      : console.warn(
          `data-repeat expression "${r}" did not evaluate to an array. Result:`,
          a
        ),
      o.insertBefore(c, e.nextSibling),
      (e.style.display = "none");
  }
  function u(e = []) {
    !c &&
      r &&
      ((c = !0),
      requestAnimationFrame(() => {
        try {
          if (0 === e.length) {
            l.forEach(({ listener: e, eventType: t }, n) => {
              n && e && n.removeEventListener(t, e);
            }),
              l.clear(),
              r.querySelectorAll("[data-action]").forEach((e) => {
                if (e._actionListener) {
                  let t = "FORM" === e.tagName ? "submit" : "click";
                  e.removeEventListener(t, e._actionListener),
                    delete e._actionListener;
                }
              }),
              i.forEach((e, t) => {
                try {
                  e.destroy();
                } catch (n) {
                  console.error(
                    "Error destroying nested component during update:",
                    n
                  );
                }
                t && delete t._componentInstance;
              }),
              i.clear();
            let t = a.template({ ...o, ...a.actions });
            if ("string" == typeof t) {
              var n, u, p;
              (r.innerHTML = t),
                (n = r),
                (u = o),
                (p = a),
                n.querySelectorAll("[data-if]").forEach((e) => {
                  let t = e.getAttribute("data-if"),
                    n = evalInContext(t, { ...u, ...p.actions });
                  e.style.display = n ? "" : "none";
                }),
                n.querySelectorAll("[data-else]").forEach((e) => {
                  let t = e.getAttribute("data-else"),
                    n = evalInContext(t, { ...u, ...p.actions });
                  e.style.display = n ? "none" : "";
                }),
                n.querySelectorAll("[data-repeat]").forEach((e) => {
                  d(e, u, p);
                }),
                n.querySelectorAll("[data-component]").forEach((e) => {
                  let t =
                    e.id ||
                    (function e(t) {
                      let n = "lila-" + Math.random().toString(36).substr(2, 9);
                      return document.getElementById(n)
                        ? e(t)
                        : ((t.id = n), n);
                    })(e);
                  if (((e.id = t), !e._componentInstance)) {
                    let n = e.dataset.component,
                      r = mountComponent(n, t);
                    r && (i.set(e, r), (e._componentInstance = r));
                  }
                }),
                n.querySelectorAll("[data-action]").forEach((e) => {
                  let t = e.dataset.action;
                  if (p.actions[t] && !e._actionListener) {
                    let n = (n) => {
                        "FORM" === e.tagName && n.preventDefault(),
                          p.actions[t]({ state: u, event: n });
                      },
                      r = "FORM" === e.tagName ? "submit" : "click";
                    e.addEventListener(r, n), (e._actionListener = n);
                  } else
                    p.actions[t] ||
                      console.warn(`Action "${t}" not found for data-action`);
                }),
                n.querySelectorAll("[data-model]").forEach((e) => {
                  let t = e.getAttribute("data-model");
                  if (
                    (void 0 !== u[t] &&
                      ("checkbox" === e.type || "radio" === e.type
                        ? (e.checked = u[t])
                        : (e.value = u[t])),
                    !l.has(e))
                  ) {
                    let n =
                        "checkbox" === e.type || "radio" === e.type
                          ? "change"
                          : "input",
                      r = (n) => {
                        !c &&
                          ("checkbox" === e.type
                            ? (u[t] = n.target.checked)
                            : "radio" === e.type
                            ? n.target.checked && (u[t] = n.target.value)
                            : (u[t] = n.target.value));
                      };
                    e.addEventListener(n, r),
                      l.set(e, { property: t, listener: r, eventType: n });
                  }
                }),
                n.querySelectorAll("[data-bind]").forEach((e) => {
                  let t = e.getAttribute("data-bind");
                  void 0 !== u[t] && (e.textContent = u[t]);
                });
            } else console.error("Component template did not return a string.");
          } else
            e.forEach((e) => {
              r.querySelectorAll(`[data-bind="${e}"]`).forEach((t) => {
                void 0 !== o[e] && (t.textContent = o[e]);
              }),
                r.querySelectorAll(`[data-model="${e}"]`).forEach((t) => {
                  t !== document.activeElement &&
                    void 0 !== o[e] &&
                    ("checkbox" === t.type || "radio" === t.type
                      ? t.checked !== o[e] && (t.checked = o[e])
                      : t.value !== o[e] && (t.value = o[e]));
                }),
                r.querySelectorAll("[data-if]").forEach((t) => {
                  let n = t.getAttribute("data-if"),
                    r = s(n);
                  if (r.includes(e)) {
                    let l = evalInContext(n, { ...o, ...a.actions });
                    t.style.display = l ? "" : "none";
                  }
                }),
                r.querySelectorAll("[data-else]").forEach((t) => {
                  let n = t.getAttribute("data-else"),
                    r = s(n);
                  if (r.includes(e)) {
                    let l = evalInContext(n, { ...o, ...a.actions });
                    t.style.display = l ? "none" : "";
                  }
                }),
                r.querySelectorAll("[data-repeat]").forEach((t) => {
                  let n = t.getAttribute("data-repeat"),
                    r = s(n);
                  r.includes(e) && d(t, o, a);
                });
            });
        } catch (f) {
          console.error("Error during update:", f);
        } finally {
          c = !1;
        }
      }));
  }
  let p = o.subscribe((e) => {
    u([e]);
  });
  setTimeout(() => {
    if ((u(), a.onMount))
      try {
        let e = a.onMount(o);
        e && "function" == typeof e.then
          ? e
              .then(() => {
                u();
              })
              .catch((e) => console.error("Error in onMount promise:", e))
          : u();
      } catch (t) {
        console.error("Error in onMount:", t);
      }
  }, 0);
  let f = {
    destroy() {
      try {
        a.onDestroy && a.onDestroy(o);
      } catch (e) {
        console.error("Error in onDestroy:", e);
      }
      i.forEach((e, t) => {
        try {
          e.destroy(), t && delete t._componentInstance;
        } catch (n) {
          console.error("Error destroying nested component:", n);
        }
      }),
        i.clear(),
        p(),
        l.forEach(({ listener: e, eventType: t }, n) => {
          n && e && n.removeEventListener(t, e);
        }),
        l.clear(),
        r &&
          (r.querySelectorAll("[data-action]").forEach((e) => {
            if (e._actionListener) {
              let t = "FORM" === e.tagName ? "submit" : "click";
              e.removeEventListener(t, e._actionListener),
                delete e._actionListener;
            }
          }),
          (r.innerHTML = ""));
    },
    state: o,
    forceUpdate() {
      u();
    },
  };
  return currentInstances.add(f), f;
}
function handleRouting() {
  let e = window.location.hash.substring(1) || "/",
    t = routes.get(e) || routes.get("*");
  if (!t) {
    console.warn(`No route found for path: "${e}"`);
    return;
  }
  currentInstances.forEach((e) => {
    try {
      e.destroy();
    } catch (t) {
      console.error("Error destroying instance during routing:", t);
    }
  }),
    currentInstances.clear();
  let n = document.getElementById("app-lila");
  n
    ? mountComponent(t.componentName, "app-lila", t.props)
    : console.error('App outlet element with id "app-lila" not found.');
}
const routes = new Map();
function addRoute(e, t, n = {}) {
  routes.set(e, { componentName: t, props: n });
}
function navigateTo(e) {
  window.location.hash.substring(1) !== e && (window.location.hash = e);

}
function compileTemplate(e) {
  let t = document.querySelector(`[data-template="${e}"]`);
  if (!t)
    return (
      console.error(`Template element with data-template="${e}" not found.`),
      () => ""
    );
  let n = t.innerHTML;
  return (e) =>
    n.replace(/\${([^}]+)}/g, (t, n) => {
      try {
        return evalInContext(n.trim(), e);
      } catch (r) {
        return (
          console.error(`Error evaluating template expression: "${n}"`, r),
          `Error: ${n}`
        );
      }
    });
}
window.addEventListener("hashchange", handleRouting),
  window.addEventListener("load", handleRouting),
  document.addEventListener("click", (e) => {
    let t = e.target.closest("[data-link]");
    if (t) {
      e.preventDefault();
      let n = t.getAttribute("href");
      n && navigateTo(n);
    }
  }),
  (window.App = {
    reactive,
    createComponent,
    addRoute,
    navigateTo,
    mountComponent,
    getComponents,
    evalInContext,
  });
