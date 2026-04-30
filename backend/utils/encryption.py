import base64
from cryptography.fernet import Fernet, InvalidToken
from django.conf import settings


def _get_fernet() -> Fernet:
    key = settings.FERNET_KEY
    if not key:
        # Auto-generate a key for dev (NOT for production)
        key = Fernet.generate_key().decode()
    try:
        return Fernet(key.encode() if isinstance(key, str) else key)
    except Exception:
        new_key = Fernet.generate_key()
        return Fernet(new_key)


fernet = _get_fernet()


def encrypt_vote(candidate_id: str, election_id: str, cast_at: str) -> str:
    """Encrypt vote payload before storing in DB."""
    payload = f"{candidate_id}|{election_id}|{cast_at}"
    return fernet.encrypt(payload.encode()).decode()


def decrypt_vote(encrypted_data: str) -> dict:
    """Decrypt a stored vote — admin only."""
    try:
        decrypted = fernet.decrypt(encrypted_data.encode()).decode()
        parts = decrypted.split("|")
        return {"candidate_id": parts[0], "election_id": parts[1], "cast_at": parts[2]}
    except (InvalidToken, IndexError):
        return {}
