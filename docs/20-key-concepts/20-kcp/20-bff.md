# bff

A critical architectural choice behind Krateo is that there must be no channel-specific logic querying the backend. In other words, what is displayed and implemented via the portal must be exactly reproducible via the Kubernetes CLI (aka kubectl).

This ensures that all business logic is centralized.

The BFF (Backend for Frontend) repository is designed to serve as an intermediary layer between the Portal and Kubernetes APIs.