"""Minimal in-process rate limiting.

Deliberately dependency-free and in-memory: this app runs as a single Uvicorn
process, and the only endpoint that needs limiting is the public contact form.
The counters reset on restart and are not shared across workers - if the
deployment ever grows past one process, replace this with Redis-backed limiting.
"""
import time
from collections import defaultdict, deque
from threading import Lock

from fastapi import HTTPException, Request, status


class SlidingWindowLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._hits: dict[str, deque] = defaultdict(deque)
        self._lock = Lock()

    def _client_key(self, request: Request) -> str:
        # Render terminates TLS upstream, so prefer the forwarded client address.
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    def check(self, request: Request) -> None:
        key = self._client_key(request)
        now = time.monotonic()
        cutoff = now - self.window_seconds

        with self._lock:
            hits = self._hits[key]
            while hits and hits[0] < cutoff:
                hits.popleft()

            if len(hits) >= self.max_requests:
                retry_after = int(hits[0] + self.window_seconds - now) + 1
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many messages sent. Please try again later.",
                    headers={"Retry-After": str(retry_after)},
                )

            hits.append(now)

            # Opportunistic cleanup so idle clients don't accumulate forever.
            if len(self._hits) > 1024:
                for stale_key in [k for k, v in self._hits.items() if not v]:
                    del self._hits[stale_key]


# 5 contact submissions per IP per hour.
contact_limiter = SlidingWindowLimiter(max_requests=5, window_seconds=3600)


def enforce_contact_rate_limit(request: Request) -> None:
    contact_limiter.check(request)
