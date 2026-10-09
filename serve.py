# -*- coding: utf-8 -*-
"""Local dev server that disables caching, so edited CSS/JS/HTML always
show up on reload without needing a hard-refresh.

It also answers HTTP Range requests. Python's SimpleHTTPRequestHandler
ignores them and always returns the whole file with 200, which makes
browsers report an empty `seekable` range on <video> — the clip plays
but the playhead cannot be dragged. Real hosts (GitHub Pages, Netlify)
support ranges, so without this the bug only ever appears locally.
"""
import http.server
import os
import re
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8777

RANGE_RE = re.compile(r"^bytes=(\d*)-(\d*)$")


class DevHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def do_GET(self):
        rng = self.headers.get("Range")
        if not rng:
            return super().do_GET()

        path = self.translate_path(self.path)
        if os.path.isdir(path) or not os.path.isfile(path):
            return super().do_GET()

        m = RANGE_RE.match(rng.strip())
        if not m:
            return super().do_GET()

        size = os.path.getsize(path)
        start_s, end_s = m.group(1), m.group(2)
        if start_s == "":                      # suffix range: last N bytes
            if end_s == "":
                return super().do_GET()
            length = min(int(end_s), size)
            start, end = size - length, size - 1
        else:
            start = int(start_s)
            end = int(end_s) if end_s else size - 1
            end = min(end, size - 1)

        if start >= size or start > end:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return

        length = end - start + 1
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(length))
        self.end_headers()

        with open(path, "rb") as f:
            f.seek(start)
            remaining = length
            while remaining > 0:
                chunk = f.read(min(64 * 1024, remaining))
                if not chunk:
                    break
                try:
                    self.wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    return         # the browser seeked away or closed the tab
                remaining -= len(chunk)


class ThreadingServer(socketserver.ThreadingTCPServer):
    """Media needs more than one connection at a time: a single-threaded
    server stalls the page while a video is streaming."""
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with ThreadingServer(("127.0.0.1", PORT), DevHandler) as httpd:
        print(f"Serving (no-cache, range-enabled) on http://127.0.0.1:{PORT}")
        httpd.serve_forever()
