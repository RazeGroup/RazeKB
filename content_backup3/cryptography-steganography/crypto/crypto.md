# Crypto
This section focuses on **practical cryptography for hacking/CTFs**: how to quickly recognize common patterns, pick the right tools, and apply known attacks.

If you're here for hiding data inside files, go to the **Stego** section.

## How to use this section

Crypto challenges reward speed: classify the primitive, identify what you control (oracle/leak/nonce reuse), then apply a known attack template.

### CTF workflow
### Symmetric crypto
### Hashes, MACs, and KDFs
### Public-key crypto
### TLS and certificates
### Crypto in malware
### Misc
## Quick setup

- Python: `python3 -m venv .venv && source .venv/bin/activate`
- Libraries: `pip install pycryptodome gmpy2 sympy pwntools`
- SageMath (often essential for lattice/RSA/ECC): [https://www.sagemath.org/](https://www.sagemath.org/?ref=rayanle.cat)

## References

- [rayanle.cat](https://rayanle.cat/)
