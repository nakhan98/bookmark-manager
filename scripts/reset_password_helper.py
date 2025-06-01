import hashlib
import json
from datetime import datetime, timezone
import argparse
import sys
import os

AUTH_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "auth.json")


def generate_user_entry(
    password: str, email: str, is_admin: bool = False, salt: str = "static_salt"
) -> dict:
    last_modified_date: str = (
        datetime.now(timezone.utc)
        .isoformat(timespec="milliseconds")
        .replace("+00:00", "Z")
    )
    to_hash: str = salt + password + last_modified_date
    hash_hex: str = hashlib.sha1(to_hash.encode("utf-8")).hexdigest()
    user_entry = {
        "password": hash_hex,
        "email": email,
        "last_modified_date": last_modified_date,
    }
    if is_admin:
        user_entry["isAdmin"] = True
    return user_entry


def main():
    parser = argparse.ArgumentParser(
        description="Add or update a user in data/auth.json"
    )
    parser.add_argument("username", help="Username for the user")
    parser.add_argument("password", help="Password for the user")
    parser.add_argument("email", help="Email address for the user")
    parser.add_argument("--admin", action="store_true", help="Set this user as admin")
    args = parser.parse_args()

    # Load existing users
    if os.path.exists(AUTH_PATH):
        with open(AUTH_PATH, "r", encoding="utf-8") as f:
            try:
                auth_data = json.load(f)
            except Exception:
                auth_data = {}
    else:
        os.makedirs(os.path.dirname(AUTH_PATH), exist_ok=True)
        auth_data = {}

    # Add or update user
    auth_data[args.username] = generate_user_entry(
        password=args.password, email=args.email, is_admin=args.admin
    )

    # Write back to file
    with open(AUTH_PATH, "w", encoding="utf-8") as f:
        json.dump(auth_data, f, indent=2)
    print(f"User '{args.username}' added/updated in {AUTH_PATH}")


if __name__ == "__main__":
    main()
