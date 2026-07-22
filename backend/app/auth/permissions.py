from fastapi import Depends, HTTPException, status

from app.auth.dependencies import get_current_user


def require_roles(allowed_roles: list[str]):

    def role_checker(current_user=Depends(get_current_user)):

        # Normalize to uppercase for case-insensitive comparison
        # (UserCreate defaults to "viewer" lowercase, but checks use "VIEWER" uppercase)
        user_role_upper = current_user.role.upper()
        allowed_upper = [r.upper() for r in allowed_roles]

        if user_role_upper not in allowed_upper:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )

        return current_user

    return role_checker