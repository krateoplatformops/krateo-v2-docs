# krateo-frontend

Our frontend (https://github.com/krateoplatformops/krateo-frontend) can be defined as a data-driven meta-framework, but what does that mean exactly? Essentially, we created an architecture that ensures a consistent user experience by design. This is achieved by pre-packaging graphic elements and layouts that can be used and composed to build the portal pages.

It's important to note that the Krateo portal should not be seen as a black box, but rather as a central point for collecting valuable information for the platform's users, which is distributed across different systems.

Another important requirement is that the portal must be easily extendable without requiring any coding. All efforts should be focused on understanding how to display services in the catalog, rather than on maintaining forms for collecting information.

In summary, the Krateo frontend queries the backend (Kubernetes) via the backend for the frontend to know which layouts and graphic elements it must process with client-side runtime rendering.