#!/usr/bin/env python3
"""Simple HTTP server with a custom handler example.

Serves the current directory like Python's built-in http.server, but also
demonstrates a custom GET handler for a specific path (`/hg.elf`).

Run:
    python server.py            # binds to 127.0.0.1:8000 by default
    HOST=0.0.0.0 PORT=5000 python server.py
"""

from http.server import SimpleHTTPRequestHandler, HTTPServer
from abc import ABC, abstractmethod
import os
import time


class HandlerTemplate(SimpleHTTPRequestHandler, ABC):
    @abstractmethod
    def do_GET(self):
        pass


class Handler(HandlerTemplate):
    def do_GET(self):
        if self.path == '/hg.elf':
            # Slight delay to simulate a slow resource.
            time.sleep(2)
            if os.path.exists('hg.elf'):
                self.send_response(200)
                self.end_headers()
                with open('hg.elf', 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'File not found')
        else:
            # Fall through to the built-in static-file behavior.
            SimpleHTTPRequestHandler.do_GET(self)


def main():
    # Safe defaults: localhost only. Override with HOST/PORT env vars.
    host = os.getenv('HOST', '127.0.0.1')
    port = int(os.getenv('PORT', '8000'))

    httpd = HTTPServer((host, port), Handler)
    print(f'HTTP server listening on http://{host}:{port}')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down.')
        httpd.server_close()


if __name__ == '__main__':
    main()
