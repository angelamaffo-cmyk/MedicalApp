import ssl
from django.core.mail.backends.smtp import EmailBackend

class SSLEmailBackend(EmailBackend):
    """
    Backend personnalisé pour bypasser la vérification stricte
    des certificats SSL/TLS en développement local.
    """
    @property
    def ssl_context(self):
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        return context