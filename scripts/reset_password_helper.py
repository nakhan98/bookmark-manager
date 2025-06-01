import hashlib
import json
from datetime import datetime, timezone
import argparse
import sys

def generate_user_data(
    username: str,
    password: str,
    email: str,
    is_admin: bool = False,
    salt: str = 'static_salt'
) -> dict:
    """
    Generates a dictionary with user data including a hashed password, the current last modified date,
    and an optional isAdmin flag.

    :param username: The username of the user.
    :param password: The password to be hashed.
    :param email: The email address of the user.
    :param is_admin: Whether the user is an admin (default: False).
    :param salt: A static salt value for hashing (default is 'static_salt').
    :return: A dict with user data.
    """
    # Match JS's new Date().toISOString() format (with milliseconds)
    last_modified_date: str = datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")

    to_hash: str = salt + password + last_modified_date
    hash_hex: str = hashlib.sha1(to_hash.encode('utf-8')).hexdigest()

    user_entry = {
        "password": hash_hex,
        "email": email,
        "last_modified_date": last_modified_date
    }
    if is_admin:
        user_entry["isAdmin"] = True

    return {username: user_entry}

def main():
    parser = argparse.ArgumentParser(description="Generate user JSON for auth.json")
    parser.add_argument("username", help="Username for the user")
    parser.add_argument("password", help="Password for the user")
    parser.add_argument("email", help="Email address for the user")
    parser.add_argument("--admin", action="store_true", help="Set this user as admin")
    args = parser.parse_args()

    user_data = generate_user_data(
        username=args.username,
        password=args.password,
        email=args.email,
        is_admin=args.admin
    )
    print(json.dumps(user_data, indent=2))

if __name__ == "__main__":
    main()
