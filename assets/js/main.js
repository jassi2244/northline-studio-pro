const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("open");

        menuBtn.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        menuBtn.textContent =
            isOpen ? "Close" : "Menu";
    });


    navLinks
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("open");

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuBtn.textContent = "Menu";
            });

        });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            navLinks.classList.remove("open");

            menuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            menuBtn.textContent = "Menu";
        }

    });

}


/* =========================================================
   ACTIVE NAV LINK
========================================================= */

const currentPage =
    window.location.pathname
        .split("/")
        .pop() || "index.html";

document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        const href =
            link
                .getAttribute("href")
                ?.split("/")
                .pop();

        if (href === currentPage) {
            link.classList.add("active");
        }

    });


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target
                            .classList
                            .add("visible");

                        revealObserver
                            .unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -40px 0px"
            }
        );


    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

} else {

    revealElements.forEach(element => {
        element.classList.add("visible");
    });

}


/* =========================================================
   API URL
========================================================= */

function getApiBaseUrl() {

    if (window.NORTHLINE_API_URL) {

        return window.NORTHLINE_API_URL
            .replace(/\/$/, "");
    }


    const hostname =
        window.location.hostname;


    const isLocalHost =
        hostname === "localhost" ||
        hostname === "127.0.0.1";


    const isPrivateNetwork =
        /^192\.168\./.test(hostname) ||
        /^10\./.test(hostname) ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);


    if (isLocalHost) {
        return "http://localhost:5078";
    }


    if (isPrivateNetwork) {
        return `http://${hostname}:5078`;
    }


    /*
        Production assumption:

        Frontend and backend will eventually
        be hosted behind the same domain.

        Example:
        https://northlinestudio.com/api/leads
    */

    return window.location.origin;
}


/* =========================================================
   WHATSAPP FALLBACK
========================================================= */

function buildWhatsAppUrl(data) {

    const lines = [

        "Hi Jaspreet,",

        "",

        "I would like to discuss a project with Northline Studio.",

        "",

        `Name: ${data.name || "-"}`,

        `Email: ${data.email || "-"}`,

        `Company: ${data.company || "-"}`,

        `Country: ${data.country || "-"}`,

        `Service: ${data.service || "-"}`,

        `Budget: ${data.budget || "-"}`,

        `Timeline: ${data.timeline || "-"}`,

        "",

        "Project details:",

        data.message || "-"

    ];


    const message =
        encodeURIComponent(
            lines.join("\n")
        );


    return (
        "https://wa.me/918146535822" +
        `?text=${message}`
    );
}


/* =========================================================
   PROJECT ENQUIRY FORM
========================================================= */

const projectForm =
    document.querySelector(
        "[data-project-form]"
    );


if (projectForm) {

    projectForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const status =
                projectForm.querySelector(
                    ".form-status"
                );


            const submitButton =
                projectForm.querySelector(
                    'button[type="submit"]'
                );


            if (!status || !submitButton) {
                return;
            }


            if (!projectForm.checkValidity()) {

                projectForm.reportValidity();

                return;
            }


            const formData =
                new FormData(projectForm);


            const data =
                Object.fromEntries(
                    formData.entries()
                );


            const originalButtonText =
                submitButton.textContent;


            submitButton.disabled =
                true;


            submitButton.textContent =
                "Sending...";


            status.className =
                "form-status";


            status.textContent =
                "";


            try {

                const apiBase =
                    getApiBaseUrl();


                const response =
                    await fetch(
                        `${apiBase}/api/leads`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );


                let responseData = {};


                try {

                    responseData =
                        await response.json();

                } catch {
                    responseData = {};
                }


                if (!response.ok) {

                    throw new Error(
                        responseData.message ||
                        `Request failed (${response.status})`
                    );
                }


                const reference =
                    responseData.reference ||
                    "your reference number";


                status.textContent =
                    `Thanks. Your project enquiry ${reference} has been received. I will review the brief and get back to you.`;


                status.className =
                    "form-status show ok";


                projectForm.reset();


                status.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });

            }

            catch (error) {

                console.error(
                    "Northline enquiry error:",
                    error
                );


                const whatsappUrl =
                    buildWhatsAppUrl(data);


                status.innerHTML = `
                    I could not submit the enquiry through the website right now.
                    <br><br>
                    <a
                        href="${whatsappUrl}"
                        target="_blank"
                        rel="noopener"
                    >
                        <strong>
                            Send this project brief on WhatsApp →
                        </strong>
                    </a>
                `;


                status.className =
                    "form-status show err";
            }

            finally {

                submitButton.disabled =
                    false;


                submitButton.textContent =
                    originalButtonText;
            }

        }
    );

}