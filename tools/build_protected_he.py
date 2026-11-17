"""Build the password-protected heuristic-evaluation bundle for the portfolio.

Usage:
  python3 -I build_protected_he.py SOURCE.pdf OUT_DIR PASSWORD

Writes OUT_DIR/heuristic-evaluation.bin (slides + per-slide text) and
OUT_DIR/heuristic-evaluation-pdf.bin (the original PDF). Both are AES-256-GCM
encrypted with a key derived from PASSWORD via PBKDF2-SHA256, so the public
repository only ever holds ciphertext. Re-run with a new password to rotate it.
"""
import base64, io, json, os, subprocess, sys, tempfile
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from PIL import Image

ITER = 310_000
MAGIC = b"JAENC1"


def encrypt(data: bytes, password: str) -> bytes:
    salt, iv = os.urandom(16), os.urandom(12)
    key = PBKDF2HMAC(hashes.SHA256(), 32, salt, ITER).derive(password.encode())
    return MAGIC + salt + iv + AESGCM(key).encrypt(iv, data, None)


def main(src, out, password):
    pages = []
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["pdftoppm", "-r", "150", "-png", src, f"{tmp}/p"], check=True)
        n = len([f for f in os.listdir(tmp) if f.endswith(".png")])
        for i in range(1, n + 1):
            png = f"{tmp}/p-{i:02d}.png"
            im = Image.open(png).convert("RGB")
            im.thumbnail((2000, 2000))
            buf = io.BytesIO()
            im.save(buf, "WEBP", quality=76, method=6)
            text = subprocess.run(["pdftotext", "-f", str(i), "-l", str(i), src, "-"],
                                  capture_output=True, text=True, check=True).stdout
            text = " ".join(text.split())
            pages.append({"w": im.width, "h": im.height, "text": text,
                          "img": base64.b64encode(buf.getvalue()).decode()})
    bundle = json.dumps({"pages": pages}).encode()
    with open(os.path.join(out, "heuristic-evaluation.bin"), "wb") as f:
        f.write(encrypt(bundle, password))
    with open(src, "rb") as f, open(os.path.join(out, "heuristic-evaluation-pdf.bin"), "wb") as g:
        g.write(encrypt(f.read(), password))
    print(f"{len(pages)} pages; bundle {len(bundle)//1024} KB")


if __name__ == "__main__":
    main(*sys.argv[1:4])
