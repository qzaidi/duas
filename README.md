## Running Duas with a Separate Nginx/Certbot Proxy

To run the `duas` application with Nginx and Certbot in a separate `docker-compose` setup for handling multiple subdomains with SSL (SNI), follow these steps:

1.  **Create the external network:**
    This network allows the `duas` services and the Nginx/Certbot proxy services to communicate.
    ```bash
    docker network create webproxy
    ```

2.  **Start the `duas` application services:**
    This will bring up the `duas` application and the `pdfgen` service, connected to the `webproxy` network.
    ```bash
    docker compose -f /opt/app/projects/duas/docker-compose.yml up -d
    ```

3.  **Start the Nginx and Certbot proxy services:**
    This will launch the Nginx reverse proxy and Certbot for SSL certificate management, also connected to the `webproxy` network.
    ```bash
    docker compose -f /opt/app/projects/duas/proxy-compose.yml up -d
    ```

This setup allows you to manage your Nginx and Certbot configurations independently, making it easier to add more subdomains and manage their SSL certificates.
