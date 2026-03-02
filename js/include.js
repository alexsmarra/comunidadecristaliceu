import { initCarousel } from "./carousel.js";

async function loadPartials() {
  try {
    const currentPath = window.location.pathname;
    const partialsBase = currentPath.includes("/pages/") ? "../" : "./";
    
    const headerResponse = await fetch(partialsBase + "partials/header.html");
    const headerHtml = await headerResponse.text();
    document.getElementById("site-header").innerHTML = headerHtml;

    const footerResponse = await fetch(partialsBase + "partials/footer.html");
    const footerHtml = await footerResponse.text();
    document.getElementById("site-footer").innerHTML = footerHtml;

    const yearSpan = document.getElementById("year");
    if (yearSpan) 
      yearSpan.textContent = new Date().getFullYear();

    initHeaderMenu();

    if (document.querySelector('.carousel')) {
      initCarousel();
    }

    // 🔹 Nova função para corrigir os caminhos após o carregamento
    adjustPartialPaths();

  } catch (error) {
    console.error("Erro ao carregar partials:", error);
  }
}

function adjustPartialPaths() {
  const currentPath = window.location.pathname;
  if (currentPath.includes("/pages/")) {
    document.querySelectorAll('#site-header a, #site-header img, #site-footer a, #site-footer img').forEach(element => {
      const href = element.getAttribute('href');
      const src = element.getAttribute('src');

      // Só ajusta links internos (que não começa com http, https, mailto, #)
      if (
        href &&
        !href.startsWith('..') &&
        !href.startsWith('http') &&
        !href.startsWith('mailto') &&
        !href.startsWith('#')
      ) {
        element.setAttribute('href', '../' + href);
      }
      if (src && !src.startsWith('..')) {
        element.setAttribute('src', '../' + src);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", loadPartials);

function initHeaderMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const closeMenu = document.getElementById('close-menu');

  if (menuToggle && mobileMenu && closeMenu) {
    menuToggle.addEventListener('click', () => mobileMenu.style.display = 'flex');
    closeMenu.addEventListener('click', () => mobileMenu.style.display = 'none');

    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');

        if (!href || href.startsWith('#')) return;

        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        
        if (isMobile) {
          e.preventDefault(); 
          document.body.classList.add('fade-out');
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        } else {
          window.location.href = href;
        }
      });
    });
  }
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('nav a').forEach(link => {
    const linkHref = link.getAttribute('href');
    const linkPage = linkHref ? linkHref.split('/').pop() : '';
    
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}