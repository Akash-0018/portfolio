"""Domain errors raised by the service layer.

Services stay HTTP-agnostic: they raise these, and main.py registers handlers
that map each one to a status code. That keeps the same service usable from a
script or a test without a request in scope.
"""


class ServiceError(Exception):
    """Base class for expected, recoverable service failures."""

    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class NotFoundError(ServiceError):
    """The requested entity does not exist. -> 404"""


class AuthenticationError(ServiceError):
    """Credentials were absent, wrong, or no longer valid. -> 401"""


class ValidationError(ServiceError):
    """The request was well-formed but its contents were unacceptable. -> 400"""
