# tools

`build_protected_he.py` rebuilds the password-protected heuristic evaluation
(`heuristic-evaluation.bin` and `heuristic-evaluation-pdf.bin`). The source PDF
is not stored in this public repo; only AES-256-GCM ciphertext is. To change the
password, re-run:

    python3 -I tools/build_protected_he.py path/to/Heuristic_Evaluation.pdf . NEW-PASSWORD

then bump `?v=1` in `heuristic-evaluation.html` so browsers fetch the new files.
Note: this is client-side protection. Anyone with the password can share the file.
