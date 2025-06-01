import hashlib
import json
from datetime import datetime

def generate_user_data(
    username: str,
    password: str,
    email: str,
    salt: str = 'static_salt'
) -> str:
    """
    Generates a dictionary with user data including a hashed password and the current last modified date.

    :param username: The username of the user.
    :param password: The password to be hashed.
    :param email: The email address of the user.
    :param salt: A static salt value for hashing (default is 'static_salt').
    :return: A JSON string with user data.
    """
    # Match JS's new Date().toISOString() format (with milliseconds)
    last_modified_date: str = datetime.utcnow().isoformat(timespec="milliseconds") + "Z"

    to_hash: str = salt + password + last_modified_date
    hash_hex: str = hashlib.sha1(to_hash.encode('utf-8')).hexdigest()

    user_data: dict[str, dict[str, str]] = {
        username: {
            "password": hash_hex,
            "email": email,
            "last_modified_date": last_modified_date
        }
    }

    return json.dumps(user_data, indent=2)

# Example usage:
# user_json = generate_user_data('testuser', 'newpassword123', 'testuser@example.com')
# print(user_json)
