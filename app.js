(() => {
  const links = document.querySelectorAll("[data-link]");

  for (let link of links) {
    let linkId = link.dataset.link;

    link.addEventListener("mouseover", () => {
      let targetEl = document.querySelector(`[data-link-target="${linkId}"]`);
      link.setAttribute("style", "text-decoration: underline;");
      targetEl.setAttribute(
        "style",
        "text-shadow: 0px 0px 2px #000, 0px 0px 3px #BF616A, 0px 0px 4px #EBCB8B;"
      );
    });

    link.addEventListener("mouseout", () => {
      link.setAttribute("style", "text-decoration: none;");
      let targetEl = document.querySelector(`[data-link-target="${linkId}"]`);
      targetEl.setAttribute("style", "");
    });
  }
})();
